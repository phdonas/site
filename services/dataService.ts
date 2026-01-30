
import { MOCK_ARTICLES, MOCK_COURSES, MOCK_RESOURCES, PILLARS } from '../constants';
import { Article, Course, Resource, Pillar, PillarId } from '../types';

const CACHE_KEY_ARTICLES = 'phd_articles_v14';
const CACHE_KEY_VIDEOS = 'phd_videos_v14';

let memoryArticles: Article[] = JSON.parse(localStorage.getItem(CACHE_KEY_ARTICLES) || '[]');
let memoryVideos: any[] = JSON.parse(localStorage.getItem(CACHE_KEY_VIDEOS) || '[]');

const mapCategoryToPillar = (wpCategories: any[]): PillarId => {
  if (!wpCategories || wpCategories.length === 0) return 'prof-paulo';
  const names = wpCategories.map(c => (c.name || '').toLowerCase());
  
  if (names.some(n => n.includes('paulo') || n.includes('prof'))) return 'prof-paulo';
  if (names.some(n => n.includes('imob') || n.includes('consultor'))) return 'consultoria-imobiliaria';
  if (names.some(n => n.includes('4050') || n.includes('longevid') || n.includes('mais'))) return '4050oumais';
  if (names.some(n => n.includes('gas') || n.includes('academia'))) return 'academia-do-gas';
  
  return 'prof-paulo';
};

const mapWPPostToArticle = (post: any): Article => {
  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                   'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1200';
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

const secureFetch = async (endpoint: string) => {
  const urlsToTry = [
    `https://www.phdonassolo.com/wp-json/wp/v2${endpoint}`,
    `https://phdonassolo.com/wp-json/wp/v2${endpoint}`,
    `https://www.phdonassolo.com/index.php/wp-json/wp/v2${endpoint}`
  ];

  for (const baseUrl of urlsToTry) {
    const sep = baseUrl.includes('?') ? '&' : '?';
    const targetUrl = `${baseUrl}${sep}_embed&per_page=50&nocache=${Date.now()}`;
    
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      const res = await fetch(targetUrl, { signal: controller.signal });
      clearTimeout(timeout);
      
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn(`Tentando proxy para ${baseUrl}...`);
    }

    // Proxy Fallback
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&t=${Date.now()}`;
    try {
      const res = await fetch(proxyUrl);
      const wrapper = await res.json();
      const data = typeof wrapper.contents === 'string' ? JSON.parse(wrapper.contents) : wrapper.contents;
      if (Array.isArray(data)) return data;
    } catch (err) { continue; }
  }
  return null;
};

export const DataService = {
  async testConnection(): Promise<boolean> {
    const data = await secureFetch('/posts?per_page=1');
    return !!data && Array.isArray(data);
  },

  async clearCache() {
    localStorage.removeItem(CACHE_KEY_ARTICLES);
    localStorage.removeItem(CACHE_KEY_VIDEOS);
    memoryArticles = [];
    memoryVideos = [];
    return Promise.all([this.getArticles(20, true), this.getVideos(10, true)]);
  },

  async getArticles(limit = 12, force = false): Promise<Article[]> {
    const sync = async () => {
      const posts = await secureFetch(`/posts`);
      if (Array.isArray(posts)) {
        const mapped = posts
          .filter(p => {
            const content = (p.content.rendered || '').toLowerCase();
            return !content.includes('<iframe') && !content.includes('youtube.com') && !content.includes('vimeo.com');
          })
          .map(mapWPPostToArticle);
        
        if (mapped.length > 0) {
          memoryArticles = mapped;
          localStorage.setItem(CACHE_KEY_ARTICLES, JSON.stringify(mapped));
        }
        return mapped;
      }
      return memoryArticles;
    };

    if (force || memoryArticles.length === 0) return await sync();
    sync(); // background sync
    return memoryArticles.slice(0, limit);
  },

  async getVideos(limit = 4, force = false): Promise<any[]> {
    const sync = async () => {
      const posts = await secureFetch(`/posts`);
      if (Array.isArray(posts)) {
        const mapped = posts
          .filter(p => {
            const content = (p.content.rendered || '').toLowerCase();
            return content.includes('<iframe') || content.includes('youtube.com') || content.includes('vimeo.com') || content.includes('wp-block-embed');
          })
          .map(p => ({
            id: p.id.toString(),
            title: p.title.rendered,
            content: p.content.rendered,
            thumb: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1492619334760-22c0217e33ff?auto=format&fit=crop&q=80&w=400'
          }));
        
        if (mapped.length > 0) {
          memoryVideos = mapped;
          localStorage.setItem(CACHE_KEY_VIDEOS, JSON.stringify(mapped));
        }
        return mapped;
      }
      return memoryVideos;
    };

    if (force || memoryVideos.length === 0) return await sync();
    sync(); // background sync
    return memoryVideos.slice(0, limit);
  },

  async getArticleById(id: string): Promise<Article | undefined> {
    if (memoryArticles.length === 0) await this.getArticles(30);
    return memoryArticles.find(a => a.id === id);
  },

  async getArticlesByPillar(pillarId: PillarId, limit = 3): Promise<Article[]> {
    if (memoryArticles.length === 0) await this.getArticles(30);
    return memoryArticles.filter(a => a.pillarId === pillarId).slice(0, limit);
  },

  async getCourses(): Promise<Course[]> { return MOCK_COURSES; },
  async getResources(): Promise<Resource[]> { return MOCK_RESOURCES; },
  async getPillars(): Promise<Pillar[]> { return PILLARS; },
  async getPillarById(id: string): Promise<Pillar | undefined> { return PILLARS.find(p => p.id === id); },
  async getCourseById(id: string): Promise<Course | undefined> { return MOCK_COURSES.find(c => c.id === id); }
};
