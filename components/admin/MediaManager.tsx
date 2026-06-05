import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import {
  Edit2, Trash2, Plus, Save, X, RefreshCw, FileText, Video, Clock,
  ChevronUp, ChevronDown, Eye, EyeOff, Star,
} from 'lucide-react';
import { aS } from './adminStyles';
import { ImageUploadField } from './ImageUploadField';
import { invalidateArticlesCache } from '../../services/dataService';

type MediaTab = 'artigos' | 'videos' | 'timeline';

// Temas and pilares match exactly what ConteudoPage filters expect
const TEMAS = ['Gestão Comercial', 'Vendas', 'Liderança', 'Negociação', 'Carreira'];
const PILARES = ['Prof. Paulo', 'Academia do Gás', 'Sou Consultor Imobiliário', '4050 ou Mais'];
const CTA_TIPOS = ['mentoria', 'consultoria', 'cursos', 'conteudo', 'nenhum'];

const PILAR_TO_ID: Record<string, string> = {
  'Prof. Paulo': 'prof-paulo',
  'Academia do Gás': 'academia-do-gas',
  '4050 ou Mais': '4050oumais',
  'Sou Consultor Imobiliário': 'consultoria-imobiliaria',
};
const PILAR_FROM_ID: Record<string, string> = {
  'prof-paulo': 'Prof. Paulo',
  'academia-do-gas': 'Academia do Gás',
  '4050oumais': '4050 ou Mais',
  'consultoria-imobiliaria': 'Sou Consultor Imobiliário',
};

// Normalize any article document to the edit form schema
const normalizeToEdit = (item: any) => ({
  id: item.id,
  titulo: item.titulo || item.title || '',
  slug: item.slug || '',
  subtitulo: item.subtitulo || item.excerpt || '',
  conteudo: item.conteudo || item.content || '',
  thumbnail_url: item.thumbnail_url || item.coverImage || item.imageUrl || '',
  thumbnail_alt: item.thumbnail_alt || item.imageAlt || '',
  tipo: item.tipo || 'artigo',
  tema: item.tema || item.category?.split(',')[0]?.trim() || 'Gestão Comercial',
  pilar: item.pilar || (item.pillarIds?.[0] ? PILAR_FROM_ID[item.pillarIds[0]] : 'Prof. Paulo'),
  data_publicacao: (item.data_publicacao || item.date || new Date().toISOString()).split('T')[0],
  publicado: item.publicado ?? (item.publishDate !== undefined ? new Date(item.publishDate) <= new Date() : true),
  destaque: item.destaque ?? false,
  cta_tipo: item.cta_tipo || 'nenhum',
  ordem: item.ordem ?? 0,
});

// Save with both old (Article) and new (artigo) field names for universal compatibility
const normalizeToSave = (editing: any) => ({
  ...editing,
  // CMS fields
  titulo: editing.titulo,
  tema: editing.tema,
  pilar: editing.pilar,
  thumbnail_url: editing.thumbnail_url,
  data_publicacao: editing.data_publicacao,
  // Legacy Article fields (needed by public pages)
  title: editing.titulo,
  category: editing.tema,
  excerpt: editing.subtitulo,
  content: editing.conteudo,
  imageUrl: editing.thumbnail_url,
  coverImage: editing.thumbnail_url,
  date: editing.data_publicacao,
  publishDate: editing.publicado ? editing.data_publicacao : '',
  pillarIds: [PILAR_TO_ID[editing.pilar] || 'prof-paulo'],
});

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// --- Artigos ---

