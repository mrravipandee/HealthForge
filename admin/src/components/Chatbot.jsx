import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [language, setLanguage] = useState('en');
    const [isSpeaking, setIsSpeaking] = useState(false);
    
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const speechRef = useRef(null);

    // HealthForge Admin knowledge base
    const knowledge = {
        en: {
            greetings: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
            welcome: "Hello! Welcome to HealthForge Admin Panel! I'm your AI assistant. I can help you with managing doctors, appointments, feedback, and ambulance services. How can I assist you today?",
            addDoctor: "To add a new doctor:\n1. Click 'Add Doctor' in the sidebar\n2. Fill in all required details\n3. Upload doctor's profile image\n4. Click 'Add Doctor' to save",
            manageDoctors: "To manage doctors:\n1. Click 'Doctors List' in the sidebar\n2. View all registered doctors\n3. Use 'Edit' to modify doctor details\n4. Use 'Delete' to remove doctors",
            appointments: "To view appointments:\n1. Click 'All Appointments' in the sidebar\n2. See all patient appointments\n3. Filter by date, doctor, or status\n4. Manage appointment status",
            feedback: "To view feedback:\n1. Click 'Feedbacks' in the sidebar\n2. See patient reviews and ratings\n3. Analyze feedback trends\n4. Respond to patient concerns",
            ambulance: "To manage ambulance services:\n1. Click 'Ambulance Section' in the sidebar\n2. Add new ambulance vehicles\n3. Track ambulance availability\n4. Manage emergency responses",
            dashboard: "Admin Dashboard features:\n📊 Analytics and statistics\n👨‍⚕️ Doctor management\n📅 Appointment tracking\n⭐ Feedback management\n🚑 Ambulance services",
            default: "I can help you with admin panel features. Please ask me about managing doctors, appointments, feedback, or ambulance services."
        },
        hi: {
            greetings: ['नमस्ते', 'हैलो', 'हाय', 'सुप्रभात', 'शुभ दोपहर', 'शुभ संध्या'],
            welcome: "नमस्ते! HealthForge Admin Panel में आपका स्वागत है! मैं आपका AI सहायक हूं। मैं डॉक्टरों, अपॉइंटमेंट, प्रतिक्रिया और एम्बुलेंस सेवाओं के प्रबंधन में मदद कर सकता हूं।",
            addDoctor: "नया डॉक्टर जोड़ने के लिए:\n1. साइडबार में 'Add Doctor' पर क्लिक करें\n2. सभी आवश्यक विवरण भरें\n3. डॉक्टर की प्रोफाइल इमेज अपलोड करें\n4. सेव करने के लिए 'Add Doctor' पर क्लिक करें",
            manageDoctors: "डॉक्टरों का प्रबंधन करने के लिए:\n1. साइडबार में 'Doctors List' पर क्लिक करें\n2. सभी पंजीकृत डॉक्टरों को देखें\n3. विवरण संशोधित करने के लिए 'Edit' का उपयोग करें\n4. डॉक्टरों को हटाने के लिए 'Delete' का उपयोग करें",
            appointments: "अपॉइंटमेंट देखने के लिए:\n1. साइडबार में 'All Appointments' पर क्लिक करें\n2. सभी रोगी अपॉइंटमेंट देखें\n3. तिथि, डॉक्टर या स्थिति के अनुसार फ़िल्टर करें",
            feedback: "प्रतिक्रिया देखने के लिए:\n1. साइडबार में 'Feedbacks' पर क्लिक करें\n2. रोगी समीक्षाएं और रेटिंग देखें\n3. प्रतिक्रिया प्रवृत्तियों का विश्लेषण करें",
            ambulance: "एम्बुलेंस सेवाओं का प्रबंधन करने के लिए:\n1. साइडबार में 'Ambulance Section' पर क्लिक करें\n2. नई एम्बुलेंस वाहन जोड़ें\n3. एम्बुलेंस उपलब्धता ट्रैक करें",
            dashboard: "Admin Dashboard सुविधाएं:\n📊 विश्लेषण और आंकड़े\n👨‍⚕️ डॉक्टर प्रबंधन\n📅 अपॉइंटमेंट ट्रैकिंग\n⭐ प्रतिक्रिया प्रबंधन\n🚑 एम्बुलेंस सेवाएं",
            default: "मैं आपकी admin panel सुविधाओं में मदद कर सकता हूं। कृपया मुझसे डॉक्टरों, अपॉइंटमेंट, प्रतिक्रिया या एम्बुलेंस सेवाओं के प्रबंधन के बारे में पूछें।"
        }
    };

    // Initialize speech recognition and synthesis
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = language === 'en' ? 'en-US' : 'hi-IN';
            
            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputMessage(transcript);
                handleSendMessage(transcript);
                setIsListening(false);
            };
            
            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                toast.error(language === 'en' ? 'Speech recognition failed' : 'भाषण पहचान विफल');
            };
        }

        if ('speechSynthesis' in window) {
            speechRef.current = window.speechSynthesis;
        }

        // Add welcome message
        const welcomeMessage = knowledge[language].welcome;
        setMessages([{
            id: 1,
            text: welcomeMessage,
            sender: 'bot',
            timestamp: new Date()
        }]);

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, [language]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Process user input and generate response
    const processUserInput = (input) => {
        const lowerInput = input.toLowerCase().trim();
        const currentKnowledge = knowledge[language];
        
        // Check for greetings
        if (currentKnowledge.greetings.some(greeting => lowerInput.includes(greeting))) {
            return currentKnowledge.welcome;
        }
        
        // Check for add doctor
        if (lowerInput.includes('add doctor') || lowerInput.includes('new doctor') || 
            lowerInput.includes('डॉक्टर जोड़ें') || lowerInput.includes('नया डॉक्टर')) {
            return currentKnowledge.addDoctor;
        }
        
        // Check for manage doctors
        if (lowerInput.includes('manage doctor') || lowerInput.includes('doctor list') || lowerInput.includes('edit doctor') ||
            lowerInput.includes('डॉक्टर प्रबंधन') || lowerInput.includes('डॉक्टर सूची')) {
            return currentKnowledge.manageDoctors;
        }
        
        // Check for appointments
        if (lowerInput.includes('appointment') || lowerInput.includes('schedule') ||
            lowerInput.includes('अपॉइंटमेंट') || lowerInput.includes('शेड्यूल')) {
            return currentKnowledge.appointments;
        }
        
        // Check for feedback
        if (lowerInput.includes('feedback') || lowerInput.includes('review') || lowerInput.includes('rating') ||
            lowerInput.includes('प्रतिक्रिया') || lowerInput.includes('समीक्षा')) {
            return currentKnowledge.feedback;
        }
        
        // Check for ambulance
        if (lowerInput.includes('ambulance') || lowerInput.includes('emergency') ||
            lowerInput.includes('एम्बुलेंस') || lowerInput.includes('आपातकाल')) {
            return currentKnowledge.ambulance;
        }
        
        // Check for dashboard
        if (lowerInput.includes('dashboard') || lowerInput.includes('admin') || lowerInput.includes('features') ||
            lowerInput.includes('डैशबोर्ड') || lowerInput.includes('एडमिन')) {
            return currentKnowledge.dashboard;
        }
        
        return currentKnowledge.default;
    };

    // Handle sending message
    const handleSendMessage = (message = inputMessage) => {
        if (!message.trim()) return;
        
        const userMessage = {
            id: Date.now(),
            text: message,
            sender: 'user',
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        
        // Generate bot response
        setTimeout(() => {
            const botResponse = processUserInput(message);
            const botMessage = {
                id: Date.now() + 1,
                text: botResponse,
                sender: 'bot',
                timestamp: new Date()
            };
            
            setMessages(prev => [...prev, botMessage]);
            speakText(botResponse);
        }, 500);
    };

    // Text-to-speech function
    const speakText = (text) => {
        if (speechRef.current) {
            speechRef.current.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language === 'en' ? 'en-US' : 'hi-IN';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            
            speechRef.current.speak(utterance);
        }
    };

    // Toggle speech recognition
    const toggleListening = () => {
        if (!recognitionRef.current) {
            toast.error(language === 'en' ? 'Speech recognition not supported' : 'भाषण पहचान समर्थित नहीं है');
            return;
        }
        
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    // Handle Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Toggle language
    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'hi' : 'en');
        setMessages([]);
    };

    return (
        <>
            {/* Chatbot Toggle Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110"
                    title={language === 'en' ? 'Chat with Admin Assistant' : 'Admin Assistant से बात करें'}
                >
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
                    {/* Chat Header */}
                    <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold">Admin Assistant</h3>
                                <p className="text-sm opacity-90">
                                    {language === 'en' ? 'AI Admin Support' : 'AI एडमिन सहायक'}
                                </p>
                            </div>
                        </div>
                        
                        {/* Language Toggle */}
                        <button
                            onClick={toggleLanguage}
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
                            title={language === 'en' ? 'Switch to Hindi' : 'अंग्रेजी में बदलें'}
                        >
                            {language === 'en' ? 'हिं' : 'EN'}
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                        message.sender === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    <div className="whitespace-pre-line">{message.text}</div>
                                    <div className={`text-xs mt-1 ${
                                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                                    }`}>
                                        {message.timestamp.toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                            <div className="flex-1 relative">
                                <textarea
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={language === 'en' ? 'Type your message...' : 'अपना संदेश लिखें...'}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="1"
                                    style={{ minHeight: '40px', maxHeight: '100px' }}
                                />
                            </div>
                            
                            {/* Voice Input Button */}
                            <button
                                onClick={toggleListening}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    isListening
                                        ? 'bg-red-500 text-white animate-pulse'
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                                }`}
                                title={language === 'en' ? 'Voice Input' : 'आवाज इनपुट'}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            </button>
                            
                            {/* Send Button */}
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={!inputMessage.trim()}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-all duration-200"
                                title={language === 'en' ? 'Send Message' : 'संदेश भेजें'}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Status Indicators */}
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                            <div className="flex items-center space-x-2">
                                {isListening && (
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                        <span>{language === 'en' ? 'Listening...' : 'सुन रहा है...'}</span>
                                    </div>
                                )}
                                {isSpeaking && (
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                        <span>{language === 'en' ? 'Speaking...' : 'बोल रहा है...'}</span>
                                    </div>
                                )}
                            </div>
                            <span>{language === 'en' ? 'Admin Assistant' : 'एडमिन सहायक'}</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;

