import React, { useEffect, useRef, useState } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import FerramentaLeadModal from '../components/ui/FerramentaLeadModal';
import { DataService } from '../services/dataService';
import SupabaseService, { Recurso } from '../services/supabaseService';

// ─── Constants ───────────────────────────────────────────────────────────────

const TIPOS = ['Todos', 'Artigos', 'Ferramentas'] as const;
type FiltroTipo = typeof TIPOS[number];

// These tema values apply to new CMS articles (field: `tema`).
// Legacy WordPress articles have no `tema` field and always pass this filter.
const TEMAS = ['Todos', 'Gestão Comercial', 'Vendas', 'Liderança', 'Negociação', 'Carreira'];

// Pilares map to `pillarIds` array values in Firestore
const PILARES = [
  { label: 'Todos',                      id: null },
  { label: 'Prof. Paulo',                id: 'prof-paulo' },
  { label: 'Academia do Gás',            id: 'academia-do-gas' },
  { label: 'Sou Consultor Imobiliário',  id: 'consultoria-imobiliaria' },
  { label: '4050 ou Mais',               id: '4050oumais' },
] as const;

const PER_PAGE = 12;

// ─── Filter helpers ───────────────────────────────────────────────────────────

const matchesPilar = (a: any, pilarId: string | null): boolean => {
  if (!pilarId) return true;
  const ids: string[] = Array.isArray(a.pillarIds) ? a.pillarIds : [];
  return ids.includes(pilarId);
};

