
export type PillarId = 'prof-paulo' | 'consultoria-imobiliaria' | '4050oumais' | 'academia-do-gas';

export interface Article {
  id: string;
  title: string;
  pillarId: PillarId;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  imageUrl: string;
}

export interface Pillar {
  id: PillarId;
  title: string;
  description: string;
  longDescription?: string;
  imageUrl?: string;
  icon: string;
  accentColor: string;
  link: string;
}

export interface Resource {
  id: string;
  name: string;
  category: 'Planilhas' | 'E-books' | 'Guias' | 'Checklists';
  type: 'PDF' | 'EXCEL' | 'WORD';
  size: string;
  url: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  category: string;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buyUrl: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  accessType: 'total' | 'course';
  courseIds?: string[];
}
