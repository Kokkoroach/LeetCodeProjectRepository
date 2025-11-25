import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
// Replace these values with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyDSmsSYfWlAFfjsCj6nK7lHSE84YoORPAg",
  authDomain: "nyc-transit-hub-97ccc.firebaseapp.com",
  projectId: "nyc-transit-hub-97ccc",
  storageBucket: "nyc-transit-hub-97ccc.firebasestorage.app",
  messagingSenderId: "443168278446",
  appId: "1:443168278446:web:b71e0f4c2c484294666a3f",
  measurementId: "G-78K82Y425C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
const analytics = getAnalytics(app);

export default app;