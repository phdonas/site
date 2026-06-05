import React, { useEffect, useState } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import FerramentaLeadModal from '../components/ui/FerramentaLeadModal';
import { DataService } from '../services/dataService';
import SupabaseService, { Ferramenta } from '../services/supabaseService';

const TIPOS = ['Todos', 'Artigos', 'Ferramentas'] as const;
type FiltroTipo = typeof TIPOS[number];

const TEMAS = ['Todos', 'Gestão Comercial', 'Vendas', 'Liderança', 'Negociação', 'Carreira'];

const PILARES = ['Todos', 'Prof. Paulo', 'Academia do Gás', 'Sou Consultor Imobiliário', '4050 ou Mais'];

const PILAR_ID_TO_LABEL: Record<string, string> = {
  'prof-paulo': 'Prof. Paulo',
  'academia-do-gas': 'Academia do Gás',
  '4050oumais': '4050 ou Mais',
  'consultoria-imobiliaria': 'Sou Consultor Imobiliário',
};

const getArtigoTema = (a: any): string =>
  a.tema || a.category || 'Gestão Comercial';

const getArtigoPilar = (a: any): string => {
  if (a.pilar) return a.pilar;
  if (a.pillarIds && a.pillarIds.length > 0)
    return PILAR_ID_TO_LABEL[a.pillarIds[0]] || 'Prof. Paulo';
  return 'Prof. Paulo';
};

const FilterBtn: React.FC<{
  active: boolean;
  onClick: () => void;
  color?: 'navy' | 'gold';
  children: React.ReactNode;
}> = ({ active, onClick, color = 'navy', children }) => (
  <button onClick={onClick} style={{
    fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.12em', textTransform: 'uppercase',
    padding: '.35rem .8rem', border: '1px solid', cursor: 'pointer', transition: 'all .15s',
    background: active ? (color === 'gold' ? 'var(--gold)' : 'var(--navy)') : 'transparent',
    color: active ? '#fff' : 'var(--ink-3)',
    borderColor: active ? (color === 'gold' ? 'var(--gold)' : 'var(--navy)') : 'var(--rule)',
  }}>
    {children}
  </button>
);

