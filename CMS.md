# CMS.md — Painel Administrativo phdonassolo.com
## Especificação completa para implementação — Claude Code

> **Leia este documento junto com o REDESIGN.md.**
> Este documento especifica exclusivamente o painel administrativo (`#/admin`).
> Todas as regras gerais de stack, design system e arquitetura estão no REDESIGN.md.

---

## 1. VISÃO GERAL DO ADMIN

### 1.1 Princípio central
O admin permite que o Prof. Paulo edite **todo o conteúdo do site** sem tocar em código. Isso inclui textos, imagens, links, visibilidade de seções e ordem de exibição. A única exceção são cursos, vídeos e ferramentas — que são geridos diretamente no Supabase/LMS e não têm interface de edição no admin do site.

### 1.2 O que o admin NÃO faz
- Não edita cursos, vídeos ou ferramentas do Supabase
- Não acessa a área do aluno
- Não processa pagamentos
- Não modifica código ou configurações de deploy

### 1.3 Acesso
- Rota: `#/admin`
- Proteção: autenticação Firebase existente — manter intacta
- Login: `#/login` — manter intacto

### 1.4 Design do admin
Seguir o design system do REDESIGN.md:
- Fundo: `cream-dark`
- Tipografia: sistema (Cormorant Garamond + DM Sans + Space Mono)
- Paleta: navy/gold
- Manter UX familiar — não reinventar a navegação por tabs existente

---

## 2. ESTRUTURA DE TABS DO ADMIN

```
[ Conteúdo do Site ] [ Artigos e Mídia ] [ Leads ] [ Landing Pages ] [ Configurações ]
```

Tabs existentes reorganizadas e expandidas:
- **Conteúdo do Site** — editor de todas as páginas (substitui o SiteEditor atual)
- **Artigos e Mídia** — CRUD de artigos, vídeos (substitui o ContentManager atual)
- **Leads** — visualização de leads (mantém o LeadsManager atual)
- **Landing Pages** — CRUD de LPs dinâmicas (nova)
- **Configurações** — configurações globais do site (substitui a tab de Conexão API atual)

---

## 3. TAB: CONTEÚDO DO SITE

### 3.1 Navegação interna
A tab "Conteúdo do Site" tem um menu lateral com todas as páginas editáveis:

```
─ Home
─ Mentoria
─ Consultoria
─ Prof. Paulo
─ Serviços
─ Fale Comigo
─ Área do Aluno (pré-lançamento)
```

Ao selecionar uma página, o painel direito exibe os campos editáveis daquela página organizados por seção.

### 3.2 Padrão de edição por seção
Cada seção tem:
- **Toggle de visibilidade** — switch on/off que oculta/exibe a seção no site sem deletar conteúdo
- **Campos de conteúdo** — específicos de cada seção (detalhados abaixo)
- **Botão "Salvar seção"** — salva apenas aquela seção no Firestore
- **Botão "Pré-visualizar"** — abre o site em nova aba na página correspondente

### 3.3 Armazenamento
Todos os conteúdos editados pelo CMS são salvos no **Firebase Firestore**, coleção `site_content`, documento por página:
```
site_content/
  home
  mentoria
  consultoria
  prof_paulo
  servicos
  fale_comigo
  area_do_aluno
```

---

## 4. CAMPOS EDITÁVEIS — HOME

### Seção: Hero
```
visivel: boolean (toggle)
headline_linha1: string — "Sua equipe vende."
headline_linha2: string — "Mas poderia vender"
headline_destaque: string — "mais, e melhor." (exibido em gold)
tensao: string — texto em itálico com borda gold esquerda
subtexto: string — parágrafo abaixo da tensão
cta_primario_texto: string — "Conheça os Serviços"
cta_primario_link: string — rota ou URL
cta_secundario_texto: string — "Leia os Artigos"
cta_secundario_link: string
credencial_1_numero: string — "25+"
credencial_1_label: string — "Anos como Gestor Comercial"
credencial_2_numero: string — "20+"
credencial_2_label: string — "Anos como Professor MBA"
credencial_3_numero: string — "3"
credencial_3_label: string — "Livros Publicados"
foto_url: string — URL da imagem (com spec de upload: 1200×800px, JPG, máx 300kb)
foto_alt: string — texto alternativo para acessibilidade
```

