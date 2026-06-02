import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Edit2, Trash2, Plus, Save, X, RefreshCw, FileText, Video, Book, GraduationCap, Download } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

type Tab = 'resources' | 'courses' | 'books' | 'videos' | 'articles';

export const ContentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('articles');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setEditingId(null);
    setFormData({});
    try {
      const snap = await getDocs(collection(db, activeTab));
      setData(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleCreate = () => {
    const newId = `${activeTab}_${Date.now()}`;
    setEditingId(newId);
    
    // Default forms based on tab
    const defaults: any = { id: newId };
    if (activeTab === 'articles') {
      defaults.title = ''; defaults.content = ''; defaults.excerpt = ''; defaults.category = 'Geral'; defaults.pillarId = 'prof-paulo'; defaults.date = new Date().toISOString(); defaults.publishDate = new Date().toISOString(); defaults.imageUrl = '';
    } else if (activeTab === 'videos') {
      defaults.title = ''; defaults.url = ''; defaults.thumb = ''; defaults.publishDate = new Date().toISOString();
    } else if (activeTab === 'books') {
      defaults.title = ''; defaults.description = ''; defaults.imageUrl = ''; defaults.buyUrl = '';
    } else if (activeTab === 'courses') {
      defaults.name = ''; defaults.description = ''; defaults.imageUrl = ''; defaults.salesUrl = ''; defaults.category = '';
    } else if (activeTab === 'resources') {
      defaults.name = ''; defaults.category = 'E-books'; defaults.type = 'PDF'; defaults.size = '1 MB'; defaults.url = '';
    }
    
    setFormData(defaults);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, activeTab, formData.id), formData);
      setEditingId(null);
      await fetchData();
    } catch (e) {
      alert('Erro ao salvar no Banco de Dados.');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja apagar? Esta ação não tem volta.')) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, activeTab, id));
      await fetchData();
    } catch (e) {
      alert('Erro ao deletar.');
    }
    setLoading(false);
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const renderForm = () => {
    if (!editingId) return null;

    if (activeTab === 'articles') {
      return (
        <div className="space-y-4">
          <input type="text" placeholder="Título do Artigo" className="w-full p-3 border border-gray-200 rounded-xl" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 font-bold mb-1 block">Pilar</label>
              <select className="w-full p-3 border border-gray-200 rounded-xl" value={formData.pillarId} onChange={e => setFormData({...formData, pillarId: e.target.value})}>
                <option value="prof-paulo">Prof. Paulo</option>
                <option value="consultoria-imobiliaria">Consultoria Imobiliária</option>
                <option value="4050oumais">40/50 ou Mais</option>
                <option value="academia-do-gas">Academia do Gás</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-bold mb-1 block">Data de Liberação (Agendamento)</label>
              <input type="datetime-local" className="w-full p-3 border border-gray-200 rounded-xl" value={formData.publishDate ? new Date(formData.publishDate).toISOString().slice(0,16) : ''} onChange={e => setFormData({...formData, publishDate: new Date(e.target.value).toISOString()})} />
            </div>
          </div>
          <input type="text" placeholder="URL da Imagem de Capa" className="w-full p-3 border border-gray-200 rounded-xl" value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
          <textarea placeholder="Resumo (Excerpt)" rows={2} className="w-full p-3 border border-gray-200 rounded-xl resize-none" value={formData.excerpt || ''} onChange={e => setFormData({...formData, excerpt: e.target.value})}></textarea>
          <div className="bg-white">
            <ReactQuill theme="snow" value={formData.content || ''} onChange={val => setFormData({...formData, content: val})} modules={quillModules} className="h-[300px] mb-12" />
          </div>
        </div>
      );
    }

    if (activeTab === 'videos') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Título do Vídeo" className="p-3 border rounded-lg col-span-2" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
          <input type="text" placeholder="URL do Vídeo (Youtube Embed)" className="p-3 border rounded-lg" value={formData.url || ''} onChange={e => setFormData({...formData, url: e.target.value})} />
          <input type="text" placeholder="URL da Thumbnail" className="p-3 border rounded-lg" value={formData.thumb || ''} onChange={e => setFormData({...formData, thumb: e.target.value})} />
          <div className="col-span-2">
            <label className="text-xs text-gray-500 font-bold mb-1 block">Data de Liberação</label>
            <input type="datetime-local" className="w-full p-3 border border-gray-200 rounded-xl" value={formData.publishDate ? new Date(formData.publishDate).toISOString().slice(0,16) : ''} onChange={e => setFormData({...formData, publishDate: new Date(e.target.value).toISOString()})} />
          </div>
        </div>
      );
    }

    if (activeTab === 'books') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Título do Livro" className="p-3 border rounded-lg col-span-2" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
          <textarea placeholder="Descrição curta" rows={3} className="p-3 border rounded-lg col-span-2" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
          <input type="text" placeholder="URL da Capa" className="p-3 border rounded-lg" value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
          <input type="text" placeholder="Link de Compra (Amazon)" className="p-3 border rounded-lg" value={formData.buyUrl || ''} onChange={e => setFormData({...formData, buyUrl: e.target.value})} />
        </div>
      );
    }

    if (activeTab === 'courses') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Nome do Curso" className="p-3 border rounded-lg col-span-2" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="text" placeholder="Categoria" className="p-3 border rounded-lg" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} />
          <input type="text" placeholder="Link de Venda" className="p-3 border rounded-lg" value={formData.salesUrl || ''} onChange={e => setFormData({...formData, salesUrl: e.target.value})} />
          <textarea placeholder="Descrição" rows={3} className="p-3 border rounded-lg col-span-2" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
          <input type="text" placeholder="URL da Imagem" className="p-3 border rounded-lg col-span-2" value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
        </div>
      );
    }

    if (activeTab === 'resources') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Nome do Material" className="p-3 border rounded-lg" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="text" placeholder="URL ou Link do Arquivo" className="p-3 border rounded-lg" value={formData.url || ''} onChange={e => setFormData({...formData, url: e.target.value})} />
          <select className="p-3 border rounded-lg" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            <option value="E-books">E-books</option>
            <option value="Planilhas">Planilhas</option>
            <option value="Guias">Guias</option>
            <option value="Checklists">Checklists</option>
            <option value="Ferramentas">Ferramentas</option>
          </select>
          <select className="p-3 border rounded-lg" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option value="PDF">PDF</option>
            <option value="EXCEL">EXCEL</option>
            <option value="WORD">WORD</option>
            <option value="LINK">LINK/HTML</option>
          </select>
          <input type="text" placeholder="Tamanho (ex: 2.5 MB)" className="p-3 border rounded-lg col-span-2" value={formData.size || ''} onChange={e => setFormData({...formData, size: e.target.value})} />
        </div>
      );
    }
  };

  const isScheduled = (item: any) => {
    if (!item.publishDate) return false;
    return new Date(item.publishDate) > new Date();
  };

  return (
    <div className="bg-white rounded-[32px] p-8 md:p-10 card-shadow border border-gray-100 animate-in fade-in duration-500">
      
      {/* Sub-menu Tabs */}
      <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 mb-8 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('articles')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'articles' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>
          <FileText size={18} /> Artigos
        </button>
        <button onClick={() => setActiveTab('videos')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'videos' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>
          <Video size={18} /> Vídeos
        </button>
        <button onClick={() => setActiveTab('courses')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'courses' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>
          <GraduationCap size={18} /> Cursos
        </button>
        <button onClick={() => setActiveTab('books')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'books' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>
          <Book size={18} /> Livros
        </button>
        <button onClick={() => setActiveTab('resources')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'resources' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>
          <Download size={18} /> Ferramentas
        </button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
          <p className="text-gray-500 text-sm">Gerencie o acervo da plataforma em tempo real.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          {!editingId && (
            <button onClick={handleCreate} className="bg-black text-white px-5 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2">
              <Plus size={18} /> Novo Registro
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {editingId && !data.find(d => d.id === editingId) && (
          <div className="p-6 border border-blue-200 bg-blue-50/30 rounded-2xl mb-8">
            <h3 className="font-bold text-lg mb-4 text-blue-800">Criando Novo Registro</h3>
            {renderForm()}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditingId(null)} className="px-5 py-3 text-gray-500 hover:bg-gray-200 rounded-xl font-bold">Cancelar</button>
              <button onClick={handleSave} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2"><Save size={18}/> Salvar e Publicar</button>
            </div>
          </div>
        )}

        {data.map(item => (
          <div key={item.id} className="p-5 border border-gray-100 rounded-2xl hover:border-gray-300 transition-colors bg-gray-50/50">
            {editingId === item.id ? (
              <div className="w-full">
                {renderForm()}
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button onClick={() => setEditingId(null)} className="px-5 py-3 text-gray-500 hover:bg-gray-200 rounded-xl font-bold">Cancelar</button>
                  <button onClick={handleSave} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2"><Save size={18}/> Salvar Edição</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {item.imageUrl || item.thumb ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                      <img src={item.imageUrl || item.thumb} className="w-full h-full object-cover" alt="" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center font-bold text-xs text-blue-600">{item.type || 'TXT'}</div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      {item.title || item.name} 
                      {isScheduled(item) && <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Agendado</span>}
                    </h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                      {item.category || activeTab} {item.publishDate && `• ${new Date(item.publishDate).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-100"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-3 bg-white border border-red-100 text-red-500 rounded-xl hover:bg-red-50"><Trash2 size={16} /></button>
                </div>
              </div>
            )}
          </div>
        ))}

        {data.length === 0 && !loading && !editingId && (
          <div className="text-center py-10 text-gray-500">Nenhum registro encontrado nesta categoria.</div>
        )}
      </div>
    </div>
  );
};
