import axios from "axios";
import { useContext, useState } from "react";
import { DoctorContext } from "../context/DoctorContext";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Choose");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const backendUrl = "http://localhost:3000";

  const { setDToken } = useContext(DoctorContext);
  const { setAToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });
        if (data.success) {
          setAToken(data.token);
          localStorage.setItem("aToken", data.token);
          toast.success("Admin login successful!");
        } else {
          toast.error(data.message);
        }
      } else if (state === "Doctor") {
        const { data } = await axios.post(backendUrl + "/api/doctor/login", {
          email,
          password,
        });
        if (data.success) {
          setDToken(data.token);
          localStorage.setItem("dToken", data.token);
          toast.success("Doctor login successful!");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          {state === "Choose" ? (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 mb-8">
                Please select your login type to continue
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={() => setState("Admin")}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Admin Login
                </button>
                
                <button
                  onClick={() => setState("Doctor")}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  Doctor Login
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center mb-2">
                <h2 className="text-3xl font-bold text-gray-800">
                  {state} Login
                </h2>
                <p className="text-gray-600 mt-2">
                  Enter your credentials to access your account
                </p>
              </div>
              
              <form onSubmit={onSubmitHandler} className="mt-8 space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    type="email"
                    placeholder="name@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Sign in
                </button>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    {state === "Admin" ? (
                      <>
                        Are you a Doctor?{" "}
                        <button
                          type="button"
                          onClick={() => setState("Doctor")}
                          className="text-blue-600 hover:text-blue-800 font-medium transition"
                        >
                          Doctor Login
                        </button>
                      </>
                    ) : (
                      <>
                        Are you an Admin?{" "}
                        <button
                          type="button"
                          onClick={() => setState("Admin")}
                          className="text-blue-600 hover:text-blue-800 font-medium transition"
                        >
                          Admin Login
                        </button>
                      </>
                    )}
                  </p>
                  
                  <button
                    type="button"
                    onClick={() => setState("Choose")}
                    className="mt-2 text-sm text-gray-500 hover:text-gray-700 transition"
                  >
                    &larr; Back to selection
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        
        {/* Right side - Logo and Welcome Message */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-100 to-indigo-100 flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-6 p-4 bg-white rounded-full shadow-lg">
            {/* Replace with your actual logo */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">MD</span>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Medical Portal
          </h3>
          <p className="text-gray-600 max-w-md">
            Secure access to medical administration and practitioner resources
          </p>
          
          <div className="mt-8 flex justify-center">
            <div className="bg-white rounded-lg p-4 shadow-md max-w-xs">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-sm text-gray-600">
                  HIPAA compliant secure access
                </p>
              </div>
              
              <div className="flex items-start mt-2">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-sm text-gray-600">
                  Role-based access control
                </p>
              </div>
              
              <div className="flex items-start mt-2">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-sm text-gray-600">
                  Encrypted data transmission
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;