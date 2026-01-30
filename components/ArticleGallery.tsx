
import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Article, Pillar, PillarId } from '../types';

interface Props {
  limit?: number;
}

const ArticleGallery: React.FC<Props> = ({ limit = 12 }) => {
  const [selectedPillar, setSelectedPillar] = useState<PillarId | 'all'>('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      // Busca artigos reais do WordPress filtrando conteúdo puramente de vídeo
      const [artData, pilData] = await Promise.all([
        DataService.getArticles(limit),
        DataService.getPillars()
      ]);
      setArticles(artData);
      setPillars(pilData);
      setLoading(false);
    };
    loadContent();
  }, [limit]);

  const filteredArticles = selectedPillar === 'all' 
    ? articles 
    : articles.filter(a => a.pillarId === selectedPillar);

  const handleArticleClick = (id: string) => {
    window.location.hash = `#/artigo/${id}`;
  };

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Insights & Pensamento</h2>
            <p className="text-xl text-gray-500 font-medium">Os últimos artigos divididos por pilares de conhecimento.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedPillar('all')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-widest ${selectedPillar === 'all' ? 'bg-black text-white shadow-xl scale-105' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              Todos
            </button>
            {pillars.map(p => (
              <button 
                key={p.id}
                onClick={() => setSelectedPillar(p.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-widest ${selectedPillar === p.id ? 'bg-black text-white shadow-xl scale-105' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[16/10] rounded-[32px] bg-gray-50 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {filteredArticles.map(article => (
              <div 
                key={article.id} 
                onClick={() => handleArticleClick(article.id)}
                className="group cursor-pointer flex flex-col"
              >
                <div className="aspect-[16/10] rounded-[32px] overflow-hidden mb-6 bg-gray-100 shadow-sm border border-gray-100">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-3">
                  {pillars.find(p => p.id === article.pillarId)?.title}
                </p>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">{article.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-6 line-clamp-2 text-sm font-medium">
                  {article.excerpt}
                </p>
                <div className="mt-auto">
                  <span className="text-[#0066cc] font-bold text-sm hover:underline">Ler artigo completo ›</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {limit < 10 && (
          <div className="mt-20 text-center">
            <a href="#/artigos" className="bg-[#f5f5f7] px-10 py-4 rounded-full font-bold hover:bg-black hover:text-white transition-all shadow-sm">Ver Biblioteca Completa</a>
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticleGallery;
