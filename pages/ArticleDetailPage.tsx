
import React from 'react';
import { MOCK_ARTICLES, PILLARS } from '../constants';
import { ArrowLeft, Clock, Share2, Bookmark } from 'lucide-react';

interface Props {
  articleId: string;
}

const ArticleDetailPage: React.FC<Props> = ({ articleId }) => {
  const article = MOCK_ARTICLES.find(a => a.id === articleId);

  if (!article) {
    return (
      <main className="pt-32 min-h-screen bg-white flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold mb-4">Artigo não encontrado.</h1>
        <p className="text-gray-500 mb-8">O conteúdo que você procura pode ter sido removido ou o link está incorreto.</p>
        <a href="#/artigos" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold">Voltar para Artigos</a>
      </main>
    );
  }

  const pillar = PILLARS.find(p => p.id === article.pillarId);

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Header */}
      <header className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-6xl mx-auto text-white">
          <div className="flex items-center gap-4 mb-6">
            <a 
              href="#/artigos" 
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={20} />
            </a>
            <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              {article.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-6 text-sm font-medium opacity-80">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{new Date(article.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span>Por Prof. Paulo Donassolo</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <article className="max-w-3xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-12 py-6 border-y border-gray-100">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: pillar?.accentColor }}></div>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{pillar?.title}</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <button className="hover:text-black transition-colors"><Share2 size={20} /></button>
            <button className="hover:text-black transition-colors"><Bookmark size={20} /></button>
          </div>
        </div>

        <div 
          className="prose prose-lg prose-gray max-w-none text-gray-700 leading-relaxed space-y-8"
          dangerouslySetInnerHTML={{ __html: article.content }}
        >
        </div>

        {/* Footer of Article */}
        <div className="mt-20 pt-12 border-t border-gray-100">
          <div className="bg-gray-50 rounded-[40px] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
               <img src="https://picsum.photos/200/200?random=1" alt="Prof. Paulo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-2">Sobre o Autor</h4>
              <p className="text-gray-500 mb-6">
                Paulo Donassolo é professor, mentor e consultor com mais de 20 anos de experiência nos mercados imobiliário e de energia. Sua missão é traduzir complexidade em estratégia para seus alunos e parceiros.
              </p>
              <div className="flex gap-4">
                <a href="#/contato" className="apple-link font-bold">Ver Consultoria</a>
                <a href="#/servicos" className="apple-link font-bold">Ver Mentorias</a>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Recommended Section */}
      <section className="bg-[#f5f5f7] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Artigos Relacionados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_ARTICLES.filter(a => a.id !== articleId).slice(0, 3).map(related => (
              <a key={related.id} href={`#/artigo/${related.id}`} className="group bg-white rounded-[32px] overflow-hidden card-shadow">
                <div className="aspect-[16/10] overflow-hidden">
                  <img 
                    src={related.imageUrl} 
                    alt={related.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">{related.category}</span>
                  <h3 className="text-xl font-bold mb-4 line-clamp-2">{related.title}</h3>
                  <span className="apple-link font-semibold">Ler agora</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ArticleDetailPage;