const ArtigosManager: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { doFetch(); }, []);

  const doFetch = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'articles'));
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      all.sort((a: any, b: any) =>
        new Date(b.date || b.data_publicacao || 0).getTime() -
        new Date(a.date || a.data_publicacao || 0).getTime()
      );
      setItems(all);
    } catch (e) { console.error('Erro ao carregar artigos:', e); }
    setLoading(false);
  };

  const startNew = () => {
    setIsNew(true);
    setEditing(normalizeToEdit({
      id: `artigo_${Date.now()}`,
      publicado: false,
      destaque: false,
    }));
  };

  const handleSave = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      invalidateArticlesCache();
      await setDoc(doc(db, 'articles', editing.id), normalizeToSave(editing));
      setEditing(null);
      setIsNew(false);
      await doFetch();
    } catch (e) { alert('Erro ao salvar artigo.'); }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir este artigo?')) return;
    setLoading(true);
    try { await deleteDoc(doc(db, 'articles', id)); await doFetch(); } catch (e) { alert('Erro ao excluir.'); }
    setLoading(false);
  };

  const toggleField = async (item: any, field: string) => {
    const newVal = !item[field];
    try {
      await updateDoc(doc(db, 'articles', item.id), { [field]: newVal });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, [field]: newVal } : i));
    } catch (e) { alert('Erro ao atualizar.'); }
  };

  const filtered = items.filter(i => {
    if (!search) return true;
    const title = (i.titulo || i.title || '').toLowerCase();
    return title.includes(search.toLowerCase());
  });

  const f = (field: string, val: any) => setEditing((prev: any) => {
    const next = { ...prev, [field]: val };
    if (field === 'titulo' && isNew) next.slug = slugify(val);
    return next;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <input
          style={{ ...aS.input, width: 280 }}
          placeholder="Buscar por título..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '.6rem' }}>
          <button style={aS.btnGhost} onClick={fetch}><RefreshCw size={13} className={loading ? 'animate-spin' : ''} /></button>
          {!editing && (
            <button style={aS.btnPrimary} onClick={startNew}><Plus size={13} /> Novo Artigo</button>
          )}
        </div>
      </div>

      {/* Form */}
      {editing && (
        <div style={{ background: 'var(--cream)', border: '1px solid var(--gold)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' }}>
              {isNew ? 'Novo Artigo' : 'Editando Artigo'}
            </span>
            <button style={aS.btnGhost} onClick={() => { setEditing(null); setIsNew(false); }}><X size={14} /></button>
          </div>
          <div style={{ ...aS.grid2, marginBottom: '.8rem' }}>
            <div>
              <label style={aS.label}>Título</label>
              <input style={aS.input} value={editing.titulo || ''} onChange={e => f('titulo', e.target.value)} />
            </div>
            <div>
              <label style={aS.label}>Slug</label>
              <input style={aS.input} value={editing.slug || ''} onChange={e => f('slug', e.target.value)} placeholder="gerado do título" />
            </div>
            <div>
              <label style={aS.label}>Subtítulo (opcional)</label>
              <input style={aS.input} value={editing.subtitulo || ''} onChange={e => f('subtitulo', e.target.value)} />
            </div>
            <div>
              <label style={aS.label}>Data de publicação</label>
              <input style={aS.input} type="date" value={editing.data_publicacao?.split('T')[0] || ''} onChange={e => f('data_publicacao', e.target.value)} />
            </div>
            <div>
              <label style={aS.label}>Tema</label>
              <select style={aS.select} value={editing.tema || 'Vendas'} onChange={e => f('tema', e.target.value)}>
                {TEMAS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={aS.label}>Pilar</label>
              <select style={aS.select} value={editing.pilar || 'Prof. Paulo'} onChange={e => f('pilar', e.target.value)}>
                {PILARES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={aS.label}>CTA no rodapé do artigo</label>
              <select style={aS.select} value={editing.cta_tipo || 'nenhum'} onChange={e => f('cta_tipo', e.target.value)}>
                {CTA_TIPOS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', justifyContent: 'flex-end' }}>
              <label style={{ ...aS.label, marginBottom: '.2rem' }}>Flags</label>
              <div style={{ display: 'flex', gap: '.5rem' }}>
                <button
                  type="button"
                  style={editing.publicado ? aS.toggleActive : aS.toggleInactive}
                  onClick={() => f('publicado', !editing.publicado)}
                >
                  {editing.publicado ? <Eye size={11} /> : <EyeOff size={11} />}
                  Publicado
                </button>
                <button
                  type="button"
                  style={editing.destaque ? aS.toggleActive : aS.toggleInactive}
                  onClick={() => f('destaque', !editing.destaque)}
                >
                  <Star size={11} /> Destaque
                </button>
              </div>
            </div>
          </div>
          <div style={{ marginBottom: '.8rem' }}>
            <label style={aS.label}>Thumbnail</label>
            <ImageUploadField
              value={editing.thumbnail_url || ''}
              onChange={url => f('thumbnail_url', url)}
              specHint="Recomendado: 1200×630px · Proporção 1.91:1 · JPG · Máx 200kb"
              storageFolder="artigos/thumbnails"
              maxSizeKb={200}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={aS.label}>Thumbnail — alt</label>
            <input style={aS.input} value={editing.thumbnail_alt || ''} onChange={e => f('thumbnail_alt', e.target.value)} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={aS.label}>Conteúdo</label>
            <textarea style={{ ...aS.textarea, minHeight: 200 }} value={editing.conteudo || ''} onChange={e => f('conteudo', e.target.value)} placeholder="Conteúdo do artigo..." />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.6rem' }}>
            <button style={aS.btnSecondary} onClick={() => { setEditing(null); setIsNew(false); }}>Cancelar</button>
            <button style={aS.btnPrimary} onClick={handleSave}><Save size={13} /> Salvar Artigo</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Título', 'Tema', 'Pilar', 'Data', 'Publicado', 'Destaque', ''].map(h => (
                <th key={h} style={aS.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--rule)' }}>
                <td style={aS.td}>
                  <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{item.titulo || item.title || '(sem título)'}</div>
                  {item.slug && <div style={{ fontFamily: 'var(--fm)', fontSize: '.44rem', letterSpacing: '.06em', color: 'var(--ink-3)', marginTop: '.2rem' }}>{item.slug}</div>}
                </td>
                <td style={aS.td}>{item.tema || item.category || '—'}</td>
                <td style={aS.td}>{item.pilar || (item.pillarIds?.[0] ? PILAR_FROM_ID[item.pillarIds[0]] : '—')}</td>
                <td style={aS.td}>{(item.data_publicacao || item.date || '').split('T')[0] || '—'}</td>
                <td style={aS.td}>
                  {(() => {
                    const pub = item.publicado ?? (item.publishDate ? new Date(item.publishDate) <= new Date() : true);
                    return (
                      <button style={pub ? aS.toggleActive : aS.toggleInactive} onClick={() => toggleField(item, 'publicado')}>
                        {pub ? <Eye size={10} /> : <EyeOff size={10} />}
                        {pub ? 'Sim' : 'Não'}
                      </button>
                    );
                  })()}
                </td>
                <td style={aS.td}>
                  <button style={item.destaque ? aS.toggleActive : aS.toggleInactive} onClick={() => toggleField(item, 'destaque')}>
                    <Star size={10} /> {item.destaque ? 'Sim' : 'Não'}
                  </button>
                </td>
                <td style={aS.td}>
                  <div style={{ display: 'flex', gap: '.4rem', justifyContent: 'flex-end' }}>
                    <button style={aS.btnGhost} onClick={() => { setEditing(normalizeToEdit(item)); setIsNew(false); }}><Edit2 size={13} /></button>
                    <button style={{ ...aS.btnGhost, color: '#c0392b' }} onClick={() => handleDelete(item.id)}><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr><td colSpan={7} style={{ ...aS.td, textAlign: 'center', color: 'var(--ink-3)', padding: '2rem' }}>Nenhum artigo encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Vídeos ---

const VideosManager: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'videos'));
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const startNew = () => {
    setIsNew(true);
    setEditing({
      id: `video_${Date.now()}`,
      titulo: '',
      descricao: '',
      url_embed: '',
      thumbnail_url: '',
      tema: 'Vendas',
      pilar: 'Prof. Paulo',
      data_publicacao: new Date().toISOString().split('T')[0],
      publicado: false,
    });
  };

  const handleSave = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'videos', editing.id), editing);
      setEditing(null);
      setIsNew(false);
      await fetch();
    } catch { alert('Erro ao salvar.'); }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir este vídeo?')) return;
    setLoading(true);
    try { await deleteDoc(doc(db, 'videos', id)); await fetch(); } catch { alert('Erro ao excluir.'); }
    setLoading(false);
  };

  const togglePublicado = async (item: any) => {
    try {
      await updateDoc(doc(db, 'videos', item.id), { publicado: !item.publicado });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, publicado: !i.publicado } : i));
    } catch { alert('Erro.'); }
  };

  const f = (field: string, val: any) => setEditing((prev: any) => ({ ...prev, [field]: val }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.6rem', marginBottom: '1.2rem' }}>
        <button style={aS.btnGhost} onClick={fetch}><RefreshCw size={13} className={loading ? 'animate-spin' : ''} /></button>
        {!editing && <button style={aS.btnPrimary} onClick={startNew}><Plus size={13} /> Novo Vídeo</button>}
      </div>

      {editing && (
        <div style={{ background: 'var(--cream)', border: '1px solid var(--gold)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' }}>
              {isNew ? 'Novo Vídeo' : 'Editando Vídeo'}
            </span>
            <button style={aS.btnGhost} onClick={() => { setEditing(null); setIsNew(false); }}><X size={14} /></button>
          </div>
          <div style={{ ...aS.grid2, marginBottom: '.8rem' }}>
            <div>
              <label style={aS.label}>Título</label>
              <input style={aS.input} value={editing.titulo} onChange={e => f('titulo', e.target.value)} />
            </div>
            <div>
              <label style={aS.label}>Data de publicação</label>
              <input style={aS.input} type="date" value={editing.data_publicacao?.split('T')[0] || ''} onChange={e => f('data_publicacao', e.target.value)} />
            </div>
            <div>
              <label style={aS.label}>Tema</label>
              <select style={aS.select} value={editing.tema} onChange={e => f('tema', e.target.value)}>
                {TEMAS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={aS.label}>Pilar</label>
              <select style={aS.select} value={editing.pilar} onChange={e => f('pilar', e.target.value)}>
                {PILARES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '.8rem' }}>
            <label style={aS.label}>URL do vídeo (YouTube/Instagram embed)</label>
            <input style={aS.input} value={editing.url_embed} onChange={e => f('url_embed', e.target.value)} placeholder="https://youtube.com/watch?v=..." />
          </div>
          <div style={{ marginBottom: '.8rem' }}>
            <label style={aS.label}>Thumbnail (opcional — se vazio, usa thumb do YouTube)</label>
            <ImageUploadField
              value={editing.thumbnail_url || ''}
              onChange={url => f('thumbnail_url', url)}
              specHint="Recomendado: 1280×720px · Proporção 16:9 · JPG · Máx 150kb"
              storageFolder="videos/thumbnails"
              maxSizeKb={150}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={aS.label}>Descrição</label>
            <textarea style={aS.textarea} rows={2} value={editing.descricao} onChange={e => f('descricao', e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              type="button"
              style={editing.publicado ? aS.toggleActive : aS.toggleInactive}
              onClick={() => f('publicado', !editing.publicado)}
            >
              {editing.publicado ? <Eye size={11} /> : <EyeOff size={11} />} Publicado
            </button>
            <div style={{ display: 'flex', gap: '.6rem' }}>
              <button style={aS.btnSecondary} onClick={() => { setEditing(null); setIsNew(false); }}>Cancelar</button>
              <button style={aS.btnPrimary} onClick={handleSave}><Save size={13} /> Salvar</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '.8rem' }}>
        {items.map(item => (
          <div key={item.id} style={{ background: 'var(--cream)', border: '1px solid var(--rule)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {item.thumbnail_url && (
              <img src={item.thumbnail_url} alt="" style={{ width: 80, height: 45, objectFit: 'cover', flexShrink: 0 }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--fb)', fontSize: '.85rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '.2rem' }}>{item.titulo}</div>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '.45rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                {item.tema} · {item.pilar} · {item.data_publicacao?.split('T')[0]}
              </div>
            </div>
            <button style={item.publicado ? aS.toggleActive : aS.toggleInactive} onClick={() => togglePublicado(item)}>
              {item.publicado ? <Eye size={10} /> : <EyeOff size={10} />} {item.publicado ? 'Publicado' : 'Oculto'}
            </button>
            <button style={aS.btnGhost} onClick={() => { setEditing(item); setIsNew(false); }}><Edit2 size={13} /></button>
            <button style={{ ...aS.btnGhost, color: '#c0392b' }} onClick={() => handleDelete(item.id)}><Trash2 size={13} /></button>
          </div>
        ))}
        {items.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-3)', fontFamily: 'var(--fb)', fontSize: '.82rem' }}>
            Nenhum vídeo cadastrado ainda.
          </div>
        )}
      </div>
    </div>
  );
};

