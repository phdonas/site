import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Save, Eye, EyeOff, ExternalLink, ChevronDown, ChevronRight, RefreshCw, AlertTriangle } from 'lucide-react';
import { aS } from './adminStyles';
import { Field, TI, TA, Toggle, SectionBlock, G2, G3, SubCard } from './adminEditorHelpers';
import { ImageUploadField } from './ImageUploadField';
import { PAGE_DEFAULTS, seedPage, type PageId as SeedPageId } from '../../scripts/seedFirestore';
import { MentoriaEditor } from './editors/MentoriaEditor';
import { ConsultoriaEditor } from './editors/ConsultoriaEditor';
import { ProfPauloEditor } from './editors/ProfPauloEditor';
import { ServicosEditor } from './editors/ServicosEditor';
import { FaleComigoeEditor } from './editors/FaleComigoeEditor';
import { AreaAlunoEditor } from './editors/AreaAlunoEditor';

type PageId = 'home' | 'mentoria' | 'consultoria' | 'prof_paulo' | 'servicos' | 'fale_comigo' | 'area_do_aluno';

const PAGES: { id: PageId; label: string; hash: string }[] = [
  { id: 'home', label: 'Home', hash: '#/' },
  { id: 'mentoria', label: 'Mentoria', hash: '#/mentoria' },
  { id: 'consultoria', label: 'Consultoria', hash: '#/consultoria' },
  { id: 'prof_paulo', label: 'Prof. Paulo', hash: '#/prof-paulo' },
  { id: 'servicos', label: 'Serviços', hash: '#/servicos' },
  { id: 'fale_comigo', label: 'Fale Comigo', hash: '#/fale-comigo' },
  { id: 'area_do_aluno', label: 'Área do Aluno', hash: '#/area-do-aluno' },
];

// ---- Home page editor (inline here since it's unique) ----

