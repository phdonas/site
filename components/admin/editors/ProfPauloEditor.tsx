import React from 'react';
import { Field, TI, TA, SectionBlock, G2, G3, SubCard, useSectionSave } from '../adminEditorHelpers';
import { ImageUploadField } from '../ImageUploadField';

interface Props {
  data: any;
  onChange: (path: string, val: any) => void;
  onSave: (section: string, data: any) => Promise<void>;
}

export const ProfPauloEditor: React.FC<Props> = ({ data, onChange, onSave }) => {
  const { saving, save } = useSectionSave(onSave);
  const s = (sec: string, field: string, val: any) => onChange(`${sec}.${field}`, val);
  const v = (sec: string, field: string) => data?.[sec]?.[field] ?? '';
  const vis = (sec: string) => data?.[sec]?.visivel !== false;
  const tv = (sec: string) => s(sec, 'visivel', !vis(sec));

  return (
    <>
      {/* Hero */}
      <SectionBlock title="Hero" visible={vis('hero')} onToggle={() => tv('hero')} onSave={() => save('hero', data.hero)} saving={saving === 'hero'} defaultOpen>
        <G3 mb="1rem">
          <Field label="Eyebrow"><TI value={v('hero','eyebrow')} onChange={val => s('hero','eyebrow',val)} /></Field>
          <Field label="Título linha 1"><TI value={v('hero','titulo_linha1')} onChange={val => s('hero','titulo_linha1',val)} placeholder="25 anos no campo." /></Field>
          <Field label="Título linha 2"><TI value={v('hero','titulo_linha2')} onChange={val => s('hero','titulo_linha2',val)} placeholder="20 anos na sala de aula." /></Field>
          <Field label="Título linha 3"><TI value={v('hero','titulo_linha3')} onChange={val => s('hero','titulo_linha3',val)} placeholder="Ainda aprendendo." /></Field>
        </G3>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Citação"><TA value={v('hero','citacao_texto')} onChange={val => s('hero','citacao_texto',val)} rows={2} /></Field>
        </div>
        {[1,2,3].map(n => (
          <G2 key={n} mb=".6rem">
            <Field label={`Credencial ${n} — número`}><TI value={v('hero',`credencial_${n}_numero`)} onChange={val => s('hero',`credencial_${n}_numero`,val)} /></Field>
            <Field label={`Credencial ${n} — label`}><TI value={v('hero',`credencial_${n}_label`)} onChange={val => s('hero',`credencial_${n}_label`,val)} /></Field>
          </G2>
        ))}
        <G2 mb="0">
          <Field label="Foto">
            <ImageUploadField
              value={v('hero','foto_url')}
              onChange={url => s('hero','foto_url',url)}
              specHint="Recomendado: 800×1067px · Proporção 3:4 · JPG · Máx 200kb"
              storageFolder="prof_paulo/hero"
              maxSizeKb={200}
            />
          </Field>
          <Field label="Foto — alt"><TI value={v('hero','foto_alt')} onChange={val => s('hero','foto_alt',val)} /></Field>
        </G2>
      </SectionBlock>

      {/* Narrativa */}
      <SectionBlock title="Narrativa" visible={vis('narrativa')} onToggle={() => tv('narrativa')} onSave={() => save('narrativa', data.narrativa)} saving={saving === 'narrativa'}>
        <G2 mb="1rem">
          <Field label="Eyebrow"><TI value={v('narrativa','eyebrow')} onChange={val => s('narrativa','eyebrow',val)} /></Field>
          <Field label="Título"><TI value={v('narrativa','titulo')} onChange={val => s('narrativa','titulo',val)} /></Field>
        </G2>
        {[1,2,3,4].map(n => (
          <div key={n} style={{ marginBottom: '1rem' }}>
            <Field label={`Parágrafo ${n}`}><TA value={v('narrativa',`paragrafo_${n}`)} onChange={val => s('narrativa',`paragrafo_${n}`,val)} rows={4} /></Field>
          </div>
        ))}
        <G2 mb="0">
          <Field label="Pullquote — texto"><TA value={v('narrativa','pullquote_texto')} onChange={val => s('narrativa','pullquote_texto',val)} rows={2} /></Field>
          <Field label="Pullquote — citação"><TI value={v('narrativa','pullquote_citacao')} onChange={val => s('narrativa','pullquote_citacao',val)} /></Field>
        </G2>
      </SectionBlock>

      {/* Linha do Tempo */}
      <SectionBlock title="Linha do Tempo" visible={vis('timeline')} onToggle={() => tv('timeline')} onSave={() => save('timeline', data.timeline)} saving={saving === 'timeline'}>
        <G2 mb="1rem">
          <Field label="Eyebrow"><TI value={v('timeline','eyebrow')} onChange={val => s('timeline','eyebrow',val)} /></Field>
          <Field label="Título"><TI value={v('timeline','titulo')} onChange={val => s('timeline','titulo',val)} /></Field>
        </G2>
        <div style={{ background: 'rgba(143,110,74,.08)', border: '1px solid rgba(143,110,74,.25)', padding: '1rem', fontFamily: 'var(--fb)', fontSize: '.8rem', color: 'var(--ink-3)', lineHeight: 1.7 }}>
          Os itens da linha do tempo são geridos na tab <strong>"Artigos e Mídia → Linha do Tempo"</strong>.
          Aqui você controla apenas o título e visibilidade da seção.
        </div>
      </SectionBlock>

      {/* Filosofia + Formação */}
      <SectionBlock title="Filosofia + Formação" visible={vis('filosofia')} onToggle={() => tv('filosofia')} onSave={() => save('filosofia', data.filosofia)} saving={saving === 'filosofia'}>
        <G2 mb="1rem">
          <Field label="Eyebrow"><TI value={v('filosofia','eyebrow')} onChange={val => s('filosofia','eyebrow',val)} /></Field>
          <Field label="Título"><TI value={v('filosofia','titulo')} onChange={val => s('filosofia','titulo',val)} /></Field>
        </G2>
        {[1,2,3,4].map(n => (
          <SubCard key={n} label={`Pilar ${n}`}>
            <G3 mb=".8rem">
              <Field label="Número"><TI value={v('filosofia',`pilar_${n}_numero`)} onChange={val => s('filosofia',`pilar_${n}_numero`,val)} /></Field>
              <Field label="Título" col={2}><TI value={v('filosofia',`pilar_${n}_titulo`)} onChange={val => s('filosofia',`pilar_${n}_titulo`,val)} placeholder={n===1 ? 'Prática → Conceito → Prática' : ''} /></Field>
            </G3>
            <Field label="Descrição"><TA value={v('filosofia',`pilar_${n}_descricao`)} onChange={val => s('filosofia',`pilar_${n}_descricao`,val)} rows={2} /></Field>
          </SubCard>
        ))}
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Citação"><TA value={v('filosofia','citacao_texto')} onChange={val => s('filosofia','citacao_texto',val)} rows={2} /></Field>
        </div>
        <SubCard label="Formação acadêmica">
          <Field label="Label da seção"><TI value={v('filosofia','formacao_label')} onChange={val => s('filosofia','formacao_label',val)} /></Field>
          <div style={{ marginTop: '.8rem' }}>
            {[
              {n:1, badge:'MSc'}, {n:2, badge:'MBA'}, {n:3, badge:'MBA'}, {n:4, badge:'IEFP'}, {n:5, badge:'IA'},
            ].map(({ n, badge }) => (
              <G3 key={n} mb=".6rem">
                <Field label="Badge"><TI value={v('filosofia',`formacao_item_${n}_badge`)} onChange={val => s('filosofia',`formacao_item_${n}_badge`,val)} placeholder={badge} /></Field>
                <Field label="Título"><TI value={v('filosofia',`formacao_item_${n}_titulo`)} onChange={val => s('filosofia',`formacao_item_${n}_titulo`,val)} /></Field>
                <Field label="Descrição"><TI value={v('filosofia',`formacao_item_${n}_descricao`)} onChange={val => s('filosofia',`formacao_item_${n}_descricao`,val)} /></Field>
              </G3>
            ))}
          </div>
        </SubCard>
      </SectionBlock>

      {/* Onde Leciona */}
      <SectionBlock title="Onde Leciona" visible={vis('onde_leciona')} onToggle={() => tv('onde_leciona')} onSave={() => save('onde_leciona', data.onde_leciona)} saving={saving === 'onde_leciona'}>
        <G3 mb="1rem">
          <Field label="Eyebrow"><TI value={v('onde_leciona','eyebrow')} onChange={val => s('onde_leciona','eyebrow',val)} /></Field>
          <Field label="Título"><TI value={v('onde_leciona','titulo')} onChange={val => s('onde_leciona','titulo',val)} /></Field>
          <Field label="Subtexto"><TI value={v('onde_leciona','subtexto')} onChange={val => s('onde_leciona','subtexto',val)} /></Field>
        </G3>
        {[
          {n:1, tipo:'MBA e Pós-graduação', nome:'ESPM'},
          {n:2, tipo:'Pós-graduação', nome:'Unisinos'},
          {n:3, tipo:'Corporativo', nome:'In-company'},
        ].map(({ n, tipo, nome }) => (
          <SubCard key={n} label={`Instituição ${n}`}>
            <G3 mb="0">
              <Field label="Tipo"><TI value={v('onde_leciona',`inst_${n}_tipo`)} onChange={val => s('onde_leciona',`inst_${n}_tipo`,val)} placeholder={tipo} /></Field>
              <Field label="Nome"><TI value={v('onde_leciona',`inst_${n}_nome`)} onChange={val => s('onde_leciona',`inst_${n}_nome`,val)} placeholder={nome} /></Field>
              <Field label="Descrição"><TI value={v('onde_leciona',`inst_${n}_descricao`)} onChange={val => s('onde_leciona',`inst_${n}_descricao`,val)} /></Field>
            </G3>
          </SubCard>
        ))}
      </SectionBlock>

      {/* Livros */}
      <SectionBlock title="Livros" visible={vis('livros')} onToggle={() => tv('livros')} onSave={() => save('livros', data.livros)} saving={saving === 'livros'}>
        <G3 mb="1rem">
          <Field label="Eyebrow"><TI value={v('livros','eyebrow')} onChange={val => s('livros','eyebrow',val)} /></Field>
          <Field label="Título"><TI value={v('livros','titulo')} onChange={val => s('livros','titulo',val)} /></Field>
          <Field label="Subtexto"><TI value={v('livros','subtexto')} onChange={val => s('livros','subtexto',val)} /></Field>
        </G3>
        {[1,2,3].map(n => (
          <SubCard key={n} label={`Livro ${n}`}>
            <G3 mb=".8rem">
              <Field label="Número"><TI value={v('livros',`livro_${n}_numero`)} onChange={val => s('livros',`livro_${n}_numero`,val)} /></Field>
              <Field label="Título" col={2}><TI value={v('livros',`livro_${n}_titulo`)} onChange={val => s('livros',`livro_${n}_titulo`,val)} /></Field>
            </G3>
            <div style={{ marginBottom: '.8rem' }}>
              <Field label="Descrição"><TA value={v('livros',`livro_${n}_descricao`)} onChange={val => s('livros',`livro_${n}_descricao`,val)} rows={2} /></Field>
            </div>
            <G2 mb="0">
              <Field label="Link Amazon"><TI value={v('livros',`livro_${n}_link_amazon`)} onChange={val => s('livros',`livro_${n}_link_amazon`,val)} placeholder="https://amazon.com.br/..." /></Field>
              <Field label="Capa">
                <ImageUploadField
                  value={v('livros',`livro_${n}_capa_url`)}
                  onChange={url => s('livros',`livro_${n}_capa_url`,url)}
                  specHint="Recomendado: 400×600px · Proporção 2:3 · JPG ou PNG · Máx 100kb"
                  storageFolder={`prof_paulo/livros`}
                  maxSizeKb={100}
                />
              </Field>
            </G2>
          </SubCard>
        ))}
      </SectionBlock>

      {/* CTA Final */}
      <SectionBlock title="CTA Final" visible={vis('cta_final')} onToggle={() => tv('cta_final')} onSave={() => save('cta_final', data.cta_final)} saving={saving === 'cta_final'}>
        <G2 mb="1rem">
          <Field label="Eyebrow"><TI value={v('cta_final','eyebrow')} onChange={val => s('cta_final','eyebrow',val)} /></Field>
          <Field label="Título"><TI value={v('cta_final','titulo')} onChange={val => s('cta_final','titulo',val)} /></Field>
        </G2>
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
