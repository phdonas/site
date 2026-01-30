
import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { SITE_CONFIG } from '../config/site-config';
import { 
  Settings, Activity, CheckCircle, XCircle, 
  Database, ExternalLink, LogOut, Save, RefreshCw, AlertTriangle, Info, HardDrive, Trash2, Cpu, Clock
} from 'lucide-react';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'db_health' | 'server' | 'editor'>('status');
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
      if (!status) setLastError("Servidor não respondeu. Tentando via túnel...");
    } catch (e: any) {
      setIsWpConnected(false);
      setLastError(e.message || "Erro desconhecido na API");
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
      alert('Configurações salvas!');
      window.location.reload();
    }, 800);
  };

  return (
    <main className="min-h-screen pt-24 bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Painel de Controle</h1>
            <p className="text-gray-500 font-medium text-sm">Gestão técnica do ecossistema PH Donassolo.</p>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={handleLogout} className="p-3 bg-white border border-gray-200 text-red-500 rounded-2xl hover:bg-red-50 transition-colors shadow-sm">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="flex bg-gray-200/50 p-1 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto mb-8 no-scrollbar">
          <button onClick={() => setActiveTab('status')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'status' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>
            <Activity size={16} /> Status API
          </button>
          <button onClick={() => setActiveTab('db_health')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'db_health' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>
            <HardDrive size={16} /> Banco
          </button>
          <button onClick={() => setActiveTab('server')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'server' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>
            <Cpu size={16} /> Servidor
          </button>
          <button onClick={() => setActiveTab('editor')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'editor' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>
            <Settings size={16} /> Textos
          </button>
        </div>

        {activeTab === 'status' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-[32px] card-shadow border border-gray-100 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-gray-50 rounded-2xl"><Database className="text-blue-600" /></div>
                <div>
                  {isWpConnected === null ? (
                    <RefreshCw className="animate-spin text-gray-300" />
                  ) : isWpConnected ? (
                    <CheckCircle className="text-green-500" />
                  ) : (
                    <div className="flex items-center gap-2 text-red-500 font-bold text-xs">
                      <XCircle /> Falha
                    </div>
                  )}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Conexão WordPress</h3>
              <p className="text-sm text-gray-500 mb-6">Testando comunicação com phdonassolo.com</p>
              
              {lastError && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-xs font-medium mb-4">
                  <strong>Erro:</strong> {lastError}
                </div>
              )}
              
              <button onClick={checkConn} className="text-blue-600 font-bold text-xs flex items-center gap-1 hover:underline">
                <RefreshCw size={14} /> Tentar Reconectar
              </button>
            </div>
            
            <div className="bg-black text-white p-8 rounded-[32px] card-shadow border border-gray-100 flex flex-col justify-between min-h-[220px]">
              <div>
                <h3 className="text-2xl font-bold mb-2">WordPress Admin</h3>
                <p className="text-gray-400 text-sm">Gerencie seus posts e vídeos diretamente.</p>
              </div>
              <a href="https://phdonassolo.com/wp-admin" target="_blank" className="bg-white text-black px-6 py-4 rounded-2xl font-bold text-sm text-center flex items-center justify-center gap-2 mt-6">
                Acessar Painel WP <ExternalLink size={18} />
              </a>
            </div>
          </div>
        )}

        {activeTab === 'db_health' && (
          <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-sm animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-red-50 text-red-500 rounded-2xl"><Trash2 size={24} /></div>
              <h2 className="text-2xl font-bold">Limpeza de Tabelas</h2>
            </div>
            <div className="space-y-6">
              <p className="text-gray-600 text-sm">Seu banco de dados tem acúmulo de dados temporários. No <strong>phpMyAdmin</strong> da Hostgator, rode:</p>
              <div className="p-4 bg-gray-900 rounded-xl overflow-x-auto">
                <code className="text-white text-xs whitespace-nowrap">DELETE FROM wp_options WHERE option_name LIKE ('%\_transient\_%');</code>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'server' && (
          <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-sm animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl"><Cpu size={24} /></div>
              <div>
                <h2 className="text-2xl font-bold">Configuração de Performance</h2>
                <p className="text-gray-500 text-sm">Otimize a velocidade de resposta da Hostgator.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <h3 className="font-bold flex items-center gap-2 mb-3 text-sm uppercase tracking-wider text-gray-400">1. Cron do WordPress</h3>
                  <p className="text-sm text-gray-600">Desative o cron interno no Softaculous para que ele não "trave" a API durante cada carregamento.</p>
                </div>
                <div>
                  <h3 className="font-bold flex items-center gap-2 mb-3 text-sm uppercase tracking-wider text-gray-400">2. Versão do PHP</h3>
                  <p className="text-sm text-gray-600">No MultiPHP Manager do cPanel, mude para <strong>PHP 8.2</strong>. Versões antigas são 50% mais lentas.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="bg-white rounded-[32px] p-8 md:p-10 card-shadow border border-gray-100 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold mb-8">Textos do Site</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                 <div>
                   <label className="block text-xs font-bold mb-2 uppercase text-gray-400">Nome Público</label>
                   <input type="text" value={config.name} onChange={(e) => setConfig({...config, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold mb-2 uppercase text-gray-400">WhatsApp Oficial</label>
                   <input type="text" value={config.whatsapp} onChange={(e) => setConfig({...config, whatsapp: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100" />
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-bold mb-2 uppercase text-gray-400">Instruções da IA</label>
                 <textarea value={config.assistant.instructions} onChange={(e) => setConfig({...config, assistant: {...config.assistant, instructions: e.target.value}})} rows={5} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 resize-none text-xs leading-relaxed"></textarea>
               </div>
            </div>
            <div className="mt-10 flex justify-end">
              <button onClick={handleSave} disabled={saving} className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center gap-2">
                <Save size={20} /> {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminPage;
