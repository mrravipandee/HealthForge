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

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const ctas = [
    { label: "Pharma", href: "#pharma" },
    { label: "Book Appointment", href: "#appointment" },
    { label: "Lab Test", href: "#lab" },
    { label: "Health Insurance", href: "#insurance" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center flex-wrap bg-gradient-to-r from-[#193378] via-indigo-600 to-blue-500 rounded-3xl shadow-2xl px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* --------- Header Left --------- */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-6 py-12 m-auto md:py-[8vw] transition-all duration-700 ease-in-out">
        {/* Description */}
        <div
          key={current + "-desc"}
          className="flex flex-col md:flex-row items-start md:items-center gap-4 text-white text-base font-light animate-fade-in"
        >
          <img className="w-24" src={assets.group_profiles} alt="" />
          <p className="leading-relaxed max-w-md">{slides[current].desc}</p>
        </div>

        {/* Title */}
        <p
          key={current}
          className="text-3xl md:text-4xl lg:text-5xl text-white font-extrabold leading-snug animate-fade-in drop-shadow-lg"
          style={{ minHeight: "110px", maxWidth: "520px" }}
        >
          {slides[current].title}
        </p>

        {/* CTA Group */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 w-full max-w-md">
          {ctas.map((cta, i) => (
            <a
              key={i}
              href={cta.href}
              className="flex items-center justify-between bg-white/90 backdrop-blur-md px-5 py-3 rounded-xl text-[#333] text-sm font-medium shadow-md hover:shadow-lg hover:bg-gradient-to-r hover:from-[#193378] hover:to-gray-800 hover:text-white transition-all duration-300"
            >
              <span>{cta.label}</span>
              <img className="w-3" src={assets.arrow_icon} alt="" />
            </a>
          ))}
        </div>

        {/* Popup Trigger */}
        <div className="w-full flex justify-center">
          <button
            onClick={() => setShowPopup(true)}
            className="flex items-center justify-between bg-white/90 backdrop-blur-md px-5 py-3 rounded-xl text-[#333] text-sm font-medium shadow-md hover:shadow-lg hover:bg-gradient-to-r hover:from-[#193378] hover:to-gray-800 hover:text-white transition-all duration-300 max-w-[250px] w-full"
          >
            <span className="mx-auto">Privacy Laws</span>
          </button>
        </div>
      </div>

      {/* --------- Header Right (Image Slider) --------- */}
      <div className="md:w-1/2 relative overflow-hidden rounded-3xl">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="w-full flex-shrink-0 relative group overflow-hidden"
            >
              <img
                src={slide.image}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 rounded-3xl"
                alt={`slide-${i}`}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Modern Dots navigation */}
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
            ></div>
          ))}
        </div>
      </div>

      {/* --------- Popup Modal --------- */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full animate-fade-in">
            <h2 className="text-xl font-bold mb-3 text-[#193378]">
              Privacy & Healthcare Laws
            </h2>
            <p className="text-gray-600 mb-2">
              <strong>HIPAA:</strong> Protects patient health information and
              ensures privacy & security.
            </p>
            <p className="text-gray-600 mb-2">
              <strong>NDHA:</strong> Safeguards patient data handling in
              hospitals & digital systems.
            </p>
            <p className="text-gray-600 mb-2">
              <strong>GDPR (if applicable):</strong> Gives patients rights over
              their personal health data.
            </p>

            {/* Close button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-[#193378] text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
