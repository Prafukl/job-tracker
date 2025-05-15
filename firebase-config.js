// Firebase configuration - Replace with your own config
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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();