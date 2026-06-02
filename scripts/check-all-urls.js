
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "phdonassolo-site-d2024",
  appId: "1:850356436280:web:79417669fd072299ab15cd",
  storageBucket: "phdonassolo-site-d2024.firebasestorage.app",
  apiKey: "AIzaSyAX481S5Slt18mKPuiDjGtjQSebnVyLyQ0",
  authDomain: "phdonassolo-site-d2024.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkAll() {
  const snapshot = await getDocs(collection(db, 'landing_pages'));
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`--- LP: ${doc.id} ---`);
    console.log(`webAppUrl: ${data.webAppUrl}`);
  });
}

checkAll();
