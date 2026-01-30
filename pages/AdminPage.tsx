
import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { SITE_CONFIG } from '../config/site-config';
import { 
  Settings, Activity, CheckCircle, XCircle, 
  Database, ExternalLink, LogOut, Save, RefreshCw, AlertTriangle, Info, HardDrive, Trash2, Cpu, Clock, BookOpen, FileCode, MessageSquare
} from 'lucide-react';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'db_health' | 'server' | 'editor' | 'guide'>('status');
  const [isWpConnected, setIsWpConnected] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
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
      setLastError(e.message || "Erro de timeout na Hostgator");
    }
  };

  const handleForceSync = async () => {
    setSyncing(true);
    try {
      await DataService.clearCache();
      alert('Cache limpo! Os dados estão sendo sincronizados em segundo plano.');
      checkConn();
    } catch (e) {
      alert('Erro ao sincronizar.');
    } finally {
      setSyncing(false);
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
      alert('Configurações salvas no navegador!');
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
             <button onClick={handleLogout} className="p-3 bg-white border border-gray-200 text-red-500 rounded-2xl hover:bg-red-50 transition-colors shadow-sm" title="Sair">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="flex bg-gray-200/50 p-1 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto mb-8 no-scrollbar">
          <button onClick={() => setActiveTab('status')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'status' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>
            <Activity size={16} /> Status API
          </button>
          <button onClick={() => setActiveTab('guide')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'guide' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>
            <BookOpen size={16} /> Guia de Edição
          </button>
          <button onClick={() => setActiveTab('server')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'server' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>
            <Cpu size={16} /> Servidor
          </button>
          <button onClick={() => setActiveTab('editor')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'editor' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>
            <Settings size={16} /> Textos Rápidos
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
                    <CheckCircle className="text-green-500" size={28} />
                  ) : (
                    <XCircle className="text-red-500" size={28} />
                  )}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Conexão WordPress</h3>
              <p className="text-sm text-gray-500 mb-6">Conexão atual com <strong>phdonassolo.com</strong></p>
              
              <div className="flex flex-col gap-3">
                <button onClick={checkConn} className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition-all">
                  <RefreshCw size={14} /> Testar Novamente
                </button>
                <button 
                  onClick={handleForceSync} 
                  disabled={syncing}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} /> 
                  {syncing ? 'Sincronizando...' : 'Limpar Cache e Sincronizar'}
                </button>
              </div>
            </div>
            
            <div className="bg-black text-white p-8 rounded-[32px] card-shadow border border-gray-100 flex flex-col justify-between min-h-[220px]">
              <div>
                <h3 className="text-2xl font-bold mb-2">WordPress Admin</h3>
                <p className="text-gray-400 text-sm">Gerencie seus posts e vídeos diretamente no painel original.</p>
              </div>
              <a href="https://phdonassolo.com/wp-admin" target="_blank" className="bg-white text-black px-6 py-4 rounded-2xl font-bold text-sm text-center flex items-center justify-center gap-2 mt-6">
                Acessar WP Admin <ExternalLink size={18} />
              </a>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-sm animate-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-bold mb-8">Guia de Edição do App</h2>
            <p className="text-gray-500 mb-10">Este site foi construído para ser modular. Abaixo estão os arquivos que você deve editar para mudar conteúdos específicos:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl h-fit"><FileCode size={20} /></div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Textos, WhatsApp e IA</h4>
                    <p className="text-sm text-gray-500 leading-relaxed mb-3">Abra o arquivo: <code className="bg-gray-100 px-1 rounded text-blue-600">config/site-config.ts</code></p>
                    <p className="text-xs text-gray-400 italic">Mude o nome do site, número do WhatsApp e as instruções de como a Inteligência Artificial deve responder.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl h-fit"><BookOpen size={20} /></div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Livros, Cursos e Pilares</h4>
                    <p className="text-sm text-gray-500 leading-relaxed mb-3">Abra o arquivo: <code className="bg-gray-100 px-1 rounded text-purple-600">constants.tsx</code></p>
                    <p className="text-xs text-gray-400 italic">Aqui você altera as fotos e links dos seus cursos da Hotmart/Udemy, as capas dos seus livros e as descrições dos 4 Pilares.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl h-fit"><ExternalLink size={20} /></div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Artigos e Vídeos Curtos</h4>
                    <p className="text-sm text-gray-500 leading-relaxed mb-3">Gerenciado via: <strong>Painel do WordPress</strong></p>
                    <p className="text-xs text-gray-400 italic">Basta criar um Post no WP. Se o post tiver um vídeo incorporado (Youtube/Vimeo), ele aparecerá automaticamente na seção de vídeos. Se for apenas texto/imagem, aparecerá em Artigos.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 bg-green-50 text-green-600 rounded-2xl h-fit"><HardDrive size={20} /></div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Downloads (Arquivos)</h4>
                    <p className="text-sm text-gray-500 leading-relaxed mb-3">Abra o arquivo: <code className="bg-gray-100 px-1 rounded text-green-600">constants.tsx</code></p>
                    <p className="text-xs text-gray-400 italic">Procure por <code className="bg-gray-100 px-1 rounded">MOCK_RESOURCES</code> para adicionar novos PDFs ou Planilhas para seus alunos baixarem.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'server' && (
          <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl"><Cpu size={24} /></div>
              <h2 className="text-2xl font-bold">Configuração de Performance</h2>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2"><Info size={18}/> Dica para Hostgator</h4>
                <p className="text-sm text-blue-700 leading-relaxed">Se o site estiver lento, acesse o <strong>MultiPHP Manager</strong> no cPanel e certifique-se que o domínio <em>phdonassolo.com</em> está usando <strong>PHP 8.2</strong> ou superior. Versões como 7.4 são extremamente lentas para APIs modernas.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <h4 className="font-bold text-gray-800 mb-2">Cron Jobs</h4>
                <p className="text-sm text-gray-500 leading-relaxed">No WordPress Admin, instale o plugin <strong>WP Control</strong> para verificar se existem tarefas agendadas travadas que possam estar atrasando a resposta do servidor.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="bg-white rounded-[32px] p-8 md:p-10 card-shadow border border-gray-100 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold mb-8">Alteração Rápida (Sessão Atual)</h2>
            <p className="text-sm text-gray-400 mb-8 italic">* Estas alterações salvam apenas no cache do seu navegador. Para mudanças permanentes, utilize os arquivos listados no Guia de Edição.</p>
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
                 <label className="block text-xs font-bold mb-2 uppercase text-gray-400">Instruções da IA (Prompt)</label>
                 <textarea value={config.assistant.instructions} onChange={(e) => setConfig({...config, assistant: {...config.assistant, instructions: e.target.value}})} rows={5} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 resize-none text-xs leading-relaxed"></textarea>
               </div>
            </div>
            <div className="mt-10 flex justify-end">
              <button onClick={handleSave} disabled={saving} className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center gap-2">
                <Save size={20} /> {saving ? 'Salvando no Navegador...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminPage;
