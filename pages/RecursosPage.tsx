import React, { useEffect, useState } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import FerramentaLeadModal from '../components/ui/FerramentaLeadModal';
import SupabaseService, { Ferramenta, Recurso } from '../services/supabaseService';

const livros = [
  {
    titulo: 'Gestão de Equipes Comerciais',
    subtitulo: 'Como liderar, motivar e desenvolver times de alta performance em vendas',
    ano: '2012',
    href: '#',
  },
  {
    titulo: 'Vendas B2B: Processo e Método',
    subtitulo: 'Um guia prático para estruturar o processo de vendas em empresas de indústria e distribuição',
    ano: '2016',
    href: '#',
  },
  {
    titulo: 'A Arte da Negociação Comercial',
    subtitulo: 'Técnicas e estratégias para negociadores de alta performance',
    ano: '2020',
    href: '#',
  },
];

const tipoLabel: Record<string, string> = {
  html: 'Web', externo: 'Link', download: 'Download',
};

const RecursosPage: React.FC = () => {
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [loadingF, setLoadingF] = useState(true);
  const [ferramentaAtiva, setFerramentaAtiva] = useState<Ferramenta | null>(null);

  useEffect(() => {
    Promise.all([
      SupabaseService.getFerramentas(),
      SupabaseService.getRecursos(),
    ]).then(([f, r]) => {
      setFerramentas(f);
      setRecursos(r);
      setLoadingF(false);
    });
  }, []);

  return (
    <main>
      <FerramentaLeadModal ferramenta={ferramentaAtiva} onClose={() => setFerramentaAtiva(null)} />

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
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '3.5rem', fontWeight: 700, color: 'rgba(168,120,40,.18)', lineHeight: 1 }}>
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

      {/* Ferramentas do Supabase */}
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

          {loadingF ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ background: 'rgba(243,239,230,.04)', height: 160 }} />
              ))}
            </div>
          ) : ferramentas.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              {ferramentas.map((f, i) => (
                <ScrollReveal key={f.id} delay={((i % 2) + 1) as 1 | 2}>
                  <div style={{
                    background: 'rgba(243,239,230,.04)', border: '1px solid rgba(243,239,230,.07)',
                    padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: 'rgba(243,239,230,.85)' }}>
                        {f.nome}
                      </h3>
                      <span style={{ fontFamily: 'var(--fm)', fontSize: '.45rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold)', border: '1px solid rgba(168,120,40,.3)', padding: '.2rem .6rem', flexShrink: 0, marginLeft: '1rem' }}>
                        {f.categoria || tipoLabel[f.tipo_entrega] || 'Ferramenta'}
                      </span>
                    </div>
                    {f.descricao && (
                      <p style={{ fontSize: '.84rem', color: 'rgba(243,239,230,.35)', lineHeight: 1.65, flexGrow: 1 }}>
                        {f.descricao}
                      </p>
                    )}
                    <button
                      onClick={() => setFerramentaAtiva(f)}
                      className="btn-ghost"
                      style={{ textAlign: 'center', cursor: 'pointer' }}
                    >
                      {f.label_botao || 'Acessar ferramenta →'}
                    </button>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            /* Fallback estático enquanto não há ferramentas no Supabase */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              {[
                { titulo: 'Diagnóstico Comercial', desc: 'Ferramenta de autoavaliação para mapear os gargalos do seu processo de vendas.' },
                { titulo: 'Pipeline de Vendas', desc: 'Template de funil de vendas por etapas com indicadores de conversão.' },
                { titulo: 'Roteiro de 1:1', desc: 'Template para reuniões individuais com vendedores — pauta, registro e follow-up.' },
                { titulo: 'Plano de Onboarding', desc: 'Estrutura para os primeiros 90 dias de um novo vendedor na equipe.' },
              ].map((f, i) => (
                <ScrollReveal key={f.titulo} delay={((i % 2) + 1) as 1 | 2}>
                  <div style={{ background: 'rgba(243,239,230,.04)', border: '1px solid rgba(243,239,230,.07)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: 'rgba(243,239,230,.85)' }}>{f.titulo}</h3>
                    <p style={{ fontSize: '.84rem', color: 'rgba(243,239,230,.35)', lineHeight: 1.65, flexGrow: 1 }}>{f.desc}</p>
                    <a href="#/fale-comigo" className="btn-ghost" style={{ textAlign: 'center', display: 'block' }}>Solicitar acesso</a>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Recursos adicionais do Supabase */}
          {recursos.length > 0 && (
            <div style={{ marginTop: '3rem', paddingTop: '3rem', borderTop: '1px solid rgba(243,239,230,.07)' }}>
              <ScrollReveal>
                <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '2rem' }}>
                  Mais recursos
                </div>
              </ScrollReveal>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                {recursos.map((r, i) => (
                  <ScrollReveal key={r.id} delay={((i % 2) + 1) as 1 | 2}>
                    <a
                      href={r.arquivo_url}
                      target={r.abertura_tipo === 'download' ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      download={r.abertura_tipo === 'download' || undefined}
                      style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start', textDecoration: 'none', padding: '1.5rem', background: 'rgba(243,239,230,.03)', border: '1px solid rgba(243,239,230,.06)' }}
                    >
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontWeight: 700, color: 'rgba(243,239,230,.8)', marginBottom: '.4rem' }}>{r.titulo}</h4>
                        {r.descricao && <p style={{ fontSize: '.78rem', color: 'rgba(243,239,230,.3)', lineHeight: 1.5 }}>{r.descricao}</p>}
                      </div>
                      {r.tipo && (
                        <span style={{ fontFamily: 'var(--fm)', fontSize: '.44rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', flexShrink: 0 }}>
                          {r.tipo}
                        </span>
                      )}
                    </a>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Cursos */}
      <section style={{ background: 'var(--cream)', padding: '6rem 0', textAlign: 'center' }}>
        <div className="sec-wrap">
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
};

export default RecursosPage;