### Seção: Metodologia
```
visivel: boolean
eyebrow: string — "A metodologia"
intro_texto: string — frase de abertura da seção
passo_1_num: string — "01"
passo_1_tag: string — "Fundação"
passo_1_titulo: string — "Pessoas"
passo_1_descricao: string
passo_2_num: string — "02"
passo_2_tag: string — "Estrutura"
passo_2_titulo: string — "Processos"
passo_2_descricao: string
passo_3_num: string — "03"
passo_3_tag: string — "Execução"
passo_3_titulo: string — "Gestão"
passo_3_descricao: string
passo_4_num: string — "04"
passo_4_tag: string — "Destino"
passo_4_titulo: string — "Resultados"
passo_4_descricao: string
```

### Seção: Autoridade (Quem é Prof. Paulo — resumo na home)
```
visivel: boolean
eyebrow: string
titulo_linha1: string — "25 anos no campo."
titulo_linha2: string — "20 anos na sala de aula."
titulo_linha3: string — "Ainda aprendendo."
narrativa_paragrafo_1: string (texto longo)
narrativa_paragrafo_2: string (texto longo)
citacao_texto: string
foto_url: string (spec: 800×1067px, proporção 3:4, JPG, máx 200kb)
foto_alt: string
```

### Seção: Situações (Você se reconhece?)
```
visivel: boolean
eyebrow: string — "Você se reconhece?"
titulo: string
subtitulo: string
situacao_1_marker: string — "Gestão Comercial"
situacao_1_titulo: string
situacao_1_descricao: string
situacao_2_marker: string — "Empreendedor"
situacao_2_titulo: string
situacao_2_descricao: string
situacao_3_marker: string — "Profissional de Vendas"
situacao_3_titulo: string
situacao_3_descricao: string
situacao_4_marker: string — "Liderança"
situacao_4_titulo: string
situacao_4_descricao: string
```

### Seção: Serviços (cards 01–04)
```
visivel: boolean
eyebrow: string
titulo: string
subtitulo: string
servico_1_titulo: string — "Mentoria"
servico_1_descricao: string
servico_1_link_texto: string
servico_1_link_url: string
servico_2_titulo: string — "Consultoria"
servico_2_descricao: string
servico_2_link_texto: string
servico_2_link_url: string
servico_3_titulo: string — "Cursos e Formações"
servico_3_descricao: string
servico_3_link_texto: string
servico_3_link_url: string
servico_4_titulo: string — "Conteúdo"
servico_4_descricao: string
servico_4_link_texto: string
servico_4_link_url: string
servico_4_tag: string — "Acesso gratuito"
```

### Seção: Conteúdo Recente
```
visivel: boolean
eyebrow: string
titulo: string
link_ver_todos_texto: string
link_ver_todos_url: string
// Os artigos exibidos vêm do Firebase automaticamente (3 mais recentes)
// Não há campos de conteúdo manual aqui
```

### Seção: Newsletter
```
visivel: boolean
eyebrow: string — "Newsletter"
titulo_linha1: string — "Gestão comercial"
titulo_destaque: string — "na prática" (em itálico)
subtexto: string
botao_texto: string — "Quero receber"
nota_privacidade: string — "Sem spam. Cancelamento em um clique."
```

### Seção: Recursos
```
visivel: boolean
recurso_1_marker: string — "Plataforma"
recurso_1_titulo: string — "Área do Aluno"
recurso_1_descricao: string
recurso_1_link_texto: string
recurso_1_link_url: string
recurso_2_marker: string — "Cursos Online"
recurso_2_titulo: string — "Udemy & ESPM"
recurso_2_descricao: string
recurso_2_link_texto: string
recurso_2_link_url: string
recurso_3_marker: string — "Publicações"
recurso_3_titulo: string — "Livros na Amazon"
recurso_3_descricao: string
recurso_3_link_texto: string
recurso_3_link_url: string
```

### Seção: CTA Final
```
visivel: boolean
eyebrow: string — "Próximo passo"
titulo_linha1: string — "Vamos conversar sobre"
titulo_destaque: string — "o seu desafio?" (em itálico)
subtexto: string
cta_primario_texto: string — "Fale Comigo"
cta_primario_link: string
cta_secundario_texto: string — "Conheça os serviços"
cta_secundario_link: string
```

