import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase-config';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

class AuthService {
  // Sign up new user
  async signUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user in backend database
      await axios.post(`${API_URL}/users`, {
        firebase_uid: user.uid,
        email: user.email
      });
      
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Sign in existing user
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Sign out user
  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Get user data from backend
  async getUserData(firebaseUid) {
    try {
      const response = await axios.get(`${API_URL}/users/${firebaseUid}`);
      return response.data.user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new AuthService();