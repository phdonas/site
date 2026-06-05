
import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { SITE_CONFIG } from '../config/site-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import {
  Database, LogOut, RefreshCw, FolderEdit, Layout, Users, Activity,
} from 'lucide-react';
import { ContentManager } from '../components/admin/ContentManager';
import { LeadsManager } from '../components/admin/LeadsManager';
import { SiteEditor } from '../components/admin/SiteEditor';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'content' | 'leads' | 'editor' | 'guide' | 'server'>('content');
  const [isWpConnected, setIsWpConnected] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  const [config, setConfig] = useState(SITE_CONFIG);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true);
        checkConn();
      } else {
        window.location.hash = '#/login';
      }
    });
    return () => unsubscribe();
  }, []);

  const checkConn = async () => {
    setIsWpConnected(null);
    setLastError(null);
    try {
      const status = await DataService.testConnection();
      setIsWpConnected(status);
      if (!status) setLastError("Servidor Hostgator recusou a conexão direta. Tentando via túnel AllOrigins...");
    } catch (e: any) {
      setIsWpConnected(false);
      setLastError(e.message || "Erro de conexão persistente.");
    }
  };

  const handleForceSync = async () => {
    setSyncing(true);
    try {
      await DataService.clearCache();
      alert('Cache limpo e nova sincronização iniciada!');
      checkConn();
    } catch (e) {
      alert('Erro ao sincronizar.');
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.hash = '#/login';
  };

  const handleSave = () => {
    setSaving(true);
    localStorage.setItem('phd_site_config', JSON.stringify(config));
    setTimeout(() => {
      setSaving(false);
      alert('Alterações salvas no navegador!');
      window.location.reload();
    }, 800);
  };

  const tabs: { id: typeof activeTab; label: string; icon: React.ReactNode }[] = [
    { id: 'content', label: 'Conteúdo', icon: <FolderEdit size={14} /> },
    { id: 'editor', label: 'Editor CMS', icon: <Layout size={14} /> },
    { id: 'leads', label: 'Leads', icon: <Users size={14} /> },
    { id: 'status', label: 'Conexão API', icon: <Activity size={14} /> },
  ];

  return (
    <main style={{ minHeight: '100vh', paddingTop: '7rem', paddingBottom: '5rem', background: 'var(--cream-d)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 5vw' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--fm)', fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '.6rem' }}>
              Painel de Controle
            </div>
            <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em', lineHeight: 1.1 }}>
              Ecossistema PHD
            </h1>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '.5rem',
              fontFamily: 'var(--fm)', fontSize: '.55rem', letterSpacing: '.12em', textTransform: 'uppercase',
              color: 'var(--ink-3)', background: 'var(--cream)', border: '1px solid var(--rule)',
              padding: '.6rem 1rem', cursor: 'pointer', transition: 'border-color .2s, color .2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--ink)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--rule)'; (e.currentTarget as HTMLElement).style.color = 'var(--ink-3)'; }}
            title="Sair"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--rule)', marginBottom: '2.5rem', overflowX: 'auto' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '.4rem',
                fontFamily: 'var(--fm)', fontSize: '.55rem', letterSpacing: '.12em', textTransform: 'uppercase',
                padding: '.9rem 1.4rem', border: 'none', background: 'transparent', cursor: 'pointer',
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
        {activeTab === 'content' && <ContentManager />}
        {activeTab === 'editor' && <SiteEditor />}
        {activeTab === 'leads' && <LeadsManager />}

        {activeTab === 'status' && (
          <div style={{ background: 'var(--cream)', border: '1px solid var(--rule)', padding: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '1.2rem' }}>
                  <Database size={18} style={{ color: 'var(--gold)' }} />
                  <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink)' }}>
                    Base de Dados Nativa (Firebase)
                  </h3>
                </div>
                <p style={{ fontSize: '.85rem', color: 'var(--ink-3)', lineHeight: 1.7, maxWidth: 520, marginBottom: '1.5rem' }}>
                  O site foi desconectado do WordPress e agora todas as edições são locais. Para resgatar os artigos e vídeos antigos pela última vez e upar o resto do site pro banco de dados, clique em Sincronizar.
                </p>
                {lastError && (
                  <p style={{ fontFamily: 'var(--fm)', fontSize: '.55rem', letterSpacing: '.06em', color: '#c0392b', background: 'rgba(192,57,43,.06)', border: '1px solid rgba(192,57,43,.2)', padding: '.6rem .9rem', marginTop: '.5rem' }}>
                    {lastError}
                  </p>
                )}
              </div>

              <button
                onClick={async () => {
                  if (window.confirm('Tem certeza? Isso fará o download final do WP e enviará tudo para o Firebase. Essa operação não tem volta.')) {
                    setSyncing(true);
                    const success = await DataService.migrateDataToFirestore();
                    if (success) alert('Migração finalizada! Todos os seus dados agora são locais no Firebase.');
                    else alert('Erro durante a migração. Verifique os logs.');
                    setSyncing(false);
                  }
                }}
                disabled={syncing}
                style={{
                  display: 'flex', alignItems: 'center', gap: '.6rem', flexShrink: 0,
                  fontFamily: 'var(--fm)', fontSize: '.55rem', letterSpacing: '.12em', textTransform: 'uppercase',
                  background: 'var(--navy)', color: 'var(--cream)', border: 'none',
                  padding: '.9rem 2rem', cursor: syncing ? 'not-allowed' : 'pointer',
                  opacity: syncing ? .6 : 1, transition: 'opacity .2s',
                }}
              >
                {syncing
                  ? <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Processando...</>
                  : <><Database size={14} /> Sincronizar Tudo</>
                }
              </button>
            </div>

            <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--rule)', display: 'flex', alignItems: 'center', gap: '.8rem' }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: isWpConnected === null ? 'var(--gold)' : isWpConnected ? '#27ae60' : '#c0392b',
              }} />
              <span style={{ fontFamily: 'var(--fm)', fontSize: '.55rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                {isWpConnected === null ? 'Verificando conexão...' : isWpConnected ? 'Conexão ativa' : 'Sem conexão com WordPress'}
              </span>
              <button
                onClick={checkConn}
                style={{
                  marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '.4rem',
                  fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.1em', textTransform: 'uppercase',
                  background: 'transparent', border: '1px solid var(--rule)', color: 'var(--ink-3)',
                  padding: '.4rem .8rem', cursor: 'pointer',
                }}
              >
                <RefreshCw size={11} /> Testar
              </button>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div style={{ background: 'var(--cream)', border: '1px solid var(--rule)', padding: '3rem' }}>
            <div className="eyebrow" style={{ marginBottom: '1rem' }}>Referência</div>
            <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '2.5rem' }}>
              Guia de Manutenção
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              <div style={{ background: 'var(--cream-d)', border: '1px solid var(--rule)', padding: '1.8rem' }}>
                <h5 style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '.6rem' }}>
                  Cursos, Livros e Downloads
                </h5>
                <p style={{ fontSize: '.78rem', color: 'var(--ink-3)', lineHeight: 1.65, marginBottom: '1rem' }}>
                  Para adicionar novos links da Hotmart, capas de livros ou PDFs para baixar:
                </p>
                <code style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.06em', color: 'var(--gold)', background: 'var(--cream)', border: '1px solid var(--rule)', padding: '.3rem .6rem', display: 'inline-block' }}>
                  constants.tsx
                </code>
              </div>
              <div style={{ background: 'var(--cream-d)', border: '1px solid var(--rule)', padding: '1.8rem' }}>
                <h5 style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '.6rem' }}>
                  Configurações Gerais
                </h5>
                <p style={{ fontSize: '.78rem', color: 'var(--ink-3)', lineHeight: 1.65, marginBottom: '1rem' }}>
                  Para mudar o número do WhatsApp, e-mail de contato ou nome do site:
                </p>
                <code style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.06em', color: 'var(--gold)', background: 'var(--cream)', border: '1px solid var(--rule)', padding: '.3rem .6rem', display: 'inline-block' }}>
                  config/site-config.ts
                </code>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'server' && (
          <div style={{ background: 'var(--cream)', border: '1px solid var(--rule)', padding: '3rem' }}>
            <div className="eyebrow" style={{ marginBottom: '1rem' }}>Hostgator</div>
            <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1rem' }}>
              Ajuste no Servidor
            </h2>
            <p style={{ fontSize: '.85rem', color: 'var(--ink-3)', lineHeight: 1.7, marginBottom: '2rem' }}>
              Para evitar bloqueios de segurança (CORS), adicione ao <code style={{ fontFamily: 'var(--fm)', fontSize: '.7em', color: 'var(--gold)' }}>.htaccess</code>:
            </p>
            <div style={{ background: 'var(--navy)', padding: '2rem', overflow: 'auto' }}>
              <pre style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'rgba(243,239,230,.7)', lineHeight: 1.7, margin: 0 }}>
{`<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Origin, Content-Type, Accept"
</IfModule>`}
              </pre>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
};

export default AdminPage;
