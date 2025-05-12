import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaBook, FaCalendarAlt, FaChalkboardTeacher, FaBars, FaTimes } from 'react-icons/fa';

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: <FaUser className="mr-2" />, href: '#' },
    { name: 'My Courses', icon: <FaBook className="mr-2" />, href: '#courses' },
    { name: 'Schedule', icon: <FaCalendarAlt className="mr-2" />, href: '#schedule' },
    { name: 'Tutors', icon: <FaChalkboardTeacher className="mr-2" />, href: '#tutors' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navigation bar */}
      <header className="bg-tutorTeal text-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            className="md:hidden mr-4 focus:outline-none" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h1 className="text-2xl font-bold">TutorMe</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <span className="font-medium">Hello, {currentUser?.displayName || 'Student'}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-full transition-colors"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="flex flex-grow">
        {/* Sidebar - mobile version with overlay */}
        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsSidebarOpen(false)}></div>
        )}
        
        {/* Sidebar content */}
        <aside 
          className={`bg-white w-64 shadow-lg flex-shrink-0 z-50 transition-all duration-300 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static fixed h-full top-0 left-0 pt-16 md:pt-0`}
        >
          <div className="px-4 py-6">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-full bg-tutorTeal/20 flex items-center justify-center text-tutorTeal mb-2">
                <FaUser className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-medium">{currentUser?.displayName || 'Student'}</h2>
              <p className="text-sm text-gray-600">{currentUser?.email}</p>
            </div>
            
            <nav>
              <ul className="space-y-2">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <a 
                      href={item.href} 
                      className="flex items-center text-gray-700 px-4 py-3 rounded-lg hover:bg-tutorTeal/10 hover:text-tutorTeal transition-colors"
                      onClick={(e) => {
                        if (window.innerWidth < 768) {
                          setIsSidebarOpen(false);
                        }
                      }}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-grow p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Your Dashboard</h2>
              <p className="text-gray-600">
                This is your personalized learning space. Here you can manage your courses, schedule tutoring sessions, and track your progress.
              </p>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Sessions</h3>
              <div className="border-t border-gray-100">
                <div className="py-4 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Mathematics: Calculus</h4>
                    <p className="text-sm text-gray-500">with Tutor Nkopo Chaole</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-tutorTeal">Tomorrow, 15:00</p>
                    <span className="text-xs bg-tutorTeal/10 text-tutorTeal px-2 py-1 rounded-full">Confirmed</span>
                  </div>
                </div>
                <div className="py-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Physics: Mechanics</h4>
                    <p className="text-sm text-gray-500">with Tutor Khethisa Lebakeng</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-tutorTeal">Thursday, 16:30</p>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pending</span>
                  </div>
                </div>
              </div>
              <button className="mt-4 w-full py-2 bg-tutorTeal/10 text-tutorTeal rounded-lg hover:bg-tutorTeal/20 transition-colors">
                Book New Session
              </button>
            </div>

            {/* Course Progress */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Courses</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Mathematics</span>
                    <span className="text-sm text-gray-500">75% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-tutorTeal h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Physics</span>
                    <span className="text-sm text-gray-500">40% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-tutorTeal h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Chemistry</span>
                    <span className="text-sm text-gray-500">20% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-tutorTeal h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;