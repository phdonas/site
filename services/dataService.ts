
import { MOCK_ARTICLES, MOCK_COURSES, MOCK_BOOKS, MOCK_RESOURCES, PILLARS } from '../constants';
import { Article, Course, Book, Resource, Pillar, PillarId } from '../types';
import { WP_CONFIG } from '../config/wp-config';

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

/**
 * Motor de busca ultra-resiliente
 */
const secureFetch = async (endpoint: string) => {
  const baseUrl = `${WP_CONFIG.BASE_URL}${endpoint}`;
  
  // Estratégia 1: Direta
  try {
    const res = await fetch(baseUrl);
    if (res.ok) return await res.json();
  } catch (e) { console.warn("Fetch direto falhou."); }

  // Estratégia 2: AllOrigins GET (Encapsulado - mais chance de passar por firewalls)
  try {
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(baseUrl)}`);
    if (res.ok) {
      const data = await res.json();
      // O AllOrigins retorna o conteúdo em string dentro de .contents
      const content = JSON.parse(data.contents);
      return content;
    }
  } catch (e) { console.warn("AllOrigins encapsulado falhou."); }

  // Estratégia 3: CorsProxy.io
  try {
    const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(baseUrl)}`);
    if (res.ok) return await res.json();
  } catch (e) { console.warn("CorsProxy falhou."); }

  throw new Error("API_UNREACHABLE");
};

export const DataService = {
  async testConnection(): Promise<boolean> {
    try {
      const data = await secureFetch('/posts?per_page=1');
      return Array.isArray(data) && data.length > 0;
    } catch {
      return false;
    }
  },

  async getArticles(): Promise<Article[]> {
    try {
      const posts = await secureFetch(`${WP_CONFIG.ENDPOINTS.POSTS}?_embed&per_page=12`);
      return Array.isArray(posts) ? posts.map(mapWPPostToArticle) : MOCK_ARTICLES;
    } catch (error) {
      return MOCK_ARTICLES;
    }
  },

  async getVideos(): Promise<any[]> {
    try {
      const posts = await secureFetch(`${WP_CONFIG.ENDPOINTS.POSTS}?_embed&per_page=40`);
      if (!Array.isArray(posts)) return [];
      
      return posts
        .filter((p: any) => {
          const terms = p._embedded?.['wp:term']?.[0] || [];
          return terms.some((t: any) => t.slug === 'videos');
        })
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
    try {
      const post = await secureFetch(`${WP_CONFIG.ENDPOINTS.POSTS}/${id}?_embed`);
      if (post && post.id) return mapWPPostToArticle(post);
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
