import React, { useContext } from 'react'
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import Login from './pages/Login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import Feedbacks from './pages/Admin/Feedbacks';
import AmbulanceSection from './pages/Admin/AmbulanceSection';
import HealthLockAccess from './pages/Doctor/HealthLockAccess';
import Chatbot from './components/Chatbot';
import DoctorChatbot from './components/DoctorChatbot';

const App = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  return dToken || aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorsList />} />
          <Route path='/feedbacks' element={<Feedbacks />} />
          <Route path='/ambulance-section' element={<AmbulanceSection />} />
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointments />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
          <Route path='/doctor-healthlock' element={<HealthLockAccess />} />
        </Routes>
      </div>
      
      {/* AI Chatbot - Available on all admin pages */}
      <Chatbot />
      
      {/* Doctor Chatbot - Available on doctor pages */}
      <DoctorChatbot />
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App