---

## 5. CAMPOS EDITÁVEIS — MENTORIA

### Seção: Hero
```
visivel: boolean
eyebrow: string — "Mentoria Comercial"
titulo_linha1: string
titulo_linha2: string
titulo_destaque: string — (em itálico/gold)
subtexto: string
cta_primario_texto: string
cta_primario_link: string
cta_secundario_texto: string
cta_secundario_link: string
card_label: string — "O programa em números"
card_stat_1_numero: string — "90"
card_stat_1_titulo: string — "Dias de programa"
card_stat_1_descricao: string
card_stat_2_numero: string — "12"
card_stat_2_titulo: string — "Sessões individuais"
card_stat_2_descricao: string
card_stat_3_numero: string — "04"
card_stat_3_titulo: string — "Fases estruturadas"
card_stat_3_descricao: string
card_stat_4_numero: string — "∞"
card_stat_4_titulo: string — "Suporte WhatsApp"
card_stat_4_descricao: string
```

### Seção: Problema
```
visivel: boolean
eyebrow: string
titulo: string
problema_1: string
problema_2: string
problema_3: string
problema_4: string
problema_5: string
citacao_texto: string
```

### Seção: Para quem é
```
visivel: boolean
eyebrow: string
titulo: string
para_quem_1: string
para_quem_2: string
para_quem_3: string
para_quem_4: string
para_quem_5: string
nao_para_quem_titulo: string
nao_para_quem_1: string
nao_para_quem_2: string
nao_para_quem_3: string
nao_para_quem_4: string
card_resultado_label: string
card_resultado_titulo: string
card_resultado_subtexto: string
card_stat_1_numero: string
card_stat_1_label: string
card_stat_2_numero: string
card_stat_2_label: string
card_stat_3_numero: string
card_stat_3_label: string
```

### Seção: Como funciona (4 fases)
```
visivel: boolean
eyebrow: string
titulo: string
subtexto: string
fase_1_nome: string — "Diagnóstico"
fase_1_semanas: string — "Semanas 1 a 3"
fase_1_descricao: string
fase_1_entregavel: string
fase_2_nome: string — "Plano"
fase_2_semanas: string
fase_2_descricao: string
fase_2_entregavel: string
fase_3_nome: string — "Implementação"
fase_3_semanas: string
fase_3_descricao: string
fase_3_entregavel: string
fase_4_nome: string — "Consolidação"
fase_4_semanas: string
fase_4_descricao: string
fase_4_entregavel: string
```

### Seção: Inclusos
```
visivel: boolean
eyebrow: string
titulo: string
incluso_1: string
incluso_2: string
incluso_3: string
incluso_4: string
incluso_5: string
incluso_6: string
resumo_label: string
resumo_stat_1_numero: string
resumo_stat_1_titulo: string
resumo_stat_1_descricao: string
resumo_stat_2_numero: string
resumo_stat_2_titulo: string
resumo_stat_2_descricao: string
resumo_stat_3_numero: string
resumo_stat_3_titulo: string
resumo_stat_3_descricao: string
resumo_stat_4_numero: string
resumo_stat_4_titulo: string
resumo_stat_4_descricao: string
```

### Seção: Mentoria Customizada
```
visivel: boolean
eyebrow: string
titulo: string
intro_texto: string
card_1_num: string
card_1_titulo: string — "Mentoria Individual Personalizada"
card_1_descricao: string
card_1_tags: string[] — array de tags
card_2_num: string
card_2_titulo: string — "Mentoria em Grupo"
card_2_descricao: string
card_2_tags: string[]
card_3_num: string
card_3_titulo: string — "Projeto Corporativo"
card_3_descricao: string
card_3_tags: string[]
cta_texto_frase: string
cta_botao_texto: string
cta_botao_link: string
```

### Seção: Sobre o Mentor
```
visivel: boolean
eyebrow: string
titulo_linha1: string
titulo_destaque: string
timeline: array — gerido pela coleção Firebase `timeline_items` (CRUD na tab Artigos e Mídia)
citacao_texto: string
card_nome: string — "Prof. Paulo H. Donassolo"
card_subtitulo: string
card_item_1: string
card_item_2: string
card_item_3: string
card_item_4: string
card_item_5: string
```

