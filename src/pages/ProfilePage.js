import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from '../firebase/config';
import { FaUser, FaEnvelope, FaPhone, FaBook, FaSave, FaExclamationCircle } from 'react-icons/fa';
import AuthNavigation from '../components/AuthNavigation';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    subjects: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData({
            name: data.name || '',
            email: data.email || currentUser.email || '',
            phone: data.phone || '',
            subjects: data.subjects || '',
          });
        } else {
          // If no user document exists, initialize with auth data
          setUserData({
            name: currentUser.displayName || '',
            email: currentUser.email || '',
            phone: '',
            subjects: '',
          });
        }
      } catch (error) {
        setError("Failed to load profile data. Please try again later.");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      // Update Firestore document
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        name: userData.name,
        phone: userData.phone,
        subjects: userData.subjects,
        // Don't update email in Firestore as it requires special auth handling
      });
      
      // Update Auth profile (display name)
      await updateProfile(currentUser, {
        displayName: userData.name
      });
      
      setSuccess("Profile updated successfully!");
    } catch (error) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthNavigation />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-tutorTeal"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-tutorTeal px-6 py-4">
              <h1 className="text-2xl font-bold text-white">My Profile</h1>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                  <div className="flex items-center">
                    <FaExclamationCircle className="mr-2" />
                    <p>{error}</p>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 text-green-700">
                  <p>{success}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-tutorTeal focus:border-tutorTeal"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userData.email}
                      disabled
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed text-gray-500"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-tutorTeal focus:border-tutorTeal"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subjects" className="block text-sm font-medium text-gray-700">Subjects of Interest</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBook className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="subjects"
                      name="subjects"
                      value={userData.subjects}
                      onChange={handleInputChange}
                      placeholder="e.g., Mathematics, Chemistry, Physics"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-tutorTeal focus:border-tutorTeal"
                    />
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={saving}
                    className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-tutorTeal hover:bg-tutorTeal/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tutorTeal ${
                      saving ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2 h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;