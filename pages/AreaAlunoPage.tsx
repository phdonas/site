import React from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import { NewsletterForm } from '../components/ui/NewsletterForm';
import { useSiteConfig } from '../contexts/SiteConfigContext';

const AreaAlunoPage: React.FC = () => {
  const { config, loading } = useSiteConfig();
  const liberado = !loading && (config as any).lms_liberado === true;
  const lmsUrl = (config as any).url_lms;

  if (liberado && lmsUrl) {
    window.location.href = lmsUrl;
    return null;
  }

  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'var(--navy)', paddingTop: '8rem', paddingBottom: '6rem' }}>
        <div className="sec-wrap" style={{ maxWidth: 760, margin: '0 auto', padding: '0 5vw', textAlign: 'center' }}>
          <ScrollReveal>
            <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', justifyContent: 'center', borderColor: 'transparent', marginBottom: '1.5rem' }}>
              Área do Aluno
            </div>
            <h1 style={{
              fontFamily: 'var(--fd)', fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', fontWeight: 700,
              lineHeight: 1.12, color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '1.6rem',
            }}>
              A plataforma está<br />
              <em style={{ color: 'var(--gold)' }}>chegando em breve.</em>
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(243,239,230,.4)', lineHeight: 1.75, marginBottom: '3rem', maxWidth: 480, margin: '0 auto 3rem' }}>
              Estamos construindo um ambiente dedicado para alunos — com materiais dos cursos, aulas gravadas e ferramentas exclusivas. Cadastre-se para ser avisado no lançamento.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Newsletter capture */}
      <section style={{ background: 'var(--navy)', paddingBottom: '7rem' }}>
        <div className="sec-wrap" style={{ maxWidth: 500, margin: '0 auto', padding: '0 5vw' }}>
          <ScrollReveal>
            <div style={{ background: 'rgba(243,239,230,.04)', border: '1px solid rgba(243,239,230,.08)', padding: '3rem' }}>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', fontWeight: 700, color: 'rgba(243,239,230,.85)', marginBottom: '.8rem' }}>
                Avise-me no lançamento
              </h2>
              <p style={{ fontSize: '.85rem', color: 'rgba(243,239,230,.35)', lineHeight: 1.65, marginBottom: '2rem' }}>
                Deixe seu e-mail e você será um dos primeiros a ter acesso.
              </p>
              <NewsletterForm />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* O que vai ter */}
      <section style={{ background: 'var(--cream-d)', padding: '6rem 0' }}>
        <div className="sec-wrap">
          <ScrollReveal>
            <div className="eyebrow" style={{ marginBottom: '1rem' }}>O que está chegando</div>
            <h2 style={{
              fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700,
              color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '3rem',
            }}>
              Uma plataforma pensada para a prática.
            </h2>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              { num: '01', titulo: 'Cursos e Módulos', desc: 'Aulas gravadas organizadas por tema, com trilha de aprendizagem estruturada.' },
              { num: '02', titulo: 'Materiais e Templates', desc: 'Ferramentas práticas, planilhas e frameworks para aplicar no dia a dia.' },
              { num: '03', titulo: 'Suporte Dedicado', desc: 'Canal direto com o Prof. Paulo para dúvidas e acompanhamento.' },
            ].map((item, i) => (
              <ScrollReveal key={item.num} delay={((i + 1) as 1 | 2 | 3)}>
                <div style={{ background: 'var(--cream)', border: '1px solid var(--rule)', padding: '2rem' }}>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '2.5rem', fontWeight: 700, color: 'rgba(168,120,40,.18)', lineHeight: 1, marginBottom: '1rem' }}>
                    {item.num}
                  </div>
                  <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '.6rem' }}>
                    {item.titulo}
                  </h3>
                  <p style={{ fontSize: '.85rem', color: 'var(--ink-3)', lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cursos disponíveis agora */}
      <section style={{ background: 'var(--cream)', padding: '6rem 0' }}>
        <div className="sec-wrap" style={{ textAlign: 'center' }}>
          <ScrollReveal>
            <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '1rem' }}>Disponíveis agora</div>
            <h2 style={{
              fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700,
              color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1.2rem',
            }}>
              Enquanto a plataforma não abre,<br />acesse os cursos disponíveis.
            </h2>
            <p style={{ fontSize: '.9rem', color: 'var(--ink-3)', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: 440, margin: '0 auto 2.5rem' }}>
              Os cursos estão disponíveis nas plataformas Udemy e ESPM. Acesse agora.
            </p>
            <a href="#/cursos" className="btn-navy">Ver cursos disponíveis</a>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
};

export default AreaAlunoPage;
