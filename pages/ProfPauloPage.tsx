import React from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';

const formacao = [
  { titulo: 'Mestre em Administração de Empresas', inst: 'Unisinos' },
  { titulo: 'MBA em Marketing Estratégico', inst: 'FGV' },
  { titulo: 'MBA em Gestão por Processos', inst: 'FGV' },
  { titulo: 'Formador Certificado', inst: 'IEFP — Portugal' },
];

const trajetoria = [
  { ano: '1998–2012', desc: 'Mais de 14 anos como Gerente e Diretor Comercial em empresas de indústria de bens de consumo e distribuição no Brasil. Liderou equipes de 5 a 80 profissionais de vendas.' },
  { ano: '2004–hoje', desc: 'Professor de MBA e pós-graduação em Vendas, Negociação e Gestão Comercial — ESPM, Unisinos e outras instituições. Mais de 20 anos em sala de aula.' },
  { ano: '2012–hoje', desc: 'Fundação da consultoria própria. Atende PMEs de indústria, distribuição e serviços B2B no Brasil e em Portugal com foco em estruturação comercial.' },
  { ano: '2018–hoje', desc: 'Atuação em Portugal e no Brasil como consultor, mentor e formador comercial certificado pelo IEFP.' },
];

const livros = [
  {
    titulo: 'Gestão de Equipes Comerciais',
    subtitulo: 'Como liderar, motivar e desenvolver times de alta performance em vendas',
    ano: '2012',
  },
  {
    titulo: 'Vendas B2B: Processo e Método',
    subtitulo: 'Um guia prático para estruturar o processo de vendas em empresas de indústria e distribuição',
    ano: '2016',
  },
  {
    titulo: 'A Arte da Negociação Comercial',
    subtitulo: 'Técnicas e estratégias para negociadores de alta performance',
    ano: '2020',
  },
];

const ProfPauloPage: React.FC = () => (
  <main>
    {/* Hero */}
    <section style={{ background: 'var(--cream)', paddingTop: '8rem', paddingBottom: '6rem' }}>
      <div className="sec-wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
        <ScrollReveal>
          <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>Prof. Paulo H. Donassolo</div>
          <h1 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', fontWeight: 700,
            lineHeight: 1.12, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1.6rem',
          }}>
            25 anos de mercado.<br />
            <em style={{ color: 'var(--navy)' }}>Do campo para a sala de aula.</em>
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--ink-3)', lineHeight: 1.75, marginBottom: '2rem' }}>
            Professor, consultor e mentor comercial com trajetória que une gestão comercial na prática — como gerente e diretor de vendas em indústrias — com mais de 20 anos de docência em MBA e pós-graduação.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#/fale-comigo" className="btn-navy">Fale comigo</a>
            <a href="#/servicos" className="btn-ghost-ink">Ver serviços →</a>
          </div>
        </ScrollReveal>

        {/* Photo */}
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
                Professor · Consultor · Mentor
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Trajetória */}
    <section style={{ background: 'var(--navy)', padding: '6rem 0' }}>
      <div className="sec-wrap">
        <ScrollReveal>
          <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '1rem' }}>
            Trajetória
          </div>
          <h2 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700,
            color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '3.5rem',
          }}>
            Uma carreira construída nas duas pontas.
          </h2>
        </ScrollReveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {trajetoria.map((t, i) => (
            <ScrollReveal key={t.ano} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <div style={{
                display: 'grid', gridTemplateColumns: '140px 1fr', gap: '2.5rem',
                padding: '2rem 0', borderBottom: i < trajetoria.length - 1 ? '1px solid var(--rule-n)' : 'none',
              }}>
                <div style={{
                  fontFamily: 'var(--fm)', fontSize: '.75rem', letterSpacing: '.1em',
                  color: 'var(--gold)', paddingTop: '.3rem',
                }}>
                  {t.ano}
                </div>
                <p style={{ fontSize: '.9rem', color: 'rgba(243,239,230,.45)', lineHeight: 1.7 }}>{t.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Formação */}
    <section style={{ background: 'var(--cream-d)', padding: '6rem 0' }}>
      <div className="sec-wrap">
        <ScrollReveal>
          <div className="eyebrow" style={{ marginBottom: '1rem' }}>Formação</div>
          <h2 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700,
            color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '3rem',
          }}>
            Academicamente fundamentado.
          </h2>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {formacao.map((f, i) => (
            <ScrollReveal key={f.titulo} delay={((i % 2) + 1) as 1 | 2}>
              <div style={{ background: 'var(--cream)', border: '1px solid var(--rule)', padding: '2rem' }}>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', opacity: .7, marginBottom: '.8rem' }}>
                  {f.inst}
                </div>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>
                  {f.titulo}
                </h3>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Livros */}
    <section style={{ background: 'var(--cream)', padding: '6rem 0' }}>
      <div className="sec-wrap">
        <ScrollReveal>
          <div className="eyebrow" style={{ marginBottom: '1rem' }}>Publicações</div>
          <h2 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700,
            color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '3rem',
          }}>
            Conhecimento que fica.
          </h2>
        </ScrollReveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {livros.map((l, i) => (
            <ScrollReveal key={l.titulo} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <div style={{
                display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: '2rem',
                padding: '2.5rem 0', borderBottom: i < livros.length - 1 ? '1px solid var(--rule)' : 'none',
                alignItems: 'center',
              }}>
                <div style={{
                  fontFamily: 'var(--fd)', fontSize: '3rem', fontWeight: 700, color: 'rgba(168,120,40,.18)',
                  lineHeight: 1, letterSpacing: '-.02em',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '.4rem' }}>
                    {l.titulo}
                  </h3>
                  <p style={{ fontSize: '.82rem', color: 'var(--ink-3)', lineHeight: 1.5 }}>{l.subtitulo}</p>
                </div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.12em', color: 'var(--ink-3)', textAlign: 'right' }}>
                  {l.ano}
                </div>
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

    {/* CTA */}
    <section style={{ background: 'var(--navy)', padding: '7rem 0', textAlign: 'center' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 5vw' }}>
        <ScrollReveal>
          <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', justifyContent: 'center', borderColor: 'transparent', marginBottom: '1.5rem' }}>
            Trabalhe comigo
          </div>
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '1.2rem', lineHeight: 1.2 }}>
            Vamos conversar sobre o seu desafio?
          </h2>
          <p style={{ fontSize: '.9rem', color: 'rgba(243,239,230,.4)', lineHeight: 1.75, marginBottom: '2.5rem' }}>
            Mentoria individual, consultoria para equipes ou formação corporativa. Encontramos o formato certo para o seu momento.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#/fale-comigo" className="btn-primary">Fale comigo</a>
            <a href="#/servicos" className="btn-ghost">Ver serviços</a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  </main>
);

export default ProfPauloPage;
