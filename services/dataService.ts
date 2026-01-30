import { MOCK_ARTICLES, MOCK_COURSES, MOCK_RESOURCES, PILLARS } from '../constants.tsx';
import { Article, Course, Resource, Pillar, PillarId } from '../types.ts';

const CACHE_KEY_ARTICLES = 'phd_art_v41';
const CACHE_KEY_VIDEOS = 'phd_vid_v41';

const mapWPPostToArticle = (post: any): Article => {
  const content = post.content?.rendered || '';
  const wpCategories = post._embedded?.['wp:term']?.[0] || [];
  
  return {
    id: post.id.toString(),
    title: post.title?.rendered || 'Sem Título',
    pillarId: 'prof-paulo', 
    category: wpCategories[0]?.name || 'Geral', 
    excerpt: post.excerpt?.rendered?.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...',
    content: content,
    date: post.date,
    imageUrl: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1200'
  };
};

const secureFetch = async (endpoint: string) => {
  const cb = Date.now();
  // Caminho relativo para ignorar firewalls externos da Hostgator
  const url = `/wordpress/index.php?rest_route=/wp/v2${endpoint}&_embed&cb=${cb}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos de limite

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && !data.code) return data;
    }
  } catch (e) {
    console.warn(`Sincronização com ${endpoint} falhou ou expirou. Usando dados locais.`);
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
    if (cached) return JSON.parse(cached).slice(0, limit);
    
    const posts = await secureFetch(`/posts?per_page=20`);
    if (Array.isArray(posts)) {
      const mapped = posts.map(mapWPPostToArticle);
      localStorage.setItem(CACHE_KEY_ARTICLES, JSON.stringify(mapped));
      return mapped.slice(0, limit);
    }
    return MOCK_ARTICLES;
  },

  async getVideos(limit = 4): Promise<any[]> {
    const cached = localStorage.getItem(CACHE_KEY_VIDEOS);
    if (cached) return JSON.parse(cached).slice(0, limit);

    const posts = await secureFetch(`/posts?per_page=20`);
    if (Array.isArray(posts)) {
      const videos = posts
        .filter(p => p.content.rendered.includes('<iframe'))
        .map(p => ({
          id: p.id.toString(),
          title: p.title.rendered,
          thumb: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800'
        }));
      localStorage.setItem(CACHE_KEY_VIDEOS, JSON.stringify(videos));
      return videos.slice(0, limit);
    }
    return [];
  },

  async getArticleById(id: string): Promise<Article | undefined> {
    const all = await this.getArticles(50);
    return all.find(a => a.id === id);
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