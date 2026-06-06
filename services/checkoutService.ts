const LMS_URL = 'https://aluno.phdonassolo.com'

export interface CheckoutParams {
  cursoId: string
  emailFinal: string
  moeda: 'BRL' | 'EUR'
  planoId?: string
  cupomCodigo?: string
}

export async function iniciarCheckout(params: CheckoutParams): Promise<void> {
  const res = await fetch(`${LMS_URL}/api/pagamentos/stripe/criar-sessao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cursoId: params.cursoId,
      emailFinal: params.emailFinal,
      moeda: params.moeda,
      planoId: params.planoId,
      cupomCodigo: params.cupomCodigo,
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erro ao criar sessão de pagamento')
  if (!data.url) throw new Error('URL de checkout não retornada')
  window.location.href = data.url
}
