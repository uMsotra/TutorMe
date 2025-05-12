import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { ref, set, onValue, off } from 'firebase/database';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  async function signup(email, password, fullName, phone, subjects, role, additionalData = {}) {
    try {
      setLoading(true);
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: fullName
      });

      // Generate referral code
      const referralCode = generateReferralCode(fullName);

      // Create user data in Realtime Database
      const userPath = `users/${role}s/${userCredential.user.uid}`;
      
      await set(ref(db, userPath), {
        fullName,
        email,
        phone,
        subjects,
        role, // 'student' or 'tutor'
        createdAt: new Date().toISOString(),
        freeResourcesAccessed: 0,
        referralCode,
        // Additional fields for tutors
        ...(role === 'tutor' && {
          bio: additionalData.bio || '',
          hourlyRate: additionalData.hourlyRate || 0,
          expertise: subjects,
          rating: 0,
          completedSessions: 0,
          availability: {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: []
          }
        }),
        // Additional fields for students
        ...(role === 'student' && {
          grade: additionalData.grade || '',
          schoolName: additionalData.schoolName || '',
          subscriptionPlan: 'free'
        })
      });

      return userCredential.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  function generateReferralCode(name) {
    // Generate a simple referral code based on name and random digits
    const namePart = name.split(' ')[0].substring(0, 4).toUpperCase();
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `${namePart}${randomPart}`;
  }

  async function login(email, password) {
    try {
      setLoading(true);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      setLoading(true);
      return await signOut(auth);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // First check tutors collection
        const tutorRef = ref(db, `users/tutors/${user.uid}`);
        
        onValue(tutorRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setUserData(data);
            setUserRole('tutor');
            setLoading(false);
          } else {
            // If not a tutor, check students collection
            const studentRef = ref(db, `users/students/${user.uid}`);
            
            onValue(studentRef, (snapshot) => {
              if (snapshot.exists()) {
                const data = snapshot.val();
                setUserData(data);
                setUserRole('student');
                setLoading(false);
              } else {
                // User exists in Auth but not in database
                console.error("User exists in Auth but not in database");
                setUserData(null);
                setUserRole(null);
                setLoading(false);
              }
            }, (error) => {
              console.error("Error fetching student data:", error);
              setLoading(false);
            });
          }
        }, (error) => {
          console.error("Error fetching tutor data:", error);
          setLoading(false);
        });
      } else {
        setUserData(null);
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      // Cleanup database listeners
      if (currentUser) {
        const tutorRef = ref(db, `users/tutors/${currentUser.uid}`);
        const studentRef = ref(db, `users/students/${currentUser.uid}`);
        off(tutorRef);
        off(studentRef);
      }
    };
  }, []);

  // Function to get available subjects from database
  const [availableSubjects, setAvailableSubjects] = useState([
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' }
  ]);

  useEffect(() => {
    const subjectsRef = ref(db, 'subjects');
    
    onValue(subjectsRef, (snapshot) => {
      if (snapshot.exists()) {
        const subjectsData = snapshot.val();
        const formattedSubjects = Object.keys(subjectsData).map(key => ({
          value: key,
          label: subjectsData[key].name
        }));
        
        setAvailableSubjects(formattedSubjects);
      }
    }, (error) => {
      console.error("Error fetching subjects:", error);
    });

    return () => {
      off(subjectsRef);
    };
  }, []);

  const value = {
    currentUser,
    userData,
    userRole,
    availableSubjects,
    loading,
    signup,
    login,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}