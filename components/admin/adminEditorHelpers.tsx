import React, { useState } from 'react';
import { aS } from './adminStyles';
import { Eye, EyeOff, ChevronDown, ChevronRight, Save, Plus, X } from 'lucide-react';

// ---- Primitive field components ----

export const Field: React.FC<{ label: string; help?: string; col?: number; children: React.ReactNode }> = ({ label, help, col, children }) => (
  <div style={{ gridColumn: col ? `span ${col}` : undefined }}>
    <label style={aS.label}>{label}</label>
    {children}
    {help && <p style={{ fontFamily: 'var(--fm)', fontSize: '.44rem', letterSpacing: '.06em', color: 'var(--ink-3)', marginTop: '.25rem' }}>{help}</p>}
  </div>
);

export const TI: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string }> = ({ value, onChange, placeholder }) => (
  <input style={aS.input} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
);

export const TA: React.FC<{ value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }> = ({ value, onChange, rows = 3, placeholder }) => (
  <textarea style={aS.textarea} rows={rows} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
);

export const Toggle: React.FC<{ value: boolean; onChange: (v: boolean) => void; label?: string }> = ({ value, onChange, label }) => (
  <button type="button" onClick={() => onChange(!value)} style={value ? aS.toggleActive : aS.toggleInactive}>
    {value ? <Eye size={11} /> : <EyeOff size={11} />}
    {label || (value ? 'Visível' : 'Oculto')}
  </button>
);

export const TagsInput: React.FC<{ value: string[]; onChange: (v: string[]) => void; placeholder?: string }> = ({ value = [], onChange, placeholder }) => (
  <input
    style={aS.input}
    value={value.join(', ')}
    onChange={e => onChange(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
    placeholder={placeholder ?? 'Tag 1, Tag 2, ...'}
  />
);

// ---- FAQ editor ----

export type FAQItem = { pergunta: string; resposta: string; ordem: number };

export const FAQEditor: React.FC<{ items: FAQItem[]; onChange: (v: FAQItem[]) => void }> = ({ items = [], onChange }) => {
  const add = () => onChange([...items, { pergunta: '', resposta: '', ordem: items.length }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, field: 'pergunta' | 'resposta', val: string) =>
    onChange(items.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ background: 'var(--cream-d)', border: '1px solid var(--rule)', padding: '1rem', marginBottom: '.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
            <span style={{ ...aS.eyebrow, fontSize: '.44rem' }}>FAQ {i + 1}</span>
            <button type="button" onClick={() => remove(i)} style={{ ...aS.btnGhost, color: '#c0392b', padding: '.2rem' }}><X size={12} /></button>
          </div>
          <input style={{ ...aS.input, marginBottom: '.5rem' }} value={item.pergunta} onChange={e => update(i, 'pergunta', e.target.value)} placeholder="Pergunta" />
          <textarea style={aS.textarea} rows={2} value={item.resposta} onChange={e => update(i, 'resposta', e.target.value)} placeholder="Resposta" />
        </div>
      ))}
      <button type="button" style={aS.btnSecondary} onClick={add}><Plus size={11} /> Adicionar pergunta</button>
    </div>
  );
};

// ---- Section block with collapse + toggle + save ----

export const SectionBlock: React.FC<{
  title: string;
  visible: boolean;
  onToggle: () => void;
  onSave: () => void;
  saving: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, visible, onToggle, onSave, saving, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={aS.sectionBlock}>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setOpen(o => !o)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
          {open ? <ChevronDown size={14} style={{ color: 'var(--gold)' }} /> : <ChevronRight size={14} style={{ color: 'var(--ink-3)' }} />}
          <span style={{ fontFamily: 'var(--fd)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)' }}>{title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }} onClick={e => e.stopPropagation()}>
          <Toggle value={visible} onChange={onToggle} />
          {open && (
            <button style={{ ...aS.btnPrimary, opacity: saving ? .6 : 1 }} onClick={onSave} disabled={saving}>
              <Save size={11} /> {saving ? 'Salvando...' : 'Salvar seção'}
            </button>
          )}
        </div>
      </div>
      {open && (
        <div style={{ padding: '0 1.5rem 1.5rem' }}>
          <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '1.2rem' }}>{children}</div>
        </div>
      )}
    </div>
  );
};

// ---- Grid helpers ----

export const G2: React.FC<{ gap?: string; mb?: string; children: React.ReactNode }> = ({ gap = '1rem', mb, children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap, marginBottom: mb || '1rem' }}>
    {children}
  </div>
);

export const G3: React.FC<{ gap?: string; mb?: string; children: React.ReactNode }> = ({ gap = '1rem', mb, children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap, marginBottom: mb || '1rem' }}>
    {children}
  </div>
);

export const SubCard: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ background: 'var(--cream-d)', border: '1px solid var(--rule)', padding: '1rem', marginBottom: '.8rem' }}>
    <div style={{ ...aS.eyebrow, fontSize: '.44rem', marginBottom: '.8rem' }}>{label}</div>
    {children}
  </div>
);

// ---- useSectionSave hook ----
// Used by page editors to track which section is currently saving.
export function useSectionSave(onSave: (section: string, data: any) => Promise<void>) {
  const [saving, setSaving] = useState<string | null>(null);

  const save = async (section: string, data: Record<string, any>) => {
    setSaving(section);
    await onSave(section, { [section]: data });
    setSaving(null);
  };

  return { saving, save };
}
