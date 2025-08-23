import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EmergencySubmitted = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Auto-redirect to home after 10 seconds
        const timer = setTimeout(() => {
            navigate('/');
        }, 10000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    {/* Success Icon */}
                    <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
                        <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Emergency Reported Successfully!
                    </h1>
                    
                    <p className="text-lg text-gray-600 mb-8">
                        🚑 An ambulance has been dispatched and is on the way to your location.
                    </p>

                    {/* Status Information */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Emergency Response Team</p>
                                    <p className="text-sm text-gray-500">Nearest ambulance dispatched</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Contact Information</p>
                                    <p className="text-sm text-gray-500">You will receive updates via SMS</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Estimated Arrival</p>
                                    <p className="text-sm text-gray-500">Calculating best route...</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Important Instructions */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                        <h3 className="font-semibold text-red-800 mb-2">🚨 Important:</h3>
                        <ul className="text-sm text-red-700 space-y-1">
                            <li>• Stay at the emergency location</li>
                            <li>• Keep the patient comfortable and safe</li>
                            <li>• Clear the area for ambulance access</li>
                            <li>• Keep your phone accessible</li>
                            <li>• Follow any instructions from emergency services</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            Return to Home
                        </button>
                        
                        <button
                            onClick={() => navigate('/emergency')}
                            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        >
                            Report Another Emergency
                        </button>
                    </div>

                    {/* Auto-redirect notice */}
                    <p className="text-xs text-gray-500 mt-4">
                        You will be automatically redirected to the home page in 10 seconds...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EmergencySubmitted;
