import React from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';

const servicos = [
  {
    href: '#/mentoria',
    tag: 'Individual · 90 dias',
    titulo: 'Mentoria Comercial',
    desc: 'Para gestores e líderes que querem estruturar a área de vendas com método e acompanhamento próximo. 12 sessões, diagnóstico, plano e implementação.',
    destaques: [
      '12 sessões individuais de 60–90 min',
      'Diagnóstico comercial completo',
      'Plano de ação semana a semana',
      'Suporte por WhatsApp entre sessões',
    ],
    cta: 'Conhecer a Mentoria',
  },
  {
    href: '#/consultoria',
    tag: 'Empresas · PME',
    titulo: 'Consultoria',
    desc: 'Diagnóstico, estruturação e ativação do processo comercial — da estratégia à execução em campo. Para empresas que querem vender mais com consistência.',
    destaques: [
      'Diagnóstico do processo comercial',
      'Estruturação de funil e indicadores',
      'Treinamento da equipe',
      'Implantação de rituais de gestão',
    ],
    cta: 'Conhecer a Consultoria',
  },
  {
    href: '#/cursos',
    tag: 'Times e Líderes',
    titulo: 'Cursos e Formações',
    desc: 'Programas práticos para equipes comerciais e líderes que querem evoluir com método. Cursos online na Udemy e ESPM, e formações in company.',
    destaques: [
      'Cursos online disponíveis agora',
      'Formações in company',
      'Turmas abertas regulares',
      'Certificação reconhecida',
    ],
    cta: 'Ver Cursos',
  },
  {
    href: '#/conteudo',
    tag: 'Gratuito',
    titulo: 'Conteúdo',
    desc: 'Artigos, reflexões e ferramentas para quem quer aprender gestão comercial de forma aplicada. Publicado regularmente no site e na newsletter.',
    destaques: [
      'Artigos semanais',
      'Newsletter exclusiva',
      'Ferramentas e templates',
      'Acesso gratuito',
    ],
    cta: 'Explorar Conteúdo',
  },
];

const ServicesPage: React.FC = () => (
  <main>
    {/* Hero */}
    <section style={{ background: 'var(--cream)', paddingTop: '8rem', paddingBottom: '5rem' }}>
      <div className="sec-wrap">
        <ScrollReveal>
          <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>Serviços</div>
          <h1 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', fontWeight: 700,
            lineHeight: 1.12, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1.2rem',
          }}>
            Escolha o formato certo<br />
            <em style={{ color: 'var(--navy)' }}>para o seu momento.</em>
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--ink-3)', lineHeight: 1.75, maxWidth: 540 }}>
            Mentoria individual, consultoria para empresas, formações para times ou conteúdo gratuito. O ponto de entrada é diferente — o destino é o mesmo: um processo comercial que funciona sem depender de você.
          </p>
        </ScrollReveal>
      </div>
    </section>

    {/* Serviços detalhados */}
    <section style={{ background: 'var(--cream)', paddingBottom: '7rem' }}>
      <div className="sec-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {servicos.map((s, i) => (
          <ScrollReveal key={s.titulo} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem',
              background: i % 2 === 0 ? 'var(--cream-d)' : 'var(--navy)',
              border: '1px solid var(--rule)', padding: '3.5rem',
              alignItems: 'center',
            }}>
              {/* Left */}
              <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                <div style={{
                  fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.18em', textTransform: 'uppercase',
                  color: i % 2 === 0 ? 'var(--gold)' : 'var(--gold)',
                  marginBottom: '1rem',
                }}>
                  {s.tag}
                </div>
                <h2 style={{
                  fontFamily: 'var(--fd)', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 700,
                  color: i % 2 === 0 ? 'var(--ink)' : 'rgba(243,239,230,.9)',
                  letterSpacing: '-.02em', marginBottom: '1.2rem',
                }}>
                  {s.titulo}
                </h2>
                <p style={{
                  fontSize: '.9rem', lineHeight: 1.75, marginBottom: '2rem',
                  color: i % 2 === 0 ? 'var(--ink-3)' : 'rgba(243,239,230,.45)',
                }}>
                  {s.desc}
                </p>
                <a href={s.href} className={i % 2 === 0 ? 'btn-navy' : 'btn-primary'}>
                  {s.cta}
                </a>
              </div>

              {/* Right: destaques */}
              <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
                  {s.destaques.map((d, j) => (
                    <div key={j} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '.8rem 1.2rem', background: i % 2 === 0 ? 'var(--cream)' : 'rgba(243,239,230,.04)', border: `1px solid ${i % 2 === 0 ? 'var(--rule)' : 'rgba(243,239,230,.07)'}` }}>
                      <span style={{ color: 'var(--gold)', fontSize: '1rem', flexShrink: 0, marginTop: '.1rem' }}>✓</span>
                      <span style={{ fontSize: '.85rem', color: i % 2 === 0 ? 'var(--ink-2)' : 'rgba(243,239,230,.5)', lineHeight: 1.5 }}>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section style={{ background: 'var(--navy)', padding: '7rem 0', textAlign: 'center' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 5vw' }}>
        <ScrollReveal>
          <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', justifyContent: 'center', borderColor: 'transparent', marginBottom: '1.5rem' }}>
            Não sabe qual formato escolher?
          </div>
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '1.2rem', lineHeight: 1.2 }}>
            Conversamos e encontramos juntos o melhor caminho.
          </h2>
          <p style={{ fontSize: '.9rem', color: 'rgba(243,239,230,.4)', lineHeight: 1.75, marginBottom: '2.5rem' }}>
            Uma conversa de 30 minutos é suficiente para entender o seu momento e recomendar o formato mais adequado.
          </p>
          <a href="#/fale-comigo" className="btn-primary">Agendar conversa gratuita</a>
        </ScrollReveal>
      </div>
    </section>
  </main>
);

export default ServicesPage;
