import React from 'react';
import { Field, TI, TA, FAQEditor, SectionBlock, G2, G3, SubCard, useSectionSave } from '../adminEditorHelpers';

interface Props {
  data: any;
  onChange: (path: string, val: any) => void;
  onSave: (section: string, data: any) => Promise<void>;
}

export const ConsultoriaEditor: React.FC<Props> = ({ data, onChange, onSave }) => {
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
          <Field label="Subtexto"><TI value={v('hero','subtexto')} onChange={val => s('hero','subtexto',val)} /></Field>
          <Field label="Título linha 1"><TI value={v('hero','titulo_linha1')} onChange={val => s('hero','titulo_linha1',val)} /></Field>
          <Field label="Título linha 2"><TI value={v('hero','titulo_linha2')} onChange={val => s('hero','titulo_linha2',val)} /></Field>
          <Field label="Título destaque"><TI value={v('hero','titulo_destaque')} onChange={val => s('hero','titulo_destaque',val)} /></Field>
        </G2>
        <G2 mb="0">
          <Field label="CTA primário — texto"><TI value={v('hero','cta_primario_texto')} onChange={val => s('hero','cta_primario_texto',val)} /></Field>
          <Field label="CTA primário — link"><TI value={v('hero','cta_primario_link')} onChange={val => s('hero','cta_primario_link',val)} /></Field>
          <Field label="CTA secundário — texto"><TI value={v('hero','cta_secundario_texto')} onChange={val => s('hero','cta_secundario_texto',val)} /></Field>
          <Field label="CTA secundário — link"><TI value={v('hero','cta_secundario_link')} onChange={val => s('hero','cta_secundario_link',val)} /></Field>
        </G2>
      </SectionBlock>

      {/* Problema */}
      <SectionBlock title="Problema" visible={vis('problema')} onToggle={() => tv('problema')} onSave={() => save('problema', data.problema)} saving={saving === 'problema'}>
        <G2 mb="1rem">
          <Field label="Eyebrow"><TI value={v('problema','eyebrow')} onChange={val => s('problema','eyebrow',val)} /></Field>
          <Field label="Título"><TI value={v('problema','titulo')} onChange={val => s('problema','titulo',val)} /></Field>
        </G2>
        {[1,2,3,4,5].map(n => (
          <div key={n} style={{ marginBottom: '.5rem' }}>
            <Field label={`Problema ${n}`}><TI value={v('problema',`problema_${n}`)} onChange={val => s('problema',`problema_${n}`,val)} /></Field>
          </div>
        ))}
        <Field label="Citação"><TA value={v('problema','citacao_texto')} onChange={val => s('problema','citacao_texto',val)} rows={2} /></Field>
      </SectionBlock>

      {/* Frentes de atuação */}
      <SectionBlock title="Frentes de atuação (6 cards)" visible={vis('frentes')} onToggle={() => tv('frentes')} onSave={() => save('frentes', data.frentes)} saving={saving === 'frentes'}>
        <G2 mb="1rem">
          <Field label="Eyebrow"><TI value={v('frentes','eyebrow')} onChange={val => s('frentes','eyebrow',val)} /></Field>
          <Field label="Título"><TI value={v('frentes','titulo')} onChange={val => s('frentes','titulo',val)} /></Field>
        </G2>
        {[1,2,3,4,5,6].map(n => (
          <SubCard key={n} label={`Card ${n}`}>
            <G2 mb="0">
              <Field label="Título"><TI value={v('frentes',`card_${n}_titulo`)} onChange={val => s('frentes',`card_${n}_titulo`,val)} /></Field>
              <Field label="Descrição"><TI value={v('frentes',`card_${n}_descricao`)} onChange={val => s('frentes',`card_${n}_descricao`,val)} /></Field>
            </G2>
          </SubCard>
        ))}
      </SectionBlock>

      {/* Método */}
      <SectionBlock title="Método (5 etapas)" visible={vis('metodo')} onToggle={() => tv('metodo')} onSave={() => save('metodo', data.metodo)} saving={saving === 'metodo'}>
        <G2 mb="1rem">
          <Field label="Eyebrow"><TI value={v('metodo','eyebrow')} onChange={val => s('metodo','eyebrow',val)} /></Field>
          <Field label="Título"><TI value={v('metodo','titulo')} onChange={val => s('metodo','titulo',val)} /></Field>
        </G2>
        {[1,2,3,4,5].map(n => (
          <SubCard key={n} label={`Etapa ${n}`}>
            <G3 mb=".8rem">
              <Field label="Nome"><TI value={v('metodo',`etapa_${n}_nome`)} onChange={val => s('metodo',`etapa_${n}_nome`,val)} /></Field>
              <Field label="Tag"><TI value={v('metodo',`etapa_${n}_tag`)} onChange={val => s('metodo',`etapa_${n}_tag`,val)} /></Field>
              <Field label="Entregável"><TI value={v('metodo',`etapa_${n}_entregavel`)} onChange={val => s('metodo',`etapa_${n}_entregavel`,val)} /></Field>
            </G3>
            <Field label="Descrição"><TA value={v('metodo',`etapa_${n}_descricao`)} onChange={val => s('metodo',`etapa_${n}_descricao`,val)} rows={2} /></Field>
          </SubCard>
        ))}
      </SectionBlock>

      {/* Para quem */}
      <SectionBlock title="Para quem" visible={vis('para_quem')} onToggle={() => tv('para_quem')} onSave={() => save('para_quem', data.para_quem)} saving={saving === 'para_quem'}>
        <G2 mb="1rem">
          <Field label="Eyebrow"><TI value={v('para_quem','eyebrow')} onChange={val => s('para_quem','eyebrow',val)} /></Field>
          <Field label="Título"><TI value={v('para_quem','titulo')} onChange={val => s('para_quem','titulo',val)} /></Field>
        </G2>
        {[1,2,3,4,5].map(n => (
          <div key={n} style={{ marginBottom: '.5rem' }}>
            <Field label={`Para quem ${n}`}><TI value={v('para_quem',`para_quem_${n}`)} onChange={val => s('para_quem',`para_quem_${n}`,val)} /></Field>
          </div>
        ))}
        <SubCard label="Card de setores">
          <Field label="Label"><TI value={v('para_quem','card_setores_label')} onChange={val => s('para_quem','card_setores_label',val)} /></Field>
          <div style={{ marginTop: '.8rem' }}>
            <Field label="Tags de setores (separadas por vírgula)">
              <input
                style={{ fontFamily: 'var(--fb)', fontSize: '.85rem', color: 'var(--ink)', width: '100%', padding: '.65rem .9rem', background: 'var(--cream-d)', border: '1px solid var(--rule)', outline: 'none', boxSizing: 'border-box' as const }}
                value={(data?.para_quem?.card_setores_tags || []).join(', ')}
                onChange={e => s('para_quem','card_setores_tags', e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))}
                placeholder="Indústria, Varejo, Serviços, ..."
              />
            </Field>
          </div>
        </SubCard>
      </SectionBlock>

      {/* Diferencial */}
      <SectionBlock title="Diferencial" visible={vis('diferencial')} onToggle={() => tv('diferencial')} onSave={() => save('diferencial', data.diferencial)} saving={saving === 'diferencial'}>
        <G2 mb="1rem">
          <Field label="Eyebrow"><TI value={v('diferencial','eyebrow')} onChange={val => s('diferencial','eyebrow',val)} /></Field>
          <Field label="Título"><TI value={v('diferencial','titulo')} onChange={val => s('diferencial','titulo',val)} /></Field>
        </G2>
        {[1,2,3,4].map(n => (
          <SubCard key={n} label={`Ponto ${n}`}>
            <G2 mb=".8rem">
              <Field label="Título"><TI value={v('diferencial',`ponto_${n}_titulo`)} onChange={val => s('diferencial',`ponto_${n}_titulo`,val)} /></Field>
              <Field label="Descrição"><TI value={v('diferencial',`ponto_${n}_descricao`)} onChange={val => s('diferencial',`ponto_${n}_descricao`,val)} /></Field>
            </G2>
          </SubCard>
        ))}
        <Field label="Citação de encerramento"><TA value={v('diferencial','citacao_texto')} onChange={val => s('diferencial','citacao_texto',val)} rows={2} /></Field>
      </SectionBlock>

      {/* FAQ */}
      <SectionBlock title="FAQ" visible={vis('faq')} onToggle={() => tv('faq')} onSave={() => save('faq', data.faq)} saving={saving === 'faq'}>
        <FAQEditor items={data?.faq?.faq || []} onChange={items => onChange('faq.faq', items)} />
      </SectionBlock>

      {/* CTA Final */}
      <SectionBlock title="CTA Final" visible={vis('cta_final')} onToggle={() => tv('cta_final')} onSave={() => save('cta_final', data.cta_final)} saving={saving === 'cta_final'}>
        <G3 mb="1rem">
          <Field label="Eyebrow"><TI value={v('cta_final','eyebrow')} onChange={val => s('cta_final','eyebrow',val)} /></Field>
          <Field label="Título linha 1"><TI value={v('cta_final','titulo_linha1')} onChange={val => s('cta_final','titulo_linha1',val)} /></Field>
          <Field label="Título destaque"><TI value={v('cta_final','titulo_destaque')} onChange={val => s('cta_final','titulo_destaque',val)} /></Field>
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
