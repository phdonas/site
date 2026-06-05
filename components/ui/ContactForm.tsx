import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';

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
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addDoc(collection(db, 'leads'), {
        ...form,
        tipo: 'contato',
        data: serverTimestamp(),
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
          Retorno em até 48 horas úteis.
        </p>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="field-light" type="text" placeholder="Nome completo" value={form.nome} onChange={e => set('nome', e.target.value)} required />
        <input className="field-light" type="email" placeholder="E-mail" value={form.email} onChange={e => set('email', e.target.value)} required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="field-light" type="text" placeholder="WhatsApp (opcional)" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
        <select className="field-light" value={form.assunto} onChange={e => set('assunto', e.target.value)}>
          {ASSUNTOS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      <textarea className="field-light" placeholder="Sua mensagem" rows={5} value={form.mensagem} onChange={e => set('mensagem', e.target.value)} required style={{ resize: 'vertical' }} />
      <button
        type="submit"
        className="btn-navy"
        disabled={status === 'loading'}
        style={{ alignSelf: 'flex-start' }}
      >
        {status === 'loading' ? 'Enviando...' : 'Enviar mensagem'}
      </button>
      {status === 'err' && <p style={{ fontSize: '.8rem', color: '#e57373' }}>Erro ao enviar. Tente novamente.</p>}
    </form>
  );
};
