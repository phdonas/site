import { MOCK_ARTICLES, MOCK_COURSES, MOCK_RESOURCES, PILLARS } from '../constants.tsx';
import { Article, Course, Resource, Pillar, PillarId } from '../types.ts';

const CACHE_KEY_ARTICLES = 'phd_articles_v32';
const CACHE_KEY_VIDEOS = 'phd_videos_v32';

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
  const content = post.content?.rendered || '';
  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || extractFirstImage(content);
  const wpCategories = post._embedded?.['wp:term']?.[0] || [];
  return {
    id: post.id.toString(),
    title: post.title?.rendered || 'Sem Título',
    pillarId: mapCategoryToPillar(wpCategories),
    category: wpCategories[0]?.name || 'Geral', 
    excerpt: post.excerpt?.rendered?.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...',
    content: content,
    date: post.date,
    imageUrl: imageUrl
  };
};

const secureFetch = async (endpoint: string) => {
  const cb = Date.now();
  const directUrl = `https://phdonassolo.com/wordpress/index.php?rest_route=/wp/v2${endpoint}&_embed&cb=${cb}`;
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(directUrl)}`;

  try {
    // Tentativa 1: Direta
    const res = await fetch(directUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && !data.code) return data;
    }
  } catch (e) {
    console.warn("Conexão direta falhou, tentando via Proxy...");
  }

  try {
    // Tentativa 2: Via Proxy (Túnel para evitar bloqueios de servidor)
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const wrapper = await res.json();
      const data = JSON.parse(wrapper.contents);
      if (data && !data.code) return data;
    }
  } catch (e) {
    console.error("Todas as tentativas de sincronização falharam.");
  }
  return null;
};

export const DataService = {
  async testConnection(): Promise<boolean> {
    const data = await secureFetch('/posts?per_page=1');
    return !!(data && Array.isArray(data));
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
      const mapped = posts.map(mapWPPostToArticle);
      if (mapped.length > 0) {
        localStorage.setItem(CACHE_KEY_ARTICLES, JSON.stringify(mapped));
        return mapped.slice(0, limit);
      }
    }
    return MOCK_ARTICLES;
  },

  async getVideos(limit = 4): Promise<any[]> {
    const cached = localStorage.getItem(CACHE_KEY_VIDEOS);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed.slice(0, limit);
      } catch(e) { 
        localStorage.removeItem(CACHE_KEY_VIDEOS); 
      }
    }

    const posts = await secureFetch(`/posts?per_page=50`);
    if (Array.isArray(posts)) {
      const videos = posts
        .filter(p => {
          const c = p.content?.rendered?.toLowerCase() || '';
          return c.includes('<iframe') || c.includes('youtube.com') || c.includes('vimeo.com');
        })
        .map(p => ({
          id: p.id.toString(),
          title: p.title?.rendered || 'Vídeo',
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
    const cached = localStorage.getItem(CACHE_KEY_ARTICLES);
    if (cached) {
      const articles = JSON.parse(cached);
      const found = articles.find((a: Article) => a.id === id);
      if (found) return found;
    }
    const post = await secureFetch(`/posts/${id}`);
    return (post && post.id) ? mapWPPostToArticle(post) : undefined;
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