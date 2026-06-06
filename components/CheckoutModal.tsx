import React, { useState, useEffect, useRef } from 'react'
import { iniciarCheckout } from '../services/checkoutService'
import SupabaseService, { PlanoCurso } from '../services/supabaseService'

interface Props {
  open: boolean
  onClose: () => void
  cursoId: string
  cursoTitulo: string
}

type Moeda = 'BRL' | 'EUR'

const MOEDAS: { value: Moeda; flag: string; label: string; desc: string }[] = [
  { value: 'EUR', flag: '🌍', label: 'EUR · Euros', desc: 'Stripe' },
  { value: 'BRL', flag: '🇧🇷', label: 'BRL · Reais', desc: 'Stripe' },
]

let cachedMoeda: Moeda | null = null

async function detectMoedaByIP(): Promise<Moeda> {
  if (cachedMoeda !== null) return cachedMoeda
  try {
    const res = await fetch('https://ipapi.co/json/')
    const data = await res.json()
    cachedMoeda = data.country_code === 'BR' ? 'BRL' : 'EUR'
    return cachedMoeda!
  } catch {
    return 'EUR'
  }
}

export const CheckoutModal: React.FC<Props> = ({ open, onClose, cursoId, cursoTitulo }) => {
  const [email, setEmail] = useState('')
  const [moeda, setMoeda] = useState<Moeda>('EUR')
  const [planos, setPlanos] = useState<PlanoCurso[]>([])
  const [planoSelecionado, setPlanoSelecionado] = useState<PlanoCurso | null>(null)
  const [cupomAberto, setCupomAberto] = useState(false)
  const [cupom, setCupom] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    detectMoedaByIP().then(setMoeda)
  }, [])

  useEffect(() => {
    if (!cursoId) return
    SupabaseService.getPlanosCurso(cursoId).then(data => {
      setPlanos(data)
      if (data.length > 0) setPlanoSelecionado(data[0])
    })
  }, [cursoId])

  useEffect(() => {
    if (open) {
      setErro('')
      setTimeout(() => emailRef.current?.focus(), 80)
    }
  }, [open])

  if (!open) return null

  const precoPlano = (p: PlanoCurso): string => {
    if (moeda === 'BRL') {
      return `R$ ${p.valor_venda.toFixed(2).replace('.', ',')}`
    }
    const eur = p.valor_venda_eur ?? Math.round(p.valor_venda / 6)
    return `€ ${eur}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailTrimmed = email.trim()
    if (!emailTrimmed) { setErro('Informe seu e-mail.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) { setErro('E-mail inválido.'); return }
    setErro('')
    setLoading(true)
    try {
      await iniciarCheckout({
        cursoId,
        emailFinal: emailTrimmed.toLowerCase(),
        moeda,
        planoId: planoSelecionado?.plano_id,
        cupomCodigo: cupomAberto && cupom.trim() ? cupom.trim() : undefined,
      })
    } catch (err: any) {
      setErro(err.message || 'Erro inesperado. Tente novamente.')
      setLoading(false)
    }
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--fm)', fontSize: '.66rem', letterSpacing: '.12em',
    textTransform: 'uppercase', color: 'var(--ink-3)', display: 'block', marginBottom: '.5rem',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '.65rem .9rem', fontFamily: 'var(--fb)',
    fontSize: '.88rem', color: 'var(--ink)', background: '#fff',
    border: '1px solid var(--rule)', outline: 'none', boxSizing: 'border-box',
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(10,14,26,.78)',
          backdropFilter: 'blur(3px)', zIndex: 9998,
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Iniciar pagamento"
        style={{
          position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
          width: 'min(440px, 94vw)', background: 'var(--cream)',
          padding: '2.4rem 2rem', zIndex: 9999,
          boxShadow: '0 24px 80px rgba(0,0,0,.5)',
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '1.8rem' }}>
          <div style={{
            fontFamily: 'var(--fm)', fontSize: '.66rem', letterSpacing: '.18em',
            textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '.6rem',
          }}>
            Pagamento seguro
          </div>
          <h2 style={{
            fontFamily: 'var(--fd)', fontSize: '1.875rem', fontWeight: 700,
            color: 'var(--ink)', lineHeight: 1.2, marginBottom: '.6rem',
          }}>
            {cursoTitulo}
          </h2>
          <p style={{ fontFamily: 'var(--fb)', fontSize: '1.23rem', color: 'var(--ink-3)', lineHeight: 1.55 }}>
            Informe seu e-mail para continuar. Após o pagamento, acesse o curso em{' '}
            <a
              href="https://aluno.phdonassolo.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--gold)', textDecoration: 'none' }}
            >
              aluno.phdonassolo.com
            </a>{' '}
            com este mesmo e-mail.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>E-mail</label>
            <input
              ref={emailRef}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              style={inputStyle}
            />
          </div>

          {/* Moeda */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Moeda de pagamento</label>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              {MOEDAS.map(m => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMoeda(m.value)}
                  style={{
                    flex: 1, padding: '.65rem .8rem', textAlign: 'left', cursor: 'pointer',
                    background: moeda === m.value ? 'var(--navy)' : '#fff',
                    border: moeda === m.value ? '1px solid var(--navy)' : '1px solid var(--rule)',
                    transition: 'all .15s',
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--fd)', fontSize: '.95rem', fontWeight: 700, marginBottom: '.15rem',
                    color: moeda === m.value ? 'var(--cream)' : 'var(--ink)',
                  }}>
                    {m.flag} {m.label}
                  </div>
                  <div style={{
                    fontFamily: 'var(--fm)', fontSize: '.6rem', letterSpacing: '.08em',
                    color: moeda === m.value ? 'rgba(243,239,230,.5)' : 'var(--ink-3)',
                  }}>
                    {m.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Plano */}
          {planos.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Plano de acesso</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                {planos.map(p => (
                  <button
                    key={p.plano_id}
                    type="button"
                    onClick={() => setPlanoSelecionado(p)}
                    style={{
                      padding: '.65rem .9rem', textAlign: 'left', cursor: 'pointer',
                      background: planoSelecionado?.plano_id === p.plano_id ? 'var(--navy)' : '#fff',
                      border: planoSelecionado?.plano_id === p.plano_id ? '1px solid var(--navy)' : '1px solid var(--rule)',
                      transition: 'all .15s',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--fd)', fontSize: '.95rem', fontWeight: 700,
                      color: planoSelecionado?.plano_id === p.plano_id ? 'var(--cream)' : 'var(--ink)',
                    }}>
                      {p.planos?.nome ?? 'Acesso'}
                    </span>
                    <span style={{
                      fontFamily: 'var(--fd)', fontSize: '.95rem', fontWeight: 700,
                      color: planoSelecionado?.plano_id === p.plano_id ? 'var(--gold)' : 'var(--ink)',
                    }}>
                      {precoPlano(p)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cupom */}
          <div style={{ marginBottom: '1.4rem' }}>
            {!cupomAberto ? (
              <button
                type="button"
                onClick={() => setCupomAberto(true)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  fontFamily: 'var(--fm)', fontSize: '.66rem', letterSpacing: '.1em',
                  textTransform: 'uppercase', color: 'var(--ink-3)', textDecoration: 'underline',
                }}
              >
                Tem um cupom de desconto?
              </button>
            ) : (
              <div>
                <label style={labelStyle}>Cupom de desconto</label>
                <div style={{ display: 'flex', gap: '.4rem' }}>
                  <input
                    type="text"
                    value={cupom}
                    onChange={e => setCupom(e.target.value.toUpperCase())}
                    placeholder="CÓDIGO"
                    autoFocus
                    style={{ ...inputStyle, flex: 1, fontFamily: 'var(--fm)', letterSpacing: '.08em' }}
                  />
                  <button
                    type="button"
                    onClick={() => { setCupomAberto(false); setCupom('') }}
                    style={{
                      padding: '.65rem .9rem', background: '#fff',
                      border: '1px solid var(--rule)', cursor: 'pointer',
                      color: 'var(--ink-3)', fontSize: '.9rem', lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Erro */}
          {erro && (
            <div style={{
              background: '#fff3f3', border: '1px solid #fca5a5',
              padding: '.7rem .9rem', marginBottom: '1rem',
              fontFamily: 'var(--fb)', fontSize: '.8rem', color: '#c0392b',
            }}>
              {erro}
            </div>
          )}

          {/* CTA */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '.9rem', border: 'none', cursor: loading ? 'default' : 'pointer',
              background: loading ? 'var(--ink-3)' : 'var(--navy)', color: 'var(--cream)',
              fontFamily: 'var(--fm)', fontSize: '.75rem', letterSpacing: '.14em',
              textTransform: 'uppercase', transition: 'background .15s',
            }}
          >
            {loading ? 'Aguarde...' : 'Ir para o pagamento →'}
          </button>

          <p style={{
            fontFamily: 'var(--fm)', fontSize: '.66rem', letterSpacing: '.08em',
            color: 'var(--ink-3)', textAlign: 'center', marginTop: '.8rem', lineHeight: 1.5,
          }}>
            🔒 Pagamento seguro via Stripe · Garantia de 7 dias
          </p>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%', marginTop: '.6rem', padding: '.6rem', background: 'none',
              border: 'none', cursor: 'pointer', fontFamily: 'var(--fm)', fontSize: '.66rem',
              letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)',
            }}
          >
            Cancelar
          </button>
        </form>
      </div>
    </>
  )
}
