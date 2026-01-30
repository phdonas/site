
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
      const response = await fetch(`${WP_CONFIG.BASE_URL}${WP_CONFIG.ENDPOINTS.POSTS}?_embed&per_page=20`);
      if (!response.ok) throw new Error(`Erro API: ${response.status}`);
      const posts = await response.json();
      
      // Filtra posts que NÃO pertencem à categoria 'videos'
      return posts
        .filter((p: any) => {
          const terms = p._embedded?.['wp:term']?.[0] || [];
          return !terms.some((term: any) => term.slug === 'videos');
        })
        .map(mapWPPostToArticle);
    } catch (error) {
      console.warn('DataService: Usando mocks para artigos devido a erro:', error);
      return MOCK_ARTICLES;
    }
  },

  async getVideos(): Promise<any[]> {
    if (!WP_CONFIG.USE_LIVE_DATA) return [1, 2, 3, 4].map(i => ({ id: i, title: `Aula Exemplo ${i}`, thumb: `https://picsum.photos/400/700?random=${i}` }));
    
    try {
      // Buscamos os posts mais recentes. 
      // Em vez de confiar no filtro de URL que pode variar por servidor, buscamos e filtramos no cliente.
      const response = await fetch(`${WP_CONFIG.BASE_URL}${WP_CONFIG.ENDPOINTS.POSTS}?_embed&per_page=50`);
      if (!response.ok) throw new Error(`Erro API Vídeos: ${response.status}`);
      
      const posts = await response.json();
      
      // Filtra posts que POSSUEM a categoria 'videos' nos termos embedados
      const videoPosts = posts.filter((p: any) => {
        const terms = p._embedded?.['wp:term']?.[0] || [];
        return terms.some((term: any) => term.slug === 'videos');
      });

      if (videoPosts.length === 0) {
        console.info('DataService: Nenhum post "Publicado" com categoria "videos" foi encontrado. Verifique se o post no WP não está como "Agendado" para o futuro.');
      }

      return videoPosts.map((p: any) => ({
        id: p.id,
        title: p.title.rendered,
        // Se não tiver imagem destacada, usa uma temporária para não ficar preto
        thumb: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || `https://images.unsplash.com/photo-1492619334760-22c0217e33ff?auto=format&fit=crop&q=80&w=400`
      }));
    } catch (error) {
      console.error('DataService Error (Videos):', error);
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
