
import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Article, Pillar } from '../types';
import { ArrowLeft, Clock, Share2, Bookmark, AlertCircle } from 'lucide-react';

interface Props {
  articleId: string;
}

const ArticleDetailPage: React.FC<Props> = ({ articleId }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [pillar, setPillar] = useState<Pillar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await DataService.getArticleById(articleId);
        if (!isMounted) return;
        
        if (data) {
          setArticle(data);
          const pData = await DataService.getPillarById(data.pillarId);
          if (pData) setPillar(pData);
        }
      } catch (err) {
        console.error("Erro ao carregar artigo:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [articleId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-medium tracking-tight">Preparando sua leitura...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <main className="pt-32 min-h-screen bg-white flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-4xl font-bold mb-4">Conteúdo Indisponível</h1>
        <p className="text-gray-500 mb-8 max-w-md">Não conseguimos conectar ao seu WordPress para recuperar este artigo. Tente recarregar a página.</p>
        <div className="flex gap-4">
          <button onClick={() => window.location.reload()} className="bg-black text-white px-8 py-3 rounded-full font-bold">Recarregar</button>
          <a href="#/artigos" className="bg-gray-100 px-8 py-3 rounded-full font-bold">Voltar ao Blog</a>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen pb-20">
      <header className="relative w-full h-[65vh] overflow-hidden">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-16 max-w-6xl mx-auto text-white">
          <div className="flex items-center gap-4 mb-8">
            <a href="#/artigos" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center hover:bg-white/30 transition-all border border-white/20">
              <ArrowLeft size={24} />
            </a>
            <span className="bg-blue-600 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl">
              {article.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-8 max-w-5xl leading-[1.1]">
            {article.title}
          </h1>
          <div className="flex items-center gap-8 text-sm font-semibold opacity-80">
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{new Date(article.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pillar?.accentColor }}></div>
               <span>{pillar?.title}</span>
            </div>
          </div>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-16 py-8 border-y border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400">PD</div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Autor</p>
              <p className="text-sm font-bold">Paulo Donassolo</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-gray-400">
            <button className="hover:text-blue-600 transition-colors flex items-center gap-2 text-sm font-bold"><Share2 size={20} /> Compartilhar</button>
            <button className="hover:text-blue-600 transition-colors"><Bookmark size={20} /></button>
          </div>
        </div>
        
        <div 
          className="wp-content-render prose prose-xl prose-blue max-w-none" 
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />
        
        <div className="mt-24 p-12 bg-[#f5f5f7] rounded-[48px] text-center">
          <h3 className="text-2xl font-bold mb-4">Gostou deste conteúdo?</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Inscreva-se para receber novos artigos e materiais exclusivos de Paulo Donassolo.</p>
          <a href="#/contato" className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold inline-block hover:bg-blue-700 transition-all">Receber novidades</a>
        </div>
      </article>
    </main>
  );
};

export default ArticleDetailPage;
