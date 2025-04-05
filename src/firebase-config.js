import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCXln2JUz_Ire8wV1zfO9mIf36W0l2milI",
  authDomain: "swipscout.firebaseapp.com",
  projectId: "swipscout",
  storageBucket: "swipscout.firebasestorage.app",
  messagingSenderId: "352199048599",
  appId: "1:352199048599:web:5eb2570d9c331d18b598d2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };

 