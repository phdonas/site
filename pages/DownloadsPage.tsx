
import React from 'react';
import { MOCK_RESOURCES } from '../constants';
import { Download, FileText, FileSpreadsheet, FileBox } from 'lucide-react';

const DownloadsPage: React.FC = () => {
  const categories = Array.from(new Set(MOCK_RESOURCES.map(r => r.category)));

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'EXCEL': return <FileSpreadsheet className="text-green-600" size={24} />;
      case 'PDF': return <FileText className="text-red-500" size={24} />;
      case 'WORD': return <FileText className="text-blue-600" size={24} />;
      default: return <FileBox className="text-gray-400" size={24} />;
    }
  };

  return (
    <main className="pt-24 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <header className="mb-20">
          <h1 className="text-6xl font-bold tracking-tight mb-4">Materiais Auxiliares</h1>
          <p className="text-2xl text-gray-500 font-medium max-w-2xl">
            Simuladores, e-books e guias práticos desenvolvidos para apoiar seu crescimento.
          </p>
        </header>

        <div className="space-y-16">
          {categories.map(cat => (
            <section key={cat}>
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                {cat} <span className="h-[1px] flex-1 bg-gray-100"></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_RESOURCES.filter(r => r.category === cat).map(resource => (
                  <div key={resource.id} className="p-6 bg-[#f5f5f7] rounded-[32px] group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
                    <div className="flex items-start justify-between mb-8">
                      <div className="p-4 bg-white rounded-2xl shadow-sm">
                        {getFileIcon(resource.type)}
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{resource.size}</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2 pr-10">{resource.name}</h4>
                    <p className="text-sm text-gray-500 mb-6 font-medium">Formato: {resource.type}</p>
                    <button className="flex items-center gap-2 text-blue-600 font-bold hover:underline">
                      <Download size={18} /> Baixar agora
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
};

export default DownloadsPage;
