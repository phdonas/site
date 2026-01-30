
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
      return posts.map(mapWPPostToArticle);
    } catch (error) {
      console.warn('Usando dados simulados (Verifique o Plugin de CORS no WP):', error);
      return MOCK_ARTICLES;
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

  async getArticlesByPillar(pillarId: string): Promise<Article[]> {
    const all = await this.getArticles();
    return all.filter(a => a.pillarId === pillarId);
  },

  async getCourses(): Promise<Course[]> {
    return MOCK_COURSES;
  },

  async getCourseById(id: string): Promise<Course | undefined> {
    return MOCK_COURSES.find(c => c.id === id);
  },

  async getBooks(): Promise<Book[]> {
    return MOCK_BOOKS;
  },

  // DOWNLOADS DINÂMICOS
  async getResources(): Promise<Resource[]> {
    // Por enquanto, o WordPress não tem um campo padrão de 'Download'
    // Mantemos o Mock mas preparamos para receber de uma categoria 'Downloads' do WP no futuro
    return MOCK_RESOURCES;
  },

  async getPillars(): Promise<Pillar[]> {
    return PILLARS;
  },

  async getPillarById(id: string): Promise<Pillar | undefined> {
    return PILLARS.find(p => p.id === id);
  }
};
