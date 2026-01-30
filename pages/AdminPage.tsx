
import React, { useState, useEffect } from 'react';
import { MOCK_ARTICLES, MOCK_COURSES, MOCK_BOOKS, PILLARS } from '../constants';
import { Article, Student, Course, Book } from '../types';
import { DataService } from '../services/dataService';
import { SITE_CONFIG } from '../config/site-config';
import { 
  Plus, Edit, Trash, Users, BookOpen, Settings, 
  Activity, CheckCircle, XCircle, Layout, ShoppingBag, 
  Database, Info, ExternalLink 
} from 'lucide-react';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'articles' | 'content' | 'students'>('status');
  const [isWpConnected, setIsWpConnected] = useState<boolean | null>(null);
  
  useEffect(() => {
    DataService.testConnection().then(setIsWpConnected);
  }, []);

  return (
    <main className="min-h-screen pt-24 bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Painel de Controle</h1>
            <p className="text-gray-500 font-medium">Gerencie seu ecossistema digital.</p>
          </div>
          <div className="flex bg-gray-200/50 p-1 rounded-2xl overflow-x-auto border border-gray-200">
            <button 
              onClick={() => setActiveTab('status')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'status' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Activity size={18} /> API Status
            </button>
            <button 
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'content' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <ShoppingBag size={18} /> Cursos & Livros
            </button>
            <button 
              onClick={() => setActiveTab('articles')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'articles' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <BookOpen size={18} /> Artigos WP
            </button>
            <button 
              onClick={() => setActiveTab('students')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'students' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Users size={18} /> Alunos
            </button>
          </div>
        </div>

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
                  Conexão ativa com <strong>phdonassolo.com</strong>. Os artigos e vídeos estão sendo sincronizados.
                </p>
              </div>

              <div className="bg-white p-8 rounded-[32px] card-shadow border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-gray-50 rounded-2xl"><Layout className="text-purple-600" /></div>
                  <CheckCircle className="text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Configurações</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Arquivo <strong>site-config.ts</strong> carregado. E-mail de contato: {SITE_CONFIG.email_contato}
                </p>
              </div>

              <div className="bg-white p-8 rounded-[32px] card-shadow border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-gray-50 rounded-2xl"><Plus className="text-orange-600" /></div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">v2.1.0</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Novas Funções</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Cache persistente ativado. Otimização de imagens do WP Gutenberg em vigor.
                </p>
              </div>
            </div>

            <div className="bg-blue-600 rounded-[32px] p-10 text-white flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">Como atualizar o site?</h2>
                <p className="text-blue-100 text-lg mb-6">Para mudanças permanentes nos textos e links de cursos, edite os arquivos de configuração. Este painel serve para monitoramento e simulação.</p>
                <div className="flex gap-4">
                  <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold text-sm">Ver Guia de Edição</button>
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold text-sm border border-blue-400">Suporte Técnico</button>
                </div>
              </div>
              <div className="w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        )}

        {/* Content Tab (Static Data) */}
        {activeTab === 'content' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Cursos em Destaque</h2>
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">Editável em constants.tsx</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_COURSES.map(course => (
                  <div key={course.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex gap-6">
                    <img src={course.imageUrl} className="w-24 h-24 rounded-2xl object-cover shadow-sm" />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1">{course.name}</h4>
                      <p className="text-xs text-gray-400 mb-4 line-clamp-1">{course.description}</p>
                      <div className="flex gap-2">
                        <button className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-black transition-colors"><Edit size={16} /></button>
                        <a href={course.salesUrl} target="_blank" className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"><ExternalLink size={16} /></a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Livros Publicados</h2>
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">Editável em constants.tsx</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MOCK_BOOKS.map(book => (
                  <div key={book.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col">
                    <img src={book.imageUrl} className="w-full aspect-[3/4] rounded-xl object-cover mb-4 shadow-sm" />
                    <h4 className="font-bold mb-1">{book.title}</h4>
                    <p className="text-xs text-gray-400 mb-4 line-clamp-2">{book.description}</p>
                    <button className="mt-auto w-full py-2 bg-gray-50 text-gray-400 rounded-xl font-bold text-xs hover:text-black transition-colors">Visualizar Configuração</button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Articles Management */}
        {activeTab === 'articles' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Artigos Sincronizados (WP)</h2>
              <a href="https://phdonassolo.com/wp-admin" target="_blank" className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                Ir para o WordPress <ExternalLink size={16} />
              </a>
            </div>
            <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold uppercase text-gray-400 tracking-wider">
                  <tr>
                    <th className="px-8 py-5">Artigo</th>
                    <th className="px-8 py-5">Status API</th>
                    <th className="px-8 py-5 text-right">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_ARTICLES.map(article => (
                    <tr key={article.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <div className="font-bold text-gray-900">{article.title}</div>
                        <div className="text-xs text-gray-400">{article.category} • {article.date}</div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Sincronizado
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <a href={`#/artigo/${article.id}`} className="text-blue-600 hover:underline text-sm font-bold">Ver no Site</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6 animate-in fade-in duration-500 text-center py-20">
             <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={32} />
             </div>
             <h2 className="text-3xl font-bold">Gestão de Alunos</h2>
             <p className="text-gray-500 max-w-md mx-auto mb-8">Esta funcionalidade está em fase final de prototipagem. No futuro, você poderá gerenciar acessos de cursos pagos aqui.</p>
             <button className="bg-gray-100 text-gray-400 px-8 py-3 rounded-full font-bold cursor-not-allowed">Em Breve</button>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminPage;
