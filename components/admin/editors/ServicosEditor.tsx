import React from 'react';
import { Field, TI, TA, SectionBlock, G2, G3, SubCard, useSectionSave } from '../adminEditorHelpers';
import { aS } from '../adminStyles';

interface Props {
  data: any;
  onChange: (path: string, val: any) => void;
  onSave: (section: string, data: any) => Promise<void>;
}

export const ServicosEditor: React.FC<Props> = ({ data, onChange, onSave }) => {
  const { saving, save } = useSectionSave(onSave);
  const s = (sec: string, field: string, val: any) => onChange(`${sec}.${field}`, val);
  const v = (sec: string, field: string) => data?.[sec]?.[field] ?? '';
  const vis = (sec: string) => data?.[sec]?.visivel !== false;
  const tv = (sec: string) => s(sec, 'visivel', !vis(sec));

  return (
    <>
      {/* Hero */}
      <SectionBlock title="Hero" visible={vis('hero')} onToggle={() => tv('hero')} onSave={() => save('hero', data.hero)} saving={saving === 'hero'} defaultOpen>
        <G2 mb="1rem">
          <Field label="Eyebrow"><TI value={v('hero','eyebrow')} onChange={val => s('hero','eyebrow',val)} /></Field>
          <Field label="Subtexto"><TA value={v('hero','subtexto')} onChange={val => s('hero','subtexto',val)} rows={2} /></Field>
          <Field label="Título linha 1"><TI value={v('hero','titulo_linha1')} onChange={val => s('hero','titulo_linha1',val)} /></Field>
          <Field label="Título linha 2"><TI value={v('hero','titulo_linha2')} onChange={val => s('hero','titulo_linha2',val)} /></Field>
          <Field label="Título destaque"><TI value={v('hero','titulo_destaque')} onChange={val => s('hero','titulo_destaque',val)} /></Field>
        </G2>
      </SectionBlock>

      {/* Intro / Como escolher */}
      <SectionBlock title="Intro — Como escolher" visible={vis('intro')} onToggle={() => tv('intro')} onSave={() => save('intro', data.intro)} saving={saving === 'intro'}>
        <G3 mb="1rem">
          <Field label="Eyebrow"><TI value={v('intro','eyebrow')} onChange={val => s('intro','eyebrow',val)} /></Field>
          <Field label="Título"><TI value={v('intro','titulo')} onChange={val => s('intro','titulo',val)} /></Field>
          <Field label="Card 'Como escolher' — label"><TI value={v('intro','card_como_escolher_label')} onChange={val => s('intro','card_como_escolher_label',val)} /></Field>
        </G3>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Intro texto"><TA value={v('intro','intro_texto')} onChange={val => s('intro','intro_texto',val)} rows={3} /></Field>
        </div>
        {[1,2,3,4].map(n => (
          <SubCard key={n} label={`Opção ${n}`}>
            <G2 mb="0">
              <Field label="Título"><TI value={v('intro',`opcao_${n}_titulo`)} onChange={val => s('intro',`opcao_${n}_titulo`,val)} /></Field>
              <Field label="Descrição"><TI value={v('intro',`opcao_${n}_descricao`)} onChange={val => s('intro',`opcao_${n}_descricao`,val)} /></Field>
            </G2>
          </SubCard>
        ))}
      </SectionBlock>

      {/* Cards dos 4 serviços */}
      <SectionBlock title="Cards dos 4 Serviços" visible={vis('cards_servicos')} onToggle={() => tv('cards_servicos')} onSave={() => save('cards_servicos', data.cards_servicos)} saving={saving === 'cards_servicos'}>
        {[
          {n:1, nome:'Mentoria'},
          {n:2, nome:'Consultoria'},
          {n:3, nome:'Cursos e Formações'},
          {n:4, nome:'Conteúdo'},
        ].map(({ n, nome }) => (
          <SubCard key={n} label={`Serviço ${n} — ${nome}`}>
            <G3 mb=".8rem">
              <Field label="Número"><TI value={v('cards_servicos',`servico_${n}_numero`)} onChange={val => s('cards_servicos',`servico_${n}_numero`,val)} placeholder={String(n).padStart(2,'0')} /></Field>
              <Field label="Tipo label"><TI value={v('cards_servicos',`servico_${n}_tipo_label`)} onChange={val => s('cards_servicos',`servico_${n}_tipo_label`,val)} /></Field>
              <Field label="Título"><TI value={v('cards_servicos',`servico_${n}_titulo`)} onChange={val => s('cards_servicos',`servico_${n}_titulo`,val)} placeholder={nome} /></Field>
            </G3>
            <div style={{ marginBottom: '.8rem' }}>
              <Field label="Descrição"><TA value={v('cards_servicos',`servico_${n}_descricao`)} onChange={val => s('cards_servicos',`servico_${n}_descricao`,val)} rows={2} /></Field>
            </div>
            <G3 mb=".8rem">
              <Field label="Link — texto"><TI value={v('cards_servicos',`servico_${n}_link_texto`)} onChange={val => s('cards_servicos',`servico_${n}_link_texto`,val)} /></Field>
              <Field label="Link — URL" col={2}><TI value={v('cards_servicos',`servico_${n}_link_url`)} onChange={val => s('cards_servicos',`servico_${n}_link_url`,val)} /></Field>
            </G3>
            <Field label="Tags (separadas por vírgula)">
              <input
                style={{ fontFamily: 'var(--fb)', fontSize: '.85rem', color: 'var(--ink)', width: '100%', padding: '.65rem .9rem', background: 'var(--cream-d)', border: '1px solid var(--rule)', outline: 'none', boxSizing: 'border-box' as const }}
                value={(data?.cards_servicos?.[`servico_${n}_tags`] || []).join(', ')}
                onChange={e => s('cards_servicos',`servico_${n}_tags`, e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))}
                placeholder="Tag 1, Tag 2, ..."
              />
            </Field>
          </SubCard>
        ))}
      </SectionBlock>

      {/* Comparativo */}
      <SectionBlock title="Comparativo (4 colunas)" visible={vis('comparativo')} onToggle={() => tv('comparativo')} onSave={() => save('comparativo', data.comparativo)} saving={saving === 'comparativo'}>
        <G2 mb="1rem">
          <Field label="Eyebrow"><TI value={v('comparativo','eyebrow')} onChange={val => s('comparativo','eyebrow',val)} /></Field>
          <Field label="Título"><TI value={v('comparativo','titulo')} onChange={val => s('comparativo','titulo',val)} /></Field>
        </G2>
        {[1,2,3,4].map(n => (
          <SubCard key={n} label={`Coluna ${n}`}>
            <div style={{ marginBottom: '.8rem' }}>
              <Field label="Título da coluna"><TI value={v('comparativo',`col_${n}_titulo`)} onChange={val => s('comparativo',`col_${n}_titulo`,val)} /></Field>
            </div>
            <Field label="Itens (um por linha)">
              <textarea
                style={aS.textarea}
                rows={4}
                value={(data?.comparativo?.[`col_${n}_itens`] || []).join('\n')}
                onChange={e => s('comparativo', `col_${n}_itens`, e.target.value.split('\n').map((t: string) => t.trim()).filter(Boolean))}
                placeholder="Item 1&#10;Item 2&#10;Item 3"
              />
            </Field>
          </SubCard>
        ))}
      </SectionBlock>

      {/* CTA Final */}
      <SectionBlock title="CTA Final" visible={vis('cta_final')} onToggle={() => tv('cta_final')} onSave={() => save('cta_final', data.cta_final)} saving={saving === 'cta_final'}>
        <G3 mb="1rem">
          <Field label="Eyebrow"><TI value={v('cta_final','eyebrow')} onChange={val => s('cta_final','eyebrow',val)} /></Field>
          <Field label="Título"><TI value={v('cta_final','titulo')} onChange={val => s('cta_final','titulo',val)} /></Field>
        </G3>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Subtexto"><TA value={v('cta_final','subtexto')} onChange={val => s('cta_final','subtexto',val)} rows={2} /></Field>
        </div>
        <G2 mb="0">
          <Field label="CTA primário — texto"><TI value={v('cta_final','cta_primario_texto')} onChange={val => s('cta_final','cta_primario_texto',val)} /></Field>
          <Field label="CTA primário — link"><TI value={v('cta_final','cta_primario_link')} onChange={val => s('cta_final','cta_primario_link',val)} /></Field>
          <Field label="CTA secundário — texto"><TI value={v('cta_final','cta_secundario_texto')} onChange={val => s('cta_final','cta_secundario_texto',val)} /></Field>
          <Field label="CTA secundário — link"><TI value={v('cta_final','cta_secundario_link')} onChange={val => s('cta_final','cta_secundario_link',val)} /></Field>
        </G2>
      </SectionBlock>
    </>
  );
};
