import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Save, RefreshCw, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { aS } from './adminStyles';
import { ImageUploadField } from './ImageUploadField';

const DEFAULT_SETTINGS = {
  nome_site: 'Prof. Paulo H. Donassolo',
  tagline: 'Mentoria · Consultoria · Cursos e Formações · Conteúdo',
  email_contato: 'paulo@phdonassolo.com',
  numero_whatsapp: '351910298213',
  linkedin_url: '',
  youtube_url: '',
  instagram_url: '',
  lms_liberado: false,
  url_lms: 'https://aluno.phdonassolo.com',
  previsao_lancamento: 'junho de 2026',
  copyright_texto: `© ${new Date().getFullYear()} Prof. Paulo H. Donassolo · Todos os direitos reservados`,
  assinatura: 'Pessoas · Processos · Gestão · Resultados',
  links_legais: [
    { texto: 'Privacidade', url: '#/privacidade' },
    { texto: 'Termos de Uso', url: '#/termos' },
  ],
  og_titulo_padrao: 'Prof. Paulo H. Donassolo — Mentoria e Consultoria Comercial',
  og_descricao_padrao: '',
  og_imagem_url: '',
  newsletter_ativa: true,
  newsletter_mensagem_confirmacao: 'Obrigado! Você receberá o próximo conteúdo em breve.',
};

type SectionId = 'geral' | 'lms' | 'rodape' | 'seo' | 'newsletter';

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'geral', label: 'Dados Globais' },
  { id: 'lms', label: 'LMS / Área do Aluno' },
  { id: 'rodape', label: 'Rodapé' },
  { id: 'seo', label: 'SEO Padrão' },
  { id: 'newsletter', label: 'Newsletter' },
];

