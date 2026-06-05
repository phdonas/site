import React from 'react';

const NotFoundPage: React.FC = () => (
  <main style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8rem 5vw', textAlign: 'center' }}>
    <div style={{ maxWidth: 440 }}>
      <div style={{ fontFamily: 'var(--fd)', fontSize: '5rem', fontWeight: 700, color: 'rgba(168,120,40,.18)', lineHeight: 1, marginBottom: '1.5rem' }}>
        404
      </div>
      <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1rem' }}>
        Página não encontrada.
      </h1>
      <p style={{ fontSize: '.9rem', color: 'var(--ink-3)', lineHeight: 1.75, marginBottom: '2.5rem' }}>
        O conteúdo que você procura pode ter sido movido ou o link está incorreto.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="#/" className="btn-navy">Ir para a Home</a>
        <a href="#/fale-comigo" className="btn-ghost-ink">Falar comigo →</a>
      </div>
    </div>
  </main>
);

export default NotFoundPage;
