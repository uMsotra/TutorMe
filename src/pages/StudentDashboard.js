import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaBook, 
  FaCalendarAlt, 
  FaClipboardList, 
  FaUser, 
  FaUserCircle,
  FaGraduationCap,
  FaChalkboardTeacher
} from 'react-icons/fa';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Card, Button, Badge, Avatar, Tab, Table } from '../components/ui';
import { useSessionsSubscription, useResources, useUserDataSubscription } from '../hooks/useFirebase';
import LoadingSpinner from '../components/LoadingSpinner';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { currentUser } = useAuth();
  const { userData, loading: userLoading } = useUserDataSubscription(currentUser?.uid);
  const { sessions, upcomingSessions, pastSessions, loading: sessionsLoading } = useSessionsSubscription(currentUser?.uid, 'student');
  const { resources, accessResource, loading: resourcesLoading } = useResources();
  const navigate = useNavigate();

  // Filter resources by user's subjects
  const filteredResources = resources.filter(resource => 
    userData?.subjects?.includes(resource.subjectId)
  );

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <FaClipboardList />,
      onClick: () => setActiveTab('overview'),
      active: activeTab === 'overview',
    },
    {
      id: 'sessions',
      label: 'My Sessions',
      icon: <FaCalendarAlt />,
      onClick: () => setActiveTab('sessions'),
      active: activeTab === 'sessions',
    },
    {
      id: 'resources',
      label: 'Study Resources',
      icon: <FaBook />,
      onClick: () => setActiveTab('resources'),
      active: activeTab === 'resources',
    },
    {
      id: 'tutors',
      label: 'Find Tutors',
      icon: <FaChalkboardTeacher />,
      onClick: () => setActiveTab('tutors'),
      active: activeTab === 'tutors',
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: <FaUser />,
      onClick: () => setActiveTab('profile'),
      active: activeTab === 'profile',
    },
  ];

  const handleResourceDownload = async (resourceId) => {
    // In a real app, we'd handle the actual download here
    await accessResource(currentUser?.uid, resourceId);
    alert('Resource downloaded successfully!');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <Card
              title={
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-tutorTeal" /> 
                  <span>Upcoming Sessions</span>
                </div>
              }
              footer={
                <Button fullWidth onClick={() => setActiveTab('sessions')}>
                  View All Sessions
                </Button>
              }
            >
              {sessionsLoading ? (
                <div className="flex justify-center py-4">
                  <LoadingSpinner />
                </div>
              ) : upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.slice(0, 3).map(session => (
                    <div key={session.id} className="border-l-4 border-tutorTeal pl-4 py-2">
                      <p className="font-semibold text-gray-800">{session.subject}</p>
                      <p className="text-sm text-gray-600">Topic: {session.topic}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(session.date).toLocaleDateString()} at {new Date(session.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 py-4">No upcoming sessions scheduled.</p>
              )}
            </Card>

            <Card
              title={
                <div className="flex items-center">
                  <FaBook className="mr-2 text-tutorTeal" /> 
                  <span>Study Resources</span>
                </div>
              }
              footer={
                <Button fullWidth onClick={() => setActiveTab('resources')}>
                  Browse All Resources
                </Button>
              }
            >
              {resourcesLoading ? (
                <div className="flex justify-center py-4">
                  <LoadingSpinner />
                </div>
              ) : filteredResources.length > 0 ? (
                <div className="space-y-3">
                  {filteredResources.slice(0, 3).map(resource => (
                    <div key={resource.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium text-gray-800">{resource.title}</p>
                        <p className="text-sm text-gray-600">{resource.subjectId} · {resource.type}</p>
                      </div>
                      {resource.isPremium ? (
                        <Badge variant="premium" rounded>Premium</Badge>
                      ) : (
                        <Badge variant="success" rounded>Free</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 py-4">No resources available for your subjects.</p>
              )}
            </Card>

            <Card
              title={
                <div className="flex items-center">
                  <FaGraduationCap className="mr-2 text-tutorTeal" /> 
                  <span>My Progress</span>
                </div>
              }
              className="md:col-span-2"
            >
              <div className="text-center py-8">
                <p className="text-gray-600">Progress tracking features coming soon!</p>
                <p className="text-sm text-gray-500 mt-2">Track your learning and see your improvement over time.</p>
              </div>
            </Card>
          </div>
        );
        
      case 'sessions':
        return (
          <Card title="My Tutoring Sessions">
            <Tab
              tabs={[
                { id: 'upcoming', label: 'Upcoming Sessions' },
                { id: 'past', label: 'Past Sessions' },
                { id: 'book', label: 'Book New Session' },
              ]}
              activeTab="upcoming"
              onChange={(tabId) => console.log('Changed tab to', tabId)}
              className="mb-6"
            />
            
            {sessionsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : upcomingSessions.length > 0 ? (
              <Table
                columns={[
                  { key: 'subject', title: 'Subject' },
                  { key: 'topic', title: 'Topic' },
                  { key: 'date', title: 'Date & Time', render: (row) => (
                    <span>
                      {new Date(row.date).toLocaleDateString()} at {new Date(row.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  )},
                  { key: 'duration', title: 'Duration', render: (row) => (
                    <span>{row.duration} minutes</span>
                  )},
                  { key: 'actions', title: 'Actions', render: (row) => (
                    <div className="space-x-2">
                      <Button size="sm" variant="outline">Reschedule</Button>
                      <Button size="sm" variant="danger">Cancel</Button>
                    </div>
                  )},
                ]}
                data={upcomingSessions}
                emptyMessage="No upcoming sessions scheduled."
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-700 mb-4">You don't have any upcoming sessions</p>
                <Button variant="primary">Book a Session</Button>
              </div>
            )}
          </Card>
        );
        
      case 'resources':
        return (
          <Card title="Study Resources">
            <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-700">Available Resources</h3>
                <p className="text-sm text-gray-500">Access study materials for your subjects</p>
              </div>
              
              <div className="flex gap-2">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-tutorTeal focus:border-tutorTeal">
                  <option>All Subjects</option>
                  {userData?.subjects?.map(subject => (
                    <option key={subject} value={subject}>
                      {subject.charAt(0).toUpperCase() + subject.slice(1)}
                    </option>
                  ))}
                </select>
                
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-tutorTeal focus:border-tutorTeal">
                  <option>All Types</option>
                  <option>PDF</option>
                  <option>Video</option>
                  <option>Quiz</option>
                </select>
              </div>
            </div>
            
            {resourcesLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map(resource => (
                  <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">{resource.title}</h4>
                      {resource.isPremium ? (
                        <Badge variant="premium">Premium</Badge>
                      ) : (
                        <Badge variant="success">Free</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {resource.subjectId.charAt(0).toUpperCase() + resource.subjectId.slice(1)} · {resource.type}
                      </span>
                      <Button 
                        size="sm"
                        variant={
                          resource.isPremium && userData?.subscriptionPlan !== 'premium'
                            ? 'secondary'
                            : 'primary'
                        }
                        disabled={resource.isPremium && userData?.subscriptionPlan !== 'premium'}
                        onClick={() => handleResourceDownload(resource.id)}
                      >
                        {resource.isPremium && userData?.subscriptionPlan !== 'premium'
                          ? 'Upgrade to Access'
                          : 'Access'
                        }
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {userData?.subscriptionPlan === 'free' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
                <h3 className="font-semibold text-amber-800 mb-2">Access Limit</h3>
                <p className="text-amber-700 mb-3">
                  You've accessed {userData.freeResourcesAccessed}/2 free resources. 
                  Upgrade to premium to unlock all content.
                </p>
                <Button
                  variant="primary"
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Upgrade to Premium
                </Button>
              </div>
            )}
          </Card>
        );
        
      case 'tutors':
        return (
          <Card title="Find Tutors">
            <div className="text-center py-8">
              <p className="text-gray-700 mb-2">Coming Soon!</p>
              <p className="text-gray-600">
                We're currently working on a feature that will allow you to browse and connect with our tutors.
                Check back soon for updates!
              </p>
            </div>
          </Card>
        );
        
      case 'profile':
        return (
          <Card title="My Profile">
            {userLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div>
                <div className="flex flex-col md:flex-row md:items-start mb-8">
                  <div className="md:mr-8 mb-4 md:mb-0">
                    <Avatar
                      size="xxl"
                      icon={<FaUserCircle className="w-14 h-14 text-tutorTeal" />}
                      alt={userData?.fullName}
                    />
                    <button className="mt-4 w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      Change Photo
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{userData?.fullName}</h3>
                    <p className="text-gray-600">{currentUser?.email}</p>
                    <p className="text-sm text-gray-500 mt-1">Student since {new Date(userData?.createdAt).toLocaleDateString()}</p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center">
                        <span className="text-gray-500 w-24">Subjects:</span>
                        <div className="flex flex-wrap gap-2">
                          {userData?.subjects?.map((subject, idx) => (
                            <Badge key={idx} variant="primary" rounded>
                              {subject.charAt(0).toUpperCase() + subject.slice(1)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 w-24">Grade:</span>
                        <span>{userData?.grade || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 w-24">School:</span>
                        <span>{userData?.schoolName || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 w-24">Phone:</span>
                        <span>{userData?.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 w-24">Plan:</span>
                        <Badge variant={userData?.subscriptionPlan === 'premium' ? 'premium' : 'default'}>
                          {userData?.subscriptionPlan === 'premium' ? 'Premium' : 'Free Plan'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="font-semibold text-lg mb-4 text-gray-700">Referral Program</h3>
                  {userData?.referralCode && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Your Referral Code</p>
                      <div className="flex">
                        <input 
                          type="text" 
                          value={userData.referralCode} 
                          readOnly 
                          className="flex-grow bg-white border border-gray-300 rounded-l-lg px-3 py-2 text-gray-700"
                        />
                        <button className="bg-tutorTeal text-white px-4 py-2 rounded-r-lg hover:bg-tutorTeal/80 transition-colors">
                          Copy
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Share your code and earn free sessions when friends sign up!
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="font-semibold text-lg mb-4 text-gray-700">Account Management</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="primary">
                      Edit Profile
                    </Button>
                    <Button variant="secondary">
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        );
        
      default:
        return <div>Tab content not found</div>;
    }
  };

  return (
    <DashboardLayout
      title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
      navItems={navItems}
    >
      {renderTabContent()}
    </DashboardLayout>
  );
};

export default StudentDashboard;