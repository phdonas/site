
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "phdonassolo-site-d2024",
  appId: "1:850356436280:web:79417669fd072299ab15cd",
  storageBucket: "phdonassolo-site-d2024.firebasestorage.app",
  apiKey: "AIzaSyAX481S5Slt18mKPuiDjGtjQSebnVyLyQ0",
  authDomain: "phdonassolo-site-d2024.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixLP() {
  const slug = 'ebook-custo-entrega';
  const correctUrl = 'https://script.google.com/macros/s/AKfycbwAz17lsqIudknZuxeWf8OG5wJhEAf_UTJ1_H0yiSGyjleipJ9gRu68dx9hNrWYimtL/exec';
  const docRef = doc(db, 'landing_pages', slug);
  await updateDoc(docRef, {
    webAppUrl: correctUrl,
    materialId: 'ebook-custo-entrega'
  });
  console.log("LP fixed: " + slug);
}

fixLP();
