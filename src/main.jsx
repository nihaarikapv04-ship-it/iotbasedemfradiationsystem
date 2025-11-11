import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')).render(<App />);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const analytics = getAnalytics(app);