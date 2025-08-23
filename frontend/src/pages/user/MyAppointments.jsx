import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyAppointments = () => {
    const { token } = useContext(AppContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/user/appointments', {
                headers: { token: token }
            });

            if (response.data.success) {
                setAppointments(response.data.appointments);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
            confirmed: { color: 'bg-green-100 text-green-800', text: 'Confirmed' },
            completed: { color: 'bg-blue-100 text-blue-800', text: 'Completed' },
            cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
                            <p className="text-gray-600 mt-1">View and manage your appointments</p>
                        </div>
                        <div className="text-sm text-gray-500">
                            Total: {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                </div>

                {/* Appointments List */}
                <div className="p-6">
                    {appointments.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by booking your first appointment.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {appointments.map((appointment) => (
                                <div key={appointment._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4">
                                            {/* Doctor Image */}
                                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                                {appointment.doctorId?.imageUrl ? (
                                                    <img
                                                        src={appointment.doctorId.imageUrl}
                                                        alt={appointment.doctorId.name}
                                                        className="w-16 h-16 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                )}
                                            </div>

                                            {/* Appointment Details */}
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Dr. {appointment.doctorId?.name || 'Unknown Doctor'}
                                                    </h3>
                                                    {getStatusBadge(appointment.status)}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                                    <div>
                                                        <span className="font-medium">Patient:</span> {appointment.patientName}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Age:</span> {appointment.age} years
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Gender:</span> {appointment.gender}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Specialist:</span> {appointment.doctorId?.specialistType || 'N/A'}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Disease:</span> {appointment.disease}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Date:</span> {formatDate(appointment.date)}
                                                    </div>
                                                    {appointment.insurance && (
                                                        <div>
                                                            <span className="font-medium">Insurance:</span> {appointment.insurance}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-3 text-xs text-gray-500">
                                                    Booked on: {formatDate(appointment.createdAt)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col space-y-2">
                                            {appointment.status === 'pending' && (
                                                <button
                                                    className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                                    onClick={() => {
                                                        // TODO: Implement cancel appointment functionality
                                                        toast.info('Cancel functionality coming soon');
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyAppointments;
