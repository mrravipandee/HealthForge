import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const DoctorChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [language, setLanguage] = useState('en');
    const [isSpeaking, setIsSpeaking] = useState(false);
    
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const speechRef = useRef(null);

    // HealthForge Doctor knowledge base
    const knowledge = {
        en: {
            greetings: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
            welcome: "Hello! Welcome to HealthForge Doctor Panel! I'm your AI assistant. I can help you with managing appointments, patient information, and your profile. How can I assist you today?",
            appointments: "To view your appointments:\n1. Click 'Appointments' in the sidebar\n2. See all your scheduled appointments\n3. View patient details and history\n4. Update appointment status",
            profile: "To manage your profile:\n1. Click 'Profile' in the sidebar\n2. Update your personal information\n3. Modify your availability\n4. Change your fees and specializations",
            dashboard: "Doctor Dashboard features:\n📊 Your appointment statistics\n👥 Patient management\n📅 Schedule overview\n💰 Earnings and fees\n⭐ Patient feedback",
            default: "I can help you with doctor panel features. Please ask me about appointments, patient information, or profile management."
        },
        hi: {
            greetings: ['नमस्ते', 'हैलो', 'हाय', 'सुप्रभात', 'शुभ दोपहर', 'शुभ संध्या'],
            welcome: "नमस्ते! HealthForge Doctor Panel में आपका स्वागत है! मैं आपका AI सहायक हूं। मैं अपॉइंटमेंट, रोगी जानकारी और आपकी प्रोफाइल के प्रबंधन में मदद कर सकता हूं।",
            appointments: "अपने अपॉइंटमेंट देखने के लिए:\n1. साइडबार में 'Appointments' पर क्लिक करें\n2. अपने सभी निर्धारित अपॉइंटमेंट देखें\n3. रोगी विवरण और इतिहास देखें\n4. अपॉइंटमेंट स्थिति अपडेट करें",
            profile: "अपनी प्रोफाइल प्रबंधित करने के लिए:\n1. साइडबार में 'Profile' पर क्लिक करें\n2. अपनी व्यक्तिगत जानकारी अपडेट करें\n3. अपनी उपलब्धता संशोधित करें\n4. अपनी फीस और विशेषज्ञताएं बदलें",
            dashboard: "Doctor Dashboard सुविधाएं:\n📊 आपके अपॉइंटमेंट आंकड़े\n👥 रोगी प्रबंधन\n📅 शेड्यूल अवलोकन\n💰 कमाई और फीस\n⭐ रोगी प्रतिक्रिया",
            default: "मैं आपकी doctor panel सुविधाओं में मदद कर सकता हूं। कृपया मुझसे अपॉइंटमेंट, रोगी जानकारी या प्रोफाइल प्रबंधन के बारे में पूछें।"
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
        
        // Check for appointments
        if (lowerInput.includes('appointment') || lowerInput.includes('schedule') ||
            lowerInput.includes('अपॉइंटमेंट') || lowerInput.includes('शेड्यूल')) {
            return currentKnowledge.appointments;
        }
        
        // Check for profile
        if (lowerInput.includes('profile') || lowerInput.includes('settings') ||
            lowerInput.includes('प्रोफाइल') || lowerInput.includes('सेटिंग्स')) {
            return currentKnowledge.profile;
        }
        
        // Check for dashboard
        if (lowerInput.includes('dashboard') || lowerInput.includes('doctor') || lowerInput.includes('features') ||
            lowerInput.includes('डैशबोर्ड') || lowerInput.includes('डॉक्टर')) {
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
                    className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110"
                    title={language === 'en' ? 'Chat with Doctor Assistant' : 'Doctor Assistant से बात करें'}
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
                    <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold">Doctor Assistant</h3>
                                <p className="text-sm opacity-90">
                                    {language === 'en' ? 'AI Doctor Support' : 'AI डॉक्टर सहायक'}
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
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    <div className="whitespace-pre-line">{message.text}</div>
                                    <div className={`text-xs mt-1 ${
                                        message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-all duration-200"
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
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span>{language === 'en' ? 'Speaking...' : 'बोल रहा है...'}</span>
                                    </div>
                                )}
                            </div>
                            <span>{language === 'en' ? 'Doctor Assistant' : 'डॉक्टर सहायक'}</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DoctorChatbot;
