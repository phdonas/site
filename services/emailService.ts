import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export async function sendNotificationEmail(payload: {
  tipo: string
  nome: string
  email: string
  whatsapp?: string
  assunto?: string
  mensagem?: string
  recurso?: string
  origem?: string
}) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS: variáveis não configuradas')
    return
  }

  const templateParams = {
    tipo: payload.tipo,
    assunto: payload.assunto || payload.recurso || payload.origem || payload.tipo,
    nome: payload.nome,
    email: payload.email,
    whatsapp: payload.whatsapp || '—',
    mensagem: payload.mensagem || '—',
    origem: payload.origem || '—',
  }

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
  } catch (error) {
    console.error('EmailJS error:', error)
  }
}
