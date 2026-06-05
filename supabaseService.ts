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

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase: variáveis de ambiente não configuradas.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
  thumb_url: string | null       // campo real no schema
  status: string                 // 'publicado' | 'rascunho'
  visivel_no_site: boolean       // adicionado via migration
  tipo: string                   // 'lms' | 'udemy' | 'espm' — adicionado via migration
  is_gratis: boolean | null
  is_free: boolean | null
  nivel: string | null           // adicionado via migration
  categoria: string | null       // adicionado via migration
  ordem_vitrine: number          // adicionado via migration
  destaque_vitrine: boolean | null
  duracao_total_minutos: number | null
  preco_vitrine_brl: number | null    // adicionado via migration
  preco_original_brl: number | null   // adicionado via migration
  url_checkout: string | null    // adicionado via migration
  objetivos: string | null       // texto livre — usado como subtítulo
  publico_alvo: string | null
  ementa_resumida: string | null
  pre_requisitos: string | null
  video_vendas_url: string | null
  garantia_dias: number | null
  faq: Array<{ pergunta: string; resposta: string }> | null
  o_que_aprender: string[] | null     // adicionado via migration
  para_quem: string[] | null          // adicionado via migration
  nao_para_quem: string[] | null      // adicionado via migration
  inclui: string[] | null             // adicionado via migration
  avaliacoes_count: number
  avaliacoes_media: number
  pilar_id: string | null
  pilar?: Pilar                       // join opcional
  modulos?: Modulo[]                  // join opcional
  // Preço via view vw_cursos_precos_base (join opcional)
  menor_preco?: number | null
}

export interface Ferramenta {
  id: string
  nome: string
  slug: string
  descricao: string | null
  icone: string | null
  status: string                 // 'ativo' | 'inativo'
  visivel_no_site: boolean       // adicionado via migration
  url_externa: string | null
  capa_url: string | null
  label_botao: string | null
  tipo_entrega: string           // 'html' | 'externo' | 'download' — adicionado via migration
  url_entrega: string | null     // adicionado via migration
  categoria: string | null       // adicionado via migration
  ordem_vitrine: number
}

export interface Recurso {
  id: string
  titulo: string
  descricao: string | null
  thumb_url: string | null
  arquivo_url: string
  tipo: string | null
  abertura_tipo: string | null   // como abrir: 'nova_aba' | 'download' | 'iframe'
  status: string | null
  visivel_no_site: boolean       // adicionado via migration
  destaque_vitrine: boolean | null
  objetivo: string | null
  quando_usar: string | null
  como_usar: string | null
  resultados_esperados: string | null
}

// ============================================================
// CURSOS
// ============================================================

