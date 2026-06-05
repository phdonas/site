import React from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import { useSiteContent } from '../hooks/useSiteContent';

const ProfPauloPage: React.FC = () => {
  const { g, visible } = useSiteContent('prof_paulo');

  const formacao = [1, 2, 3, 4, 5]
    .map(n => ({
      badge: g('filosofia', `formacao_item_${n}_badge`),
      titulo: g('filosofia', `formacao_item_${n}_titulo`),
      inst: g('filosofia', `formacao_item_${n}_descricao`),
    }))
    .filter(f => Boolean(f.titulo));

  const livros = [1, 2, 3]
    .map(n => ({
      num: g('livros', `livro_${n}_numero`) || String(n).padStart(2, '0'),
      titulo: g('livros', `livro_${n}_titulo`),
      desc: g('livros', `livro_${n}_descricao`),
      amazon: g('livros', `livro_${n}_link_amazon`),
      capa: g('livros', `livro_${n}_capa_url`),
    }))
    .filter(l => Boolean(l.titulo));

  const trajetoria = [1, 2, 3, 4]
    .map(n => ({
      ano: g('timeline', `entrada_${n}_periodo`),
      desc: g('timeline', `entrada_${n}_descricao`),
    }))
    .filter(t => Boolean(t.desc));

  const narrativaParags = [1, 2, 3, 4]
    .map(n => g('narrativa', `paragrafo_${n}`))
    .filter(Boolean);

  return (
    <main>
      {/* Hero */}
      {visible('hero') && (
        <section style={{ background: 'var(--cream)', paddingTop: '8rem', paddingBottom: '6rem' }}>
          <div className="sec-wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <ScrollReveal>
              <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>{g('hero', 'eyebrow')}</div>
              <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', fontWeight: 700, lineHeight: 1.12, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1.6rem' }}>
                {g('hero', 'titulo_linha1')}<br />
                <em style={{ color: 'var(--navy)' }}>{g('hero', 'titulo_linha2')}</em>
              </h1>
              {g('hero', 'citacao_texto') && (
                <p style={{ fontFamily: 'var(--fd)', fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--navy)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  {g('hero', 'citacao_texto')}
                </p>
              )}
              {(g('hero', 'credencial_1_numero') || g('hero', 'credencial_2_numero') || g('hero', 'credencial_3_numero')) && (
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                  {[1, 2, 3].map(n => {
                    const num = g('hero', `credencial_${n}_numero`);
                    const label = g('hero', `credencial_${n}_label`);
                    return num ? (
                      <div key={n}>
                        <div style={{ fontFamily: 'var(--fd)', fontSize: '2rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1 }}>{num}</div>
                        <div style={{ fontFamily: 'var(--fm)', fontSize: '.55rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginTop: '.25rem' }}>{label}</div>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="#/fale-comigo" className="btn-navy">Fale comigo</a>
                <a href="#/servicos" className="btn-ghost-ink">Ver serviços →</a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={2}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: -16, left: -16, right: 16, bottom: 16, border: '1px solid var(--gold)', opacity: .3 }} />
                {g('hero', 'foto_url') ? (
                  <img src={g('hero', 'foto_url')} alt={g('hero', 'foto_alt')} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block', position: 'relative' }} />
                ) : (
                  <div style={{ width: '100%', aspectRatio: '3/4', background: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <span style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', letterSpacing: '.2em', color: 'rgba(243,239,230,.15)', textTransform: 'uppercase' }}>Foto</span>
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '-1.5rem', background: 'var(--gold)', padding: '.6rem 1.2rem' }}>
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#fff' }}>Professor · Consultor · Mentor</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Narrativa */}
      {visible('narrativa') && narrativaParags.length > 0 && (
        <section style={{ background: 'var(--navy)', padding: '6rem 0' }}>
          <div className="sec-wrap">
            <ScrollReveal>
              <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '1rem' }}>{g('narrativa', 'eyebrow')}</div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '3.5rem' }}>
                {g('narrativa', 'titulo')}
              </h2>
            </ScrollReveal>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
              <ScrollReveal>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                  {narrativaParags.map((p, i) => (
                    <p key={i} style={{ fontSize: '.9rem', color: 'rgba(243,239,230,.45)', lineHeight: 1.7 }}>{p}</p>
                  ))}
                </div>
              </ScrollReveal>
              {g('narrativa', 'pullquote_texto') && (
                <ScrollReveal delay={2}>
                  <div style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '2rem' }}>
                    <p style={{ fontFamily: 'var(--fd)', fontSize: '1.3rem', fontStyle: 'italic', color: 'rgba(243,239,230,.75)', lineHeight: 1.55, marginBottom: '1rem' }}>
                      {g('narrativa', 'pullquote_texto')}
                    </p>
                    {g('narrativa', 'pullquote_citacao') && (
                      <span style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', opacity: .7 }}>
                        {g('narrativa', 'pullquote_citacao')}
                      </span>
                    )}
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Trajetória — fallback para timeline entries ou legado */}
      {visible('timeline') && trajetoria.length > 0 && (
        <section style={{ background: 'var(--cream-d)', padding: '6rem 0' }}>
          <div className="sec-wrap">
            <ScrollReveal>
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>{g('timeline', 'eyebrow')}</div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '3.5rem' }}>
                {g('timeline', 'titulo')}
              </h2>
            </ScrollReveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {trajetoria.map((t, i) => (
                <ScrollReveal key={i} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '2.5rem', padding: '2rem 0', borderBottom: i < trajetoria.length - 1 ? '1px solid var(--rule)' : 'none' }}>
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '.75rem', letterSpacing: '.1em', color: 'var(--gold)', paddingTop: '.3rem' }}>{t.ano}</div>
                    <p style={{ fontSize: '.9rem', color: 'var(--ink-2)', lineHeight: 1.7 }}>{t.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Formação Acadêmica */}
      {visible('filosofia') && formacao.length > 0 && (
        <section style={{ background: 'var(--cream)', padding: '6rem 0' }}>
          <div className="sec-wrap">
            <ScrollReveal>
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>{g('filosofia', 'eyebrow')}</div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '3rem' }}>
                {g('filosofia', 'titulo')}
              </h2>
            </ScrollReveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              {formacao.map((f, i) => (
                <ScrollReveal key={f.titulo} delay={((i % 2) + 1) as 1 | 2}>
                  <div style={{ background: 'var(--cream-d)', border: '1px solid var(--rule)', padding: '2rem' }}>
                    {f.badge && (
                      <div style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', opacity: .7, marginBottom: '.8rem' }}>
                        {f.badge} · {f.inst}
                      </div>
                    )}
                    <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>{f.titulo}</h3>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Livros */}
      {visible('livros') && livros.length > 0 && (
        <section style={{ background: 'var(--cream-d)', padding: '6rem 0' }}>
          <div className="sec-wrap">
            <ScrollReveal>
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>{g('livros', 'eyebrow')}</div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '3rem' }}>
                {g('livros', 'titulo')}
              </h2>
            </ScrollReveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {livros.map((l, i) => (
                <ScrollReveal key={l.titulo} delay={((i % 3) + 1) as 1 | 2 | 3}>
                  <div style={{ display: 'grid', gridTemplateColumns: l.capa ? '80px 1fr auto' : '60px 1fr auto', gap: '2rem', padding: '2.5rem 0', borderBottom: i < livros.length - 1 ? '1px solid var(--rule)' : 'none', alignItems: 'center' }}>
                    {l.capa ? (
                      <img src={l.capa} alt={l.titulo} style={{ width: 80, aspectRatio: '2/3', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ fontFamily: 'var(--fd)', fontSize: '3rem', fontWeight: 700, color: 'rgba(168,120,40,.18)', lineHeight: 1, letterSpacing: '-.02em' }}>
                        {l.num}
                      </div>
                    )}
                    <div>
                      <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '.4rem' }}>{l.titulo}</h3>
                      <p style={{ fontSize: '.82rem', color: 'var(--ink-3)', lineHeight: 1.5 }}>{l.desc}</p>
                    </div>
                    {l.amazon ? (
                      <a href={l.amazon} target="_blank" rel="noopener noreferrer" className="btn-ghost-ink" style={{ whiteSpace: 'nowrap', fontSize: '.75rem' }}>
                        Ver na Amazon →
                      </a>
                    ) : null}
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal>
              <div style={{ marginTop: '2.5rem' }}>
                <a href="#/recursos" className="btn-ghost-ink">Ver todos os livros na Amazon →</a>
              </div>
            </ScrollReveal>
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
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href={g('cta_final', 'cta_primario_link') || '#/fale-comigo'} className="btn-primary">
                  {g('cta_final', 'cta_primario_texto')}
                </a>
                {g('cta_final', 'cta_secundario_texto') && (
                  <a href={g('cta_final', 'cta_secundario_link') || '#/servicos'} className="btn-ghost">
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

export default ProfPauloPage;