// --- Linha do Tempo ---

const TimelineManager: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'timeline_items'));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a: any, b: any) => (a.ordem ?? 0) - (b.ordem ?? 0));
      setItems(list);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const startNew = () => {
    setIsNew(true);
    setEditing({
      id: `tl_${Date.now()}`,
      ano: '',
      tag: '',
      titulo: '',
      descricao: '',
      destaque: false,
      ordem: items.length,
    });
  };

  const handleSave = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'timeline_items', editing.id), editing);
      setEditing(null);
      setIsNew(false);
      await fetch();
    } catch { alert('Erro ao salvar.'); }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir este item?')) return;
    setLoading(true);
    try { await deleteDoc(doc(db, 'timeline_items', id)); await fetch(); } catch { alert('Erro ao excluir.'); }
    setLoading(false);
  };

  const move = async (index: number, dir: 'up' | 'down') => {
    const newItems = [...items];
    const targetIdx = dir === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;
    [newItems[index], newItems[targetIdx]] = [newItems[targetIdx], newItems[index]];
    const updates = newItems.map((item, i) => ({ ...item, ordem: i }));
    setItems(updates);
    await Promise.all(updates.map(item => updateDoc(doc(db, 'timeline_items', item.id), { ordem: item.ordem })));
  };

  const f = (field: string, val: any) => setEditing((prev: any) => ({ ...prev, [field]: val }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.6rem', marginBottom: '1.2rem' }}>
        <button style={aS.btnGhost} onClick={fetch}><RefreshCw size={13} className={loading ? 'animate-spin' : ''} /></button>
        {!editing && <button style={aS.btnPrimary} onClick={startNew}><Plus size={13} /> Novo Item</button>}
      </div>

      {editing && (
        <div style={{ background: 'var(--cream)', border: '1px solid var(--gold)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)' }}>
              {isNew ? 'Novo Item' : 'Editando Item'}
            </span>
            <button style={aS.btnGhost} onClick={() => { setEditing(null); setIsNew(false); }}><X size={14} /></button>
          </div>
          <div style={{ ...aS.grid2, marginBottom: '.8rem' }}>
            <div>
              <label style={aS.label}>Ano</label>
              <input style={aS.input} value={editing.ano} onChange={e => f('ano', e.target.value)} placeholder="2005" />
            </div>
            <div>
              <label style={aS.label}>Tag</label>
              <input style={aS.input} value={editing.tag} onChange={e => f('tag', e.target.value)} placeholder="Início da carreira comercial" />
            </div>
            <div>
              <label style={aS.label}>Título</label>
              <input style={aS.input} value={editing.titulo} onChange={e => f('titulo', e.target.value)} />
            </div>
            <div>
              <label style={aS.label}>Ordem</label>
              <input style={aS.input} type="number" value={editing.ordem} onChange={e => f('ordem', parseInt(e.target.value) || 0)} />
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={aS.label}>Descrição</label>
            <textarea style={aS.textarea} rows={3} value={editing.descricao} onChange={e => f('descricao', e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              type="button"
              style={editing.destaque ? aS.toggleActive : aS.toggleInactive}
              onClick={() => f('destaque', !editing.destaque)}
            >
              <Star size={11} /> Destaque
            </button>
            <div style={{ display: 'flex', gap: '.6rem' }}>
              <button style={aS.btnSecondary} onClick={() => { setEditing(null); setIsNew(false); }}>Cancelar</button>
              <button style={aS.btnPrimary} onClick={handleSave}><Save size={13} /> Salvar</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '.6rem' }}>
        {items.map((item, idx) => (
          <div key={item.id} style={{ background: 'var(--cream)', border: '1px solid var(--rule)', padding: '1rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.2rem' }}>
              <button style={{ ...aS.btnGhost, padding: '.2rem' }} disabled={idx === 0} onClick={() => move(idx, 'up')}><ChevronUp size={13} /></button>
              <button style={{ ...aS.btnGhost, padding: '.2rem' }} disabled={idx === items.length - 1} onClick={() => move(idx, 'down')}><ChevronDown size={13} /></button>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.3rem' }}>
                <span style={{ fontFamily: 'var(--fm)', fontSize: '.52rem', letterSpacing: '.1em', color: 'var(--gold)' }}>{item.ano}</span>
                <span style={{ fontFamily: 'var(--fm)', fontSize: '.44rem', letterSpacing: '.08em', color: 'var(--ink-3)' }}>{item.tag}</span>
                {item.destaque && <span style={{ fontFamily: 'var(--fm)', fontSize: '.42rem', letterSpacing: '.08em', color: 'var(--gold)', background: 'rgba(143,110,74,.1)', padding: '.15rem .4rem' }}>★ Destaque</span>}
              </div>
              <div style={{ fontFamily: 'var(--fb)', fontSize: '.85rem', fontWeight: 600, color: 'var(--ink)' }}>{item.titulo}</div>
              {item.descricao && <div style={{ fontFamily: 'var(--fb)', fontSize: '.78rem', color: 'var(--ink-3)', marginTop: '.3rem', lineHeight: 1.5 }}>{item.descricao.substring(0, 100)}{item.descricao.length > 100 ? '...' : ''}</div>}
            </div>
            <button style={aS.btnGhost} onClick={() => { setEditing(item); setIsNew(false); }}><Edit2 size={13} /></button>
            <button style={{ ...aS.btnGhost, color: '#c0392b' }} onClick={() => handleDelete(item.id)}><Trash2 size={13} /></button>
          </div>
        ))}
        {items.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-3)', fontFamily: 'var(--fb)', fontSize: '.82rem' }}>
            Nenhum item na linha do tempo.
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main export ---

export const MediaManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MediaTab>('artigos');

  const tabs = [
    { id: 'artigos' as MediaTab, label: 'Artigos', icon: <FileText size={13} /> },
    { id: 'videos' as MediaTab, label: 'Vídeos', icon: <Video size={13} /> },
    { id: 'timeline' as MediaTab, label: 'Linha do Tempo', icon: <Clock size={13} /> },
  ];

  return (
    <div>
      {/* Sub-tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--rule)', marginBottom: '1.5rem' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '.4rem',
              fontFamily: 'var(--fm)', fontSize: '.52rem', letterSpacing: '.12em', textTransform: 'uppercase',
              padding: '.75rem 1.2rem', border: 'none', background: 'transparent', cursor: 'pointer',
              color: activeTab === t.id ? 'var(--ink)' : 'var(--ink-3)',
              borderBottom: activeTab === t.id ? '2px solid var(--gold)' : '2px solid transparent',
              marginBottom: -1,
              transition: 'color .2s',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'artigos' && <ArtigosManager />}
      {activeTab === 'videos' && <VideosManager />}
      {activeTab === 'timeline' && <TimelineManager />}
    </div>
  );
};
