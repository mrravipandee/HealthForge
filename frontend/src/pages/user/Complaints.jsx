import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Complaints = () => {
    const { token, userData } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const [formData, setFormData] = useState({
        name: userData?.name || '',
        subject: '',
        description: ''
    });

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/user/complaints', {
                headers: { token: token }
            });

            if (response.data.success) {
                setComplaints(response.data.complaints);
            }
        } catch (error) {
            console.error('Error fetching complaints:', error);
            toast.error('Failed to load complaints');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.subject || !formData.description) {
            toast.error('Please fill all required fields');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/api/user/complaints', formData, {
                headers: { token: token }
            });

            if (response.data.success) {
                toast.success('Complaint submitted successfully!');
                setFormData(prev => ({
                    ...prev,
                    subject: '',
                    description: ''
                }));
                fetchComplaints(); // Refresh the list
            }
        } catch (error) {
            console.error('Error submitting complaint:', error);
            toast.error(error.response?.data?.message || 'Failed to submit complaint');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Pending': { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
            'In Progress': { color: 'bg-blue-100 text-blue-800', text: 'In Progress' },
            'Resolved': { color: 'bg-green-100 text-green-800', text: 'Resolved' },
            'Closed': { color: 'bg-gray-100 text-gray-800', text: 'Closed' }
        };

        const config = statusConfig[status] || statusConfig['Pending'];
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Complaint Form */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">File a Complaint</h2>
                        <p className="text-gray-600 mt-1">We're here to help resolve your concerns</p>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Brief description of your complaint"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Please provide detailed information about your complaint..."
                                    required
                                />
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="text-sm text-blue-700">
                                        <p className="font-medium">What happens next?</p>
                                        <ul className="mt-1 space-y-1">
                                            <li>• Your complaint will be reviewed by our support team</li>
                                            <li>• We'll respond within 24-48 hours</li>
                                            <li>• You'll receive updates on the status</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Submit Complaint'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Complaints History */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Your Complaints</h2>
                        <p className="text-gray-600 mt-1">Track the status of your complaints</p>
                    </div>

                    <div className="p-6">
                        {complaints.length === 0 ? (
                            <div className="text-center py-8">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No complaints yet</h3>
                                <p className="mt-1 text-sm text-gray-500">File your first complaint to see it here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {complaints.map((complaint) => (
                                    <div key={complaint._id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                <h3 className="font-medium text-gray-900">{complaint.subject}</h3>
                                                {getStatusBadge(complaint.status)}
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {formatDate(complaint.createdAt)}
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm text-gray-600 mb-3">{complaint.description}</p>
                                        
                                        {complaint.adminResponse && (
                                            <div className="bg-gray-50 border-l-4 border-blue-500 p-3 rounded">
                                                <p className="text-xs font-medium text-gray-700 mb-1">Admin Response:</p>
                                                <p className="text-sm text-gray-600">{complaint.adminResponse}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Complaints;
