import {
  collection, query, orderBy, getDocs,
  addDoc, updateDoc, deleteDoc, doc,
} from 'firebase/firestore';
import { db } from './firebase';

export interface CursoExterno {
  id: string;
  titulo: string;
  descricao: string;
  plataforma: 'udemy' | 'espm';
  categoria: string;
  carga_horaria: string;
  nivel: string;
  thumb_url: string;
  url_externo: string;
  gratuito: boolean;
  publicado: boolean;
  ordem: number;
}

type CursoExternoInput = Omit<CursoExterno, 'id'>;

// Busca tudo ordenado por ordem e filtra client-side — evita índice composto no Firestore.
const fetchAll = async (): Promise<CursoExterno[]> => {
  const q = query(collection(db, 'cursos_externos'), orderBy('ordem', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as CursoExterno));
};

// Leitura pública: apenas publicado=true, filtro opcional por plataforma.
export const getCursosExternos = async (
  plataforma?: 'udemy' | 'espm'
): Promise<CursoExterno[]> => {
  const todos = await fetchAll();
  const publicados = todos.filter(c => c.publicado);
  return plataforma ? publicados.filter(c => c.plataforma === plataforma) : publicados;
};

// Admin: todos, incluindo não publicados.
export const getAllCursosExternos = async (): Promise<CursoExterno[]> => fetchAll();

export const saveCursoExterno = async (
  data: CursoExternoInput & { id?: string }
): Promise<void> => {
  const { id, ...fields } = data as CursoExterno;
  if (id) {
    await updateDoc(doc(db, 'cursos_externos', id), fields);
  } else {
    await addDoc(collection(db, 'cursos_externos'), fields);
  }
};

export const deleteCursoExterno = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'cursos_externos', id));
};
