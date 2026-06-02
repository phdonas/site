import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Resource } from '../types';
import { Download, FileText, FileSpreadsheet, FileBox, ExternalLink } from 'lucide-react';
import { useSiteConfig } from '../contexts/SiteConfigContext';

const DownloadsPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const { config } = useSiteConfig();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await DataService.getResources();
      setResources(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const categories = Array.from(new Set(resources.map(r => r.category)));

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'EXCEL': return <FileSpreadsheet className="text-green-600" size={24} />;
      case 'PDF': return <FileText className="text-red-500" size={24} />;
      case 'WORD': return <FileText className="text-blue-600" size={24} />;
      case 'LINK': return <ExternalLink className="text-purple-600" size={24} />;
      default: return <FileBox className="text-gray-400" size={24} />;
    }
  };

  return (
    <main className="pt-24 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <header className="mb-20">
          <h1 className="text-6xl font-bold tracking-tight mb-4">{config.pages?.downloads?.title || "Ferramentas e Materiais"}</h1>
          <p className="text-2xl text-gray-500 font-medium max-w-2xl">
            {config.pages?.downloads?.subtitle || "Simuladores, e-books, ferramentas interativas e guias práticos desenvolvidos para apoiar seu crescimento."}
          </p>
        </header>

        {loading ? (
          <div className="py-20 text-center text-gray-400 font-medium">Carregando materiais...</div>
        ) : (
          <div className="space-y-16">
            {categories.map(cat => (
              <section key={cat}>
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  {cat} <span className="h-[1px] flex-1 bg-gray-100"></span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resources.filter(r => r.category === cat).map(resource => (
                    <div key={resource.id} className="p-6 bg-[#f5f5f7] rounded-[32px] group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
                      <div className="flex items-start justify-between mb-8">
                        <div className="p-4 bg-white rounded-2xl shadow-sm">
                          {getFileIcon(resource.type)}
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{resource.size}</span>
                      </div>
                      <h4 className="text-xl font-bold mb-2 pr-10">{resource.name}</h4>
                      <p className="text-sm text-gray-500 mb-6 font-medium">Formato: {resource.type}</p>
                      <a href={`#/lp/${resource.id}`} className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline">
                        {resource.type === 'LINK' ? <ExternalLink size={18} /> : <Download size={18} />} 
                        {resource.type === 'LINK' ? 'Acessar ferramenta' : 'Baixar agora'}
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default DownloadsPage;
