
import React, { useState, useEffect } from 'react';
import { MOCK_ARTICLES } from '../constants';
import { DataService } from '../services/dataService';
import { SITE_CONFIG } from '../config/site-config';
import { 
  BookOpen, Settings, Activity, CheckCircle, XCircle, 
  Database, ExternalLink, LogOut, Save, RefreshCw, AlertTriangle, Info, HardDrive, Trash2
} from 'lucide-react';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'db_health' | 'editor'>('status');
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
        setLastError("Conexão instável. O banco de dados parece estar demorando muito para responder (Latência alta).");
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
              <button 
                onClick={() => setActiveTab('status')}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'status' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Activity size={18} /> API Status
              </button>
              <button 
                onClick={() => setActiveTab('db_health')}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'db_health' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <HardDrive size={18} /> Saúde do Banco
              </button>
              <button 
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'editor' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Settings size={18} /> Textos
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
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">Conexão WordPress</h3>
                <p className="text-sm text-gray-500 mb-6">Sincronização com phdonassolo.com</p>
                {lastError && (
                  <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 text-orange-700 text-xs flex items-start gap-3">
                    <AlertTriangle size={16} className="shrink-0" />
                    <p><strong>Aviso:</strong> O banco de dados está respondendo lentamente. Veja a aba "Saúde do Banco".</p>
                  </div>
                )}
              </div>

              <div className="bg-black rounded-[32px] p-10 text-white flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">WordPress Admin</h2>
                  <p className="text-gray-400 text-sm mb-8">Gerencie posts e mídias.</p>
                </div>
                <a href="https://phdonassolo.com/wp-admin" target="_blank" className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm text-center flex items-center justify-center gap-2">
                  Acessar Painel <ExternalLink size={18} />
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'db_health' && (
          <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-red-50 text-red-500 rounded-2xl"><Trash2 size={24} /></div>
              <div>
                <h2 className="text-2xl font-bold">Otimização de Banco de Dados</h2>
                <p className="text-gray-500">Sua tabela <code>wp_options</code> está com 8.2MB, o que é excessivo para 561 linhas.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <h4 className="font-bold text-sm mb-4 uppercase tracking-widest text-gray-400">Ação Recomendada 1</h4>
                  <p className="text-sm text-gray-600 mb-4">Execute este comando na aba <strong>SQL</strong> do seu phpMyAdmin para remover lixo de transientes:</p>
                  <code className="block bg-black text-green-400 p-4 rounded-xl text-xs overflow-x-auto">
                    DELETE FROM wp_options WHERE option_name LIKE ('%\_transient\_%');
                  </code>
                </div>
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <h4 className="font-bold text-sm mb-4 uppercase tracking-widest text-gray-400">Ação Recomendada 2</h4>
                  <p className="text-sm text-gray-600 mb-4">Identifique a linha exata que está "pesada" (provavelmente um log de erro ou cache de tema):</p>
                  <code className="block bg-black text-green-400 p-4 rounded-xl text-xs overflow-x-auto">
                    SELECT option_name, length(option_value) AS size FROM wp_options ORDER BY size DESC LIMIT 10;
                  </code>
                </div>
              </div>

              <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
                <h4 className="font-bold text-blue-700 mb-4 flex items-center gap-2"><Info size={18} /> Por que isso importa?</h4>
                <p className="text-sm text-blue-900 leading-relaxed space-y-4">
                  <span>Sempre que o WordPress é acessado, ele carrega o <strong>Autoload</strong> da tabela <code>wp_options</code>.</span>
                  <br /><br />
                  <span>Se essa carga for de 8MB, cada clique no site força o servidor da Hostgator a ler 8MB de dados inúteis antes de mostrar qualquer coisa. Isso causa o atraso na "Área do Aluno" e no carregamento das imagens.</span>
                  <br /><br />
                  <strong>Dica:</strong> Após limpar, instale o plugin <em>WP-Optimize</em> e marque "Otimizar tabelas do banco de dados".
                </p>
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
                   <input type="text" value={config.name} onChange={(e) => setConfig({...config, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold mb-2 uppercase text-gray-400">WhatsApp</label>
                   <input type="text" value={config.whatsapp} onChange={(e) => setConfig({...config, whatsapp: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100" />
                 </div>
               </div>
               <div className="space-y-6">
                 <div>
                   <label className="block text-xs font-bold mb-2 uppercase text-gray-400">Instruções da IA (Gemini)</label>
                   <textarea value={config.assistant.instructions} onChange={(e) => setConfig({...config, assistant: {...config.assistant, instructions: e.target.value}})} rows={5} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100 resize-none text-xs leading-relaxed"></textarea>
                 </div>
               </div>
            </div>
            <div className="mt-10 flex justify-end">
              <button onClick={handleSave} disabled={saving} className="bg-black text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50">
                <Save size={20} /> {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminPage;
