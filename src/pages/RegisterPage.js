import React, { useState, useEffect } from 'react';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaBook, 
  FaChalkboardTeacher, 
  FaGraduationCap, 
  FaCalendarAlt, 
  FaEnvelope, 
  FaPhone, 
  FaQuestionCircle, 
  FaArrowRight, 
  FaBars, 
  FaTimes, 
  FaCheckCircle, 
  FaUser, 
  FaLock,
  FaUserCircle,
  FaStar,
  FaStarHalfAlt
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button, Input, Checkbox, Select, Textarea, Alert } from '../components/ui';
import { subjectService } from '../services/firebase.services';

const RegisterPage = ({ navigateToLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [step, setStep] = useState(1); // 1: Role selection, 2: Registration form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    subjects: [],
    role: '',
    bio: '', // Only for tutors
    hourlyRate: '', // Only for tutors
    grade: '', // Only for students
    schoolName: '', // Only for students
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const { signup, availableSubjects } = useAuth();
  const navigate = useNavigate();

  // Images for slider - we'll fetch these from storage in a real app
  const images = [
    '/images/tutoring1.jpg',
    '/images/tutoring2.jpg',
    '/images/tutoring3.jpg',
  ];

  // Load subjects from Firebase
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setSubjectsLoading(true);
        const subjectsData = await subjectService.getSubjects();
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setSubjectsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // Interval for automatic image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  const handleImageClick = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }));
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return { ...prev, subjects: [...prev.subjects, value] };
      } else {
        return { ...prev, subjects: prev.subjects.filter(subject => subject !== value) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (formData.password.length < 6) {
      return setError('Password should be at least 6 characters');
    }
    
    if (formData.subjects.length === 0) {
      return setError('Please select at least one subject');
    }

    // Additional validation for tutors
    if (formData.role === 'tutor') {
      if (!formData.bio || formData.bio.length < 50) {
        return setError('Please provide a detailed bio (at least 50 characters)');
      }
      
      if (!formData.hourlyRate || isNaN(formData.hourlyRate) || Number(formData.hourlyRate) <= 0) {
        return setError('Please provide a valid hourly rate');
      }
    }

    // Additional validation for students
    if (formData.role === 'student') {
      if (!formData.grade) {
        return setError('Please provide your current grade/year');
      }
    }

    try {
      setError('');
      setLoading(true);
      
      // Create the user with Firebase
      await signup(
        formData.email, 
        formData.password, 
        formData.name, 
        formData.phone, 
        formData.subjects,
        formData.role,
        {
          bio: formData.bio,
          hourlyRate: Number(formData.hourlyRate),
          grade: formData.grade,
          schoolName: formData.schoolName
        }
      );
      
      // Redirect to appropriate dashboard based on role
      navigate(`/${formData.role}-dashboard`);
    } catch (error) {
      let errorMessage = 'Failed to create an account';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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

  // Grade options for students
  const gradeOptions = [
    { value: '', label: 'Select your grade' },
    { value: '10', label: 'Grade 10' },
    { value: '11', label: 'Grade 11' },
    { value: '12', label: 'Grade 12' },
    { value: 'university', label: 'University' },
  ];

  // Step 1: Role Selection
  const renderRoleSelection = () => (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Join TutorMe As</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <button 
          onClick={() => handleRoleSelect('student')}
          className="bg-white border-2 border-tutorTeal hover:bg-tutorTeal/5 rounded-xl p-8 text-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-tutorTeal/30"
        >
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-tutorTeal/10 rounded-full flex items-center justify-center">
              <FaGraduationCap className="w-10 h-10 text-tutorTeal" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">I'm a Student</h3>
          <p className="text-gray-600">
            Join to access personalized tutoring, study resources, and expert help with your subjects.
          </p>
        </button>
        
        <button 
          onClick={() => handleRoleSelect('tutor')}
          className="bg-white border-2 border-tutorTeal hover:bg-tutorTeal/5 rounded-xl p-8 text-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-tutorTeal/30"
        >
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-tutorTeal/10 rounded-full flex items-center justify-center">
              <FaChalkboardTeacher className="w-10 h-10 text-tutorTeal" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">I'm a Tutor</h3>
          <p className="text-gray-600">
            Become a tutor, share your knowledge, and help students achieve academic success.
          </p>
        </button>
      </div>
      
      <div className="text-center mt-8">
        <p className="text-gray-600">
          Already have an account? <button onClick={navigateToLogin} className="text-tutorTeal font-semibold hover:text-tutorTeal/80">Log In</button>
        </p>
      </div>
    </div>
  );

  // Step 2: Registration Form
  const renderRegistrationForm = () => (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => setStep(1)} 
          className="text-tutorTeal hover:text-tutorTeal/80 font-medium flex items-center"
        >
          <FaArrowRight className="w-4 h-4 transform rotate-180 mr-2" />
          Back to Role Selection
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          Register as a {formData.role === 'student' ? 'Student' : 'Tutor'}
        </h2>
      </div>
      
      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Registration Steps Progress */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-full p-1 inline-flex">
            <div className="flex items-center space-x-1 text-sm font-medium">
              <span className="bg-tutorTeal text-white rounded-full w-8 h-8 flex items-center justify-center">
                1
              </span>
              <span className="px-2">Personal Info</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300 self-center mx-2"></div>
            <div className="flex items-center space-x-1 text-sm font-medium">
              <span className="bg-gray-300 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center">
                2
              </span>
              <span className="px-2">Subjects</span>
            </div>
            {formData.role === 'tutor' && (
              <>
                <div className="w-12 h-0.5 bg-gray-300 self-center mx-2"></div>
                <div className="flex items-center space-x-1 text-sm font-medium">
                  <span className="bg-gray-300 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center">
                    3
                  </span>
                  <span className="px-2">Tutor Details</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FaUser className="w-5 h-5 mr-2 text-tutorTeal" />
              Personal Information
            </h3>
            
            <div className="space-y-4">
              <Input
                label="Full Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
              
              <Input
                label="Email Address"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
              />
              
              <Input
                label="Phone Number"
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+27 XX XXX XXXX"
                required
              />

              {formData.role === 'student' && (
                <>
                  <Select
                    label="Current Grade/Year"
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    options={gradeOptions}
                    required
                  />
                  
                  <Input
                    label="School Name"
                    id="schoolName"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    placeholder="Your school or university"
                  />
                </>
              )}
            </div>
          </div>
          
          {/* Password & Security */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FaLock className="w-5 h-5 mr-2 text-tutorTeal" />
              Password & Security
            </h3>
            
            <div className="space-y-4">
              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                minLength={6}
                required
                placeholder="••••••••"
                helpText="Password must be at least 6 characters"
              />
              
              <Input
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>
        
        {/* Subjects Section */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <FaBook className="w-5 h-5 mr-2 text-tutorTeal" />
            Subjects of Interest
          </h3>
          
          {subjectsLoading ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-tutorTeal border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(subjects.length > 0 ? subjects : availableSubjects).map((subject) => (
                <Checkbox
                  key={subject.value}
                  id={subject.value}
                  label={subject.label}
                  value={subject.value}
                  checked={formData.subjects.includes(subject.value)}
                  onChange={handleSubjectChange}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Additional Tutor Information */}
        {formData.role === 'tutor' && (
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FaChalkboardTeacher className="w-5 h-5 mr-2 text-tutorTeal" />
              Tutor Information
            </h3>
            
            <div className="space-y-4">
              <Textarea
                label="Professional Bio"
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about your qualifications and teaching experience..."
                required
                helpText="Minimum 50 characters. Share your qualifications, experience and teaching style."
              />
              
              <Input
                label="Hourly Rate (ZAR)"
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                min="0"
                step="10"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                placeholder="150"
                required
                icon={<span className="text-gray-500">R</span>}
                helpText="Recommended rate: R150-R300 per hour based on experience"
              />
            </div>
          </div>
        )}
        
        {/* Terms and Conditions */}
        <div className="flex items-start mt-6">
          <Checkbox
            id="terms"
            required
            label={
              <span>I agree to the <a href="#" className="text-tutorTeal hover:text-tutorTeal/80">Terms of Service</a> and <a href="#" className="text-tutorTeal hover:text-tutorTeal/80">Privacy Policy</a></span>
            }
          />
        </div>
        
        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            fullWidth
            size="lg"
            icon={<FaArrowRight />}
          >
            Complete Registration
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-tutorTeal/5 to-gray-50">
      {loading && <LoadingSpinner message="Creating your account..." />}
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {step === 1 ? renderRoleSelection() : renderRegistrationForm()}
      </div>

      {/* Features Section - Only show on first step */}
      {step === 1 && (
        <div className="bg-white py-20">
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
      )}

      {/* Testimonials - Only show on first step */}
      {step === 1 && (
        <div className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">What Our Users Say</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Join thousands of students and tutors who have transformed their learning journey with TutorMe.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-tutorTeal/10 rounded-full flex items-center justify-center mr-4">
                    <FaUserCircle className="w-8 h-8 text-tutorTeal" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Thabiso M.</h4>
                    <p className="text-sm text-gray-500">Mathematics Student</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "The personalized tutoring from TutorMe helped me improve my math grade from a C to an A. My tutor explains concepts in ways I can understand."
                </p>
                <div className="flex text-yellow-400 mt-3">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-tutorTeal/10 rounded-full flex items-center justify-center mr-4">
                    <FaUserCircle className="w-8 h-8 text-tutorTeal" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Lerato K.</h4>
                    <p className="text-sm text-gray-500">Physics & Chemistry Student</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "The study resources and practice questions have been invaluable for my exam preparation. I feel more confident tackling difficult problems."
                </p>
                <div className="flex text-yellow-400 mt-3">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-tutorTeal/10 rounded-full flex items-center justify-center mr-4">
                    <FaUserCircle className="w-8 h-8 text-tutorTeal" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Thabo P.</h4>
                    <p className="text-sm text-gray-500">Mathematics Tutor</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Being a tutor on TutorMe has been rewarding both financially and personally. The platform makes it easy to connect with students and schedule sessions."
                </p>
                <div className="flex text-yellow-400 mt-3">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStarHalfAlt />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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