// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDcJ30wscjakBDKhnYykRG_kxAgXsvO4U4",
  authDomain: "tutormedotcom.firebaseapp.com",
  projectId: "tutormedotcom",
  storageBucket: "tutormedotcom.firebasestorage.app",
  messagingSenderId: "416193200823",
  appId: "1:416193200823:web:bb2aa186f68862ab37c332",
  measurementId: "G-69QMZ8TL5F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { auth, db, storage };