import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../firebase';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component to wrap your app and make auth object available to any child component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register a new user with email and password
  async function register(email, password, displayName) {
    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
      
      // 3. Create a user profile in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName,
        email,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        applications: 0
      });
      
      return userCredential;
    } catch (error) {
      console.error('Error in register function:', error);
      throw error;
    }
  }

  // Login an existing user
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time in Firestore
      const userRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userRef, {
        lastLogin: serverTimestamp()
      }, { merge: true });
      
      return userCredential;
    } catch (error) {
      console.error('Error in login function:', error);
      throw error;
    }
  }

  // Logout the current user
  function logout() {
    setUserProfile(null);
    return signOut(auth);
  }

  // Reset password for a user's email
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Fetch user profile from Firestore
  async function fetchUserProfile(uid) {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
        return userDoc.data();
      } else {
        console.log('No user profile found');
        setUserProfile(null);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
      return null;
    }
  }

  // Update user profile
  async function updateUserProfile(data) {
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      // Refresh the profile
      return fetchUserProfile(currentUser.uid);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user profile when user logs in
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Define the value object with all auth functions and state
  const value = {
    currentUser,
    userProfile,
    loading,
    register,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}