### Seção: FAQ
```
visivel: boolean
// FAQ é gerido como array no Firestore
// Interface: lista de pares pergunta/resposta com botões adicionar, editar, excluir, reordenar
faq: Array<{ pergunta: string; resposta: string; ordem: number }>
```

### Seção: CTA Final
```
visivel: boolean
eyebrow: string
titulo_linha1: string
titulo_destaque: string
subtexto: string
nota: string — "Sem compromisso. Sem custo."
cta_primario_texto: string — "Agendar diagnóstico gratuito"
cta_primario_link: string
cta_secundario_texto: string
cta_secundario_link: string
```

---

## 6. CAMPOS EDITÁVEIS — CONSULTORIA

Seguir a mesma lógica da Mentoria. Seções editáveis:

```
Hero
Problema (5 itens + citação)
Frentes de atuação (6 cards — título + descrição cada)
Método (5 etapas — nome, tag, descrição, entregável cada)
Para quem (5 itens + card de setores com tags)
Diferencial (4 pontos — título + descrição cada + citação)
FAQ (array pergunta/resposta)
CTA Final
```

Para cada seção: toggle visível + todos os campos de texto + imagens onde aplicável.

---

## 7. CAMPOS EDITÁVEIS — PROF. PAULO

### Seção: Hero
```
visivel: boolean
eyebrow: string
titulo_linha1: string — "25 anos no campo."
titulo_linha2: string — "20 anos na sala de aula."
titulo_linha3: string — "Ainda aprendendo."
citacao_texto: string
credencial_1_numero: string
credencial_1_label: string
credencial_2_numero: string
credencial_2_label: string
credencial_3_numero: string
credencial_3_label: string
foto_url: string (spec: 800×1067px, proporção 3:4, JPG, máx 200kb)
foto_alt: string
```

### Seção: Narrativa
```
visivel: boolean
eyebrow: string
titulo: string
paragrafo_1: string (texto longo)
paragrafo_2: string (texto longo)
paragrafo_3: string (texto longo)
paragrafo_4: string (texto longo)
pullquote_texto: string
pullquote_citacao: string
```

### Seção: Linha do Tempo
```
visivel: boolean
eyebrow: string
titulo: string
// Itens geridos pela coleção Firebase `timeline_items`
// Interface no CMS: lista com botões adicionar, editar, excluir, reordenar
// Campos por item: ano, tag, titulo, descricao, destaque (boolean), ordem
```

### Seção: Filosofia + Formação
```
visivel: boolean
eyebrow: string
titulo: string
pilar_1_numero: string
pilar_1_titulo: string — "Prática → Conceito → Prática"
pilar_1_descricao: string
pilar_2_numero: string
pilar_2_titulo: string
pilar_2_descricao: string
pilar_3_numero: string
pilar_3_titulo: string
pilar_3_descricao: string
pilar_4_numero: string
pilar_4_titulo: string
pilar_4_descricao: string
citacao_texto: string
formacao_label: string
formacao_item_1_badge: string — "MSc"
formacao_item_1_titulo: string
formacao_item_1_descricao: string
formacao_item_2_badge: string — "MBA"
formacao_item_2_titulo: string
formacao_item_2_descricao: string
formacao_item_3_badge: string — "MBA"
formacao_item_3_titulo: string
formacao_item_3_descricao: string
formacao_item_4_badge: string — "IEFP"
formacao_item_4_titulo: string
formacao_item_4_descricao: string
formacao_item_5_badge: string — "IA"
formacao_item_5_titulo: string
formacao_item_5_descricao: string
```

### Seção: Onde Leciona
```
visivel: boolean
eyebrow: string
titulo: string
subtexto: string
inst_1_tipo: string — "MBA e Pós-graduação"
inst_1_nome: string — "ESPM"
inst_1_descricao: string
inst_2_tipo: string
inst_2_nome: string — "Unisinos"
inst_2_descricao: string
inst_3_tipo: string
inst_3_nome: string — "In-company"
inst_3_descricao: string
```

