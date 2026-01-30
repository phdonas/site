
import { MOCK_ARTICLES, MOCK_COURSES, MOCK_RESOURCES, PILLARS } from '../constants';
import { Article, Course, Resource, Pillar, PillarId } from '../types';

const CACHE_KEY_ARTICLES = 'phd_articles_cache_v7';
const CACHE_KEY_VIDEOS = 'phd_videos_cache_v7';
const CACHE_EXPIRATION = 1000 * 60 * 30; // 30 minutos

// Recupera cache inicial síncrono para velocidade instantânea
let cachedArticles: Article[] = JSON.parse(localStorage.getItem(CACHE_KEY_ARTICLES) || '[]');
let cachedVideos: any[] = JSON.parse(localStorage.getItem(CACHE_KEY_VIDEOS) || '[]');

const saveArticlesCache = (data: Article[]) => {
  cachedArticles = data;
  localStorage.setItem(CACHE_KEY_ARTICLES, JSON.stringify(data));
  localStorage.setItem(CACHE_KEY_ARTICLES + '_time', Date.now().toString());
};

const saveVideosCache = (data: any[]) => {
  cachedVideos = data;
  localStorage.setItem(CACHE_KEY_VIDEOS, JSON.stringify(data));
};

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

const fetchWithTimeout = async (url: string, options: any = {}, timeout = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
};

const secureFetch = async (endpoint: string) => {
  const domain = 'phdonassolo.com';
  const targetUrl = `https://${domain}/wp-json/wp/v2${endpoint}`;
  
  // Estratégia multicanal para Hostgator
  const strategies = [
    async () => {
      const res = await fetchWithTimeout(targetUrl);
      if (res.ok) return await res.json();
      throw new Error('Direct failed');
    },
    async () => {
      const res = await fetchWithTimeout(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&t=${Date.now()}`);
      const wrapper = await res.json();
      return typeof wrapper.contents === 'string' ? JSON.parse(wrapper.contents) : wrapper.contents;
    }
  ];

  for (const strategy of strategies) {
    try {
      const data = await strategy();
      if (data) return data;
    } catch (e) {}
  }
  throw new Error('Connection failed');
};

export const DataService = {
  async testConnection(): Promise<boolean> {
    try {
      const data = await secureFetch('/posts?per_page=1');
      return !!data;
    } catch (e) { return false; }
  },

  // PERFORMANCE: Retorna cache imediatamente e atualiza no fundo
  async getArticles(limit = 12): Promise<Article[]> {
    const fetchNewData = async () => {
      try {
        const posts = await secureFetch(`/posts?_embed&per_page=${limit}`);
        if (Array.isArray(posts)) {
          const mapped = posts.map(mapWPPostToArticle);
          saveArticlesCache(mapped);
          return mapped;
        }
      } catch (e) {}
      return cachedArticles;
    };

    // Se temos cache, dispara atualização silenciosa e retorna o cache agora
    if (cachedArticles.length > 0) {
      fetchNewData(); // Background sync
      return cachedArticles.slice(0, limit);
    }

    return await fetchNewData();
  },

  async getVideos(limit = 4): Promise<any[]> {
    const fetchVideos = async () => {
      try {
        const posts = await secureFetch(`/posts?_embed&per_page=15`);
        if (Array.isArray(posts)) {
          const mapped = posts
            .filter(p => p.content.rendered.includes('<iframe'))
            .map(p => ({
              id: p.id,
              title: p.title.rendered,
              content: sanitizeWPContent(p.content.rendered),
              thumb: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1492619334760-22c0217e33ff?auto=format&fit=crop&q=80&w=400'
            }));
          saveVideosCache(mapped);
          return mapped.slice(0, limit);
        }
      } catch (e) {}
      return cachedVideos;
    };

    if (cachedVideos.length > 0) {
      fetchVideos();
      return cachedVideos.slice(0, limit);
    }
    return await fetchVideos();
  },

  async getArticleById(id: string): Promise<Article | undefined> {
    const local = cachedArticles.find(a => a.id === id);
    if (local) return local;

    try {
      const post = await secureFetch(`/posts/${id}?_embed`);
      return mapWPPostToArticle(post);
    } catch (e) {
      return local;
    }
  },

  async getArticlesByPillar(pillarId: PillarId, limit = 3): Promise<Article[]> {
    const arts = cachedArticles.length > 0 ? cachedArticles : await this.getArticles(20);
    return arts.filter(a => a.pillarId === pillarId).slice(0, limit);
  },

  async getCourses(): Promise<Course[]> { return MOCK_COURSES; },
  async getResources(): Promise<Resource[]> { return MOCK_RESOURCES; },
  async getPillars(): Promise<Pillar[]> { return PILLARS; },
  async getPillarById(id: string): Promise<Pillar | undefined> { return PILLARS.find(p => p.id === id); },
  async getCourseById(id: string): Promise<Course | undefined> { return MOCK_COURSES.find(c => c.id === id); }
};
