
import { MOCK_ARTICLES, MOCK_COURSES, MOCK_RESOURCES, PILLARS } from '../constants';
import { Article, Course, Resource, Pillar, PillarId } from '../types';

const CACHE_KEY_ARTICLES = 'phd_articles_v15';
const CACHE_KEY_VIDEOS = 'phd_videos_v15';

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

const secureFetch = async (endpoint: string) => {
  const urls = [
    `https://www.phdonassolo.com/wp-json/wp/v2${endpoint}`,
    `https://phdonassolo.com/wp-json/wp/v2${endpoint}`
  ];

  for (const url of urls) {
    const sep = url.includes('?') ? '&' : '?';
    const finalUrl = `${url}${sep}_embed&nocache=${Date.now()}`;
    
    try {
      const res = await fetch(finalUrl);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) || (data && data.id)) return data;
      }
    } catch (e) {
      console.warn("Falha direta, tentando proxy...");
    }

    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(finalUrl)}&t=${Date.now()}`;
      const proxyRes = await fetch(proxyUrl);
      const wrapper = await proxyRes.json();
      const data = typeof wrapper.contents === 'string' ? JSON.parse(wrapper.contents) : wrapper.contents;
      if (data && !data.data?.status) return data;
    } catch (err) {
      continue;
    }
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
    memoryArticles = [];
    memoryVideos = [];
    window.location.reload();
  },

  async getArticles(limit = 12, force = false): Promise<Article[]> {
    if (!force && memoryArticles.length > 0) return memoryArticles.slice(0, limit);
    
    const posts = await secureFetch(`/posts?per_page=50`);
    if (Array.isArray(posts)) {
      const mapped = posts
        .filter(p => !p.content.rendered.toLowerCase().includes('<iframe'))
        .map(mapWPPostToArticle);
      
      memoryArticles = mapped;
      localStorage.setItem(CACHE_KEY_ARTICLES, JSON.stringify(mapped));
      return mapped.slice(0, limit);
    }
    return memoryArticles.slice(0, limit);
  },

  async getVideos(limit = 4, force = false): Promise<any[]> {
    if (!force && memoryVideos.length > 0) return memoryVideos.slice(0, limit);

    const posts = await secureFetch(`/posts?per_page=50`);
    if (Array.isArray(posts)) {
      const mapped = posts
        .filter(p => {
          const c = p.content.rendered.toLowerCase();
          return c.includes('<iframe') || c.includes('youtube.com') || c.includes('vimeo.com') || c.includes('wp-block-embed');
        })
        .map(p => ({
          id: p.id.toString(),
          title: p.title.rendered,
          content: p.content.rendered,
          thumb: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || extractFirstImage(p.content.rendered)
        }));
      
      memoryVideos = mapped;
      localStorage.setItem(CACHE_KEY_VIDEOS, JSON.stringify(mapped));
      return mapped.slice(0, limit);
    }
    return memoryVideos.slice(0, limit);
  },

  async getArticleById(id: string): Promise<Article | undefined> {
    const local = memoryArticles.find(a => a.id === id);
    if (local) return local;
    const post = await secureFetch(`/posts/${id}`);
    return post ? mapWPPostToArticle(post) : undefined;
  },

  async getArticlesByPillar(pillarId: PillarId, limit = 3): Promise<Article[]> {
    if (memoryArticles.length === 0) await this.getArticles(50);
    return memoryArticles.filter(a => a.pillarId === pillarId).slice(0, limit);
  },

  async getCourses(): Promise<Course[]> { return MOCK_COURSES; },
  async getResources(): Promise<Resource[]> { return MOCK_RESOURCES; },
  async getPillars(): Promise<Pillar[]> { return PILLARS; },
  async getPillarById(id: string): Promise<Pillar | undefined> { return PILLARS.find(p => p.id === id); },
  async getCourseById(id: string): Promise<Course | undefined> { return MOCK_COURSES.find(c => c.id === id); }
};
