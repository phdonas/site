-- ============================================================
-- MIGRATION: campos necessários para o site phdonassolo.com
-- Executar no Supabase SQL Editor (Dashboard → SQL Editor)
-- Data: Junho 2025
-- ATENÇÃO: execute linha a linha ou em bloco único
-- Não altera dados existentes — apenas adiciona colunas
-- ============================================================

-- ------------------------------------------------------------
-- 1. TABELA: cursos
-- Adicionar campos necessários para a vitrine do site
-- ------------------------------------------------------------

-- Controle de visibilidade no site (independente do status no LMS)
ALTER TABLE cursos
  ADD COLUMN IF NOT EXISTS visivel_no_site boolean DEFAULT false;

-- Tipo de plataforma: lms = plataforma própria, udemy = Udemy, espm = ESPM
ALTER TABLE cursos
  ADD COLUMN IF NOT EXISTS tipo character varying DEFAULT 'lms';

-- URL de checkout (Hotmart para lms, URL externa para udemy/espm)
ALTER TABLE cursos
  ADD COLUMN IF NOT EXISTS url_checkout text;

-- Nível do curso para exibição na vitrine
ALTER TABLE cursos
  ADD COLUMN IF NOT EXISTS nivel character varying;
-- Valores sugeridos: 'Iniciante' | 'Intermediário' | 'Avançado' | 'MBA'

-- Ordem de exibição na vitrine
ALTER TABLE cursos
  ADD COLUMN IF NOT EXISTS ordem_vitrine integer DEFAULT 0;

-- Categoria para filtro na vitrine
ALTER TABLE cursos
  ADD COLUMN IF NOT EXISTS categoria character varying;
-- Valores sugeridos: 'Gestão Comercial' | 'Vendas' | 'Negociação' | 'Liderança'

-- O que o aluno vai aprender (array de strings para bullets)
ALTER TABLE cursos
  ADD COLUMN IF NOT EXISTS o_que_aprender jsonb;
-- Formato: ["item 1", "item 2", "item 3"]

-- Para quem é o curso
ALTER TABLE cursos
  ADD COLUMN IF NOT EXISTS para_quem jsonb;
-- Formato: ["perfil 1", "perfil 2"]

-- Não é para quem
ALTER TABLE cursos
  ADD COLUMN IF NOT EXISTS nao_para_quem jsonb;
-- Formato: ["perfil 1", "perfil 2"]

-- O que está incluído (para card de compra)
ALTER TABLE cursos
  ADD COLUMN IF NOT EXISTS inclui jsonb;
-- Formato: ["item 1", "item 2"]

-- Avaliações (para exibição na página de venda)
ALTER TABLE cursos
  ADD COLUMN IF NOT EXISTS avaliacoes_count integer DEFAULT 0;

ALTER TABLE cursos
  ADD COLUMN IF NOT EXISTS avaliacoes_media numeric DEFAULT 0;

-- Preço original (para exibir desconto)
-- Nota: o preço real vem de planos_cursos / vw_cursos_precos_base
-- Este campo é para exibição de "de X por Y" na vitrine
ALTER TABLE cursos
  ADD COLUMN IF NOT EXISTS preco_vitrine_brl numeric;
-- Preço de exibição em BRL (pode diferir do planos_cursos)

ALTER TABLE cursos
  ADD COLUMN IF NOT EXISTS preco_original_brl numeric;
-- Preço "riscado" para mostrar desconto

-- ------------------------------------------------------------
-- 2. TABELA: ferramentas_saas
-- Adicionar campos para exibição no site e controle de entrega
-- ------------------------------------------------------------

-- Controle de visibilidade no site
ALTER TABLE ferramentas_saas
  ADD COLUMN IF NOT EXISTS visivel_no_site boolean DEFAULT false;

-- Tipo de entrega após captura de lead
ALTER TABLE ferramentas_saas
  ADD COLUMN IF NOT EXISTS tipo_entrega character varying DEFAULT 'externo';
-- Valores: 'html' | 'externo' | 'download'
-- html: abre URL interna em nova aba
-- externo: abre url_externa em nova aba
-- download: faz download do arquivo

-- URL de entrega após captura (pode ser igual a url_externa ou diferente)
ALTER TABLE ferramentas_saas
  ADD COLUMN IF NOT EXISTS url_entrega text;

-- Categoria para filtro na página de recursos
ALTER TABLE ferramentas_saas
  ADD COLUMN IF NOT EXISTS categoria character varying;

-- Ordem de exibição
ALTER TABLE ferramentas_saas
  ADD COLUMN IF NOT EXISTS ordem_vitrine integer DEFAULT 0;

-- ------------------------------------------------------------
-- 3. TABELA: recursos
-- Já tem destaque_vitrine e status — apenas confirmar
-- Adicionar visivel_no_site para consistência
-- ------------------------------------------------------------

ALTER TABLE recursos
  ADD COLUMN IF NOT EXISTS visivel_no_site boolean DEFAULT false;

-- ------------------------------------------------------------
-- 4. RLS: habilitar leitura pública para ferramentas_saas
-- O diagnóstico identificou que ferramentas_saas não tem RLS
-- Adicionar policy de leitura pública para itens visíveis no site
-- ------------------------------------------------------------

ALTER TABLE ferramentas_saas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ferramentas_visiveis_no_site"
  ON ferramentas_saas
  FOR SELECT
  TO anon
  USING (visivel_no_site = true AND status = 'ativo');

-- ------------------------------------------------------------
-- 5. RLS: adicionar policy para recursos com visivel_no_site
-- ------------------------------------------------------------

-- Verificar se RLS já está habilitada em recursos
-- Se não estiver, habilitar:
ALTER TABLE recursos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recursos_visiveis_no_site"
  ON recursos
  FOR SELECT
  TO anon
  USING (visivel_no_site = true AND status = 'ativo');

-- ------------------------------------------------------------
-- 6. Atualizar cursos existentes que devem aparecer no site
-- ATENÇÃO: execute este bloco manualmente após a migration
-- Ajuste os slugs/ids conforme seus cursos reais
-- ------------------------------------------------------------

-- Exemplo: marcar um curso específico como visível no site
-- UPDATE cursos SET visivel_no_site = true, tipo = 'lms' WHERE slug = 'seu-slug-aqui';

-- Para marcar todos os cursos publicados como visíveis no site (use com cautela):
-- UPDATE cursos SET visivel_no_site = true WHERE status = 'publicado';

-- ------------------------------------------------------------
-- VERIFICAÇÃO FINAL
-- Execute após a migration para confirmar os campos
-- ------------------------------------------------------------

SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('cursos', 'ferramentas_saas', 'recursos')
  AND column_name IN (
    'visivel_no_site', 'tipo', 'url_checkout', 'nivel',
    'ordem_vitrine', 'categoria', 'tipo_entrega', 'url_entrega'
  )
ORDER BY table_name, column_name;
