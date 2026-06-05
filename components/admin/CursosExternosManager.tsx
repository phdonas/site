import React, { useState, useEffect, useCallback } from 'react';
import { Edit2, Trash2, Plus, Save, X, RefreshCw, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { aS } from './adminStyles';
import { Field, TI, TA } from './adminEditorHelpers';
import { ImageUploadField } from './ImageUploadField';
import {
  CursoExterno,
  getAllCursosExternos,
  saveCursoExterno,
  deleteCursoExterno,
} from '../../services/cursosExternosService';

const CATEGORIAS = ['Gestão Comercial', 'Vendas', 'Negociação', 'Liderança'];
const NIVEIS = ['Básico', 'Intermediário', 'Avançado'];
const PLATAFORMAS: { value: 'udemy' | 'espm'; label: string }[] = [
  { value: 'udemy', label: 'Udemy' },
  { value: 'espm', label: 'ESPM' },
];

const EMPTY: Omit<CursoExterno, 'id'> = {
  titulo: '',
  descricao: '',
  plataforma: 'udemy',
  categoria: 'Gestão Comercial',
  carga_horaria: '',
  nivel: 'Intermediário',
  thumb_url: '',
  url_externo: '',
  gratuito: false,
  publicado: false,
  ordem: 0,
};

const platBadge = (p: 'udemy' | 'espm') => ({
  background: p === 'udemy' ? 'rgba(168,120,40,.12)' : 'rgba(30,58,138,.1)',
  color: p === 'udemy' ? 'var(--gold)' : '#1e3a8a',
  border: p === 'udemy' ? '1px solid rgba(168,120,40,.3)' : '1px solid rgba(30,58,138,.2)',
  fontFamily: 'var(--fm)', fontSize: '.44rem', letterSpacing: '.12em',
  textTransform: 'uppercase' as const, padding: '.2rem .6rem', display: 'inline-block',
});

export const CursosExternosManager: React.FC = () => {
  const [cursos, setCursos] = useState<CursoExterno[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [form, setForm] = useState<CursoExterno>({ id: '', ...EMPTY });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getAllCursosExternos();
    setCursos(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setForm({ id: '', ...EMPTY, ordem: cursos.length });
    setView('form');
  };

  const openEdit = (c: CursoExterno) => {
    setForm({ ...c });
    setView('form');
  };

  const handleSave = async () => {
    if (!form.titulo.trim()) return;
    setSaving(true);
    await saveCursoExterno(form);
    await load();
    setView('list');
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await deleteCursoExterno(id);
    setConfirmDelete(null);
    await load();
  };

  const togglePublicado = async (c: CursoExterno) => {
    await saveCursoExterno({ ...c, publicado: !c.publicado });
    await load();
  };

  const set = (field: keyof CursoExterno, val: any) =>
    setForm(prev => ({ ...prev, [field]: val }));

  // ── List view ────────────────────────────────────────────────────────────

  if (view === 'list') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <div style={aS.eyebrow}>Cursos Externos</div>
            <p style={{ fontFamily: 'var(--fb)', fontSize: '.82rem', color: 'var(--ink-3)', marginTop: '.3rem' }}>
              Cursos publicados em plataformas externas (Udemy, ESPM). Aparecem na página #/cursos.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '.6rem' }}>
            <button type="button" onClick={load} style={{ ...aS.btnSecondary, fontSize: '.5rem' }} disabled={loading}>
              <RefreshCw size={11} />
            </button>
            <button type="button" onClick={openNew} style={{ ...aS.btnPrimary, fontSize: '.5rem' }}>
              <Plus size={12} /> Novo curso externo
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'var(--fm)', fontSize: '.5rem', color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
            Carregando...
          </div>
        ) : cursos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--cream)', border: '1px solid var(--rule)' }}>
            <p style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', color: 'var(--ink-3)', fontStyle: 'italic', marginBottom: '1rem' }}>
              Nenhum curso externo cadastrado.
            </p>
            <button type="button" onClick={openNew} style={aS.btnPrimary}>
              <Plus size={12} /> Adicionar primeiro curso
            </button>
          </div>
        ) : (
          <div style={{ background: 'var(--cream)', border: '1px solid var(--rule)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...aS.th, width: 56 }}>Thumb</th>
                  <th style={aS.th}>Título</th>
                  <th style={{ ...aS.th, width: 90 }}>Plataforma</th>
                  <th style={{ ...aS.th, width: 130 }}>Categoria</th>
                  <th style={{ ...aS.th, width: 60 }}>Ordem</th>
                  <th style={{ ...aS.th, width: 90 }}>Status</th>
                  <th style={{ ...aS.th, width: 90 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {cursos.map(c => (
                  <tr key={c.id} style={{ opacity: c.publicado ? 1 : 0.55 }}>
                    <td style={aS.td}>
                      {c.thumb_url
                        ? <img src={c.thumb_url} alt="" style={{ width: 40, height: 26, objectFit: 'cover', display: 'block' }} />
                        : <div style={{ width: 40, height: 26, background: 'var(--cream-d)', border: '1px solid var(--rule)' }} />
                      }
                    </td>
                    <td style={aS.td}>
                      <div style={{ fontWeight: 600, marginBottom: '.2rem' }}>{c.titulo}</div>
                      <div style={{ fontFamily: 'var(--fm)', fontSize: '.44rem', letterSpacing: '.08em', color: 'var(--ink-3)' }}>
                        {c.nivel} · {c.carga_horaria}
                      </div>
                    </td>
                    <td style={aS.td}>
                      <span style={platBadge(c.plataforma)}>{c.plataforma}</span>
                    </td>
                    <td style={{ ...aS.td, fontSize: '.78rem', color: 'var(--ink-3)' }}>{c.categoria}</td>
                    <td style={{ ...aS.td, textAlign: 'center' }}>{c.ordem}</td>
                    <td style={aS.td}>
                      <button
                        type="button"
                        onClick={() => togglePublicado(c)}
                        style={c.publicado ? aS.toggleActive : aS.toggleInactive}
                      >
                        {c.publicado ? <Eye size={10} /> : <EyeOff size={10} />}
                        {c.publicado ? 'Pub.' : 'Rascunho'}
                      </button>
                    </td>
                    <td style={aS.td}>
                      <div style={{ display: 'flex', gap: '.4rem' }}>
                        {c.url_externo && (
                          <a href={c.url_externo} target="_blank" rel="noopener noreferrer"
                            style={{ ...aS.btnGhost, padding: '.3rem' }} title="Abrir link externo">
                            <ExternalLink size={12} />
                          </a>
                        )}
                        <button type="button" onClick={() => openEdit(c)} style={{ ...aS.btnGhost, padding: '.3rem' }} title="Editar">
                          <Edit2 size={12} />
                        </button>
                        {confirmDelete === c.id ? (
                          <>
                            <button type="button" onClick={() => handleDelete(c.id)} style={{ ...aS.btnDanger, padding: '.3rem .6rem', fontSize: '.44rem' }}>
                              Sim
                            </button>
                            <button type="button" onClick={() => setConfirmDelete(null)} style={{ ...aS.btnGhost, padding: '.3rem' }}>
                              <X size={12} />
                            </button>
                          </>
                        ) : (
                          <button type="button" onClick={() => setConfirmDelete(c.id)} style={{ ...aS.btnGhost, padding: '.3rem', color: '#c0392b' }} title="Excluir">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // ── Form view ────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Form header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={aS.eyebrow}>{form.id ? 'Editar Curso' : 'Novo Curso Externo'}</div>
          <p style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', marginTop: '.2rem' }}>
            {form.titulo || 'Sem título'}
          </p>
        </div>
        <button type="button" onClick={() => setView('list')} style={{ ...aS.btnSecondary, fontSize: '.5rem' }}>
          <X size={11} /> Cancelar
        </button>
      </div>

      <div style={{ background: 'var(--cream)', border: '1px solid var(--rule)', padding: '1.8rem' }}>
        {/* Plataforma + Publicado */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
          <Field label="Plataforma">
            <select
              style={aS.select}
              value={form.plataforma}
              onChange={e => set('plataforma', e.target.value as 'udemy' | 'espm')}
            >
              {PLATAFORMAS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </Field>
          <Field label="Categoria">
            <select
              style={aS.select}
              value={form.categoria}
              onChange={e => set('categoria', e.target.value)}
            >
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Nível">
            <select
              style={aS.select}
              value={form.nivel}
              onChange={e => set('nivel', e.target.value)}
            >
              {NIVEIS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>
        </div>

        {/* Título */}
        <div style={{ marginBottom: '1.2rem' }}>
          <Field label="Título">
            <TI value={form.titulo} onChange={val => set('titulo', val)} placeholder="Nome do curso" />
          </Field>
        </div>

        {/* Descrição */}
        <div style={{ marginBottom: '1.2rem' }}>
          <Field label="Descrição">
            <TA value={form.descricao} onChange={val => set('descricao', val)} rows={3} />
          </Field>
        </div>

        {/* URL externo + Carga horária + Ordem */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
          <Field label="URL do curso na plataforma">
            <TI value={form.url_externo} onChange={val => set('url_externo', val)} placeholder="https://udemy.com/..." />
          </Field>
          <Field label="Carga horária">
            <TI value={form.carga_horaria} onChange={val => set('carga_horaria', val)} placeholder="9h" />
          </Field>
          <Field label="Ordem (vitrine)">
            <input
              style={aS.input}
              type="number"
              min={0}
              value={form.ordem}
              onChange={e => set('ordem', Number(e.target.value))}
            />
          </Field>
        </div>

        {/* Thumbnail */}
        <div style={{ marginBottom: '1.2rem' }}>
          <Field label="Thumbnail">
            <ImageUploadField
              value={form.thumb_url}
              onChange={url => set('thumb_url', url)}
              specHint="Recomendado: 800×450px · Proporção 16:9 · JPG · Máx 150kb"
              storageFolder="cursos_externos/thumbs"
              maxSizeKb={150}
            />
          </Field>
        </div>

        {/* Gratuito + Publicado */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.8rem' }}>
          <div>
            <div style={{ ...aS.label, marginBottom: '.6rem' }}>Gratuito</div>
            <button type="button" onClick={() => set('gratuito', !form.gratuito)} style={form.gratuito ? aS.toggleActive : aS.toggleInactive}>
              {form.gratuito ? <Eye size={11} /> : <EyeOff size={11} />}
              {form.gratuito ? 'Gratuito' : 'Pago'}
            </button>
          </div>
          <div>
            <div style={{ ...aS.label, marginBottom: '.6rem' }}>Status</div>
            <button type="button" onClick={() => set('publicado', !form.publicado)} style={form.publicado ? aS.toggleActive : aS.toggleInactive}>
              {form.publicado ? <Eye size={11} /> : <EyeOff size={11} />}
              {form.publicado ? 'Publicado' : 'Rascunho'}
            </button>
          </div>
        </div>

        {/* Save */}
        <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '1.2rem', display: 'flex', justifyContent: 'flex-end', gap: '.8rem' }}>
          <button type="button" onClick={() => setView('list')} style={aS.btnSecondary}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !form.titulo.trim()}
            style={{ ...aS.btnPrimary, opacity: saving || !form.titulo.trim() ? .5 : 1 }}
          >
            {saving ? <><RefreshCw size={11} /> Salvando...</> : <><Save size={11} /> Salvar curso</>}
          </button>
        </div>
      </div>
    </div>
  );
};
