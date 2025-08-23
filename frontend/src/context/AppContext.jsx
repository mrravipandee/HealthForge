import { createContext, useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const AppContext = createContext()

// Custom hook to use AppContext
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};

const AppContextProvider = (props) => {

    const navigate = useNavigate()
    const currencySymbol = '₹'
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    const [userData, setUserData] = useState(false)

    // Getting Doctors using API
    const getDoctosData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Getting User Profile using API
    const loadUserProfileData = async () => {

        if (!token) {
            console.log('No token available, skipping profile load')
            return
        }

        try {

            const { data } = await axios.get(backendUrl + '/api/user/profile', { headers: { token } })

            if (data.success) {
                setUserData(data.user)
            } else {
                console.log('Profile load failed:', data.message)
                // Don't show error toast for profile load failures
            }

        } catch (error) {
            console.log('Profile load error:', error.message)
            // Don't show error toast for profile load failures
        }

    }

    useEffect(() => {
        getDoctosData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
    }, [token])

    const logout = () => {
        localStorage.removeItem('token')
        setToken('')
        setUserData(false)
        navigate('/login')
    }

    const value = {
        doctors, getDoctosData,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData, logout
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider