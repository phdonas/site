import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { sendNotificationEmail } from '../../services/emailService';

const ASSUNTOS = [
  'Mentoria',
  'Consultoria',
  'Cursos e Formações',
  'Palestra / Aula',
  'Outra questão',
];

interface ContactFormProps {
  initialMessage?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ initialMessage }) => {
  const [form, setForm] = useState({ nome: '', email: '', whatsapp: '', assunto: ASSUNTOS[0], mensagem: initialMessage || '' });
  const [lgpdAceito, setLgpdAceito] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addDoc(collection(db, 'leads'), {
        ...form,
        tipo: 'contato',
        lgpd_aceito: true,
        lgpd_data: serverTimestamp(),
        data: serverTimestamp(),
      });
      sendNotificationEmail({
        tipo: 'contato',
        nome: form.nome,
        email: form.email,
        whatsapp: form.whatsapp || undefined,
        assunto: form.assunto,
        mensagem: form.mensagem,
      });
      setStatus('ok');
    } catch {
      setStatus('err');
    }
  };

  if (status === 'ok') {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <p style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '.8rem' }}>
          Mensagem recebida.
        </p>
        <p style={{ fontSize: '.9rem', color: 'var(--ink-3)' }}>
          Retorno em até 24 horas úteis.
        </p>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {/* Nome — largura total */}
      <input
        className="field-light w-full py-3 px-4"
        type="text"
        placeholder="Nome completo"
        value={form.nome}
        onChange={e => set('nome', e.target.value)}
        required
      />

      {/* Email — largura total */}
      <input
        className="field-light w-full py-3 px-4"
        type="email"
        placeholder="E-mail"
        value={form.email}
        onChange={e => set('email', e.target.value)}
        required
      />

      {/* WhatsApp + Assunto lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="field-light w-full py-3 px-4"
          type="text"
          placeholder="WhatsApp (opcional)"
          value={form.whatsapp}
          onChange={e => set('whatsapp', e.target.value)}
        />
        <select
          className="field-light w-full py-3 px-4"
          value={form.assunto}
          onChange={e => set('assunto', e.target.value)}
        >
          {ASSUNTOS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* Mensagem — largura total */}
      <textarea
        className="field-light w-full py-3 px-4 min-h-[120px]"
        placeholder="Sua mensagem"
        value={form.mensagem}
        onChange={e => set('mensagem', e.target.value)}
        required
        style={{ resize: 'vertical' }}
      />

      {/* LGPD — largura total */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="lgpd-contato"
          required
          checked={lgpdAceito}
          onChange={e => setLgpdAceito(e.target.checked)}
          className="mt-1 accent-gold"
        />
        <label htmlFor="lgpd-contato" className="text-xs text-ink-light leading-relaxed">
          Concordo com o tratamento dos meus dados pessoais conforme a{' '}
          <a href="#/privacy" className="text-gold underline">Política de Privacidade</a>
          {' '}e autorizo o contato por email e WhatsApp relacionado aos serviços do{' '}
          <strong>Prof. Paulo H. Donassolo</strong>.
        </label>
      </div>

      {/* Botão — largura total */}
      <button
        type="submit"
        className="btn-navy w-full justify-center"
        disabled={status === 'loading' || !lgpdAceito}
      >
        {status === 'loading' ? 'Enviando...' : 'Enviar mensagem'}
      </button>

      {status === 'err' && (
        <p style={{ fontSize: '.8rem', color: '#e57373' }}>Erro ao enviar. Tente novamente.</p>
      )}
    </form>
  );
};
