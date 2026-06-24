import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { SupabaseService } from '../../services/supabaseService';
import { Plus, Edit2, Trash2, Save, X, RefreshCw, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { aS } from './adminStyles';
import { ImageUploadField } from './ImageUploadField';

function validateSlug(slug: string): string | null {
  if (!slug) return 'Slug é obrigatório.';
  if (!/^[a-z0-9-]+$/.test(slug)) return 'Slug: apenas letras minúsculas, números e hífens.';
  return null;
}

const CTA_TIPOS = ['hotmart', 'whatsapp', 'formulario_interno', 'entrega_material'];

export const LandingPagesManager: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [recursosList, setRecursosList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);

  useEffect(() => { 
    fetch(); 
    SupabaseService.getRecursos().then(res => setRecursosList(res));
  }, []);

  const fetch = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'landing_pages'));
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const startNew = () => {
    setIsNew(true);
    setSlugError(null);
    setEditing({
      id: '',
      slug: '',
      titulo: '',
      subtitulo: '',
      descricao: '',
      cta_texto: '',
      cta_link: '',
      cta_tipo: 'hotmart',
      recurso_id: '',
      recurso_url_entrega: '',
      imagem_url: '',
      cor_destaque: '#8f6e4a',
      publicada: false,
      data_expiracao: '',
      meta_title: '',
      meta_description: '',
      acessos: 0,
    });
  };

  const handleSave = async () => {
    if (!editing) return;
    const err = validateSlug(editing.slug);
    if (err) { setSlugError(err); return; }

    // Check slug uniqueness on new
    if (isNew) {
      const existing = items.find(i => i.slug === editing.slug);
      if (existing) { setSlugError('Este slug já está em uso.'); return; }
    }

    setLoading(true);
    try {
      const id = editing.slug;
      await setDoc(doc(db, 'landing_pages', id), { ...editing, id });
      setEditing(null);
      setIsNew(false);
      await fetch();
    } catch { alert('Erro ao salvar.'); }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir esta landing page?')) return;
    setLoading(true);
    try { await deleteDoc(doc(db, 'landing_pages', id)); await fetch(); } catch { alert('Erro ao excluir.'); }
    setLoading(false);
  };

  const togglePublicada = async (item: any) => {
    try {
      await updateDoc(doc(db, 'landing_pages', item.id), { publicada: !item.publicada });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, publicada: !i.publicada } : i));
    } catch { alert('Erro.'); }
  };

  const f = (field: string, val: any) => {
    if (field === 'slug') setSlugError(null);
    setEditing((prev: any) => ({ ...prev, [field]: val }));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.6rem', marginBottom: '1.2rem' }}>
        <button style={aS.btnGhost} onClick={fetch}><RefreshCw size={13} className={loading ? 'animate-spin' : ''} /></button>
        {!editing && <button style={aS.btnPrimary} onClick={startNew}><Plus size={13} /> Nova Landing Page</button>}
      </div>

      {/* Form */}
      {editing && (
        <div style={{ background: 'var(--cream)', border: '1px solid var(--gold)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' }}>
              {isNew ? 'Nova Landing Page' : `Editando: /${editing.slug}`}
            </span>
            <button style={aS.btnGhost} onClick={() => { setEditing(null); setIsNew(false); }}><X size={14} /></button>
          </div>

          {/* Slug */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={aS.label}>Slug (identificador único na URL)</label>
            <input
              style={{ ...aS.input, borderColor: slugError ? '#c0392b' : undefined }}
              value={editing.slug}
              onChange={e => f('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="mentoria-janeiro-2026"
              disabled={!isNew}
            />
            {slugError && <p style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.06em', color: '#c0392b', marginTop: '.3rem' }}>{slugError}</p>}
            {!slugError && editing.slug && (
              <p style={{ fontFamily: 'var(--fm)', fontSize: '.44rem', letterSpacing: '.06em', color: 'var(--ink-3)', marginTop: '.25rem' }}>
                URL: phdonassolo.com/#/lp/{editing.slug}
              </p>
            )}
          </div>

          <div style={{ ...aS.grid2, marginBottom: '1rem' }}>
            <div>
              <label style={aS.label}>Título principal</label>
              <input style={aS.input} value={editing.titulo} onChange={e => f('titulo', e.target.value)} />
            </div>
            <div>
              <label style={aS.label}>Subtítulo (opcional)</label>
              <input style={aS.input} value={editing.subtitulo} onChange={e => f('subtitulo', e.target.value)} />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={aS.label}>Descrição</label>
            <textarea style={aS.textarea} rows={3} value={editing.descricao} onChange={e => f('descricao', e.target.value)} />
          </div>

          <div style={{ ...aS.grid3, marginBottom: '1rem' }}>
            <div>
              <label style={aS.label}>CTA — tipo</label>
              <select style={aS.select} value={editing.cta_tipo} onChange={e => f('cta_tipo', e.target.value)}>
                {CTA_TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={aS.label}>CTA — texto do botão</label>
              <input style={aS.input} value={editing.cta_texto} onChange={e => f('cta_texto', e.target.value)} placeholder="Quero participar" />
            </div>
            <div>
              <label style={aS.label}>CTA — link</label>
              <input style={aS.input} value={editing.cta_link} onChange={e => f('cta_link', e.target.value)} placeholder="https://..." disabled={editing.cta_tipo === 'entrega_material'} />
            </div>
          </div>

          {editing.cta_tipo === 'entrega_material' && (
            <div style={{ background: 'rgba(30,58,138,.06)', border: '1px solid rgba(30,58,138,.18)', padding: '1.2rem', marginBottom: '1rem' }}>
              <label style={aS.label}>Material a entregar (Supabase/LMS)</label>
              <select 
                style={{ ...aS.select, marginBottom: '.8rem' }}
                value={editing.recurso_id || ''}
                onChange={e => {
                  const sel = recursosList.find(r => r.id === e.target.value);
                  setEditing((prev: any) => ({ ...prev, recurso_id: sel?.id || '', recurso_url_entrega: sel?.url_entrega || '' }));
                }}
              >
                <option value="">-- Selecione o material --</option>
                {recursosList.map(r => (
                  <option key={r.id} value={r.id}>{r.titulo} {r.tipo ? `(${r.tipo})` : ''}</option>
                ))}
              </select>
              <p style={{ fontFamily: 'var(--fb)', fontSize: '.75rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>
                ℹ️ Estes materiais vêm do LMS (tabela <strong>recursos</strong>). Para criar novos ou editar os PDFs/Links, 
                acesse o painel do LMS em <strong>/admin/recursos</strong>. Aqui você apenas escolhe qual deles será entregue por esta Landing Page.
              </p>
            </div>
          )}

          <div style={{ ...aS.grid2, marginBottom: '1rem' }}>
            <div>
              <label style={aS.label}>Imagem</label>
              <ImageUploadField
                value={editing.imagem_url || ''}
                onChange={url => f('imagem_url', url)}
                specHint="Recomendado: 1200×630px · JPG · Máx 300kb"
                storageFolder={`lps/${editing.slug || 'novo'}`}
                maxSizeKb={300}
              />
            </div>
            <div>
              <label style={aS.label}>Cor de destaque (hex)</label>
              <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                <input
                  type="color"
                  value={editing.cor_destaque || '#8f6e4a'}
                  onChange={e => f('cor_destaque', e.target.value)}
                  style={{ width: 40, height: 38, border: '1px solid var(--rule)', cursor: 'pointer', padding: 2 }}
                />
                <input style={{ ...aS.input, flex: 1 }} value={editing.cor_destaque} onChange={e => f('cor_destaque', e.target.value)} placeholder="#8f6e4a" />
              </div>
            </div>
            <div>
              <label style={aS.label}>Data de expiração (opcional)</label>
              <input style={aS.input} type="date" value={editing.data_expiracao || ''} onChange={e => f('data_expiracao', e.target.value)} />
            </div>
          </div>

          <div style={{ background: 'var(--cream-d)', border: '1px solid var(--rule)', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ ...aS.eyebrow, marginBottom: '.8rem' }}>SEO</div>
            <div style={{ ...aS.grid2 }}>
              <div>
                <label style={aS.label}>Meta title</label>
                <input style={aS.input} value={editing.meta_title} onChange={e => f('meta_title', e.target.value)} />
              </div>
              <div>
                <label style={aS.label}>Meta description</label>
                <input style={aS.input} value={editing.meta_description} onChange={e => f('meta_description', e.target.value)} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button type="button" style={editing.publicada ? aS.toggleActive : aS.toggleInactive} onClick={() => f('publicada', !editing.publicada)}>
              {editing.publicada ? <Eye size={11} /> : <EyeOff size={11} />} {editing.publicada ? 'Publicada' : 'Rascunho'}
            </button>
            <div style={{ display: 'flex', gap: '.6rem' }}>
              <button style={aS.btnSecondary} onClick={() => { setEditing(null); setIsNew(false); }}>Cancelar</button>
              <button style={aS.btnPrimary} onClick={handleSave}><Save size={13} /> Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Slug', 'Título', 'Publicada', 'Expiração', 'Acessos', ''].map(h => (
                <th key={h} style={aS.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const expired = item.data_expiracao && new Date(item.data_expiracao) < new Date();
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--rule)' }}>
                  <td style={aS.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                      <span style={{ fontFamily: 'var(--fm)', fontSize: '.52rem', letterSpacing: '.08em', color: 'var(--gold)' }}>{item.slug}</span>
                      <a href={`#/lp/${item.slug}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={11} style={{ color: 'var(--ink-3)' }} />
                      </a>
                    </div>
                  </td>
                  <td style={aS.td}>{item.titulo}</td>
                  <td style={aS.td}>
                    <button style={item.publicada ? aS.toggleActive : aS.toggleInactive} onClick={() => togglePublicada(item)}>
                      {item.publicada ? <Eye size={10} /> : <EyeOff size={10} />} {item.publicada ? 'Sim' : 'Não'}
                    </button>
                  </td>
                  <td style={aS.td}>
                    {item.data_expiracao ? (
                      <span style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.06em', color: expired ? '#c0392b' : 'var(--ink-3)' }}>
                        {item.data_expiracao} {expired ? '(expirada)' : ''}
                      </span>
                    ) : '—'}
                  </td>
                  <td style={{ ...aS.td, fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700 }}>
                    {item.acessos || 0}
                  </td>
                  <td style={aS.td}>
                    <div style={{ display: 'flex', gap: '.4rem', justifyContent: 'flex-end' }}>
                      <button style={aS.btnGhost} onClick={() => { setEditing(item); setIsNew(false); }}><Edit2 size={13} /></button>
                      <button style={{ ...aS.btnGhost, color: '#c0392b' }} onClick={() => handleDelete(item.id)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && !loading && (
              <tr><td colSpan={6} style={{ ...aS.td, textAlign: 'center', color: 'var(--ink-3)', padding: '2rem' }}>Nenhuma landing page criada ainda.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
