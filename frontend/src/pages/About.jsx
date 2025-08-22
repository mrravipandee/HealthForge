import { assets } from "../assets/assets";
import { FaClock, FaHandshake, FaUserCheck } from "react-icons/fa";

const About = () => {
  return (
    <div className="px-6 md:px-12 lg:px-20 py-10">

      {/* Header */}
      <div className="text-center text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-700">
        ABOUT <span className="text-[#193378]">US</span>
      </div>

      {/* About Section */}
      <div className="my-10 flex flex-col md:flex-row gap-12 items-center">
        <img
          className="w-full md:max-w-[380px] rounded-xl shadow-lg hover:scale-105 transition-transform duration-500"
          src={assets.about_image}
          alt="About Us"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600 text-sm md:text-base leading-relaxed">
          <p>
            Welcome to <span className="font-semibold text-[#193378]">Prescripto</span>, your trusted partner in managing your healthcare needs conveniently and efficiently. We simplify appointment scheduling and help you manage your health records seamlessly.
          </p>
          <p>
            Prescripto is committed to innovation in healthcare technology. Our platform integrates the latest advancements to enhance user experience and deliver superior service. From booking your first appointment to managing ongoing care, we support you every step of the way.
          </p>
          <b className="text-[#193378] text-lg">Our Vision</b>
          <p>
            Our vision is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and providers, making it easy to access the care you need, when you need it.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-xl md:text-2xl my-8 font-semibold">
        Why <span className="text-[#193378]">Choose Us</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {/* Card 1 */}
        <div className="border rounded-2xl px-8 py-10 flex flex-col gap-4 text-gray-700 hover:bg-gradient-to-r hover:from-[#193378] hover:to-indigo-600 hover:text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 cursor-pointer">
          <div className="text-[#193378] text-3xl">
            <FaClock />
          </div>
          <b className="text-lg">Efficiency</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>

        {/* Card 2 */}
        <div className="border rounded-2xl px-8 py-10 flex flex-col gap-4 text-gray-700 hover:bg-gradient-to-r hover:from-[#193378] hover:to-indigo-600 hover:text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 cursor-pointer">
          <div className="text-[#193378] text-3xl">
            <FaHandshake />
          </div>
          <b className="text-lg">Convenience</b>
          <p>Access a network of trusted healthcare professionals in your area.</p>
        </div>

        {/* Card 3 */}
        <div className="border rounded-2xl px-8 py-10 flex flex-col gap-4 text-gray-700 hover:bg-gradient-to-r hover:from-[#193378] hover:to-indigo-600 hover:text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 cursor-pointer">
          <div className="text-[#193378] text-3xl">
            <FaUserCheck />
          </div>
          <b className="text-lg">Personalization</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>

      {/* Optional Extra Section: Our Mission */}
      <div className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-2xl px-8 py-10 text-gray-700 flex flex-col md:flex-row gap-6 items-center shadow-inner">
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-semibold text-[#193378]">Our Mission</h3>
          <p className="mt-3 text-sm md:text-base">
            At Prescripto, our mission is to empower patients with convenient access to healthcare, bridging the gap between providers and users through technology-driven solutions. We prioritize privacy, security, and seamless experiences for every user.
          </p>
        </div>
        <img
          className="w-full md:w-1/3 rounded-lg shadow-lg"
          src={assets.about_image}
          alt="Mission"
        />
      </div>

    </div>
  );
};

export default About;
