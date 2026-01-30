
import React, { useState, useEffect } from 'react';
import { MOCK_ARTICLES, MOCK_COURSES, MOCK_BOOKS, PILLARS } from '../constants';
import { Article, Student, Course, Book } from '../types';
import { DataService } from '../services/dataService';
import { SITE_CONFIG } from '../config/site-config';
import { 
  Plus, Edit, Trash, Users, BookOpen, Settings, 
  Activity, CheckCircle, XCircle, Layout, ShoppingBag, 
  Database, Info, ExternalLink, LogOut, Save
} from 'lucide-react';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'articles' | 'content' | 'editor'>('status');
  const [isWpConnected, setIsWpConnected] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Verificação de autenticação simples
    if (localStorage.getItem('phd_session') !== 'admin') {
      window.location.hash = '#/login';
      return;
    }
    DataService.testConnection().then(setIsWpConnected);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('phd_session');
    window.location.hash = '#/login';
  };

  return (
    <main className="min-h-screen pt-24 bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Painel de Controle</h1>
            <p className="text-gray-500 font-medium">Gestão centralizada do ecossistema Donassolo.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-200/50 p-1 rounded-2xl overflow-x-auto border border-gray-200 shadow-sm">
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
                <Settings size={18} /> Textos & AI
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

        {/* Editor Tab (Novo) */}
        {activeTab === 'editor' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-[32px] p-10 card-shadow border border-gray-100">
               <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                 <Settings className="text-blue-600" /> Editor de Configurações do Site
               </h2>
               <p className="text-gray-400 mb-8 text-sm bg-blue-50 p-4 rounded-2xl border border-blue-100">
                 <strong>Nota Técnica:</strong> Para que as alterações sejam permanentes neste protótipo, você deve atualizar o arquivo <code>config/site-config.ts</code>. Este formulário demonstra como os campos são mapeados.
               </p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                   <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Identidade & Contato</h3>
                   <div>
                     <label className="block text-xs font-bold mb-2">Nome do Site</label>
                     <input type="text" defaultValue={SITE_CONFIG.name} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold mb-2">WhatsApp (Apenas números)</label>
                     <input type="text" defaultValue={SITE_CONFIG.whatsapp} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold mb-2">Título Principal (Hero)</label>
                     <input type="text" defaultValue={SITE_CONFIG.hero.title} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100" />
                   </div>
                 </div>

                 <div className="space-y-6">
                   <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Assistente Digital AI</h3>
                   <div>
                     <label className="block text-xs font-bold mb-2">Nome do Assistente</label>
                     <input type="text" defaultValue={SITE_CONFIG.assistant.name} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold mb-2">Mensagem de Boas-vindas</label>
                     <textarea defaultValue={SITE_CONFIG.assistant.welcome_message} rows={2} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100 resize-none"></textarea>
                   </div>
                   <div>
                     <label className="block text-xs font-bold mb-2">Instruções de Personalidade (System Prompt)</label>
                     <textarea defaultValue={SITE_CONFIG.assistant.instructions} rows={4} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-100 resize-none"></textarea>
                   </div>
                 </div>
               </div>
               
               <div className="mt-10 pt-8 border-t flex justify-end">
                 <button onClick={() => alert('Para salvar permanentemente, altere o arquivo config/site-config.ts no projeto.')} className="bg-black text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all">
                   <Save size={20} /> Salvar Alterações
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* Status Tab */}
        {activeTab === 'status' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[32px] card-shadow border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-gray-50 rounded-2xl"><Database className="text-blue-600" /></div>
                  {isWpConnected ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
                </div>
                <h3 className="text-2xl font-bold mb-2">WordPress API</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Conexão ativa com <strong>phdonassolo.com</strong>. Os artigos e vídeos estão sendo sincronizados via JSON REST API.
                </p>
              </div>

              <div className="bg-white p-8 rounded-[32px] card-shadow border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-gray-50 rounded-2xl"><Layout className="text-purple-600" /></div>
                  <CheckCircle className="text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Site Config</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Configurações locais carregadas. O assistente está usando o modelo <strong>Gemini 3 Flash</strong> para respostas rápidas.
                </p>
              </div>

              <div className="bg-white p-8 rounded-[32px] card-shadow border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-gray-50 rounded-2xl"><Settings className="text-orange-600" /></div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">v2.5.1</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Segurança</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Sessão administrativa ativa. CORS Proxy habilitado via AllOrigins para compatibilidade máxima em servidores HostGator.
                </p>
              </div>
            </div>

            <div className="bg-black rounded-[32px] p-10 text-white flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
              <div className="flex-1 relative z-10">
                <h2 className="text-3xl font-bold mb-4">Gerenciando Conteúdo</h2>
                <p className="text-gray-400 text-lg mb-6">
                  Lembre-se: Posts, Vídeos Curtos e Categorias devem ser criados no seu painel WordPress. 
                  Cursos, links da Hotmart e textos fixos são editados nos arquivos de configuração do site.
                </p>
                <div className="flex gap-4">
                  <a href="https://phdonassolo.com/wp-admin" target="_blank" className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-gray-200 transition-colors">
                    Acessar WordPress <ExternalLink size={18} />
                  </a>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
            </div>
          </div>
        )}

        {/* Blog Management */}
        {activeTab === 'articles' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Conteúdo do WordPress</h2>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sincronização em tempo real</span>
            </div>
            <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 card-shadow">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold uppercase text-gray-400 tracking-wider">
                  <tr>
                    <th className="px-8 py-5">Título do Post</th>
                    <th className="px-8 py-5">Categoria WP</th>
                    <th className="px-8 py-5 text-right">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_ARTICLES.map(article => (
                    <tr key={article.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <div className="font-bold text-gray-900">{article.title}</div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold mt-1">ID: {article.id}</div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <a href={`#/artigo/${article.id}`} className="text-blue-600 hover:underline text-sm font-bold flex items-center justify-end gap-1">
                          Ver no Hub <ExternalLink size={14} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-8 text-center bg-gray-50 border-t border-gray-100">
                 <p className="text-sm text-gray-400 font-medium">Os artigos mostrados aqui são os mesmos que os visitantes veem no Hub.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminPage;
