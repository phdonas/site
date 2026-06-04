import { MOCK_ARTICLES, MOCK_COURSES, MOCK_RESOURCES, PILLARS } from '../constants.tsx';
import { Article, Course, Resource, Pillar, PillarId } from '../types.ts';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase.ts';

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
    try {
      const snap = await getDocs(collection(db, 'settings'));
      return true;
    } catch(e) {
      return false;
    }
  },

  async getArticles(limit = 12, includeScheduled = false): Promise<Article[]> {
    try {
      const snap = await getDocs(collection(db, 'articles'));
      let articles = snap.docs.map(d => ({id: d.id, ...d.data()}) as Article);
      
      // Filtro de data de publicação
      if (!includeScheduled) {
        const now = new Date().toISOString();
        articles = articles.filter(a => !a.publishDate || a.publishDate <= now);
      }
      
      return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit);
    } catch {
      return MOCK_ARTICLES;
    }
  },

  async getVideos(limit = 4, includeScheduled = false): Promise<any[]> {
    try {
      const snap = await getDocs(collection(db, 'videos'));
      let vids = snap.docs.map(d => ({id: d.id, ...d.data()}) as any);
      
      if (!includeScheduled) {
        const now = new Date().toISOString();
        vids = vids.filter(v => !v.publishDate || v.publishDate <= now);
      }
      
      return vids.slice(0, limit);
    } catch {
      return [];
    }
  },

  async getArticleById(id: string): Promise<Article | undefined> {
    const all = await this.getArticles(500, true);
    return all.find(a => a.id === id);
  },

  async getArticlesByPillar(pillarId: PillarId, limit = 3): Promise<Article[]> {
    const all = await this.getArticles(500);
    return all.filter(a => a.pillarId === pillarId).slice(0, limit);
  },

  async getCourses(): Promise<Course[]> { 
    try {
      const snap = await getDocs(collection(db, 'courses'));
      if (snap.empty) return MOCK_COURSES;
      return snap.docs.map(d => ({id: d.id, ...d.data()}) as Course);
    } catch { return MOCK_COURSES; }
  },
  
  async getBooks(): Promise<any[]> {
    try {
      const snap = await getDocs(collection(db, 'books'));
      // Precisamos importar o MOCK_BOOKS lá no topo se quisermos o fallback, mas por enquanto vamos resolver se tiver vazio
      return snap.docs.map(d => ({id: d.id, ...d.data()}));
    } catch { return []; }
  },

  async getResources(): Promise<Resource[]> { 
    try {
      const snap = await getDocs(collection(db, 'resources'));
      if (snap.empty) return MOCK_RESOURCES;
      return snap.docs.map(d => ({id: d.id, ...d.data()}) as Resource);
    } catch { return MOCK_RESOURCES; }
  },

  async getPillars(): Promise<Pillar[]> { 
    try {
      const snap = await getDocs(collection(db, 'pillars'));
      if (snap.empty) return PILLARS;
      return snap.docs.map(d => ({id: d.id, ...d.data()}) as Pillar);
    } catch { return PILLARS; }
  },
  
  async getPillarById(id: string): Promise<Pillar | undefined> { 
    const all = await this.getPillars();
    return all.find(p => p.id === id); 
  },
  async getCourseById(id: string): Promise<Course | undefined> { 
    const all = await this.getCourses();
    return all.find(c => c.id === id); 
  },

  async migrateDataToFirestore() {
    try {
      // 1. Upar dados estáticos do constants.ts
      for (const p of PILLARS) await setDoc(doc(db, 'pillars', p.id), p);
      for (const c of MOCK_COURSES) await setDoc(doc(db, 'courses', c.id), c);
      for (const r of MOCK_RESOURCES) await setDoc(doc(db, 'resources', r.id), r);
      
      // Importar dinamicamente MOCK_BOOKS para evitar problema de escopo circular se faltar lá no topo
      const { MOCK_BOOKS } = await import('../constants.tsx');
      if (MOCK_BOOKS) {
        for (const b of MOCK_BOOKS) await setDoc(doc(db, 'books', b.id), b);
      }

      // 2. Bater na API do WP PELA ÚLTIMA VEZ para resgatar os Artigos e Vídeos Históricos
      const posts = await secureFetch('/posts&per_page=100');
      if (posts && Array.isArray(posts)) {
          // Artigos
          const mappedArticles = posts.map(mapWPPostToArticle);
          for (const art of mappedArticles) {
            art.publishDate = art.date; // já foram publicados
            await setDoc(doc(db, 'articles', art.id), art);
          }
          
          // Vídeos
          const wpVideos = posts
            .filter((p: any) => p.content.rendered.includes('<iframe'))
            .map((p: any) => {
              const iframeMatch = p.content.rendered.match(/<iframe.*?src="(.*?)".*?><\/iframe>/);
              return {
                id: 'vid_' + p.id.toString(),
                title: p.title.rendered,
                url: iframeMatch ? iframeMatch[1] : '',
                thumb: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
                publishDate: p.date
              };
            });
            
          for (const vid of wpVideos) {
            await setDoc(doc(db, 'videos', vid.id), vid);
          }
        }

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async getLPBySlug(slug: string): Promise<any> {
    const allResources = await this.getResources();
    const resource = allResources.find(r => r.id === slug);
    
    if (resource) {
      return {
        pageTitle: `Acesso: ${resource.name}`,
        titleLine1: 'Acesso Liberado:',
        titleLine2: resource.name,
        heroDesc: `Preencha seus dados abaixo para acessar este material e aplicar o conteúdo agora mesmo.`,
        formTitle: 'Receber Acesso',
        formSubtitle: 'Seus dados estão 100% seguros.',
        buttonText: resource.type === 'LINK' ? 'Acessar Ferramenta' : 'Baixar Arquivo',
        redirectUrl: resource.url,
        materialId: resource.id,
        webAppUrl: '', // O usuário deve adicionar a URL do Google Script aqui se tiver
        showTerms: true,
        bgColor: '#ffffff',
        textColor: '#000000',
        primaryColor: '#2563eb', // blue-600
        buttonBgColor: '#000000',
        buttonTextColor: '#ffffff',
        badge: resource.category,
        beneficios: [
          'Acesso imediato e gratuito',
          'Conteúdo prático e testado',
          'Feito para acelerar seus resultados'
        ]
      };
    }
    return null;
  },

  async getGlobalSettings(): Promise<any> {
    try {
      const snap = await getDoc(doc(db, 'settings', 'global'));
      if (snap.exists()) {
        return snap.data();
      }
    } catch (e) {
      console.warn("Usando configurações locais (Firestore indisponível ou vazio para settings)");
    }
    // Fallback dinâmico para o arquivo estático
    const { SITE_CONFIG } = await import('../config/site-config.ts');
    return SITE_CONFIG;
  },

  async saveGlobalSettings(newConfig: any): Promise<boolean> {
    try {
      await setDoc(doc(db, 'settings', 'global'), newConfig);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};