import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDiCYpWDDfAcQPFUF6xTf2yUJlXJfbHWeg",
  authDomain: "job-tracker-c2a87.firebaseapp.com",
  projectId: "job-tracker-c2a87",
  storageBucket: "job-tracker-c2a87.firebasestorage.app",
  messagingSenderId: "524021708857",
  appId: "1:524021708857:web:2132c02d59724b78bff5e8",
  measurementId: "G-GKEXBM61HV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export authentication, firestore and storage for use throughout the app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;