
import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Article, Pillar, PillarId } from '../types';

const ArticleGallery: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState<PillarId | 'all'>('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      const [artData, pilData] = await Promise.all([
        DataService.getArticles(),
        DataService.getPillars()
      ]);
      setArticles(artData);
      setPillars(pilData);
      setLoading(false);
    };
    loadContent();
  }, []);

  const filteredArticles = selectedPillar === 'all' 
    ? articles 
    : articles.filter(a => a.pillarId === selectedPillar);

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">Insights & Pensamento</h2>
            <p className="text-xl text-gray-500 font-medium">Os últimos artigos divididos por pilares de conhecimento.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedPillar('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedPillar === 'all' ? 'bg-black text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Todos
            </button>
            {pillars.map(p => (
              <button 
                key={p.id}
                onClick={() => setSelectedPillar(p.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedPillar === p.id ? 'bg-black text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400 font-medium">Carregando galeria...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredArticles.map(article => (
              <div key={article.id} className="group cursor-pointer">
                <div className="aspect-[16/10] rounded-3xl overflow-hidden mb-6 bg-gray-100">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  {pillars.find(p => p.id === article.pillarId)?.title}
                </p>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">{article.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                <a href={`#/artigo/${article.id}`} className="apple-link font-semibold">Ler artigo completo</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticleGallery;
