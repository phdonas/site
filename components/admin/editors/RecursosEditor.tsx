import React from 'react';
import { Field, TI, TA, SectionBlock, G2, useSectionSave } from '../adminEditorHelpers';
import { aS } from '../adminStyles';

interface Props {
  data: any;
  onChange: (path: string, val: any) => void;
  onSave: (section: string, data: any) => Promise<void>;
}

export const RecursosEditor: React.FC<Props> = ({ data, onChange, onSave }) => {
  const { saving, save } = useSectionSave(onSave);

  const s = (sec: string, field: string, val: any) => onChange(`${sec}.${field}`, val);
  const v = (sec: string, field: string) => data?.[sec]?.[field] ?? '';
  const vis = (sec: string) => data?.[sec]?.visivel !== false;

  return (
    <>
      {/* Hero */}
      <SectionBlock
        title="Hero"
        visible={vis('hero')}
        onToggle={() => s('hero', 'visivel', !vis('hero'))}
        onSave={() => save('hero', data.hero)}
        saving={saving === 'hero'}
        defaultOpen
      >
        <G2 mb="1rem">
          <Field label="Eyebrow">
            <TI value={v('hero', 'eyebrow')} onChange={val => s('hero', 'eyebrow', val)} placeholder="Recursos & Acesso" />
          </Field>
          <Field label="Título linha 1">
            <TI value={v('hero', 'titulo_linha1')} onChange={val => s('hero', 'titulo_linha1', val)} placeholder="Tudo num só lugar." />
          </Field>
          <Field label="Título destaque (itálico)">
            <TI value={v('hero', 'titulo_destaque')} onChange={val => s('hero', 'titulo_destaque', val)} placeholder="Acesso direto." />
          </Field>
        </G2>
        <Field label="Subtexto">
          <TA value={v('hero', 'subtexto')} onChange={val => s('hero', 'subtexto', val)} rows={2} />
        </Field>
      </SectionBlock>

      {/* Card 01 — Área do Aluno */}
      <SectionBlock
        title="Card 01 — Área do Aluno"
        visible={vis('card_area_aluno')}
        onToggle={() => s('card_area_aluno', 'visivel', !vis('card_area_aluno'))}
        onSave={() => save('card_area_aluno', data.card_area_aluno)}
        saving={saving === 'card_area_aluno'}
      >
        <G2 mb="1rem">
          <Field label="Marker">
            <TI value={v('card_area_aluno', 'marker')} onChange={val => s('card_area_aluno', 'marker', val)} placeholder="Plataforma exclusiva" />
          </Field>
          <Field label="Título">
            <TI value={v('card_area_aluno', 'titulo')} onChange={val => s('card_area_aluno', 'titulo', val)} placeholder="Área do Aluno" />
          </Field>
        </G2>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Descrição">
            <TA value={v('card_area_aluno', 'descricao')} onChange={val => s('card_area_aluno', 'descricao', val)} rows={2} />
          </Field>
        </div>
        <G2 mb="0">
          <Field label="Link — texto">
            <TI value={v('card_area_aluno', 'link_texto')} onChange={val => s('card_area_aluno', 'link_texto', val)} placeholder="Acessar plataforma" />
          </Field>
          <Field label="Link — URL" help="Controlado pela flag lms.liberado em Configurações → LMS">
            <TI value={v('card_area_aluno', 'link_url')} onChange={val => s('card_area_aluno', 'link_url', val)} placeholder="#/area-do-aluno" />
          </Field>
        </G2>
        <div style={{ marginTop: '1rem', padding: '.9rem 1rem', background: 'rgba(143,110,74,.07)', border: '1px solid rgba(143,110,74,.2)' }}>
          <p style={{ fontFamily: 'var(--fb)', fontSize: '.78rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>
            <strong>Atenção:</strong> quando a flag <strong>lms.liberado</strong> estiver ativa (Configurações → LMS), o link do botão
            de Área do Aluno no nav é substituído automaticamente pela URL do LMS — independente do valor acima.
          </p>
        </div>
      </SectionBlock>

      {/* Card 02 — Udemy */}
      <SectionBlock
        title="Card 02 — Udemy"
        visible={vis('card_udemy')}
        onToggle={() => s('card_udemy', 'visivel', !vis('card_udemy'))}
        onSave={() => save('card_udemy', data.card_udemy)}
        saving={saving === 'card_udemy'}
      >
        <G2 mb="1rem">
          <Field label="Marker">
            <TI value={v('card_udemy', 'marker')} onChange={val => s('card_udemy', 'marker', val)} placeholder="Cursos online" />
          </Field>
          <Field label="Título">
            <TI value={v('card_udemy', 'titulo')} onChange={val => s('card_udemy', 'titulo', val)} placeholder="Cursos na Udemy" />
          </Field>
        </G2>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Descrição">
            <TA value={v('card_udemy', 'descricao')} onChange={val => s('card_udemy', 'descricao', val)} rows={2} />
          </Field>
        </div>
        <G2 mb="0">
          <Field label="Link — texto">
            <TI value={v('card_udemy', 'link_texto')} onChange={val => s('card_udemy', 'link_texto', val)} placeholder="Ver cursos na Udemy" />
          </Field>
          <Field label="Link — URL">
            <TI value={v('card_udemy', 'link_url')} onChange={val => s('card_udemy', 'link_url', val)} placeholder="https://udemy.com/..." />
          </Field>
        </G2>
      </SectionBlock>

      {/* Card 03 — ESPM */}
      <SectionBlock
        title="Card 03 — ESPM"
        visible={vis('card_espm')}
        onToggle={() => s('card_espm', 'visivel', !vis('card_espm'))}
        onSave={() => save('card_espm', data.card_espm)}
        saving={saving === 'card_espm'}
      >
        <G2 mb="1rem">
          <Field label="Marker">
            <TI value={v('card_espm', 'marker')} onChange={val => s('card_espm', 'marker', val)} placeholder="MBA e Pós-graduação" />
          </Field>
          <Field label="Título">
            <TI value={v('card_espm', 'titulo')} onChange={val => s('card_espm', 'titulo', val)} placeholder="Cursos na ESPM" />
          </Field>
        </G2>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Descrição">
            <TA value={v('card_espm', 'descricao')} onChange={val => s('card_espm', 'descricao', val)} rows={2} />
          </Field>
        </div>
        <G2 mb="0">
          <Field label="Link — texto">
            <TI value={v('card_espm', 'link_texto')} onChange={val => s('card_espm', 'link_texto', val)} placeholder="Ver cursos na ESPM" />
          </Field>
          <Field label="Link — URL">
            <TI value={v('card_espm', 'link_url')} onChange={val => s('card_espm', 'link_url', val)} placeholder="https://espm.br/..." />
          </Field>
        </G2>
      </SectionBlock>

      {/* Card 04 — Amazon */}
      <SectionBlock
        title="Card 04 — Amazon (Livros)"
        visible={vis('card_amazon')}
        onToggle={() => s('card_amazon', 'visivel', !vis('card_amazon'))}
        onSave={() => save('card_amazon', data.card_amazon)}
        saving={saving === 'card_amazon'}
      >
        <G2 mb="1rem">
          <Field label="Marker">
            <TI value={v('card_amazon', 'marker')} onChange={val => s('card_amazon', 'marker', val)} placeholder="Publicações" />
          </Field>
          <Field label="Título">
            <TI value={v('card_amazon', 'titulo')} onChange={val => s('card_amazon', 'titulo', val)} placeholder="Livros na Amazon" />
          </Field>
        </G2>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Descrição">
            <TA value={v('card_amazon', 'descricao')} onChange={val => s('card_amazon', 'descricao', val)} rows={2} />
          </Field>
        </div>
        <G2 mb="1rem">
          <Field label="Link — texto">
            <TI value={v('card_amazon', 'link_texto')} onChange={val => s('card_amazon', 'link_texto', val)} placeholder="Ver na Amazon" />
          </Field>
          <Field label="Link — URL">
            <TI value={v('card_amazon', 'link_url')} onChange={val => s('card_amazon', 'link_url', val)} placeholder="https://amazon.com.br/..." />
          </Field>
        </G2>
        <div style={{ marginBottom: '.6rem' }}>
          <Field label="Livro 1 — título">
            <TI value={v('card_amazon', 'livro_1_titulo')} onChange={val => s('card_amazon', 'livro_1_titulo', val)} placeholder="Gestão de Equipes Comerciais" />
          </Field>
        </div>
        <div style={{ marginBottom: '.6rem' }}>
          <Field label="Livro 2 — título">
            <TI value={v('card_amazon', 'livro_2_titulo')} onChange={val => s('card_amazon', 'livro_2_titulo', val)} placeholder="Vendas B2B: Processo e Método" />
          </Field>
        </div>
        <Field label="Livro 3 — título">
          <TI value={v('card_amazon', 'livro_3_titulo')} onChange={val => s('card_amazon', 'livro_3_titulo', val)} placeholder="A Arte da Negociação Comercial" />
        </Field>
      </SectionBlock>

      {/* CTA Final */}
      <SectionBlock
        title="CTA Final"
        visible={vis('cta_final')}
        onToggle={() => s('cta_final', 'visivel', !vis('cta_final'))}
        onSave={() => save('cta_final', data.cta_final)}
        saving={saving === 'cta_final'}
      >
        <G2 mb="1rem">
          <Field label="Eyebrow">
            <TI value={v('cta_final', 'eyebrow')} onChange={val => s('cta_final', 'eyebrow', val)} placeholder="Próximo passo" />
          </Field>
          <Field label="Título">
            <TI value={v('cta_final', 'titulo')} onChange={val => s('cta_final', 'titulo', val)} placeholder="Vamos conversar sobre o seu desafio?" />
          </Field>
        </G2>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Subtexto">
            <TA value={v('cta_final', 'subtexto')} onChange={val => s('cta_final', 'subtexto', val)} rows={2} />
          </Field>
        </div>
        <G2 mb="0">
          <Field label="CTA primário — texto">
            <TI value={v('cta_final', 'cta_primario_texto')} onChange={val => s('cta_final', 'cta_primario_texto', val)} placeholder="Fale Comigo" />
          </Field>
          <Field label="CTA primário — link">
            <TI value={v('cta_final', 'cta_primario_link')} onChange={val => s('cta_final', 'cta_primario_link', val)} placeholder="#/fale-comigo" />
          </Field>
          <Field label="CTA secundário — texto">
            <TI value={v('cta_final', 'cta_secundario_texto')} onChange={val => s('cta_final', 'cta_secundario_texto', val)} placeholder="Ver serviços" />
          </Field>
          <Field label="CTA secundário — link">
            <TI value={v('cta_final', 'cta_secundario_link')} onChange={val => s('cta_final', 'cta_secundario_link', val)} placeholder="#/servicos" />
          </Field>
        </G2>
      </SectionBlock>

      {/* Supabase info note */}
      <div style={{ background: 'rgba(30,58,138,.06)', border: '1px solid rgba(30,58,138,.18)', padding: '1.2rem 1.4rem' }}>
        <div style={{ ...aS.eyebrow, marginBottom: '.5rem' }}>Ferramentas e Templates</div>
        <p style={{ fontFamily: 'var(--fb)', fontSize: '.82rem', color: 'var(--ink-3)', lineHeight: 1.7 }}>
          ℹ️ As ferramentas exibidas na grade vêm do Supabase. Para gerenciá-las, acesse o painel do Supabase e ajuste o
          campo <strong>visivel_no_site</strong> de cada recurso.
        </p>
      </div>
    </>
  );
};
