import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';

export const NewsletterForm: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
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
        data: serverTimestamp(),
      });
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
      <button className="nl-btn" type="submit" disabled={status === 'loading'}>
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
