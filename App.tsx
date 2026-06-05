import React, { useState, useEffect } from 'react';
import SiteNavbar from './components/SiteNavbar';
import SiteFooter from './components/SiteFooter';
import WhatsAppFloat from './components/WhatsAppFloat';
import { SiteConfigProvider } from './contexts/SiteConfigContext';
import { DataService } from './services/dataService';
import FioCondutor from './components/ui/FioCondutor';

import HomePage from './pages/HomePage';
import ProfPauloPage from './pages/ProfPauloPage';
import ServicesPage from './pages/ServicesPage';
import MentoriaPage from './pages/MentoriaPage.tsx';
import ConsultoriaPage from './pages/ConsultoriaPage';
import CursosPage from './pages/CursosPage';
import ConteudoPage from './pages/ConteudoPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import RecursosPage from './pages/RecursosPage';
import FaleComigo from './pages/FaleComigo';
import AreaAlunoPage from './pages/AreaAlunoPage';
import EmBrevePage from './pages/EmBrevePage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';
import DynamicLPPage from './pages/DynamicLPPage';

const App: React.FC = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');

  useEffect(() => {
    DataService.getArticles(10).catch(() => {});

    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const parseHash = (hash: string) => {
    const [path, queryString] = hash.split('?');
    const params: Record<string, string> = {};
    if (queryString) {
      queryString.split('&').forEach(p => {
        const [key, value] = p.split('=');
        if (key && value) params[key] = decodeURIComponent(value);
      });
    }
    return { path, params };
  };

  const renderPage = () => {
    const { path, params } = parseHash(currentHash);

    if (path.startsWith('#/artigo/')) {
      const articleId = path.split('/artigo/')[1];
      if (articleId) return <ArticleDetailPage articleId={articleId} activePillar={params.from} />;
    }

    if (path.startsWith('#/lp/')) return <DynamicLPPage />;

    switch (path) {
      case '#/':
      case '#':
      case '': return <HomePage />;

      case '#/prof-paulo': return <ProfPauloPage />;
      case '#/servicos': return <ServicesPage />;
      case '#/mentoria': return <MentoriaPage />;
      case '#/consultoria': return <ConsultoriaPage />;
      case '#/cursos': return <CursosPage />;
      case '#/conteudo': return <ConteudoPage />;
      case '#/recursos': return <RecursosPage />;
      case '#/fale-comigo': return <FaleComigo initialMessage={params.mensagem} />;
      case '#/area-do-aluno': return <AreaAlunoPage />;
      case '#/em-breve': return <EmBrevePage />;

      case '#/login': return <LoginPage />;
      case '#/admin': return <AdminPage />;

      case '#/terms':
      case '#/termos': return <TermsPage />;
      case '#/privacy':
      case '#/privacidade': return <PrivacyPage />;

      /* Legacy redirects */
      case '#/artigos':
        window.location.replace('#/conteudo');
        return <ConteudoPage />;
      case '#/contato':
        return <FaleComigo initialMessage={params.mensagem || params.msg} />;
      case '#/ferramentas':
      case '#/livros':
        return <RecursosPage />;
      case '#/area-aluno':
        return <AreaAlunoPage />;

      default: return <NotFoundPage />;
    }
  };

  const isAdmin = currentHash.startsWith('#/admin') || currentHash.startsWith('#/login');
  const isLP = currentHash.startsWith('#/lp/');
  const hideChromeOnPages = isAdmin || isLP;

  return (
    <SiteConfigProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {!hideChromeOnPages && (
          <>
            <SiteNavbar currentRoute={currentHash} />
            <FioCondutor />
          </>
        )}

        <div style={{ flexGrow: 1, paddingTop: hideChromeOnPages ? 0 : 62 }}>
          {renderPage()}
        </div>

        {!hideChromeOnPages && (
          <>
            <SiteFooter />
            <WhatsAppFloat />
          </>
        )}
      </div>
    </SiteConfigProvider>
  );
};

export default App;
