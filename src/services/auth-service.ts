import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    UserCredential,
  } from 'firebase/auth';
  import { auth } from '../../firebase.config';
  
  export const registerUser = (email: string, password: string): Promise<UserCredential> => {
      return createUserWithEmailAndPassword(auth, email, password);
  };
  
  
  export const loginUser = (email: string, password: string): Promise<UserCredential> => {
      return signInWithEmailAndPassword(auth, email, password);
  };
  
  
  export const logoutUser = () => {
      return signOut(auth);
  };
  
  export const forgotPassword = async (email: string): Promise<void> => {
      return sendPasswordResetEmail(auth, email);
  };
    