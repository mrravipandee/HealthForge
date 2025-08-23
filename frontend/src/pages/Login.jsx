import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true)

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Account created successfully!')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Logged in successfully!')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/dashboard')
    }
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full flex bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left side - Image */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-primary to-primary-dark relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/20"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12 z-10">
            <h2 className="text-3xl font-bold mb-4">Welcome to HealthForge</h2>
            <p className="text-lg text-center">
              {state === 'Sign Up' 
                ? 'Join thousands of patients who trust our healthcare platform for their medical needs.' 
                : 'Access your account to book appointments with trusted healthcare professionals.'}
            </p>
            <div className="mt-10 flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-white">4.9/5</span>
            </div>
            <p className="mt-2 text-sm">Rated by 5000+ patients</p>
          </div>
          {/* Decorative medical icon */}
          <div className="absolute bottom-10 left-10 opacity-20">
            <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 py-10 px-8 sm:px-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600 mt-2">
              {state === 'Sign Up' 
                ? 'Create your account to get started' 
                : 'Sign in to continue your healthcare journey'}
            </p>
          </div>

          <form onSubmit={onSubmitHandler} className="space-y-6">
            {state === 'Sign Up' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input 
                    id="name"
                    onChange={(e) => setName(e.target.value)} 
                    value={name} 
                    className="border border-gray-300 rounded-lg w-full p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                    type="text" 
                    required 
                    placeholder="Enter your full name"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input 
                  id="email"
                  onChange={(e) => setEmail(e.target.value)} 
                  value={email} 
                  className="border border-gray-300 rounded-lg w-full p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                  type="email" 
                  required 
                  placeholder="your.email@example.com"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input 
                  id="password"
                  onChange={(e) => setPassword(e.target.value)} 
                  value={password} 
                  className="border border-gray-300 rounded-lg w-full p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                  type="password" 
                  required 
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {state === 'Sign Up' ? 'Creating Account...' : 'Logging in...'}
                </>
              ) : (
                <>
                  {state === 'Sign Up' ? 'Create Account' : 'Login'}
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            {state === 'Sign Up' ? (
              <p className="text-gray-600">
                Already have an account?{' '}
                <button 
                  type="button" 
                  onClick={() => setState('Login')} 
                  className="text-primary font-medium hover:underline focus:outline-none"
                >
                  Login here
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Don&apos;t have an account?{' '}
                <button 
                  type="button" 
                  onClick={() => setState('Sign Up')} 
                  className="text-primary font-medium hover:underline focus:outline-none"
                >
                  Create one now
                </button>
              </p>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              By continuing, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login