import React, { useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaBook, FaChalkboardTeacher, FaCalendarAlt, FaEnvelope, FaPhone, FaQuestionCircle, FaArrowRight, FaBars, FaTimes } from 'react-icons/fa';

const RegisterPage = ({ navigateToLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subjects: '',
  });

  const images = [
    '/images/tutoring1.jpg',
    '/images/tutoring2.jpg',
    '/images/tutoring3.jpg',
  ];

  const handleImageClick = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Student Registered:', formData);
    navigateToLogin();
  };

  const features = [
    {
      icon: <FaChalkboardTeacher className="w-6 h-6 text-tutorTeal" />,
      title: "Personalized Tutoring",
      description: "Get one-on-one sessions tailored to your learning needs.",
    },
    {
      icon: <FaBook className="w-6 h-6 text-tutorTeal" />,
      title: "Exam Preparation",
      description: "Step-by-step guidance with past papers and problem-solving.",
    },
    {
      icon: <FaCalendarAlt className="w-6 h-6 text-tutorTeal" />,
      title: "Flexible Scheduling",
      description: "Book sessions at times that suit your schedule.",
    },
  ];

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Support', href: '#support' },
  ];

  return (
    <div className="min-h-screen bg-tutorWhite">
      {/* Navigation */}
      <nav className="bg-tutorWhite shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-tutorTeal">
                TutorMe
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-gray-600 hover:text-tutorTeal transition-colors">
                  {link.name}
                </a>
              ))}
              <a href="https://facebook.com/tutorme" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-tutorTeal">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/tutorme" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-tutorTeal">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/tutorme" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-tutorTeal">
                <FaInstagram className="w-5 h-5" />
              </a>
              <button onClick={navigateToLogin} className="text-gray-600 hover:text-tutorTeal">
                Log In
              </button>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-tutorTeal">
                {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <div className="md:hidden py-4">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="block py-2 text-gray-600 hover:text-tutorTeal" onClick={() => setIsMenuOpen(false)}>
                  {link.name}
                </a>
              ))}
              <div className="space-y-2 pt-4">
                <button onClick={navigateToLogin} className="block w-full text-left py-2 text-gray-600 hover:text-tutorTeal">
                  Log In
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Registration Form */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-tutorTeal/20 to-teal-600/20 z-0" />
        <div className="relative z-10 container mx-auto px-4 pt-20 pb-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="max-w-lg">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 tracking-tight">
                Sign Up for Personalized Tutoring
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Join TutorMe to access expert tutors in Mathematics, Chemistry, Physics, and more. Register now to start your learning journey!
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-tutorTeal focus:border-tutorTeal"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-tutorTeal focus:border-tutorTeal"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-tutorTeal focus:border-tutorTeal"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subjects" className="block text-sm font-medium text-gray-700">Subjects of Interest</label>
                  <input
                    type="text"
                    id="subjects"
                    name="subjects"
                    value={formData.subjects}
                    onChange={handleInputChange}
                    placeholder="e.g., Mathematics, Chemistry, Physics"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-tutorTeal focus:border-tutorTeal"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-tutorTeal text-tutorWhite font-semibold py-3 px-8 rounded-full hover:bg-tutorTeal/80 transition-all duration-300 shadow-md flex items-center space-x-2"
                >
                  <span>Register Now</span>
                  <FaArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
            <div className="block">
              <div className="relative cursor-pointer" onClick={handleImageClick}>
                <img
                  src={images[currentImage]}
                  alt={`TutorMe Preview ${currentImage + 1}`}
                  className="rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500 ease-in-out w-full max-w-md mx-auto opacity-100 hover:opacity-95"
                  key={images[currentImage]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="bg-tutorWhite py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">About TutorMe</h2>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              TutorMe was founded in 2019 by Nkopo Chaole and Khethisa Lebakeng, two passionate educators with a mission to empower Lesotho learners through personalized tutoring. With a combined 12 years of tutoring experience, they aim to bridge educational gaps by providing tailored learning plans, exam-focused strategies, and interactive sessions.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
                <h3 className="text-xl font-semibold text-tutorTeal mb-2">Nkopo Chaole</h3>
                <p className="text-gray-600">
                  A Lab Scientist at UCT with a Master’s in Materials Engineering, Nkopo specializes in Mathematics and Chemistry. With 6 years of tutoring experience, she focuses on personalized learning plans and exam preparation, leveraging her STEM expertise to simplify complex concepts.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
                <h3 className="text-xl font-semibold text-tutorTeal mb-2">Khethisa Lebakeng</h3>
                <p className="text-gray-600">
                  A Lecturer in Mechanical Engineering at UCT with a Master’s in Materials Engineering, Khethisa teaches Mathematics and Physics. With 6 years of tutoring, he uses real-life examples and interactive methods to make learning engaging and effective for students at all levels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How TutorMe Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-tutorWhite p-6 rounded-2xl shadow-md text-center">
              <div className="w-12 h-12 bg-tutorTeal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-tutorTeal">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Register</h3>
              <p className="text-gray-600">
                Sign up with your details to join the TutorMe community.
              </p>
            </div>
            <div className="bg-tutorWhite p-6 rounded-2xl shadow-md text-center">
              <div className="w-12 h-12 bg-tutorTeal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-tutorTeal">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Book a Tutor</h3>
              <p className="text-gray-600">
                Choose your subject and schedule a session with an expert tutor.
              </p>
            </div>
            <div className="bg-tutorWhite p-6 rounded-2xl shadow-md text-center">
              <div className="w-12 h-12 bg-tutorTeal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-tutorTeal">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Learn & Succeed</h3>
              <p className="text-gray-600">
                Engage in personalized sessions and excel in your studies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-tutorWhite py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose TutorMe?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-tutorWhite rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div id="support" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Need Help?</h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-tutorWhite p-6 rounded-2xl text-center flex flex-col items-center h-full shadow-md">
                <FaEnvelope className="w-8 h-8 text-tutorTeal mb-4" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-gray-500 text-sm">support@tutorme.com</p>
              </div>
              <div className="bg-tutorWhite p-6 rounded-2xl text-center flex flex-col items-center h-full shadow-md">
                <FaPhone className="w-8 h-8 text-tutorTeal mb-4" />
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-gray-500 text-sm">+27 78 567 8863</p>
              </div>
              <div className="bg-tutorWhite p-6 rounded-2xl text-center flex flex-col items-center h-full shadow-md">
                <FaQuestionCircle className="w-8 h-8 text-tutorTeal mb-4" />
                <h3 className="font-semibold mb-2">Help Center</h3>
                <p className="text-gray-600 text-sm">FAQs and Guides</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-tutorTeal text-tutorWhite py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-sm">
                © 2025 <span className="font-bold">TutorMe</span>. All rights reserved.
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://facebook.com/tutorme" target="_blank" rel="noopener noreferrer" className="hover:text-tutorGray">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/tutorme" target="_blank" rel="noopener noreferrer" className="hover:text-tutorGray">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/tutorme" target="_blank" rel="noopener noreferrer" className="hover:text-tutorGray">
                <FaInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;