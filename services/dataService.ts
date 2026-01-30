
import { MOCK_ARTICLES, MOCK_COURSES, MOCK_BOOKS, MOCK_RESOURCES, PILLARS } from '../constants';
import { Article, Course, Book, Resource, Pillar, PillarId } from '../types';
import { WP_CONFIG } from '../config/wp-config';

// Cache em memória + LocalStorage para persistência entre sessões
const CACHE_KEY_ARTICLES = 'phd_articles_cache_v2';
const CACHE_KEY_VIDEOS = 'phd_videos_cache_v2';

let cachedArticles: Article[] = JSON.parse(localStorage.getItem(CACHE_KEY_ARTICLES) || '[]');
let cachedVideos: any[] = JSON.parse(localStorage.getItem(CACHE_KEY_VIDEOS) || '[]');

const saveArticlesCache = () => {
  localStorage.setItem(CACHE_KEY_ARTICLES, JSON.stringify(cachedArticles));
};

const saveVideosCache = () => {
  localStorage.setItem(CACHE_KEY_VIDEOS, JSON.stringify(cachedVideos));
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

/**
 * Limpa e formata o conteúdo vindo do WordPress para ser amigável ao React
 */
const sanitizeWPContent = (html: string): string => {
  if (!html) return '';
  // Substituir links internos do WP por hashes locais (opcional, dependendo da necessidade)
  // Por agora, apenas garantimos que vídeos fiquem em containers responsivos
  let sanitized = html;
  
  // Envolver iframes de vídeo em um container responsivo se já não estiverem
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

/**
 * Tenta buscar dados do WordPress com estratégias de resiliência e fallback.
 */
const secureFetch = async (endpoint: string) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const targetUrl = `${WP_CONFIG.BASE_URL}${cleanEndpoint}`;
  const TIMEOUT_MS = 10000;

  // 1. TENTATIVA DIRETA
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const directRes = await fetch(targetUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (directRes.ok) {
      return await directRes.json();
    }
  } catch (e) {
    // Falha silenciosa
  }

  // 2. FALLBACK PARA PROXY (AllOrigins)
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&timestamp=${Date.now()}`;
    const proxyRes = await fetch(proxyUrl);
    
    if (proxyRes.ok) {
      const wrapper = await proxyRes.json();
      if (wrapper.contents) {
        return JSON.parse(wrapper.contents);
      }
    }
    throw new Error('Proxy returned invalid response');
  } catch (e) {
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
        
        const newCache = [...mapped];
        cachedArticles.forEach(oldArt => {
          if (!newCache.find(n => n.id === oldArt.id)) newCache.push(oldArt);
        });
        
        cachedArticles = newCache.slice(0, 50); 
        saveArticlesCache();
        return mapped;
      }
    } catch (e) {
      // Silencioso
    }
    return cachedArticles.length > 0 ? cachedArticles.slice(0, limit) : MOCK_ARTICLES;
  },

  async getArticlesByPillar(pillarId: PillarId, limit = 3): Promise<Article[]> {
    const local = cachedArticles.filter(a => a.pillarId === pillarId).slice(0, limit);
    try {
      const articles = await this.getArticles(30);
      const filtered = articles.filter(a => a.pillarId === pillarId).slice(0, limit);
      return filtered.length > 0 ? filtered : (local.length > 0 ? local : []);
    } catch { 
      return local; 
    }
  },

  async getVideos(limit = 4): Promise<any[]> {
    try {
      const posts = await secureFetch(`${WP_CONFIG.ENDPOINTS.POSTS}?_embed&per_page=20`);
      if (Array.isArray(posts)) {
        const mappedVideos = posts
          .filter((p: any) => {
            const terms = p._embedded?.['wp:term']?.[0] || [];
            const hasVideoCategory = terms.some((t: any) => 
              t.slug === 'videos' || 
              t.name.toLowerCase().includes('vídeo') || 
              t.name.toLowerCase().includes('video')
            );
            const hasVideoEmbed = p.content.rendered.includes('<iframe') || 
                                 p.content.rendered.includes('<video') ||
                                 p.content.rendered.includes('wp-block-embed-youtube');
            return hasVideoCategory || hasVideoEmbed;
          })
          .map((p: any) => ({
            id: p.id,
            title: p.title.rendered,
            content: sanitizeWPContent(p.content.rendered),
            thumb: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                   'https://images.unsplash.com/photo-1492619334760-22c0217e33ff?auto=format&fit=crop&q=80&w=400'
          }));

        if (mappedVideos.length > 0) {
          cachedVideos = mappedVideos;
          saveVideosCache();
          return mappedVideos.slice(0, limit);
        }
      }
    } catch (e) {
      // Silencioso
    }
    return cachedVideos.length > 0 ? cachedVideos.slice(0, limit) : [];
  },

  async getArticleById(id: string): Promise<Article | undefined> {
    const cached = cachedArticles.find(a => a.id === id);
    if (cached) return cached;

    try {
      const post = await secureFetch(`${WP_CONFIG.ENDPOINTS.POSTS}/${id}?_embed`);
      if (post && post.id) {
        const mapped = mapWPPostToArticle(post);
        if (!cachedArticles.find(a => a.id === mapped.id)) {
           cachedArticles.unshift(mapped);
           saveArticlesCache();
        }
        return mapped;
      }
    } catch { 
      return cachedArticles.find(a => a.id === id) || MOCK_ARTICLES.find(a => a.id === id); 
    }
  },

  async getCourses(): Promise<Course[]> { return MOCK_COURSES; },
  async getResources(): Promise<Resource[]> { return MOCK_RESOURCES; },
  async getPillars(): Promise<Pillar[]> { return PILLARS; },
  async getPillarById(id: string): Promise<Pillar | undefined> { return PILLARS.find(p => p.id === id); },
  async getCourseById(id: string): Promise<Course | undefined> { return MOCK_COURSES.find(c => c.id === id); }
};
