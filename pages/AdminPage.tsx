
import React, { useState, useEffect } from 'react';
import { MOCK_ARTICLES } from '../constants';
import { DataService } from '../services/dataService';
import { SITE_CONFIG } from '../config/site-config';
import { 
  BookOpen, Settings, Activity, CheckCircle, XCircle, 
  Database, ExternalLink, LogOut, Save, RefreshCw
} from 'lucide-react';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'articles' | 'editor'>('status');
  const [isWpConnected, setIsWpConnected] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Estados para edição
  const [config, setConfig] = useState(SITE_CONFIG);

  useEffect(() => {
    if (localStorage.getItem('phd_session') !== 'admin') {
      window.location.hash = '#/login';
      return;
    }
    checkConn();
  }, []);

  const checkConn = async () => {
    const status = await DataService.testConnection();
    setIsWpConnected(status);
  };

  const handleLogout = () => {
    localStorage.removeItem('phd_session');
    window.location.hash = '#/login';
  };

  const handleSave = () => {
    setSaving(true);
    // Simula o salvamento e persiste no LocalStorage para que o resto do app veja
    localStorage.setItem('phd_site_config', JSON.stringify(config));
    
    setTimeout(() => {
      setSaving(false);
      alert('Configurações salvas com sucesso no navegador! Para mudanças permanentes no servidor, atualize o arquivo config/site-config.ts.');
      window.location.reload(); // Recarrega para aplicar as mudanças em todo o app
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

        {activeTab === 'editor' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-[32px] p-10 card-shadow border border-gray-100">
               <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                 <Settings className="text-blue-600" /> Editor de Configurações
               </h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                   <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Identidade & WhatsApp</h3>
                   <div>
                     <label className="block text-xs font-bold mb-2">Nome do Site</label>
                     <input 
                       type="text" 
                       value={config.name} 
                       onChange={(e) => setConfig({...config, name: e.target.value})}
                       className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100" 
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-bold mb-2">WhatsApp Link (Apenas números, com código do país: 351... ou 55...)</label>
                     <input 
                       type="text" 
                       value={config.whatsapp} 
                       onChange={(e) => setConfig({...config, whatsapp: e.target.value.replace(/\D/g, '')})}
                       className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100" 
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-bold mb-2">WhatsApp Display (Visual)</label>
                     <input 
                       type="text" 
                       value={config.whatsapp_display} 
                       onChange={(e) => setConfig({...config, whatsapp_display: e.target.value})}
                       className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100" 
                     />
                   </div>
                 </div>

                 <div className="space-y-6">
                   <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Assistente Digital AI</h3>
                   <div>
                     <label className="block text-xs font-bold mb-2">Nome do Assistente</label>
                     <input 
                       type="text" 
                       value={config.assistant.name} 
                       onChange={(e) => setConfig({...config, assistant: {...config.assistant, name: e.target.value}})}
                       className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100" 
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-bold mb-2">Boas-vindas</label>
                     <textarea 
                        value={config.assistant.welcome_message} 
                        onChange={(e) => setConfig({...config, assistant: {...config.assistant, welcome_message: e.target.value}})}
                        rows={2} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100 resize-none"
                     ></textarea>
                   </div>
                   <div>
                     <label className="block text-xs font-bold mb-2">Instruções (System Prompt)</label>
                     <textarea 
                        value={config.assistant.instructions} 
                        onChange={(e) => setConfig({...config, assistant: {...config.assistant, instructions: e.target.value}})}
                        rows={4} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100 resize-none"
                     ></textarea>
                   </div>
                 </div>
               </div>
               
               <div className="mt-10 pt-8 border-t flex justify-end">
                 <button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="bg-black text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50"
                 >
                   <Save size={20} /> {saving ? 'Salvando...' : 'Salvar Alterações'}
                 </button>
               </div>
            </div>
          </div>
        )}

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
                <p className="text-sm text-gray-500 leading-relaxed">
                  Status da conexão com <strong>phdonassolo.com</strong>. {isWpConnected ? 'Conexão estável e rápida.' : 'Tentando reconectar via Proxy AllOrigins...'}
                </p>
              </div>

              <div className="bg-black rounded-[32px] p-10 text-white flex flex-col items-start gap-6 overflow-hidden relative">
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-2">WordPress Admin</h2>
                  <p className="text-gray-400 text-sm mb-6">Crie novos artigos e vídeos diretamente no seu CMS.</p>
                  <a href="https://phdonassolo.com/wp-admin" target="_blank" className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-gray-200 transition-colors">
                    Abrir WordPress <ExternalLink size={18} />
                  </a>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600 rounded-full blur-[60px] opacity-30"></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 card-shadow">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold uppercase text-gray-400 tracking-wider">
                  <tr>
                    <th className="px-8 py-5">Título</th>
                    <th className="px-8 py-5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_ARTICLES.map(article => (
                    <tr key={article.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-5 font-bold text-gray-900">{article.title}</td>
                      <td className="px-8 py-5 text-right">
                        <a href={`#/artigo/${article.id}`} className="text-blue-600 font-bold text-sm flex items-center justify-end gap-1">
                          Ver <ExternalLink size={14} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminPage;
