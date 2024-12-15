// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA05Tvk0zTITUSSSt0_D2392-XsSkYHHb4",
  authDomain: "erp-optimizi.firebaseapp.com",
  projectId: "erp-optimizi",
  storageBucket: "erp-optimizi.firebasestorage.app",
  messagingSenderId: "211246149410",
  appId: "1:211246149410:web:ac27b811cab049dc263f7b",
  measurementId: "G-9QYJEJ7ZZF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
