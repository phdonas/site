import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { sendNotificationEmail } from '../../services/emailService';

export const NewsletterForm: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [lgpdAceito, setLgpdAceito] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) return;
    setStatus('loading');
    try {
      await addDoc(collection(db, 'leads'), {
        nome: nome.trim(),
        email: email.trim(),
        tipo: 'newsletter',
        lgpd_aceito: true,
        lgpd_data: serverTimestamp(),
        data: serverTimestamp(),
      });
      sendNotificationEmail({ tipo: 'newsletter', nome: nome.trim(), email: email.trim() });
      setStatus('ok');
      setNome('');
      setEmail('');
    } catch {
      setStatus('err');
    }
  };

  if (status === 'ok') {
    return (
      <p style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontStyle: 'italic', color: 'rgba(243,239,230,.85)' }}>
        Ótimo! Você receberá o próximo artigo em primeira mão.
      </p>
    );
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input
        className="field-dark"
        type="text"
        placeholder="Seu nome"
        value={nome}
        onChange={e => setNome(e.target.value)}
        required
      />
      <input
        className="field-dark"
        type="email"
        placeholder="Seu melhor e-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />

      <div className="flex items-start gap-3 mt-1">
        <input
          type="checkbox"
          id="lgpd-newsletter"
          required
          checked={lgpdAceito}
          onChange={e => setLgpdAceito(e.target.checked)}
          className="mt-1 accent-gold"
        />
        <label htmlFor="lgpd-newsletter" className="text-xs leading-relaxed" style={{ color: 'rgba(243,239,230,.4)' }}>
          Concordo com o tratamento dos meus dados conforme a{' '}
          <a href="#/privacy" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>Política de Privacidade</a>
          {' '}e autorizo o contato por email do <strong>Prof. Paulo H. Donassolo</strong>.
        </label>
      </div>

      <button className="nl-btn" type="submit" disabled={status === 'loading' || !lgpdAceito}>
        {status === 'loading' ? 'Enviando...' : 'Quero receber'}
      </button>
      {status === 'err' && (
        <p style={{ fontSize: '.8rem', color: '#e57373' }}>Erro ao cadastrar. Tente novamente.</p>
      )}
      <p style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.08em', color: 'rgba(243,239,230,.2)', textAlign: 'center' }}>
        Sem spam. Cancelamento em um clique.
      </p>
    </form>
  );
};
