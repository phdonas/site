import React from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import FAQAccordion from '../components/ui/FAQAccordion';
import { useSiteContent } from '../hooks/useSiteContent';

const MENSAGEM = encodeURIComponent(
  'Olá Paulo. Gostaria de conversar sobre a Mentoria Comercial. Posso agendar um diagnóstico inicial sem compromisso?'
);

const MentoriaPage: React.FC = () => {
  const { g, visible, arr } = useSiteContent('mentoria');

  const problemas = [1, 2, 3, 4, 5]
    .map(n => g('problema', `problema_${n}`))
    .filter(Boolean);

  const paraQuemItems = [1, 2, 3, 4, 5]
    .map(n => g('para_quem', `para_quem_${n}`))
    .filter(Boolean);

  const naoParaQuemItems = [1, 2, 3, 4]
    .map(n => g('para_quem', `nao_para_quem_${n}`))
    .filter(Boolean);

  const fases = [1, 2, 3, 4].map(n => ({
    num: String(n).padStart(2, '0'),
    nome: g('como_funciona', `fase_${n}_nome`),
    tag: g('como_funciona', `fase_${n}_semanas`),
    desc: g('como_funciona', `fase_${n}_descricao`),
    entregavel: g('como_funciona', `fase_${n}_entregavel`),
  }));

  const inclusos = [1, 2, 3, 4, 5, 6]
    .map(n => g('inclusos', `incluso_${n}`))
    .filter(Boolean);

  const faqRaw = arr<{ pergunta: string; resposta: string; ordem?: number }>('faq', 'faq');
  const faqItems = faqRaw
    .sort((a, b) => (a.ordem ?? 99) - (b.ordem ?? 99))
    .map(f => ({ question: f.pergunta, answer: f.resposta }));

  return (
    <main>
      {/* Hero */}
      {visible('hero') && (
        <section style={{ background: 'var(--cream)', paddingTop: '8rem', paddingBottom: '6rem' }}>
          <div className="sec-wrap" style={{ maxWidth: 760, margin: '0 auto', padding: '0 5vw' }}>
            <ScrollReveal>
              <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>{g('hero', 'eyebrow')}</div>
              <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 700, lineHeight: 1.12, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1.6rem' }}>
                {g('hero', 'titulo_linha1')}<br />
                <em style={{ color: 'var(--gold)' }}>{g('hero', 'titulo_destaque')}</em>
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--ink-3)', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: 560 }}>
                {g('hero', 'subtexto')}
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href={g('hero', 'cta_primario_link') || `#/fale-comigo?mensagem=${MENSAGEM}`} className="btn-navy">
                  {g('hero', 'cta_primario_texto')}
                </a>
                <button
                  onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-ghost-ink"
                  style={{ fontFamily: 'inherit', fontSize: '.84rem' }}
                >
                  {g('hero', 'cta_secundario_texto') || 'Ver como funciona'}
                </button>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* O Problema */}
      {visible('problema') && (
        <section style={{ background: 'var(--cream-d)', padding: '5rem 0' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 5vw' }}>
            <ScrollReveal>
              <div className="eyebrow" style={{ marginBottom: '2rem' }}>{g('problema', 'eyebrow')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {problemas.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start', padding: '1.4rem 1.6rem', background: 'var(--cream)', border: '1px solid var(--rule)' }}>
                    <span style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', color: 'var(--ink-3)', marginTop: '.1rem', flexShrink: 0 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p style={{ fontSize: '.9rem', color: 'var(--ink-2)', lineHeight: 1.65 }}>{item}</p>
                  </div>
                ))}
              </div>
              {g('problema', 'citacao_texto') && (
                <div style={{ marginTop: '2rem', borderLeft: '2px solid var(--gold)', paddingLeft: '1.2rem' }}>
                  <p style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontStyle: 'italic', color: 'var(--navy)', lineHeight: 1.65 }}>
                    {g('problema', 'citacao_texto')}
                  </p>
                </div>
              )}
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Para quem é */}
      {visible('para_quem') && (
        <section style={{ background: 'var(--cream)', padding: '5rem 0' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 5vw' }}>
            <ScrollReveal>
              <div className="eyebrow" style={{ marginBottom: '2rem' }}>{g('para_quem', 'eyebrow')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem', marginBottom: '2.5rem' }}>
                {paraQuemItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--gold)', fontSize: '1.1rem', flexShrink: 0, marginTop: '.1rem' }}>✓</span>
                    <p style={{ fontSize: '.9rem', color: 'var(--ink-2)', lineHeight: 1.65 }}>{item}</p>
                  </div>
                ))}
              </div>
              {naoParaQuemItems.length > 0 && (
                <>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '.52rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '1rem', marginTop: '2rem' }}>
                    {g('para_quem', 'nao_para_quem_titulo') || 'Não é para quem'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                    {naoParaQuemItems.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--ink-3)', fontSize: '.9rem', flexShrink: 0 }}>—</span>
                        <p style={{ fontSize: '.85rem', color: 'var(--ink-3)', lineHeight: 1.65 }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Como funciona */}
      {visible('como_funciona') && (
        <section id="como-funciona" style={{ background: 'var(--navy)', padding: '6rem 0' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 5vw' }}>
            <ScrollReveal>
              <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '1rem' }}>{g('como_funciona', 'eyebrow')}</div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '3rem' }}>
                {g('como_funciona', 'titulo')}
              </h2>
            </ScrollReveal>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {fases.map((fase, i) => (
                <ScrollReveal key={fase.num} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '2rem', padding: '2rem 0', borderBottom: i < fases.length - 1 ? '1px solid var(--rule-n)' : 'none', alignItems: 'start' }}>
                    <div className={`fase-dot ${i === fases.length - 1 ? 'fase-dot-last' : ''}`}>
                      <span className={`fase-dot-n ${i === fases.length - 1 ? 'fase-dot-n-last' : ''}`}>{fase.num}</span>
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'baseline', marginBottom: '.6rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, color: 'rgba(243,239,230,.85)' }}>{fase.nome}</h3>
                        <span style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.14em', color: 'var(--gold)', opacity: .7 }}>{fase.tag}</span>
                      </div>
                      <p style={{ fontSize: '.85rem', color: 'rgba(243,239,230,.4)', lineHeight: 1.7, marginBottom: '1rem' }}>{fase.desc}</p>
                      {fase.entregavel && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', fontSize: '.78rem', color: 'rgba(243,239,230,.35)', background: 'rgba(243,239,230,.05)', border: '1px solid rgba(243,239,230,.08)', padding: '.35rem .8rem' }}>
                          <span style={{ color: 'var(--gold)', fontSize: '.55rem' }}>▪</span>
                          {fase.entregavel}
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

      {/* O que está incluído */}
      {visible('inclusos') && (
        <section style={{ background: 'var(--cream-d)', padding: '5rem 0' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 5vw' }}>
            <ScrollReveal>
              <div className="eyebrow" style={{ marginBottom: '2rem' }}>{g('inclusos', 'eyebrow')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {inclusos.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--gold)', fontSize: '1.1rem', flexShrink: 0, marginTop: '.1rem' }}>✓</span>
                    <p style={{ fontSize: '.9rem', color: 'var(--ink-2)', lineHeight: 1.65 }}>{item}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Sobre o mentor */}
      {visible('sobre_mentor') && (
        <section style={{ background: 'var(--cream)', padding: '5rem 0' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 5vw' }}>
            <ScrollReveal>
              <div className="eyebrow" style={{ marginBottom: '2rem' }}>{g('sobre_mentor', 'eyebrow')}</div>
              <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '.4rem' }}>
                {g('sobre_mentor', 'card_nome')}
              </h3>
              <p style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.14em', color: 'var(--gold)', marginBottom: '1.8rem' }}>
                {g('sobre_mentor', 'card_subtitulo')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
                {[1, 2, 3, 4, 5].map(n => {
                  const item = g('sobre_mentor', `card_item_${n}`);
                  return item ? (
                    <div key={n} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--gold)', fontSize: '1.1rem', flexShrink: 0, marginTop: '.1rem' }}>✓</span>
                      <p style={{ fontSize: '.9rem', color: 'var(--ink-2)', lineHeight: 1.65 }}>{item}</p>
                    </div>
                  ) : null;
                })}
              </div>
              <a href="#/prof-paulo" className="btn-ghost-ink" style={{ display: 'inline-block', marginTop: '2rem' }}>
                Ver perfil completo →
              </a>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* FAQ */}
      {visible('faq') && faqItems.length > 0 && (
        <section style={{ background: 'var(--cream-d)', padding: '5rem 0' }}>
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

export default MentoriaPage;