const ConteudoPage: React.FC = () => {
  const [artigos, setArtigos] = useState<any[]>([]);
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tipo, setTipo] = useState<FiltroTipo>('Todos');
  const [tema, setTema] = useState('Todos');
  const [pilar, setPilar] = useState('Todos');
  const [ferramentaAtiva, setFerramentaAtiva] = useState<Ferramenta | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) setError(true);
    }, 12000);

    Promise.all([
      DataService.getArticles(100),
      SupabaseService.getFerramentas(),
    ]).then(([arts, ferrs]) => {
      clearTimeout(timeout);
      setArtigos(arts);
      setFerramentas(ferrs);
      setLoading(false);
      setError(false);
    }).catch(() => {
      clearTimeout(timeout);
      setLoading(false);
      setError(true);
    });

    return () => clearTimeout(timeout);
  }, []);

  const mostrarArtigos = tipo === 'Todos' || tipo === 'Artigos';
  const mostrarFerramentas = tipo === 'Todos' || tipo === 'Ferramentas';

  const artigosFiltrados = artigos.filter(a => {
    if (tema !== 'Todos') {
      const artTema = getArtigoTema(a);
      if (!artTema.includes(tema)) return false;
    }
    if (pilar !== 'Todos') {
      if (getArtigoPilar(a) !== pilar) return false;
    }
    return true;
  });

  return (
    <main>
      <FerramentaLeadModal ferramenta={ferramentaAtiva} onClose={() => setFerramentaAtiva(null)} />

      {/* Hero */}
      <section style={{ background: 'var(--cream)', paddingTop: '8rem', paddingBottom: '5rem' }}>
        <div className="sec-wrap">
          <ScrollReveal>
            <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>Conteúdo</div>
            <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', fontWeight: 700, lineHeight: 1.12, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1.2rem' }}>
              Gestão comercial na prática.<br />
              <em style={{ color: 'var(--navy)' }}>Sem teoria vazia.</em>
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--ink-3)', lineHeight: 1.75, maxWidth: 520 }}>
              Artigos, reflexões e ferramentas sobre vendas, gestão de equipes, liderança comercial e desenvolvimento de carreira.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filtros */}
      <section style={{ background: 'var(--cream-d)', borderBottom: '1px solid var(--rule)', padding: '.8rem 0', position: 'sticky', top: 62, zIndex: 50 }}>
        <div className="sec-wrap" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Tipo */}
          <div style={{ display: 'flex', gap: '.3rem', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--fm)', fontSize: '.42rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginRight: '.2rem', opacity: .6 }}>Tipo</span>
            {TIPOS.map(t => (
              <FilterBtn key={t} active={tipo === t} onClick={() => setTipo(t)} color="navy">{t}</FilterBtn>
            ))}
          </div>

          <div style={{ width: 1, height: 18, background: 'var(--rule)', flexShrink: 0 }} />

          {/* Tema */}
          {mostrarArtigos && (
            <div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--fm)', fontSize: '.42rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginRight: '.2rem', opacity: .6 }}>Tema</span>
              {TEMAS.map(t => (
                <FilterBtn key={t} active={tema === t} onClick={() => setTema(t)} color="navy">{t}</FilterBtn>
              ))}
            </div>
          )}

          {mostrarArtigos && <div style={{ width: 1, height: 18, background: 'var(--rule)', flexShrink: 0 }} />}

          {/* Pilar */}
          {mostrarArtigos && (
            <div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--fm)', fontSize: '.42rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginRight: '.2rem', opacity: .6 }}>Pilar</span>
              {PILARES.map(p => (
                <FilterBtn key={p} active={pilar === p} onClick={() => setPilar(p)} color="gold">{p}</FilterBtn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Conteúdo */}
      <section style={{ background: 'var(--cream)', padding: '5rem 0' }}>
        <div className="sec-wrap">
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ background: 'var(--cream-d)', height: 280, borderRadius: 2, animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <p style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', color: 'var(--ink-3)', fontStyle: 'italic', marginBottom: '1rem' }}>
                Não foi possível carregar o conteúdo.
              </p>
              <button
                onClick={() => { setLoading(true); setError(false); window.location.reload(); }}
                className="btn-ghost-ink"
                style={{ fontFamily: 'inherit' }}
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <>
              {/* Ferramentas */}
              {mostrarFerramentas && ferramentas.length > 0 && (
                <div style={{ marginBottom: tipo === 'Todos' ? '4rem' : 0 }}>
                  {tipo === 'Todos' && (
                    <ScrollReveal>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div className="eyebrow" style={{ marginBottom: 0 }}>Ferramentas</div>
                        <div style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
                      </div>
                    </ScrollReveal>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                    {ferramentas.map((f, i) => (
                      <ScrollReveal key={f.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
                        <button
                          onClick={() => setFerramentaAtiva(f)}
                          style={{ display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                          className="card-hover"
                        >
                          <div style={{ background: 'var(--navy)', aspectRatio: '16/9', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                            {f.capa_url
                              ? <img src={f.capa_url} alt={f.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <span style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(243,239,230,.15)' }}>{f.icone || 'Ferramenta'}</span>
                            }
                            <div style={{ position: 'absolute', top: '.6rem', right: '.6rem', fontFamily: 'var(--fm)', fontSize: '.44rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#fff', background: 'var(--gold)', padding: '.2rem .5rem' }}>
                              Grátis
                            </div>
                          </div>
                          <div style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', opacity: .7, marginBottom: '.6rem' }}>
                            {f.categoria || 'Ferramenta'}
                          </div>
                          <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, marginBottom: '.5rem' }}>{f.nome}</h3>
                          {f.descricao && (
                            <p style={{ fontSize: '.82rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>
                              {f.descricao.substring(0, 100)}{f.descricao.length > 100 ? '…' : ''}
                            </p>
                          )}
                          <div style={{ marginTop: '1rem', fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.1em', color: 'var(--gold)' }}>
                            {f.label_botao || 'Acessar →'}
                          </div>
                        </button>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              )}

              {/* Artigos */}
              {mostrarArtigos && (
                <>
                  {tipo === 'Todos' && ferramentas.length > 0 && (
                    <ScrollReveal>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div className="eyebrow" style={{ marginBottom: 0 }}>Artigos</div>
                        <div style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
                      </div>
                    </ScrollReveal>
                  )}
                  {artigosFiltrados.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                      <p style={{ fontFamily: 'var(--fd)', fontSize: '1.3rem', color: 'var(--ink-3)', fontStyle: 'italic', marginBottom: '1rem' }}>
                        Nenhum artigo encontrado com estes filtros.
                      </p>
                      <button
                        onClick={() => { setTema('Todos'); setPilar('Todos'); }}
                        className="btn-ghost-ink"
                        style={{ fontFamily: 'inherit', fontSize: '.8rem' }}
                      >
                        Limpar filtros
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                      {artigosFiltrados.map((a, i) => (
                        <ScrollReveal key={a.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
                          <a href={`#/artigo/${a.id}`} style={{ display: 'block', textDecoration: 'none' }} className="card-hover">
                            <div style={{ aspectRatio: '16/9', background: 'var(--navy)', marginBottom: '1.2rem', overflow: 'hidden' }}>
                              {(a.coverImage || a.imageUrl || a.thumbnail_url) && (
                                <img
                                  src={a.coverImage || a.imageUrl || a.thumbnail_url}
                                  alt={a.title}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }}
                                />
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.6rem', flexWrap: 'wrap' }}>
                              <div style={{ fontFamily: 'var(--fm)', fontSize: '.46rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold)', opacity: .8 }}>
                                {getArtigoTema(a)}
                              </div>
                              <div style={{ fontFamily: 'var(--fm)', fontSize: '.46rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', opacity: .5 }}>
                                · {getArtigoPilar(a)}
                              </div>
                            </div>
                            <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, marginBottom: '.5rem' }}>
                              {a.title || a.titulo}
                            </h3>
                            <p style={{ fontSize: '.82rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>
                              {(a.excerpt || a.subtitulo || a.summary || '').substring(0, 100)}…
                            </p>
                            <div style={{ marginTop: '1rem', fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.1em', color: 'var(--ink-3)' }}>
                              {a.date ? new Date(a.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                            </div>
                          </a>
                        </ScrollReveal>
                      ))}
                    </div>
                  )}
                </>
              )}

              {!mostrarArtigos && !mostrarFerramentas && (
                <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                  <p style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', color: 'var(--ink-3)', fontStyle: 'italic' }}>
                    Nenhum conteúdo encontrado.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default ConteudoPage;
