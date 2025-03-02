import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCrCSuscVVD4ICYQY5dO3nwYVarATL3KkY",
    authDomain: "esp-32-37b13.firebaseapp.com",
    databaseURL: "https://esp-32-37b13-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "esp-32-37b13",
    storageBucket: "esp-32-37b13.firebasestorage.app",
    messagingSenderId: "257166498432",
    appId: "1:257166498432:web:92ec2b12a3e58c4b416465",
    measurementId: "G-9LDD5X985T"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getDatabase(app);

export { auth, googleProvider, db };