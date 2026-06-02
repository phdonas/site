
import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { SITE_CONFIG } from '../config/site-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { 
  Settings, Activity, CheckCircle, XCircle, 
  Database, ExternalLink, LogOut, Save, RefreshCw, AlertTriangle, Info, HardDrive, Trash2, Cpu, Clock, BookOpen, FileCode, MessageSquare, ShieldCheck, FolderEdit, Users, Layout
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

  return (
    <main className="min-h-screen pt-24 bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Painel de Controle</h1>
            <p className="text-gray-500 font-medium text-sm">Monitoramento do Ecossistema PH Donassolo.</p>
          </div>
          <button onClick={handleLogout} className="p-3 bg-white border border-gray-200 text-red-500 rounded-2xl hover:bg-red-50 transition-colors shadow-sm" title="Sair">
            <LogOut size={20} />
          </button>
        </div>

        <div className="flex bg-gray-200/50 p-1 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto mb-8 no-scrollbar">
          <button onClick={() => setActiveTab('content')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'content' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>
            <FolderEdit size={16} /> Gestão de Conteúdo
          </button>
          <button onClick={() => setActiveTab('editor')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'editor' ? 'bg-white shadow-sm text-black text-blue-600' : 'text-gray-500'}`}>
            <Layout size={16} /> Editor Visual (CMS)
          </button>
          <button onClick={() => setActiveTab('leads')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'leads' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>
            <Users size={16} /> Meus Leads
          </button>
          <button onClick={() => setActiveTab('status')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'status' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>
            <Activity size={16} /> Conexão API
          </button>
        </div>

        {activeTab === 'content' && <ContentManager />}
        {activeTab === 'editor' && <SiteEditor />}
        {activeTab === 'leads' && <LeadsManager />}

        {activeTab === 'status' && (
          <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-[32px] card-shadow border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-50 rounded-2xl"><Database className="text-blue-600" /></div>
                  <h3 className="text-2xl font-bold">Base de Dados Nativa (Firebase)</h3>
                </div>
                <p className="text-sm text-gray-500 max-w-xl leading-relaxed">
                  O site foi desconectado do WordPress e agora todas as edições são locais. Para resgatar os artigos e vídeos antigos pela última vez e upar o resto do site pro banco de dados, clique em Sincronizar.
                </p>
              </div>
              <button 
                onClick={async () => {
                  if(window.confirm('Tem certeza? Isso fará o download final do WP e enviará tudo para o Firebase. Essa operação não tem volta.')) {
                    setSyncing(true);
                    const success = await DataService.migrateDataToFirestore();
                    if(success) alert('Migração finalizada! Todos os seus dados agora são locais no Firebase.');
                    else alert('Erro durante a migração. Verifique os logs.');
                    setSyncing(false);
                  }
                }}
                disabled={syncing}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-3 w-full md:w-auto shadow-lg shadow-blue-500/20"
              >
                {syncing ? <><RefreshCw size={20} className="animate-spin" /> Processando...</> : <><Database size={20} /> Sincronizar Tudo</>}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-sm animate-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-bold mb-8">Guia de Manutenção</h2>
            <div className="space-y-12">
              <section>
                <h4 className="font-bold text-blue-600 uppercase tracking-widest text-xs mb-6">Arquivos do Projeto</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <h5 className="font-bold mb-2">Cursos, Livros e Downloads</h5>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">Para adicionar novos links da Hotmart, capas de livros ou PDFs para baixar:</p>
                    <code className="text-[10px] bg-white px-2 py-1 rounded border text-blue-600 block">constants.tsx</code>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <h5 className="font-bold mb-2">Configurações Gerais</h5>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">Para mudar o número do WhatsApp, e-mail de contato ou nome do site:</p>
                    <code className="text-[10px] bg-white px-2 py-1 rounded border text-blue-600 block">config/site-config.ts</code>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'server' && (
          <div className="bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-sm animate-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-bold mb-6">Ajuste na Hostgator</h2>
            <p className="text-gray-500 mb-10 leading-relaxed">Para evitar bloqueios de segurança (CORS):</p>
            <div className="bg-gray-900 rounded-3xl p-8 overflow-hidden relative group">
              <pre className="text-blue-400 text-xs font-mono overflow-x-auto leading-relaxed">
{`<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Origin, Content-Type, Accept"
</IfModule>`}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="bg-white rounded-[32px] p-8 md:p-10 card-shadow border border-gray-100 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold mb-8">Configurações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                 <div>
                   <label className="block text-xs font-bold mb-2 uppercase text-gray-400">Nome do Site</label>
                   <input type="text" value={config.name} onChange={(e) => setConfig({...config, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 font-medium" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold mb-2 uppercase text-gray-400">WhatsApp Oficial</label>
                   <input type="text" value={config.whatsapp} onChange={(e) => setConfig({...config, whatsapp: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 font-medium" />
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-bold mb-2 uppercase text-gray-400">Personalidade da IA (Prompt)</label>
                 <textarea value={config.assistant.instructions} onChange={(e) => setConfig({...config, assistant: {...config.assistant, instructions: e.target.value}})} rows={5} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 resize-none text-xs leading-relaxed font-medium"></textarea>
               </div>
            </div>
            <div className="mt-10 flex justify-end">
              <button onClick={handleSave} disabled={saving} className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center gap-2">
                <Save size={20} /> {saving ? 'Gravando...' : 'Salvar no Navegador'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminPage;
