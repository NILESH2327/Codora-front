// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDt00ntr4RUDftEPpsTMJbcdYQifLkRnls",
  authDomain: "krishi-sakhi-7af72.firebaseapp.com",
  projectId: "krishi-sakhi-7af72",
  storageBucket: "krishi-sakhi-7af72.firebasestorage.app",
  messagingSenderId: "350978014050",
  appId: "1:350978014050:web:6b19c5848641c369ae4a3b",
  measurementId: "G-G36NX3NV9X"
};

const app = getApps().length === 0? initializeApp(firebaseConfig) : getApp();
const firebaseAuth = getAuth(app);
firebaseAuth.useDeviceLanguage();

export {firebaseAuth};