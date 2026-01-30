
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

const App: React.FC = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
      
      // Don't scroll to top if we're jumping to an anchor on the same page
      if (!window.location.hash.includes('#/pilares#')) {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderContent = () => {
    // Handling dynamic route for article details
    if (currentHash.startsWith('#/artigo/')) {
      const articleId = currentHash.replace('#/artigo/', '');
      return <ArticleDetailPage articleId={articleId} />;
    }

    // Handling dynamic route for course details
    if (currentHash.startsWith('#/curso/')) {
      const courseId = currentHash.replace('#/curso/', '');
      return <CourseDetailPage courseId={courseId} />;
    }

    // Handle hash sections for pillars page (e.g. #/pilares#prof-paulo)
    if (currentHash.startsWith('#/pilares')) {
      return <PillarsPage />;
    }

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
      <div className="flex-1">
        {renderContent()}
      </div>
      
      <AIChat />
      
      <footer className="py-20 px-6 bg-[#f5f5f7] border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <h3 className="text-lg font-bold mb-4 tracking-tighter uppercase">PH Donassolo</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Hub de conteúdos especializados para profissionais, investidores e curiosos que buscam excelência em seus pilares de vida e carreira.
              </p>
              <div className="mt-4">
                <a href="#/admin" className="text-[10px] text-gray-300 hover:text-gray-600 transition-colors uppercase tracking-widest font-bold">Admin Portal</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase text-gray-400 mb-4">Conteúdo</h4>
              <ul className="text-sm space-y-2 text-gray-600">
                <li><a href="#/artigos" className="hover:underline">Artigos</a></li>
                <li><a href="#/livros" className="hover:underline">Livros</a></li>
                <li><a href="#/downloads" className="hover:underline">Downloads</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase text-gray-400 mb-4">Serviços</h4>
              <ul className="text-sm space-y-2 text-gray-600">
                <li><a href="#/servicos" className="hover:underline">Consultoria</a></li>
                <li><a href="#/servicos" className="hover:underline">Mentoria</a></li>
                <li><a href="#/login" className="hover:underline">Área do Aluno</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase text-gray-400 mb-4">Pilares</h4>
              <ul className="text-sm space-y-2 text-gray-600">
                <li><a href="#/pilares#prof-paulo" className="hover:underline">Prof. Paulo</a></li>
                <li><a href="#/pilares#consultoria-imobiliaria" className="hover:underline">Imobiliário</a></li>
                <li><a href="#/pilares#4050oumais" className="hover:underline">4050oumais</a></li>
                <li><a href="#/pilares#academia-do-gas" className="hover:underline">Academia do Gás</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-300 text-xs text-gray-400">
            Copyright © 2024 PH Donassolo Digital Hub. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
