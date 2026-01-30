
import { MOCK_ARTICLES, MOCK_COURSES, MOCK_RESOURCES, PILLARS } from '../constants';
import { Article, Course, Resource, Pillar, PillarId } from '../types';
import { WP_CONFIG } from '../config/wp-config';

const CACHE_KEY_ARTICLES = 'phd_articles_v21';
const CACHE_KEY_VIDEOS = 'phd_videos_v21';

const mapCategoryToPillar = (wpCategories: any[]): PillarId => {
  if (!wpCategories || wpCategories.length === 0) return 'prof-paulo';
  const names = wpCategories.map((c: any) => (c.name || '').toLowerCase());
  if (names.some(n => n.includes('paulo') || n.includes('prof'))) return 'prof-paulo';
  if (names.some(n => n.includes('imob') || n.includes('consultor'))) return 'consultoria-imobiliaria';
  if (names.some(n => n.includes('4050') || n.includes('longevid') || n.includes('mais'))) return '4050oumais';
  if (names.some(n => n.includes('gas') || n.includes('academia'))) return 'academia-do-gas';
  return 'prof-paulo';
};

const extractFirstImage = (content: string): string => {
  const imgReg = /<img.*?src=["'](.*?)["']/;
  const match = content.match(imgReg);
  return match ? match[1] : 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1200';
};

const mapWPPostToArticle = (post: any): Article => {
  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || extractFirstImage(post.content.rendered);
  const wpCategories = post._embedded?.['wp:term']?.[0] || [];
  return {
    id: post.id.toString(),
    title: post.title.rendered,
    pillarId: mapCategoryToPillar(wpCategories),
    category: wpCategories[0]?.name || 'Geral', 
    excerpt: post.excerpt?.rendered?.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...',
    content: post.content?.rendered || '',
    date: post.date,
    imageUrl: imageUrl
  };
};

/**
 * secureFetch ultra-resiliente
 * Resolve o erro "Failed to fetch" (CORS ou SSL) tentando:
 * 1. URL Direta (com www)
 * 2. URL Direta (sem www)
 * 3. Proxy AllOrigins (Ignora CORS do navegador)
 */
const secureFetch = async (endpoint: string) => {
  const baseUrls = [
    `${WP_CONFIG.BASE_URL}/wp-json/wp/v2`,
    `https://phdonassolo.com/wordpress/wp-json/wp/v2`
  ];

  for (const base of baseUrls) {
    const url = `${base}${endpoint}${endpoint.includes('?') ? '&' : '?'}_embed`;
    try {
      console.log(`Tentando conexão direta: ${url}`);
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(`Conexão direta falhou para ${url}:`, e);
      // Continua para a próxima tentativa no loop
    }
  }

  // Se todas as diretas falharem, usa o Proxy (AllOrigins)
  const finalUrl = `${baseUrls[0]}${endpoint}${endpoint.includes('?') ? '&' : '?'}_embed`;
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(finalUrl)}&nocache=${Date.now()}`;
  
  try {
    console.log(`Tentando via Proxy: ${proxyUrl}`);
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const wrapper = await res.json();
      return JSON.parse(wrapper.contents);
    }
  } catch (proxyError) {
    console.error("Erro crítico: Nem a conexão direta nem o proxy funcionaram.", proxyError);
  }

  return null;
};

export const DataService = {
  async testConnection(): Promise<boolean> {
    const data = await secureFetch('/posts?per_page=1');
    return !!data;
  },

  async clearCache() {
    localStorage.removeItem(CACHE_KEY_ARTICLES);
    localStorage.removeItem(CACHE_KEY_VIDEOS);
    window.location.reload();
  },

  async getArticles(limit = 12): Promise<Article[]> {
    const cached = localStorage.getItem(CACHE_KEY_ARTICLES);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.slice(0, limit);
      } catch (e) {
        localStorage.removeItem(CACHE_KEY_ARTICLES);
      }
    }
    
    const posts = await secureFetch(`/posts?per_page=50`);
    if (Array.isArray(posts)) {
      const mapped = posts.filter(p => !p.content.rendered.toLowerCase().includes('<iframe')).map(mapWPPostToArticle);
      if (mapped.length > 0) {
        localStorage.setItem(CACHE_KEY_ARTICLES, JSON.stringify(mapped));
        return mapped.slice(0, limit);
      }
    }
    return MOCK_ARTICLES;
  },

  async getVideos(limit = 4): Promise<any[]> {
    const cached = localStorage.getItem(CACHE_KEY_VIDEOS);
    if (cached) return JSON.parse(cached).slice(0, limit);

    const posts = await secureFetch(`/posts?per_page=50`);
    if (Array.isArray(posts)) {
      const videos = posts
        .filter(p => {
          const c = p.content.rendered.toLowerCase();
          return c.includes('<iframe') || c.includes('youtube.com') || c.includes('vimeo.com');
        })
        .map(p => ({
          id: p.id.toString(),
          title: p.title.rendered,
          thumb: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || extractFirstImage(p.content.rendered)
        }));
      
      if (videos.length > 0) {
        localStorage.setItem(CACHE_KEY_VIDEOS, JSON.stringify(videos));
        return videos.slice(0, limit);
      }
    }
    return [];
  },

  async getArticleById(id: string): Promise<Article | undefined> {
    // Primeiro tenta no cache local
    const cached = localStorage.getItem(CACHE_KEY_ARTICLES);
    if (cached) {
      const articles = JSON.parse(cached);
      const found = articles.find((a: Article) => a.id === id);
      if (found) return found;
    }

    const post = await secureFetch(`/posts/${id}`);
    return post ? mapWPPostToArticle(post) : undefined;
  },

  async getArticlesByPillar(pillarId: PillarId, limit = 3): Promise<Article[]> {
    const all = await this.getArticles(50);
    return all.filter(a => a.pillarId === pillarId).slice(0, limit);
  },

  async getCourses(): Promise<Course[]> { return MOCK_COURSES; },
  async getResources(): Promise<Resource[]> { return MOCK_RESOURCES; },
  async getPillars(): Promise<Pillar[]> { return PILLARS; },
  async getPillarById(id: string): Promise<Pillar | undefined> { return PILLARS.find(p => p.id === id); },
  async getCourseById(id: string): Promise<Course | undefined> { return MOCK_COURSES.find(c => c.id === id); }
};
