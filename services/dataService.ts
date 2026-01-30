
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

const secureFetch = async (endpoint: string) => {
  const baseUrl = `${WP_CONFIG.BASE_URL}${endpoint}`;
  // Se houver proxy, a URL do WP precisa ser codificada
  const finalUrl = WP_CONFIG.CORS_PROXY 
    ? `${WP_CONFIG.CORS_PROXY}${encodeURIComponent(baseUrl)}`
    : baseUrl;

  try {
    const response = await fetch(finalUrl);
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
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
          return !terms.some((term: any) => 
            ['video', 'videos', 'vídeo', 'video1'].includes(term.slug.toLowerCase())
          );
        })
        .map(mapWPPostToArticle);
        
      return articles.length > 0 ? articles : MOCK_ARTICLES;
    } catch (error) {
      console.warn('DataService: Usando artigos locais.');
      return MOCK_ARTICLES;
    }
  },

  async getVideos(): Promise<any[]> {
    const mockVideos = [1, 2, 3, 4].map(i => ({ id: `mock-${i}`, title: `Aula Exemplo ${i} (Demo)`, thumb: `https://picsum.photos/400/700?random=${i}` }));
    
    if (!WP_CONFIG.USE_LIVE_DATA) return mockVideos;
    
    try {
      // Buscamos os posts mais recentes que possuam categorias
      const posts = await secureFetch(`${WP_CONFIG.ENDPOINTS.POSTS}?_embed&per_page=100`);
      
      const videoPosts = posts.filter((p: any) => {
        const terms = p._embedded?.['wp:term']?.[0] || [];
        return terms.some((term: any) => {
          const slug = term.slug.toLowerCase();
          // Filtra pelo slug 'videos' que você mostrou no print
          return slug === 'videos' || slug === 'video' || slug === 'video1';
        });
      });

      if (videoPosts.length === 0) {
        console.warn('DataService: Conectado, mas nenhum post tem o slug "videos".');
        return mockVideos;
      }

      return videoPosts.map((p: any) => ({
        id: p.id,
        title: p.title.rendered,
        // Tenta pegar a imagem destacada, se não tiver, usa uma padrão de vídeo
        thumb: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
               'https://images.unsplash.com/photo-1492619334760-22c0217e33ff?auto=format&fit=crop&q=80&w=400'
      }));
    } catch (error) {
      console.error('DataService: Erro ao carregar vídeos:', error);
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
