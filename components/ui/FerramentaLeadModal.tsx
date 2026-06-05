import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Modal } from './Modal';
import { Recurso } from '../../services/supabaseService';
import { sendNotificationEmail } from '../../services/emailService';

interface Props {
  ferramenta: Recurso | null;
  onClose: () => void;
}

export const FerramentaLeadModal: React.FC<Props> = ({ ferramenta, onClose }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [lgpdAceito, setLgpdAceito] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ferramenta) return;
    if (!nome.trim() || !email.trim()) { setErro('Preencha nome e e-mail.'); return; }

    setEnviando(true);
    setErro('');

    try {
      await addDoc(collection(db, 'leads'), {
        nome: nome.trim(),
        email: email.trim(),
        tipo: 'recurso',
        recurso: ferramenta.titulo,
        lgpd_aceito: true,
        lgpd_data: serverTimestamp(),
        data: serverTimestamp(),
      });

      sendNotificationEmail({
        tipo: 'recurso',
        nome: nome.trim(),
        email: email.trim(),
        recurso: ferramenta.titulo,
      });

      onClose();

      const url = ferramenta.url_entrega || ferramenta.arquivo_url;
      if (!url) return;

      if (ferramenta.tipo_entrega === 'download') {
        const a = document.createElement('a');
        a.href = url;
        a.download = '';
        a.click();
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch {
      setErro('Erro ao enviar. Tente novamente.');
      setEnviando(false);
    }
  };

  const resetAndClose = () => {
    setNome('');
    setEmail('');
    setLgpdAceito(false);
    setErro('');
    onClose();
  };

  return (
    <Modal open={!!ferramenta} onClose={resetAndClose}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '.6rem' }}>
          Acesso gratuito
        </div>
        <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>
          {ferramenta?.titulo}
        </h2>
        {ferramenta?.descricao && (
          <p style={{ fontSize: '.82rem', color: 'var(--ink-3)', lineHeight: 1.6, marginTop: '.6rem' }}>
            {ferramenta.descricao}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.2rem' }}>
          <div>
            <label style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', display: 'block', marginBottom: '.4rem' }}>
              Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Seu nome"
              required
              style={{
                width: '100%', padding: '.7rem .9rem', fontFamily: 'var(--fb)', fontSize: '.9rem',
                background: 'var(--cream-d)', border: '1px solid var(--rule)', color: 'var(--ink)',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', display: 'block', marginBottom: '.4rem' }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={{
                width: '100%', padding: '.7rem .9rem', fontFamily: 'var(--fb)', fontSize: '.9rem',
                background: 'var(--cream-d)', border: '1px solid var(--rule)', color: 'var(--ink)',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        <div className="flex items-start gap-3 mt-2" style={{ marginBottom: '1rem' }}>
          <input
            type="checkbox"
            id="lgpd-recurso"
            required
            checked={lgpdAceito}
            onChange={e => setLgpdAceito(e.target.checked)}
            className="mt-1 accent-gold"
          />
          <label htmlFor="lgpd-recurso" className="text-xs text-ink-light leading-relaxed">
            Concordo com o tratamento dos meus dados conforme a{' '}
            <a href="#/privacy" className="text-gold underline">Política de Privacidade</a>
            {' '}e autorizo o contato por email do{' '}
            <strong>Prof. Paulo H. Donassolo</strong>.
          </label>
        </div>

        {erro && (
          <p style={{ fontFamily: 'var(--fm)', fontSize: '.55rem', letterSpacing: '.06em', color: '#c0392b', marginBottom: '.8rem' }}>
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando || !lgpdAceito}
          className="btn-navy"
          style={{ width: '100%', justifyContent: 'center', opacity: (enviando || !lgpdAceito) ? .6 : 1 }}
        >
          {enviando ? 'Enviando…' : 'Acessar ferramenta →'}
        </button>

        <p style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.06em', color: 'var(--ink-3)', textAlign: 'center', marginTop: '.8rem' }}>
          Sem spam. Apenas o acesso à ferramenta.
        </p>
      </form>
    </Modal>
  );
};

export default FerramentaLeadModal;
