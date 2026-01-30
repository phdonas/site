
import React, { useState } from 'react';
import { MOCK_ARTICLES, MOCK_COURSES, PILLARS } from '../constants';
import { Article, Student, Course } from '../types';
import { Plus, Edit, Trash, Users, BookOpen, Settings } from 'lucide-react';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'articles' | 'students'>('articles');
  
  // States for simplified CRUD demonstration
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [students, setStudents] = useState<Student[]>([
    { id: 's1', name: 'João Silva', email: 'joao@email.com', accessType: 'total' },
    { id: 's2', name: 'Maria Santos', email: 'maria@email.com', accessType: 'course', courseIds: ['c1'] }
  ]);

  const handleDeleteArticle = (id: string) => {
    setArticles(articles.filter(a => a.id !== id));
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  return (
    <main className="min-h-screen pt-24 bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Painel de Controle</h1>
          <div className="flex bg-gray-200/50 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveTab('articles')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'articles' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            >
              <BookOpen size={18} /> Artigos
            </button>
            <button 
              onClick={() => setActiveTab('students')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'students' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            >
              <Users size={18} /> Alunos
            </button>
          </div>
        </div>

        {activeTab === 'articles' ? (
          <div className="space-y-6">
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
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Gestão de Alunos & Acessos</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-blue-700">
                <Plus size={18} /> Cadastrar Aluno
              </button>
            </div>
            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase text-gray-400 tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Aluno</th>
                    <th className="px-6 py-4">Tipo de Acesso</th>
                    <th className="px-6 py-4">Cursos</th>
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
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {student.accessType === 'total' ? 'Todos' : (
                          <div className="flex flex-wrap gap-1">
                            {student.courseIds?.map(cid => (
                              <span key={cid} className="bg-gray-100 px-2 py-0.5 rounded text-[10px]">
                                {MOCK_COURSES.find(c => c.id === cid)?.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-black transition-colors"><Settings size={18} /></button>
                          <button 
                            onClick={() => handleDeleteStudent(student.id)}
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
      </div>
    </main>
  );
};

export default AdminPage;
