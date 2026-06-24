
export type PillarId = 'prof-paulo' | 'consultoria-imobiliaria' | '4050oumais' | 'academia-do-gas';

declare module 'mammoth';

export interface Article {
  id: string;
  title: string;
  pillarIds: PillarId[];
  category: string;
  excerpt: string;
  content: string;
  date: string;
  publishDate?: string;
  imageUrl: string;
  // SEO Fields (Substituindo Yoast)
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  tags?: string[];
}

export interface Video {
  id: string;
  title: string;
  url: string;
  thumb: string;
  publishDate?: string;
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
  category: 'Planilhas' | 'E-books' | 'Guias' | 'Checklists' | 'Ferramentas';
  type: 'PDF' | 'EXCEL' | 'WORD' | 'LINK';
  size: string;
  url: string;
}

export interface CourseVideo {
  title: string;
  thumbnail: string;
  duration: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  category: string;
  salesUrl: string;
  videos: CourseVideo[];
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
