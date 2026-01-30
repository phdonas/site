
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import CourseDetailPage from './pages/CourseDetailPage';
import ServicesPage from './pages/ServicesPage';
import DownloadsPage from './pages/DownloadsPage';
import ContactPage from './pages/ContactPage';
import PillarsPage from './pages/PillarsPage';
import CoursesBooksPage from './pages/CoursesBooksPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';
import AIChat from './components/AIChat';
import WhatsAppButton from './components/WhatsAppButton';
import { SITE_CONFIG } from './config/site-config';

const App: React.FC = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
      // Se não for uma navegação de âncora dentro da mesma página de pilares, sobe para o topo
      if (!window.location.hash.includes('#/pilares#')) {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderContent = () => {
    // 1. Rotas Dinâmicas com Prefixo
    if (currentHash.startsWith('#/artigo/')) {
      const articleId = currentHash.replace('#/artigo/', '');
      return <ArticleDetailPage articleId={articleId} />;
    }
    if (currentHash.startsWith('#/curso/')) {
      const courseId = currentHash.replace('#/curso/', '');
      return <CourseDetailPage courseId={courseId} />;
    }
    
    // 2. Rota de Pilares (Suporta âncoras para não dar 404)
    if (currentHash.startsWith('#/pilares')) {
      return <PillarsPage />;
    }

    // 3. Rotas Estáticas Exatas
    switch (currentHash) {
      case '#/': 
      case '#': 
      case '': return <HomePage />;
      case '#/login': return <LoginPage />;
      case '#/admin': return <AdminPage />;
      case '#/artigos': return <ArticlesPage />;
      case '#/servicos': return <ServicesPage />;
      case '#/downloads': return <DownloadsPage />;
      case '#/contato': return <ContactPage />;
      case '#/livros': return <CoursesBooksPage />;
      case '#/privacidade': return <PrivacyPage />;
      default: return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">{renderContent()}</div>
      
      <AIChat />
      <WhatsAppButton />

      <footer className="py-20 px-6 bg-[#f5f5f7] border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2">
              <h3 className="text-lg font-bold mb-4 tracking-tighter uppercase">{SITE_CONFIG.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{SITE_CONFIG.footer.description}</p>
              <div className="mt-6">
                <a href="#/admin" className="text-[10px] text-gray-300 hover:text-gray-600 uppercase tracking-widest font-bold">Acesso Administrativo</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase text-gray-400 mb-6 tracking-widest">Navegação</h4>
              <ul className="text-sm space-y-4 text-gray-600 font-medium">
                <li><a href="#/artigos" className="hover:text-blue-600 transition-colors">Biblioteca de Artigos</a></li>
                <li><a href="#/downloads" className="hover:text-blue-600 transition-colors">Central de Downloads</a></li>
                <li><a href="#/livros" className="hover:text-blue-600 transition-colors">Livros e Cursos</a></li>
                <li><a href="#/contato" className="hover:text-blue-600 transition-colors">Suporte e Vendas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase text-gray-400 mb-6 tracking-widest">Pilares</h4>
              <ul className="text-sm space-y-4 text-gray-600 font-medium">
                <li><a href="#/pilares#prof-paulo" className="hover:text-blue-600 transition-colors">Prof. Paulo</a></li>
                <li><a href="#/pilares#consultoria-imobiliaria" className="hover:text-blue-600 transition-colors">Imobiliário</a></li>
                <li><a href="#/pilares#4050oumais" className="hover:text-blue-600 transition-colors">4050oumais</a></li>
                <li><a href="#/pilares#academia-do-gas" className="hover:text-blue-600 transition-colors">Academia do Gás</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase text-gray-400 mb-6 tracking-widest">Legal</h4>
              <ul className="text-sm space-y-4 text-gray-600 font-medium">
                <li><a href="#/privacidade" className="hover:text-blue-600 transition-colors">Privacidade</a></li>
                <li><a href="#/login" className="hover:text-blue-600 transition-colors">Área do Aluno</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 text-[11px] text-gray-400 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>{SITE_CONFIG.footer.copyright}</p>
            <div className="flex items-center gap-6 font-bold uppercase tracking-widest">
              <span>Feito com Excelência</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
