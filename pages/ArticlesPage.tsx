
import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Article, Pillar, PillarId } from '../types';
import { Search } from 'lucide-react';

const ArticlesPage: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState<PillarId | 'all'>('all');
  const [search, setSearch] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [artData, pilData] = await Promise.all([
        DataService.getArticles(),
        DataService.getPillars()
      ]);
      setArticles(artData);
      setPillars(pilData);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchesPillar = selectedPillar === 'all' || article.pillarId === selectedPillar;
    const matchesSearch = article.title.toLowerCase().includes(search.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesPillar && matchesSearch;
  });

  const categories = Array.from(new Set(articles.map(a => a.category)));

  return (
    <main className="pt-24 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <header className="mb-16">
          <h1 className="text-6xl font-bold tracking-tight mb-4">Biblioteca de Ideias</h1>
          <p className="text-2xl text-gray-500 font-medium max-w-2xl">
            Exploração profunda sobre nossos pilares de conteúdo, mentoria e mercado.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="w-full md:w-64 space-y-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar artigos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Filtrar por Pilar</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => setSelectedPillar('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedPillar === 'all' ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-gray-100'}`}
                >
                  Todos os Pilares
                </button>
                {pillars.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => setSelectedPillar(p.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedPillar === p.id ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-gray-100'}`}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Categorias</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <span key={cat} className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors uppercase tracking-wider">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="py-20 text-center text-gray-400 font-medium">Carregando artigos...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                {filteredArticles.map(article => (
                  <article key={article.id} className="group cursor-pointer">
                    <div className="aspect-[16/9] rounded-3xl overflow-hidden mb-6 bg-gray-100 shadow-sm">
                      <img 
                        src={article.imageUrl} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{article.category}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                        {new Date(article.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <a href={`#/artigo/${article.id}`} className="apple-link font-semibold inline-flex items-center gap-1 group">
                      Continuar lendo <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                  </article>
                ))}
                {filteredArticles.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">Nenhum artigo encontrado com estes critérios.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ArticlesPage;
