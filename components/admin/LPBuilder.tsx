import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, setDoc, doc, deleteDoc, query } from 'firebase/firestore';
import { Plus, Trash2, Edit2, Save, X, Layout, Eye, Copy, Monitor, Smartphone, Settings, RefreshCw } from 'lucide-react';

const LPBuilder = () => {
    const [lps, setLps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'conteudo' | 'design' | 'config'>('conteudo');
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const [formData, setFormData] = useState<any>({
        pageTitle: 'Material Gratuito | Prof. Paulo',
        metaDesc: 'Material gratuito',
        badge: 'Material Gratuito',
        titleLine1: 'Título do Material',
        titleLine2: 'Subtítulo',
        heroDesc: 'Descrição do material',
        beneficios: ['Prático', 'Real', 'Aplicável'],
        labelNome: 'Seu Nome',
        labelEmail: 'E-mail Principal',
        labelWhatsapp: 'WhatsApp',
        placeholderNome: 'Como deseja ser chamado?',
        placeholderEmail: 'ex: voce@empresa.com',
        placeholderWhatsapp: '(00) 00000-0000',
        formTitle: 'Receba grátis',
        formSubtitle: 'Preencha os dados',
        submittedMessage: 'Sua solicitação foi processada. Em instantes você receberá o material.',
        buttonText: 'Receber Grátis',
        bgColor: '#fbfbfd',
        primaryColor: '#3b82f6',
        textColor: '#1d1d1f',
        buttonBgColor: '#3b82f6',
        buttonTextColor: '#ffffff',
        buttonRadius: '24px',
        fontFamily: 'Inter',
        titleSize: 'text-5xl',
        titleWeight: 'font-bold',
        buttonSize: 'px-10 py-4 text-lg',
        lpName: '',
        materialId: '',
        tipoEntrega: 'Download',
        redirectUrl: '',
        webAppUrl: 'https://script.google.com/macros/s/AKfycbwAz17lsqIudknZuxeWf8OG5wJhEAf_UTJ1_H0yiSGyjleipJ9gRu68dx9hNrWYimtL/exec',
        gaId: 'G-QLJ9N5BYTD',
        termsText: 'Autorizo o uso dos meus dados para recebimento de comunicações conforme a LGPD.',
        showTerms: true
    });

    useEffect(() => {
        fetchLPs();
    }, []);

    const fetchLPs = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'landing_pages'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({ ...doc.data() }));
            console.log("LPs recuperadas:", data);
            setLps(data);
        } catch (error) {
            console.error("Erro ao buscar LPs:", error);
        } finally {
            setLoading(false);
        }
    };

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!formData.lpName || !formData.materialId) {
            alert("Nome e Material_ID são obrigatórios.");
            return;
        }
        setSaving(true);
        try {
            console.log("Salvando LP:", formData.lpName, formData);
            await setDoc(doc(db, 'landing_pages', formData.lpName), {
                ...formData,
                updatedAt: new Date().toISOString()
            });
            alert("LP salva com sucesso!");
            setEditingIndex(null);
            await fetchLPs();
        } catch (error: any) {
            console.error("Erro ao salvar LP:", error);
            alert("Erro ao salvar: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (lpName: string) => {
        if (!window.confirm("Excluir esta LP?")) return;
        try {
            await deleteDoc(doc(db, 'landing_pages', lpName));
            fetchLPs();
        } catch (error) { console.error(error); }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Carregando LPs...</div>;

    return (
        <div className="space-y-12">
            <div className="flex gap-8">
            {/* EDITOR */}
            <div className="w-1/2 space-y-6">
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Layout size={24} /> {editingIndex !== null ? 'Editar LP' : 'Nova Landing Page'}
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="p-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50"
                            >
                                {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                            </button>
                            {editingIndex !== null && <button onClick={() => { setEditingIndex(null); setFormData({}); }} className="p-3 bg-gray-100 rounded-xl"><X size={20} /></button>}
                        </div>
                    </div>

                    <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Identificação / Slug da URL *</label>
                                <input
                                    type="text"
                                    value={formData.lpName || ''}
                                    onChange={e => setFormData({ ...formData, lpName: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                    placeholder="ex: guia-vendas"
                                    className="w-full p-3 bg-blue-50/30 border border-blue-100 rounded-xl outline-none font-bold text-blue-900"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Material_ID (Planilha/Sheets) *</label>
                                <input
                                    type="text"
                                    value={formData.materialId || ''}
                                    onChange={e => setFormData({ ...formData, materialId: e.target.value })}
                                    placeholder="ex: PLANILHA_01"
                                    className="w-full p-3 bg-blue-50/30 border border-blue-100 rounded-xl outline-none font-bold text-blue-900"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex border-b border-gray-100 mb-6">
                        {[
                            { id: 'conteudo', label: '📝 Conteúdo', icon: <Edit2 size={14} /> },
                            { id: 'design', label: '🎨 Design', icon: <Layout size={14} /> },
                            { id: 'config', label: '⚙️ Config', icon: <Settings size={14} /> }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-6">
                        {activeTab === 'conteudo' && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Linha de Título 1</label>
                                    <input type="text" value={formData.titleLine1} onChange={e => setFormData({ ...formData, titleLine1: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Linha de Título 2 (Destaque)</label>
                                    <input type="text" value={formData.titleLine2} onChange={e => setFormData({ ...formData, titleLine2: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Descrição Hero</label>
                                    <textarea value={formData.heroDesc} onChange={e => setFormData({ ...formData, heroDesc: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none h-24" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Título do Formulário</label>
                                    <input type="text" value={formData.formTitle} onChange={e => setFormData({ ...formData, formTitle: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Mensagem de Sucesso (após envio)</label>
                                    <input type="text" value={formData.submittedMessage} onChange={e => setFormData({ ...formData, submittedMessage: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" placeholder="Ex: Tudo pronto! Verifique seu e-mail." />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Texto do Botão</label>
                                    <input type="text" value={formData.buttonText} onChange={e => setFormData({ ...formData, buttonText: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Label Nome</label>
                                        <input type="text" value={formData.labelNome} onChange={e => setFormData({ ...formData, labelNome: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Placeholder Nome</label>
                                        <input type="text" value={formData.placeholderNome} onChange={e => setFormData({ ...formData, placeholderNome: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Label E-mail</label>
                                        <input type="text" value={formData.labelEmail} onChange={e => setFormData({ ...formData, labelEmail: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Placeholder E-mail</label>
                                        <input type="text" value={formData.placeholderEmail} onChange={e => setFormData({ ...formData, placeholderEmail: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Label WhatsApp</label>
                                        <input type="text" value={formData.labelWhatsapp} onChange={e => setFormData({ ...formData, labelWhatsapp: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Placeholder WhatsApp</label>
                                        <input type="text" value={formData.placeholderWhatsapp} onChange={e => setFormData({ ...formData, placeholderWhatsapp: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="showTerms"
                                            checked={formData.showTerms}
                                            onChange={e => setFormData({ ...formData, showTerms: e.target.checked })}
                                            className="w-4 h-4"
                                        />
                                        <label htmlFor="showTerms" className="text-xs font-bold text-gray-500 uppercase">Mostrar Checkbox de LGPD</label>
                                    </div>
                                    {formData.showTerms && (
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Texto de Autorização</label>
                                            <textarea
                                                value={formData.termsText}
                                                onChange={e => setFormData({ ...formData, termsText: e.target.value })}
                                                className="w-full p-2 bg-white border border-gray-100 rounded-lg outline-none text-xs"
                                                rows={2}
                                            />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {activeTab === 'design' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Cor Primária</label>
                                        <input type="color" value={formData.primaryColor} onChange={e => setFormData({ ...formData, primaryColor: e.target.value })} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl p-1" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Cor de Fundo</label>
                                        <input type="color" value={formData.bgColor} onChange={e => setFormData({ ...formData, bgColor: e.target.value })} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl p-1" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Cor Botão</label>
                                        <input type="color" value={formData.buttonBgColor} onChange={e => setFormData({ ...formData, buttonBgColor: e.target.value })} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl p-1" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Cor Texto Botão</label>
                                        <input type="color" value={formData.buttonTextColor} onChange={e => setFormData({ ...formData, buttonTextColor: e.target.value })} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl p-1" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Arredondamento Botão (px)</label>
                                    <input type="text" value={formData.buttonRadius} onChange={e => setFormData({ ...formData, buttonRadius: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" placeholder="ex: 24px" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Tamanho do Título</label>
                                    <select value={formData.titleSize} onChange={e => setFormData({ ...formData, titleSize: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none">
                                        <option value="text-4xl">Pequeno (4xl)</option>
                                        <option value="text-5xl">Médio (5xl)</option>
                                        <option value="text-6xl">Grande (6xl)</option>
                                        <option value="text-7xl">Extra Grande (7xl)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Família da Fonte</label>
                                    <select value={formData.fontFamily} onChange={e => setFormData({ ...formData, fontFamily: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none">
                                        <option value="Inter">Inter (Padrão)</option>
                                        <option value="system-ui">System Default</option>
                                        <option value="'Outfit', sans-serif">Outfit</option>
                                        <option value="'Roboto', sans-serif">Roboto</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {activeTab === 'config' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">URL Web App (GScript)</label>
                                    <input type="url" value={formData.webAppUrl} onChange={e => setFormData({ ...formData, webAppUrl: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">URL de Redirecionamento (após envio)</label>
                                    <input type="url" value={formData.redirectUrl} onChange={e => setFormData({ ...formData, redirectUrl: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" placeholder="Ex: https://..." />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">ID Google Analytics</label>
                                    <input type="text" value={formData.gaId} onChange={e => setFormData({ ...formData, gaId: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* PREVIEW & LIST */}
            <div className="w-1/2 space-y-6">
                <div className="bg-gray-100 p-1 rounded-2xl flex w-fit mb-4">
                    <button onClick={() => setPreviewMode('desktop')} className={`p-2 rounded-xl ${previewMode === 'desktop' ? 'bg-white shadow-sm' : ''}`}><Monitor size={18} /></button>
                    <button onClick={() => setPreviewMode('mobile')} className={`p-2 rounded-xl ${previewMode === 'mobile' ? 'bg-white shadow-sm' : ''}`}><Smartphone size={18} /></button>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-2xl sticky top-24">
                    <div className={`transition-all duration-300 mx-auto ${previewMode === 'mobile' ? 'max-w-[375px]' : 'w-full'}`}>
                        <div className="p-8 text-center" style={{ backgroundColor: formData.bgColor, color: formData.textColor, minHeight: '600px', fontFamily: formData.fontFamily }}>
                            <div className="inline-block px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6" style={{ backgroundColor: `${formData.primaryColor}20`, color: formData.primaryColor }}>{formData.badge}</div>
                            <h1 className={`${formData.titleSize} font-bold mb-4`}>{formData.titleLine1}<br /><span style={{ color: formData.primaryColor }}>{formData.titleLine2}</span></h1>
                            <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">{formData.heroDesc}</p>

                            <div className="bg-white rounded-[24px] p-6 shadow-xl border border-gray-100 text-left">
                                <h2 className="font-bold mb-4 text-black">{formData.formTitle}</h2>
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold uppercase text-gray-400">{formData.labelNome}</span>
                                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 h-10 text-xs text-gray-300 flex items-center">{formData.placeholderNome}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold uppercase text-gray-400">{formData.labelEmail}</span>
                                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 h-10 text-xs text-gray-300 flex items-center">{formData.placeholderEmail}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold uppercase text-gray-400">{formData.labelWhatsapp}</span>
                                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 h-10 text-xs text-gray-300 flex items-center">{formData.placeholderWhatsapp}</div>
                                    </div>
                                    {formData.showTerms && (
                                        <div className="flex gap-2 pt-2">
                                            <input type="checkbox" checked={true} readOnly className="mt-1" />
                                            <p className="text-[9px] text-gray-400 leading-tight">{formData.termsText}</p>
                                        </div>
                                    )}
                                    <button className="w-full p-4 font-bold text-white shadow-lg transition-all" style={{ backgroundColor: formData.buttonBgColor, borderRadius: formData.buttonRadius }}>{formData.buttonText}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {/* LISTAGEM ABAIXO */}
            <div className="space-y-4 pt-8 border-t border-gray-100">
                <h3 className="text-xl font-bold flex items-center gap-2"><Layout size={20} /> Landing Pages Criadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lps.map((lp, idx) => (
                        <div key={lp.lpName} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm group hover:scale-[1.02] transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                    <Layout size={24} />
                                </div>
                                <div className="flex gap-1 opacity-10 md:opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => { setEditingIndex(idx); setFormData(lp); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors" title="Editar"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(lp.lpName)} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" title="Excluir"><Trash2 size={16} /></button>
                                    <a href={`#/lp/${lp.lpName}`} target="_blank" className="p-2 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors" title="Ver"><Eye size={16} /></a>
                                </div>
                            </div>
                            <h4 className="font-bold text-lg mb-1">{lp.lpName}</h4>
                            <p className="text-xs text-gray-400 mb-4 font-medium">Material: {lp.materialId}</p>

                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest pt-4 border-t border-gray-50">
                                <span className="text-gray-400">Entrega: {lp.tipoEntrega}</span>
                                <span className={`px-2 py-1 rounded-md ${lp.redirectUrl ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {lp.redirectUrl ? 'Com Redirect' : 'Sem Redirect'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LPBuilder;
