// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics"; // Optional, comment out if not using

// Your web app's Firebase configuration
//-----------------store firebase confin in env.ts, and import all from this.... ---------------
const firebaseConfig = {
  apiKey: "AIzaSyChPQ9xAcI7w28poWayX6-edCyMRJBQZq4",
  authDomain: "leave-management-app-ba528.firebaseapp.com",
  projectId: "leave-management-app-ba528",
  storageBucket: "leave-management-app-ba528.appspot.com", // fixed here
  messagingSenderId: "106594051740",
  appId: "1:106594051740:web:1cdba8d821007fb4e72f59",
  measurementId: "G-KWEHDDHQ19"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: Only if you plan to use Google Analytics in production
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const firestore = getFirestore(app);