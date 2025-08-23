import { useState, useEffect, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AmbulanceSection = () => {
    const { aToken, backendUrl } = useContext(AdminContext);
    const [ambulances, setAmbulances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAmbulance, setSelectedAmbulance] = useState(null);
    const [stats, setStats] = useState({
        totalAmbulances: 0,
        activeAmbulances: 0,
        availableAmbulances: 0,
        onCallAmbulances: 0
    });

    const [formData, setFormData] = useState({
        driverName: '',
        driverMobile: '',
        vehicleNumber: '',
        vehicleType: 'Basic Life Support',
        currentLocation: { lat: null, lng: null },
        currentAddress: ''
    });

    // Fetch ambulances
    const fetchAmbulances = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/api/ambulance`, {
                headers: { aToken }
            });

            if (response.data.success) {
                setAmbulances(response.data.ambulances);
            } else {
                toast.error(response.data.message || 'Failed to fetch ambulances');
            }
        } catch (error) {
            console.error('Error fetching ambulances:', error);
            toast.error('Failed to fetch ambulances');
        } finally {
            setLoading(false);
        }
    };

    // Fetch ambulance statistics
    const fetchStats = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/ambulance/stats`, {
                headers: { aToken }
            });

            if (response.data.success) {
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    useEffect(() => {
        fetchAmbulances();
        fetchStats();
    }, []);

    // Filter ambulances based on active tab
    const filteredAmbulances = ambulances.filter(ambulance => {
        if (activeTab === 'active') {
            return ambulance.status === 'Active';
        } else {
            return ambulance.status === 'Inactive' || ambulance.status === 'Maintenance';
        }
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission for adding ambulance
    const handleAddAmbulance = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(`${backendUrl}/api/ambulance`, formData, {
                headers: { aToken }
            });

            if (response.data.success) {
                toast.success('Ambulance added successfully');
                setShowAddModal(false);
                setFormData({
                    driverName: '',
                    driverMobile: '',
                    vehicleNumber: '',
                    vehicleType: 'Basic Life Support',
                    currentLocation: undefined,
                    currentAddress: ''
                });
                fetchAmbulances();
                fetchStats();
            } else {
                toast.error(response.data.message || 'Failed to add ambulance');
            }
        } catch (error) {
            console.error('Error adding ambulance:', error);
            toast.error(error.response?.data?.message || 'Failed to add ambulance');
        }
    };

    // Handle status update
    const handleStatusUpdate = async (ambulanceId, newStatus) => {
        try {
            const response = await axios.put(`${backendUrl}/api/ambulance/${ambulanceId}/status`, 
                { status: newStatus }, 
                { headers: { aToken } }
            );

            if (response.data.success) {
                toast.success('Ambulance status updated successfully');
                fetchAmbulances();
                fetchStats();
            } else {
                toast.error(response.data.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    // Handle delete ambulance
    const handleDeleteAmbulance = async (ambulanceId) => {
        if (!window.confirm('Are you sure you want to delete this ambulance?')) {
            return;
        }

        try {
            const response = await axios.delete(`${backendUrl}/api/ambulance/${ambulanceId}`, {
                headers: { aToken }
            });

            if (response.data.success) {
                toast.success('Ambulance deleted successfully');
                fetchAmbulances();
                fetchStats();
            } else {
                toast.error(response.data.message || 'Failed to delete ambulance');
            }
        } catch (error) {
            console.error('Error deleting ambulance:', error);
            toast.error('Failed to delete ambulance');
        }
    };

    // Get status badge color
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Inactive':
                return 'bg-gray-100 text-gray-800';
            case 'On Call':
                return 'bg-blue-100 text-blue-800';
            case 'Maintenance':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get availability badge color
    const getAvailabilityBadgeColor = (isAvailable) => {
        return isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#193378]"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Ambulance Management</h1>
                <p className="text-gray-600">Manage ambulance fleet and monitor emergency responses</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Ambulances</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalAmbulances}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Active Ambulances</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.activeAmbulances}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Available</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.availableAmbulances}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">On Call</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.onCallAmbulances}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs and Add Button */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === 'active' 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Active Ambulances
                    </button>
                    <button
                        onClick={() => setActiveTab('inactive')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === 'inactive' 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Inactive Ambulances
                    </button>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#193378] text-white px-4 py-2 rounded-md hover:bg-[#152a5e] transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Ambulance
                </button>
            </div>

            {/* Ambulances Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Driver
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vehicle
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Availability
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAmbulances.map((ambulance) => (
                                <tr key={ambulance._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {ambulance.driverName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {ambulance.driverMobile}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {ambulance.vehicleNumber}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {ambulance.vehicleType}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(ambulance.status)}`}>
                                            {ambulance.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAvailabilityBadgeColor(ambulance.isAvailable)}`}>
                                            {ambulance.isAvailable ? 'Available' : 'Unavailable'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {ambulance.currentAddress || 'Not set'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <select
                                                value={ambulance.status}
                                                onChange={(e) => handleStatusUpdate(ambulance._id, e.target.value)}
                                                className="text-xs border border-gray-300 rounded px-2 py-1"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                                <option value="On Call">On Call</option>
                                                <option value="Maintenance">Maintenance</option>
                                            </select>
                                            <button
                                                onClick={() => handleDeleteAmbulance(ambulance._id)}
                                                className="text-red-600 hover:text-red-900 text-xs"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredAmbulances.length === 0 && (
                    <div className="text-center py-8">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No ambulances</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {activeTab === 'active' ? 'No active ambulances found.' : 'No inactive ambulances found.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Add Ambulance Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Add New Ambulance</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <form onSubmit={handleAddAmbulance} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Driver Name</label>
                                    <input
                                        type="text"
                                        name="driverName"
                                        value={formData.driverName}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#193378] focus:border-transparent"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Driver Mobile</label>
                                    <input
                                        type="tel"
                                        name="driverMobile"
                                        value={formData.driverMobile}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#193378] focus:border-transparent"
                                        maxLength="10"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
                                    <input
                                        type="text"
                                        name="vehicleNumber"
                                        value={formData.vehicleNumber}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#193378] focus:border-transparent"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                                    <select
                                        name="vehicleType"
                                        value={formData.vehicleType}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#193378] focus:border-transparent"
                                    >
                                        <option value="Basic Life Support">Basic Life Support</option>
                                        <option value="Advanced Life Support">Advanced Life Support</option>
                                        <option value="Cardiac Ambulance">Cardiac Ambulance</option>
                                    </select>
                                </div>
                                
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-[#193378] text-white px-4 py-2 rounded-md hover:bg-[#152a5e] transition-colors"
                                    >
                                        Add Ambulance
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AmbulanceSection;
