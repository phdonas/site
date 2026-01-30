
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
        console.error("Erro ao carregar artigo.");
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

  // Se após carregar ainda não tiver artigo, mostra erro
  if (!article) {
    return (
      <main className="pt-32 min-h-screen bg-white flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-4xl font-bold mb-4">Artigo Indisponível</h1>
        <p className="text-gray-500 mb-8 max-w-md">O conteúdo não pôde ser recuperado. Verifique sua conexão ou tente novamente mais tarde.</p>
        <a href="#/artigos" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-500/20">Ver outros artigos</a>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen pb-20">
      <header className="relative w-full h-[60vh] overflow-hidden">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-6xl mx-auto text-white">
          <div className="flex items-center gap-4 mb-6">
            <a href="#/artigos" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors">
              <ArrowLeft size={20} />
            </a>
            <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
              {article.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-6 text-sm font-medium opacity-80">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{new Date(article.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-12 py-6 border-y border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: pillar?.accentColor || '#ccc' }}></div>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{pillar?.title || 'Paulo Donassolo'}</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <button className="hover:text-black transition-colors" title="Compartilhar"><Share2 size={20} /></button>
            <button className="hover:text-black transition-colors" title="Salvar"><Bookmark size={20} /></button>
          </div>
        </div>
        
        <div 
          className="prose prose-lg prose-blue max-w-none text-gray-800 leading-relaxed 
                     prose-headings:text-black prose-headings:font-bold prose-headings:tracking-tight 
                     prose-img:rounded-3xl prose-img:shadow-xl
                     prose-a:text-blue-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline" 
          dangerouslySetInnerHTML={{ __html: article.content || '<p>Conteúdo não disponível.</p>' }} 
        />
      </article>
    </main>
  );
};

export default ArticleDetailPage;
