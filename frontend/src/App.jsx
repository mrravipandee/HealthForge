import Navbar from './components/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'
import Emergency from './pages/Emergency'
import EmergencySubmitted from './pages/EmergencySubmitted'
import UserDashboard from './pages/UserDashboard'
import DashboardOverview from './pages/user/DashboardOverview'
import DashboardProfile from './pages/user/MyProfile'
import DashboardBookAppointment from './pages/user/BookAppointment'
import DashboardMyAppointments from './pages/user/MyAppointments'
import DashboardEmergency from './pages/Emergency'
import DashboardFeedback from './pages/user/Feedback'
import DashboardComplaints from './pages/user/Complaints'
import DashboardHealthLock from './pages/user/HealthLock'
import Chatbot from './components/Chatbot'

const App = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <>
      <ToastContainer />
      {!isDashboard && <Navbar />}
      
      {isDashboard ? (
        <Routes>
          <Route path='/dashboard/*' element={<UserDashboard />}>
            <Route index element={<DashboardOverview />} />
            <Route path="profile" element={<DashboardProfile />} />
            <Route path="book-appointment" element={<DashboardBookAppointment />} />
            <Route path="my-appointments" element={<DashboardMyAppointments />} />
            <Route path="emergency" element={<DashboardEmergency />} />
            <Route path="feedback" element={<DashboardFeedback />} />
            <Route path="complaints" element={<DashboardComplaints />} />
            <Route path="healthlock" element={<DashboardHealthLock />} />
          </Route>
        </Routes>
      ) : (
        <div className='mx-4 sm:mx-[10%]'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/doctors' element={<Doctors />} />
            <Route path='/doctors/:speciality' element={<Doctors />} />
            <Route path='/login' element={<Login />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/appointment/:docId' element={<Appointment />} />
            <Route path='/my-appointments' element={<MyAppointments />} />
            <Route path='/my-profile' element={<MyProfile />} />
            <Route path='/verify' element={<Verify />} />
            <Route path='/emergency' element={<Emergency />} />
            <Route path='/emergency-submitted' element={<EmergencySubmitted />} />
          </Routes>
          <Footer />
        </div>
      )}
      
      {/* AI Chatbot - Available on all pages */}
      <Chatbot />
    </>
  )
}

export default App