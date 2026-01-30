
import { MOCK_ARTICLES, MOCK_COURSES, MOCK_RESOURCES, PILLARS } from '../constants';
import { Article, Course, Resource, Pillar, PillarId } from '../types';
import { WP_CONFIG } from '../config/wp-config';

const CACHE_KEY_ARTICLES = 'phd_articles_cache_v6';
const CACHE_KEY_VIDEOS = 'phd_videos_cache_v6';

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

const fetchWithTimeout = async (url: string, options: any = {}, timeout = 8000) => {
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

/**
 * Função de Fetch de Alta Disponibilidade
 */
const secureFetch = async (endpoint: string) => {
  const domain = 'phdonassolo.com';
  
  // Lista de variações de URL para contornar problemas de permalinks e redirecionamentos na Hostgator
  const urlVariations = [
    // Padrão limpo (depende de mod_rewrite)
    `https://${domain}/wp-json/wp/v2${endpoint}`,
    `https://www.${domain}/wp-json/wp/v2${endpoint}`,
    // Método rest_route (Fallback universal para quando permalinks falham)
    `https://${domain}/index.php?rest_route=/wp/v2${endpoint}`,
    `https://www.${domain}/index.php?rest_route=/wp/v2${endpoint}`
  ];

  for (const targetUrl of urlVariations) {
    const strategies = [
      // 1. Direto
      async () => {
        const res = await fetchWithTimeout(targetUrl, { mode: 'cors' });
        if (res.ok) return await res.json();
        throw new Error(`Direct failed: ${res.status}`);
      },
      // 2. Proxy: Corsproxy.io
      async () => {
        const res = await fetchWithTimeout(`https://corsproxy.io/?${encodeURIComponent(targetUrl)}`);
        if (res.ok) return await res.json();
        throw new Error(`Proxy 1 failed`);
      },
      // 3. Proxy: AllOrigins
      async () => {
        const res = await fetchWithTimeout(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&t=${Date.now()}`);
        if (res.ok) {
          const wrapper = await res.json();
          const content = typeof wrapper.contents === 'string' ? JSON.parse(wrapper.contents) : wrapper.contents;
          if (content) return content;
        }
        throw new Error(`Proxy 2 failed`);
      }
    ];

    for (const strategy of strategies) {
      try {
        const data = await strategy();
        if (data && (Array.isArray(data) || typeof data === 'object')) {
          console.debug(`Sucesso com a URL: ${targetUrl}`);
          return data;
        }
      } catch (e) {
        // Silencioso, tenta a próxima estratégia
      }
    }
  }

  throw new Error('Falha crítica de conexão. WordPress inacessível via API padrão ou Proxy.');
};

export const DataService = {
  async testConnection(): Promise<boolean> {
    try {
      const data = await secureFetch('/posts?per_page=1');
      return Array.isArray(data);
    } catch (e) { 
      return false; 
    }
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
    } catch (err) {
      console.error("DataService: Erro ao buscar artigos, usando fallback.");
    }
    return cachedArticles.length > 0 ? cachedArticles.slice(0, limit) : MOCK_ARTICLES;
  },

  async getVideos(limit = 4): Promise<any[]> {
    try {
      // Tentamos buscar posts que contenham iframes (vídeos)
      const posts = await secureFetch(`/posts?_embed&per_page=20`);
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
    } catch (err) {
      console.error("DataService: Erro ao buscar vídeos, usando fallback.");
    }
    return cachedVideos.length > 0 ? cachedVideos.slice(0, limit) : [];
  },

  async getArticleById(id: string): Promise<Article | undefined> {
    const cached = cachedArticles.find(a => a.id === id);
    try {
      const post = await secureFetch(`/posts/${id}?_embed`);
      if (post && post.id) return mapWPPostToArticle(post);
    } catch (err) {
      console.warn("DataService: Artigo individual falhou, tentando cache.");
    }
    return cached;
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
