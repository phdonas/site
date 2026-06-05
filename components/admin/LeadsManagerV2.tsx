import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Trash2, Download, RefreshCw, Search, Users } from 'lucide-react';
import { aS } from './adminStyles';

type LeadTipo = 'todos' | 'contato' | 'newsletter' | 'pre_lancamento_lms' | 'ferramenta';

const TIPO_LABELS: Record<string, string> = {
  contato: 'Contato',
  newsletter: 'Newsletter',
  pre_lancamento_lms: 'Pré-lançamento LMS',
  ferramenta: 'Ferramenta',
};

const TIPO_COLORS: Record<string, string> = {
  contato: 'var(--navy)',
  newsletter: 'var(--gold)',
  pre_lancamento_lms: '#7c4dff',
  ferramenta: '#00897b',
};

export const LeadsManagerV2: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<LeadTipo>('todos');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setLeads(snap.docs.map(d => ({ id: d.id, ...(d.data() as object) })));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const filtered = leads.filter(l => {
    const matchSearch = !searchTerm ||
      l.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = filterTipo === 'todos' || l.tipo === filterTipo;
    return matchSearch && matchTipo;
  }).sort((a, b) => {
    const tA = a.createdAt?.seconds ?? 0;
    const tB = b.createdAt?.seconds ?? 0;
    return sortOrder === 'newest' ? tB - tA : tA - tB;
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir este lead?')) return;
    setLoading(true);
    try { await deleteDoc(doc(db, 'leads', id)); await fetchLeads(); } catch { alert('Erro ao excluir.'); }
    setLoading(false);
  };

  const exportCSV = () => {
    if (filtered.length === 0) return alert('Nenhum lead para exportar.');
    const headers = ['Data', 'Nome', 'Email', 'Tipo', 'Ferramenta', 'Origem'];
    const rows = filtered.map(l => {
      const data = l.createdAt ? new Date(l.createdAt.seconds * 1000).toLocaleString('pt-BR') : 'N/A';
      return [
        `"${data}"`,
        `"${l.nome || ''}"`,
        `"${l.email || ''}"`,
        `"${l.tipo || ''}"`,
        `"${l.ferramenta || ''}"`,
        `"${l.origem || ''}"`,
      ].join(',');
    });
    const csv = 'data:text/csv;charset=utf-8,' + encodeURIComponent([headers.join(','), ...rows].join('\n'));
    const a = document.createElement('a');
    a.href = csv;
    a.download = `leads_${filterTipo}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Count by tipo
  const counts = leads.reduce((acc: any, l) => {
    acc[l.tipo || 'outro'] = (acc[l.tipo || 'outro'] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { tipo: 'contato', label: 'Contato' },
          { tipo: 'newsletter', label: 'Newsletter' },
          { tipo: 'pre_lancamento_lms', label: 'Pré-LMS' },
          { tipo: 'ferramenta', label: 'Ferramenta' },
        ].map(({ tipo, label }) => (
          <div
            key={tipo}
            style={{
              background: 'var(--cream)',
              border: `1px solid ${filterTipo === tipo ? 'var(--gold)' : 'var(--rule)'}`,
              padding: '1rem',
              cursor: 'pointer',
              transition: 'border-color .2s',
            }}
            onClick={() => setFilterTipo(filterTipo === tipo ? 'todos' : tipo as LeadTipo)}
          >
            <div style={{ fontFamily: 'var(--fm)', fontSize: '.44rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '.4rem' }}>{label}</div>
            <div style={{ fontFamily: 'var(--fd)', fontSize: '1.8rem', fontWeight: 700, color: filterTipo === tipo ? 'var(--gold)' : 'var(--ink)', lineHeight: 1 }}>
              {counts[tipo] || 0}
            </div>
          </div>
        ))}
      </div>

      {/* Filters row */}
      <div style={{ display: 'flex', gap: '.8rem', marginBottom: '1.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={13} style={{ position: 'absolute', left: '.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }} />
          <input
            style={{ ...aS.input, paddingLeft: '2.2rem' }}
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          style={{ ...aS.select, width: 180 }}
          value={filterTipo}
          onChange={e => setFilterTipo(e.target.value as LeadTipo)}
        >
          <option value="todos">Todos os tipos</option>
          <option value="contato">Contato</option>
          <option value="newsletter">Newsletter</option>
          <option value="pre_lancamento_lms">Pré-lançamento LMS</option>
          <option value="ferramenta">Ferramenta</option>
        </select>
        <select
          style={{ ...aS.select, width: 200 }}
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value as any)}
        >
          <option value="newest">Mais recentes primeiro</option>
          <option value="oldest">Mais antigos primeiro</option>
        </select>
        <button style={aS.btnGhost} onClick={fetchLeads}><RefreshCw size={13} className={loading ? 'animate-spin' : ''} /></button>
        <button style={aS.btnPrimary} onClick={exportCSV}><Download size={13} /> Exportar CSV</button>
      </div>

      {/* Count */}
      <div style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '1rem' }}>
        {filtered.length} {filtered.length === 1 ? 'lead' : 'leads'} {filterTipo !== 'todos' ? `· filtrado por ${TIPO_LABELS[filterTipo] || filterTipo}` : 'no total'}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Data', 'Nome', 'Email', 'Tipo', 'Ferramenta', 'Origem', ''].map(h => (
                <th key={h} style={aS.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(lead => {
              const dataStr = lead.createdAt
                ? new Date(lead.createdAt.seconds * 1000).toLocaleDateString('pt-BR')
                : '—';
              const tipoColor = TIPO_COLORS[lead.tipo] || 'var(--ink-3)';
              return (
                <tr key={lead.id} style={{ borderBottom: '1px solid var(--rule)' }}>
                  <td style={{ ...aS.td, fontFamily: 'var(--fm)', fontSize: '.52rem', letterSpacing: '.06em', color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>{dataStr}</td>
                  <td style={{ ...aS.td, fontWeight: 600 }}>{lead.nome || '—'}</td>
                  <td style={{ ...aS.td, color: 'var(--ink-2)' }}>{lead.email || '—'}</td>
                  <td style={aS.td}>
                    {lead.tipo && (
                      <span style={{
                        fontFamily: 'var(--fm)', fontSize: '.44rem', letterSpacing: '.08em', textTransform: 'uppercase',
                        background: `${tipoColor}18`, color: tipoColor, border: `1px solid ${tipoColor}40`,
                        padding: '.2rem .6rem', whiteSpace: 'nowrap',
                      }}>
                        {TIPO_LABELS[lead.tipo] || lead.tipo}
                      </span>
                    )}
                  </td>
                  <td style={{ ...aS.td, color: 'var(--ink-3)' }}>{lead.ferramenta || '—'}</td>
                  <td style={{ ...aS.td, color: 'var(--ink-3)' }}>{lead.origem || '—'}</td>
                  <td style={aS.td}>
                    <button
                      style={{ ...aS.btnGhost, color: '#c0392b', padding: '.3rem' }}
                      onClick={() => handleDelete(lead.id)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && !loading && (
              <tr>
                <td colSpan={7} style={{ ...aS.td, textAlign: 'center', color: 'var(--ink-3)', padding: '2.5rem' }}>
                  <Users size={28} style={{ opacity: .3, display: 'block', margin: '0 auto .6rem' }} />
                  Nenhum lead {filterTipo !== 'todos' ? `do tipo "${TIPO_LABELS[filterTipo] || filterTipo}"` : ''} encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
