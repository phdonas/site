
import React, { useEffect } from 'react';
import { PILLARS, MOCK_ARTICLES } from '../constants';
import { ArrowRight } from 'lucide-react';

const PillarsPage: React.FC = () => {
  useEffect(() => {
    // Handle hash scrolling if user lands here with #pillar-id
    if (window.location.hash) {
      const id = window.location.hash.split('#')[2]; // Format: #/pilares#id
      if (id) {
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    }
  }, []);

  return (
    <main className="pt-24 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <header className="py-20 text-center">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8">Nossos Pilares.</h1>
          <p className="text-2xl text-gray-500 max-w-2xl mx-auto font-medium">
            O conhecimento organizado em frentes estratégicas para sua evolução contínua.
          </p>
        </header>

        <div className="space-y-32">
          {PILLARS.map((pillar) => (
            <section key={pillar.id} id={pillar.id} className="scroll-mt-32">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
                <div className="order-2 lg:order-1">
                  <span className="text-sm font-bold uppercase tracking-widest mb-4 block" style={{ color: pillar.accentColor }}>
                    {pillar.title}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                    {pillar.description}
                  </h2>
                  <p className="text-xl text-gray-500 leading-relaxed mb-8">
                    {pillar.longDescription}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a 
                      href={`#/artigos?pillar=${pillar.id}`} 
                      className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all flex items-center gap-2"
                    >
                      Ver Artigos deste Pilar <ArrowRight size={18} />
                    </a>
                  </div>
                </div>
                <div className="order-1 lg:order-2 rounded-[48px] overflow-hidden aspect-[4/3] bg-gray-100">
                  <img 
                    src={pillar.imageUrl} 
                    alt={pillar.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Mini Gallery for this Pillar */}
              <div className="bg-[#f5f5f7] rounded-[48px] p-8 md:p-16">
                <h3 className="text-2xl font-bold mb-10">Recentes em {pillar.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {MOCK_ARTICLES.filter(a => a.pillarId === pillar.id).slice(0, 3).map(article => (
                    <a key={article.id} href={`#/artigo/${article.id}`} className="group block">
                      <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-white shadow-sm">
                        <img 
                          src={article.imageUrl} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h4 className="text-lg font-bold group-hover:text-blue-600 transition-colors leading-snug">
                        {article.title}
                      </h4>
                    </a>
                  ))}
                  {MOCK_ARTICLES.filter(a => a.pillarId === pillar.id).length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-400 font-medium">
                      Novos artigos em breve neste pilar.
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
};

export default PillarsPage;
