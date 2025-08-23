import { assets } from "../assets/assets";
import { FaClock, FaHandshake, FaUserCheck } from "react-icons/fa";

const About = () => {
  return (
    <div className="px-6 md:px-12 lg:px-20 py-12 bg-gray-50">

      {/* Header */}
      <div className="text-center text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 relative">
        ABOUT <span className="text-[#193378]">US</span>
        <div className="w-20 h-1 bg-[#193378] mx-auto mt-2 rounded-full"></div>
      </div>

      {/* About Section */}
      <div className="my-12 flex flex-col justify-center md:flex-row gap-12 items-center">
        <img
          className="w-full md:max-w-[400px] rounded-xl shadow-lg hover:scale-105 transition-transform duration-500"
          src={assets.about_image}
          alt="About Us"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600 text-sm md:text-base leading-relaxed">
          <p>
            Welcome to{" "}
            <span className="font-semibold text-[#193378]">Prescripto</span>, 
            your trusted partner in managing your healthcare needs conveniently and efficiently. 
            We simplify appointment scheduling and help you manage your{" "}
            <span className="font-semibold">health records</span> seamlessly.
          </p>
          <p>
            <span className="font-semibold text-[#193378]">Innovation in healthcare technology</span> 
            drives us. Our platform integrates the latest advancements to enhance user experience 
            and deliver superior service — from booking your first appointment to managing ongoing care.
          </p>
          <b className="text-[#193378] text-lg">🌟 Our Vision</b>
          <p>
            To create a seamless healthcare experience for every user, bridging the gap between 
            <span className="font-semibold"> patients and providers</span>, and making it easy 
            to access the care you need, when you need it.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-xl md:text-2xl my-8 font-semibold text-gray-800">
        Why <span className="text-[#193378]">Choose Us?</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {/* Card 1 */}
        <div className="border rounded-2xl px-8 py-10 flex flex-col gap-4 text-gray-700 
        hover:bg-gradient-to-r hover:from-[#193378] hover:to-indigo-600 
        hover:text-white shadow-md hover:shadow-xl transform hover:scale-105 
        transition-all duration-500 cursor-pointer">
          <div className="w-14 h-14 flex items-center justify-center rounded-full 
          bg-gradient-to-r from-[#193378] to-indigo-600 text-white text-3xl shadow-lg">
            <FaClock />
          </div>
          <b className="text-lg">Efficiency</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>

        {/* Card 2 */}
        <div className="border rounded-2xl px-8 py-10 flex flex-col gap-4 text-gray-700 
        hover:bg-gradient-to-r hover:from-[#193378] hover:to-indigo-600 
        hover:text-white shadow-md hover:shadow-xl transform hover:scale-105 
        transition-all duration-500 cursor-pointer">
          <div className="w-14 h-14 flex items-center justify-center rounded-full 
          bg-gradient-to-r from-[#193378] to-indigo-600 text-white text-3xl shadow-lg">
            <FaHandshake />
          </div>
          <b className="text-lg">Convenience</b>
          <p>Access a network of trusted healthcare professionals in your area.</p>
        </div>

        {/* Card 3 */}
        <div className="border rounded-2xl px-8 py-10 flex flex-col gap-4 text-gray-700 
        hover:bg-gradient-to-r hover:from-[#193378] hover:to-indigo-600 
        hover:text-white shadow-md hover:shadow-xl transform hover:scale-105 
        transition-all duration-500 cursor-pointer">
          <div className="w-14 h-14 flex items-center justify-center rounded-full 
          bg-gradient-to-r from-[#193378] to-indigo-600 text-white text-3xl shadow-lg">
            <FaUserCheck />
          </div>
          <b className="text-lg">Personalization</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>

      {/* Our Mission */}
      <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-100 
      rounded-2xl px-8 py-12 text-gray-700 flex flex-col md:flex-row gap-6 items-center shadow-inner">
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-semibold text-[#193378]">🎯 Our Mission</h3>
          <p className="mt-3 text-sm md:text-base leading-relaxed">
            At <span className="font-semibold text-[#193378]">Prescripto</span>, our mission is to 
            <span className="font-semibold"> empower patients</span> with convenient access to healthcare, 
            bridging the gap between providers and users through{" "}
            <span className="font-semibold">technology-driven solutions</span>.  
            We prioritize <span className="font-semibold">privacy</span>, <span className="font-semibold">security</span>, 
            and seamless experiences for every user.
          </p>
        </div>
        <img
          className="w-full md:w-1/3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-500"
          src={assets.mission_image || assets.about_image}
          alt="Mission"
        />
      </div>

    </div>
  );
};

export default About;
