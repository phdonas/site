// ============================================================
// supabaseService.ts
// Serviço de leitura do Supabase para o site phdonassolo.com
//
// REGRAS CRÍTICAS:
// - Este arquivo APENAS LÊ dados do Supabase. Nunca escreve.
// - Todas as queries de cursos filtram por visivel_no_site = true
// - Todas as queries de ferramentas filtram por visivel_no_site = true
// - Nunca usar service_role key — apenas anon key
// ============================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Cliente lazy — só instanciado quando a primeira query for chamada.
// Evita erro fatal na inicialização do bundle quando as variáveis
// de ambiente não estão disponíveis (ex.: build sem .env configurado).
let _client: SupabaseClient | null = null

function getClient(): SupabaseClient | null {
  if (_client) return _client

  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn('Supabase: variáveis de ambiente não configuradas. Conteúdo dinâmico indisponível.')
    return null
  }

  _client = createClient(url, key)
  return _client
}

// ============================================================
// TIPOS — baseados no schema real do Supabase
// ============================================================

export interface Pilar {
  id: string
  nome: string
  slug: string
  cor_badge: string
  subtitulo: string | null
  icone: string | null
  ordem: number
}

export interface Modulo {
  id: string
  titulo: string
  descricao: string | null
  ordem: number
}

export interface Curso {
  id: string
  titulo: string
  slug: string
  descricao: string | null
  thumb_url: string | null
  status: string
  visivel_no_site: boolean
  tipo: string
  is_gratis: boolean | null
  is_free: boolean | null
  nivel: string | null
  categoria: string | null
  ordem_vitrine: number
  destaque_vitrine: boolean | null
  duracao_total_minutos: number | null
  preco_vitrine_brl: number | null
  preco_original_brl: number | null
  url_checkout: string | null
  objetivos: string | null
  publico_alvo: string | null
  ementa_resumida: string | null
  pre_requisitos: string | null
  video_vendas_url: string | null
  garantia_dias: number | null
  faq: Array<{ pergunta: string; resposta: string }> | null
  o_que_aprender: string[] | null
  para_quem: string[] | null
  nao_para_quem: string[] | null
  inclui: string[] | null
  avaliacoes_count: number
  avaliacoes_media: number
  pilar_id: string | null
  modulos?: Modulo[]
  menor_preco?: number | null
}

export interface Ferramenta {
  id: string
  nome: string
  slug: string
  descricao: string | null
  icone: string | null
  status: string
  visivel_no_site: boolean
  url_externa: string | null
  capa_url: string | null
  label_botao: string | null
  tipo_entrega: string
  url_entrega: string | null
  categoria: string | null
  ordem_vitrine: number
}

export interface Recurso {
  id: string
  titulo: string
  descricao: string | null
  thumb_url: string | null
  arquivo_url: string
  tipo: string | null
  abertura_tipo: string | null
  status: string | null
  visivel_no_site: boolean
  destaque_vitrine: boolean | null
  objetivo: string | null
  quando_usar: string | null
  como_usar: string | null
  resultados_esperados: string | null
  url_entrega: string | null
  tipo_entrega: string | null
  categoria: string | null
}

// ============================================================
// CURSOS
// ============================================================

