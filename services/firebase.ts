import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAX481S5Slt18mKPuiDjGtjQSebnVyLyQ0",
  authDomain: "phdonassolo-site-d2024.firebaseapp.com",
  projectId: "phdonassolo-site-d2024",
  storageBucket: "phdonassolo-site-d2024.firebasestorage.app",
  messagingSenderId: "850356436280",
  appId: "1:850356436280:web:79417669fd072299ab15cd"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
