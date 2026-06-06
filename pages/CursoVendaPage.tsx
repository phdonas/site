import React, { useEffect, useState } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import SupabaseService, { Curso, PlanoCurso } from '../services/supabaseService';
import { iniciarCheckout } from '../services/checkoutService';

interface Props { slug: string }

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  return m ? m[1] : null;
}

function FormattedText({ text }: { text: string | null | undefined }) {
  if (!text) return null;
  if (/<[a-z][\s\S]*>/i.test(text)) {
    return <div dangerouslySetInnerHTML={{ __html: text }} />;
  }
  return (
    <div>
      {text.split('\n').map((line, i, arr) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={j}>{p.slice(2, -2)}</strong>
            : <React.Fragment key={j}>{p}</React.Fragment>
        );
        return (
          <React.Fragment key={i}>
            {parts}
            {i < arr.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

async function detectarMoeda(): Promise<'BRL' | 'EUR' | 'USD'> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const d = await res.json();
    if (d.country_code === 'BR') return 'BRL';
    if (['PT', 'ES', 'FR', 'DE', 'IT', 'NL', 'BE', 'AT', 'IE'].includes(d.country_code)) return 'EUR';
    return 'USD';
  } catch {
    return 'USD';
  }
}

const CursoVendaPage: React.FC<Props> = ({ slug }) => {
  const [curso, setCurso] = useState<Curso | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [planos, setPlanos] = useState<PlanoCurso[]>([]);
  const [planoIdx, setPlanoIdx] = useState(0);

  const [moeda, setMoeda] = useState<'BRL' | 'EUR' | 'USD'>('USD');

  const [email, setEmail] = useState('');

  const [cupomAberto, setCupomAberto] = useState(false);
  const [cupomCodigo, setCupomCodigo] = useState('');
  const [cupomValidando, setCupomValidando] = useState(false);
  const [cupomAplicado, setCupomAplicado] = useState<string | null>(null);
  const [cupomDesconto, setCupomDesconto] = useState<{ novo_preco?: number; desconto_pct?: number } | null>(null);
  const [cupomErro, setCupomErro] = useState<string | null>(null);

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutErro, setCheckoutErro] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const [data, moedaIp] = await Promise.all([
        SupabaseService.getCursoBySlug(slug),
        detectarMoeda(),
      ]);
      setMoeda(moedaIp);

      if (!data) { setNotFound(true); setLoading(false); return; }
      setCurso(data);

      const planosData = await SupabaseService.getPlanosCurso(data.id);
      setPlanos(planosData);
      const fi = planosData.findIndex(p => p.is_featured);
      setPlanoIdx(fi !== -1 ? fi : 0);

      setLoading(false);
    };
    init();
  }, [slug]);

  const validarCupom = async () => {
    if (!curso || !cupomCodigo.trim()) return;
    setCupomValidando(true);
    setCupomErro(null);
    try {
      const res = await fetch('https://aluno.phdonassolo.com/api/cupons/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: cupomCodigo.trim(), cursoId: curso.id }),
      });
      const d = await res.json();
      if (res.ok && d.valido) {
        setCupomAplicado(cupomCodigo.trim());
        setCupomDesconto({ novo_preco: d.novo_preco, desconto_pct: d.desconto_pct });
      } else {
        setCupomErro(d.erro || 'Cupom inválido ou expirado.');
      }
    } catch {
      setCupomErro('Erro ao validar cupom. Tente novamente.');
    }
    setCupomValidando(false);
  };

  const handleComprar = async () => {
    if (!curso) return;
    if (!email.trim()) { setCheckoutErro('Informe seu e-mail para continuar.'); return; }
    setCheckoutLoading(true);
    setCheckoutErro(null);
    const planoAtual = planos[planoIdx];
    try {
      await iniciarCheckout({
        cursoId: curso.id,
        emailFinal: email.trim(),
        moeda: moeda === 'USD' ? 'EUR' : moeda,
        planoId: planoAtual?.plano_id,
        cupomCodigo: cupomAplicado || undefined,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao iniciar checkout. Tente novamente.';
      setCheckoutErro(msg);
    }
    setCheckoutLoading(false);
  };

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--navy)', paddingTop: '8rem' }}>
        <div className="sec-wrap">
          <div style={{ height: 60, background: 'rgba(243,239,230,.06)', marginBottom: '1.5rem', maxWidth: 480 }} />
          <div style={{ height: 200, background: 'rgba(243,239,230,.04)' }} />
        </div>
      </main>
    );
  }

  if (notFound || !curso) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div>
          <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '1rem' }}>Curso não encontrado</div>
          <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: 'var(--ink)', marginBottom: '2rem' }}>
            Este curso não está disponível.
          </h1>
          <a href="#/cursos" className="btn-navy">Ver todos os cursos</a>
        </div>
      </main>
    );
  }

  // ─── Valores computados ───────────────────────────────────────
  const isGratis = curso.is_gratis || curso.is_free;
  const planoAtual = planos[planoIdx] ?? null;
  const duracao = curso.duracao_total_minutos
    ? `${Math.floor(curso.duracao_total_minutos / 60)}h${curso.duracao_total_minutos % 60 > 0 ? ` ${curso.duracao_total_minutos % 60}min` : ''}`
    : null;
  const ytId = curso.video_vendas_url ? extractYouTubeId(curso.video_vendas_url) : null;

  const getPrecoBase = (): number | null => {
    const eur = planoAtual
      ? (planoAtual.valor_venda_eur ?? Math.round(planoAtual.valor_venda / 6))
      : null;
    if (moeda === 'BRL') return planoAtual ? planoAtual.valor_venda : curso.preco_vitrine_brl;
    if (moeda === 'EUR') return eur;
    return eur !== null ? Math.round(eur * 1.1) : null; // USD ≈ EUR × 1.1
  };

  const precoBase = getPrecoBase();

  const precoFinal = (() => {
    if (!cupomDesconto || precoBase === null) return precoBase;
    if (cupomDesconto.novo_preco !== undefined) return cupomDesconto.novo_preco;
    if (cupomDesconto.desconto_pct !== undefined)
      return Math.round(precoBase * (1 - cupomDesconto.desconto_pct / 100) * 100) / 100;
    return precoBase;
  })();

  const temDesconto = !!(cupomAplicado && precoFinal !== null && precoBase !== null && precoFinal < precoBase);

  const fmt = (val: number | null) => {
    if (val === null) return '—';
    const s = val.toFixed(2).replace('.', ',');
    if (moeda === 'BRL') return `R$ ${s}`;
    if (moeda === 'EUR') return `€ ${s}`;
    return `US$ ${s}`;
  };


  // ─── Estilos reutilizáveis ────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '.75rem 1rem', border: '1px solid var(--rule)',
    fontFamily: 'var(--fd)', fontSize: '1.2rem', color: 'var(--ink)',
    background: 'white', outline: 'none', boxSizing: 'border-box',
  };

  const moedaBtnStyle = (m: 'BRL' | 'EUR' | 'USD'): React.CSSProperties => ({
    flex: 1, padding: '.5rem .6rem',
    border: `1.5px solid ${moeda === m ? 'var(--navy)' : 'var(--rule)'}`,
    background: moeda === m ? 'var(--navy)' : 'transparent',
    color: moeda === m ? 'var(--cream)' : 'var(--ink-3)',
    fontFamily: 'var(--fm)', fontSize: '.85rem', letterSpacing: '.04em',
    cursor: 'pointer', transition: 'all .15s',
  });

  return (
    <main>

      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <section style={{ background: 'var(--navy)', paddingTop: '7rem', paddingBottom: '5rem' }}>
        <div className="sec-wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '4rem', alignItems: 'start' }}>

          {/* Esquerda — conteúdo */}
          <ScrollReveal>
            {curso.categoria && (
              <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '1.5rem' }}>
                {curso.categoria}
              </div>
            )}

            <h1 style={{
              fontFamily: 'var(--fd)', fontSize: 'clamp(3rem, 5.25vw, 4.5rem)', fontWeight: 700,
              lineHeight: 1.12, color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '1.5rem',
            }}>
              {curso.titulo}
            </h1>

            {curso.objetivos && (
              <div style={{ fontSize: '1.5rem', color: 'rgba(243,239,230,.55)', lineHeight: 1.75, maxWidth: 560, marginBottom: '2rem' }}>
                <FormattedText text={curso.objetivos} />
              </div>
            )}

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              {curso.nivel && (
                <span style={{ fontFamily: 'var(--fm)', fontSize: '1.05rem', letterSpacing: '.1em', color: 'rgba(243,239,230,.4)' }}>
                  ◈ {curso.nivel}
                </span>
              )}
              {duracao && (
                <span style={{ fontFamily: 'var(--fm)', fontSize: '1.05rem', letterSpacing: '.1em', color: 'rgba(243,239,230,.4)' }}>
                  ◷ {duracao}
                </span>
              )}
              {curso.avaliacoes_count > 0 && (
                <span style={{ fontFamily: 'var(--fm)', fontSize: '1.05rem', letterSpacing: '.1em', color: 'rgba(243,239,230,.4)' }}>
                  ★ {curso.avaliacoes_media.toFixed(1)} ({curso.avaliacoes_count} avaliações)
                </span>
              )}
            </div>

            {/* Área de imagem / vídeo */}
            <div style={{ maxWidth: 560, aspectRatio: '16/9', overflow: 'hidden', border: '1px solid rgba(243,239,230,.08)' }}>
              {ytId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}`}
                  title={curso.titulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              ) : curso.thumb_url ? (
                <img src={curso.thumb_url} alt={curso.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'rgba(12,24,36,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '2.4rem', color: 'rgba(243,239,230,.08)' }}>▶</span>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* ─── Card de compra (direita) ──────────────────────────── */}
          <ScrollReveal delay={2}>
            <div id="card-compra" style={{ background: 'var(--cream)', padding: '2rem', position: 'sticky', top: '5rem' }}>

              {/* Thumb no card apenas se não há vídeo à esquerda */}
              {!ytId && curso.thumb_url && (
                <div style={{ aspectRatio: '16/9', overflow: 'hidden', marginBottom: '1.5rem' }}>
                  <img src={curso.thumb_url} alt={curso.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              {/* Seletor de planos (só se > 1) */}
              {planos.length > 1 && (
                <div style={{ marginBottom: '1.2rem' }}>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '.9rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '.6rem' }}>
                    Escolha o plano
                  </div>
                  {planos.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setPlanoIdx(i); setCupomAplicado(null); setCupomDesconto(null); setCupomErro(null); }}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        width: '100%', padding: '.75rem 1rem', marginBottom: '.4rem',
                        border: `2px solid ${planoIdx === i ? 'var(--navy)' : 'var(--rule)'}`,
                        background: planoIdx === i ? 'var(--navy)' : 'transparent',
                        color: planoIdx === i ? 'var(--cream)' : 'var(--ink)',
                        cursor: 'pointer', transition: 'all .18s', textAlign: 'left',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 600 }}>
                        {p.planos?.nome ?? `Plano ${i + 1}`}
                        {p.is_featured && (
                          <span style={{ marginLeft: '.6rem', fontFamily: 'var(--fm)', fontSize: '.75rem', letterSpacing: '.08em', color: 'var(--gold)', textTransform: 'uppercase' }}>
                            ★ Destaque
                          </span>
                        )}
                      </span>
                      <span style={{ fontFamily: 'var(--fm)', fontSize: '1rem', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                        R$ {p.valor_venda.toFixed(2).replace('.', ',')}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Seletor de moeda */}
              <div style={{ display: 'flex', gap: '.4rem', marginBottom: '1.2rem' }}>
                <button type="button" onClick={() => setMoeda('BRL')} style={moedaBtnStyle('BRL')}>
                  🇧🇷 BRL
                </button>
                <button type="button" onClick={() => setMoeda('EUR')} style={moedaBtnStyle('EUR')}>
                  🇵🇹 EUR
                </button>
                <button type="button" onClick={() => setMoeda('USD')} style={moedaBtnStyle('USD')}>
                  🌐 USD
                </button>
              </div>

              {/* Preço */}
              {isGratis ? (
                <div style={{ fontFamily: 'var(--fd)', fontSize: '3.6rem', fontWeight: 700, color: '#16a34a', marginBottom: '1.2rem', lineHeight: 1 }}>
                  Grátis
                </div>
              ) : precoBase !== null ? (
                <div style={{ marginBottom: '1.2rem' }}>
                  {temDesconto && (
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '1.05rem', color: 'var(--ink-3)', textDecoration: 'line-through', marginBottom: '.15rem' }}>
                      {fmt(precoBase)}
                    </div>
                  )}
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '3.6rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.05 }}>
                    {fmt(temDesconto ? precoFinal : precoBase)}
                  </div>
                  {temDesconto && (
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '.9rem', color: '#16a34a', letterSpacing: '.04em', marginTop: '.3rem' }}>
                      Cupom "{cupomAplicado}" aplicado ✓
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ fontFamily: 'var(--fm)', fontSize: '1rem', color: 'var(--ink-3)', marginBottom: '1.2rem' }}>
                  Entre em contato para informações de valores.
                </div>
              )}

              {/* Campo de e-mail */}
              {!isGratis && curso.tipo === 'lms' && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontFamily: 'var(--fm)', fontSize: '.9rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-3)', display: 'block', marginBottom: '.4rem' }}>
                    E-mail para acesso ao curso
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setCheckoutErro(null); }}
                    placeholder="seu@email.com"
                    style={inputStyle}
                  />
                </div>
              )}

              {/* Botão principal */}
              {curso.tipo === 'lms' ? (
                isGratis ? (
                  <a
                    href="https://aluno.phdonassolo.com/login"
                    target="_blank" rel="noopener noreferrer"
                    className="btn-navy"
                    style={{ display: 'block', textAlign: 'center', marginBottom: '1rem', fontSize: '1.2rem' }}
                  >
                    Acessar gratuitamente →
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={handleComprar}
                    disabled={checkoutLoading}
                    className="btn-navy"
                    style={{
                      display: 'block', width: '100%', textAlign: 'center', marginBottom: '1rem',
                      cursor: checkoutLoading ? 'default' : 'pointer', border: 'none',
                      opacity: checkoutLoading ? .65 : 1, fontSize: '1.2rem',
                    }}
                  >
                    {checkoutLoading ? 'Aguarde...' : 'Comprar agora →'}
                  </button>
                )
              ) : (
                <a
                  href={curso.url_checkout || '#/cursos'}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-navy"
                  style={{ display: 'block', textAlign: 'center', marginBottom: '1rem', fontSize: '1.2rem' }}
                >
                  Ver na {curso.tipo === 'udemy' ? 'Udemy' : 'ESPM'} ↗
                </a>
              )}

              {checkoutErro && (
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.9rem', color: '#dc2626', marginBottom: '.8rem', textAlign: 'center' }}>
                  {checkoutErro}
                </div>
              )}

              {/* Cupom */}
              {!isGratis && curso.tipo === 'lms' && (
                <div style={{ marginBottom: '1rem' }}>
                  {!cupomAplicado ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setCupomAberto(o => !o)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontFamily: 'var(--fm)', fontSize: '.9rem', letterSpacing: '.04em',
                          color: 'var(--ink-3)', textDecoration: 'underline', padding: 0,
                          display: 'block', width: '100%', textAlign: 'center',
                          marginBottom: cupomAberto ? '.6rem' : 0,
                        }}
                      >
                        {cupomAberto ? '▲ Fechar' : 'Tem um cupom de desconto?'}
                      </button>
                      {cupomAberto && (
                        <div style={{ display: 'flex', gap: '.4rem' }}>
                          <input
                            type="text"
                            value={cupomCodigo}
                            onChange={e => { setCupomCodigo(e.target.value.toUpperCase()); setCupomErro(null); }}
                            placeholder="CÓDIGO"
                            style={{
                              flex: 1, padding: '.65rem .8rem', border: '1px solid var(--rule)',
                              fontFamily: 'var(--fm)', fontSize: '1.05rem', color: 'var(--ink)',
                              letterSpacing: '.1em', background: 'white', outline: 'none',
                            }}
                          />
                          <button
                            type="button"
                            onClick={validarCupom}
                            disabled={cupomValidando || !cupomCodigo.trim()}
                            style={{
                              padding: '.65rem 1rem', background: 'var(--ink)', color: 'var(--cream)',
                              border: 'none', fontFamily: 'var(--fm)', fontSize: '.9rem', letterSpacing: '.08em',
                              cursor: cupomValidando || !cupomCodigo.trim() ? 'default' : 'pointer',
                              opacity: cupomValidando || !cupomCodigo.trim() ? .5 : 1,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {cupomValidando ? '...' : 'Aplicar'}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.5rem .8rem', background: '#f0fdf4', border: '1px solid #86efac' }}>
                      <span style={{ fontFamily: 'var(--fm)', fontSize: '.9rem', color: '#16a34a', letterSpacing: '.04em' }}>
                        Cupom "{cupomAplicado}" ✓
                      </span>
                      <button
                        type="button"
                        onClick={() => { setCupomAplicado(null); setCupomDesconto(null); setCupomCodigo(''); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--fm)', fontSize: '.8rem', color: '#16a34a' }}
                      >
                        Remover
                      </button>
                    </div>
                  )}
                  {cupomErro && (
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '.85rem', color: '#dc2626', marginTop: '.4rem', textAlign: 'center' }}>
                      {cupomErro}
                    </div>
                  )}
                </div>
              )}

              {/* Informações de segurança */}
              <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '1rem', marginBottom: '1rem' }}>
                {([
                  '🔒 Pagamento seguro via Stripe',
                  'Não armazenamos dados do seu cartão',
                  'Criptografia SSL em todas as transações',
                  curso.garantia_dias ? `✓ Garantia de ${curso.garantia_dias} dias` : null,
                ] as (string | null)[]).filter(Boolean).map((item, i) => (
                  <div key={i} style={{ fontFamily: 'var(--fm)', fontSize: '.9rem', color: 'var(--ink-3)', letterSpacing: '.02em', marginBottom: '.3rem' }}>
                    {item}
                  </div>
                ))}
              </div>

              {/* Inclui */}
              {curso.inclui && curso.inclui.length > 0 && (
                <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '1rem' }}>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '.9rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '.8rem' }}>
                    Inclui
                  </div>
                  {curso.inclui.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '.6rem', marginBottom: '.5rem' }}>
                      <span style={{ color: 'var(--gold)', flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: '1.2rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ O QUE VAI APRENDER ════════════════════════════════════════ */}
      {curso.o_que_aprender && curso.o_que_aprender.length > 0 && (
        <section style={{ background: 'var(--cream-d)', padding: '5rem 0' }}>
          <div className="sec-wrap">
            <ScrollReveal>
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>O que você vai aprender</div>
            </ScrollReveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '.8rem', marginTop: '2rem' }}>
              {curso.o_que_aprender.map((item, i) => (
                <ScrollReveal key={i} delay={((i % 2) + 1) as 1 | 2}>
                  <div style={{ display: 'flex', gap: '.8rem', alignItems: 'flex-start', padding: '.9rem 1.1rem', background: 'var(--cream)', border: '1px solid var(--rule)' }}>
                    <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '.1rem' }}>✓</span>
                    <span style={{ fontSize: '1.28rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ EMENTA / MÓDULOS ══════════════════════════════════════════ */}
      {curso.modulos && curso.modulos.length > 0 && (
        <section style={{ background: 'var(--cream)', padding: '5rem 0' }}>
          <div className="sec-wrap">
            <ScrollReveal>
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>Conteúdo do curso</div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.4rem, 3.75vw, 3rem)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '2.5rem' }}>
                {curso.modulos.length} módulo{curso.modulos.length > 1 ? 's' : ''}
              </h2>
            </ScrollReveal>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {curso.modulos.map((m, i) => (
                <ScrollReveal key={m.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
                  <div style={{
                    display: 'grid', gridTemplateColumns: '48px 1fr', gap: '1.5rem',
                    padding: '1.5rem 0', borderBottom: i < curso.modulos!.length - 1 ? '1px solid var(--rule)' : 'none',
                    alignItems: 'start',
                  }}>
                    <div style={{ fontFamily: 'var(--fd)', fontSize: '1.6rem', fontWeight: 700, color: 'rgba(168,120,40,.25)', lineHeight: 1 }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.58rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '.4rem' }}>
                        {m.titulo}
                      </h3>
                      {m.descricao && (
                        <p style={{ fontSize: '1.23rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>{m.descricao}</p>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ PARA QUEM / NÃO É PARA QUEM ══════════════════════════════ */}
      {((curso.para_quem && curso.para_quem.length > 0) || (curso.nao_para_quem && curso.nao_para_quem.length > 0)) && (
        <section style={{ background: 'var(--navy)', padding: '5rem 0' }}>
          <div className="sec-wrap" style={{
            display: 'grid',
            gridTemplateColumns: curso.para_quem?.length && curso.nao_para_quem?.length ? '1fr 1fr' : '1fr',
            gap: '3rem',
          }}>
            {curso.para_quem && curso.para_quem.length > 0 && (
              <ScrollReveal>
                <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'var(--gold)', marginBottom: '1.2rem' }}>Para quem é</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                  {curso.para_quem.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '.8rem', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--gold)', flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: '1.32rem', color: 'rgba(243,239,230,.55)', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}
            {curso.nao_para_quem && curso.nao_para_quem.length > 0 && (
              <ScrollReveal delay={2}>
                <div className="eyebrow" style={{ color: 'rgba(243,239,230,.35)', borderColor: 'rgba(243,239,230,.2)', marginBottom: '1.2rem' }}>Não é para quem</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                  {curso.nao_para_quem.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '.8rem', alignItems: 'flex-start' }}>
                      <span style={{ color: 'rgba(243,239,230,.3)', flexShrink: 0 }}>✗</span>
                      <span style={{ fontSize: '1.32rem', color: 'rgba(243,239,230,.35)', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}
          </div>
        </section>
      )}

      {/* ═══ CTA FINAL ═════════════════════════════════════════════════ */}
      <section style={{ background: 'var(--navy)', padding: '6rem 0', textAlign: 'center', borderTop: '1px solid rgba(243,239,230,.07)' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 5vw' }}>
          <ScrollReveal>
            <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.7rem, 4.5vw, 3.6rem)', fontWeight: 700, color: 'rgba(243,239,230,.9)', letterSpacing: '-.02em', marginBottom: '1rem', lineHeight: 1.2 }}>
              {curso.titulo}
            </h2>
            <div style={{ marginBottom: '2rem' }}>
              {isGratis ? (
                <span style={{ fontFamily: 'var(--fd)', fontSize: '3rem', fontWeight: 700, color: '#16a34a' }}>Grátis</span>
              ) : precoBase !== null ? (
                <span style={{ fontFamily: 'var(--fd)', fontSize: '3rem', fontWeight: 700, color: 'var(--gold)' }}>
                  {fmt(precoBase)}
                </span>
              ) : null}
            </div>
            {curso.tipo === 'lms' ? (
              isGratis ? (
                <a href="https://aluno.phdonassolo.com/login" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-block' }}>
                  Acessar gratuitamente →
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => document.getElementById('card-compra')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-primary"
                  style={{ display: 'inline-block', cursor: 'pointer', border: 'none' }}
                >
                  Garantir minha vaga →
                </button>
              )
            ) : (
              <a href={curso.url_checkout || '#/cursos'} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-block' }}>
                Ver na {curso.tipo === 'udemy' ? 'Udemy' : 'ESPM'} ↗
              </a>
            )}
          </ScrollReveal>
        </div>
      </section>

    </main>
  );
};

export default CursoVendaPage;
