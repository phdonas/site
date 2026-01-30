
import { MOCK_ARTICLES, MOCK_COURSES, MOCK_BOOKS, MOCK_RESOURCES, PILLARS } from '../constants';
import { Article, Course, Book, Resource, Pillar, PillarId } from '../types';
import { WP_CONFIG } from '../config/wp-config';

const mapCategoryToPillarId = (categorySlug: string): PillarId => {
  const pillarIds: PillarId[] = ['prof-paulo', 'consultoria-imobiliaria', '4050oumais', 'academia-do-gas'];
  if (pillarIds.includes(categorySlug as PillarId)) {
    return categorySlug as PillarId;
  }
  return 'prof-paulo';
};

const mapWPPostToArticle = (post: any): Article => {
  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                   'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1200';

  const wpCategories = post._embedded?.['wp:term']?.[0] || [];
  const primaryCategory = wpCategories[0];
  const pillarId = primaryCategory ? mapCategoryToPillarId(primaryCategory.slug) : 'prof-paulo';

  return {
    id: post.id.toString(),
    title: post.title.rendered,
    pillarId: pillarId,
    category: primaryCategory ? primaryCategory.name : 'Geral', 
    excerpt: post.excerpt.rendered.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...',
    content: post.content.rendered,
    date: post.date,
    imageUrl: imageUrl
  };
};

export const DataService = {
  async getArticles(): Promise<Article[]> {
    if (!WP_CONFIG.USE_LIVE_DATA) return MOCK_ARTICLES;
    try {
      const response = await fetch(`${WP_CONFIG.BASE_URL}${WP_CONFIG.ENDPOINTS.POSTS}?_embed&per_page=12`);
      if (!response.ok) throw new Error('CORS ou Erro de Conexão');
      const posts = await response.json();
      // Filtra posts que NÃO são da categoria de vídeos para a galeria de artigos
      return posts
        .filter((p: any) => !p._embedded?.['wp:term']?.[0]?.some((cat: any) => cat.slug === 'videos'))
        .map(mapWPPostToArticle);
    } catch (error) {
      console.warn('Usando dados simulados para artigos:', error);
      return MOCK_ARTICLES;
    }
  },

  async getVideos(): Promise<any[]> {
    if (!WP_CONFIG.USE_LIVE_DATA) return [1, 2, 3, 4].map(i => ({ id: i, title: `Aula Exemplo ${i}`, thumb: `https://picsum.photos/400/700?random=${i}` }));
    
    try {
      // Busca posts da categoria 'videos'
      const response = await fetch(`${WP_CONFIG.BASE_URL}${WP_CONFIG.ENDPOINTS.POSTS}?_embed&category_slug=videos&per_page=4`);
      if (!response.ok) return [];
      const posts = await response.json();
      return posts.map((p: any) => ({
        id: p.id,
        title: p.title.rendered,
        thumb: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || `https://picsum.photos/400/700?random=${p.id}`
      }));
    } catch (error) {
      return [];
    }
  },

  async getArticleById(id: string): Promise<Article | undefined> {
    if (!WP_CONFIG.USE_LIVE_DATA) return MOCK_ARTICLES.find(a => a.id === id);
    try {
      const response = await fetch(`${WP_CONFIG.BASE_URL}${WP_CONFIG.ENDPOINTS.POSTS}/${id}?_embed`);
      if (!response.ok) return MOCK_ARTICLES.find(a => a.id === id);
      const post = await response.json();
      return mapWPPostToArticle(post);
    } catch (error) {
      return MOCK_ARTICLES.find(a => a.id === id);
    }
  },

  async getCourses(): Promise<Course[]> {
    return MOCK_COURSES;
  },

  // Fix: Added getCourseById to resolve missing property error in CourseDetailPage.tsx
  async getCourseById(id: string): Promise<Course | undefined> {
    return MOCK_COURSES.find(c => c.id === id);
  },

  async getResources(): Promise<Resource[]> {
    return MOCK_RESOURCES;
  },

  async getPillars(): Promise<Pillar[]> {
    return PILLARS;
  },

  async getPillarById(id: string): Promise<Pillar | undefined> {
    return PILLARS.find(p => p.id === id);
  }
};
