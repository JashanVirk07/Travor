// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBKsWkFoJ0PjasxS-m7RNaY1LiWD2ptwL0",
  authDomain: "travor-5908e.firebaseapp.com",
  projectId: "travor-5908e",
  storageBucket: "travor-5908e.appspot.com", // corrected: '.app' → '.appspot.com'
  messagingSenderId: "364213716234",
  appId: "1:364213716234:web:7435275dc47f5a132826f3",
  measurementId: "G-J23EV8G22Q"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
