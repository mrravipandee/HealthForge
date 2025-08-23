import { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    setLoading(true);

    try {
      const feedbackData = {
        userId: "anonymous", // You can replace this with actual user ID if user is logged in
        name: formData.name,
        email: formData.email,
        message: formData.message,
        rating: rating
      };

      const response = await axios.post("http://localhost:3000/api/feedback", feedbackData);
      
      if (response.data.success) {
        toast.success("Feedback submitted successfully!");
        setFormData({ name: "", email: "", message: "" });
        setRating(0);
      } else {
        toast.error(response.data.message || "Failed to submit feedback");
      }
    } catch (err) {
      console.error("Feedback submission error:", err);
      toast.error(err.response?.data?.message || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 md:px-8 lg:px-16 py-12 bg-gray-50">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
          Share Your <span className="text-[#193378]">Feedback</span>
        </h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          We value your opinion! Share your experience with HealthForge and help us improve our services. Your feedback is important to us.
        </p>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left: Contact Information */}
        <div className="w-full lg:w-2/5">
          <div className="bg-white rounded-2xl shadow-md p-8 h-full">
            <div className="mb-8">
              <img 
                className="w-full h-48 object-cover rounded-lg shadow-md" 
                src={assets.contact_image} 
                alt="Contact our team" 
              />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-xl text-gray-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#193378]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Our Office
                </h3>
                <p className="text-gray-600 mt-2 ml-7">
                  54709 Willms Station <br /> Suite 350, Washington, USA
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-xl text-gray-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#193378]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Contact Info
                </h3>
                <p className="text-gray-600 mt-2 ml-7">
                  Tel: (415) 555-0132 <br /> Email: greatstackdev@gmail.com
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-xl text-gray-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#193378]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3a2 2 0 01-2 2h-1v-1a2 2 0 00-2-2H9a2 2 0 00-2 2v1H6a2 2 0 01-2-2V8a2 2 0 012-2zm0 6h8v1a2 2 0 01-2 2H8a2 2 0 01-2-2v-1zm11-2a1 1 0 00-1 1v6a1 1 0 102 0v-6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Careers at Prescripto
                </h3>
                <p className="text-gray-600 mt-2 ml-7 mb-4">
                  Learn more about our teams and job openings.
                </p>
                <button className="ml-7 bg-[#193378] text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-all duration-300 flex items-center gap-2">
                  Explore Jobs
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="w-full lg:w-3/5">
          <div className="bg-white rounded-2xl shadow-md p-8 h-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Feedback Form</h3>
            <p className="text-gray-600 mb-8">Please share your thoughts about our services. Your feedback helps us improve!</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>



              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  placeholder="Please describe your feedback in detail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="text-2xl transition-colors duration-200"
                    >
                      {star <= (hoveredRating || rating) ? (
                        <span className="text-yellow-400">★</span>
                      ) : (
                        <span className="text-gray-300">☆</span>
                      )}
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#193378] text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Submit Feedback
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </>
                )}
              </button>


            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;