const matchesTema = (a: any, tema: string): boolean => {
  if (tema === 'Todos') return true;
  // Only filter articles that have a `tema` field (new CMS articles).
  // Legacy WordPress articles have no `tema` field → they always pass.
  if (!a.tema) return true;
  return a.tema === tema;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const FilterBtn: React.FC<{
  active: boolean;
  onClick: () => void;
  accent?: boolean;
  children: React.ReactNode;
}> = ({ active, onClick, accent, children }) => (
  <button
    onClick={onClick}
    style={{
      fontFamily: 'var(--fm)', fontSize: '.46rem', letterSpacing: '.11em',
      textTransform: 'uppercase', padding: '.35rem .75rem',
      border: '1px solid', cursor: 'pointer', transition: 'all .15s',
      background: active ? (accent ? 'var(--gold)' : 'var(--navy)') : 'transparent',
      color: active ? '#fff' : 'var(--ink-3)',
      borderColor: active ? (accent ? 'var(--gold)' : 'var(--navy)') : 'var(--rule)',
    }}
  >
    {children}
  </button>
);

const SkeletonCard: React.FC = () => (
  <div style={{
    background: 'var(--cream-d)', height: 300, borderRadius: 2,
    animation: 'skeleton-pulse 1.5s ease-in-out infinite',
  }} />
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const ConteudoPage: React.FC = () => {
  const [artigos, setArtigos]           = useState<any[]>([]);
  const [ferramentas, setFerramentas]   = useState<Recurso[]>([]);
  const [loading, setLoading]           = useState(true);
  const [loadError, setLoadError]       = useState(false);
  const [tipo, setTipo]                 = useState<FiltroTipo>('Todos');
  const [tema, setTema]                 = useState('Todos');
  const [pilar, setPilar]               = useState<string | null>(null); // null = "Todos"
  const [page, setPage]                 = useState(1);
  const [loadingMore, setLoadingMore]   = useState(false);
  const [ferramentaAtiva, setFerramentaAtiva] = useState<Recurso | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    // Articles are the primary content — show as soon as they're ready.
    // 8s hard timeout so we never wait forever on slow connections.
    const timeoutId = setTimeout(() => {
      if (!cancelled && artigos.length === 0) { setLoading(false); setLoadError(true); }
    }, 8000);

    DataService.getArticles(500)
      .then(arts => {
        if (cancelled) return;
        clearTimeout(timeoutId);
        setArtigos(arts);
        setLoading(false);
        setLoadError(false);
      })
      .catch(() => {
        if (!cancelled) { clearTimeout(timeoutId); setLoading(false); setLoadError(true); }
      });

    // Recursos load independently — never block articles display.
    SupabaseService.getRecursos()
      .then(ferrs => { if (!cancelled) setFerramentas(ferrs); })
      .catch(() => {});

    return () => { cancelled = true; clearTimeout(timeoutId); };
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [tipo, tema, pilar]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const mostrarArtigos     = tipo === 'Todos' || tipo === 'Artigos';
  const mostrarFerramentas = tipo === 'Todos' || tipo === 'Ferramentas';

  const artigosFiltrados = artigos.filter(a =>
    matchesPilar(a, pilar) && matchesTema(a, tema)
  );

  const artigosPage = artigosFiltrados.slice(0, page * PER_PAGE);
  const hasMore     = artigosFiltrados.length > page * PER_PAGE;

  const handleLoadMore = () => {
    setLoadingMore(true);
    // simulate background "fetch" (data is already in memory; small delay for UX)
    setTimeout(() => {
      setPage(p => p + 1);
      setLoadingMore(false);
    }, 300);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>

      <FerramentaLeadModal ferramenta={ferramentaAtiva} onClose={() => setFerramentaAtiva(null)} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--cream)', paddingTop: '8rem', paddingBottom: '5rem' }}>
        <div className="sec-wrap">
          <ScrollReveal>
            <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>Conteúdo</div>
            <h1 style={{
              fontFamily: 'var(--fd)', fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', fontWeight: 700,
              lineHeight: 1.12, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '1.2rem',
            }}>
              Gestão comercial na prática.<br />
              <em style={{ color: 'var(--navy)' }}>Sem teoria vazia.</em>
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--ink-3)', lineHeight: 1.75, maxWidth: 520 }}>
              Artigos, reflexões e ferramentas sobre vendas, gestão de equipes, liderança comercial e desenvolvimento de carreira.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Filtros ───────────────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--cream-d)', borderBottom: '1px solid var(--rule)',
        padding: '.7rem 0', position: 'sticky', top: 62, zIndex: 50,
      }}>
        <div className="sec-wrap" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>

          {/* Tipo */}
          <div style={{ display: 'flex', gap: '.25rem', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--fm)', fontSize: '.4rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', opacity: .55, marginRight: '.3rem' }}>Tipo</span>
            {TIPOS.map(t => (
              <FilterBtn key={t} active={tipo === t} onClick={() => setTipo(t)}>{t}</FilterBtn>
            ))}
          </div>

          {mostrarArtigos && <div style={{ width: 1, height: 16, background: 'var(--rule)', flexShrink: 0 }} />}

          {/* Tema — only visible when showing articles */}
          {mostrarArtigos && (
            <div style={{ display: 'flex', gap: '.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--fm)', fontSize: '.4rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', opacity: .55, marginRight: '.3rem' }}>Tema</span>
              {TEMAS.map(t => (
                <FilterBtn key={t} active={tema === t} onClick={() => setTema(t)}>{t}</FilterBtn>
              ))}
            </div>
          )}

          {mostrarArtigos && <div style={{ width: 1, height: 16, background: 'var(--rule)', flexShrink: 0 }} />}

          {/* Pilar — uses pillarIds array for exact matching */}
          {mostrarArtigos && (
            <div style={{ display: 'flex', gap: '.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--fm)', fontSize: '.4rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', opacity: .55, marginRight: '.3rem' }}>Pilar</span>
              {PILARES.map(p => (
                <FilterBtn key={p.label} active={pilar === p.id} onClick={() => setPilar(p.id)} accent>
                  {p.label}
                </FilterBtn>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ── Conteúdo ──────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--cream)', padding: '5rem 0' }}>
        <div className="sec-wrap">

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
              {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
            </div>

          ) : loadError ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <p style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', color: 'var(--ink-3)', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                Não foi possível carregar o conteúdo.
              </p>
              <button
                onClick={() => { setLoading(true); setLoadError(false); window.location.reload(); }}
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
                            {f.thumb_url
                              ? <img src={f.thumb_url} alt={f.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <span style={{ fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(243,239,230,.15)' }}>Recurso</span>
                            }
                            <div style={{ position: 'absolute', top: '.6rem', right: '.6rem', fontFamily: 'var(--fm)', fontSize: '.44rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#fff', background: 'var(--gold)', padding: '.2rem .5rem' }}>
                              Grátis
                            </div>
                          </div>
                          <div style={{ fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', opacity: .7, marginBottom: '.6rem' }}>
                            {f.categoria || 'Ferramenta'}
                          </div>
                          <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, marginBottom: '.5rem' }}>{f.titulo}</h3>
                          {f.descricao && (
                            <p style={{ fontSize: '.82rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>
                              {f.descricao.substring(0, 100)}{f.descricao.length > 100 ? '…' : ''}
                            </p>
                          )}
                          <div style={{ marginTop: '1rem', fontFamily: 'var(--fm)', fontSize: '.5rem', letterSpacing: '.1em', color: 'var(--gold)' }}>
                            Acessar →
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
                        <div className="eyebrow" style={{ marginBottom: 0 }}>
                          Artigos
                          {artigosFiltrados.length > 0 && (
                            <span style={{ marginLeft: '.6rem', fontFamily: 'var(--fm)', fontSize: '.44rem', color: 'var(--ink-3)', opacity: .6, textTransform: 'none', letterSpacing: 0 }}>
                              {artigosFiltrados.length} {artigosFiltrados.length === 1 ? 'resultado' : 'resultados'}
                            </span>
                          )}
                        </div>
                        <div style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
                      </div>
                    </ScrollReveal>
                  )}

                  {tipo !== 'Todos' && (
                    <div style={{ marginBottom: '1.5rem', fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.1em', color: 'var(--ink-3)', opacity: .7 }}>
                      {artigosFiltrados.length} {artigosFiltrados.length === 1 ? 'resultado' : 'resultados'}
                      {(pilar || tema !== 'Todos') && (
                        <button
                          onClick={() => { setPilar(null); setTema('Todos'); }}
                          style={{ marginLeft: '1rem', color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--fm)', fontSize: '.46rem', letterSpacing: '.1em', textTransform: 'uppercase', textDecoration: 'underline' }}
                        >
                          Limpar filtros
                        </button>
                      )}
                    </div>
                  )}

                  {artigosFiltrados.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                      <p style={{ fontFamily: 'var(--fd)', fontSize: '1.3rem', color: 'var(--ink-3)', fontStyle: 'italic', marginBottom: '1.2rem' }}>
                        Nenhum artigo encontrado com estes filtros.
                      </p>
                      <button
                        onClick={() => { setPilar(null); setTema('Todos'); setTipo('Todos'); }}
                        className="btn-ghost-ink"
                        style={{ fontFamily: 'inherit', fontSize: '.8rem' }}
                      >
                        Limpar filtros
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                        {artigosPage.map((a, i) => (
                          <ScrollReveal key={a.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
                            <a href={`#/artigo/${a.id}`} style={{ display: 'block', textDecoration: 'none' }} className="card-hover">
                              <div style={{ aspectRatio: '16/9', background: 'var(--navy)', marginBottom: '1.2rem', overflow: 'hidden' }}>
                                {(a.coverImage || a.imageUrl || a.thumbnail_url) && (
                                  <img
                                    src={a.coverImage || a.imageUrl || a.thumbnail_url}
                                    alt={a.title || a.titulo}
                                    loading="lazy"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }}
                                  />
                                )}
                              </div>

                              {/* Pilar badge — derived from pillarIds (authoritative field) */}
                              {Array.isArray(a.pillarIds) && a.pillarIds.length > 0 && (
                                <div style={{ fontFamily: 'var(--fm)', fontSize: '.44rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold)', opacity: .75, marginBottom: '.5rem' }}>
                                  {PILARES.find(p => p.id === a.pillarIds[0])?.label || a.category}
                                </div>
                              )}

                              <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, marginBottom: '.5rem' }}>
                                {a.title || a.titulo}
                              </h3>
                              <p style={{ fontSize: '.82rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>
                                {(a.excerpt || a.subtitulo || '').substring(0, 110)}…
                              </p>
                              <div style={{ marginTop: '1rem', fontFamily: 'var(--fm)', fontSize: '.48rem', letterSpacing: '.1em', color: 'var(--ink-3)', opacity: .6 }}>
                                {a.date ? new Date(a.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                              </div>
                            </a>
                          </ScrollReveal>
                        ))}
                      </div>

                      {/* Paginação */}
                      {hasMore && (
                        <div ref={bottomRef} style={{ textAlign: 'center', marginTop: '3.5rem' }}>
                          <div style={{ marginBottom: '1rem', fontFamily: 'var(--fm)', fontSize: '.46rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)', opacity: .55 }}>
                            Mostrando {artigosPage.length} de {artigosFiltrados.length}
                          </div>
                          <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="btn-ghost-ink"
                            style={{ fontFamily: 'inherit', fontSize: '.8rem', minWidth: 180, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem' }}
                          >
                            {loadingMore ? (
                              <>
                                <span style={{ display: 'inline-block', width: 14, height: 14, border: '1.5px solid var(--ink-3)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .6s linear infinite' }} />
                                Carregando…
                              </>
                            ) : (
                              `Carregar mais ${Math.min(PER_PAGE, artigosFiltrados.length - artigosPage.length)} artigos`
                            )}
                          </button>
                        </div>
                      )}
                    </>
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

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
};

export default ConteudoPage;