export const SupabaseService = {

  /**
   * Lista todos os cursos visíveis no site
   * SEMPRE filtra por visivel_no_site = true
   */
  getCursos: async (filtros?: {
    tipo?: 'lms' | 'udemy' | 'espm'
    categoria?: string
    is_gratis?: boolean
  }): Promise<Curso[]> => {
    let query = supabase
      .from('cursos')
      .select(`
        id, titulo, slug, descricao, thumb_url, status,
        visivel_no_site, tipo, is_gratis, is_free, nivel, categoria,
        ordem_vitrine, destaque_vitrine, duracao_total_minutos,
        preco_vitrine_brl, preco_original_brl, url_checkout,
        objetivos, avaliacoes_count, avaliacoes_media, pilar_id,
        pilares (id, nome, slug, cor_badge)
      `)
      .eq('visivel_no_site', true)
      .eq('status', 'publicado')
      .order('ordem_vitrine', { ascending: true })

    if (filtros?.tipo) {
      query = query.eq('tipo', filtros.tipo)
    }
    if (filtros?.categoria) {
      query = query.eq('categoria', filtros.categoria)
    }
    if (filtros?.is_gratis !== undefined) {
      query = query.eq('is_gratis', filtros.is_gratis)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase getCursos error:', error)
      return []
    }

    return (data as Curso[]) || []
  },

  /**
   * Busca um curso por ID para a página de venda
   * Inclui módulos para a ementa
   * SEMPRE verifica visivel_no_site = true
   */
  getCursoById: async (id: string): Promise<Curso | null> => {
    const { data, error } = await supabase
      .from('cursos')
      .select(`
        id, titulo, slug, descricao, thumb_url, status,
        visivel_no_site, tipo, is_gratis, is_free, nivel, categoria,
        duracao_total_minutos, preco_vitrine_brl, preco_original_brl,
        url_checkout, objetivos, publico_alvo, ementa_resumida,
        pre_requisitos, video_vendas_url, garantia_dias, faq,
        o_que_aprender, para_quem, nao_para_quem, inclui,
        avaliacoes_count, avaliacoes_media, pilar_id,
        pilares (id, nome, slug, cor_badge)
      `)
      .eq('id', id)
      .eq('visivel_no_site', true)
      .eq('status', 'publicado')
      .single()

    if (error || !data) {
      console.error('Supabase getCursoById error:', error)
      return null
    }

    // Buscar módulos do curso
    const { data: modulosData } = await supabase
      .from('modulos')
      .select('id, titulo, descricao, ordem')
      .eq('curso_id', id)
      .order('ordem', { ascending: true })

    return {
      ...(data as Curso),
      modulos: (modulosData as Modulo[]) || []
    }
  },

  /**
   * Busca um curso por slug
   */
  getCursoBySlug: async (slug: string): Promise<Curso | null> => {
    const { data, error } = await supabase
      .from('cursos')
      .select(`
        id, titulo, slug, descricao, thumb_url, status,
        visivel_no_site, tipo, is_gratis, is_free, nivel, categoria,
        duracao_total_minutos, preco_vitrine_brl, preco_original_brl,
        url_checkout, objetivos, publico_alvo, ementa_resumida,
        pre_requisitos, video_vendas_url, garantia_dias, faq,
        o_que_aprender, para_quem, nao_para_quem, inclui,
        avaliacoes_count, avaliacoes_media, pilar_id,
        pilares (id, nome, slug, cor_badge)
      `)
      .eq('slug', slug)
      .eq('visivel_no_site', true)
      .eq('status', 'publicado')
      .single()

    if (error || !data) return null

    const { data: modulosData } = await supabase
      .from('modulos')
      .select('id, titulo, descricao, ordem')
      .eq('curso_id', (data as Curso).id)
      .order('ordem', { ascending: true })

    return {
      ...(data as Curso),
      modulos: (modulosData as Modulo[]) || []
    }
  },

  /**
   * Contadores para o hero da página de cursos
   * Conta apenas cursos visíveis no site
   */
  getCursosStats: async (): Promise<{
    total: number
    gratuitos: number
  }> => {
    const { count: total } = await supabase
      .from('cursos')
      .select('id', { count: 'exact', head: true })
      .eq('visivel_no_site', true)
      .eq('status', 'publicado')

    const { count: gratuitos } = await supabase
      .from('cursos')
      .select('id', { count: 'exact', head: true })
      .eq('visivel_no_site', true)
      .eq('status', 'publicado')
      .eq('is_gratis', true)

    return {
      total: total || 0,
      gratuitos: gratuitos || 0
    }
  },

  /**
   * Busca o preço de um curso via view vw_cursos_precos_base
   * Retorna menor preço disponível nos planos
   */
  getCursoPreco: async (cursoId: string): Promise<{
    menor_preco: number | null
    tem_destaque: boolean
  } | null> => {
    const { data, error } = await supabase
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

  /**
   * Lista todos os pilares (usados como filtro no conteúdo)
   */
  getPilares: async (): Promise<Pilar[]> => {
    const { data, error } = await supabase
      .from('pilares')
      .select('id, nome, slug, cor_badge, subtitulo, icone, ordem')
      .order('ordem', { ascending: true })

    if (error) {
      console.error('Supabase getPilares error:', error)
      return []
    }

    return (data as Pilar[]) || []
  },

  // ============================================================
  // FERRAMENTAS
  // ============================================================

  /**
   * Lista ferramentas visíveis no site
   * SEMPRE filtra por visivel_no_site = true
   */
  getFerramentas: async (categoria?: string): Promise<Ferramenta[]> => {
    let query = supabase
      .from('ferramentas_saas')
      .select(`
        id, nome, slug, descricao, icone, status,
        visivel_no_site, url_externa, capa_url, label_botao,
        tipo_entrega, url_entrega, categoria, ordem_vitrine
      `)
      .eq('visivel_no_site', true)
      .eq('status', 'ativo')
      .order('ordem_vitrine', { ascending: true })

    if (categoria) {
      query = query.eq('categoria', categoria)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase getFerramentas error:', error)
      return []
    }

    return (data as Ferramenta[]) || []
  },

  /**
   * Busca uma ferramenta por ID (para modal de entrega pós-lead)
   * SEMPRE verifica visivel_no_site = true
   */
  getFerramentaById: async (id: string): Promise<Ferramenta | null> => {
    const { data, error } = await supabase
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

  /**
   * Lista recursos visíveis no site
   * SEMPRE filtra por visivel_no_site = true
   */
  getRecursos: async (destaque?: boolean): Promise<Recurso[]> => {
    let query = supabase
      .from('recursos')
      .select(`
        id, titulo, descricao, thumb_url, arquivo_url,
        tipo, abertura_tipo, status, visivel_no_site,
        destaque_vitrine, objetivo, quando_usar, como_usar,
        resultados_esperados
      `)
      .eq('visivel_no_site', true)
      .eq('status', 'ativo')

    if (destaque !== undefined) {
      query = query.eq('destaque_vitrine', destaque)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase getRecursos error:', error)
      return []
    }

    return (data as Recurso[]) || []
  },

}

export default SupabaseService
