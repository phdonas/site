import React from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import SEOHead from '../components/ui/SEOHead';
import FAQAccordion from '../components/ui/FAQAccordion';
import { useSiteContent } from '../hooks/useSiteContent';

const MENSAGEM = encodeURIComponent(
  'Olá Paulo. Gostaria de conversar sobre o trabalho de Consultoria. Podemos agendar uma reunião de diagnóstico?'
);

const ConsultoriaPage: React.FC = () => {
  const { g, visible, arr } = useSiteContent('consultoria');

  const areas = [1, 2, 3, 4, 5, 6]
    .map(n => ({ titulo: g('frentes', `card_${n}_titulo`), desc: g('frentes', `card_${n}_descricao`) }))
    .filter(a => Boolean(a.titulo));

  const etapas = [1, 2, 3, 4, 5]
    .map(n => ({
      num: String(n).padStart(2, '0'),
      nome: g('metodo', `etapa_${n}_nome`),
      desc: g('metodo', `etapa_${n}_descricao`),
      entregavel: g('metodo', `etapa_${n}_entregavel`),
    }))
    .filter(e => Boolean(e.nome));

  const faqRaw = arr<{ pergunta: string; resposta: string; ordem?: number }>('faq', 'faq');
  const faqItems = faqRaw
    .sort((a, b) => (a.ordem ?? 99) - (b.ordem ?? 99))
    .map(f => ({ question: f.pergunta, answer: f.resposta }));

  return (
    <main>
      <SEOHead
        title="Consultoria Comercial — Prof. Paulo H. Donassolo"
        description="Diagnóstico, estruturação e ativação do processo comercial da sua empresa. Da estratégia à execução em campo."
        url="https://www.phdonassolo.com/#/consultoria"
      />
      {/* Hero */}
      {visible('hero') && (
        <section style={{ background: 'var(--cream)', paddingTop: '8rem', paddingBottom: '6rem' }}>
          <div className="sec-wrap" style={{ maxWidth: 900, margin: '0 auto', padding: '0 5vw' }}>
            <ScrollReveal>
              <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>{g('hero', 'eyebrow')}</div>
              <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 700, lineHeight: 1.12, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1.6rem' }}>
                {g('hero', 'titulo_linha1')}<br />
                <em style={{ color: 'var(--navy)' }}>{g('hero', 'titulo_destaque')}</em>
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--ink-3)', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: 600 }}>
                {g('hero', 'subtexto')}
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href={g('hero', 'cta_primario_link') || `#/fale-comigo?mensagem=${MENSAGEM}`} className="btn-navy">
                  {g('hero', 'cta_primario_texto')}
                </a>
                {g('hero', 'cta_secundario_texto') && (
                  <a href={g('hero', 'cta_secundario_link') || '#/mentoria'} className="btn-ghost-ink">
                    {g('hero', 'cta_secundario_texto')} →
                  </a>
                )}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Áreas de atuação */}
      {visible('frentes') && (
        <section style={{ background: 'var(--navy)', padding: '6rem 0' }}>
          <div className="sec-wrap">
            <ScrollReveal>
              <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '1rem' }}>{g('frentes', 'eyebrow')}</div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '3rem' }}>
                {g('frentes', 'titulo')}
              </h2>
            </ScrollReveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {areas.map((a, i) => (
                <ScrollReveal key={a.titulo} delay={((i % 3) + 1) as 1 | 2 | 3}>
                  <div className="area-card" style={{ background: 'rgba(243,239,230,.04)', border: '1px solid rgba(243,239,230,.07)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--gold), var(--gold-2))' }} />
                    <h3 className="area-card-title" style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: 'rgba(243,239,230,.85)', marginBottom: '.8rem' }}>{a.titulo}</h3>
                    <p className="area-card-desc" style={{ fontSize: '.82rem', color: 'rgba(243,239,230,.35)', lineHeight: 1.65 }}>{a.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
          <style>{`
            .area-card { transition: background .3s, border-color .3s, box-shadow .3s, transform .3s; cursor: default; }
            .area-card:hover { background: var(--white) !important; border-color: transparent !important; box-shadow: 0 12px 40px rgba(0,0,0,.25); transform: translateY(-4px); }
            .area-card-title { transition: color .3s; }
            .area-card:hover .area-card-title { color: var(--ink) !important; }
            .area-card-desc { transition: color .3s; }
            .area-card:hover .area-card-desc { color: var(--ink-3) !important; }
          `}</style>
        </section>
      )}

      {/* Metodologia */}
      {visible('metodo') && (
        <section style={{ background: 'var(--cream-d)', padding: '6rem 0' }}>
          <div className="sec-wrap">
            <ScrollReveal>
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>{g('metodo', 'eyebrow')}</div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '3.5rem' }}>
                {g('metodo', 'titulo')}
              </h2>
            </ScrollReveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {etapas.map((e, i) => (
                <ScrollReveal key={e.num} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '2.5rem', padding: '2.5rem 0', borderBottom: i < etapas.length - 1 ? '1px solid var(--rule)' : 'none' }}>
                    <div style={{ width: 80, height: 80, border: '1.5px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: i === etapas.length - 1 ? 'rgba(168,120,40,.06)' : 'transparent' }}>
                      <span style={{ fontFamily: 'var(--fd)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>{e.num}</span>
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '.6rem' }}>{e.nome}</h3>
                      <p style={{ fontSize: '.88rem', color: 'var(--ink-3)', lineHeight: 1.7, marginBottom: '1rem' }}>{e.desc}</p>
                      {e.entregavel && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', fontSize: '.78rem', color: 'var(--ink-3)', background: 'var(--cream)', border: '1px solid var(--rule)', padding: '.35rem .8rem' }}>
                          <span style={{ color: 'var(--gold)', fontSize: '.55rem' }}>▪</span>
                          {e.entregavel}
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {visible('faq') && faqItems.length > 0 && (
        <section style={{ background: 'var(--cream)', padding: '5rem 0' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 5vw' }}>
            <ScrollReveal>
              <div className="eyebrow" style={{ marginBottom: '2rem' }}>Perguntas frequentes</div>
              <FAQAccordion items={faqItems} />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* CTA Final */}
      {visible('cta_final') && (
        <section style={{ background: 'var(--navy)', padding: '7rem 0', textAlign: 'center' }}>
          <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 5vw' }}>
            <ScrollReveal>
              <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', justifyContent: 'center', borderColor: 'transparent', marginBottom: '1.5rem' }}>
                {g('cta_final', 'eyebrow')}
              </div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '1.2rem', lineHeight: 1.2 }}>
                {g('cta_final', 'titulo_linha1')}<br />
                <em style={{ fontStyle: 'italic' }}>{g('cta_final', 'titulo_destaque')}</em>
              </h2>
              <p style={{ fontSize: '.9rem', color: 'rgba(243,239,230,.4)', lineHeight: 1.75, marginBottom: '2.5rem' }}>
                {g('cta_final', 'subtexto')}
              </p>
              <a href={g('cta_final', 'cta_primario_link') || `#/fale-comigo?mensagem=${MENSAGEM}`} className="btn-primary">
                {g('cta_final', 'cta_primario_texto')}
              </a>
            </ScrollReveal>
          </div>
        </section>
      )}
    </main>
  );
};

export default ConsultoriaPage;
