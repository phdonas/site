
import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Article, Pillar } from '../types';
import { ArrowLeft, Clock, Share2, Bookmark, AlertCircle, ChevronRight } from 'lucide-react';

interface Props {
  articleId: string;
}

const ArticleDetailPage: React.FC<Props> = ({ articleId }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [pillar, setPillar] = useState<Pillar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    // Forçar scroll para o topo ao carregar um novo artigo
    window.scrollTo({ top: 0, behavior: 'instant' });

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await DataService.getArticleById(articleId);
        
        if (!isMounted) return;
        
        if (data) {
          setArticle(data);
          const pData = await DataService.getPillarById(data.pillarId);
          if (pData) setPillar(pData);
        } else {
          setError("Artigo não encontrado ou erro na conexão com o WordPress.");
        }
      } catch (err) {
        console.error("Erro ao carregar artigo:", err);
        setError("Não foi possível carregar o conteúdo. Verifique sua conexão.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [articleId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fbfbfd]">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 text-sm font-medium tracking-tight animate-pulse">Sincronizando com WordPress...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <main className="pt-32 min-h-screen bg-white flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Ops! Algo deu errado.</h1>
        <p className="text-gray-500 mb-8 max-w-md leading-relaxed">{error || "Não conseguimos localizar este conteúdo no momento."}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => window.location.reload()} className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-gray-800 transition-all">Tentar Novamente</button>
          <a href="#/artigos" className="bg-gray-100 px-10 py-3 rounded-full font-bold hover:bg-gray-200 transition-all">Explorar outros artigos</a>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen pb-32">
      {/* Breadcrumb e Navegação Superior */}
      <nav className="fixed top-12 left-0 right-0 z-40 apple-blur border-b border-gray-100 py-3 px-6 hidden md:block">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            <a href="#/artigos" className="hover:text-black transition-colors">Artigos</a>
            <ChevronRight size={12} />
            <span className="text-black truncate max-w-[300px]">{article.title}</span>
          </div>
          <div className="flex items-center gap-4">
             <button className="text-blue-600 hover:text-blue-700 font-bold text-xs">Compartilhar</button>
          </div>
        </div>
      </nav>

      <header className="pt-32 px-6 max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span 
              className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-sm"
              style={{ backgroundColor: pillar?.accentColor || '#0066cc' }}
            >
              {article.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-[1.1] text-[#1d1d1f]">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-gray-400">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{new Date(article.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pillar?.accentColor || '#ccc' }}></div>
               <span>Pilar: {pillar?.title}</span>
            </div>
          </div>
        </div>

        {/* Imagem de Capa Apple-Style */}
        <div className="aspect-[16/9] md:aspect-[21/9] rounded-[40px] overflow-hidden shadow-2xl mb-16 bg-gray-50 border border-gray-100">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[2s]" 
          />
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6">
        <div className="flex items-center justify-between mb-16 py-8 border-y border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center font-bold text-white text-xs">PD</div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Escrito por</p>
              <p className="text-sm font-bold text-[#1d1d1f]">Paulo Donassolo</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <button className="p-2 hover:bg-gray-50 rounded-full transition-colors" title="Compartilhar"><Share2 size={20} /></button>
            <button className="p-2 hover:bg-gray-50 rounded-full transition-colors" title="Salvar"><Bookmark size={20} /></button>
          </div>
        </div>
        
        {/* Renderização do Conteúdo WordPress */}
        <div 
          className="wp-content-render prose prose-lg md:prose-xl prose-slate max-w-none text-[#1d1d1f]" 
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />
        
        {/* Rodapé do Artigo */}
        <footer className="mt-24 border-t border-gray-100 pt-16">
          <div className="bg-[#f5f5f7] rounded-[48px] p-10 md:p-16 text-center">
            <h3 className="text-3xl font-bold mb-4 tracking-tight">O que vem a seguir?</h3>
            <p className="text-gray-500 mb-10 max-w-md mx-auto font-medium">Fique por dentro das novidades, insights e novos lançamentos do Prof. Paulo diretamente no seu e-mail.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#/contato" className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">Quero saber mais</a>
              <a href="#/artigos" className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-all border border-gray-200">Ver mais artigos</a>
            </div>
          </div>
        </footer>
      </article>

      {/* Botão Flutuante Voltar (Mobile) */}
      <a 
        href="#/artigos" 
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-xl text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl border border-white/10"
      >
        <ArrowLeft size={18} /> Voltar ao Blog
      </a>
    </main>
  );
};

export default ArticleDetailPage;