const HomeEditor: React.FC<{
  data: any;
  onChange: (path: string, val: any) => void;
  onSave: (section: string, data: any) => Promise<void>;
}> = ({ data, onChange, onSave }) => {
  const [saving, setSaving] = useState<string | null>(null);
  const save = async (section: string) => {
    setSaving(section);
    await onSave(section, { [section]: data[section] });
    setSaving(null);
  };
  const s = (sec: string, field: string, val: any) => onChange(`${sec}.${field}`, val);
  const v = (sec: string, field: string) => data?.[sec]?.[field] ?? '';
  const vis = (sec: string) => data?.[sec]?.visivel !== false;

  return (
    <>
      {/* Hero */}
      <SectionBlock title="Hero" visible={vis('hero')} onToggle={() => s('hero','visivel',!vis('hero'))} onSave={() => save('hero')} saving={saving === 'hero'} defaultOpen>
        <G2 mb="1rem">
          <Field label="Headline linha 1"><TI value={v('hero','headline_linha1')} onChange={val => s('hero','headline_linha1',val)} placeholder="Sua equipe vende." /></Field>
          <Field label="Headline linha 2"><TI value={v('hero','headline_linha2')} onChange={val => s('hero','headline_linha2',val)} placeholder="Mas poderia vender" /></Field>
          <Field label="Headline destaque (gold)"><TI value={v('hero','headline_destaque')} onChange={val => s('hero','headline_destaque',val)} placeholder="mais, e melhor." /></Field>
          <Field label="Tensão (itálico, borda gold)"><TI value={v('hero','tensao')} onChange={val => s('hero','tensao',val)} /></Field>
        </G2>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Subtexto"><TA value={v('hero','subtexto')} onChange={val => s('hero','subtexto',val)} rows={2} /></Field>
        </div>
        <G2 mb="1rem">
          <Field label="CTA primário — texto"><TI value={v('hero','cta_primario_texto')} onChange={val => s('hero','cta_primario_texto',val)} placeholder="Conheça os Serviços" /></Field>
          <Field label="CTA primário — link"><TI value={v('hero','cta_primario_link')} onChange={val => s('hero','cta_primario_link',val)} placeholder="#/servicos" /></Field>
          <Field label="CTA secundário — texto"><TI value={v('hero','cta_secundario_texto')} onChange={val => s('hero','cta_secundario_texto',val)} placeholder="Leia os Artigos" /></Field>
          <Field label="CTA secundário — link"><TI value={v('hero','cta_secundario_link')} onChange={val => s('hero','cta_secundario_link',val)} placeholder="#/conteudo" /></Field>
        </G2>
        {[1,2,3].map(n => (
          <G3 key={n} mb=".6rem">
            <Field label={`Credencial ${n} — número`}><TI value={v('hero',`credencial_${n}_numero`)} onChange={val => s('hero',`credencial_${n}_numero`,val)} /></Field>
            <Field label="Label" col={2}><TI value={v('hero',`credencial_${n}_label`)} onChange={val => s('hero',`credencial_${n}_label`,val)} /></Field>
          </G3>
        ))}
        <G2 mb="0">
          <Field label="Foto">
            <ImageUploadField
              value={v('hero','foto_url')}
              onChange={url => s('hero','foto_url',url)}
              specHint="Recomendado: 1200×800px · Proporção 3:2 · JPG · Máx 300kb"
              storageFolder="home/hero"
              maxSizeKb={300}
            />
          </Field>
          <Field label="Foto — alt"><TI value={v('hero','foto_alt')} onChange={val => s('hero','foto_alt',val)} /></Field>
        </G2>
      </SectionBlock>

      {/* Metodologia */}
      <SectionBlock title="Metodologia" visible={vis('metodologia')} onToggle={() => s('metodologia','visivel',!vis('metodologia'))} onSave={() => save('metodologia')} saving={saving === 'metodologia'}>
        <G2 mb="1rem">
          <Field label="Eyebrow"><TI value={v('metodologia','eyebrow')} onChange={val => s('metodologia','eyebrow',val)} placeholder="A metodologia" /></Field>
          <Field label="Intro texto"><TI value={v('metodologia','intro_texto')} onChange={val => s('metodologia','intro_texto',val)} /></Field>
        </G2>
        {[1,2,3,4].map(i => (
          <SubCard key={i} label={`Passo ${String(i).padStart(2,'0')}`}>
            <G3 mb=".8rem">
              <Field label="Número"><TI value={v('metodologia',`passo_${i}_num`)} onChange={val => s('metodologia',`passo_${i}_num`,val)} placeholder={String(i).padStart(2,'0')} /></Field>
              <Field label="Tag"><TI value={v('metodologia',`passo_${i}_tag`)} onChange={val => s('metodologia',`passo_${i}_tag`,val)} /></Field>
              <Field label="Título"><TI value={v('metodologia',`passo_${i}_titulo`)} onChange={val => s('metodologia',`passo_${i}_titulo`,val)} /></Field>
            </G3>
            <Field label="Descrição"><TA value={v('metodologia',`passo_${i}_descricao`)} onChange={val => s('metodologia',`passo_${i}_descricao`,val)} rows={2} /></Field>
          </SubCard>
        ))}
      </SectionBlock>

      {/* Autoridade */}
      <SectionBlock title="Autoridade (Quem é Prof. Paulo)" visible={vis('autoridade')} onToggle={() => s('autoridade','visivel',!vis('autoridade'))} onSave={() => save('autoridade')} saving={saving === 'autoridade'}>
        <G2 mb="1rem">
          <Field label="Eyebrow"><TI value={v('autoridade','eyebrow')} onChange={val => s('autoridade','eyebrow',val)} /></Field>
          <Field label="Título linha 1"><TI value={v('autoridade','titulo_linha1')} onChange={val => s('autoridade','titulo_linha1',val)} placeholder="25 anos no campo." /></Field>
          <Field label="Título linha 2"><TI value={v('autoridade','titulo_linha2')} onChange={val => s('autoridade','titulo_linha2',val)} placeholder="20 anos na sala de aula." /></Field>
          <Field label="Título linha 3"><TI value={v('autoridade','titulo_linha3')} onChange={val => s('autoridade','titulo_linha3',val)} placeholder="Ainda aprendendo." /></Field>
        </G2>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Narrativa — parágrafo 1"><TA value={v('autoridade','narrativa_paragrafo_1')} onChange={val => s('autoridade','narrativa_paragrafo_1',val)} rows={4} /></Field>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Narrativa — parágrafo 2"><TA value={v('autoridade','narrativa_paragrafo_2')} onChange={val => s('autoridade','narrativa_paragrafo_2',val)} rows={4} /></Field>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Citação"><TA value={v('autoridade','citacao_texto')} onChange={val => s('autoridade','citacao_texto',val)} rows={2} /></Field>
        </div>
        <G2 mb="0">
          <Field label="Foto">
            <ImageUploadField
              value={v('autoridade','foto_url')}
              onChange={url => s('autoridade','foto_url',url)}
              specHint="Recomendado: 800×1067px · Proporção 3:4 · JPG · Máx 200kb"
              storageFolder="home/autoridade"
              maxSizeKb={200}
            />
          </Field>
          <Field label="Foto — alt"><TI value={v('autoridade','foto_alt')} onChange={val => s('autoridade','foto_alt',val)} /></Field>
        </G2>
      </SectionBlock>

      {/* Situações */}
      <SectionBlock title="Situações (Você se reconhece?)" visible={vis('situacoes')} onToggle={() => s('situacoes','visivel',!vis('situacoes'))} onSave={() => save('situacoes')} saving={saving === 'situacoes'}>
        <G3 mb="1rem">
          <Field label="Eyebrow"><TI value={v('situacoes','eyebrow')} onChange={val => s('situacoes','eyebrow',val)} placeholder="Você se reconhece?" /></Field>
          <Field label="Título"><TI value={v('situacoes','titulo')} onChange={val => s('situacoes','titulo',val)} /></Field>
          <Field label="Subtítulo"><TI value={v('situacoes','subtitulo')} onChange={val => s('situacoes','subtitulo',val)} /></Field>
        </G3>
        {[
          { n:1, marker:'Gestão Comercial' }, { n:2, marker:'Empreendedor' },
          { n:3, marker:'Profissional de Vendas' }, { n:4, marker:'Liderança' },
        ].map(({ n, marker }) => (
          <SubCard key={n} label={`Situação ${n}`}>
            <G3 mb="0">
              <Field label="Marker"><TI value={v('situacoes',`situacao_${n}_marker`)} onChange={val => s('situacoes',`situacao_${n}_marker`,val)} placeholder={marker} /></Field>
              <Field label="Título"><TI value={v('situacoes',`situacao_${n}_titulo`)} onChange={val => s('situacoes',`situacao_${n}_titulo`,val)} /></Field>
              <Field label="Descrição"><TI value={v('situacoes',`situacao_${n}_descricao`)} onChange={val => s('situacoes',`situacao_${n}_descricao`,val)} /></Field>
            </G3>
          </SubCard>
        ))}
      </SectionBlock>

      {/* Serviços */}
      <SectionBlock title="Serviços (cards)" visible={vis('servicos')} onToggle={() => s('servicos','visivel',!vis('servicos'))} onSave={() => save('servicos')} saving={saving === 'servicos'}>
        <G3 mb="1rem">
          <Field label="Eyebrow"><TI value={v('servicos','eyebrow')} onChange={val => s('servicos','eyebrow',val)} /></Field>
          <Field label="Título"><TI value={v('servicos','titulo')} onChange={val => s('servicos','titulo',val)} /></Field>
          <Field label="Subtítulo"><TI value={v('servicos','subtitulo')} onChange={val => s('servicos','subtitulo',val)} /></Field>
        </G3>
        {[
          {n:1, t:'Mentoria'}, {n:2, t:'Consultoria'}, {n:3, t:'Cursos e Formações'}, {n:4, t:'Conteúdo'},
        ].map(({ n, t }) => (
          <SubCard key={n} label={`Serviço ${n}`}>
            <G2 mb=".6rem">
              <Field label="Título"><TI value={v('servicos',`servico_${n}_titulo`)} onChange={val => s('servicos',`servico_${n}_titulo`,val)} placeholder={t} /></Field>
              <Field label="Descrição"><TI value={v('servicos',`servico_${n}_descricao`)} onChange={val => s('servicos',`servico_${n}_descricao`,val)} /></Field>
              <Field label="Link — texto"><TI value={v('servicos',`servico_${n}_link_texto`)} onChange={val => s('servicos',`servico_${n}_link_texto`,val)} /></Field>
              <Field label="Link — URL"><TI value={v('servicos',`servico_${n}_link_url`)} onChange={val => s('servicos',`servico_${n}_link_url`,val)} /></Field>
            </G2>
            {n === 4 && <Field label="Tag (ex: Acesso gratuito)"><TI value={v('servicos','servico_4_tag')} onChange={val => s('servicos','servico_4_tag',val)} /></Field>}
          </SubCard>
        ))}
      </SectionBlock>

      {/* Conteúdo Recente */}
      <SectionBlock title="Conteúdo Recente" visible={vis('conteudo_recente')} onToggle={() => s('conteudo_recente','visivel',!vis('conteudo_recente'))} onSave={() => save('conteudo_recente')} saving={saving === 'conteudo_recente'}>
        <p style={{ fontFamily: 'var(--fb)', fontSize: '.78rem', color: 'var(--ink-3)', marginBottom: '1rem' }}>
          Os artigos exibidos são os 3 mais recentes do Firebase — automático, sem edição manual aqui.
        </p>
        <G2 mb="0">
          <Field label="Eyebrow"><TI value={v('conteudo_recente','eyebrow')} onChange={val => s('conteudo_recente','eyebrow',val)} /></Field>
          <Field label="Título"><TI value={v('conteudo_recente','titulo')} onChange={val => s('conteudo_recente','titulo',val)} /></Field>
          <Field label="Link 'ver todos' — texto"><TI value={v('conteudo_recente','link_ver_todos_texto')} onChange={val => s('conteudo_recente','link_ver_todos_texto',val)} /></Field>
          <Field label="Link 'ver todos' — URL"><TI value={v('conteudo_recente','link_ver_todos_url')} onChange={val => s('conteudo_recente','link_ver_todos_url',val)} /></Field>
        </G2>
      </SectionBlock>

      {/* Newsletter */}
      <SectionBlock title="Newsletter" visible={vis('newsletter')} onToggle={() => s('newsletter','visivel',!vis('newsletter'))} onSave={() => save('newsletter')} saving={saving === 'newsletter'}>
        <G2 mb="1rem">
          <Field label="Eyebrow"><TI value={v('newsletter','eyebrow')} onChange={val => s('newsletter','eyebrow',val)} placeholder="Newsletter" /></Field>
          <Field label="Título linha 1"><TI value={v('newsletter','titulo_linha1')} onChange={val => s('newsletter','titulo_linha1',val)} placeholder="Gestão comercial" /></Field>
          <Field label="Título destaque (itálico)"><TI value={v('newsletter','titulo_destaque')} onChange={val => s('newsletter','titulo_destaque',val)} placeholder="na prática" /></Field>
          <Field label="Texto do botão"><TI value={v('newsletter','botao_texto')} onChange={val => s('newsletter','botao_texto',val)} placeholder="Quero receber" /></Field>
        </G2>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Subtexto"><TA value={v('newsletter','subtexto')} onChange={val => s('newsletter','subtexto',val)} rows={2} /></Field>
        </div>
        <Field label="Nota de privacidade"><TI value={v('newsletter','nota_privacidade')} onChange={val => s('newsletter','nota_privacidade',val)} placeholder="Sem spam. Cancelamento em um clique." /></Field>
      </SectionBlock>

      {/* Recursos */}
      <SectionBlock title="Recursos" visible={vis('recursos')} onToggle={() => s('recursos','visivel',!vis('recursos'))} onSave={() => save('recursos')} saving={saving === 'recursos'}>
        {[
          {n:1, marker:'Plataforma', t:'Área do Aluno'}, {n:2, marker:'Cursos Online', t:'Udemy & ESPM'}, {n:3, marker:'Publicações', t:'Livros na Amazon'},
        ].map(({ n, marker, t }) => (
          <SubCard key={n} label={`Recurso ${n}`}>
            <G2 mb=".6rem">
              <Field label="Marker"><TI value={v('recursos',`recurso_${n}_marker`)} onChange={val => s('recursos',`recurso_${n}_marker`,val)} placeholder={marker} /></Field>
              <Field label="Título"><TI value={v('recursos',`recurso_${n}_titulo`)} onChange={val => s('recursos',`recurso_${n}_titulo`,val)} placeholder={t} /></Field>
              <Field label="Descrição"><TI value={v('recursos',`recurso_${n}_descricao`)} onChange={val => s('recursos',`recurso_${n}_descricao`,val)} /></Field>
              <Field label="Link — texto"><TI value={v('recursos',`recurso_${n}_link_texto`)} onChange={val => s('recursos',`recurso_${n}_link_texto`,val)} /></Field>
            </G2>
            <Field label="Link — URL"><TI value={v('recursos',`recurso_${n}_link_url`)} onChange={val => s('recursos',`recurso_${n}_link_url`,val)} /></Field>
          </SubCard>
        ))}
      </SectionBlock>

      {/* CTA Final */}
      <SectionBlock title="CTA Final" visible={vis('cta_final')} onToggle={() => s('cta_final','visivel',!vis('cta_final'))} onSave={() => save('cta_final')} saving={saving === 'cta_final'}>
        <G2 mb="1rem">
          <Field label="Eyebrow"><TI value={v('cta_final','eyebrow')} onChange={val => s('cta_final','eyebrow',val)} placeholder="Próximo passo" /></Field>
          <Field label="Título linha 1"><TI value={v('cta_final','titulo_linha1')} onChange={val => s('cta_final','titulo_linha1',val)} placeholder="Vamos conversar sobre" /></Field>
          <Field label="Título destaque (itálico)"><TI value={v('cta_final','titulo_destaque')} onChange={val => s('cta_final','titulo_destaque',val)} placeholder="o seu desafio?" /></Field>
        </G2>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Subtexto"><TA value={v('cta_final','subtexto')} onChange={val => s('cta_final','subtexto',val)} rows={2} /></Field>
        </div>
        <G2 mb="0">
          <Field label="CTA primário — texto"><TI value={v('cta_final','cta_primario_texto')} onChange={val => s('cta_final','cta_primario_texto',val)} placeholder="Fale Comigo" /></Field>
          <Field label="CTA primário — link"><TI value={v('cta_final','cta_primario_link')} onChange={val => s('cta_final','cta_primario_link',val)} /></Field>
          <Field label="CTA secundário — texto"><TI value={v('cta_final','cta_secundario_texto')} onChange={val => s('cta_final','cta_secundario_texto',val)} placeholder="Conheça os serviços" /></Field>
          <Field label="CTA secundário — link"><TI value={v('cta_final','cta_secundario_link')} onChange={val => s('cta_final','cta_secundario_link',val)} /></Field>
        </G2>
      </SectionBlock>
    </>
  );
};

