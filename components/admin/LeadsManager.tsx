import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Trash2, Users, Download, RefreshCw, Search, Filter } from 'lucide-react';

export const LeadsManager: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMaterial, setFilterMaterial] = useState('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(l => {
    const matchesSearch = !searchTerm || 
      l.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.whatsapp?.includes(searchTerm);
    const mId = l.materialTitle || l.materialId;
    const matchesMaterial = filterMaterial === 'all' || mId === filterMaterial;
    return matchesSearch && matchesMaterial;
  }).sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
  });

  const uniqueMaterials = Array.from(new Set(leads.map(l => l.materialTitle || l.materialId).filter(Boolean)));

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja apagar este lead?')) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'leads', id));
      await fetchLeads();
    } catch (e) {
      alert('Erro ao deletar lead.');
    }
    setLoading(false);
  };

  const exportCSV = () => {
    if (filteredLeads.length === 0) return alert('Nenhum lead para exportar.');
    
    const headers = ['Nome', 'Email', 'WhatsApp', 'Origem', 'Material Baixado', 'Data'];
    const rows = filteredLeads.map(l => {
      const dataStr = l.createdAt ? new Date(l.createdAt.seconds * 1000).toLocaleString('pt-BR') : 'N/A';
      return [
        `"${l.nome || ''}"`, 
        `"${l.email || ''}"`, 
        `"${l.whatsapp || ''}"`, 
        `"${l.origem || ''}"`, 
        `"${l.materialTitle || l.materialId || ''}"`, 
        `"${dataStr}"`
      ].join(',');
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-[32px] p-8 md:p-10 card-shadow border border-gray-100 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Leads</h2>
          <p className="text-gray-500 text-sm">Contatos capturados através dos materiais e ferramentas gratuitos.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchLeads} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={exportCSV} className="bg-green-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center gap-2">
            <Download size={18} /> Exportar CSV
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome, email ou WhatsApp..." 
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-medium text-sm transition-all" 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>
        <select 
          className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-medium text-sm bg-white" 
          value={filterMaterial} 
          onChange={e => setFilterMaterial(e.target.value)}
        >
          <option value="all">Todos os Materiais</option>
          {uniqueMaterials.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select 
          className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-medium text-sm bg-white" 
          value={sortOrder} 
          onChange={e => setSortOrder(e.target.value as any)}
        >
          <option value="newest">Mais recentes primeiro</option>
          <option value="oldest">Mais antigos primeiro</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Contato</th>
              <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Material Baixado</th>
              <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Data / Origem</th>
              <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map(lead => {
              const dataStr = lead.createdAt ? new Date(lead.createdAt.seconds * 1000).toLocaleString('pt-BR') : 'N/A';
              return (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{lead.nome}</div>
                    <div className="text-sm text-gray-500 flex flex-col gap-0.5 mt-1">
                      <span className="text-blue-600">{lead.email}</span>
                      <span>{lead.whatsapp}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                      {lead.materialTitle || lead.materialId}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-900">{dataStr}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mt-1 font-bold">Origem: {lead.origem}</div>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(lead.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {leads.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">Nenhum lead capturado ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