### Seção: Livros
```
visivel: boolean
eyebrow: string
titulo: string
subtexto: string
livro_1_numero: string
livro_1_titulo: string
livro_1_descricao: string
livro_1_link_amazon: string
livro_1_capa_url: string (spec: 400×600px, proporção 2:3, JPG/PNG, máx 100kb)
livro_2_numero: string
livro_2_titulo: string
livro_2_descricao: string
livro_2_link_amazon: string
livro_2_capa_url: string
livro_3_numero: string
livro_3_titulo: string
livro_3_descricao: string
livro_3_link_amazon: string
livro_3_capa_url: string
```

### Seção: CTA Final
```
visivel: boolean
eyebrow: string
titulo: string
subtexto: string
cta_primario_texto: string
cta_primario_link: string
cta_secundario_texto: string
cta_secundario_link: string
```

---

## 8. CAMPOS EDITÁVEIS — SERVIÇOS

```
Hero:
  eyebrow, titulo_linha1, titulo_linha2, titulo_destaque, subtexto

Intro:
  eyebrow, titulo, intro_texto
  card_como_escolher_label: string
  opcao_1_titulo, opcao_1_descricao
  opcao_2_titulo, opcao_2_descricao
  opcao_3_titulo, opcao_3_descricao
  opcao_4_titulo, opcao_4_descricao

Cards dos 4 serviços (cada um):
  numero, tipo_label, titulo, descricao
  tags: string[]
  link_texto, link_url

Comparativo (4 colunas):
  col_1_titulo e col_1_itens: string[]
  col_2_titulo e col_2_itens: string[]
  col_3_titulo e col_3_itens: string[]
  col_4_titulo e col_4_itens: string[]

CTA Final:
  eyebrow, titulo, subtexto
  cta_primario_texto, cta_primario_link
  cta_secundario_texto, cta_secundario_link
```

Cada bloco tem toggle `visivel`.

---

## 9. CAMPOS EDITÁVEIS — FALE COMIGO

```
Hero:
  eyebrow, titulo_linha1, titulo_destaque, subtexto

Formulário:
  opcoes_assunto: string[] — lista editável de opções do select
  mensagem_sucesso: string — exibida após envio

WhatsApp card:
  numero_whatsapp: string — ex: "351999999999"
  horario_atendimento: string

Email card:
  email_contato: string

Localização card:
  cidade: string
  descricao_atendimento: string

Seção "O que esperar":
  visivel: boolean
  etapa_1_titulo, etapa_1_descricao
  etapa_2_titulo, etapa_2_descricao
  etapa_3_titulo, etapa_3_descricao
  etapa_4_titulo, etapa_4_descricao

FAQ:
  visivel: boolean
  faq: Array<{ pergunta: string; resposta: string; ordem: number }>
```

---

## 10. CAMPOS EDITÁVEIS — ÁREA DO ALUNO (pré-lançamento)

```
eyebrow: string — "Área do Aluno"
titulo: string — "Em breve. Muito em breve."
subtitulo: string — "A plataforma...estará disponível até o final de junho de 2026."
paragrafo: string
botao_texto: string — "Quero ser avisado"
nota_privacidade: string
mensagem_confirmacao: string — exibida após cadastro
lms_liberado: boolean — quando true, redireciona para aluno.phdonassolo.com
url_lms: string — "https://aluno.phdonassolo.com"
```

---

## 11. TAB: ARTIGOS E MÍDIA

### 11.1 Sub-tabs
```
[ Artigos ] [ Vídeos ] [ Linha do Tempo ]
```

### 11.2 Artigos — CRUD completo
Campos por artigo:
```
titulo: string
slug: string (gerado automaticamente do título, editável)
subtitulo: string (opcional)
conteudo: rich text (editor WYSIWYG simples — bold, italic, headings, listas, links, blockquote)
thumbnail_url: string (spec: 1200×630px, proporção 1.91:1, JPG, máx 200kb)
thumbnail_alt: string
tipo: 'artigo' (fixo)
tema: select — Vendas | Gestão | Liderança | Negociação | Carreira
pilar: select — Prof. Paulo | Academia do Gás | Sou Consultor Imobiliário | 4050 ou Mais
data_publicacao: date picker
publicado: boolean
destaque: boolean — se true, aparece como item principal na view editorial
cta_tipo: select — mentoria | consultoria | cursos | conteudo | nenhum
  // define qual CTA aparece no rodapé do artigo
ordem: number (para controle manual se necessário)
```

**Listagem:** tabela com colunas título, tema, pilar, data, publicado (toggle), destaque (toggle). Ordenável por data. Buscável por título.

