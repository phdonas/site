import React, { useEffect, useState } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import { NewsletterForm } from '../components/ui/NewsletterForm';
import { DataService } from '../services/dataService';

/* ── Hero ──────────────────────────────────────────────────────── */
const Hero: React.FC = () => (
  <section style={{ background: 'var(--cream)', paddingTop: '8rem', paddingBottom: '6rem', overflow: 'hidden' }}>
    <div className="sec-wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
      {/* Left */}
      <div>
        <div className="eyebrow" style={{ marginBottom: '2rem' }}>Mentoria · Consultoria · Cursos</div>

        <h1 style={{
          fontFamily: 'var(--fd)', fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', fontWeight: 700,
          lineHeight: 1.12, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1.6rem',
        }}>
          Sua equipe vende.<br />
          Mas poderia vender<br />
          <em style={{ fontStyle: 'italic', color: 'var(--navy)' }}>mais, e melhor.</em>
        </h1>

        <p style={{
          fontFamily: 'var(--fm)', fontSize: '.75rem', letterSpacing: '.22em', textTransform: 'uppercase',
          color: 'var(--gold)', borderLeft: '2px solid var(--gold)', paddingLeft: '1rem',
          marginBottom: '2rem', lineHeight: 1.6,
        }}>
          A maioria dos times comerciais trabalha duro —<br />
          mas sem método, estratégia e gestão real,<br />
          esforço não vira resultado.
        </p>

        <p style={{ fontSize: '.96rem', color: 'var(--ink-2)', lineHeight: 1.75, marginBottom: '2.8rem', maxWidth: 440 }}>
          Prof. Paulo H. Donassolo forma gestores e equipes comerciais que transformam processo em performance, consistência em crescimento.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="#/fale-comigo" className="btn-navy">Quero conversar</a>
          <a href="#/prof-paulo" className="btn-ghost-ink">Conheça o Prof. Paulo</a>
        </div>

        {/* Credentials */}
        <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
          {[
            { num: '25+', label: 'anos de mercado' },
            { num: '20+', label: 'clientes atendidos' },
            { num: '3', label: 'livros publicados' },
          ].map(c => (
            <div key={c.label}>
              <div style={{ fontFamily: 'var(--fd)', fontSize: '2rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1 }}>
                {c.num}
              </div>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '.55rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginTop: '.25rem' }}>
                {c.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — photo placeholder + quote */}
      <div style={{ position: 'relative' }}>
        <div style={{
          width: '100%', aspectRatio: '4/5', background: 'var(--navy)',
          borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', letterSpacing: '.2em', color: 'rgba(243,239,230,.2)', textTransform: 'uppercase' }}>
            Foto
          </span>
        </div>
        {/* Quote card */}
        <div style={{
          position: 'absolute', bottom: '-2rem', right: '-2rem', background: 'var(--cream)',
          border: '1px solid var(--rule)', padding: '1.4rem 1.8rem', maxWidth: 280,
          boxShadow: '0 8px 40px rgba(23,19,14,.08)',
        }}>
          <p style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.55, marginBottom: '.6rem' }}>
            "Método sem gestão é teoria. Gestão sem método é caos."
          </p>
          <span style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', opacity: .7 }}>
            Prof. Paulo H. Donassolo
          </span>
        </div>
      </div>
    </div>

    <style>{`
      @media (max-width: 768px) {
        .hero-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
      }
    `}</style>
  </section>
);

/* ── Metodologia ──────────────────────────────────────────────── */
const passos = [
  { num: '01', label: 'Diagnóstico', desc: 'Mapeamos o estado real da equipe: gaps de processo, comportamento e gestão.' },
  { num: '02', label: 'Estruturação', desc: 'Definimos o método comercial, papéis claros e indicadores relevantes.' },
  { num: '03', label: 'Ativação', desc: 'Treinamos, acompanhamos e ajustamos em campo — com resultado mensurável.' },
  { num: '04', label: 'Sustentação', desc: 'A liderança assume o processo. O time vende sem depender de você.' },
];

const Metodologia: React.FC = () => (
  <section style={{ background: 'var(--navy)', padding: '7rem 0' }}>
    <div className="sec-wrap">
      <ScrollReveal>
        <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '1rem' }}>
          A Metodologia
        </div>
        <h2 style={{
          fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 700,
          color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '4rem',
        }}>
          Um caminho com começo, meio e fim.
        </h2>
      </ScrollReveal>

      {/* Círculos + conectores */}
      <ScrollReveal delay={1}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem' }}>
          {passos.map((p, i) => (
            <React.Fragment key={p.num}>
              <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%', border: '1.5px solid var(--gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i === passos.length - 1 ? 'rgba(168,120,40,.1)' : 'transparent',
                  boxShadow: i === passos.length - 1 ? '0 0 0 6px rgba(168,120,40,.08)' : 'none',
                }}>
                  <span style={{ fontFamily: 'var(--fd)', fontSize: '2.8rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>
                    {p.num}
                  </span>
                </div>
              </div>
              {i < passos.length - 1 && (
                <div style={{
                  background: 'linear-gradient(to right, #A87828, rgba(168,120,40,0.2))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.2rem',
                  letterSpacing: '-0.1em',
                  flex: 1,
                  textAlign: 'center',
                  userSelect: 'none',
                }}>
                  {'›'.repeat(9)}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </ScrollReveal>

      {/* Labels e descrições */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
        {passos.map((p, i) => (
          <ScrollReveal key={p.num} delay={(i + 1) as 1 | 2 | 3 | 4}>
            <div style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, color: 'rgba(243,239,230,.85)', marginBottom: '.6rem' }}>
              {p.label}
            </div>
            <p style={{ fontSize: '.82rem', color: 'rgba(243,239,230,.4)', lineHeight: 1.65 }}>
              {p.desc}
            </p>
          </ScrollReveal>
        ))}
      </div>
    </div>

    <style>{`
      @media (max-width: 768px) {
        .met-grid { grid-template-columns: 1fr 1fr !important; }
      }
      @media (max-width: 480px) {
        .met-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
  </section>
);

/* ── Autoridade ───────────────────────────────────────────────── */
const trajetoria = [
  { ano: '1998', desc: 'Início de carreira em vendas B2B no setor industrial' },
  { ano: '2005', desc: 'Primeiro cargo de gestão comercial — time de 40 pessoas' },
  { ano: '2012', desc: 'Primeiro livro publicado: Gestão de Equipes Comerciais' },
  { ano: '2018', desc: 'Fundação da própria consultoria — +20 clientes atendidos' },
];

const Autoridade: React.FC = () => (
  <section style={{ background: 'var(--cream-d)', padding: '7rem 0' }}>
    <div className="sec-wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
      {/* Timeline */}
      <ScrollReveal>
        <div className="eyebrow" style={{ marginBottom: '1rem' }}>Trajetória</div>
        <h2 style={{
          fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700,
          color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '3rem',
        }}>
          Quem está do outro<br />lado da mesa.
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {trajetoria.map((t, i) => (
            <div key={t.ano} style={{ display: 'flex', gap: '1.5rem', position: 'relative', paddingBottom: i < trajetoria.length - 1 ? '2rem' : 0 }}>
              {i < trajetoria.length - 1 && (
                <div style={{ position: 'absolute', left: 39, top: 28, bottom: 0, width: 1, background: 'var(--rule)' }} />
              )}
              <div style={{
                flexShrink: 0, width: 80, height: 28, background: 'var(--gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.14em', color: '#fff', fontWeight: 600 }}>
                  {t.ano}
                </span>
              </div>
              <p style={{ fontSize: '.88rem', color: 'var(--ink-2)', lineHeight: 1.6, paddingTop: '.3rem' }}>{t.desc}</p>
            </div>
          ))}
        </div>

        <a href="#/prof-paulo" className="btn-ghost-ink" style={{ display: 'inline-block', marginTop: '2.5rem' }}>
          Ver trajetória completa
        </a>
      </ScrollReveal>

      {/* Photo placeholder */}
      <ScrollReveal delay={2}>
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', top: -16, left: -16, right: 16, bottom: 16,
            border: '1px solid var(--gold)', opacity: .3,
          }} />
          <div style={{
            width: '100%', aspectRatio: '3/4', background: 'var(--ink-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
          }}>
            <span style={{ fontFamily: 'var(--fm)', fontSize: '.6rem', letterSpacing: '.2em', color: 'rgba(243,239,230,.15)', textTransform: 'uppercase' }}>
              Foto
            </span>
          </div>
          <div style={{
            position: 'absolute', bottom: '1.5rem', left: '-1.5rem',
            background: 'var(--gold)', padding: '.6rem 1.2rem',
          }}>
            <span style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#fff' }}>
              Prof. Paulo H. Donassolo
            </span>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

/* ── Situações ────────────────────────────────────────────────── */
const situacoes = [
  {
    tag: 'Situação 01',
    titulo: 'Vendedores que dependem de você',
    desc: 'Toda negociação complexa escala para você. O time não tem autonomia para fechar.',
  },
  {
    tag: 'Situação 02',
    titulo: 'Meta atingida, mas sem consistência',
    desc: 'Meses bons e meses ruins sem explicação. Não há processo — há sorte.',
  },
  {
    tag: 'Situação 03',
    titulo: 'Turnover alto e onboarding lento',
    desc: 'Cada saída custa meses de ramp-up. O conhecimento não fica na empresa.',
  },
  {
    tag: 'Situação 04',
    titulo: 'Gestores que gerenciam na intuição',
    desc: 'Reuniões sem pauta, feedback sem método, pipeline sem visibilidade real.',
  },
];

const Situacoes: React.FC = () => (
  <section style={{ background: 'var(--cream)', padding: '7rem 0' }}>
    <div className="sec-wrap">
      <ScrollReveal>
        <div className="eyebrow" style={{ marginBottom: '1rem' }}>Você está aqui?</div>
        <h2 style={{
          fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 700,
          color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '3.5rem', maxWidth: 520,
        }}>
          Se alguma dessas situações parece familiar, podemos ajudar.
        </h2>
      </ScrollReveal>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {situacoes.map((s, i) => (
          <ScrollReveal key={s.tag} delay={((i % 2) + 1) as 1 | 2}>
            <div style={{
              background: 'var(--cream-d)', border: '1px solid var(--rule)',
              padding: '2.5rem', position: 'relative', overflow: 'hidden',
            }}>
              {/* Gold corner decoration */}
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: 40, height: 40,
                borderTop: '2px solid var(--gold)', borderRight: '2px solid var(--gold)',
              }} />
              <div style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', opacity: .6, marginBottom: '1rem' }}>
                {s.tag}
              </div>
              <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '.8rem', lineHeight: 1.3 }}>
                {s.titulo}
              </h3>
              <p style={{ fontSize: '.95rem', color: 'var(--ink-2)', lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

/* ── Serviços ─────────────────────────────────────────────────── */
const servicos = [
  {
    href: '#/mentoria',
    tag: 'Individual',
    titulo: 'Mentoria',
    desc: 'Para gestores e líderes comerciais que querem acelerar resultados com acompanhamento próximo e personalizado.',
    cta: 'Saiba mais',
  },
  {
    href: '#/consultoria',
    tag: 'Empresas',
    titulo: 'Consultoria',
    desc: 'Diagnóstico, estruturação e ativação do processo comercial — da estratégia à execução em campo.',
    cta: 'Saiba mais',
  },
  {
    href: '#/cursos',
    tag: 'Grupos e Times',
    titulo: 'Cursos e Formações',
    desc: 'Programas práticos para times comerciais e líderes que querem evoluir com método e consistência.',
    cta: 'Ver programas',
  },
  {
    href: '#/conteudo',
    tag: 'Gratuito',
    titulo: 'Conteúdo',
    desc: 'Artigos, vídeos e recursos para quem quer aprender gestão comercial de forma aplicada e direta.',
    cta: 'Explorar',
  },
];

const Servicos: React.FC = () => (
  <section style={{ background: 'var(--navy)', padding: '7rem 0' }}>
    <div className="sec-wrap">
      <ScrollReveal>
        <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '1rem' }}>
          Como posso ajudar
        </div>
        <h2 style={{
          fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 700,
          color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '3.5rem',
        }}>
          Escolha o formato certo<br />para o seu momento.
        </h2>
      </ScrollReveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        {servicos.map((s, i) => (
          <ScrollReveal key={s.titulo} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
            <a href={s.href} className="svc-card" style={{ display: 'block', textDecoration: 'none' }}>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', opacity: .6, marginBottom: '1.2rem' }}>
                {s.tag}
              </div>
              <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', fontWeight: 700, color: 'rgba(243,239,230,.85)', marginBottom: '1rem', lineHeight: 1.2 }}>
                {s.titulo}
              </h3>
              <p style={{ fontSize: '.82rem', color: 'rgba(243,239,230,.35)', lineHeight: 1.65, flexGrow: 1 }}>
                {s.desc}
              </p>
              <div style={{ marginTop: '2rem', fontFamily: 'var(--fm)', fontSize: '.55rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                {s.cta} →
              </div>
            </a>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

/* ── Conteúdo Recente ─────────────────────────────────────────── */
const ConteudoRecente: React.FC = () => {
  const [artigos, setArtigos] = useState<any[]>([]);

  useEffect(() => {
    DataService.getArticles(3).then(setArtigos);
  }, []);

  const principal = artigos[0];
  const secundarios = artigos.slice(1, 3);

  return (
    <section style={{ background: 'var(--cream)', padding: '7rem 0' }}>
      <div className="sec-wrap">
        <ScrollReveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: '.8rem' }}>Conteúdo</div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em' }}>
                Últimos artigos
              </h2>
            </div>
            <a href="#/conteudo" style={{ fontFamily: 'var(--fm)', fontSize: '.55rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', textDecoration: 'none' }}>
              Ver todos →
            </a>
          </div>
        </ScrollReveal>

        {artigos.length === 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }}>
            <div style={{ aspectRatio: '16/9', background: 'var(--cream-d)', animation: 'pulse 1.5s infinite' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[1, 2].map(n => <div key={n} style={{ height: 140, background: 'var(--cream-d)', animation: 'pulse 1.5s infinite' }} />)}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', alignItems: 'start' }}>
            {/* Principal */}
            {principal && (
              <ScrollReveal>
                <a href={`#/artigo/${principal.id}`} style={{ display: 'block', textDecoration: 'none' }} className="card-hover">
                  {principal.coverImage && (
                    <div style={{ aspectRatio: '16/9', overflow: 'hidden', marginBottom: '1.5rem' }}>
                      <img src={principal.coverImage} alt={principal.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s ease' }} />
                    </div>
                  )}
                  {!principal.coverImage && (
                    <div style={{ aspectRatio: '16/9', background: 'var(--navy)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'var(--fm)', fontSize: '.55rem', letterSpacing: '.2em', color: 'rgba(243,239,230,.15)', textTransform: 'uppercase' }}>Imagem</span>
                    </div>
                  )}
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '.8rem' }}>
                    {principal.category || 'Gestão Comercial'}
                  </div>
                  <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, marginBottom: '.8rem' }}>
                    {principal.title}
                  </h3>
                  <p style={{ fontSize: '.85rem', color: 'var(--ink-2)', lineHeight: 1.65 }}>
                    {principal.excerpt || principal.summary}
                  </p>
                </a>
              </ScrollReveal>
            )}

            {/* Secundários */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {secundarios.map((a, i) => (
                <ScrollReveal key={a.id} delay={(i + 1) as 1 | 2}>
                  <a href={`#/artigo/${a.id}`} style={{ display: 'block', textDecoration: 'none', borderTop: '1px solid var(--rule)', paddingTop: i === 0 ? 0 : '2rem' }} className="card-hover">
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '.6rem' }}>
                      {a.category || 'Gestão Comercial'}
                    </div>
                    <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, marginBottom: '.5rem' }}>
                      {a.title}
                    </h3>
                    <p style={{ fontSize: '.8rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>
                      {(a.excerpt || a.summary || '').substring(0, 100)}…
                    </p>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

/* ── Newsletter ───────────────────────────────────────────────── */
const NewsletterSection: React.FC = () => (
  <section style={{ background: 'var(--navy)', padding: '7rem 0' }}>
    <div className="sec-wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
      <ScrollReveal>
        <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '1.2rem' }}>
          Newsletter
        </div>
        <h2 style={{
          fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700,
          color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '1.2rem',
        }}>
          Uma ideia aplicável<br />por semana.
        </h2>
        <p style={{ fontSize: '.9rem', color: 'rgba(243,239,230,.4)', lineHeight: 1.75, maxWidth: 380 }}>
          Reflexões sobre gestão comercial, liderança e desenvolvimento de times — direto para o seu e-mail, sem ruído.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={2}>
        <NewsletterForm />
      </ScrollReveal>
    </div>
  </section>
);

/* ── Recursos ─────────────────────────────────────────────────── */
const recursos = [
  {
    href: '#/area-do-aluno',
    eyebrow: 'Plataforma',
    titulo: 'Área do Aluno',
    desc: 'Acesse os materiais dos programas e formações com login seguro.',
    cta: 'Acessar plataforma',
  },
  {
    href: '#/cursos',
    eyebrow: 'Udemy · ESPM',
    titulo: 'Cursos Online',
    desc: 'Formações práticas disponíveis nas principais plataformas de ensino.',
    cta: 'Ver cursos',
  },
  {
    href: '#/recursos',
    eyebrow: 'Amazon',
    titulo: 'Livros',
    desc: 'Três livros publicados sobre gestão de vendas, liderança e performance comercial.',
    cta: 'Conhecer os livros',
  },
];

const RecursosSection: React.FC = () => (
  <section style={{ background: 'var(--cream-d)', padding: '7rem 0' }}>
    <div className="sec-wrap">
      <ScrollReveal>
        <div className="eyebrow" style={{ marginBottom: '1rem' }}>Recursos</div>
        <h2 style={{
          fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700,
          color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '3.5rem',
        }}>
          Aprofunde o aprendizado.
        </h2>
      </ScrollReveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {recursos.map((r, i) => (
          <ScrollReveal key={r.titulo} delay={((i + 1) as 1 | 2 | 3)}>
            <a href={r.href} style={{
              display: 'flex', flexDirection: 'column', gap: '1rem',
              background: 'var(--cream)', border: '1px solid var(--rule)', padding: '2.5rem',
              textDecoration: 'none', transition: 'transform .2s, box-shadow .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(23,19,14,.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', opacity: .7 }}>
                {r.eyebrow}
              </div>
              <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>
                {r.titulo}
              </h3>
              <p style={{ fontSize: '.84rem', color: 'var(--ink-2)', lineHeight: 1.65 }}>{r.desc}</p>
              <div style={{ marginTop: 'auto', fontFamily: 'var(--fm)', fontSize: '.52rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                {r.cta} →
              </div>
            </a>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

/* ── CTA Final ────────────────────────────────────────────────── */
const CTAFinal: React.FC = () => (
  <section style={{ background: 'var(--navy)', padding: '8rem 0', overflow: 'hidden', position: 'relative' }}>
    {/* Geometric decorations */}
    <div style={{ position: 'absolute', top: '50%', left: '8%', transform: 'translateY(-50%)', width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(168,120,40,.12)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', top: '50%', left: '8%', transform: 'translateY(-50%)', width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(168,120,40,.08)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', top: '50%', right: '8%', transform: 'translateY(-50%)', width: 240, height: 240, borderRadius: '50%', border: '1px solid rgba(168,120,40,.1)', pointerEvents: 'none' }} />

    <div className="sec-wrap" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <ScrollReveal>
        <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'transparent', justifyContent: 'center', marginBottom: '2rem' }}>
          Próximo passo
        </div>
        <h2 style={{
          fontFamily: 'var(--fd)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 700,
          color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '1.5rem', lineHeight: 1.15,
        }}>
          Vamos conversar sobre<br />o seu desafio?
        </h2>
        <p style={{ fontSize: '.95rem', color: 'rgba(243,239,230,.4)', lineHeight: 1.75, maxWidth: 440, margin: '0 auto 3rem' }}>
          Uma conversa de 30 minutos para entender o que está travando seu time e como podemos resolver juntos.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#/fale-comigo" className="btn-primary">Agendar conversa</a>
          <a href="#/servicos" className="btn-ghost" style={{ color: 'rgba(243,239,230,.6)', borderColor: 'rgba(243,239,230,.2)' }}>
            Ver todos os serviços
          </a>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

/* ── Page ─────────────────────────────────────────────────────── */
const HomePage: React.FC = () => (
  <main>
    <Hero />
    <Metodologia />
    <Autoridade />
    <Situacoes />
    <Servicos />
    <ConteudoRecente />
    <NewsletterSection />
    <RecursosSection />
    <CTAFinal />
  </main>
);

export default HomePage;
