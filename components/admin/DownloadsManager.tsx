import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, setDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { Resource, PillarId } from '../../types';
import { Plus, Trash2, Edit2, Copy, Save, X, ExternalLink, Package } from 'lucide-react';

const DownloadsManager = () => {
    const [materials, setMaterials] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [formData, setFormData] = useState<Resource>({
        id: '',
        name: '',
        excerpt: '',
        imageUrl: '',
        url: '',
        category: '',
        pillarIds: []
    });

    const CATEGORIES = ['Ferramentas', 'PDFs', 'Vídeos', 'Planilhas', 'Guias', 'Templates'];
    const PILLARS: { id: PillarId; name: string }[] = [
        { id: 'prof-paulo', name: 'Prof. Paulo' },
        { id: 'academia-do-gas', name: 'Academia do Gás' },
        { id: 'consultoria-imobiliaria', name: 'Consultor Imobiliário' },
        { id: '4050oumais', name: '40-50 ou mais' }
    ];

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'resources'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => doc.data() as Resource);
            setMaterials(data);
        } catch (error) {
            console.error("Error fetching materials:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.id || !formData.name || formData.pillarIds.length === 0) {
            alert("Preencha os campos obrigatórios e selecione ao menos um pilar.");
            return;
        }

        try {
            await setDoc(doc(db, 'resources', formData.id), formData);
            alert("Material salvo com sucesso!");
            resetForm();
            fetchMaterials();
        } catch (error) {
            console.error("Error saving material:", error);
            alert("Erro ao salvar material.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Deseja realmente excluir este material?")) return;
        try {
            await deleteDoc(doc(db, 'resources', id));
            fetchMaterials();
        } catch (error) {
            console.error("Error deleting material:", error);
        }
    };

    const editMaterial = (index: number) => {
        setEditingIndex(index);
        setFormData(materials[index]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingIndex(null);
        setFormData({
            id: '',
            name: '',
            excerpt: '',
            imageUrl: '',
            url: '',
            category: '',
            pillarIds: []
        });
    };

    const togglePillar = (pillarId: PillarId) => {
        const newPillars = formData.pillarIds.includes(pillarId)
            ? formData.pillarIds.filter(id => id !== pillarId)
            : [...formData.pillarIds, pillarId];
        setFormData({ ...formData, pillarIds: newPillars });
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Carregando materiais...</div>;

    return (
        <div className="space-y-8">
            {/* FORMULÁRIO */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    {editingIndex !== null ? <Edit2 size={24} /> : <Plus size={24} />}
                    {editingIndex !== null ? 'Editar Material' : 'Novo Material'}
                </h2>

                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">ID (Slug) *</label>
                            <input
                                type="text"
                                value={formData.id}
                                onChange={e => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                disabled={editingIndex !== null}
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="ex: simulador-preco-gas"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Nome do Material *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Título que aparece no card"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Descrição Curta</label>
                            <textarea
                                value={formData.excerpt}
                                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Categoria *</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            >
                                <option value="">Selecione...</option>
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">URL da Imagem *</label>
                            <input
                                type="url"
                                value={formData.imageUrl}
                                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="https://..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">URL do Link/Download *</label>
                            <input
                                type="url"
                                value={formData.url}
                                onChange={e => setFormData({ ...formData, url: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="https://..."
                                required
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Pilares / Canais *</label>
                        <div className="flex flex-wrap gap-2">
                            {PILLARS.map(p => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => togglePillar(p.id)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${formData.pillarIds.includes(p.id)
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300'
                                        }`}
                                >
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2 flex gap-3 mt-4">
                        <button type="submit" className="flex-1 bg-black text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
                            <Save size={20} /> Salvar Material
                        </button>
                        {editingIndex !== null && (
                            <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-500 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all">
                                <X size={20} /> Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* LISTAGEM */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((mat, index) => (
                    <div key={mat.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                <Package size={24} />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => editMaterial(index)} className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(mat.id)} className="p-2 bg-gray-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <h3 className="font-bold text-lg mb-1">{mat.name}</h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{mat.excerpt}</p>
                        <div className="flex flex-wrap gap-1 mb-4">
                            <span className="px-2 py-1 bg-gray-100 text-gray-400 rounded-md text-[10px] font-bold uppercase">{mat.category}</span>
                            {mat.pillarIds.map(pid => (
                                <span key={pid} className="px-2 py-1 bg-green-50 text-green-600 rounded-md text-[10px] font-bold uppercase">{pid}</span>
                            ))}
                        </div>
                        <a href={mat.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 text-xs font-bold hover:underline">
                            <ExternalLink size={14} /> Ver Material
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DownloadsManager;
