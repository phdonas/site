import React from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import SEOHead from '../components/ui/SEOHead';
import { useSiteContent } from '../hooks/useSiteContent';

const ServicesPage: React.FC = () => {
  const { g, visible, arr } = useSiteContent('servicos');

  const servicos = [1, 2, 3, 4].map(n => ({
    href: g('cards_servicos', `servico_${n}_link_url`),
    tag: g('cards_servicos', `servico_${n}_tipo_label`),
    titulo: g('cards_servicos', `servico_${n}_titulo`),
    desc: g('cards_servicos', `servico_${n}_descricao`),
    cta: g('cards_servicos', `servico_${n}_link_texto`),
    tags: arr<string>('cards_servicos', `servico_${n}_tags`),
  }));

  return (
    <main>
      <SEOHead
        title="Serviços — Mentoria, Consultoria e Cursos Comerciais"
        description="Conheça os formatos de trabalho: mentoria individual, consultoria empresarial, cursos online e formações in-company."
        url="https://www.phdonassolo.com/#/servicos"
      />
      {/* Hero */}
      {visible('hero') && (
        <section style={{ background: 'var(--cream)', paddingTop: '8rem', paddingBottom: '5rem' }}>
          <div className="sec-wrap">
            <ScrollReveal>
              <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>{g('hero', 'eyebrow')}</div>
              <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', fontWeight: 700, lineHeight: 1.12, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1.2rem' }}>
                {g('hero', 'titulo_linha1')}<br />
                <em style={{ color: 'var(--navy)' }}>{g('hero', 'titulo_destaque')}</em>
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--ink-3)', lineHeight: 1.75, maxWidth: 540 }}>
                {g('hero', 'subtexto')}
              </p>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Serviços detalhados */}
      {visible('cards_servicos') && (
        <section style={{ background: 'var(--cream)', paddingBottom: '7rem' }}>
          <div className="sec-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {servicos.map((s, i) => (
              <ScrollReveal key={s.titulo} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', background: i % 2 === 0 ? 'var(--cream-d)' : 'var(--navy)', border: '1px solid var(--rule)', padding: '3.5rem', alignItems: 'center' }}>
                  <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>
                      {s.tag}
                    </div>
                    <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 700, color: i % 2 === 0 ? 'var(--ink)' : 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '1.2rem' }}>
                      {s.titulo}
                    </h2>
                    <p style={{ fontSize: '.9rem', lineHeight: 1.75, marginBottom: '2rem', color: i % 2 === 0 ? 'var(--ink-3)' : 'rgba(243,239,230,.45)' }}>
                      {s.desc}
                    </p>
                    <a href={s.href || '#'} className={i % 2 === 0 ? 'btn-navy' : 'btn-primary'}>{s.cta}</a>
                  </div>
                  <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
                      {s.tags.map((d, j) => (
                        <div key={j} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '.8rem 1.2rem', background: i % 2 === 0 ? 'var(--cream)' : 'rgba(243,239,230,.04)', border: `1px solid ${i % 2 === 0 ? 'var(--rule)' : 'rgba(243,239,230,.07)'}` }}>
                          <span style={{ color: 'var(--gold)', fontSize: '1rem', flexShrink: 0, marginTop: '.1rem' }}>✓</span>
                          <span style={{ fontSize: '.85rem', color: i % 2 === 0 ? 'var(--ink-2)' : 'rgba(243,239,230,.5)', lineHeight: 1.5 }}>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {visible('cta_final') && (
        <section style={{ background: 'var(--navy)', padding: '7rem 0', textAlign: 'center' }}>
          <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 5vw' }}>
            <ScrollReveal>
              <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', justifyContent: 'center', borderColor: 'transparent', marginBottom: '1.5rem' }}>
                {g('cta_final', 'eyebrow')}
              </div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '1.2rem', lineHeight: 1.2 }}>
                {g('cta_final', 'titulo')}
              </h2>
              <p style={{ fontSize: '.9rem', color: 'rgba(243,239,230,.4)', lineHeight: 1.75, marginBottom: '2.5rem' }}>
                {g('cta_final', 'subtexto')}
              </p>
              <a href={g('cta_final', 'cta_primario_link') || '#/fale-comigo'} className="btn-primary">
                {g('cta_final', 'cta_primario_texto')}
              </a>
            </ScrollReveal>
          </div>
        </section>
      )}
    </main>
  );
};

export default ServicesPage;
