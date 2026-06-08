import React, { useEffect, useState } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import SEOHead from '../components/ui/SEOHead';
import { ContactForm } from '../components/ui/ContactForm';
import WhatsAppFloat from '../components/WhatsAppFloat';
import { useSiteContent } from '../hooks/useSiteContent';

interface Props {
  initialMessage?: string;
}

const FaleComigo: React.FC<Props> = ({ initialMessage }) => {
  const { g, visible } = useSiteContent('fale_comigo');
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowWhatsApp(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <main>
      <SEOHead
        title="Fale Comigo — Prof. Paulo H. Donassolo"
        description="Entre em contato para discutir mentoria, consultoria ou formações para a sua equipe comercial."
        url="https://www.phdonassolo.com/#/fale-comigo"
      />
      {/* Hero */}
      {visible('hero') && (
        <section style={{ background: 'var(--cream)', paddingTop: '8rem', paddingBottom: '4rem' }}>
          <div className="sec-wrap" style={{ maxWidth: 900, margin: '0 auto', padding: '0 5vw' }}>
            <ScrollReveal>
              <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>{g('hero', 'eyebrow')}</div>
              <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 700, lineHeight: 1.12, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1.2rem' }}>
                {g('hero', 'titulo_linha1')}<br />
                <em style={{ color: 'var(--navy)' }}>{g('hero', 'titulo_destaque')}</em>
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--ink-3)', lineHeight: 1.75, maxWidth: 520 }}>
                {g('hero', 'subtexto')}
              </p>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Main content */}
      <section style={{ background: 'var(--cream)', paddingBottom: '7rem' }}>
        <div className="sec-wrap" style={{ maxWidth: 900, margin: '0 auto', padding: '0 5vw', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '6rem', alignItems: 'start' }}>
          {/* Left: info */}
          <ScrollReveal>
            <div>
              <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '1.5rem' }}>
                  Como posso ajudar
                </h2>
                {[
                  { href: '#/mentoria', label: 'Mentoria Comercial', desc: '90 dias com acompanhamento individual' },
                  { href: '#/consultoria', label: 'Consultoria', desc: 'Estruturação do processo comercial' },
                  { href: '#/cursos', label: 'Cursos e Formações', desc: 'Programas para times e líderes' },
                  { href: '#/conteudo', label: 'Palestra / Aula', desc: 'Para eventos, empresas e instituições' },
                ].map(s => (
                  <a key={s.href} href={s.href} style={{ display: 'block', padding: '1rem 0', borderBottom: '1px solid var(--rule)', textDecoration: 'none', transition: 'padding .2s' }}
                    onMouseEnter={e => (e.currentTarget.style.paddingLeft = '.5rem')}
                    onMouseLeave={e => (e.currentTarget.style.paddingLeft = '0')}
                  >
                    <div style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '.2rem' }}>{s.label}</div>
                    <div style={{ fontSize: '.82rem', color: 'var(--ink-3)' }}>{s.desc}</div>
                  </a>
                ))}
              </div>

              <div style={{ padding: '1.6rem', background: 'var(--navy)', border: '1px solid rgba(243,239,230,.06)' }}>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>
                  Resposta rápida
                </div>
                <p style={{ fontSize: '.85rem', color: 'rgba(243,239,230,.5)', lineHeight: 1.65, marginBottom: '1.2rem' }}>
                  Para questões urgentes, contate diretamente pelo WhatsApp.
                </p>
                {showWhatsApp && <WhatsAppFloat expanded />}
              </div>
            </div>
          </ScrollReveal>

          {/* Right: form */}
          <ScrollReveal delay={2}>
            <div style={{ background: 'var(--cream-d)', border: '1px solid var(--rule)', padding: '3rem' }}>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '2rem' }}>
                Envie uma mensagem
              </h2>
              <ContactForm initialMessage={initialMessage} />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
};

export default FaleComigo;
