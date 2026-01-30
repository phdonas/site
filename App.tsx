
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
import AIChat from './components/AIChat';
import WhatsAppButton from './components/WhatsAppButton';
import { SITE_CONFIG } from './config/site-config';

const App: React.FC = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
      if (!window.location.hash.includes('#/pilares#')) {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderContent = () => {
    if (currentHash.startsWith('#/artigo/')) {
      const articleId = currentHash.replace('#/artigo/', '');
      return <ArticleDetailPage articleId={articleId} />;
    }
    if (currentHash.startsWith('#/curso/')) {
      const courseId = currentHash.replace('#/curso/', '');
      return <CourseDetailPage courseId={courseId} />;
    }
    if (currentHash.startsWith('#/pilares')) return <PillarsPage />;

    switch (currentHash) {
      case '#/login': return <LoginPage />;
      case '#/admin': return <AdminPage />;
      case '#/artigos': return <ArticlesPage />;
      case '#/servicos': return <ServicesPage />;
      case '#/downloads': return <DownloadsPage />;
      case '#/contato': return <ContactPage />;
      case '#/livros': return <CoursesBooksPage />;
      default: return <HomePage />;
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <h3 className="text-lg font-bold mb-4 tracking-tighter uppercase">{SITE_CONFIG.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{SITE_CONFIG.footer.description}</p>
              <div className="mt-4"><a href="#/admin" className="text-[10px] text-gray-300 hover:text-gray-600 uppercase tracking-widest font-bold">Admin Portal</a></div>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase text-gray-400 mb-4">Conteúdo</h4>
              <ul className="text-sm space-y-2 text-gray-600">
                <li><a href="#/artigos" className="hover:underline">Artigos</a></li>
                <li><a href="#/downloads" className="hover:underline">Downloads</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase text-gray-400 mb-4">Pilares</h4>
              <ul className="text-sm space-y-2 text-gray-600">
                <li><a href="#/pilares#prof-paulo" className="hover:underline">Prof. Paulo</a></li>
                <li><a href="#/pilares#consultoria-imobiliaria" className="hover:underline">Imobiliário</a></li>
                <li><a href="#/pilares#4050oumais" className="hover:underline">4050oumais</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-300 text-xs text-gray-400">{SITE_CONFIG.footer.copyright}</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
