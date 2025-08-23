import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const DashboardOverview = () => {
    const { userData } = useContext(AppContext);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    const quickActions = [
        {
            title: "Book Appointment",
            description: "Schedule a new appointment with a doctor",
            path: "/dashboard/book-appointment",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            color: "bg-blue-500 hover:bg-blue-600"
        },
        {
            title: "My Appointments",
            description: "View and manage your appointments",
            path: "/dashboard/my-appointments",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            color: "bg-green-500 hover:bg-green-600"
        },
        {
            title: "Emergency",
            description: "Get immediate medical assistance",
            path: "/emergency",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            ),
            color: "bg-red-500 hover:bg-red-600"
        },
        {
            title: "My Profile",
            description: "Update your personal information",
            path: "/profile",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            color: "bg-purple-500 hover:bg-purple-600"
        }
    ];

    const healthTips = [
        { title: "Stay Hydrated", text: "Drink at least 8 glasses of water daily.", color: "blue" },
        { title: "Regular Exercise", text: "Do 30 minutes of exercise most days.", color: "green" },
        { title: "Healthy Diet", text: "Eat fruits, veggies, and whole grains daily.", color: "yellow" },
        { title: "Check-ups", text: "Schedule regular health check-ups.", color: "purple" },
    ];

    return (
        <div className="space-y-6 p-6">
            {/* Welcome Section */}
            <div className="bg-white py-8 px-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {userData?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {getGreeting()}, {userData?.name || "User"} 👋
                        </h1>
                        <p className="text-gray-600 text-[16px]">
                            Manage your appointments and take charge of your health
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-blue-50 rounded-lg shadow-sm">
                    <p className="text-blue-900 font-semibold">Upcoming Appointments</p>
                    <h2 className="text-2xl font-bold text-blue-700">3</h2>
                </div>
                <div className="p-6 bg-green-50 rounded-lg shadow-sm">
                    <p className="text-green-900 font-semibold">Completed</p>
                    <h2 className="text-2xl font-bold text-green-700">12</h2>
                </div>
                <div className="p-6 bg-purple-50 rounded-lg shadow-sm">
                    <p className="text-purple-900 font-semibold">Doctors Consulted</p>
                    <h2 className="text-2xl font-bold text-purple-700">5</h2>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <NavLink
                            key={action.title}
                            to={action.path}
                            className="block p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-lg text-white ${action.color}`}>
                                    {action.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-[18px]">{action.title}</h3>
                                    <p className="text-[14px] text-gray-600">{action.description}</p>
                                </div>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </div>

            {/* Health Tips */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Health Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {healthTips.map((tip) => (
                        <div key={tip.title} className={`p-4 bg-${tip.color}-50 rounded-lg`}>
                            <h3 className={`font-semibold text-${tip.color}-900 mb-2 text-[18px]`}>
                                {tip.title}
                            </h3>
                            <p className={`text-${tip.color}-700 text-[14px]`}>
                                {tip.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
