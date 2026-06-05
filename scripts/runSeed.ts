import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { seedAll } from './seedFirestore.ts';

const app = initializeApp({
  projectId: 'phdonassolo-site-d2024',
  apiKey: 'AIzaSyAX481S5Slt18mKPuiDjGtjQSebnVyLyQ0',
  authDomain: 'phdonassolo-site-d2024.firebaseapp.com',
  storageBucket: 'phdonassolo-site-d2024.firebasestorage.app',
});

const db = getFirestore(app);

console.log('Seeding all 7 pages...');
await seedAll(db);
console.log('Seed complete!');
process.exit(0);
