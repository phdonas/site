import React from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';

const livros = [
  {
    titulo: 'Gestão de Equipes Comerciais',
    subtitulo: 'Como liderar, motivar e desenvolver times de alta performance em vendas',
    ano: '2012',
    isbn: '978-85-XXXX-XXX-X',
    href: '#',
  },
  {
    titulo: 'Vendas B2B: Processo e Método',
    subtitulo: 'Um guia prático para estruturar o processo de vendas em empresas de indústria e distribuição',
    ano: '2016',
    isbn: '978-85-XXXX-XXX-X',
    href: '#',
  },
  {
    titulo: 'A Arte da Negociação Comercial',
    subtitulo: 'Técnicas e estratégias para negociadores de alta performance',
    ano: '2020',
    isbn: '978-85-XXXX-XXX-X',
    href: '#',
  },
];

const ferramentas = [
  {
    titulo: 'Diagnóstico Comercial',
    desc: 'Ferramenta de autoavaliação para mapear os gargalos do seu processo de vendas.',
    tipo: 'Planilha',
    href: '#/fale-comigo',
    cta: 'Solicitar acesso',
  },
  {
    titulo: 'Pipeline de Vendas',
    desc: 'Template de funil de vendas por etapas com indicadores de conversão.',
    tipo: 'Planilha',
    href: '#/fale-comigo',
    cta: 'Solicitar acesso',
  },
  {
    titulo: 'Roteiro de 1:1',
    desc: 'Template para reuniões individuais com vendedores — pauta, registro e follow-up.',
    tipo: 'PDF',
    href: '#/fale-comigo',
    cta: 'Solicitar acesso',
  },
  {
    titulo: 'Plano de Onboarding',
    desc: 'Estrutura para os primeiros 90 dias de um novo vendedor na equipe.',
    tipo: 'PDF',
    href: '#/fale-comigo',
    cta: 'Solicitar acesso',
  },
];

const RecursosPage: React.FC = () => (
  <main>
    {/* Hero */}
    <section style={{ background: 'var(--cream)', paddingTop: '8rem', paddingBottom: '5rem' }}>
      <div className="sec-wrap">
        <ScrollReveal>
          <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>Recursos</div>
          <h1 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', fontWeight: 700,
            lineHeight: 1.12, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1.2rem',
          }}>
            Ferramentas e livros<br />
            <em style={{ color: 'var(--navy)' }}>para aprofundar.</em>
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--ink-3)', lineHeight: 1.75, maxWidth: 520 }}>
            Recursos práticos para gestores e equipes comerciais — livros, templates e ferramentas para aplicar no dia a dia.
          </p>
        </ScrollReveal>
      </div>
    </section>

    {/* Livros */}
    <section style={{ background: 'var(--cream-d)', padding: '6rem 0' }}>
      <div className="sec-wrap">
        <ScrollReveal>
          <div className="eyebrow" style={{ marginBottom: '1rem' }}>Publicações · Amazon</div>
          <h2 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700,
            color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '3.5rem',
          }}>
            Três livros. Um corpo de conhecimento.
          </h2>
        </ScrollReveal>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {livros.map((l, i) => (
            <ScrollReveal key={l.titulo} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <div style={{
                display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '2.5rem',
                padding: '2.5rem 0', borderBottom: i < livros.length - 1 ? '1px solid var(--rule)' : 'none',
                alignItems: 'center',
              }}>
                <div style={{
                  fontFamily: 'var(--fd)', fontSize: '3.5rem', fontWeight: 700,
                  color: 'rgba(168,120,40,.18)', lineHeight: 1,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '.4rem' }}>
                    {l.titulo}
                  </h3>
                  <p style={{ fontSize: '.82rem', color: 'var(--ink-3)', lineHeight: 1.5, marginBottom: '.5rem' }}>{l.subtitulo}</p>
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.1em', color: 'var(--ink-3)' }}>{l.ano}</span>
                </div>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="btn-navy" style={{ whiteSpace: 'nowrap' }}>
                  Ver na Amazon
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Ferramentas */}
    <section style={{ background: 'var(--navy)', padding: '6rem 0' }}>
      <div className="sec-wrap">
        <ScrollReveal>
          <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '1rem' }}>
            Ferramentas e Templates
          </div>
          <h2 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700,
            color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '3rem',
          }}>
            Para aplicar amanhã de manhã.
          </h2>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {ferramentas.map((f, i) => (
            <ScrollReveal key={f.titulo} delay={((i % 2) + 1) as 1 | 2}>
              <div style={{
                background: 'rgba(243,239,230,.04)', border: '1px solid rgba(243,239,230,.07)',
                padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: 'rgba(243,239,230,.85)' }}>
                    {f.titulo}
                  </h3>
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '.45rem', letterSpacing: '.12em', color: 'var(--gold)', border: '1px solid rgba(168,120,40,.3)', padding: '.2rem .6rem', flexShrink: 0, marginLeft: '1rem' }}>
                    {f.tipo}
                  </span>
                </div>
                <p style={{ fontSize: '.84rem', color: 'rgba(243,239,230,.35)', lineHeight: 1.65, flexGrow: 1 }}>{f.desc}</p>
                <a href={f.href} className="btn-ghost" style={{ textAlign: 'center', display: 'block' }}>
                  {f.cta}
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Cursos */}
    <section style={{ background: 'var(--cream)', padding: '6rem 0' }}>
      <div className="sec-wrap" style={{ textAlign: 'center' }}>
        <ScrollReveal>
          <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '1.2rem' }}>Cursos e Formações</div>
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1rem' }}>
            Aprofunde com os cursos.
          </h2>
          <p style={{ fontSize: '.9rem', color: 'var(--ink-3)', lineHeight: 1.75, maxWidth: 420, margin: '0 auto 2.5rem' }}>
            Cursos online na Udemy e ESPM, e formações corporativas para times e líderes.
          </p>
          <a href="#/cursos" className="btn-navy">Ver todos os cursos</a>
        </ScrollReveal>
      </div>
    </section>
  </main>
);

export default RecursosPage;
