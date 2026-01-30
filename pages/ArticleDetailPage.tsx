
import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Article, Pillar } from '../types';
import { ArrowLeft, Clock, Share2, Bookmark } from 'lucide-react';

interface Props {
  articleId: string;
}

const ArticleDetailPage: React.FC<Props> = ({ articleId }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [pillar, setPillar] = useState<Pillar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await DataService.getArticleById(articleId);
      if (data) {
        setArticle(data);
        const pData = await DataService.getPillarById(data.pillarId);
        if (pData) setPillar(pData);
      }
      setLoading(false);
    };
    loadData();
  }, [articleId]);

  if (loading) return <div className="pt-40 text-center font-medium text-gray-400">Carregando artigo...</div>;

  if (!article) {
    return (
      <main className="pt-32 min-h-screen bg-white flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold mb-4">Artigo não encontrado.</h1>
        <p className="text-gray-500 mb-8">O conteúdo que você procura pode ter sido removido.</p>
        <a href="#/artigos" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold">Voltar para Artigos</a>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <header className="relative w-full h-[60vh] overflow-hidden">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-6xl mx-auto text-white">
          <div className="flex items-center gap-4 mb-6">
            <a href="#/artigos" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
              <ArrowLeft size={20} />
            </a>
            <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
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
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pillar?.accentColor || '#ccc' }}></div>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{pillar?.title}</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <button className="hover:text-black transition-colors"><Share2 size={20} /></button>
            <button className="hover:text-black transition-colors"><Bookmark size={20} /></button>
          </div>
        </div>
        <div className="prose prose-lg text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>
    </main>
  );
};

export default ArticleDetailPage;
