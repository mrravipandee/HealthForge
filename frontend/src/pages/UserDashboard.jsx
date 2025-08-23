import { useState, useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Sidebar from '../components/UserSidebar';

const UserDashboard = () => {
    const { token, userData } = useContext(AppContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Redirect to login if not authenticated
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between px-4 py-4">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div className="ml-2 lg:ml-0">
                                <h1 className="text-xl font-semibold text-gray-900 text-[22px]">User's Dashboard</h1>
                                <p className="text-sm text-gray-500 text-[18px]">Welcome back, {userData?.name || 'User'}!</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:block text-sm text-gray-600">
                                <p className="font-medium">{userData?.name || 'User'}</p>
                                <p className="text-xs">{userData?.email || 'user@example.com'}</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg">
                                {userData?.name?.charAt(0) || 'U'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 lg:p-6">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserDashboard;
