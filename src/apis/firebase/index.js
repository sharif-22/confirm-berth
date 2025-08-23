// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9kKUjDwSS05zgkdQ9yWdNNJMKq509EaM",
  authDomain: "confirm-berth.firebaseapp.com",
  projectId: "confirm-berth",
  storageBucket: "confirm-berth.firebasestorage.app",
  messagingSenderId: "529936653392",
  appId: "1:529936653392:web:7dd6c0f962aee4aa610555",
  measurementId: "G-TBE47MM6F2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

// Auth
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { auth } from "./firebase";
import { api } from "../axios.js"; // axios instance with baseURL + withCredentials:true

// const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    // Step 1: Firebase popup
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Step 2: Get Firebase ID token
    const idToken = await user.getIdToken();

    // Step 3: Send to backend to exchange for your own JWT (in cookie)
    const res = await api.post(
      "/auth/google",
      {},
      { headers: { Authorization: `Bearer ${idToken}` } },
    );

    console.log("Backend session created:", res.data);

    // Step 4: Return both frontend + backend info
    return {
      firebaseUser: user,
      backendUser: res.data.user,
      message: res.data.message,
    };
  } catch (error) {
    console.error("Google sign-in failed:", error);
    throw error;
  }
};

// Check session (on page reload)
export const checkSession = async () => {
  try {
    const res = await api.get("/auth/me", { withCredentials: true });
    return res.data.user;
  } catch (error) {
    return null; // not logged in
  }
};

// Logout
export const logout = async () => {
  await api.post("/auth/logout", {}, { withCredentials: true });
};

export const firebaseSignOut = () => signOut(auth);
