import axios from "axios";
import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";


export const AdminContext = createContext()

// Custom hook to use AdminContext
export const useAdminContext = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdminContext must be used within an AdminContextProvider');
    }
    return context;
};

const AdminContextProvider = (props) => {

    const backendUrl = 'http://localhost:3000' // Force correct backend URL

    // Debug: Log backend URL and test connection
    useEffect(() => {
        console.log('AdminContext - Backend URL:', backendUrl);
        console.log('AdminContext - VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);
        console.log('AdminContext - All env vars:', import.meta.env);
        
        // Test backend connection
        const testConnection = async () => {
            try {
                const response = await axios.get(backendUrl + '/');
                console.log('Backend connection test successful:', response.data);
            } catch (error) {
                console.error('Backend connection test failed:', error);
                toast.error('Cannot connect to backend server. Please ensure it is running on ' + backendUrl);
            }
        };
        
        testConnection();
    }, [backendUrl]);

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')

    const [appointments, setAppointments] = useState([])
    const [doctors, setDoctors] = useState([])
    const [dashData, setDashData] = useState(false)

    // Getting all Doctors data from Database using API
    const getAllDoctors = async () => {
        try {
            console.log('Fetching doctors from:', backendUrl + '/api/admin/all-doctors');
            const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { 
                headers: { aToken: aToken } 
            })
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('getAllDoctors error:', error);
            if (error.code === 'ERR_NETWORK') {
                toast.error('Cannot connect to server. Please check if backend is running.');
            } else {
                toast.error(error.message || 'Failed to fetch doctors')
            }
        }
    }

    // Function to change doctor availablity using API
    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', 
                { docId }, 
                { headers: { aToken: aToken } }
            )
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    // Getting all appointment data from Database using API
    const getAllAppointments = async () => {
        try {
            console.log('Fetching appointments from:', backendUrl + '/api/admin/appointments');
            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { 
                headers: { aToken: aToken } 
            })
            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('getAllAppointments error:', error);
            if (error.code === 'ERR_NETWORK') {
                toast.error('Cannot connect to server. Please check if backend is running.');
            } else {
                toast.error(error.message || 'Failed to fetch appointments')
            }
        }
    }

    // Function to cancel appointment using API
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', 
                { appointmentId }, 
                { headers: { aToken: aToken } }
            )
            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        try {
            console.log('Fetching dashboard data from:', backendUrl + '/api/admin/dashboard');
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { 
                headers: { aToken: aToken } 
            })
            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('getDashData error:', error);
            if (error.code === 'ERR_NETWORK') {
                toast.error('Cannot connect to server. Please check if backend is running.');
            } else {
                toast.error(error.message || 'Failed to fetch dashboard data')
            }
        }
    }

    // Function to add a new doctor using API
    const addDoctor = async (formData) => {
        try {
            console.log('Making API call to add doctor');
            console.log('Current aToken:', aToken);
            console.log('Token length:', aToken ? aToken.length : 0);
            console.log('Headers:', { aToken, 'Content-Type': 'multipart/form-data' });
            
            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { 
                headers: { 
                    aToken: aToken,
                    'Content-Type': 'multipart/form-data'
                } 
            })
            
            console.log('API response:', data);
            
            if (data.success) {
                toast.success(data.message)
                getAllDoctors() // Refresh the doctors list
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            console.log('Error in addDoctor:', error)
            console.log('Error response:', error.response?.data)
            toast.error(error.message)
            return false
        }
    }

    // Feedback management functions
    const getAllFeedbacks = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/feedback/feedbacks', { 
                headers: { aToken: aToken } 
            })
            if (data.success) {
                return data.feedbacks
            } else {
                toast.error(data.message)
                return []
            }
        } catch (error) {
            console.error('getAllFeedbacks error:', error);
            toast.error('Failed to fetch feedbacks')
            return []
        }
    }

    const deleteFeedback = async (feedbackId) => {
        try {
            const { data } = await axios.delete(backendUrl + '/api/feedback/feedbacks/' + feedbackId, { 
                headers: { aToken: aToken } 
            })
            if (data.success) {
                toast.success(data.message)
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            console.error('deleteFeedback error:', error);
            toast.error('Failed to delete feedback')
            return false
        }
    }

    // Emergency management functions
    const getAllEmergencies = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/emergency/emergencies', { 
                headers: { aToken: aToken } 
            })
            if (data.success) {
                return data.emergencies
            } else {
                toast.error(data.message)
                return []
            }
        } catch (error) {
            console.error('getAllEmergencies error:', error);
            toast.error('Failed to fetch emergencies')
            return []
        }
    }

    const updateEmergencyStatus = async (emergencyId, status) => {
        try {
            const { data } = await axios.put(backendUrl + '/api/emergency/emergencies/' + emergencyId + '/status', 
                { status }, 
                { headers: { aToken: aToken } }
            )
            if (data.success) {
                toast.success(data.message)
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            console.error('updateEmergencyStatus error:', error);
            toast.error('Failed to update emergency status')
            return false
        }
    }

    // Ambulance management functions
    const getAllAmbulances = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/ambulance', { 
                headers: { aToken: aToken } 
            })
            if (data.success) {
                return data.ambulances
            } else {
                toast.error(data.message)
                return []
            }
        } catch (error) {
            console.error('getAllAmbulances error:', error);
            toast.error('Failed to fetch ambulances')
            return []
        }
    }

    const addAmbulance = async (ambulanceData) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/ambulance', ambulanceData, { 
                headers: { aToken: aToken } 
            })
            if (data.success) {
                toast.success(data.message)
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            console.error('addAmbulance error:', error);
            toast.error('Failed to add ambulance')
            return false
        }
    }

    const updateAmbulanceStatus = async (ambulanceId, status) => {
        try {
            const { data } = await axios.put(backendUrl + '/api/ambulance/' + ambulanceId + '/status', 
                { status }, 
                { headers: { aToken: aToken } }
            )
            if (data.success) {
                toast.success(data.message)
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            console.error('updateAmbulanceStatus error:', error);
            toast.error('Failed to update ambulance status')
            return false
        }
    }

    const deleteAmbulance = async (ambulanceId) => {
        try {
            const { data } = await axios.delete(backendUrl + '/api/ambulance/' + ambulanceId, { 
                headers: { aToken: aToken } 
            })
            if (data.success) {
                toast.success(data.message)
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            console.error('deleteAmbulance error:', error);
            toast.error('Failed to delete ambulance')
            return false
        }
    }

    // Update doctor function
    const updateDoctor = async (doctorId, updateData) => {
        try {
            const headers = { aToken: aToken }
            
            // If updateData is FormData (has image), don't set Content-Type
            if (!(updateData instanceof FormData)) {
                headers['Content-Type'] = 'application/json'
            }
            
            const { data } = await axios.put(backendUrl + '/api/admin/doctors/' + doctorId, updateData, { 
                headers: headers
            })
            if (data.success) {
                toast.success(data.message)
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            console.error('updateDoctor error:', error);
            toast.error('Failed to update doctor')
            return false
        }
    }

    // Delete doctor function
    const deleteDoctor = async (doctorId) => {
        try {
            const { data } = await axios.delete(backendUrl + '/api/admin/doctors/' + doctorId, { 
                headers: { aToken: aToken } 
            })
            if (data.success) {
                toast.success(data.message)
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            console.error('deleteDoctor error:', error);
            toast.error('Failed to delete doctor')
            return false
        }
    }

    const value = {
        aToken, setAToken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        getAllAppointments,
        getDashData,
        cancelAppointment,
        dashData,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        getAllFeedbacks,
        deleteFeedback,
        getAllEmergencies,
        updateEmergencyStatus,
        getAllAmbulances,
        addAmbulance,
        updateAmbulanceStatus,
        deleteAmbulance
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider