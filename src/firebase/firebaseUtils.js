import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  doc, 
  getDoc, 
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './config';

// User related functions
export const getUserData = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    throw error;
  }
};

export const updateUserData = async (userId, userData) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    throw error;
  }
};

// Sessions related functions
export const createSession = async (sessionData) => {
  try {
    const sessionRef = await addDoc(collection(db, "sessions"), {
      ...sessionData,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    return sessionRef.id;
  } catch (error) {
    throw error;
  }
};

export const getUserSessions = async (userId, role = 'student') => {
  try {
    const fieldToQuery = role === 'tutor' ? 'tutorId' : 'studentId';
    const sessionsRef = collection(db, "sessions");
    const q = query(sessionsRef, where(fieldToQuery, "==", userId));
    const querySnapshot = await getDocs(q);
    
    const sessions = [];
    querySnapshot.forEach((doc) => {
      sessions.push({ id: doc.id, ...doc.data() });
    });
    
    return sessions;
  } catch (error) {
    throw error;
  }
};

export const getSessionById = async (sessionId) => {
  try {
    const sessionRef = doc(db, "sessions", sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (sessionSnap.exists()) {
      return { id: sessionSnap.id, ...sessionSnap.data() };
    } else {
      throw new Error('Session not found');
    }
  } catch (error) {
    throw error;
  }
};

export const updateSessionStatus = async (sessionId, status) => {
  try {
    const sessionRef = doc(db, "sessions", sessionId);
    await updateDoc(sessionRef, {
      status,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    throw error;
  }
};

export const cancelSession = async (sessionId) => {
  try {
    return await updateSessionStatus(sessionId, 'cancelled');
  } catch (error) {
    throw error;
  }
};

// Tutors related functions
export const getAllTutors = async () => {
  try {
    const tutorsRef = collection(db, "users");
    const q = query(tutorsRef, where("role", "==", "tutor"));
    const querySnapshot = await getDocs(q);
    
    const tutors = [];
    querySnapshot.forEach((doc) => {
      tutors.push({ id: doc.id, ...doc.data() });
    });
    
    return tutors;
  } catch (error) {
    throw error;
  }
};

export const getTutorsBySubject = async (subject) => {
  try {
    const tutorsRef = collection(db, "users");
    const q = query(
      tutorsRef, 
      where("role", "==", "tutor"),
      where("subjects", "array-contains", subject)
    );
    const querySnapshot = await getDocs(q);
    
    const tutors = [];
    querySnapshot.forEach((doc) => {
      tutors.push({ id: doc.id, ...doc.data() });
    });
    
    return tutors;
  } catch (error) {
    throw error;
  }
};

// Reviews related functions
export const addReview = async (reviewData) => {
  try {
    const reviewRef = await addDoc(collection(db, "reviews"), {
      ...reviewData,
      createdAt: serverTimestamp()
    });
    return reviewRef.id;
  } catch (error) {
    throw error;
  }
};

export const getTutorReviews = async (tutorId) => {
  try {
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef, where("tutorId", "==", tutorId));
    const querySnapshot = await getDocs(q);
    
    const reviews = [];
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    
    return reviews;
  } catch (error) {
    throw error;
  }
};