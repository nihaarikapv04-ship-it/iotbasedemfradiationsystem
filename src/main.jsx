import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOGp_Z6UMgsuL5vyNDNe0ZOqxDnCaI2Z4",
  authDomain: "mini-project-754ff.firebaseapp.com",
  databaseURL: "https://mini-project-754ff-default-rtdb.firebaseio.com",
  projectId: "mini-project-754ff",
  storageBucket: "mini-project-754ff.firebasestorage.app",
  messagingSenderId: "311695524219",
  appId: "1:311695524219:web:42bce530aa84b007957dde",
  measurementId: "G-H4XBXW6MF4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (with error handling for development)
let analytics;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn("Analytics initialization failed (this is OK in development):", error);
}

// Initialize Realtime Database
const database = getDatabase(app);

// Render the App component with the database instance
createRoot(document.getElementById('root')).render(<App database={database} />);