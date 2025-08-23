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

    // HealthForge knowledge base
    const knowledge = {
        en: {
            greetings: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
            welcome: "Hello! Welcome to HealthForge! I'm your AI assistant. I can help you with booking appointments, finding doctors, emergency services, and platform navigation. How can I assist you today?",
            register: "To register on HealthForge:\n1. Click 'Login' in the top navigation\n2. Click 'Create Account' or 'Sign Up'\n3. Fill in your details\n4. Click 'Register'\nYou'll be redirected to your dashboard after successful registration.",
            bookAppointment: "To book an appointment:\n1. Login to your account\n2. Go to your dashboard\n3. Click 'Book Appointment'\n4. Select a specialist\n5. Choose a doctor\n6. Select date and time slot\n7. Review and confirm booking",
            about: "HealthForge is a comprehensive healthcare platform that connects patients with qualified doctors. Our services include doctor consultations, specialist appointments, emergency services, ambulance services, and patient management.",
            services: "HealthForge provides:\n🏥 Doctor Consultations\n🚑 Emergency Services\n📋 Patient Management\n💬 Support Services",
            navigation: "Navigate HealthForge:\nMain Website: Home, About, Doctors, Contact, Emergency, Login/Register\nUser Dashboard: Dashboard, My Profile, Book Appointment, My Appointments, Emergency, Feedback, Complaints",
            emergency: "HealthForge Emergency Services:\n🚨 24/7 Emergency Support\n📞 Click 'Emergency' in navigation\n🆘 GPS location tracking and quick response",
            feedback: "Submit feedback:\n1. Login to your dashboard\n2. Click 'Feedback' in sidebar\n3. Rate your experience\n4. Write detailed feedback\n5. Submit your review",
            complaints: "File a complaint:\n1. Login to your dashboard\n2. Click 'Complaints' in sidebar\n3. Select complaint category\n4. Describe the issue\n5. Submit for review",
            default: "I can only provide information related to HealthForge. Please ask me about our services, appointments, emergency services, or platform navigation."
        },
        hi: {
            greetings: ['नमस्ते', 'हैलो', 'हाय', 'सुप्रभात', 'शुभ दोपहर', 'शुभ संध्या'],
            welcome: "नमस्ते! HealthForge में आपका स्वागत है! मैं आपका AI सहायक हूं। मैं अपॉइंटमेंट बुकिंग, डॉक्टर खोजने, आपातकालीन सेवाओं में मदद कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
            register: "HealthForge पर पंजीकरण करने के लिए:\n1. शीर्ष नेविगेशन में 'लॉगिन' पर क्लिक करें\n2. 'खाता बनाएं' पर क्लिक करें\n3. अपना विवरण भरें\n4. 'पंजीकरण' पर क्लिक करें",
            bookAppointment: "अपॉइंटमेंट बुक करने के लिए:\n1. अपने खाते में लॉगिन करें\n2. अपने डैशबोर्ड पर जाएं\n3. 'अपॉइंटमेंट बुक करें' पर क्लिक करें\n4. एक विशेषज्ञ चुनें\n5. डॉक्टर चुनें\n6. तिथि और समय चुनें\n7. बुकिंग की पुष्टि करें",
            about: "HealthForge एक व्यापक स्वास्थ्य देखभाल प्लेटफॉर्म है जो रोगियों को योग्य डॉक्टरों से जोड़ता है। हमारी सेवाओं में डॉक्टर परामर्श, विशेषज्ञ अपॉइंटमेंट, आपातकालीन सेवाएं शामिल हैं।",
            services: "HealthForge प्रदान करता है:\n🏥 डॉक्टर परामर्श\n🚑 आपातकालीन सेवाएं\n📋 रोगी प्रबंधन\n💬 सहायता सेवाएं",
            navigation: "HealthForge में नेविगेट करें:\nमुख्य वेबसाइट: होम, के बारे में, डॉक्टर, संपर्क, आपातकाल, लॉगिन/पंजीकरण\nउपयोगकर्ता डैशबोर्ड: डैशबोर्ड, मेरी प्रोफाइल, अपॉइंटमेंट बुक करें, मेरे अपॉइंटमेंट, आपातकाल, प्रतिक्रिया, शिकायतें",
            emergency: "HealthForge आपातकालीन सेवाएं:\n🚨 24/7 आपातकालीन सहायता\n📞 नेविगेशन में 'आपातकाल' पर क्लिक करें\n🆘 GPS स्थान ट्रैकिंग और त्वरित प्रतिक्रिया",
            feedback: "प्रतिक्रिया सबमिट करें:\n1. अपने डैशबोर्ड में लॉगिन करें\n2. साइडबार में 'प्रतिक्रिया' पर क्लिक करें\n3. अपने अनुभव को रेट करें\n4. विस्तृत प्रतिक्रिया लिखें\n5. अपनी समीक्षा सबमिट करें",
            complaints: "शिकायत दर्ज करें:\n1. अपने डैशबोर्ड में लॉगिन करें\n2. साइडबार में 'शिकायतें' पर क्लिक करें\n3. शिकायत श्रेणी चुनें\n4. मुद्दा वर्णन करें\n5. समीक्षा के लिए सबमिट करें",
            default: "मैं केवल HealthForge से संबंधित जानकारी प्रदान कर सकता हूं। कृपया मुझसे हमारी सेवाओं, अपॉइंटमेंट, आपातकालीन सेवाओं के बारे में पूछें।"
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
        
        // Check for registration
        if (lowerInput.includes('register') || lowerInput.includes('sign up') || lowerInput.includes('create account') || 
            lowerInput.includes('पंजीकरण') || lowerInput.includes('खाता बनाएं')) {
            return currentKnowledge.register;
        }
        
        // Check for appointment booking
        if (lowerInput.includes('book') || lowerInput.includes('appointment') || lowerInput.includes('schedule') ||
            lowerInput.includes('बुक') || lowerInput.includes('अपॉइंटमेंट')) {
            return currentKnowledge.bookAppointment;
        }
        
        // Check for about HealthForge
        if (lowerInput.includes('what is') || lowerInput.includes('about') || lowerInput.includes('healthforge') ||
            lowerInput.includes('क्या है') || lowerInput.includes('के बारे में')) {
            return currentKnowledge.about;
        }
        
        // Check for services
        if (lowerInput.includes('service') || lowerInput.includes('provide') || lowerInput.includes('offer') ||
            lowerInput.includes('सेवा') || lowerInput.includes('प्रदान')) {
            return currentKnowledge.services;
        }
        
        // Check for navigation
        if (lowerInput.includes('navigate') || lowerInput.includes('how to use') || lowerInput.includes('menu') ||
            lowerInput.includes('नेविगेट') || lowerInput.includes('कैसे उपयोग करें')) {
            return currentKnowledge.navigation;
        }
        
        // Check for emergency
        if (lowerInput.includes('emergency') || lowerInput.includes('ambulance') || lowerInput.includes('urgent') ||
            lowerInput.includes('आपातकाल') || lowerInput.includes('एम्बुलेंस')) {
            return currentKnowledge.emergency;
        }
        
        // Check for feedback
        if (lowerInput.includes('feedback') || lowerInput.includes('review') || lowerInput.includes('rating') ||
            lowerInput.includes('प्रतिक्रिया') || lowerInput.includes('समीक्षा')) {
            return currentKnowledge.feedback;
        }
        
        // Check for complaints
        if (lowerInput.includes('complaint') || lowerInput.includes('issue') || lowerInput.includes('problem') ||
            lowerInput.includes('शिकायत') || lowerInput.includes('मुद्दा')) {
            return currentKnowledge.complaints;
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
          title={language === 'en' ? 'Chat with HealthForge Assistant' : 'HealthForge Assistant से बात करें'}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">HealthForge Assistant</h3>
                <p className="text-sm opacity-90">
                  {language === 'en' ? 'AI Healthcare Assistant' : 'AI स्वास्थ्य सहायक'}
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
              <span>{language === 'en' ? 'AI Assistant' : 'AI सहायक'}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
