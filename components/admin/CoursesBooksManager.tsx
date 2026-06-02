import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, setDoc, doc, deleteDoc, query } from 'firebase/firestore';
import { Course, Book } from '../../types';
import { Plus, Trash2, Edit2, Save, X, BookOpen, GraduationCap, Link } from 'lucide-react';

const CoursesBooksManager = () => {
    const [activeType, setActiveType] = useState<'courses' | 'books'>('courses');
    const [courses, setCourses] = useState<Course[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);

    // FORM STATES
    const [courseForm, setCourseForm] = useState<Course>({
        id: '', name: '', description: '', longDescription: '', imageUrl: '', category: '',
        trilha: 'negociacao', ordem: 1, salesUrl: '', goUrl: '', learningPoints: [], videos: []
    });
    const [bookForm, setBookForm] = useState<Book>({
        id: '', title: '', description: '', imageUrl: '', amazonUrl: '', buyUrl: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const cSnapshot = await getDocs(query(collection(db, 'courses')));
            setCourses(cSnapshot.docs.map(doc => doc.data() as Course));

            const bSnapshot = await getDocs(query(collection(db, 'books')));
            setBooks(bSnapshot.docs.map(doc => doc.data() as Book));
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await setDoc(doc(db, 'courses', courseForm.id), courseForm);
            alert("Curso salvo!");
            resetForms();
            fetchData();
        } catch (error) { console.error(error); }
    };

    const handleSaveBook = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await setDoc(doc(db, 'books', bookForm.id), bookForm);
            alert("Livro salvo!");
            resetForms();
            fetchData();
        } catch (error) { console.error(error); }
    };

    const handleDelete = async (type: 'courses' | 'books', id: string) => {
        if (!window.confirm("Deseja realmente excluir?")) return;
        try {
            await deleteDoc(doc(db, type, id));
            fetchData();
        } catch (error) { console.error(error); }
    };

    const resetForms = () => {
        setEditingId(null);
        setCourseForm({
            id: '', name: '', description: '', longDescription: '', imageUrl: '', category: '',
            trilha: 'negociacao', ordem: 1, salesUrl: '', goUrl: '', learningPoints: [], videos: []
        });
        setBookForm({
            id: '', title: '', description: '', imageUrl: '', amazonUrl: '', buyUrl: ''
        });
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Carregando...</div>;

    return (
        <div className="space-y-8">
            <div className="flex bg-gray-100 p-1 rounded-2xl w-fit">
                <button onClick={() => { setActiveType('courses'); resetForms(); }} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeType === 'courses' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>
                    <GraduationCap size={14} className="inline mr-2" /> Cursos
                </button>
                <button onClick={() => { setActiveType('books'); resetForms(); }} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeType === 'books' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>
                    <BookOpen size={14} className="inline mr-2" /> Livros
                </button>
            </div>

            {/* FORMULÁRIO */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    {editingId ? <Edit2 size={24} /> : <Plus size={24} />}
                    {editingId ? 'Editar' : 'Novo'} {activeType === 'courses' ? 'Curso' : 'Livro'}
                </h2>

                {activeType === 'courses' ? (
                    <form onSubmit={handleSaveCourse} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <input type="text" placeholder="ID (ex: negociacao)" value={courseForm.id} onChange={e => setCourseForm({ ...courseForm, id: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" required />
                            <input type="text" placeholder="Nome do Curso" value={courseForm.name} onChange={e => setCourseForm({ ...courseForm, name: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" required />
                            <textarea placeholder="Descrição Curta" value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none h-20" />
                            <textarea placeholder="Descrição Longa" value={courseForm.longDescription} onChange={e => setCourseForm({ ...courseForm, longDescription: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none h-32" />
                        </div>
                        <div className="space-y-4">
                            <input type="text" placeholder="Categoria" value={courseForm.category} onChange={e => setCourseForm({ ...courseForm, category: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                            <select value={courseForm.trilha} onChange={e => setCourseForm({ ...courseForm, trilha: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none">
                                <option value="negociacao">Negociação</option>
                                <option value="financas">Finanças</option>
                                <option value="execucao">Execução Comercial</option>
                            </select>
                            <input type="url" placeholder="URL Imagem" value={courseForm.imageUrl} onChange={e => setCourseForm({ ...courseForm, imageUrl: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                            <input type="url" placeholder="URL de Venda (Udemy/Hotmart)" value={courseForm.salesUrl} onChange={e => setCourseForm({ ...courseForm, salesUrl: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                        </div>
                        <div className="md:col-span-2 flex gap-3">
                            <button type="submit" className="flex-1 bg-black text-white p-4 rounded-2xl font-bold transition-all"><Save className="inline mr-2" /> Salvar Curso</button>
                            {editingId && <button onClick={resetForms} className="bg-gray-100 p-4 rounded-2xl font-bold"><X /></button>}
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSaveBook} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <input type="text" placeholder="ID (ex: recriar-gestao)" value={bookForm.id} onChange={e => setBookForm({ ...bookForm, id: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" required />
                            <input type="text" placeholder="Título do Livro" value={bookForm.title} onChange={e => setBookForm({ ...bookForm, title: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" required />
                            <textarea placeholder="Descrição" value={bookForm.description} onChange={e => setBookForm({ ...bookForm, description: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none h-32" />
                        </div>
                        <div className="space-y-4">
                            <input type="url" placeholder="URL Imagem Capa" value={bookForm.imageUrl} onChange={e => setBookForm({ ...bookForm, imageUrl: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                            <input type="url" placeholder="URL Amazon" value={bookForm.amazonUrl} onChange={e => setBookForm({ ...bookForm, amazonUrl: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                            <input type="url" placeholder="Link de Compra Direto" value={bookForm.buyUrl} onChange={e => setBookForm({ ...bookForm, buyUrl: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                        </div>
                        <div className="md:col-span-2 flex gap-3">
                            <button type="submit" className="flex-1 bg-black text-white p-4 rounded-2xl font-bold transition-all"><Save className="inline mr-2" /> Salvar Livro</button>
                            {editingId && <button onClick={resetForms} className="bg-gray-100 p-4 rounded-2xl font-bold"><X /></button>}
                        </div>
                    </form>
                )}
            </div>

            {/* LISTAGEM */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeType === 'courses' ? (
                    courses.map(c => (
                        <div key={c.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><GraduationCap /></div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => { setEditingId(c.id); setCourseForm(c); }} className="p-2 hover:text-blue-600"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete('courses', c.id)} className="p-2 hover:text-red-600"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <h3 className="font-bold mb-1">{c.name}</h3>
                            <p className="text-gray-500 text-xs mb-4 line-clamp-2">{c.description}</p>
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase text-gray-400">
                                <span>{c.category}</span>
                                <span className="bg-gray-100 px-2 py-1 rounded">{c.trilha}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    books.map(b => (
                        <div key={b.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600"><BookOpen /></div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => { setEditingId(b.id); setBookForm(b); }} className="p-2 hover:text-blue-600"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete('books', b.id)} className="p-2 hover:text-red-600"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <h3 className="font-bold mb-1">{b.title}</h3>
                            <div className="flex gap-4 mt-4 text-blue-600 font-bold text-xs uppercase cursor-pointer">
                                <a href={b.amazonUrl} target="_blank" rel="noreferrer"><Link size={12} className="inline mr-1" /> Amazon</a>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CoursesBooksManager;
