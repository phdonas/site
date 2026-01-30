
import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { SITE_CONFIG } from '../config/site-config';
// Fix: Corrected 'clock' to 'Clock' as it is the proper exported member from lucide-react
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
      alert('Configurações salvas!');
      window.location.reload();
    }, 800);
  };

  return (
    <main className="min-h-screen pt-24 bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Painel de Controle</h1>
            <p className="text-gray-500 font-medium">Gestão técnica do ecossistema PH Donassolo.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-200/50 p-1 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
              <button onClick={() => setActiveTab('status')} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'status' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}>
                <Activity size={18} /> API Status
              </button>
              <button onClick={() => setActiveTab('db_health')} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'db_health' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}>
                <HardDrive size={18} /> Banco
              </button>
              <button onClick={() => setActiveTab('server')} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'server' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}>
                <Cpu size={18} /> Servidor
              </button>
              <button onClick={() => setActiveTab('editor')} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'editor' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}>
                <Settings size={18} /> Textos
              </button>
            </div>
            <button onClick={handleLogout} className="p-3 bg-white border border-gray-200 text-red-500 rounded-2xl hover:bg-red-50 transition-colors shadow-sm">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {activeTab === 'status' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-[32px] card-shadow border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-gray-50 rounded-2xl"><Database className="text-blue-600" /></div>
                <div>{isWpConnected === null ? <RefreshCw className="animate-spin text-gray-300" /> : isWpConnected ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}</div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Status da API</h3>
              <p className="text-sm text-gray-500">Conexão atual com phdonassolo.com</p>
            </div>
            <div className="bg-black text-white p-8 rounded-[32px] card-shadow border border-gray-100 flex flex-col justify-between">
              <h3 className="text-2xl font-bold mb-4">WordPress Admin</h3>
              <a href="https://phdonassolo.com/wp-admin" target="_blank" className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm text-center flex items-center justify-center gap-2">Acessar WP <ExternalLink size={18} /></a>
            </div>
          </div>
        )}

        {activeTab === 'db_health' && (
          <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-red-50 text-red-500 rounded-2xl"><Trash2 size={24} /></div>
              <h2 className="text-2xl font-bold">Limpeza de Tabelas</h2>
            </div>
            <div className="space-y-6 max-w-2xl">
              <p className="text-gray-600">Seu banco de dados tem 8.2MB em 561 linhas. Rode estes comandos no <strong>phpMyAdmin</strong>:</p>
              <div className="p-4 bg-gray-900 rounded-xl">
                <code className="text-green-400 text-xs block mb-2">-- Remover lixo de transientes</code>
                <code className="text-white text-xs block">DELETE FROM wp_options WHERE option_name LIKE ('%\_transient\_%');</code>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'server' && (
          <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl"><Cpu size={24} /></div>
              <div>
                <h2 className="text-2xl font-bold">Otimização de Performance (Hostgator)</h2>
                <p className="text-gray-500 text-sm">Ajustes para acelerar a API em até 3x.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <h3 className="font-bold flex items-center gap-2 mb-4"><AlertTriangle size={18} className="text-orange-500" /> 1. Desative o Cron Interno</h3>
                  <p className="text-sm text-gray-600 mb-4">Na imagem que você enviou da Hostgator, o "Cron do WordPress" está como <strong>Habilitado</strong>. Mude para <strong>Desativado</strong>.</p>
                  <p className="text-xs text-gray-400">Por que? Isso evita que o WP tente processar tarefas lentas durante cada acesso à API do nosso app.</p>
                </div>
                <div>
                  <h3 className="font-bold flex items-center gap-2 mb-4"><CheckCircle size={18} className="text-green-500" /> 2. Crie um "Cron Real" no cPanel</h3>
                  <p className="text-sm text-gray-600 mb-4">No painel principal da Hostgator (cPanel), procure por <strong>"Tarefas Cron"</strong> e adicione uma tarefa para rodar a cada 30 minutos:</p>
                  <code className="block bg-gray-100 p-4 rounded-xl text-[10px] text-blue-700 overflow-x-auto">
                    wget -q -O - https://phdonassolo.com/wp-cron.php?doing_wp_cron >/dev/null 2>&1
                  </code>
                </div>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100">
                <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-gray-400">Próximos Passos</h4>
                <ul className="space-y-4 text-sm text-gray-600">
                  <li className="flex gap-3"><span className="font-bold text-blue-600">1.</span> Atualize o WP para a versão 6.7+ via Softaculous.</li>
                  <li className="flex gap-3"><span className="font-bold text-blue-600">2.</span> No cPanel, mude a versão do PHP para 8.2.</li>
                  <li className="flex gap-3"><span className="font-bold text-blue-600">3.</span> Instale o plugin "Perfmatters" ou "Autoptimize" para remover scripts desnecessários.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="bg-white rounded-[32px] p-10 card-shadow border border-gray-100 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold mb-8">Configurações do Site</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                 <div>
                   <label className="block text-xs font-bold mb-2 uppercase text-gray-400">Nome do Site</label>
                   <input type="text" value={config.name} onChange={(e) => setConfig({...config, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold mb-2 uppercase text-gray-400">WhatsApp</label>
                   <input type="text" value={config.whatsapp} onChange={(e) => setConfig({...config, whatsapp: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100" />
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-bold mb-2 uppercase text-gray-400">Instruções da IA</label>
                 <textarea value={config.assistant.instructions} onChange={(e) => setConfig({...config, assistant: {...config.assistant, instructions: e.target.value}})} rows={5} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 resize-none text-xs"></textarea>
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
