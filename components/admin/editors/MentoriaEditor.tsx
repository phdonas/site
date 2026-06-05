import React from 'react';
import { Field, TI, TA, FAQEditor, SectionBlock, G2, G3, SubCard, useSectionSave, FAQItem } from '../adminEditorHelpers';

interface Props {
  data: any;
  onChange: (path: string, val: any) => void;
  onSave: (section: string, data: any) => Promise<void>;
}

export const MentoriaEditor: React.FC<Props> = ({ data, onChange, onSave }) => {
  const { saving, save } = useSectionSave(onSave);

  const s = (sec: string, field: string, val: any) => onChange(`${sec}.${field}`, val);
  const v = (sec: string, field: string) => data?.[sec]?.[field] ?? '';
  const vis = (sec: string) => data?.[sec]?.visivel !== false;
  const toggleVis = (sec: string) => s(sec, 'visivel', !vis(sec));

  return (
    <>
      {/* Hero */}
      <SectionBlock title="Hero" visible={vis('hero')} onToggle={() => toggleVis('hero')} onSave={() => save('hero', data.hero)} saving={saving === 'hero'} defaultOpen>
        <G2>
          <Field label="Eyebrow"><TI value={v('hero','eyebrow')} onChange={val => s('hero','eyebrow',val)} placeholder="Mentoria Comercial" /></Field>
          <Field label="Subtexto"><TI value={v('hero','subtexto')} onChange={val => s('hero','subtexto',val)} /></Field>
          <Field label="Título linha 1"><TI value={v('hero','titulo_linha1')} onChange={val => s('hero','titulo_linha1',val)} /></Field>
          <Field label="Título linha 2"><TI value={v('hero','titulo_linha2')} onChange={val => s('hero','titulo_linha2',val)} /></Field>
          <Field label="Título destaque (itálico/gold)"><TI value={v('hero','titulo_destaque')} onChange={val => s('hero','titulo_destaque',val)} /></Field>
        </G2>
        <G2 mb="1rem">
          <Field label="CTA primário — texto"><TI value={v('hero','cta_primario_texto')} onChange={val => s('hero','cta_primario_texto',val)} /></Field>
          <Field label="CTA primário — link"><TI value={v('hero','cta_primario_link')} onChange={val => s('hero','cta_primario_link',val)} /></Field>
          <Field label="CTA secundário — texto"><TI value={v('hero','cta_secundario_texto')} onChange={val => s('hero','cta_secundario_texto',val)} /></Field>
          <Field label="CTA secundário — link"><TI value={v('hero','cta_secundario_link')} onChange={val => s('hero','cta_secundario_link',val)} /></Field>
        </G2>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Card — label"><TI value={v('hero','card_label')} onChange={val => s('hero','card_label',val)} placeholder="O programa em números" /></Field>
        </div>
        {[
          {n:1, titulo:'Dias de programa', numero:'90'},
          {n:2, titulo:'Sessões individuais', numero:'12'},
          {n:3, titulo:'Fases estruturadas', numero:'04'},
          {n:4, titulo:'Suporte WhatsApp', numero:'∞'},
        ].map(({ n, titulo, numero }) => (
          <SubCard key={n} label={`Stat ${n}`}>
            <G3>
              <Field label="Número"><TI value={v('hero',`card_stat_${n}_numero`)} onChange={val => s('hero',`card_stat_${n}_numero`,val)} placeholder={numero} /></Field>
              <Field label="Título"><TI value={v('hero',`card_stat_${n}_titulo`)} onChange={val => s('hero',`card_stat_${n}_titulo`,val)} placeholder={titulo} /></Field>
              <Field label="Descrição"><TI value={v('hero',`card_stat_${n}_descricao`)} onChange={val => s('hero',`card_stat_${n}_descricao`,val)} /></Field>
            </G3>
          </SubCard>
        ))}
      </SectionBlock>

      {/* Problema */}
      <SectionBlock title="Problema" visible={vis('problema')} onToggle={() => toggleVis('problema')} onSave={() => save('problema', data.problema)} saving={saving === 'problema'}>
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

      {/* Para quem */}
      <SectionBlock title="Para quem é" visible={vis('para_quem')} onToggle={() => toggleVis('para_quem')} onSave={() => save('para_quem', data.para_quem)} saving={saving === 'para_quem'}>
        <G2 mb="1rem">
          <Field label="Eyebrow"><TI value={v('para_quem','eyebrow')} onChange={val => s('para_quem','eyebrow',val)} /></Field>
          <Field label="Título"><TI value={v('para_quem','titulo')} onChange={val => s('para_quem','titulo',val)} /></Field>
        </G2>
        {[1,2,3,4,5].map(n => (
          <div key={n} style={{ marginBottom: '.5rem' }}>
            <Field label={`Para quem ${n}`}><TI value={v('para_quem',`para_quem_${n}`)} onChange={val => s('para_quem',`para_quem_${n}`,val)} /></Field>
          </div>
        ))}
        <div style={{ marginTop: '1rem' }}>
          <Field label="Não é para quem — título"><TI value={v('para_quem','nao_para_quem_titulo')} onChange={val => s('para_quem','nao_para_quem_titulo',val)} /></Field>
        </div>
        {[1,2,3,4].map(n => (
          <div key={n} style={{ marginBottom: '.5rem' }}>
            <Field label={`Não é para quem ${n}`}><TI value={v('para_quem',`nao_para_quem_${n}`)} onChange={val => s('para_quem',`nao_para_quem_${n}`,val)} /></Field>
          </div>
        ))}
        <SubCard label="Card de resultado">
          <G3>
            <Field label="Label"><TI value={v('para_quem','card_resultado_label')} onChange={val => s('para_quem','card_resultado_label',val)} /></Field>
            <Field label="Título"><TI value={v('para_quem','card_resultado_titulo')} onChange={val => s('para_quem','card_resultado_titulo',val)} /></Field>
            <Field label="Subtexto"><TI value={v('para_quem','card_resultado_subtexto')} onChange={val => s('para_quem','card_resultado_subtexto',val)} /></Field>
          </G3>
          <G3>
            {[1,2,3].map(n => (
              <React.Fragment key={n}>
                <Field label={`Stat ${n} — número`}><TI value={v('para_quem',`card_stat_${n}_numero`)} onChange={val => s('para_quem',`card_stat_${n}_numero`,val)} /></Field>
                <Field label={`Stat ${n} — label`}><TI value={v('para_quem',`card_stat_${n}_label`)} onChange={val => s('para_quem',`card_stat_${n}_label`,val)} /></Field>
              </React.Fragment>
            ))}
          </G3>
        </SubCard>
      </SectionBlock>

      {/* Como funciona */}
      <SectionBlock title="Como funciona (4 fases)" visible={vis('como_funciona')} onToggle={() => toggleVis('como_funciona')} onSave={() => save('como_funciona', data.como_funciona)} saving={saving === 'como_funciona'}>
        <G3 mb="1rem">
          <Field label="Eyebrow"><TI value={v('como_funciona','eyebrow')} onChange={val => s('como_funciona','eyebrow',val)} /></Field>
          <Field label="Título"><TI value={v('como_funciona','titulo')} onChange={val => s('como_funciona','titulo',val)} /></Field>
          <Field label="Subtexto"><TI value={v('como_funciona','subtexto')} onChange={val => s('como_funciona','subtexto',val)} /></Field>
        </G3>
        {[
          {n:1, nome:'Diagnóstico', semanas:'Semanas 1 a 3'},
          {n:2, nome:'Plano', semanas:'Semanas 4 a 6'},
          {n:3, nome:'Implementação', semanas:'Semanas 7 a 10'},
          {n:4, nome:'Consolidação', semanas:'Semanas 11 e 12'},
        ].map(({ n, nome, semanas }) => (
          <SubCard key={n} label={`Fase ${n}`}>
            <G3 mb=".8rem">
              <Field label="Nome da fase"><TI value={v('como_funciona',`fase_${n}_nome`)} onChange={val => s('como_funciona',`fase_${n}_nome`,val)} placeholder={nome} /></Field>
              <Field label="Semanas"><TI value={v('como_funciona',`fase_${n}_semanas`)} onChange={val => s('como_funciona',`fase_${n}_semanas`,val)} placeholder={semanas} /></Field>
              <Field label="Entregável"><TI value={v('como_funciona',`fase_${n}_entregavel`)} onChange={val => s('como_funciona',`fase_${n}_entregavel`,val)} /></Field>
            </G3>
            <Field label="Descrição"><TA value={v('como_funciona',`fase_${n}_descricao`)} onChange={val => s('como_funciona',`fase_${n}_descricao`,val)} rows={2} /></Field>
          </SubCard>
        ))}
      </SectionBlock>

      {/* Inclusos */}
      <SectionBlock title="Inclusos no programa" visible={vis('inclusos')} onToggle={() => toggleVis('inclusos')} onSave={() => save('inclusos', data.inclusos)} saving={saving === 'inclusos'}>
        <G2 mb="1rem">
          <Field label="Eyebrow"><TI value={v('inclusos','eyebrow')} onChange={val => s('inclusos','eyebrow',val)} /></Field>
          <Field label="Título"><TI value={v('inclusos','titulo')} onChange={val => s('inclusos','titulo',val)} /></Field>
        </G2>
        {[1,2,3,4,5,6].map(n => (
          <div key={n} style={{ marginBottom: '.5rem' }}>
            <Field label={`Incluso ${n}`}><TI value={v('inclusos',`incluso_${n}`)} onChange={val => s('inclusos',`incluso_${n}`,val)} /></Field>
          </div>
        ))}
        <SubCard label="Resumo em stats">
          <Field label="Label"><TI value={v('inclusos','resumo_label')} onChange={val => s('inclusos','resumo_label',val)} /></Field>
          <div style={{ marginTop: '.8rem' }}>
            {[1,2,3,4].map(n => (
              <G3 key={n} mb=".6rem">
                <Field label={`Stat ${n} — número`}><TI value={v('inclusos',`resumo_stat_${n}_numero`)} onChange={val => s('inclusos',`resumo_stat_${n}_numero`,val)} /></Field>
                <Field label="Título"><TI value={v('inclusos',`resumo_stat_${n}_titulo`)} onChange={val => s('inclusos',`resumo_stat_${n}_titulo`,val)} /></Field>
                <Field label="Descrição"><TI value={v('inclusos',`resumo_stat_${n}_descricao`)} onChange={val => s('inclusos',`resumo_stat_${n}_descricao`,val)} /></Field>
              </G3>
            ))}
          </div>
        </SubCard>
      </SectionBlock>

      {/* Mentoria Customizada */}
      <SectionBlock title="Mentoria Customizada" visible={vis('mentoria_customizada')} onToggle={() => toggleVis('mentoria_customizada')} onSave={() => save('mentoria_customizada', data.mentoria_customizada)} saving={saving === 'mentoria_customizada'}>
        <G2 mb="1rem">
          <Field label="Eyebrow"><TI value={v('mentoria_customizada','eyebrow')} onChange={val => s('mentoria_customizada','eyebrow',val)} /></Field>
          <Field label="Título"><TI value={v('mentoria_customizada','titulo')} onChange={val => s('mentoria_customizada','titulo',val)} /></Field>
        </G2>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Intro texto"><TA value={v('mentoria_customizada','intro_texto')} onChange={val => s('mentoria_customizada','intro_texto',val)} rows={2} /></Field>
        </div>
        {[
          {n:1, titulo:'Mentoria Individual Personalizada'},
          {n:2, titulo:'Mentoria em Grupo'},
          {n:3, titulo:'Projeto Corporativo'},
        ].map(({ n, titulo }) => (
          <SubCard key={n} label={`Card ${n}`}>
            <G2 mb=".8rem">
              <Field label="Número"><TI value={v('mentoria_customizada',`card_${n}_num`)} onChange={val => s('mentoria_customizada',`card_${n}_num`,val)} placeholder={String(n).padStart(2,'0')} /></Field>
              <Field label="Título"><TI value={v('mentoria_customizada',`card_${n}_titulo`)} onChange={val => s('mentoria_customizada',`card_${n}_titulo`,val)} placeholder={titulo} /></Field>
            </G2>
            <div style={{ marginBottom: '.6rem' }}>
              <Field label="Descrição"><TA value={v('mentoria_customizada',`card_${n}_descricao`)} onChange={val => s('mentoria_customizada',`card_${n}_descricao`,val)} rows={2} /></Field>
            </div>
            <Field label="Tags (separadas por vírgula)">
              <input style={{ fontFamily: 'var(--fb)', fontSize: '.85rem', color: 'var(--ink)', width: '100%', padding: '.65rem .9rem', background: 'var(--cream-d)', border: '1px solid var(--rule)', outline: 'none', boxSizing: 'border-box' as const }}
                value={(data?.mentoria_customizada?.[`card_${n}_tags`] || []).join(', ')}
                onChange={e => s('mentoria_customizada', `card_${n}_tags`, e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))}
                placeholder="Ex: Individual, 90 dias"
              />
            </Field>
          </SubCard>
        ))}
        <G3 mb="0">
          <Field label="CTA — frase"><TI value={v('mentoria_customizada','cta_texto_frase')} onChange={val => s('mentoria_customizada','cta_texto_frase',val)} /></Field>
          <Field label="CTA — botão texto"><TI value={v('mentoria_customizada','cta_botao_texto')} onChange={val => s('mentoria_customizada','cta_botao_texto',val)} /></Field>
          <Field label="CTA — botão link"><TI value={v('mentoria_customizada','cta_botao_link')} onChange={val => s('mentoria_customizada','cta_botao_link',val)} /></Field>
        </G3>
      </SectionBlock>

      {/* Sobre o Mentor */}
      <SectionBlock title="Sobre o Mentor" visible={vis('sobre_mentor')} onToggle={() => toggleVis('sobre_mentor')} onSave={() => save('sobre_mentor', data.sobre_mentor)} saving={saving === 'sobre_mentor'}>
        <G2 mb="1rem">
          <Field label="Eyebrow"><TI value={v('sobre_mentor','eyebrow')} onChange={val => s('sobre_mentor','eyebrow',val)} /></Field>
          <Field label="Título linha 1"><TI value={v('sobre_mentor','titulo_linha1')} onChange={val => s('sobre_mentor','titulo_linha1',val)} /></Field>
          <Field label="Título destaque"><TI value={v('sobre_mentor','titulo_destaque')} onChange={val => s('sobre_mentor','titulo_destaque',val)} /></Field>
        </G2>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Citação"><TA value={v('sobre_mentor','citacao_texto')} onChange={val => s('sobre_mentor','citacao_texto',val)} rows={2} /></Field>
        </div>
        <SubCard label="Card do mentor">
          <G2 mb=".8rem">
            <Field label="Nome"><TI value={v('sobre_mentor','card_nome')} onChange={val => s('sobre_mentor','card_nome',val)} placeholder="Prof. Paulo H. Donassolo" /></Field>
            <Field label="Subtítulo"><TI value={v('sobre_mentor','card_subtitulo')} onChange={val => s('sobre_mentor','card_subtitulo',val)} /></Field>
          </G2>
          {[1,2,3,4,5].map(n => (
            <div key={n} style={{ marginBottom: '.5rem' }}>
              <Field label={`Item ${n}`}><TI value={v('sobre_mentor',`card_item_${n}`)} onChange={val => s('sobre_mentor',`card_item_${n}`,val)} /></Field>
            </div>
          ))}
        </SubCard>
        <p style={{ fontFamily: 'var(--fb)', fontSize: '.78rem', color: 'var(--ink-3)', marginBottom: '.8rem', lineHeight: 1.6 }}>
          A timeline completa é gerida na tab "Artigos e Mídia → Linha do Tempo".
        </p>
      </SectionBlock>

      {/* FAQ */}
      <SectionBlock title="FAQ" visible={vis('faq')} onToggle={() => toggleVis('faq')} onSave={() => save('faq', data.faq)} saving={saving === 'faq'}>
        <FAQEditor
          items={data?.faq?.faq || []}
          onChange={items => onChange('faq.faq', items)}
        />
      </SectionBlock>

      {/* CTA Final */}
      <SectionBlock title="CTA Final" visible={vis('cta_final')} onToggle={() => toggleVis('cta_final')} onSave={() => save('cta_final', data.cta_final)} saving={saving === 'cta_final'}>
        <G3 mb="1rem">
          <Field label="Eyebrow"><TI value={v('cta_final','eyebrow')} onChange={val => s('cta_final','eyebrow',val)} /></Field>
          <Field label="Título linha 1"><TI value={v('cta_final','titulo_linha1')} onChange={val => s('cta_final','titulo_linha1',val)} /></Field>
          <Field label="Título destaque"><TI value={v('cta_final','titulo_destaque')} onChange={val => s('cta_final','titulo_destaque',val)} /></Field>
        </G3>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Subtexto"><TA value={v('cta_final','subtexto')} onChange={val => s('cta_final','subtexto',val)} rows={2} /></Field>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Nota (ex: Sem compromisso)"><TI value={v('cta_final','nota')} onChange={val => s('cta_final','nota',val)} placeholder="Sem compromisso. Sem custo." /></Field>
        </div>
        <G2 mb="0">
          <Field label="CTA primário — texto"><TI value={v('cta_final','cta_primario_texto')} onChange={val => s('cta_final','cta_primario_texto',val)} placeholder="Agendar diagnóstico gratuito" /></Field>
          <Field label="CTA primário — link"><TI value={v('cta_final','cta_primario_link')} onChange={val => s('cta_final','cta_primario_link',val)} /></Field>
          <Field label="CTA secundário — texto"><TI value={v('cta_final','cta_secundario_texto')} onChange={val => s('cta_final','cta_secundario_texto',val)} /></Field>
          <Field label="CTA secundário — link"><TI value={v('cta_final','cta_secundario_link')} onChange={val => s('cta_final','cta_secundario_link',val)} /></Field>
        </G2>
      </SectionBlock>
    </>
  );
};
