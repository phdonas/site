import React, { useState, useEffect } from 'react';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import { DataService } from '../../services/dataService';
import { Save, Image as ImageIcon, Eye, EyeOff, Layout } from 'lucide-react';

export const SiteEditor: React.FC = () => {
  const { config, reloadConfig } = useSiteConfig();
  const [formData, setFormData] = useState<any>(config);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'geral' | 'hero' | 'sections' | 'footer'>('hero');

  useEffect(() => {
    if (config) setFormData(config);
  }, [config]);

  const handleChange = (path: string, value: any) => {
    const keys = path.split('.');
    setFormData((prev: any) => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await DataService.saveGlobalSettings(formData);
    if (success) {
      await reloadConfig();
      alert('Configurações salvas e site atualizado ao vivo!');
    } else {
      alert('Erro ao salvar.');
    }
    setSaving(false);
  };

  const renderToggle = (path: string, label: string) => {
    const keys = path.split('.');
    let current = formData;
    keys.forEach(k => current = current?.[k]);
    const isVisible = current !== false;

    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4 border border-gray-100">
        <div>
          <span className="font-bold">{label}</span>
          <p className="text-xs text-gray-500">Exibir esta seção na página inicial do site</p>
        </div>
        <button 
          onClick={() => handleChange(path, !isVisible)}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${isVisible ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}
        >
          {isVisible ? <><Eye size={16}/> Visível</> : <><EyeOff size={16}/> Oculto</>}
        </button>
      </div>
    );
  };

  if (!formData) return <div>Carregando editor...</div>;

  return (
    <div className="bg-white rounded-[32px] p-8 md:p-10 card-shadow border border-gray-100 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3"><Layout className="text-blue-600"/> Editor Visual (CMS)</h2>
          <p className="text-gray-500 text-sm mt-1">Edite os textos, imagens e ligue/desligue seções do site em tempo real.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? 'Publicando...' : <><Save size={18} /> Publicar Alterações</>}
        </button>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-xl mb-8 w-fit flex-wrap gap-1">
        <button onClick={() => setActiveTab('hero')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'hero' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>Página Inicial (Hero)</button>
        <button onClick={() => setActiveTab('sections')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'sections' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>Seções da Home</button>
        <button onClick={() => setActiveTab('pages')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'pages' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>Páginas Internas</button>
        <button onClick={() => setActiveTab('geral')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'geral' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>Dados Gerais</button>
      </div>

      <div className="grid grid-cols-1 gap-8 max-w-4xl">
        {activeTab === 'hero' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            {renderToggle('hero.visible', 'Seção Principal (Hero)')}
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tag/Categoria Acima do Título</label>
                <input type="text" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none" value={formData.hero.tag} onChange={e => handleChange('hero.tag', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Título Principal <span className="text-gray-400 font-normal">(Aceita HTML como &lt;br/&gt; para quebrar linha)</span></label>
                <textarea rows={3} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none" value={formData.hero.title} onChange={e => handleChange('hero.title', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subtítulo</label>
                <textarea rows={3} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none" value={formData.hero.subtitle} onChange={e => handleChange('hero.subtitle', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Texto do Botão Principal</label>
                  <input type="text" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none" value={formData.hero.buttonText} onChange={e => handleChange('hero.buttonText', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Link do Botão Principal</label>
                  <input type="text" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none" value={formData.hero.buttonLink} onChange={e => handleChange('hero.buttonLink', e.target.value)} />
                </div>
              </div>
              <div className="mt-4 p-5 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><ImageIcon size={16}/> Imagem de Fundo (Background URL)</label>
                <p className="text-xs text-gray-500 mb-3">Cole o link de uma imagem hospedada. Se deixar em branco, o fundo será branco.</p>
                <input type="text" className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:border-blue-500 outline-none" value={formData.hero.backgroundImage || ''} onChange={e => handleChange('hero.backgroundImage', e.target.value)} placeholder="https://..." />
                {formData.hero.backgroundImage && (
                  <div className="mt-4 aspect-video rounded-xl overflow-hidden relative">
                    <img src={formData.hero.backgroundImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
            {/* Pilares */}
            <div className="p-6 border border-gray-200 rounded-2xl">
              <h3 className="font-bold text-xl mb-4 text-blue-600">Bloco de Pilares</h3>
              {renderToggle('sections.pillars.visible', 'Exibir bloco de Pilares')}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Título</label>
                  <input type="text" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" value={formData.sections?.pillars?.title || ''} onChange={e => handleChange('sections.pillars.title', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Subtítulo</label>
                  <input type="text" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" value={formData.sections?.pillars?.subtitle || ''} onChange={e => handleChange('sections.pillars.subtitle', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Serviços */}
            <div className="p-6 border border-gray-200 rounded-2xl">
              <h3 className="font-bold text-xl mb-4 text-blue-600">Bloco de Soluções (Consultoria)</h3>
              {renderToggle('sections.services.visible', 'Exibir bloco de Soluções')}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Título</label>
                  <input type="text" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" value={formData.sections?.services?.title || ''} onChange={e => handleChange('sections.services.title', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Subtítulo</label>
                  <input type="text" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" value={formData.sections?.services?.subtitle || ''} onChange={e => handleChange('sections.services.subtitle', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Videos */}
            <div className="p-6 border border-gray-200 rounded-2xl">
              <h3 className="font-bold text-xl mb-4 text-blue-600">Bloco de Vídeos Recentes</h3>
              {renderToggle('sections.videos.visible', 'Exibir bloco de Vídeos')}
              <div className="grid grid-cols-1 gap-4">
                <input type="text" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" placeholder="Título" value={formData.sections?.videos?.title || ''} onChange={e => handleChange('sections.videos.title', e.target.value)} />
                <input type="text" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" placeholder="Subtítulo" value={formData.sections?.videos?.subtitle || ''} onChange={e => handleChange('sections.videos.subtitle', e.target.value)} />
              </div>
            </div>
            
            {/* Lead Form */}
            <div className="p-6 border border-gray-200 rounded-2xl">
              <h3 className="font-bold text-xl mb-4 text-blue-600">Formulário de Newsletter</h3>
              {renderToggle('sections.leadForm.visible', 'Exibir Formulário de Captura no final da Home')}
            </div>
          </div>
        )}

        {activeTab === 'pages' && formData.pages && (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
            {/* Articles */}
            <div className="p-6 border border-gray-200 rounded-2xl">
              <h3 className="font-bold text-xl mb-4 text-blue-600">Página de Artigos & Insights</h3>
              {renderToggle('pages.articles.visible', 'Página Visível e Link no Menu')}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Título da Página</label>
                  <input type="text" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" value={formData.pages.articles.title} onChange={e => handleChange('pages.articles.title', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Subtítulo</label>
                  <input type="text" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" value={formData.pages.articles.subtitle} onChange={e => handleChange('pages.articles.subtitle', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Downloads */}
            <div className="p-6 border border-gray-200 rounded-2xl">
              <h3 className="font-bold text-xl mb-4 text-blue-600">Página de Ferramentas e Downloads</h3>
              {renderToggle('pages.downloads.visible', 'Página Visível e Link no Menu')}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Título da Página</label>
                  <input type="text" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" value={formData.pages.downloads.title} onChange={e => handleChange('pages.downloads.title', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Subtítulo</label>
                  <input type="text" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" value={formData.pages.downloads.subtitle} onChange={e => handleChange('pages.downloads.subtitle', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Courses */}
            <div className="p-6 border border-gray-200 rounded-2xl">
              <h3 className="font-bold text-xl mb-4 text-blue-600">Página de Livros e Cursos</h3>
              {renderToggle('pages.courses.visible', 'Página Visível e Link no Menu')}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Título da Página</label>
                  <input type="text" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" value={formData.pages.courses.title} onChange={e => handleChange('pages.courses.title', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Subtítulo</label>
                  <input type="text" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" value={formData.pages.courses.subtitle} onChange={e => handleChange('pages.courses.subtitle', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="p-6 border border-gray-200 rounded-2xl">
              <h3 className="font-bold text-xl mb-4 text-blue-600">Página de Contato</h3>
              {renderToggle('pages.contact.visible', 'Página Visível e Link no Menu')}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Título da Página</label>
                  <input type="text" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" value={formData.pages.contact.title} onChange={e => handleChange('pages.contact.title', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Subtítulo</label>
                  <input type="text" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" value={formData.pages.contact.subtitle} onChange={e => handleChange('pages.contact.subtitle', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'geral' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nome do Site (Aba do Navegador)</label>
                <input type="text" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" value={formData.name} onChange={e => handleChange('name', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">E-mail de Contato Principal</label>
                <input type="text" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" value={formData.email_contato} onChange={e => handleChange('email_contato', e.target.value)} />
              </div>
            </div>
            
            <div className="p-6 border border-green-200 bg-green-50 rounded-2xl mt-6">
              <h3 className="font-bold text-green-800 mb-4">Botão do WhatsApp</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-green-700 mb-2">Número (Apenas números com DDI e DDD)</label>
                  <input type="text" className="w-full p-3 border border-green-200 rounded-xl" value={formData.whatsapp} onChange={e => handleChange('whatsapp', e.target.value)} placeholder="Ex: 551199999999" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-green-700 mb-2">Número Formatado (Exibição visual)</label>
                  <input type="text" className="w-full p-3 border border-green-200 rounded-xl" value={formData.whatsapp_display} onChange={e => handleChange('whatsapp_display', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-green-700 mb-2">Mensagem Padrão ao abrir o Chat</label>
                  <input type="text" className="w-full p-3 border border-green-200 rounded-xl" value={formData.whatsapp_message} onChange={e => handleChange('whatsapp_message', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
