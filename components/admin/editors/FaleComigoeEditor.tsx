import React from 'react';
import { Field, TI, TA, FAQEditor, SectionBlock, G2, G3, SubCard, useSectionSave } from '../adminEditorHelpers';
import { aS } from '../adminStyles';

interface Props {
  data: any;
  onChange: (path: string, val: any) => void;
  onSave: (section: string, data: any) => Promise<void>;
}

export const FaleComigoeEditor: React.FC<Props> = ({ data, onChange, onSave }) => {
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
          <Field label="Título destaque"><TI value={v('hero','titulo_destaque')} onChange={val => s('hero','titulo_destaque',val)} /></Field>
        </G2>
      </SectionBlock>

      {/* Formulário */}
      <SectionBlock title="Formulário de contato" visible={vis('formulario')} onToggle={() => tv('formulario')} onSave={() => save('formulario', data.formulario)} saving={saving === 'formulario'}>
        <div style={{ marginBottom: '1rem' }}>
          <Field label="Mensagem de sucesso (exibida após envio)">
            <TA value={v('formulario','mensagem_sucesso')} onChange={val => s('formulario','mensagem_sucesso',val)} rows={2} />
          </Field>
        </div>
        <div>
          <Field label="Opções do select de assunto (uma por linha)">
            <textarea
              style={aS.textarea}
              rows={6}
              value={(data?.formulario?.opcoes_assunto || []).join('\n')}
              onChange={e => s('formulario', 'opcoes_assunto', e.target.value.split('\n').map((t: string) => t.trim()).filter(Boolean))}
              placeholder="Mentoria&#10;Consultoria&#10;Cursos&#10;Parceria&#10;Outro"
            />
          </Field>
        </div>
      </SectionBlock>

      {/* Contatos diretos */}
      <SectionBlock title="Contatos diretos" visible={vis('contatos')} onToggle={() => tv('contatos')} onSave={() => save('contatos', data.contatos)} saving={saving === 'contatos'}>
        <SubCard label="WhatsApp">
          <G2 mb="0">
            <Field label="Número (somente dígitos com DDI)" help="Ex: 351910298213"><TI value={v('contatos','numero_whatsapp')} onChange={val => s('contatos','numero_whatsapp',val)} placeholder="351910298213" /></Field>
            <Field label="Horário de atendimento"><TI value={v('contatos','horario_atendimento')} onChange={val => s('contatos','horario_atendimento',val)} /></Field>
          </G2>
        </SubCard>
        <SubCard label="Email">
          <Field label="Email de contato"><TI value={v('contatos','email_contato')} onChange={val => s('contatos','email_contato',val)} placeholder="paulo@phdonassolo.com" /></Field>
        </SubCard>
        <SubCard label="Localização">
          <G2 mb="0">
            <Field label="Cidade"><TI value={v('contatos','cidade')} onChange={val => s('contatos','cidade',val)} /></Field>
            <Field label="Descrição do atendimento"><TI value={v('contatos','descricao_atendimento')} onChange={val => s('contatos','descricao_atendimento',val)} /></Field>
          </G2>
        </SubCard>
      </SectionBlock>

      {/* O que esperar */}
      <SectionBlock title="O que esperar" visible={vis('o_que_esperar')} onToggle={() => tv('o_que_esperar')} onSave={() => save('o_que_esperar', data.o_que_esperar)} saving={saving === 'o_que_esperar'}>
        <G3 mb="1rem">
          <Field label="Eyebrow"><TI value={v('o_que_esperar','eyebrow')} onChange={val => s('o_que_esperar','eyebrow',val)} /></Field>
          <Field label="Título"><TI value={v('o_que_esperar','titulo')} onChange={val => s('o_que_esperar','titulo',val)} /></Field>
        </G3>
        {[1,2,3,4].map(n => (
          <SubCard key={n} label={`Etapa ${n}`}>
            <G2 mb="0">
              <Field label="Título"><TI value={v('o_que_esperar',`etapa_${n}_titulo`)} onChange={val => s('o_que_esperar',`etapa_${n}_titulo`,val)} /></Field>
              <Field label="Descrição"><TI value={v('o_que_esperar',`etapa_${n}_descricao`)} onChange={val => s('o_que_esperar',`etapa_${n}_descricao`,val)} /></Field>
            </G2>
          </SubCard>
        ))}
      </SectionBlock>

      {/* FAQ */}
      <SectionBlock title="FAQ" visible={vis('faq')} onToggle={() => tv('faq')} onSave={() => save('faq', data.faq)} saving={saving === 'faq'}>
        <FAQEditor items={data?.faq?.faq || []} onChange={items => onChange('faq.faq', items)} />
      </SectionBlock>
    </>
  );
};
