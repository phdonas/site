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

/**
 * Utilitário de fetch resiliente.
 * Removendo headers manuais para tornar a requisição "Simple", 
 * o que reduz problemas de CORS em servidores legados.
 */
const secureFetch = async (endpoint: string) => {
  const url = `${WP_CONFIG.CORS_PROXY}${WP_CONFIG.BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const DataService = {
  async getArticles(): Promise<Article[]> {
    if (!WP_CONFIG.USE_LIVE_DATA) return MOCK_ARTICLES;
    try {
      const posts = await secureFetch(`${WP_CONFIG.ENDPOINTS.POSTS}?_embed&per_page=20`);
      
      const articles = posts
        .filter((p: any) => {
          const terms = p._embedded?.['wp:term']?.[0] || [];
          return !terms.some((term: any) => term.slug === 'videos');
        })
        .map(mapWPPostToArticle);
        
      return articles.length > 0 ? articles : MOCK_ARTICLES;
    } catch (error) {
      console.warn('DataService: Conexão com WordPress falhou. Ativando Fallback para dados locais.');
      return MOCK_ARTICLES;
    }
  },

  async getVideos(): Promise<any[]> {
    const mockVideos = [1, 2, 3, 4].map(i => ({ id: `mock-${i}`, title: `Aula Exemplo ${i} (Demo)`, thumb: `https://picsum.photos/400/700?random=${i}` }));
    
    if (!WP_CONFIG.USE_LIVE_DATA) return mockVideos;
    
    try {
      const posts = await secureFetch(`${WP_CONFIG.ENDPOINTS.POSTS}?_embed&per_page=50`);
      
      const videoPosts = posts.filter((p: any) => {
        const terms = p._embedded?.['wp:term']?.[0] || [];
        return terms.some((term: any) => term.slug === 'videos');
      });

      if (videoPosts.length === 0) return mockVideos;

      return videoPosts.map((p: any) => ({
        id: p.id,
        title: p.title.rendered,
        thumb: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || `https://images.unsplash.com/photo-1492619334760-22c0217e33ff?auto=format&fit=crop&q=80&w=400`
      }));
    } catch (error) {
      console.warn('DataService (Videos): Erro de conexão. Usando placeholders.');
      return mockVideos;
    }
  },

  async getArticleById(id: string): Promise<Article | undefined> {
    if (!WP_CONFIG.USE_LIVE_DATA) return MOCK_ARTICLES.find(a => a.id === id);
    try {
      const post = await secureFetch(`${WP_CONFIG.ENDPOINTS.POSTS}/${id}?_embed`);
      return mapWPPostToArticle(post);
    } catch (error) {
      return MOCK_ARTICLES.find(a => a.id === id);
    }
  },

  async getCourses(): Promise<Course[]> {
    return MOCK_COURSES;
  },

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