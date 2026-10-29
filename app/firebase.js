import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAkPi0XwEWUqjqH7D4-rfWxzDk77tHLOds",
  authDomain: "indiepulse-app.firebaseapp.com",
  projectId: "indiepulse-app",
  storageBucket: "indiepulse-app.firebasestorage.app",
  messagingSenderId: "205468452506",
  appId: "1:205468452506:web:5abaa26dcf045706a3c123",
  measurementId: "G-385Q8FPELX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);