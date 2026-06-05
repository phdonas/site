import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { LogOut, Layout, FileText, Users, Globe, Settings } from 'lucide-react';
import { SiteContentEditor } from '../components/admin/SiteContentEditor';
import { MediaManager } from '../components/admin/MediaManager';
import { LeadsManagerV2 } from '../components/admin/LeadsManagerV2';
import { LandingPagesManager } from '../components/admin/LandingPagesManager';
import { SettingsManager } from '../components/admin/SettingsManager';

type AdminTab = 'site' | 'media' | 'leads' | 'lps' | 'settings';

const TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: 'site', label: 'Conteúdo do Site', icon: <Layout size={13} /> },
  { id: 'media', label: 'Artigos e Mídia', icon: <FileText size={13} /> },
  { id: 'leads', label: 'Leads', icon: <Users size={13} /> },
  { id: 'lps', label: 'Landing Pages', icon: <Globe size={13} /> },
  { id: 'settings', label: 'Configurações', icon: <Settings size={13} /> },
];

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('site');
  const [isAuth, setIsAuth] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true);
      } else {
        window.location.hash = '#/login';
      }
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.hash = '#/login';
  };

  if (checking) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream-d)' }}>
        <span style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
          Verificando autenticação...
        </span>
      </main>
    );
  }

  if (!isAuth) return null;

  return (
    <main style={{ minHeight: '100vh', paddingTop: '7rem', paddingBottom: '5rem', background: 'var(--cream-d)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 5vw' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div>
            <div style={{
              fontFamily: 'var(--fm)', fontSize: '.52rem', letterSpacing: '.2em',
              textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '.5rem',
            }}>
              Painel de Controle
            </div>
            <h1 style={{
              fontFamily: 'var(--fd)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em', lineHeight: 1.1,
            }}>
              Administração do Site
            </h1>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '.5rem',
              fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.12em', textTransform: 'uppercase',
              color: 'var(--ink-3)', background: 'var(--cream)', border: '1px solid var(--rule)',
              padding: '.6rem 1rem', cursor: 'pointer', transition: 'border-color .2s, color .2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)';
              (e.currentTarget as HTMLElement).style.color = 'var(--ink)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--rule)';
              (e.currentTarget as HTMLElement).style.color = 'var(--ink-3)';
            }}
          >
            <LogOut size={13} /> Sair
          </button>
        </div>

        {/* Tab bar */}
        <div style={{
          display: 'flex', gap: 0,
          borderBottom: '1px solid var(--rule)',
          marginBottom: '2rem',
          overflowX: 'auto',
        }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '.4rem',
                fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.12em', textTransform: 'uppercase',
                padding: '.85rem 1.3rem', border: 'none', background: 'transparent', cursor: 'pointer',
                color: activeTab === t.id ? 'var(--ink)' : 'var(--ink-3)',
                borderBottom: activeTab === t.id ? '2px solid var(--gold)' : '2px solid transparent',
                marginBottom: -1,
                transition: 'color .2s',
                whiteSpace: 'nowrap',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === 'site' && <SiteContentEditor />}
          {activeTab === 'media' && <MediaManager />}
          {activeTab === 'leads' && <LeadsManagerV2 />}
          {activeTab === 'lps' && <LandingPagesManager />}
          {activeTab === 'settings' && <SettingsManager />}
        </div>

      </div>
    </main>
  );
};

export default AdminPage;
