
import { MOCK_ARTICLES, MOCK_COURSES, MOCK_RESOURCES, PILLARS } from '../constants';
import { Article, Course, Resource, Pillar, PillarId } from '../types';
import { WP_CONFIG } from '../config/wp-config';

// Cache em memória + LocalStorage
const CACHE_KEY_ARTICLES = 'phd_articles_cache_v3';
const CACHE_KEY_VIDEOS = 'phd_videos_cache_v3';

let cachedArticles: Article[] = JSON.parse(localStorage.getItem(CACHE_KEY_ARTICLES) || '[]');
let cachedVideos: any[] = JSON.parse(localStorage.getItem(CACHE_KEY_VIDEOS) || '[]');

const saveArticlesCache = () => localStorage.setItem(CACHE_KEY_ARTICLES, JSON.stringify(cachedArticles));
const saveVideosCache = () => localStorage.setItem(CACHE_KEY_VIDEOS, JSON.stringify(cachedVideos));

const CATEGORY_MAP: Record<string, PillarId> = {
  'artigos': 'prof-paulo',
  'prof-paulo': 'prof-paulo',
  'prof-paulo-donassolo': 'prof-paulo',
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

const sanitizeWPContent = (html: string): string => {
  if (!html) return '';
  let sanitized = html;
  if (sanitized.includes('<iframe') && !sanitized.includes('wp-video-container')) {
    sanitized = sanitized.replace(/<iframe/g, '<div class="wp-video-container"><iframe');
    sanitized = sanitized.replace(/<\/iframe>/g, '</iframe></div>');
  }
  return sanitized;
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
    content: sanitizeWPContent(post.content?.rendered || ''),
    date: post.date,
    imageUrl: imageUrl
  };
};

const secureFetch = async (endpoint: string) => {
  const targetUrl = `${WP_CONFIG.BASE_URL}${endpoint}`;
  try {
    const res = await fetch(targetUrl);
    if (res.ok) return await res.json();
    throw new Error('Direct fetch failed');
  } catch (e) {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&timestamp=${Date.now()}`;
    const proxyRes = await fetch(proxyUrl);
    if (proxyRes.ok) {
      const wrapper = await proxyRes.json();
      return JSON.parse(wrapper.contents);
    }
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
      const posts = await secureFetch(`/posts?_embed&per_page=${limit}`);
      if (Array.isArray(posts)) {
        const mapped = posts.map(mapWPPostToArticle);
        cachedArticles = mapped;
        saveArticlesCache();
        return mapped;
      }
    } catch {}
    return cachedArticles.length > 0 ? cachedArticles.slice(0, limit) : MOCK_ARTICLES;
  },

  async getVideos(limit = 4): Promise<any[]> {
    try {
      const posts = await secureFetch(`/posts?_embed&per_page=10`);
      if (Array.isArray(posts)) {
        const mapped = posts
          .filter(p => p.content.rendered.includes('<iframe'))
          .map(p => ({
            id: p.id,
            title: p.title.rendered,
            content: sanitizeWPContent(p.content.rendered),
            thumb: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1492619334760-22c0217e33ff?auto=format&fit=crop&q=80&w=400'
          }));
        if (mapped.length > 0) {
          cachedVideos = mapped;
          saveVideosCache();
          return mapped.slice(0, limit);
        }
      }
    } catch {}
    return cachedVideos.length > 0 ? cachedVideos.slice(0, limit) : [];
  },

  async getArticleById(id: string): Promise<Article | undefined> {
    const cached = cachedArticles.find(a => a.id === id);
    if (cached) return cached;
    try {
      const post = await secureFetch(`/posts/${id}?_embed`);
      return mapWPPostToArticle(post);
    } catch { return cached; }
  },

  async getArticlesByPillar(pillarId: PillarId, limit = 3): Promise<Article[]> {
    const arts = await this.getArticles(20);
    return arts.filter(a => a.pillarId === pillarId).slice(0, limit);
  },

  async getCourses(): Promise<Course[]> { return MOCK_COURSES; },
  async getResources(): Promise<Resource[]> { return MOCK_RESOURCES; },
  async getPillars(): Promise<Pillar[]> { return PILLARS; },
  async getPillarById(id: string): Promise<Pillar | undefined> { return PILLARS.find(p => p.id === id); },
  async getCourseById(id: string): Promise<Course | undefined> { return MOCK_COURSES.find(c => c.id === id); }
};
