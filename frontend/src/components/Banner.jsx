import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const Banner = () => {
    const navigate = useNavigate()
    const { token } = useContext(AppContext)

    const handleCreateAccount = () => {
        if (token) {
            navigate('/dashboard')
        } else {
            navigate('/login')
        }
        scrollTo(0, 0)
    }

    return (
        <div className='relative flex flex-col md:flex-row bg-gradient-to-r from-[#193378]/80 to-blue-500 rounded-xl px-6 sm:px-10 md:px-14 lg:px-16 my-16 md:my-20 mx-4 md:mx-10 overflow-hidden shadow-xl'>
            
            {/* Background decorative elements */}
            <div className='absolute top-0 left-0 w-full h-full opacity-5'>
                <div className='absolute top-10 left-10 w-20 h-20 rounded-full bg-white'></div>
                <div className='absolute bottom-5 right-16 w-16 h-16 rounded-full bg-white'></div>
                <div className='absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-white'></div>
            </div>
            
            {/* Left Side - Content */}
            <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-20 z-10'>
                <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white'>
                    <p>Book Appointment With</p>
                    <p className='mt-2 bg-clip-text text-[#193378]'>100+ Trusted Doctors</p>
                </div>
                
                <p className='text-white/90 mt-4 text-sm sm:text-base md:text-lg max-w-md'>
                    Connect with experienced healthcare professionals for personalized care and treatment plans.
                </p>
                
                <div className='flex flex-col sm:flex-row gap-4 mt-8'>
                    <button 
                        onClick={handleCreateAccount} 
                        className='bg-white text-sm sm:text-base text-primary px-6 py-3 rounded-full font-medium hover:scale-105 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2'
                    >
                        <span>{token ? 'Go to Dashboard' : 'Create Account'}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    
                    <button 
                        onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} 
                        className='border-2 border-white text-sm sm:text-base text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2'
                    >
                        <span>Find Doctors</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                
            </div>

            {/* Right Side - Image */}
            <div className='hidden md:flex md:w-2/5 lg:w-2/5 relative justify-center items-end'>
                <img 
                    className='w-full max-w-md object-contain relative z-10' 
                    src={assets.appointment_img} 
                    alt="Doctor with patient" 
                />
                
                {/* Floating stats elements */}
                <div className='absolute top-10 right-0 bg-white rounded-xl p-3 shadow-lg z-20'>
                    <div className='text-[#193378] font-bold text-lg'>24/7</div>
                    <div className='text-gray-600 text-xs'>Available</div>
                </div>
                
            </div>
        </div>
    )
}

export default Banner