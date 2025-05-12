import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaBook, 
  FaCalendarAlt, 
  FaChalkboardTeacher, 
  FaClipboardList, 
  FaSignOutAlt, 
  FaUser, 
  FaUserCircle,
  FaUsers,
  FaDollarSign,
  FaCog,
  FaLock
} from 'react-icons/fa';

const TutorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  // Mock data for the dashboard
  const upcomingSessions = [
    { id: 1, subject: 'Mathematics', student: 'Thabiso Mokone', date: '15 May 2025', time: '14:00 - 15:30' },
    { id: 2, subject: 'Physics', student: 'Lerato Khoele', date: '18 May 2025', time: '10:00 - 11:30' },
  ];

  const myStudents = [
    { id: 1, name: 'Thabiso Mokone', subjects: ['Mathematics'], sessions: 12, lastSession: '10 May 2025' },
    { id: 2, name: 'Lerato Khoele', subjects: ['Physics'], sessions: 5, lastSession: '12 May 2025' },
    { id: 3, name: 'Mpho Ndlovu', subjects: ['Mathematics', 'Chemistry'], sessions: 8, lastSession: '9 May 2025' },
  ];

  const recentEarnings = [
    { id: 1, date: '12 May 2025', student: 'Thabiso Mokone', subject: 'Mathematics', duration: '1.5 hours', amount: 225 },
    { id: 2, date: '10 May 2025', student: 'Mpho Ndlovu', subject: 'Chemistry', duration: '2 hours', amount: 300 },
    { id: 3, date: '8 May 2025', student: 'Lerato Khoele', subject: 'Physics', duration: '1 hour', amount: 150 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center">
                <FaCalendarAlt className="mr-2 text-tutorTeal" /> Upcoming Sessions
              </h3>
              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map(session => (
                    <div key={session.id} className="border-l-4 border-tutorTeal pl-4 py-2">
                      <p className="font-semibold text-gray-800">{session.subject}</p>
                      <p className="text-sm text-gray-600">Student: {session.student}</p>
                      <p className="text-sm text-gray-600">{session.date}, {session.time}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No upcoming sessions scheduled.</p>
              )}
              <button className="mt-4 w-full bg-tutorTeal text-white py-2 rounded-lg hover:bg-tutorTeal/80 transition-colors">
                Manage Schedule
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center">
                <FaUsers className="mr-2 text-tutorTeal" /> My Students
              </h3>
              {myStudents.slice(0, 3).map(student => (
                <div key={student.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-800">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.subjects.join(', ')} · {student.sessions} sessions</p>
                  </div>
                  <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1 px-2 rounded transition-colors">
                    View
                  </button>
                </div>
              ))}
              <button className="mt-4 w-full bg-tutorTeal text-white py-2 rounded-lg hover:bg-tutorTeal/80 transition-colors">
                View All Students
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800 flex items-center">
                  <FaDollarSign className="mr-2 text-tutorTeal" /> Recent Earnings
                </h3>
                <span className="text-tutorTeal font-medium">R{recentEarnings.reduce((sum, item) => sum + item.amount, 0)} Total</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentEarnings.map(earning => (
                      <tr key={earning.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{earning.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{earning.student}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{earning.subject}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{earning.duration}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">R{earning.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      case 'sessions':
        return (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-bold text-xl mb-6 text-gray-800">My Teaching Schedule</h2>
            
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-700">Upcoming Sessions</h3>
              {upcomingSessions.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {upcomingSessions.map(session => (
                    <div key={session.id} className="py-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">{session.subject}</p>
                        <p className="text-sm text-gray-600">Student: {session.student}</p>
                        <p className="text-sm text-gray-600">{session.date}, {session.time}</p>
                      </div>
                      <div className="space-x-2">
                        <button className="px-3 py-1 bg-tutorTeal text-white text-sm rounded hover:bg-tutorTeal/80 transition-colors">
                          Reschedule
                        </button>
                        <button className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No upcoming sessions scheduled.</p>
              )}
            </div>
            
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4 text-gray-700">Set Your Availability</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-4">Mark your available time slots for students to book sessions with you.</p>
                <button className="bg-tutorTeal text-white py-2 px-4 rounded-lg hover:bg-tutorTeal/80 transition-colors">
                  Manage Availability
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'students':
        return (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-bold text-xl mb-6 text-gray-800">My Students</h2>
            
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg text-gray-700">Active Students</h3>
                <p className="text-sm text-gray-500">You currently have {myStudents.length} active students</p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search students..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-tutorTeal focus:border-tutorTeal"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Session</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {myStudents.map(student => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-tutorTeal/10 rounded-full flex items-center justify-center mr-3">
                            <FaUserCircle className="w-5 h-5 text-tutorTeal" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{student.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {student.subjects.map((subject, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-tutorTeal/10 text-tutorTeal rounded-full">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.sessions} sessions</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.lastSession}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-tutorTeal hover:text-tutorTeal/80 mr-3">View Profile</button>
                        <button className="text-tutorTeal hover:text-tutorTeal/80">Schedule</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'earnings':
        return (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-bold text-xl mb-6 text-gray-800">Earnings Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-2xl font-bold text-gray-800">R2,250</p>
                <p className="text-xs text-green-600 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                  </svg>
                  15% from last month
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Hours</p>
                <p className="text-2xl font-bold text-gray-800">15 hrs</p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Hourly Rate</p>
                <p className="text-2xl font-bold text-gray-800">R150</p>
                <button className="text-xs text-tutorTeal">Update Rate</button>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4 text-gray-700">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentEarnings.map(earning => (
                      <tr key={earning.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{earning.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{earning.student}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{earning.subject}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{earning.duration}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">R{earning.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4 text-gray-700">Payment Settings</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-4">Update your payment information and preferences</p>
                <button className="bg-tutorTeal text-white py-2 px-4 rounded-lg hover:bg-tutorTeal/80 transition-colors">
                  Manage Payment Settings
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'profile':
        return (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-bold text-xl mb-6 text-gray-800">My Profile</h2>
            
            <div className="flex flex-col md:flex-row md:items-start mb-8">
              <div className="md:mr-8 mb-4 md:mb-0">
                <div className="w-32 h-32 bg-tutorTeal/10 rounded-full flex items-center justify-center">
                  <FaUserCircle className="w-20 h-20 text-tutorTeal" />
                </div>
                <button className="mt-4 w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                  Change Photo
                </button>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">{userData?.fullName || currentUser?.displayName}</h3>
                <p className="text-gray-600">{currentUser?.email}</p>
                <p className="text-sm text-gray-500 mt-1">Tutor since {new Date(userData?.createdAt).toLocaleDateString()}</p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <span className="text-gray-500 w-24">Subjects:</span>
                    <div className="flex flex-wrap gap-2">
                      {userData?.subjects?.map((subject, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-tutorTeal/10 text-tutorTeal rounded-full">
                          {subject.charAt(0).toUpperCase() + subject.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 w-24">Hourly Rate:</span>
                    <span>R{userData?.hourlyRate || 150}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 w-24">Phone:</span>
                    <span>{userData?.phone}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-700">Professional Bio</h3>
              <p className="text-gray-600 mb-4">{userData?.bio || "Tell your students about your qualifications, experience, and teaching style."}</p>
              <button className="text-tutorTeal hover:text-tutorTeal/80 font-medium">Edit Bio</button>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-700">Account Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center justify-center bg-tutorTeal text-white py-2 px-4 rounded-lg hover:bg-tutorTeal/80 transition-colors">
                  <FaCog className="mr-2" /> Edit Profile
                </button>
                <button className="flex items-center justify-center bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  <FaLock className="mr-2" /> Change Password
                </button>
              </div>
            </div>
          </div>
        );
        
      default:
        return <div>Tab content not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-tutorTeal text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-extrabold">TutorMe</h1>
            <div className="flex items-center space-x-4">
              <button onClick={handleLogout} className="flex items-center space-x-1 hover:text-tutorGray transition-colors">
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="md:w-64 bg-white rounded-xl shadow-md p-6 h-fit">
            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-tutorTeal/20 rounded-full flex items-center justify-center">
                  <FaUserCircle className="w-6 h-6 text-tutorTeal" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{userData?.fullName || currentUser?.displayName}</p>
                  <p className="text-xs text-gray-500">Tutor</p>
                </div>
              </div>
            </div>
            
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-tutorTeal text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaClipboardList />
                <span>Overview</span>
              </button>
              
              <button
                onClick={() => setActiveTab('sessions')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'sessions'
                    ? 'bg-tutorTeal text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaCalendarAlt />
                <span>Sessions & Schedule</span>
              </button>
              
              <button
                onClick={() => setActiveTab('students')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'students'
                    ? 'bg-tutorTeal text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaUsers />
                <span>My Students</span>
              </button>
              
              <button
                onClick={() => setActiveTab('earnings')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'earnings'
                    ? 'bg-tutorTeal text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaDollarSign />
                <span>Earnings</span>
              </button>
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-tutorTeal text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaUser />
                <span>My Profile</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;