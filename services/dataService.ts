
import { MOCK_ARTICLES, MOCK_COURSES, MOCK_BOOKS, MOCK_RESOURCES, PILLARS } from '../constants';
import { Article, Course, Book, Resource, Pillar, PillarId } from '../types';
import { WP_CONFIG } from '../config/wp-config';

// Cache em memória + LocalStorage para persistência entre sessões
const CACHE_KEY = 'phd_articles_cache';
let cachedArticles: Article[] = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]');

const saveCache = () => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cachedArticles));
};

const CATEGORY_MAP: Record<string, PillarId> = {
  'artigos': 'prof-paulo',
  'prof-paulo': 'prof-paulo',
  'prof-paulo-donassolo': 'prof-paulo',
  'lideranca': 'prof-paulo',
  'consultor-imobiliario': 'consultoria-imobiliaria',
  '4050-ou-mais': '4050oumais',
  'academia-do-gas': 'academia-do-gas'
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
  
  return {
    id: post.id.toString(),
    title: post.title.rendered,
    pillarId: mapCategoryToPillarId(wpCategories),
    category: wpCategories[0]?.name || 'Geral', 
    excerpt: post.excerpt?.rendered?.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...' || '',
    content: post.content?.rendered || '',
    date: post.date,
    imageUrl: imageUrl
  };
};

const secureFetch = async (endpoint: string) => {
  const baseUrl = `${WP_CONFIG.BASE_URL}${endpoint}`;
  try {
    const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(baseUrl)}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("API Error, using fallback.");
    throw e;
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
        mapped.forEach(art => {
          if (!cachedArticles.find(c => c.id === art.id)) cachedArticles.push(art);
        });
        saveCache();
        return mapped;
      }
      return MOCK_ARTICLES;
    } catch { return MOCK_ARTICLES; }
  },

  async getArticlesByPillar(pillarId: PillarId, limit = 3): Promise<Article[]> {
    // Tenta primeiro no cache local para velocidade instantânea
    const local = cachedArticles.filter(a => a.pillarId === pillarId).slice(0, limit);
    if (local.length >= limit) return local;

    try {
      // Se não tem no cache, busca na API (via slug de categoria se necessário)
      const articles = await this.getArticles(30);
      return articles.filter(a => a.pillarId === pillarId).slice(0, limit);
    } catch { return []; }
  },

  async getVideos(limit = 4): Promise<any[]> {
    try {
      const posts = await secureFetch(`${WP_CONFIG.ENDPOINTS.POSTS}?_embed&per_page=20`);
      if (!Array.isArray(posts)) return [];
      return posts
        .filter((p: any) => {
          const terms = p._embedded?.['wp:term']?.[0] || [];
          return terms.some((t: any) => t.slug === 'videos');
        })
        .slice(0, limit)
        .map((p: any) => ({
          id: p.id,
          title: p.title.rendered,
          content: p.content.rendered,
          thumb: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1492619334760-22c0217e33ff?auto=format&fit=crop&q=80&w=400'
        }));
    } catch { return []; }
  },

  async getArticleById(id: string): Promise<Article | undefined> {
    const cached = cachedArticles.find(a => a.id === id);
    if (cached) return cached;

    try {
      const post = await secureFetch(`${WP_CONFIG.ENDPOINTS.POSTS}/${id}?_embed`);
      if (post && post.id) {
        const mapped = mapWPPostToArticle(post);
        cachedArticles.push(mapped);
        saveCache();
        return mapped;
      }
    } catch { return MOCK_ARTICLES.find(a => a.id === id); }
  },

  async getCourses(): Promise<Course[]> { return MOCK_COURSES; },
  async getResources(): Promise<Resource[]> { return MOCK_RESOURCES; },
  async getPillars(): Promise<Pillar[]> { return PILLARS; },
  async getPillarById(id: string): Promise<Pillar | undefined> { return PILLARS.find(p => p.id === id); },
  async getCourseById(id: string): Promise<Course | undefined> { return MOCK_COURSES.find(c => c.id === id); }
};
