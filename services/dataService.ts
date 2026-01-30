
import { MOCK_ARTICLES, MOCK_COURSES, MOCK_RESOURCES, PILLARS } from '../constants';
import { Article, Course, Resource, Pillar, PillarId } from '../types';

const CACHE_KEY_ARTICLES = 'phd_articles_v8';
const CACHE_KEY_VIDEOS = 'phd_videos_v8';

let memoryArticles: Article[] = JSON.parse(localStorage.getItem(CACHE_KEY_ARTICLES) || '[]');
let memoryVideos: any[] = JSON.parse(localStorage.getItem(CACHE_KEY_VIDEOS) || '[]');

const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    localStorage.clear();
  }
};

const mapWPPostToArticle = (post: any): Article => {
  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                   'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1200';
  const wpCategories = post._embedded?.['wp:term']?.[0] || [];
  
  return {
    id: post.id.toString(),
    title: post.title.rendered,
    pillarId: 'prof-paulo', // Simplificado para performance
    category: wpCategories[0]?.name || 'Geral', 
    excerpt: post.excerpt?.rendered?.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...',
    content: post.content?.rendered || '',
    date: post.date,
    imageUrl: imageUrl
  };
};

const secureFetch = async (endpoint: string) => {
  const targetUrl = `https://phdonassolo.com/wp-json/wp/v2${endpoint}${endpoint.includes('?') ? '&' : '?'}doing_wp_cron=1`;
  
  try {
    const controller = new AbortController();
    // Aumentamos o timeout para 12s devido à lentidão confirmada no DB do usuário
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(targetUrl, { signal: controller.signal });
    clearTimeout(timeout);
    
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback silencioso via proxy se falhar
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&t=${Date.now()}`;
    try {
      const res = await fetch(proxyUrl);
      const wrapper = await res.json();
      return typeof wrapper.contents === 'string' ? JSON.parse(wrapper.contents) : wrapper.contents;
    } catch (err) {
      return null;
    }
  }
  return null;
};

export const DataService = {
  async testConnection(): Promise<boolean> {
    const data = await secureFetch('/posts?per_page=1');
    return !!data;
  },

  async getArticles(limit = 12): Promise<Article[]> {
    const syncBackground = async () => {
      const posts = await secureFetch(`/posts?_embed&per_page=30`); // Reduzido de 50 para 30 para aliviar o banco
      if (Array.isArray(posts)) {
        const mapped = posts.map(mapWPPostToArticle);
        memoryArticles = mapped;
        saveToLocalStorage(CACHE_KEY_ARTICLES, mapped);
      }
    };

    if (memoryArticles.length > 0) {
      syncBackground();
      return memoryArticles.slice(0, limit);
    }

    await syncBackground();
    return memoryArticles.length > 0 ? memoryArticles.slice(0, limit) : MOCK_ARTICLES;
  },

  async getVideos(limit = 4): Promise<any[]> {
    const syncVideos = async () => {
      const posts = await secureFetch(`/posts?_embed&per_page=10`);
      if (Array.isArray(posts)) {
        const mapped = posts
          .filter(p => p.content.rendered.includes('<iframe'))
          .map(p => ({
            id: p.id,
            title: p.title.rendered,
            content: p.content.rendered,
            thumb: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1492619334760-22c0217e33ff?auto=format&fit=crop&q=80&w=400'
          }));
        memoryVideos = mapped;
        saveToLocalStorage(CACHE_KEY_VIDEOS, mapped);
      }
    };

    if (memoryVideos.length > 0) {
      syncVideos();
      return memoryVideos.slice(0, limit);
    }

    await syncVideos();
    return memoryVideos.slice(0, limit);
  },

  async getArticleById(id: string): Promise<Article | undefined> {
    const local = memoryArticles.find(a => a.id === id);
    if (local) return local;
    const post = await secureFetch(`/posts/${id}?_embed`);
    return post ? mapWPPostToArticle(post) : undefined;
  },

  async getArticlesByPillar(pillarId: PillarId, limit = 3): Promise<Article[]> {
    if (memoryArticles.length === 0) await this.getArticles(20);
    return memoryArticles.filter(a => a.pillarId === pillarId).slice(0, limit);
  },

  async getCourses(): Promise<Course[]> { return MOCK_COURSES; },
  async getResources(): Promise<Resource[]> { return MOCK_RESOURCES; },
  async getPillars(): Promise<Pillar[]> { return PILLARS; },
  async getPillarById(id: string): Promise<Pillar | undefined> { return PILLARS.find(p => p.id === id); },
  async getCourseById(id: string): Promise<Course | undefined> { return MOCK_COURSES.find(c => c.id === id); }
};