### 11.3 Vídeos — CRUD completo
Campos por vídeo:
```
titulo: string
descricao: string
url_embed: string — URL do YouTube ou Instagram (ex: https://youtube.com/watch?v=...)
thumbnail_url: string (spec: 1280×720px, proporção 16:9, JPG, máx 150kb)
  // se não fornecida, usar thumbnail automática do YouTube
tema: select — mesmo do artigo
pilar: select — mesmo do artigo
data_publicacao: date picker
publicado: boolean
```

### 11.4 Linha do Tempo — CRUD da coleção `timeline_items`
```
Interface: lista ordenável com drag-and-drop de ordem
Campos por item:
  ano: string — ex: "1998–hoje", "2005"
  tag: string — ex: "Início da carreira comercial"
  titulo: string
  descricao: string (texto longo)
  destaque: boolean — dot maior, tratamento visual diferenciado
  ordem: number (controlado pelo drag-and-drop)
```

---

## 12. TAB: LEADS

### 12.1 Visualização
Manter o `LeadsManager` existente com novo design aplicado.

### 12.2 Expansão — filtros por tipo
Adicionar filtro por `tipo` de lead:
- `contato` — formulário Fale Comigo
- `newsletter` — cadastro de newsletter
- `pre_lancamento_lms` — cadastro pré-lançamento Área do Aluno
- `ferramenta` — captura de lead para acesso a ferramenta (com campo `ferramenta` indicando qual)

### 12.3 Exportação
Adicionar botão "Exportar CSV" que gera arquivo com todos os leads filtrados.

### 12.4 Campos exibidos na tabela
```
data, nome, email, tipo, ferramenta (se aplicável), origem (página onde captado)
```

---

## 13. TAB: LANDING PAGES

### 13.1 CRUD completo de LPs dinâmicas
As LPs são acessadas via `#/lp/:slug`. O slug é definido no cadastro.

### 13.2 Campos por LP
```
slug: string — identificador único na URL (ex: "mentoria-janeiro-2026")
  // validação: apenas letras minúsculas, números e hífens
titulo: string — título principal da LP
subtitulo: string (opcional)
descricao: string — texto de apresentação
cta_texto: string — texto do botão principal
cta_link: string — link do CTA (pode ser Hotmart, WhatsApp, formulário interno)
cta_tipo: select — hotmart | whatsapp | formulario_interno
imagem_url: string (spec: 1200×630px, JPG, máx 300kb)
cor_destaque: string — código hex (padrão: gold do sistema)
publicada: boolean
data_expiracao: date (opcional) — após esta data, redireciona para home
// se cta_tipo = formulario_interno: salvar lead no Firebase com tipo: 'lp_[slug]'
meta_title: string — para SEO
meta_description: string
```

### 13.3 Listagem
Tabela com colunas: slug, título, publicada (toggle), data expiração, acessos (contador simples).

---

## 14. TAB: CONFIGURAÇÕES

### 14.1 Dados globais do site
```
nome_site: string — "Prof. Paulo H. Donassolo"
tagline: string — "Mentoria · Consultoria · Cursos e Formações · Conteúdo"
email_contato: string
numero_whatsapp: string — ex: "351999999999" (sem + e sem espaços)
linkedin_url: string
youtube_url: string
instagram_url: string
```

### 14.2 LMS
```
lms_liberado: boolean
  // quando false: botão "Área do Aluno" no nav linka para #/area-do-aluno
  // quando true: botão linka para url_lms
url_lms: string — "https://aluno.phdonassolo.com"
previsao_lancamento: string — "junho de 2026"
```

### 14.3 Rodapé
```
copyright_texto: string — "© 2025 Prof. Paulo H. Donassolo · Todos os direitos reservados"
assinatura: string — "Pessoas · Processos · Gestão · Resultados"
links_legais: Array<{ texto: string; url: string }> — ex: Privacidade, Termos
```

### 14.4 SEO padrão (usado como fallback em páginas sem meta própria)
```
og_titulo_padrao: string
og_descricao_padrao: string
og_imagem_url: string (spec: 1200×630px, JPG, máx 300kb)
```

### 14.5 Newsletter
```
// Configurações da integração de newsletter (se houver serviço externo)
// Por ora: captura apenas para Firebase
newsletter_ativa: boolean
newsletter_mensagem_confirmacao: string
```

