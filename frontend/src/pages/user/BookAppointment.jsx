import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const BookAppointment = () => {
    const { backendUrl, token } = useContext(AppContext);
    
    // State management
    const [specializations, setSpecializations] = useState([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Get available specializations
    const fetchSpecializations = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/doctor/specializations`);
            if (response.data.success) {
                setSpecializations(response.data.specializations);
            }
        } catch (error) {
            console.error('Error fetching specializations:', error);
            toast.error('Failed to load specializations');
        }
    };

    // Get doctors by specialization
    const fetchDoctorsBySpecialization = async (specialization) => {
        if (!specialization) return;
        
        setLoadingDoctors(true);
        try {
            const response = await axios.get(`${backendUrl}/api/doctor/by-specialization/${specialization}`);
            if (response.data.success) {
                setDoctors(response.data.doctors);
            } else {
                toast.error(response.data.message || 'Failed to fetch doctors');
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
            toast.error('Failed to load doctors');
        } finally {
            setLoadingDoctors(false);
        }
    };

    // Get available slots for selected doctor
    const fetchAvailableSlots = async (doctorId, date) => {
        if (!doctorId || !date) return;
        
        setLoadingSlots(true);
        try {
            const response = await axios.get(`${backendUrl}/api/doctor/${doctorId}/slots`, {
                params: { date }
            });
            if (response.data.success) {
                setAvailableSlots(response.data.slots);
            } else {
                toast.error(response.data.message || 'Failed to fetch available slots');
            }
        } catch (error) {
            console.error('Error fetching slots:', error);
            toast.error('Failed to load available slots');
        } finally {
            setLoadingSlots(false);
        }
    };

    // Book appointment
    const handleBookAppointment = async () => {
        if (!selectedDoctor || !selectedDate || !selectedTime) {
            toast.error('Please select doctor, date, and time');
            return;
        }

        setLoading(true);
        try {
            const appointmentData = {
                doctorId: selectedDoctor._id,
                date: selectedDate,
                time: selectedTime,
                speciality: selectedDoctor.speciality
            };

            const response = await axios.post(`${backendUrl}/api/user/book-appointment`, appointmentData, {
                headers: { token }
            });

            if (response.data.success) {
                toast.success('Appointment booked successfully!');
                // Reset form
                setSelectedDoctor(null);
                setSelectedDate('');
                setSelectedTime('');
                setAvailableSlots([]);
            } else {
                toast.error(response.data.message || 'Failed to book appointment');
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            toast.error('Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    // Handle specialization change
    const handleSpecializationChange = (e) => {
        const specialization = e.target.value;
        setSelectedSpecialization(specialization);
        setSelectedDoctor(null);
        setSelectedDate('');
        setSelectedTime('');
        setAvailableSlots([]);
        
        if (specialization) {
            fetchDoctorsBySpecialization(specialization);
        } else {
            setDoctors([]);
        }
    };

    // Handle doctor selection
    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor);
        setSelectedDate('');
        setSelectedTime('');
        setAvailableSlots([]);
    };

    // Handle date selection
    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedTime('');
        if (selectedDoctor) {
            fetchAvailableSlots(selectedDoctor._id, date);
        }
    };

    // Generate next 7 days
    const generateNextDays = () => {
        const days = [];
        const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            days.push({
                date: date.toISOString().split('T')[0],
                day: dayNames[date.getDay()],
                dayNumber: date.getDate()
            });
        }
        return days;
    };

    useEffect(() => {
        fetchSpecializations();
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
                <p className="text-gray-600">Select a specialist and book your appointment with our qualified doctors.</p>
            </div>

            {/* Specialist Selection */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Step 1: Select Specialist</h2>
                <div className="max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Choose Specialization
                    </label>
                    <select
                        value={selectedSpecialization}
                        onChange={handleSpecializationChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select a specialization</option>
                        {specializations.map((spec, index) => (
                            <option key={index} value={spec}>
                                {spec}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Doctors List */}
            {selectedSpecialization && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Step 2: Select Doctor ({doctors.length} available)
                    </h2>
                    
                    {loadingDoctors ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : doctors.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {doctors.map((doctor) => (
                                <div
                                    key={doctor._id}
                                    onClick={() => handleDoctorSelect(doctor)}
                                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-lg ${
                                        selectedDoctor?._id === doctor._id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300'
                                    }`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={doctor.image || '/default-doctor.png'}
                                                alt={doctor.name}
                                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2">
                                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                    {doctor.name}
                                                </h3>
                                                {doctor.verified && (
                                                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">{doctor.speciality}</p>
                                            <p className="text-sm text-gray-500">{doctor.experience} experience</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-lg font-bold text-blue-600">₹{doctor.fees}</span>
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    doctor.available 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {doctor.available ? 'Available' : 'Unavailable'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                No doctors available for {selectedSpecialization} specialization.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Date and Time Selection */}
            {selectedDoctor && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Step 3: Select Date & Time
                    </h2>
                    
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Available Dates</h3>
                        <div className="flex space-x-3 overflow-x-auto pb-2">
                            {generateNextDays().map((day) => (
                                <button
                                    key={day.date}
                                    onClick={() => handleDateSelect(day.date)}
                                    className={`flex-shrink-0 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                                        selectedDate === day.date
                                            ? 'border-blue-500 bg-blue-500 text-white'
                                            : 'border-gray-300 hover:border-blue-300'
                                    }`}
                                >
                                    <div className="text-center">
                                        <div className="text-sm font-medium">{day.day}</div>
                                        <div className="text-lg font-bold">{day.dayNumber}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedDate && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Available Time Slots</h3>
                            {loadingSlots ? (
                                <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                </div>
                            ) : availableSlots.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {availableSlots.map((slot) => (
                                        <button
                                            key={slot}
                                            onClick={() => setSelectedTime(slot)}
                                            className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                                                selectedTime === slot
                                                    ? 'border-blue-500 bg-blue-500 text-white'
                                                    : 'border-gray-300 hover:border-blue-300'
                                            }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No available slots for selected date.</p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Booking Summary and Submit */}
            {selectedDoctor && selectedDate && selectedTime && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Doctor</h4>
                                <p className="text-lg font-semibold text-gray-900">{selectedDoctor.name}</p>
                                <p className="text-sm text-gray-600">{selectedDoctor.speciality}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Date</h4>
                                <p className="text-lg font-semibold text-gray-900">
                                    {new Date(selectedDate).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Time</h4>
                                <p className="text-lg font-semibold text-gray-900">{selectedTime}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-medium text-gray-900">Appointment Fee:</span>
                                <span className="text-2xl font-bold text-blue-600">₹{selectedDoctor.fees}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleBookAppointment}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Booking Appointment...
                            </div>
                        ) : (
                            'Confirm Booking'
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default BookAppointment;
