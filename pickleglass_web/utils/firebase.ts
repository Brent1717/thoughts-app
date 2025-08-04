// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDUpfP1aqbACU0vnNl5lZTXNZzPL2yDa80",
  authDomain: "ai-assistant-25395.firebaseapp.com",
  projectId: "ai-assistant-25395",
  storageBucket: "ai-assistant-25395.firebasestorage.app",
  messagingSenderId: "79029411867",
  appId: "1:79029411867:web:e13b6efee3ae01dad358be"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);
// const analytics = getAnalytics(app);

export { app, auth, firestore }; 