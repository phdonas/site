import React, { useEffect, useState } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import SEOHead from '../components/ui/SEOHead';
import { NewsletterForm } from '../components/ui/NewsletterForm';
import { DataService } from '../services/dataService';
import { useSiteContent } from '../hooks/useSiteContent';

const HomePage: React.FC = () => {
  const { data, loading, g, visible } = useSiteContent('home');
  const [artigos, setArtigos] = useState<any[]>([]);

  useEffect(() => {
    DataService.getArticles(3).then(setArtigos);
  }, []);

  if (loading) return null;

  // ── Derived arrays from CMS flat fields ─────────────────────────────────
  const passos = [1, 2, 3, 4].map(n => ({
    num: g('metodologia', `passo_${n}_num`) || String(n).padStart(2, '0'),
    label: g('metodologia', `passo_${n}_titulo`),
    desc: g('metodologia', `passo_${n}_descricao`),
  }));

  const situacoes = [1, 2, 3, 4].map(n => ({
    tag: g('situacoes', `situacao_${n}_marker`),
    titulo: g('situacoes', `situacao_${n}_titulo`),
    desc: g('situacoes', `situacao_${n}_descricao`),
  }));

  const servicos = [1, 2, 3, 4].map(n => ({
    href: g('servicos', `servico_${n}_link_url`),
    tag: g('servicos', n === 4 ? 'servico_4_tag' : `servico_${n}_titulo`),
    titulo: g('servicos', `servico_${n}_titulo`),
    desc: g('servicos', `servico_${n}_descricao`),
    cta: g('servicos', `servico_${n}_link_texto`),
  }));

  const recursos = [1, 2, 3].map(n => ({
    href: g('recursos', `recurso_${n}_link_url`),
    eyebrow: g('recursos', `recurso_${n}_marker`),
    titulo: g('recursos', `recurso_${n}_titulo`),
    desc: g('recursos', `recurso_${n}_descricao`),
    cta: g('recursos', `recurso_${n}_link_texto`),
  }));

  const principal = artigos[0];
  const secundarios = artigos.slice(1, 3);

  return (
    <main>
      <SEOHead
        title="Prof. Paulo H. Donassolo — Mentoria, Consultoria e Cursos Comerciais"
        description="Mais de 25 anos de gestão comercial. Mentoria individual, consultoria empresarial e cursos para gestores e equipes de vendas."
        url="https://www.phdonassolo.com/#/"
      />
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      {visible('hero') && (
        <section style={{ background: 'var(--cream)', paddingTop: '8rem', paddingBottom: '6rem', overflow: 'hidden' }}>
          <div className="sec-wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: '2rem' }}>
                {g('hero', 'tensao') ? 'Mentoria · Consultoria · Cursos' : 'Mentoria · Consultoria · Cursos'}
              </div>
              <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', fontWeight: 700, lineHeight: 1.12, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1.6rem' }}>
                {g('hero', 'headline_linha1')}<br />
                {g('hero', 'headline_linha2')}<br />
                <em style={{ fontStyle: 'italic', color: 'var(--navy)' }}>{g('hero', 'headline_destaque')}</em>
              </h1>
              {g('hero', 'tensao') && (
                <p style={{ fontFamily: 'var(--fm)', fontSize: '.75rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold)', borderLeft: '2px solid var(--gold)', paddingLeft: '1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                  {g('hero', 'tensao')}
                </p>
              )}
              <p style={{ fontSize: '.96rem', color: 'var(--ink-2)', lineHeight: 1.75, marginBottom: '2.8rem', maxWidth: 440 }}>
                {g('hero', 'subtexto')}
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href={g('hero', 'cta_primario_link') || '#/fale-comigo'} className="btn-navy">{g('hero', 'cta_primario_texto')}</a>
                <a href={g('hero', 'cta_secundario_link') || '#/prof-paulo'} className="btn-ghost-ink">{g('hero', 'cta_secundario_texto')}</a>
              </div>
              <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
                {[1, 2, 3].map(n => (
                  <div key={n}>
                    <div style={{ fontFamily: 'var(--fd)', fontSize: '2rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1 }}>{g('hero', `credencial_${n}_numero`)}</div>
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '.55rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginTop: '.25rem' }}>{g('hero', `credencial_${n}_label`)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              {g('hero', 'foto_url') ? (
                <img src={g('hero', 'foto_url')} alt={g('hero', 'foto_alt')} style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: '2px' }} />
              ) : (
                <div style={{ width: '100%', aspectRatio: '4/5', background: 'var(--navy)', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', letterSpacing: '.2em', color: 'rgba(243,239,230,.2)', textTransform: 'uppercase' }}>Foto</span>
                </div>
              )}
              <div style={{ position: 'absolute', bottom: '-2rem', right: '-2rem', background: 'var(--cream)', border: '1px solid var(--rule)', padding: '1.4rem 1.8rem', maxWidth: 280, boxShadow: '0 8px 40px rgba(23,19,14,.08)' }}>
                <p style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.55, marginBottom: '.6rem' }}>
                  "Método sem gestão é teoria. Gestão sem método é caos."
                </p>
                <span style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', opacity: .7 }}>
                  Prof. Paulo H. Donassolo
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Metodologia ───────────────────────────────────────────────── */}
      {visible('metodologia') && (
        <section style={{ background: 'var(--navy)', padding: '7rem 0' }}>
          <div className="sec-wrap">
            <ScrollReveal>
              <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '1rem' }}>{g('metodologia', 'eyebrow')}</div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 700, color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '4rem' }}>
                {g('metodologia', 'intro_texto')}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem' }}>
                {passos.map((p, i) => (
                  <React.Fragment key={p.num}>
                    <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}>
                      <div style={{ width: 80, height: 80, borderRadius: '50%', border: '1.5px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: i === passos.length - 1 ? 'rgba(168,120,40,.1)' : 'transparent', boxShadow: i === passos.length - 1 ? '0 0 0 6px rgba(168,120,40,.08)' : 'none' }}>
                        <span style={{ fontFamily: 'var(--fd)', fontSize: '2.8rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>{p.num}</span>
                      </div>
                    </div>
                    {i < passos.length - 1 && (
                      <div style={{ background: 'linear-gradient(to right, #A87828, rgba(168,120,40,0.2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.2rem', letterSpacing: '-0.1em', flex: 1, textAlign: 'center', userSelect: 'none' }}>
                        {'›'.repeat(9)}
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </ScrollReveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
              {passos.map((p, i) => (
                <ScrollReveal key={p.num} delay={(i + 1) as 1 | 2 | 3 | 4}>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, color: 'rgba(243,239,230,.85)', marginBottom: '.6rem' }}>{p.label}</div>
                  <p style={{ fontSize: '.82rem', color: 'rgba(243,239,230,.4)', lineHeight: 1.65 }}>{p.desc}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Autoridade ────────────────────────────────────────────────── */}
      {visible('autoridade') && (
        <section style={{ background: 'var(--cream-d)', padding: '7rem 0' }}>
          <div className="sec-wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
            <ScrollReveal>
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>{g('autoridade', 'eyebrow')}</div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '3rem' }}>
                {g('autoridade', 'titulo_linha1')}<br />{g('autoridade', 'titulo_linha2')}
              </h2>
              {g('autoridade', 'narrativa_paragrafo_1') && (
                <p style={{ fontSize: '.9rem', color: 'var(--ink-2)', lineHeight: 1.7, marginBottom: '1.2rem' }}>{g('autoridade', 'narrativa_paragrafo_1')}</p>
              )}
              {g('autoridade', 'narrativa_paragrafo_2') && (
                <p style={{ fontSize: '.9rem', color: 'var(--ink-2)', lineHeight: 1.7, marginBottom: '2rem' }}>{g('autoridade', 'narrativa_paragrafo_2')}</p>
              )}
              {g('autoridade', 'citacao_texto') && (
                <div style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '1.2rem', marginBottom: '2rem' }}>
                  <p style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontStyle: 'italic', color: 'var(--navy)', lineHeight: 1.65 }}>{g('autoridade', 'citacao_texto')}</p>
                </div>
              )}
              <a href="#/prof-paulo" className="btn-ghost-ink" style={{ display: 'inline-block' }}>Ver trajetória completa</a>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: -16, left: -16, right: 16, bottom: 16, border: '1px solid var(--gold)', opacity: .3 }} />
                {g('autoridade', 'foto_url') ? (
                  <img src={g('autoridade', 'foto_url')} alt={g('autoridade', 'foto_alt')} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block', position: 'relative' }} />
                ) : (
                  <div style={{ width: '100%', aspectRatio: '3/4', background: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <span style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', letterSpacing: '.2em', color: 'rgba(243,239,230,.15)', textTransform: 'uppercase' }}>Foto</span>
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '-1.5rem', background: 'var(--gold)', padding: '.6rem 1.2rem' }}>
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#fff' }}>Prof. Paulo H. Donassolo</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── Situações ─────────────────────────────────────────────────── */}
      {visible('situacoes') && (
        <section style={{ background: 'var(--cream)', padding: '7rem 0' }}>
          <div className="sec-wrap">
            <ScrollReveal>
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>{g('situacoes', 'eyebrow')}</div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '3.5rem', maxWidth: 520 }}>
                {g('situacoes', 'titulo')}
              </h2>
            </ScrollReveal>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {situacoes.map((s, i) => (
                <ScrollReveal key={s.tag} delay={((i % 2) + 1) as 1 | 2}>
                  <div style={{ background: 'var(--cream-d)', border: '1px solid var(--rule)', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTop: '2px solid var(--gold)', borderRight: '2px solid var(--gold)' }} />
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', opacity: .6, marginBottom: '1rem' }}>{s.tag}</div>
                    <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '.8rem', lineHeight: 1.3 }}>{s.titulo}</h3>
                    <p style={{ fontSize: '.95rem', color: 'var(--ink-2)', lineHeight: 1.65 }}>{s.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Serviços ──────────────────────────────────────────────────── */}
      {visible('servicos') && (
        <section style={{ background: 'var(--navy)', padding: '7rem 0' }}>
          <div className="sec-wrap">
            <ScrollReveal>
              <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '1rem' }}>{g('servicos', 'eyebrow')}</div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 700, color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '3.5rem' }}>
                {g('servicos', 'titulo')}
              </h2>
            </ScrollReveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
              {servicos.map((s, i) => (
                <ScrollReveal key={s.titulo} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                  <a href={s.href || '#'} className="svc-card" style={{ display: 'block', textDecoration: 'none' }}>
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', opacity: .6, marginBottom: '1.2rem' }}>{s.tag}</div>
                    <h3 className="svc-title" style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', fontWeight: 700, color: 'rgba(243,239,230,.85)', marginBottom: '1rem', lineHeight: 1.2 }}>{s.titulo}</h3>
                    <p className="svc-desc" style={{ fontSize: '.82rem', color: 'rgba(243,239,230,.35)', lineHeight: 1.65, flexGrow: 1 }}>{s.desc}</p>
                    <div style={{ marginTop: '2rem', fontFamily: 'var(--fm)', fontSize: '.55rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)' }}>{s.cta} →</div>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Conteúdo Recente ──────────────────────────────────────────── */}
      {visible('conteudo_recente') && (
        <section style={{ background: 'var(--cream)', padding: '7rem 0' }}>
          <div className="sec-wrap">
            <ScrollReveal>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: '.8rem' }}>{g('conteudo_recente', 'eyebrow')}</div>
                  <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em' }}>{g('conteudo_recente', 'titulo')}</h2>
                </div>
                <a href={g('conteudo_recente', 'link_ver_todos_url') || '#/conteudo'} style={{ fontFamily: 'var(--fm)', fontSize: '.55rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', textDecoration: 'none' }}>
                  {g('conteudo_recente', 'link_ver_todos_texto') || 'Ver todos'} →
                </a>
              </div>
            </ScrollReveal>
            {artigos.length === 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }}>
                <div style={{ aspectRatio: '16/9', background: 'var(--cream-d)' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {[1, 2].map(n => <div key={n} style={{ height: 140, background: 'var(--cream-d)' }} />)}
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', alignItems: 'start' }}>
                {principal && (
                  <ScrollReveal>
                    <a href={`#/artigo/${principal.id}`} style={{ display: 'block', textDecoration: 'none' }} className="card-hover">
                      {principal.coverImage ? (
                        <div style={{ aspectRatio: '16/9', overflow: 'hidden', marginBottom: '1.5rem' }}>
                          <img src={principal.coverImage} alt={principal.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ aspectRatio: '16/9', background: 'var(--navy)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: 'var(--fm)', fontSize: '.55rem', letterSpacing: '.2em', color: 'rgba(243,239,230,.15)', textTransform: 'uppercase' }}>Imagem</span>
                        </div>
                      )}
                      <div style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '.8rem' }}>{principal.category || 'Gestão Comercial'}</div>
                      <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, marginBottom: '.8rem' }}>{principal.title}</h3>
                      <p style={{ fontSize: '.85rem', color: 'var(--ink-2)', lineHeight: 1.65 }}>{principal.excerpt || principal.summary}</p>
                    </a>
                  </ScrollReveal>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {secundarios.map((a, i) => (
                    <ScrollReveal key={a.id} delay={(i + 1) as 1 | 2}>
                      <a href={`#/artigo/${a.id}`} style={{ display: 'block', textDecoration: 'none', borderTop: '1px solid var(--rule)', paddingTop: i === 0 ? 0 : '2rem' }} className="card-hover">
                        <div style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '.6rem' }}>{a.category || 'Gestão Comercial'}</div>
                        <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, marginBottom: '.5rem' }}>{a.title}</h3>
                        <p style={{ fontSize: '.8rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>{(a.excerpt || a.summary || '').substring(0, 100)}…</p>
                      </a>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Newsletter ────────────────────────────────────────────────── */}
      {visible('newsletter') && (
        <section style={{ background: 'var(--navy)', padding: '7rem 0' }}>
          <div className="sec-wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <ScrollReveal>
              <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '1.2rem' }}>{g('newsletter', 'eyebrow')}</div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '1.2rem' }}>
                {g('newsletter', 'titulo_linha1')}<br />
                <em style={{ fontStyle: 'italic' }}>{g('newsletter', 'titulo_destaque')}</em>
              </h2>
              <p style={{ fontSize: '.9rem', color: 'rgba(243,239,230,.4)', lineHeight: 1.75, maxWidth: 380 }}>{g('newsletter', 'subtexto')}</p>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <NewsletterForm />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── Recursos ──────────────────────────────────────────────────── */}
      {visible('recursos') && (
        <section style={{ background: 'var(--cream-d)', padding: '7rem 0' }}>
          <div className="sec-wrap">
            <ScrollReveal>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '3.5rem' }}>
                Aprofunde o aprendizado.
              </h2>
            </ScrollReveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {recursos.map((r, i) => (
                <ScrollReveal key={r.titulo} delay={((i + 1) as 1 | 2 | 3)}>
                  <a href={r.href || '#'} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--cream)', border: '1px solid var(--rule)', padding: '2.5rem', textDecoration: 'none', transition: 'transform .2s, box-shadow .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(23,19,14,.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', opacity: .7 }}>{r.eyebrow}</div>
                    <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>{r.titulo}</h3>
                    <p style={{ fontSize: '.84rem', color: 'var(--ink-2)', lineHeight: 1.65 }}>{r.desc}</p>
                    <div style={{ marginTop: 'auto', fontFamily: 'var(--fm)', fontSize: '.52rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)' }}>{r.cta} →</div>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Final ─────────────────────────────────────────────────── */}
      {visible('cta_final') && (
        <section style={{ background: 'var(--navy)', padding: '8rem 0', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: '8%', transform: 'translateY(-50%)', width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(168,120,40,.12)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '50%', right: '8%', transform: 'translateY(-50%)', width: 240, height: 240, borderRadius: '50%', border: '1px solid rgba(168,120,40,.1)', pointerEvents: 'none' }} />
          <div className="sec-wrap" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <ScrollReveal>
              <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'transparent', justifyContent: 'center', marginBottom: '2rem' }}>{g('cta_final', 'eyebrow')}</div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 700, color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '1.5rem', lineHeight: 1.15 }}>
                {g('cta_final', 'titulo_linha1')}<br />
                <em style={{ fontStyle: 'italic' }}>{g('cta_final', 'titulo_destaque')}</em>
              </h2>
              <p style={{ fontSize: '.95rem', color: 'rgba(243,239,230,.4)', lineHeight: 1.75, maxWidth: 440, margin: '0 auto 3rem' }}>{g('cta_final', 'subtexto')}</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href={g('cta_final', 'cta_primario_link') || '#/fale-comigo'} className="btn-primary">{g('cta_final', 'cta_primario_texto')}</a>
                {g('cta_final', 'cta_secundario_texto') && (
                  <a href={g('cta_final', 'cta_secundario_link') || '#/servicos'} className="btn-ghost" style={{ color: 'rgba(243,239,230,.6)', borderColor: 'rgba(243,239,230,.2)' }}>
                    {g('cta_final', 'cta_secundario_texto')}
                  </a>
                )}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}
    </main>
  );
};

export default HomePage;
