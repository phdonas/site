import React from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';

interface Props {
  titulo?: string;
  subtitulo?: string;
  voltarHref?: string;
  voltarLabel?: string;
}

const EmBrevePage: React.FC<Props> = ({
  titulo = 'Em breve.',
  subtitulo = 'Este conteúdo está a caminho. Acompanhe pelo newsletter ou pelo WhatsApp.',
  voltarHref = '#/',
  voltarLabel = 'Voltar para o início',
}) => (
  <main style={{ background: 'var(--cream)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8rem 5vw' }}>
    <div style={{ textAlign: 'center', maxWidth: 520 }}>
      <ScrollReveal>
        <div style={{
          width: 64, height: 64, border: '1.5px solid var(--gold)', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem',
        }}>
          <span style={{ fontFamily: 'var(--fm)', fontSize: '.55rem', letterSpacing: '.18em', color: 'var(--gold)' }}>PHD</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--fd)', fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', fontWeight: 700,
          color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1.2rem',
        }}>
          {titulo}
        </h1>
        <p style={{ fontSize: '.95rem', color: 'var(--ink-3)', lineHeight: 1.75, marginBottom: '2.5rem' }}>
          {subtitulo}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#/fale-comigo" className="btn-navy">Fale comigo</a>
          <a href={voltarHref} className="btn-ghost-ink">{voltarLabel}</a>
        </div>
      </ScrollReveal>
    </div>
  </main>
);

export default EmBrevePage;
