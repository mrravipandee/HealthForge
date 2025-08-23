import { useEffect, useState } from "react";
import { assets } from "../assets/assets";

const Header = () => {
  const slides = [
    {
      image: assets.appointment_img,
      title: "Book Appointment With Trusted Doctors",
      desc: "Browse our extensive list of trusted doctors and schedule your appointment hassle-free anytime.",
    },
    {
      image: assets.header_img,
      title: "Expert Care At Your Fingertips",
      desc: "Find doctors by specialty, reviews, and availability. Healthcare is now just a click away.",
    },
    {
      image: assets.doc2,
      title: "Your Health, Our Priority Always",
      desc: "Get access to top-rated medical professionals, ensuring quality care whenever you need it.",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const ctas = [
    { label: "Pharma", href: "#pharma" },
    { label: "Book Appointment", href: "#appointment" },
    { label: "Lab Test", href: "#lab" },
    { label: "Health Insurance", href: "#insurance" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-[#193378] via-indigo-600 to-blue-500 rounded-3xl shadow-2xl overflow-hidden px-6 md:px-12 lg:px-20 py-12 gap-8">

      {/* --------- Header Left --------- */}
      <div className="md:w-1/2 flex flex-col justify-center gap-6 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-base font-light max-w-md">
          <img className="w-24" src={assets.group_profiles} alt="profiles" />
          <p className="leading-relaxed">{slides[current].desc}</p>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold drop-shadow-lg max-w-lg">
          {slides[current].title}
        </h1>

        {/* CTA Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 w-full max-w-md">
          {ctas.map((cta, i) => (
            <a
              key={i}
              href={cta.href}
              className="flex items-center justify-between bg-white/90 backdrop-blur-md px-5 py-3 rounded-xl text-[#333] font-medium shadow-md hover:shadow-lg hover:bg-gradient-to-r hover:from-[#193378] hover:to-gray-800 hover:text-white transition-all duration-300"
            >
              <span>{cta.label}</span>
              <img className="w-3" src={assets.arrow_icon} alt="arrow" />
            </a>
          ))}
        </div>

        {/* Privacy Popup Trigger */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowPopup(true)}
            className="w-full max-w-[250px] bg-white/90 backdrop-blur-md px-5 py-3 rounded-xl text-[#333] font-medium shadow-md hover:shadow-lg hover:bg-gradient-to-r hover:from-[#193378] hover:to-gray-800 hover:text-white transition-all duration-300"
          >
            Privacy Laws
          </button>
        </div>
      </div>

      {/* --------- Header Right (Slider) --------- */}
      <div className="md:w-1/2 relative overflow-hidden rounded-3xl w-full">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="w-full flex-shrink-0 relative">
              <img
                src={slide.image}
                alt={`slide-${i}`}
                className="w-full h-full object-cover rounded-3xl transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-3xl"></div>
            </div>
          ))}
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                current === i
                  ? "w-6 bg-gray-600 shadow-lg ring-2 ring-[#193378]"
                  : "w-2 bg-gray-400/70 hover:bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* --------- Modern Centered Popup Modal --------- */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 px-4">
          <div className="bg-gradient-to-b from-white to-blue-50 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative">
            
            {/* Medical Icon */}
            <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m4-4H8" />
              </svg>
            </div>

            {/* Header */}
            <h2 className="text-2xl font-bold mb-4 text-[#193378]">
              Privacy & Healthcare Laws
            </h2>

            {/* Content */}
            <div className="text-gray-700 mb-6 text-left space-y-2">
              <p>
                <strong>HIPAA:</strong> Protects patient health information and ensures privacy & security.
              </p>
              <p>
                <strong>NDHA:</strong> Safeguards patient data handling in hospitals & digital systems.
              </p>
              <p>
                <strong>GDPR (if applicable):</strong> Gives patients rights over their personal health data.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="px-6 py-3 bg-[#193378] text-white rounded-xl hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
