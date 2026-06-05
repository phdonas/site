import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const app = initializeApp({
  projectId: 'phdonassolo-site-d2024',
  apiKey: 'AIzaSyAX481S5Slt18mKPuiDjGtjQSebnVyLyQ0',
  authDomain: 'phdonassolo-site-d2024.firebaseapp.com',
});
const db = getFirestore(app);

async function inspect() {
  const snap = await getDocs(collection(db, 'articles'));

  const tagValues = new Map<string, number>();

  snap.docs.forEach(d => {
    const data = d.data() as any;
    if (Array.isArray(data.tags)) {
      data.tags.forEach((t: string) => tagValues.set(t, (tagValues.get(t) || 0) + 1));
    }
  });

  console.log('=== CAMPO: tags (valor → contagem de artigos) ===');
  [...tagValues.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([v, n]) => console.log(`  "${v}" → ${n} artigos`));

  // Also show pillarId distribution
  const pillarCount = new Map<string, number>();
  snap.docs.forEach(d => {
    const data = d.data() as any;
    if (Array.isArray(data.pillarIds)) {
      data.pillarIds.forEach((p: string) => pillarCount.set(p, (pillarCount.get(p) || 0) + 1));
    }
  });
  console.log('\n=== CAMPO: pillarIds (valor → contagem) ===');
  [...pillarCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([v, n]) => console.log(`  "${v}" → ${n} artigos`));

  process.exit(0);
}

inspect().catch(e => { console.error(e); process.exit(1); });
