import React, { useEffect, useState } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import SupabaseService, { Curso } from '../services/supabaseService';

interface Props { slug: string }

const CursoVendaPage: React.FC<Props> = ({ slug }) => {
  const [curso, setCurso] = useState<Curso | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    SupabaseService.getCursoBySlug(slug).then(data => {
      if (!data) setNotFound(true);
      else setCurso(data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--navy)', paddingTop: '8rem' }}>
        <div className="sec-wrap">
          <div style={{ height: 60, background: 'rgba(243,239,230,.06)', marginBottom: '1.5rem', maxWidth: 480 }} />
          <div style={{ height: 200, background: 'rgba(243,239,230,.04)' }} />
        </div>
      </main>
    );
  }

  if (notFound || !curso) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div>
          <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '1rem' }}>Curso não encontrado</div>
          <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: 'var(--ink)', marginBottom: '2rem' }}>
            Este curso não está disponível.
          </h1>
          <a href="#/cursos" className="btn-navy">Ver todos os cursos</a>
        </div>
      </main>
    );
  }

  const preco = curso.preco_vitrine_brl;
  const precoOriginal = curso.preco_original_brl;
  const isGratis = curso.is_gratis || curso.is_free;
  const duracao = curso.duracao_total_minutos
    ? `${Math.floor(curso.duracao_total_minutos / 60)}h${curso.duracao_total_minutos % 60 > 0 ? ` ${curso.duracao_total_minutos % 60}min` : ''}`
    : null;

  return (
    <main>
      {/* Hero navy com card de compra */}
      <section style={{ background: 'var(--navy)', paddingTop: '7rem', paddingBottom: '5rem' }}>
        <div className="sec-wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '4rem', alignItems: 'start' }}>
          {/* Esquerda */}
          <ScrollReveal>
            {curso.pilar && (
              <div style={{
                fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.18em', textTransform: 'uppercase',
                color: 'var(--gold)', marginBottom: '1rem',
              }}>
                {curso.pilar.nome}
              </div>
            )}
            <h1 style={{
              fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 700,
              lineHeight: 1.12, color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '1.2rem',
            }}>
              {curso.titulo}
            </h1>

            {curso.objetivos && (
              <p style={{ fontSize: '1rem', color: 'rgba(243,239,230,.55)', lineHeight: 1.75, maxWidth: 560, marginBottom: '2rem' }}>
                {curso.objetivos}
              </p>
            )}

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {curso.nivel && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.1em', color: 'rgba(243,239,230,.4)' }}>
                  ◈ {curso.nivel}
                </span>
              )}
              {duracao && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.1em', color: 'rgba(243,239,230,.4)' }}>
                  ◷ {duracao}
                </span>
              )}
              {curso.avaliacoes_count > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.1em', color: 'rgba(243,239,230,.4)' }}>
                  ★ {curso.avaliacoes_media.toFixed(1)} ({curso.avaliacoes_count} avaliações)
                </span>
              )}
            </div>

            {/* Thumb (se não for lms, link vai para externo) */}
            {curso.thumb_url && (
              <div style={{ maxWidth: 480, aspectRatio: '16/9', overflow: 'hidden' }}>
                <img src={curso.thumb_url} alt={curso.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </ScrollReveal>

          {/* Card de compra */}
          <ScrollReveal delay={2}>
            <div style={{
              background: 'var(--cream)', padding: '2rem',
              position: 'sticky', top: '5rem',
            }}>
              {curso.thumb_url && (
                <div style={{ aspectRatio: '16/9', overflow: 'hidden', marginBottom: '1.5rem' }}>
                  <img src={curso.thumb_url} alt={curso.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <div style={{ marginBottom: '1.2rem' }}>
                {isGratis ? (
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '2rem', fontWeight: 700, color: '#27ae60' }}>Grátis</div>
                ) : preco ? (
                  <div>
                    {precoOriginal && precoOriginal > preco && (
                      <div style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', color: 'var(--ink-3)', textDecoration: 'line-through', marginBottom: '.2rem' }}>
                        R$ {precoOriginal.toFixed(2).replace('.', ',')}
                      </div>
                    )}
                    <div style={{ fontFamily: 'var(--fd)', fontSize: '2rem', fontWeight: 700, color: 'var(--ink)' }}>
                      R$ {preco.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                ) : null}
              </div>

              {curso.tipo === 'lms' ? (
                <a
                  href={curso.url_checkout || '#/fale-comigo'}
                  className="btn-navy"
                  style={{ display: 'block', textAlign: 'center', marginBottom: '1rem' }}
                >
                  {curso.url_checkout ? (isGratis ? 'Acessar grátis' : 'Comprar agora') : 'Em breve'}
                </a>
              ) : (
                <a
                  href={curso.url_checkout || '#/cursos'}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-navy"
                  style={{ display: 'block', textAlign: 'center', marginBottom: '1rem' }}
                >
                  Ver na {curso.tipo === 'udemy' ? 'Udemy' : 'ESPM'} ↗
                </a>
              )}

              {curso.garantia_dias && (
                <p style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.1em', color: 'var(--ink-3)', textAlign: 'center', marginTop: '.8rem' }}>
                  ✓ {curso.garantia_dias} dias de garantia
                </p>
              )}

              {curso.inclui && curso.inclui.length > 0 && (
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--rule)', paddingTop: '1.2rem' }}>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '.8rem' }}>
                    Inclui
                  </div>
                  {curso.inclui.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '.6rem', marginBottom: '.5rem' }}>
                      <span style={{ color: 'var(--gold)', flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: '.8rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* O que vai aprender */}
      {curso.o_que_aprender && curso.o_que_aprender.length > 0 && (
        <section style={{ background: 'var(--cream-d)', padding: '5rem 0' }}>
          <div className="sec-wrap">
            <ScrollReveal>
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>O que você vai aprender</div>
            </ScrollReveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '.8rem', marginTop: '2rem' }}>
              {curso.o_que_aprender.map((item, i) => (
                <ScrollReveal key={i} delay={((i % 2) + 1) as 1 | 2}>
                  <div style={{ display: 'flex', gap: '.8rem', alignItems: 'flex-start', padding: '.8rem 1rem', background: 'var(--cream)', border: '1px solid var(--rule)' }}>
                    <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '.1rem' }}>✓</span>
                    <span style={{ fontSize: '.85rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ementa / Módulos */}
      {curso.modulos && curso.modulos.length > 0 && (
        <section style={{ background: 'var(--cream)', padding: '5rem 0' }}>
          <div className="sec-wrap">
            <ScrollReveal>
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>Conteúdo do curso</div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.6rem, 2.5vw, 2rem)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '2.5rem' }}>
                {curso.modulos.length} módulo{curso.modulos.length > 1 ? 's' : ''}
              </h2>
            </ScrollReveal>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {curso.modulos.map((m, i) => (
                <ScrollReveal key={m.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
                  <div style={{
                    display: 'grid', gridTemplateColumns: '48px 1fr', gap: '1.5rem',
                    padding: '1.5rem 0', borderBottom: i < curso.modulos!.length - 1 ? '1px solid var(--rule)' : 'none',
                    alignItems: 'start',
                  }}>
                    <div style={{ fontFamily: 'var(--fd)', fontSize: '1.6rem', fontWeight: 700, color: 'rgba(168,120,40,.25)', lineHeight: 1 }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '.4rem' }}>
                        {m.titulo}
                      </h3>
                      {m.descricao && (
                        <p style={{ fontSize: '.82rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>{m.descricao}</p>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Para quem / Não é para quem */}
      {((curso.para_quem && curso.para_quem.length > 0) || (curso.nao_para_quem && curso.nao_para_quem.length > 0)) && (
        <section style={{ background: 'var(--navy)', padding: '5rem 0' }}>
          <div className="sec-wrap" style={{ display: 'grid', gridTemplateColumns: curso.para_quem?.length && curso.nao_para_quem?.length ? '1fr 1fr' : '1fr', gap: '3rem' }}>
            {curso.para_quem && curso.para_quem.length > 0 && (
              <ScrollReveal>
                <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '1.2rem' }}>Para quem é</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                  {curso.para_quem.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '.8rem', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--gold)', flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: '.88rem', color: 'rgba(243,239,230,.55)', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}
            {curso.nao_para_quem && curso.nao_para_quem.length > 0 && (
              <ScrollReveal delay={2}>
                <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'rgba(243,239,230,.2)', marginBottom: '1.2rem' }}>Não é para quem</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                  {curso.nao_para_quem.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '.8rem', alignItems: 'flex-start' }}>
                      <span style={{ color: 'rgba(243,239,230,.3)', flexShrink: 0 }}>✗</span>
                      <span style={{ fontSize: '.88rem', color: 'rgba(243,239,230,.35)', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section style={{ background: 'var(--navy)', padding: '6rem 0', textAlign: 'center', borderTop: '1px solid rgba(243,239,230,.07)' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 5vw' }}>
          <ScrollReveal>
            <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '1rem', lineHeight: 1.2 }}>
              {curso.titulo}
            </h2>
            <div style={{ marginBottom: '2rem' }}>
              {isGratis ? (
                <span style={{ fontFamily: 'var(--fd)', fontSize: '2rem', fontWeight: 700, color: '#27ae60' }}>Grátis</span>
              ) : preco ? (
                <span style={{ fontFamily: 'var(--fd)', fontSize: '2rem', fontWeight: 700, color: 'var(--gold)' }}>
                  R$ {preco.toFixed(2).replace('.', ',')}
                </span>
              ) : null}
            </div>
            {curso.tipo === 'lms' ? (
              <a
                href={curso.url_checkout || '#/fale-comigo'}
                className="btn-primary"
                style={{ display: 'inline-block' }}
              >
                {curso.url_checkout ? (isGratis ? 'Acessar grátis' : 'Comprar agora') : 'Em breve'}
              </a>
            ) : (
              <a
                href={curso.url_checkout || '#/cursos'}
                target="_blank" rel="noopener noreferrer"
                className="btn-primary"
                style={{ display: 'inline-block' }}
              >
                Ver na {curso.tipo === 'udemy' ? 'Udemy' : 'ESPM'} ↗
              </a>
            )}
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
};

export default CursoVendaPage;