export const SettingsManager: React.FC = () => {
  const [data, setData] = useState<any>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('geral');

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, 'site_config', 'config'));
      if (snap.exists()) {
        setData({ ...DEFAULT_SETTINGS, ...snap.data() });
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'site_config', 'config'), data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) { alert('Erro ao salvar configurações.'); }
    setSaving(false);
  };

  const f = (field: string, val: any) => setData((prev: any) => ({ ...prev, [field]: val }));

  const addLegalLink = () => {
    setData((prev: any) => ({
      ...prev,
      links_legais: [...(prev.links_legais || []), { texto: '', url: '' }],
    }));
  };

  const removeLegalLink = (idx: number) => {
    setData((prev: any) => ({
      ...prev,
      links_legais: prev.links_legais.filter((_: any, i: number) => i !== idx),
    }));
  };

  const updateLegalLink = (idx: number, field: 'texto' | 'url', val: string) => {
    setData((prev: any) => ({
      ...prev,
      links_legais: prev.links_legais.map((l: any, i: number) => i === idx ? { ...l, [field]: val } : l),
    }));
  };

  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
      {/* Sidebar */}
      <div style={{ width: 180, flexShrink: 0 }}>
        <div style={{ background: 'var(--cream)', border: '1px solid var(--rule)', overflow: 'hidden', position: 'sticky', top: '8rem' }}>
          <div style={{ padding: '.8rem 1rem', borderBottom: '1px solid var(--rule)' }}>
            <div style={aS.eyebrow}>Seções</div>
          </div>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '.75rem 1rem',
                fontFamily: 'var(--fb)', fontSize: '.82rem',
                color: activeSection === s.id ? 'var(--ink)' : 'var(--ink-3)',
                background: activeSection === s.id ? 'var(--cream-d)' : 'transparent',
                border: 'none',
                borderLeft: activeSection === s.id ? '2px solid var(--gold)' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <div style={aS.eyebrow}>Configurações</div>
            <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--ink)', marginTop: '.2rem' }}>
              {SECTIONS.find(s => s.id === activeSection)?.label}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '.6rem', alignItems: 'center' }}>
            {saved && (
              <span style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                Salvo!
              </span>
            )}
            <button style={aS.btnGhost} onClick={loadSettings}><RefreshCw size={13} className={loading ? 'animate-spin' : ''} /></button>
            <button style={{ ...aS.btnPrimary, opacity: saving ? .6 : 1 }} onClick={handleSave} disabled={saving}>
              <Save size={13} /> {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </div>

        {activeSection === 'geral' && (
          <div style={aS.card}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ ...aS.grid2, marginBottom: '1rem' }}>
                <div>
                  <label style={aS.label}>Nome do site</label>
                  <input style={aS.input} value={data.nome_site || ''} onChange={e => f('nome_site', e.target.value)} />
                </div>
                <div>
                  <label style={aS.label}>Tagline</label>
                  <input style={aS.input} value={data.tagline || ''} onChange={e => f('tagline', e.target.value)} />
                </div>
                <div>
                  <label style={aS.label}>Email de contato</label>
                  <input style={aS.input} type="email" value={data.email_contato || ''} onChange={e => f('email_contato', e.target.value)} />
                </div>
                <div>
                  <label style={aS.label}>WhatsApp (apenas números com DDI)</label>
                  <input style={aS.input} value={data.numero_whatsapp || ''} onChange={e => f('numero_whatsapp', e.target.value)} placeholder="351910298213" />
                </div>
              </div>
              <div style={{ ...aS.grid3 }}>
                <div>
                  <label style={aS.label}>LinkedIn — URL</label>
                  <input style={aS.input} value={data.linkedin_url || ''} onChange={e => f('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                  <label style={aS.label}>YouTube — URL</label>
                  <input style={aS.input} value={data.youtube_url || ''} onChange={e => f('youtube_url', e.target.value)} placeholder="https://youtube.com/@..." />
                </div>
                <div>
                  <label style={aS.label}>Instagram — URL</label>
                  <input style={aS.input} value={data.instagram_url || ''} onChange={e => f('instagram_url', e.target.value)} placeholder="https://instagram.com/..." />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'lms' && (
          <div style={aS.card}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ background: data.lms_liberado ? 'rgba(143,110,74,.08)' : 'var(--cream-d)', border: `1px solid ${data.lms_liberado ? 'var(--gold)' : 'var(--rule)'}`, padding: '1.2rem', marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '.3rem' }}>LMS liberado</div>
                    <p style={{ fontFamily: 'var(--fb)', fontSize: '.78rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>
                      Quando <strong>ativado</strong>: botão "Área do Aluno" no nav linka para o LMS externo.<br />
                      Quando <strong>desativado</strong>: botão linka para a página de pré-lançamento (#/area-do-aluno).
                    </p>
                  </div>
                  <button
                    type="button"
                    style={data.lms_liberado ? { ...aS.toggleActive, padding: '.5rem 1.2rem' } : { ...aS.toggleInactive, padding: '.5rem 1.2rem' }}
                    onClick={() => f('lms_liberado', !data.lms_liberado)}
                  >
                    {data.lms_liberado ? <Eye size={13} /> : <EyeOff size={13} />}
                    {data.lms_liberado ? 'Liberado' : 'Bloqueado'}
                  </button>
                </div>
              </div>

              <div style={{ ...aS.grid2, marginBottom: '1rem' }}>
                <div>
                  <label style={aS.label}>URL do LMS</label>
                  <input style={aS.input} value={data.url_lms || ''} onChange={e => f('url_lms', e.target.value)} placeholder="https://aluno.phdonassolo.com" />
                </div>
                <div>
                  <label style={aS.label}>Previsão de lançamento (texto)</label>
                  <input style={aS.input} value={data.previsao_lancamento || ''} onChange={e => f('previsao_lancamento', e.target.value)} placeholder="junho de 2026" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'rodape' && (
          <div style={aS.card}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ ...aS.grid2, marginBottom: '1.2rem' }}>
                <div>
                  <label style={aS.label}>Texto de copyright</label>
                  <input style={aS.input} value={data.copyright_texto || ''} onChange={e => f('copyright_texto', e.target.value)} />
                </div>
                <div>
                  <label style={aS.label}>Assinatura (tagline do rodapé)</label>
                  <input style={aS.input} value={data.assinatura || ''} onChange={e => f('assinatura', e.target.value)} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.8rem' }}>
                  <label style={aS.label}>Links legais</label>
                  <button style={aS.btnGhost} onClick={addLegalLink}><Plus size={13} /> Adicionar</button>
                </div>
                {(data.links_legais || []).map((link: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', gap: '.6rem', marginBottom: '.6rem', alignItems: 'center' }}>
                    <input
                      style={{ ...aS.input, width: 160 }}
                      placeholder="Texto"
                      value={link.texto}
                      onChange={e => updateLegalLink(idx, 'texto', e.target.value)}
                    />
                    <input
                      style={{ ...aS.input, flex: 1 }}
                      placeholder="URL"
                      value={link.url}
                      onChange={e => updateLegalLink(idx, 'url', e.target.value)}
                    />
                    <button style={{ ...aS.btnGhost, color: '#c0392b' }} onClick={() => removeLegalLink(idx)}><Trash2 size={13} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'seo' && (
          <div style={aS.card}>
            <div style={{ padding: '1.5rem' }}>
              <p style={{ fontFamily: 'var(--fb)', fontSize: '.78rem', color: 'var(--ink-3)', lineHeight: 1.7, marginBottom: '1.2rem' }}>
                Estes valores são usados como fallback em páginas que não têm meta tags próprias.
              </p>
              <div style={{ marginBottom: '1rem' }}>
                <label style={aS.label}>OG Título padrão</label>
                <input style={aS.input} value={data.og_titulo_padrao || ''} onChange={e => f('og_titulo_padrao', e.target.value)} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={aS.label}>OG Descrição padrão</label>
                <textarea style={aS.textarea} rows={3} value={data.og_descricao_padrao || ''} onChange={e => f('og_descricao_padrao', e.target.value)} />
              </div>
              <div>
                <label style={aS.label}>OG Imagem</label>
                <ImageUploadField
                  value={data.og_imagem_url || ''}
                  onChange={url => f('og_imagem_url', url)}
                  specHint="Recomendado: 1200×630px · Proporção 1.91:1 · JPG · Máx 300kb"
                  storageFolder="config/og"
                  maxSizeKb={300}
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'newsletter' && (
          <div style={aS.card}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ background: data.newsletter_ativa ? 'rgba(143,110,74,.08)' : 'var(--cream-d)', border: `1px solid ${data.newsletter_ativa ? 'var(--gold)' : 'var(--rule)'}`, padding: '1rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '.25rem' }}>Formulário de newsletter ativo</div>
                  <p style={{ fontFamily: 'var(--fb)', fontSize: '.78rem', color: 'var(--ink-3)' }}>Captura e-mails no Firebase. Sem integração externa por enquanto.</p>
                </div>
                <button
                  type="button"
                  style={data.newsletter_ativa ? aS.toggleActive : aS.toggleInactive}
                  onClick={() => f('newsletter_ativa', !data.newsletter_ativa)}
                >
                  {data.newsletter_ativa ? <Eye size={11} /> : <EyeOff size={11} />}
                  {data.newsletter_ativa ? 'Ativo' : 'Inativo'}
                </button>
              </div>
              <div>
                <label style={aS.label}>Mensagem de confirmação (exibida após cadastro)</label>
                <textarea style={aS.textarea} rows={3} value={data.newsletter_mensagem_confirmacao || ''} onChange={e => f('newsletter_mensagem_confirmacao', e.target.value)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