---

## 15. UPLOAD DE IMAGENS — REGRAS GERAIS

### 15.1 Comportamento de upload
- Upload direto para Firebase Storage
- Retornar URL pública após upload
- Exibir preview da imagem após seleção
- Mostrar spec de tamanho/formato como texto de ajuda abaixo do campo

### 15.2 Texto de ajuda por tipo de imagem
Exibir abaixo de cada campo de imagem:

| Campo | Texto de ajuda |
|---|---|
| Foto Prof. Paulo (hero/perfil) | `Recomendado: 800×1067px · Proporção 3:4 · JPG · Máx 200kb` |
| Foto hero do site | `Recomendado: 1200×800px · Proporção 3:2 · JPG · Máx 300kb` |
| Capa de livro | `Recomendado: 400×600px · Proporção 2:3 · JPG ou PNG · Máx 100kb` |
| Thumbnail de artigo | `Recomendado: 1200×630px · Proporção 1.91:1 · JPG · Máx 200kb` |
| Thumbnail de vídeo | `Recomendado: 1280×720px · Proporção 16:9 · JPG · Máx 150kb` |
| Logo de instituição | `Recomendado: 240×80px · PNG com fundo transparente · Máx 50kb` |
| Imagem OG / Redes sociais | `Recomendado: 1200×630px · Proporção 1.91:1 · JPG · Máx 300kb` |
| Capa de curso | `Recomendado: 800×450px · Proporção 16:9 · JPG · Máx 150kb` |
| Imagem de LP | `Recomendado: 1200×630px · JPG · Máx 300kb` |

### 15.3 Validação
- Não validar automaticamente dimensões (pode ser feito manualmente)
- Validar apenas tamanho máximo do arquivo — alertar se exceder, mas não bloquear
- Formatos aceitos: JPG, PNG, WebP

---

## 16. ESTRUTURA FIREBASE — COLEÇÕES DO CMS

```
Firestore:
├── site_content/          — conteúdo editável de cada página
│   ├── home               — documento com todos os campos da home
│   ├── mentoria
│   ├── consultoria
│   ├── prof_paulo
│   ├── servicos
│   ├── fale_comigo
│   └── area_do_aluno
│
├── timeline_items/        — itens da linha do tempo (coleção separada para reordenação)
│   └── [id]               — { ano, tag, titulo, descricao, destaque, ordem }
│
├── artigos/               — artigos do blog (existente — verificar estrutura atual)
│   └── [id]
│
├── videos/                — vídeos (existente — verificar estrutura atual)
│   └── [id]
│
├── landing_pages/         — LPs dinâmicas
│   └── [slug]
│
├── leads/                 — todos os leads (existente — expandir com campo tipo)
│   └── [id]               — { nome, email, tipo, ferramenta?, data, origem? }
│
└── site_config/           — configurações globais (existente como localStorage — migrar)
    └── config             — documento único com todas as configurações
```

---

## 17. CRITÉRIOS DE ACEITAÇÃO DO CMS

- [ ] Todas as seções de todas as páginas têm toggle de visibilidade funcional
- [ ] Alterações salvas no Firestore aparecem no site sem deploy
- [ ] Upload de imagem funciona e retorna URL
- [ ] Texto de ajuda de spec aparece em todos os campos de imagem
- [ ] CRUD de artigos completo (criar, editar, publicar, despublicar, excluir)
- [ ] CRUD de vídeos completo
- [ ] CRUD de timeline_items com reordenação
- [ ] CRUD de landing pages completo com validação de slug
- [ ] Leads filtráveis por tipo e exportáveis em CSV
- [ ] Configurações globais salvas e refletidas no site
- [ ] `lms_liberado` controlável pelo admin — altera comportamento do botão nav
- [ ] `handleSave` usa Firestore — não usa `localStorage`
- [ ] SiteEditor não está duplicado no AdminPage
- [ ] Admin responsivo: funcional em tablet (768px mínimo)
- [ ] Admin protegido por autenticação Firebase

---

*Documento gerado para implementação pelo Claude Code.*
*Versão: 1.0 — Junho 2025*
*Usar em conjunto com: REDESIGN.md*
*Projeto: phdonassolo.com redesign*
