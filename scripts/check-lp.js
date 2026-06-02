
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "phdonassolo-site-d2024",
  appId: "1:850356436280:web:79417669fd072299ab15cd",
  storageBucket: "phdonassolo-site-d2024.firebasestorage.app",
  apiKey: "AIzaSyAX481S5Slt18mKPuiDjGtjQSebnVyLyQ0",
  authDomain: "phdonassolo-site-d2024.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkLP() {
  const slug = 'ebook-custo-entrega';
  const docRef = doc(db, 'landing_pages', slug);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    console.log("--- LP: " + slug + " ---");
    console.log("materialId: " + snap.data().materialId);
    console.log("webAppUrl: " + snap.data().webAppUrl);
  } else {
    console.log("LP not found: " + slug);
  }
}

checkLP();
