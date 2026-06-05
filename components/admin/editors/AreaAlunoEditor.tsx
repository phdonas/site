import React from 'react';
import { Field, TI, TA, Toggle, SectionBlock, G2, useSectionSave } from '../adminEditorHelpers';
import { aS } from '../adminStyles';

interface Props {
  data: any;
  onChange: (path: string, val: any) => void;
  onSave: (section: string, data: any) => Promise<void>;
}

export const AreaAlunoEditor: React.FC<Props> = ({ data, onChange, onSave }) => {
  const { saving, save } = useSectionSave(onSave);

  // Área do Aluno has a single flat section: 'conteudo'
  const s = (field: string, val: any) => onChange(`conteudo.${field}`, val);
  const v = (field: string) => data?.conteudo?.[field] ?? '';

  return (
    <>
      <SectionBlock
        title="Página de Pré-lançamento"
        visible={data?.conteudo?.visivel !== false}
        onToggle={() => s('visivel', !(data?.conteudo?.visivel !== false))}
        onSave={() => save('conteudo', data.conteudo)}
        saving={saving === 'conteudo'}
        defaultOpen
      >
        <G2 mb="1rem">
          <Field label="Eyebrow"><TI value={v('eyebrow')} onChange={val => s('eyebrow', val)} placeholder="Área do Aluno" /></Field>
          <Field label="Título"><TI value={v('titulo')} onChange={val => s('titulo', val)} placeholder="Em breve. Muito em breve." /></Field>
        </G2>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Subtítulo">
            <TA value={v('subtitulo')} onChange={val => s('subtitulo', val)} rows={2} placeholder="A plataforma...estará disponível até o final de junho de 2026." />
          </Field>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Parágrafo">
            <TA value={v('paragrafo')} onChange={val => s('paragrafo', val)} rows={3} />
          </Field>
        </div>
        <G2 mb="1rem">
          <Field label="Botão — texto"><TI value={v('botao_texto')} onChange={val => s('botao_texto', val)} placeholder="Quero ser avisado" /></Field>
          <Field label="Nota de privacidade"><TI value={v('nota_privacidade')} onChange={val => s('nota_privacidade', val)} /></Field>
        </G2>
        <div style={{ marginBottom: '1.5rem' }}>
          <Field label="Mensagem de confirmação (após cadastro)">
            <TA value={v('mensagem_confirmacao')} onChange={val => s('mensagem_confirmacao', val)} rows={2} />
          </Field>
        </div>
      </SectionBlock>

      {/* LMS settings note */}
      <div style={{ background: 'rgba(143,110,74,.08)', border: '1px solid rgba(143,110,74,.25)', padding: '1.2rem' }}>
        <div style={{ ...aS.eyebrow, marginBottom: '.6rem' }}>Controle do LMS</div>
        <p style={{ fontFamily: 'var(--fb)', fontSize: '.82rem', color: 'var(--ink-3)', lineHeight: 1.7 }}>
          A flag <strong>lms_liberado</strong> e a URL do LMS são geridas na tab{' '}
          <strong>"Configurações → LMS / Área do Aluno"</strong>.
          Quando liberado, o botão "Área do Aluno" no nav redireciona para o LMS em vez desta página.
        </p>
      </div>
    </>
  );
};
