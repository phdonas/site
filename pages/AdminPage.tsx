
import React, { useState, useEffect } from 'react';
import { MOCK_ARTICLES, PILLARS } from '../constants';
import { Article, Student } from '../types';
import { DataService } from '../services/dataService';
import { Plus, Edit, Trash, Users, BookOpen, Settings, Activity, CheckCircle, XCircle } from 'lucide-react';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'articles' | 'students' | 'status'>('articles');
  const [isWpConnected, setIsWpConnected] = useState<boolean | null>(null);
  
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [students, setStudents] = useState<Student[]>([
    { id: 's1', name: 'João Silva', email: 'joao@email.com', accessType: 'total' },
    { id: 's2', name: 'Maria Santos', email: 'maria@email.com', accessType: 'course', courseIds: ['c1'] }
  ]);

  useEffect(() => {
    const checkConnection = async () => {
      const result = await DataService.testConnection();
      setIsWpConnected(result);
    };
    checkConnection();
  }, []);

  const handleDeleteArticle = (id: string) => {
    setArticles(articles.filter(a => a.id !== id));
  };

  return (
    <main className="min-h-screen pt-24 bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <h1 className="text-4xl font-bold tracking-tight">Painel de Controle</h1>
          <div className="flex bg-gray-200/50 p-1 rounded-2xl overflow-x-auto">
            <button 
              onClick={() => setActiveTab('articles')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'articles' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            >
              <BookOpen size={18} /> Artigos
            </button>
            <button 
              onClick={() => setActiveTab('students')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'students' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            >
              <Users size={18} /> Alunos
            </button>
            <button 
              onClick={() => setActiveTab('status')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'status' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            >
              <Activity size={18} /> Status API
            </button>
          </div>
        </div>

        {activeTab === 'status' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-xl font-bold">Diagnóstico de Conexão</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[32px] card-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">WordPress API</span>
                  {isWpConnected === null ? (
                    <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                  ) : isWpConnected ? (
                    <CheckCircle className="text-green-500" />
                  ) : (
                    <XCircle className="text-red-500" />
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {isWpConnected === null ? 'Testando...' : isWpConnected ? 'Conectado' : 'Erro de CORS'}
                </h3>
                <p className="text-sm text-gray-500">
                  {isWpConnected ? 'Os dados estão sendo puxados do site phdonassolo.com com sucesso.' : 'O navegador bloqueou a chamada. Verifique o seu functions.php no WordPress.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Gestão de Blog</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-blue-700">
                <Plus size={18} /> Novo Artigo
              </button>
            </div>
            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase text-gray-400 tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Artigo</th>
                    <th className="px-6 py-4">Pilar</th>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {articles.map(article => (
                    <tr key={article.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{article.title}</div>
                        <div className="text-xs text-gray-400 truncate max-w-xs">{article.excerpt}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold">
                          {PILLARS.find(p => p.id === article.pillarId)?.title}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{article.date}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-black transition-colors"><Edit size={18} /></button>
                          <button 
                            onClick={() => handleDeleteArticle(article.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          ><Trash size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Gestão de Alunos</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-blue-700">
                <Plus size={18} /> Cadastrar Aluno
              </button>
            </div>
            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase text-gray-400 tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Aluno</th>
                    <th className="px-6 py-4">Acesso</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{student.name}</div>
                        <div className="text-xs text-gray-400">{student.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.accessType === 'total' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {student.accessType === 'total' ? 'Acesso Total' : 'Por Curso'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-black transition-colors"><Settings size={18} /></button>
                          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash size={18} /></button>
                        </div>
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
