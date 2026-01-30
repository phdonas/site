
import { MOCK_ARTICLES, MOCK_COURSES, MOCK_BOOKS, MOCK_RESOURCES, PILLARS } from '../constants';
import { Article, Course, Book, Resource, Pillar, PillarId } from '../types';
import { WP_CONFIG } from '../config/wp-config';

// Cache simples em memória para evitar loading excessivo
let cachedArticles: Article[] = [];

const CATEGORY_MAP: Record<string, PillarId> = {
  'artigos': 'prof-paulo',
  'prof-paulo': 'prof-paulo',
  'prof-paulo-donassolo': 'prof-paulo',
  'lideranca': 'prof-paulo',
  'metricas-indicadores': 'prof-paulo',
  'processos-vendas': 'prof-paulo',
  'treinamento-desenvolvimento': 'prof-paulo',
  'consultor-imobiliario': 'consultoria-imobiliaria',
  'negociacao-imoveis': 'consultoria-imobiliaria',
  'prospeccao-imobiliario': 'consultoria-imobiliaria',
  '4050-ou-mais': '4050oumais',
  '4050-ou-mais-2': '4050oumais',
  'longevidade': '4050oumais',
  'academia-do-gas': 'academia-do-gas',
  'gas': 'academia-do-gas'
};

const mapCategoryToPillarId = (wpTerms: any[]): PillarId => {
  if (!wpTerms || wpTerms.length === 0) return 'prof-paulo';
  for (const term of wpTerms) {
    const slug = term.slug.toLowerCase();
    if (CATEGORY_MAP[slug]) return CATEGORY_MAP[slug];
  }
  return 'prof-paulo';
};

const mapWPPostToArticle = (post: any): Article => {
  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                   'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1200';
  const wpCategories = post._embedded?.['wp:term']?.[0] || [];
  const pillarId = mapCategoryToPillarId(wpCategories);

  return {
    id: post.id.toString(),
    title: post.title.rendered,
    pillarId: pillarId,
    category: wpCategories[0]?.name || 'Geral', 
    excerpt: post.excerpt?.rendered?.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...' || '',
    content: post.content?.rendered || '',
    date: post.date,
    imageUrl: imageUrl
  };
};

const secureFetch = async (endpoint: string) => {
  const baseUrl = `${WP_CONFIG.BASE_URL}${endpoint}`;
  
  // Estratégia ultra-rápida: AllOrigins Raw
  try {
    const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(baseUrl)}`);
    if (res.ok) return await res.json();
  } catch (e) { 
    console.warn("Proxy AllOrigins falhou, tentando CorsProxy...");
  }

  try {
    const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(baseUrl)}`);
    if (res.ok) return await res.json();
  } catch (e) {
    throw new Error("API_OFFLINE");
  }
};

export const DataService = {
  async testConnection(): Promise<boolean> {
    try {
      const data = await secureFetch('/posts?per_page=1');
      return Array.isArray(data);
    } catch { return false; }
  },

  async getArticles(limit = 12): Promise<Article[]> {
    try {
      const posts = await secureFetch(`${WP_CONFIG.ENDPOINTS.POSTS}?_embed&per_page=${limit}`);
      if (Array.isArray(posts)) {
        const mapped = posts.map(mapWPPostToArticle);
        // Atualiza o cache local para abertura instantânea
        mapped.forEach(art => {
          if (!cachedArticles.find(c => c.id === art.id)) cachedArticles.push(art);
        });
        return mapped;
      }
      return MOCK_ARTICLES;
    } catch (error) {
      return MOCK_ARTICLES;
    }
  },

  async getVideos(limit = 4): Promise<any[]> {
    try {
      // Pedimos um pouco mais para garantir que filtramos os que têm a categoria vídeo
      const posts = await secureFetch(`${WP_CONFIG.ENDPOINTS.POSTS}?_embed&per_page=20`);
      if (!Array.isArray(posts)) return [];
      
      return posts
        .filter((p: any) => {
          const terms = p._embedded?.['wp:term']?.[0] || [];
          return terms.some((t: any) => t.slug === 'videos');
        })
        .slice(0, limit) // Limitamos aqui para ser ultra-rápido na Home
        .map((p: any) => ({
          id: p.id,
          title: p.title.rendered,
          content: p.content.rendered,
          thumb: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1492619334760-22c0217e33ff?auto=format&fit=crop&q=80&w=400'
        }));
    } catch (error) {
      return [];
    }
  },

  async getArticleById(id: string): Promise<Article | undefined> {
    // Primeiro tenta o cache local (instantâneo)
    const cached = cachedArticles.find(a => a.id === id);
    if (cached) return cached;

    try {
      const post = await secureFetch(`${WP_CONFIG.ENDPOINTS.POSTS}/${id}?_embed`);
      if (post && post.id) {
        const mapped = mapWPPostToArticle(post);
        cachedArticles.push(mapped);
        return mapped;
      }
    } catch (error) {
      return MOCK_ARTICLES.find(a => a.id === id);
    }
    return MOCK_ARTICLES.find(a => a.id === id);
  },

  async getCourses(): Promise<Course[]> { return MOCK_COURSES; },
  async getResources(): Promise<Resource[]> { return MOCK_RESOURCES; },
  async getPillars(): Promise<Pillar[]> { return PILLARS; },
  async getPillarById(id: string): Promise<Pillar | undefined> { return PILLARS.find(p => p.id === id); },
  async getCourseById(id: string): Promise<Course | undefined> { return MOCK_COURSES.find(c => c.id === id); }
};
