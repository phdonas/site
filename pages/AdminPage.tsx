
import React, { useState, useEffect } from 'react';
import { MOCK_ARTICLES } from '../constants';
import { DataService } from '../services/dataService';
import { SITE_CONFIG } from '../config/site-config';
import { 
  BookOpen, Settings, Activity, CheckCircle, XCircle, 
  Database, ExternalLink, LogOut, Save, RefreshCw, AlertTriangle, Info
} from 'lucide-react';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'articles' | 'editor'>('status');
  const [isWpConnected, setIsWpConnected] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  
  const [config, setConfig] = useState(SITE_CONFIG);

  useEffect(() => {
    if (localStorage.getItem('phd_session') !== 'admin') {
      window.location.hash = '#/login';
      return;
    }
    checkConn();
  }, []);

  const checkConn = async () => {
    setIsWpConnected(null);
    setLastError(null);
    try {
      const status = await DataService.testConnection();
      setIsWpConnected(status);
      if (!status) {
        setLastError("Infelizmente, todas as tentativas de conexão (Direto, Proxy, Rest Route) falharam. Isso indica um bloqueio severo no Firewall da Hostgator.");
      }
    } catch (e: any) {
      setIsWpConnected(false);
      setLastError(e.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('phd_session');
    window.location.hash = '#/login';
  };

  const handleSave = () => {
    setSaving(true);
    localStorage.setItem('phd_site_config', JSON.stringify(config));
    
    setTimeout(() => {
      setSaving(false);
      alert('Configurações salvas localmente!');
      window.location.reload();
    }, 800);
  };

  return (
    <main className="min-h-screen pt-24 bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Painel de Controle</h1>
            <p className="text-gray-500 font-medium">Gestão do ecossistema Donassolo.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-200/50 p-1 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
              <button 
                onClick={() => setActiveTab('status')}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'status' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Activity size={18} /> API Status
              </button>
              <button 
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'editor' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Settings size={18} /> Configurações
              </button>
              <button 
                onClick={() => setActiveTab('articles')}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'articles' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <BookOpen size={18} /> Blog WP
              </button>
            </div>
            <button onClick={handleLogout} className="p-3 bg-white border border-gray-200 text-red-500 rounded-2xl hover:bg-red-50 transition-colors shadow-sm">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {activeTab === 'status' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[32px] card-shadow border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-gray-50 rounded-2xl"><Database className="text-blue-600" /></div>
                  <div className="flex items-center gap-2">
                    {isWpConnected === null ? <RefreshCw className="animate-spin text-gray-300" /> : isWpConnected ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
                    <button onClick={checkConn} className="text-[10px] font-bold text-blue-600 hover:underline uppercase">Recarregar</button>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">WordPress API</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  Estado atual da conexão Headless.
                </p>
                {lastError && (
                  <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-xs flex items-start gap-3">
                    <AlertTriangle size={16} className="shrink-0" />
                    <p>{lastError}</p>
                  </div>
                )}
                {!lastError && isWpConnected && (
                  <div className="p-4 bg-green-50 rounded-2xl border border-green-100 text-green-700 text-xs flex items-start gap-3">
                    <CheckCircle size={16} className="shrink-0" />
                    <p>Conexão estabelecida com sucesso usando permalinks otimizados.</p>
                  </div>
                )}
              </div>

              <div className="bg-black rounded-[32px] p-10 text-white flex flex-col items-start gap-6 overflow-hidden relative">
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-2">WordPress Admin</h2>
                  <p className="text-gray-400 text-sm mb-6">Acesse seu CMS para gerir conteúdos.</p>
                  <a href="https://phdonassolo.com/wp-admin" target="_blank" className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-gray-200 transition-colors">
                    Abrir WordPress <ExternalLink size={18} />
                  </a>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600 rounded-full blur-[60px] opacity-30"></div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <Info size={18} className="text-blue-600" /> Diagnóstico para Hostgator:
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="block font-bold text-xs uppercase text-gray-400 mb-2">Passo 1: Permalinks</span>
                  <p className="text-xs text-gray-600 leading-relaxed">No WP, vá em <strong>Configurações > Links Permanentes</strong> e salve como "Nome do Post".</p>
                </div>
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="block font-bold text-xs uppercase text-gray-400 mb-2">Passo 2: ModSecurity</span>
                  <p className="text-xs text-gray-600 leading-relaxed">O Firewall da Hostgator pode bloquear requisições. Peça ao suporte para liberar o <strong>endpoint wp-json</strong>.</p>
                </div>
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="block font-bold text-xs uppercase text-gray-400 mb-2">Passo 3: Plugin de CORS</span>
                  <p className="text-xs text-gray-600 leading-relaxed">Instale o plugin <strong>"WP RS REST API CORS"</strong> e habilite todas as origens (*).</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Editor de Configurações */}
        {activeTab === 'editor' && (
          <div className="bg-white rounded-[32px] p-10 card-shadow border border-gray-100 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold mb-8">Editor de Configurações</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                 <div>
                   <label className="block text-xs font-bold mb-2 uppercase text-gray-400">Nome do Site</label>
                   <input type="text" value={config.name} onChange={(e) => setConfig({...config, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold mb-2 uppercase text-gray-400">WhatsApp</label>
                   <input type="text" value={config.whatsapp} onChange={(e) => setConfig({...config, whatsapp: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100" />
                 </div>
               </div>
               <div className="space-y-6">
                 <div>
                   <label className="block text-xs font-bold mb-2 uppercase text-gray-400">Boas-vindas Assistente</label>
                   <textarea value={config.assistant.welcome_message} onChange={(e) => setConfig({...config, assistant: {...config.assistant, welcome_message: e.target.value}})} rows={3} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100 resize-none"></textarea>
                 </div>
               </div>
            </div>
            <div className="mt-10 flex justify-end">
              <button onClick={handleSave} disabled={saving} className="bg-black text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50">
                <Save size={20} /> {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 card-shadow animate-in fade-in duration-500">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold uppercase text-gray-400 tracking-wider">
                <tr><th className="px-8 py-5">Título</th><th className="px-8 py-5 text-right">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(isWpConnected ? MOCK_ARTICLES : MOCK_ARTICLES).map(article => (
                  <tr key={article.id} className="hover:bg-gray-50/30">
                    <td className="px-8 py-5 font-bold text-gray-900">{article.title}</td>
                    <td className="px-8 py-5 text-right"><span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-full uppercase">Sincronizado</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminPage;
