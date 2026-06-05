import React, { useEffect, useState } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import SupabaseService, { Curso } from '../services/supabaseService';

const TIPOS = ['Todos', 'LMS', 'Udemy', 'ESPM'] as const;
type FiltroTipo = typeof TIPOS[number];

const tipoLabel: Record<string, string> = { lms: 'Plataforma Própria', udemy: 'Udemy', espm: 'ESPM' };

const CursoCard: React.FC<{ curso: Curso; delay: 1 | 2 | 3 }> = ({ curso, delay }) => {
  const href = curso.tipo === 'lms'
    ? `#/curso/${curso.slug}`
    : (curso.url_checkout || '#/cursos');
  const isExterno = curso.tipo !== 'lms';
  const ctaLabel = curso.tipo === 'lms' ? 'Ver o curso' : `Ver na ${tipoLabel[curso.tipo] ?? curso.tipo} ↗`;

  const preco = curso.preco_vitrine_brl;
  const precoOriginal = curso.preco_original_brl;
  const isGratis = curso.is_gratis || curso.is_free;

  return (
    <ScrollReveal delay={delay}>
      <div style={{
        background: 'rgba(243,239,230,.04)', border: '1px solid rgba(243,239,230,.07)',
        padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Capa */}
        <div style={{ aspectRatio: '16/9', background: 'var(--navy)', position: 'relative', overflow: 'hidden' }}>
          {curso.thumb_url
            ? <img src={curso.thumb_url} alt={curso.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', background: 'rgba(243,239,230,.04)' }} />
          }
          {/* Badge plataforma */}
          <div style={{
            position: 'absolute', top: '.8rem', left: '.8rem',
            fontFamily: 'var(--fm)', fontSize: '.45rem', letterSpacing: '.18em', textTransform: 'uppercase',
            color: 'var(--gold)', background: 'rgba(12,24,36,.85)', padding: '.2rem .6rem',
          }}>
            {tipoLabel[curso.tipo] ?? curso.tipo}
          </div>
          {isGratis && (
            <div style={{
              position: 'absolute', top: '.8rem', right: '.8rem',
              fontFamily: 'var(--fm)', fontSize: '.45rem', letterSpacing: '.14em', textTransform: 'uppercase',
              color: '#fff', background: '#27ae60', padding: '.2rem .6rem',
            }}>
              Grátis
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div style={{ padding: '1.6rem', display: 'flex', flexDirection: 'column', gap: '.8rem', flexGrow: 1 }}>
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
            {curso.nivel && (
              <span style={{ fontFamily: 'var(--fm)', fontSize: '.44rem', letterSpacing: '.1em', color: 'rgba(243,239,230,.3)', border: '1px solid rgba(243,239,230,.1)', padding: '.2rem .5rem' }}>
                {curso.nivel}
              </span>
            )}
            {curso.categoria && (
              <span style={{ fontFamily: 'var(--fm)', fontSize: '.44rem', letterSpacing: '.1em', color: 'rgba(243,239,230,.3)', border: '1px solid rgba(243,239,230,.1)', padding: '.2rem .5rem' }}>
                {curso.categoria}
              </span>
            )}
          </div>

          <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.15rem', fontWeight: 700, color: 'rgba(243,239,230,.85)', lineHeight: 1.25 }}>
            {curso.titulo}
          </h3>

          {curso.objetivos && (
            <p style={{ fontSize: '.8rem', color: 'rgba(243,239,230,.35)', lineHeight: 1.6, flexGrow: 1 }}>
              {curso.objetivos.substring(0, 120)}{curso.objetivos.length > 120 ? '…' : ''}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '.8rem', borderTop: '1px solid rgba(243,239,230,.06)' }}>
            <div>
              {isGratis ? (
                <span style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: '#27ae60' }}>Grátis</span>
              ) : preco ? (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '.4rem' }}>
                  {precoOriginal && precoOriginal > preco && (
                    <span style={{ fontFamily: 'var(--fm)', fontSize: '.55rem', color: 'rgba(243,239,230,.25)', textDecoration: 'line-through' }}>
                      R$ {precoOriginal.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                  <span style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: 'rgba(243,239,230,.85)' }}>
                    R$ {preco.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ) : null}
            </div>
            <a
              href={href}
              target={isExterno ? '_blank' : undefined}
              rel={isExterno ? 'noopener noreferrer' : undefined}
              className="btn-primary"
              style={{ fontSize: '.6rem', padding: '.5rem 1.1rem' }}
            >
              {ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

const CursosPage: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [stats, setStats] = useState({ total: 0, gratuitos: 0 });
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<FiltroTipo>('Todos');

  useEffect(() => {
    Promise.all([
      SupabaseService.getCursos(),
      SupabaseService.getCursosStats(),
    ]).then(([data, s]) => {
      setCursos(data);
      setStats(s);
      setLoading(false);
    });
  }, []);

  const filtrados = filtro === 'Todos'
    ? cursos
    : cursos.filter(c => c.tipo === filtro.toLowerCase());

  const lms   = filtrados.filter(c => c.tipo === 'lms');
  const udemy = filtrados.filter(c => c.tipo === 'udemy');
  const espm  = filtrados.filter(c => c.tipo === 'espm');

  const programas = [
    {
      titulo: 'Gestão Comercial para Líderes',
      desc: 'Formação intensiva para gestores que querem implementar um processo comercial estruturado na sua empresa.',
      formato: 'Turmas abertas · Corporativo in company',
      duracao: '16h (2 dias)',
    },
    {
      titulo: 'Vendas B2B: Método e Processo',
      desc: 'Capacitação de equipes de vendas para indústria e distribuição. Focado na prática, não na teoria.',
      formato: 'Corporativo in company',
      duracao: '8h (1 dia)',
    },
    {
      titulo: 'Liderança Comercial',
      desc: 'Para supervisores e gerentes que precisam desenvolver as habilidades de gestão de pessoas e processos.',
      formato: 'Turmas abertas · Corporativo in company',
      duracao: '24h (3 dias)',
    },
  ];

  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'var(--navy)', paddingTop: '8rem', paddingBottom: '5rem' }}>
        <div className="sec-wrap">
          <ScrollReveal>
            <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '1.5rem' }}>
              Cursos e Formações
            </div>
            <h1 style={{
              fontFamily: 'var(--fd)', fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', fontWeight: 700,
              lineHeight: 1.12, color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '1.2rem',
            }}>
              Aprenda com quem fez<br />
              <em style={{ color: 'var(--gold)' }}>antes de ensinar.</em>
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(243,239,230,.45)', lineHeight: 1.75, maxWidth: 520, marginBottom: '2.5rem' }}>
              Cursos online nas principais plataformas e formações presenciais para times e líderes comerciais. Com método, não com motivação.
            </p>
            {/* Stats */}
            <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
              {[
                { n: loading ? '—' : String(stats.total), label: 'cursos disponíveis' },
                { n: loading ? '—' : String(stats.gratuitos), label: 'gratuitos' },
                { n: '20+', label: 'anos ensinando' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(243,239,230,.35)', marginTop: '.3rem' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Filtro de tipo */}
      <section style={{ background: 'var(--navy)', borderBottom: '1px solid rgba(243,239,230,.07)', padding: '.8rem 0', position: 'sticky', top: 62, zIndex: 50 }}>
        <div className="sec-wrap">
          <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
            {TIPOS.map(t => (
              <button key={t} onClick={() => setFiltro(t)} style={{
                fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.14em', textTransform: 'uppercase',
                padding: '.4rem 1rem', border: '1px solid', cursor: 'pointer', transition: 'all .2s',
                background: filtro === t ? 'var(--gold)' : 'transparent',
                color: filtro === t ? 'var(--navy)' : 'rgba(243,239,230,.45)',
                borderColor: filtro === t ? 'var(--gold)' : 'rgba(243,239,230,.15)',
              }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cursos online */}
      <section style={{ background: 'var(--navy)', padding: '5rem 0' }}>
        <div className="sec-wrap">
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ background: 'rgba(243,239,230,.04)', aspectRatio: '3/4' }} />
              ))}
            </div>
          ) : filtrados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', color: 'rgba(243,239,230,.35)', fontStyle: 'italic' }}>
                Nenhum curso encontrado.
              </p>
            </div>
          ) : (
            <>
              {(filtro === 'Todos' || filtro === 'LMS') && lms.length > 0 && (
                <div style={{ marginBottom: '4rem' }}>
                  <ScrollReveal>
                    <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '2rem' }}>
                      Plataforma PHDonassolo
                    </div>
                  </ScrollReveal>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    {lms.map((c, i) => <CursoCard key={c.id} curso={c} delay={((i % 3) + 1) as 1 | 2 | 3} />)}
                  </div>
                </div>
              )}

              {(filtro === 'Todos' || filtro === 'Udemy') && udemy.length > 0 && (
                <div style={{ marginBottom: '4rem' }}>
                  <ScrollReveal>
                    <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '2rem' }}>
                      Udemy
                    </div>
                  </ScrollReveal>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    {udemy.map((c, i) => <CursoCard key={c.id} curso={c} delay={((i % 3) + 1) as 1 | 2 | 3} />)}
                  </div>
                </div>
              )}

              {(filtro === 'Todos' || filtro === 'ESPM') && espm.length > 0 && (
                <div>
                  <ScrollReveal>
                    <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '2rem' }}>
                      ESPM
                    </div>
                  </ScrollReveal>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    {espm.map((c, i) => <CursoCard key={c.id} curso={c} delay={((i % 3) + 1) as 1 | 2 | 3} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Formações corporativas */}
      <section style={{ background: 'var(--cream-d)', padding: '6rem 0' }}>
        <div className="sec-wrap">
          <ScrollReveal>
            <div className="eyebrow" style={{ marginBottom: '1rem' }}>Formações Corporativas</div>
            <h2 style={{
              fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700,
              color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '3.5rem',
            }}>
              Para times e líderes. In company ou turmas abertas.
            </h2>
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {programas.map((p, i) => (
              <ScrollReveal key={p.titulo} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem',
                  padding: '2.5rem 0', borderBottom: i < programas.length - 1 ? '1px solid var(--rule)' : 'none',
                  alignItems: 'start',
                }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '.6rem' }}>
                      {p.titulo}
                    </h3>
                    <p style={{ fontSize: '.88rem', color: 'var(--ink-3)', lineHeight: 1.65, marginBottom: '.8rem' }}>{p.desc}</p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.12em', color: 'var(--ink-3)' }}>{p.formato}</span>
                      <span style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.12em', color: 'var(--gold)' }}>{p.duracao}</span>
                    </div>
                  </div>
                  <a href="#/fale-comigo" className="btn-navy" style={{ whiteSpace: 'nowrap', alignSelf: 'center' }}>
                    Solicitar proposta
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Área do Aluno */}
      <section style={{ background: 'var(--cream)', padding: '6rem 0', textAlign: 'center' }}>
        <div className="sec-wrap">
          <ScrollReveal>
            <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '1.2rem' }}>Plataforma de Cursos</div>
            <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1rem' }}>
              Área do Aluno — Em breve
            </h2>
            <p style={{ fontSize: '.9rem', color: 'var(--ink-3)', lineHeight: 1.75, maxWidth: 420, margin: '0 auto 2.5rem' }}>
              Uma plataforma dedicada com todos os materiais, aulas gravadas e ferramentas exclusivas. Cadastre-se para ser avisado.
            </p>
            <a href="#/area-do-aluno" className="btn-ghost-ink">Quero ser avisado →</a>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
};

export default CursosPage;
