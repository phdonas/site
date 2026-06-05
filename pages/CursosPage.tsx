import React from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';

const cursos = [
  {
    plataforma: 'Udemy',
    titulo: 'Gestão de Equipes de Vendas',
    desc: 'Como estruturar, liderar e desenvolver times comerciais de alta performance. Mais de 3.000 alunos.',
    nivel: 'Intermediário',
    horas: '8h',
    href: '#',
  },
  {
    plataforma: 'Udemy',
    titulo: 'Negociação Comercial B2B',
    desc: 'Técnicas e estratégias para negociadores que atuam em vendas complexas e de alto valor.',
    nivel: 'Avançado',
    horas: '6h',
    href: '#',
  },
  {
    plataforma: 'ESPM',
    titulo: 'Processos Comerciais',
    desc: 'Estruturação do funil de vendas, indicadores e cadências para PMEs de indústria e distribuição.',
    nivel: 'Todos os níveis',
    horas: '12h',
    href: '#',
  },
];

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

const CursosPage: React.FC = () => (
  <main>
    {/* Hero */}
    <section style={{ background: 'var(--cream)', paddingTop: '8rem', paddingBottom: '5rem' }}>
      <div className="sec-wrap">
        <ScrollReveal>
          <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>Cursos e Formações</div>
          <h1 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', fontWeight: 700,
            lineHeight: 1.12, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1.2rem',
          }}>
            Aprenda com quem fez<br />
            <em style={{ color: 'var(--navy)' }}>antes de ensinar.</em>
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--ink-3)', lineHeight: 1.75, maxWidth: 520 }}>
            Cursos online nas principais plataformas e formações presenciais para times e líderes comerciais. Com método, não com motivação.
          </p>
        </ScrollReveal>
      </div>
    </section>

    {/* Cursos online */}
    <section style={{ background: 'var(--navy)', padding: '6rem 0' }}>
      <div className="sec-wrap">
        <ScrollReveal>
          <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '1rem' }}>
            Cursos Online
          </div>
          <h2 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700,
            color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '3rem',
          }}>
            Disponíveis agora. Estude no seu ritmo.
          </h2>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {cursos.map((c, i) => (
            <ScrollReveal key={c.titulo} delay={((i + 1) as 1 | 2 | 3)}>
              <div style={{
                background: 'rgba(243,239,230,.04)', border: '1px solid rgba(243,239,230,.07)',
                padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', opacity: .7 }}>
                    {c.plataforma}
                  </div>
                  <div style={{ display: 'flex', gap: '.5rem' }}>
                    <span style={{ fontFamily: 'var(--fm)', fontSize: '.45rem', letterSpacing: '.1em', color: 'rgba(243,239,230,.25)', border: '1px solid rgba(243,239,230,.1)', padding: '.2rem .5rem' }}>
                      {c.nivel}
                    </span>
                    <span style={{ fontFamily: 'var(--fm)', fontSize: '.45rem', letterSpacing: '.1em', color: 'rgba(243,239,230,.25)', border: '1px solid rgba(243,239,230,.1)', padding: '.2rem .5rem' }}>
                      {c.horas}
                    </span>
                  </div>
                </div>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, color: 'rgba(243,239,230,.85)' }}>
                  {c.titulo}
                </h3>
                <p style={{ fontSize: '.82rem', color: 'rgba(243,239,230,.35)', lineHeight: 1.65, flexGrow: 1 }}>
                  {c.desc}
                </p>
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textAlign: 'center', display: 'block' }}>
                  Acessar no {c.plataforma}
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
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
    <section style={{ background: 'var(--cream)', padding: '6rem 0' }}>
      <div className="sec-wrap" style={{ textAlign: 'center' }}>
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

export default CursosPage;
