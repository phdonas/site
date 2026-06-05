const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY
const EMAIL_FROM = 'contato@phdonassolo.com'
const EMAIL_TO = 'contato@phdonassolo.com'

export async function sendNotificationEmail(payload: {
  tipo: 'contato' | 'newsletter' | 'recurso' | 'lp' | 'pre_lancamento_lms'
  nome: string
  email: string
  whatsapp?: string
  assunto?: string
  mensagem?: string
  recurso?: string
  origem?: string
  slug?: string
}) {
  if (!RESEND_API_KEY) {
    console.warn('Resend: API key não configurada')
    return
  }

  const assuntos = {
    contato: `📩 Novo contato: ${payload.assunto || 'Sem assunto'} — ${payload.nome}`,
    newsletter: `📧 Nova inscrição newsletter — ${payload.nome}`,
    recurso: `🔧 Acesso a recurso: ${payload.recurso} — ${payload.nome}`,
    lp: `🎯 Lead LP ${payload.slug || payload.origem} — ${payload.nome}`,
    pre_lancamento_lms: `🚀 Pré-cadastro Área do Aluno — ${payload.nome}`,
  }

  const corpo = `
    <h2>${assuntos[payload.tipo]}</h2>
    <table>
      <tr><td><strong>Nome:</strong></td><td>${payload.nome}</td></tr>
      <tr><td><strong>Email:</strong></td><td>${payload.email}</td></tr>
      ${payload.whatsapp ? `<tr><td><strong>WhatsApp:</strong></td><td>${payload.whatsapp}</td></tr>` : ''}
      ${payload.assunto ? `<tr><td><strong>Assunto:</strong></td><td>${payload.assunto}</td></tr>` : ''}
      ${payload.mensagem ? `<tr><td><strong>Mensagem:</strong></td><td>${payload.mensagem}</td></tr>` : ''}
      ${payload.recurso ? `<tr><td><strong>Recurso:</strong></td><td>${payload.recurso}</td></tr>` : ''}
      ${payload.origem ? `<tr><td><strong>Origem:</strong></td><td>${payload.origem}</td></tr>` : ''}
    </table>
  `

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: EMAIL_TO,
        subject: assuntos[payload.tipo],
        html: corpo,
      }),
    })
  } catch (error) {
    console.error('Resend error:', error)
    // Não bloqueia o fluxo — lead já salvo no Firestore
  }
}
