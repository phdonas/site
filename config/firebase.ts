import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: "phdonassolo-site-d2024",
  appId: "1:850356436280:web:79417669fd072299ab15cd",
  storageBucket: "phdonassolo-site-d2024.firebasestorage.app",
  apiKey: "AIzaSyAX481S5Slt18mKPuiDjGtjQSebnVyLyQ0",
  authDomain: "phdonassolo-site-d2024.firebaseapp.com",
  messagingSenderId: "850356436280",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