export const SupabaseService = {

  getCursos: async (filtros?: {
    tipo?: 'lms' | 'udemy' | 'espm'
    categoria?: string
    is_gratis?: boolean
  }): Promise<Curso[]> => {
    const client = getClient()
    if (!client) return []

    let query = client
      .from('cursos')
      .select(`
        id, titulo, slug, descricao, thumb_url, status,
        visivel_no_site, tipo, is_gratis, is_free, nivel, categoria,
        ordem_vitrine, destaque_vitrine, duracao_total_minutos,
        preco_vitrine_brl, preco_original_brl, url_checkout,
        objetivos, avaliacoes_count, avaliacoes_media, pilar_id
      `)
      .eq('visivel_no_site', true)
      .eq('status', 'publicado')
      .order('ordem_vitrine', { ascending: true })

    if (filtros?.tipo)     query = query.eq('tipo', filtros.tipo)
    if (filtros?.categoria) query = query.eq('categoria', filtros.categoria)
    if (filtros?.is_gratis !== undefined) query = query.eq('is_gratis', filtros.is_gratis)

    const { data, error } = await query
    if (error) { console.error('Supabase getCursos error:', error); return [] }
    return (data as Curso[]) || []
  },

  getCursoById: async (id: string): Promise<Curso | null> => {
    const client = getClient()
    if (!client) return null

    const { data, error } = await client
      .from('cursos')
      .select(`
        id, titulo, slug, descricao, thumb_url, status,
        visivel_no_site, tipo, is_gratis, is_free, nivel, categoria,
        duracao_total_minutos, preco_vitrine_brl, preco_original_brl,
        url_checkout, objetivos, publico_alvo, ementa_resumida,
        pre_requisitos, video_vendas_url, garantia_dias, faq,
        o_que_aprender, para_quem, nao_para_quem, inclui,
        avaliacoes_count, avaliacoes_media, pilar_id
      `)
      .eq('id', id)
      .eq('visivel_no_site', true)
      .eq('status', 'publicado')
      .maybeSingle()

    if (error || !data) { console.error('Supabase getCursoById error:', error); return null }

    const { data: modulosData } = await client
      .from('modulos')
      .select('id, titulo, descricao, ordem')
      .eq('curso_id', id)
      .order('ordem', { ascending: true })

    return { ...(data as Curso), modulos: (modulosData as Modulo[]) || [] }
  },

  getCursoBySlug: async (slug: string): Promise<Curso | null> => {
    const client = getClient()
    if (!client) return null

    const { data, error } = await client
      .from('cursos')
      .select(`
        id, titulo, slug, descricao, thumb_url, status,
        visivel_no_site, tipo, is_gratis, is_free, nivel, categoria,
        duracao_total_minutos, preco_vitrine_brl, preco_original_brl,
        url_checkout, objetivos, publico_alvo, ementa_resumida,
        pre_requisitos, video_vendas_url, garantia_dias, faq,
        o_que_aprender, para_quem, nao_para_quem, inclui,
        avaliacoes_count, avaliacoes_media, pilar_id
      `)
      .eq('slug', slug)
      .eq('visivel_no_site', true)
      .eq('status', 'publicado')
      .maybeSingle()

    if (error || !data) { console.error('Supabase getCursoBySlug error:', error); return null }

    const { data: modulosData } = await client
      .from('modulos')
      .select('id, titulo, descricao, ordem')
      .eq('curso_id', (data as Curso).id)
      .order('ordem', { ascending: true })

    return { ...(data as Curso), modulos: (modulosData as Modulo[]) || [] }
  },

  getCursosStats: async (): Promise<{ total: number; gratuitos: number }> => {
    const client = getClient()
    if (!client) return { total: 0, gratuitos: 0 }

    const { count: total } = await client
      .from('cursos')
      .select('id', { count: 'exact', head: true })
      .eq('visivel_no_site', true)
      .eq('status', 'publicado')

    const { count: gratuitos } = await client
      .from('cursos')
      .select('id', { count: 'exact', head: true })
      .eq('visivel_no_site', true)
      .eq('status', 'publicado')
      .eq('is_gratis', true)

    return { total: total || 0, gratuitos: gratuitos || 0 }
  },

  getCursoPreco: async (cursoId: string): Promise<{ menor_preco: number | null; tem_destaque: boolean } | null> => {
    const client = getClient()
    if (!client) return null

    const { data, error } = await client
      .from('vw_cursos_precos_base')
      .select('menor_preco, tem_destaque')
      .eq('curso_id', cursoId)
      .single()

    if (error || !data) return null
    return data as { menor_preco: number | null; tem_destaque: boolean }
  },

  // ============================================================
  // PILARES
  // ============================================================

  getPilares: async (): Promise<Pilar[]> => {
    const client = getClient()
    if (!client) return []

    const { data, error } = await client
      .from('pilares')
      .select('id, nome, slug, cor_badge, subtitulo, icone, ordem')
      .order('ordem', { ascending: true })

    if (error) { console.error('Supabase getPilares error:', error); return [] }
    return (data as Pilar[]) || []
  },

  // ============================================================
  // FERRAMENTAS
  // ============================================================

  getFerramentas: async (categoria?: string): Promise<Ferramenta[]> => {
    const client = getClient()
    if (!client) return []

    let query = client
      .from('ferramentas_saas')
      .select(`
        id, nome, slug, descricao, icone, status,
        visivel_no_site, url_externa, capa_url, label_botao,
        tipo_entrega, url_entrega, categoria, ordem_vitrine
      `)
      .eq('visivel_no_site', true)
      .eq('status', 'ativo')
      .order('ordem_vitrine', { ascending: true })

    if (categoria) query = query.eq('categoria', categoria)

    const { data, error } = await query
    if (error) { console.error('Supabase getFerramentas error:', JSON.stringify(error, null, 2)); return [] }
    return (data as Ferramenta[]) || []
  },

  getFerramentaById: async (id: string): Promise<Ferramenta | null> => {
    const client = getClient()
    if (!client) return null

    const { data, error } = await client
      .from('ferramentas_saas')
      .select('*')
      .eq('id', id)
      .eq('visivel_no_site', true)
      .eq('status', 'ativo')
      .single()

    if (error || !data) return null
    return data as Ferramenta
  },

  // ============================================================
  // RECURSOS
  // ============================================================

  getRecursos: async (destaque?: boolean): Promise<Recurso[]> => {
    const client = getClient()
    if (!client) return []

    let query = client
      .from('recursos')
      .select(`
        id, titulo, descricao, thumb_url, arquivo_url,
        tipo, abertura_tipo, status, visivel_no_site,
        destaque_vitrine, objetivo, quando_usar, url_entrega,
        tipo_entrega, categoria
      `)
      .eq('visivel_no_site', true)
      .eq('status', 'ativo')

    if (destaque !== undefined) query = query.eq('destaque_vitrine', destaque)

    const { data, error } = await query
    if (error) { console.error('Supabase getRecursos error:', JSON.stringify(error, null, 2)); return [] }
    return (data as Recurso[]) || []
  },

}

export default SupabaseService