// ---- Main orchestrator ----

function isPageEmpty(data: any): boolean {
  if (!data || Object.keys(data).length === 0) return true;
  // Consider empty if all string values in hero section are blank
  const hero = data.hero || data.conteudo || {};
  const vals = Object.values(hero).filter((v): v is string => typeof v === 'string' && v !== 'visivel');
  return vals.length === 0 || vals.every(v => v === '');
}

export const SiteContentEditor: React.FC = () => {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [pageData, setPageData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const loadPage = useCallback(async (pageId: PageId) => {
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, 'site_content', pageId));
      setPageData(snap.exists() ? snap.data() : {});
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { loadPage(activePage); }, [activePage, loadPage]);

  const handleChange = (path: string, value: any) => {
    setPageData((prev: any) => {
      const keys = path.split('.');
      const next = { ...prev };
      let cur: any = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...(cur[keys[i]] || {}) };
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const handleSaveSection = async (_section: string, sectionData: any) => {
    await setDoc(doc(db, 'site_content', activePage), sectionData, { merge: true });
  };

  const handleSeedPage = async (overwrite = false) => {
    setSeeding(true);
    try {
      await seedPage(db, activePage as SeedPageId, { overwrite });
      await loadPage(activePage);
    } catch (e) { console.error(e); }
    setSeeding(false);
  };

  const handleRestoreDefaults = () => {
    const defaults = PAGE_DEFAULTS[activePage as SeedPageId];
    if (defaults) setPageData({ ...defaults });
  };

  const activePageMeta = PAGES.find(p => p.id === activePage)!;
  const empty = isPageEmpty(pageData);

  const renderEditor = () => {
    const props = { data: pageData, onChange: handleChange, onSave: handleSaveSection };
    switch (activePage) {
      case 'home': return <HomeEditor {...props} />;
      case 'mentoria': return <MentoriaEditor {...props} />;
      case 'consultoria': return <ConsultoriaEditor {...props} />;
      case 'prof_paulo': return <ProfPauloEditor {...props} />;
      case 'servicos': return <ServicosEditor {...props} />;
      case 'fale_comigo': return <FaleComigoeEditor {...props} />;
      case 'area_do_aluno': return <AreaAlunoEditor {...props} />;
    }
  };

  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
      {/* Sidebar */}
      <div style={{ width: 180, flexShrink: 0 }}>
        <div style={{ background: 'var(--cream)', border: '1px solid var(--rule)', overflow: 'hidden', position: 'sticky', top: '8rem' }}>
          <div style={{ padding: '.8rem 1rem', borderBottom: '1px solid var(--rule)' }}>
            <div style={aS.eyebrow}>Páginas</div>
          </div>
          {PAGES.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePage(p.id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '.75rem 1rem',
                fontFamily: 'var(--fb)', fontSize: '.82rem',
                color: activePage === p.id ? 'var(--ink)' : 'var(--ink-3)',
                background: activePage === p.id ? 'var(--cream-d)' : 'transparent',
                border: 'none',
                borderLeft: activePage === p.id ? '2px solid var(--gold)' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor panel */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '.8rem' }}>
          <div>
            <div style={aS.eyebrow}>Editando</div>
            <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--ink)', marginTop: '.2rem' }}>
              {activePageMeta.label}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleRestoreDefaults}
              style={{ ...aS.btnSecondary, fontSize: '.5rem' }}
              title="Carrega os valores padrão nos campos sem salvar no Firestore"
            >
              <RefreshCw size={11} /> Restaurar padrões
            </button>
            <a
              href={activePageMeta.hash}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...aS.btnSecondary, textDecoration: 'none', fontSize: '.5rem' }}
            >
              <ExternalLink size={11} /> Pré-visualizar
            </a>
          </div>
        </div>

        {/* Empty state warning banner */}
        {!loading && empty && (
          <div style={{
            background: 'rgba(180,83,9,.06)',
            border: '1px solid rgba(180,83,9,.3)',
            padding: '1.2rem 1.4rem',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start',
          }}>
            <AlertTriangle size={18} style={{ color: '#b45309', flexShrink: 0, marginTop: '.1rem' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--fb)', fontSize: '.85rem', fontWeight: 600, color: '#92400e', marginBottom: '.3rem' }}>
                Os campos estão vazios
              </div>
              <p style={{ fontFamily: 'var(--fb)', fontSize: '.8rem', color: '#b45309', lineHeight: 1.6, marginBottom: '.8rem' }}>
                O banco de dados ainda não tem conteúdo para esta página. Clique em{' '}
                <strong>"Carregar conteúdo atual"</strong> para preencher os campos com o conteúdo atual do site antes de editar — assim você não perde o texto existente.
              </p>
              <button
                type="button"
                onClick={() => handleSeedPage(false)}
                disabled={seeding}
                style={{ ...aS.btnPrimary, fontSize: '.75rem', opacity: seeding ? .6 : 1, cursor: seeding ? 'default' : 'pointer' }}
              >
                {seeding ? <><RefreshCw size={11} /> Carregando...</> : 'Carregar conteúdo atual'}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-3)', fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.1em', textTransform: 'uppercase' }}>
            Carregando...
          </div>
        ) : renderEditor()}
      </div>
    </div>
  );
};
