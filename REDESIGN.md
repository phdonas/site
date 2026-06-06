# REDESIGN.md — phdonassolo.com
## Spec completa para implementação — Claude Code

> **Leia este documento inteiro antes de escrever qualquer linha de código.**
> Este documento é o contrato de implementação. Qualquer decisão não coberta aqui deve ser perguntada antes de ser assumida.

---

## 1. CONTEXTO E REGRAS GERAIS

### 1.1 O que este projeto é
Redesign completo do site `phdonassolo.com` — site profissional do Prof. Paulo H. Donassolo, consultor, mentor e professor de gestão comercial. O site é uma vitrine de serviços e autoridade profissional, não um sistema transacional.

### 1.2 O que NÃO está no escopo
- **Área do Aluno** (`area-do-aluno/`) — existe no projeto mas está fora do escopo deste redesign. Leia os arquivos para entender o contexto, mas não modifique nada nessa pasta.
- **Banco de dados Supabase** — o site apenas lê. Nunca escreve, nunca modifica schemas, nunca altera RLS policies.
- **Integração com Hotmart** — está prevista mas é a última fase. Não implemente até chegar na Fase 3.

### 1.3 Stack do projeto
- React + Vite + TypeScript
- Tailwind CSS
- Firebase / Firestore (backend do site — artigos, leads, auth, configurações)
- Supabase (backend do LMS — leitura apenas pelo site)
- Roteamento por hash (`#/pagina`)
- Deploy via GitHub Actions + FTP para Hostgator

### 1.4 Regra de leitura obrigatória antes de implementar
Antes de criar qualquer componente ou página, leia:
1. `src/App.tsx` — mapa de rotas existentes
2. `src/services/dataService.ts` — como o Firebase é consumido hoje
3. `src/components/admin/ContentManager.tsx` — CRUD de conteúdo existente
4. `src/components/admin/SiteEditor.tsx` — editor visual existente
5. `src/contexts/SiteConfigContext.tsx` — schema de configuração do site
6. `src/config/site-config.ts` — configurações globais
7. `area-do-aluno/` — leia os arquivos `.tsx`, `.ts` e `.jsx` para entender o LMS. **Não leia schemas ou blueprints — podem estar desatualizados.**
8. `.env` e `.env.example` — variáveis de ambiente existentes e padrão de nomenclatura

### 1.5 Wireframes de referência
Os wireframes HTML aprovados estão em `docs/wireframes/`. Use-os como referência visual para cada página. O design system está completamente definido neste documento — os wireframes mostram o resultado visual esperado.

---

## 2. DESIGN SYSTEM

### 2.1 Identidade visual — Editorial de Campo
O design combina disciplina editorial (referência Apple) com calor e textura (referência Moleskine). Não é minimalismo frio, não é maximalistmo ornamental. É sofisticação acessível para gestores e empreendedores de PMEs.

### 2.2 Tokens de design — adicionar ao `tailwind.config.js`

```js
colors: {
  cream: {
    DEFAULT: '#F3EFE6',
    dark: '#EAE3D5',
    deep: '#DDD4BF',
  },
  ink: {
    DEFAULT: '#17130E',
    mid: '#3A3025',
    light: '#6B5E50',
  },
  navy: {
    DEFAULT: '#0C1824',
    mid: '#122030',
  },
  gold: {
    DEFAULT: '#A87828',
    light: '#C8983C',
    pale: '#EDE0C0',
  },
}
```

### 2.3 Tipografia — adicionar ao `tailwind.config.js`

```js
fontFamily: {
  display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
  body: ['"DM Sans"', 'sans-serif'],
  mono: ['"Space Mono"', 'monospace'],
}
```

Adicionar ao `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@400;500;600&family=Space+Mono&display=swap" rel="stylesheet">
```

### 2.4 Regras tipográficas
- **Títulos de seção**: `font-display`, mínimo `text-4xl`, `font-bold`, `tracking-tight`
- **Eyebrows (labels de seção)**: `font-mono`, `text-xs`, `tracking-widest`, `uppercase`, `text-gold`, sempre com linha decorativa antes (`::before`)
- **Corpo**: `font-body`, `text-[17px]`, `leading-relaxed`
- **Labels e tags**: `font-mono`, `text-[10px]` a `text-xs`, `tracking-widest`, `uppercase`
- **"Prof. Paulo H. Donassolo"**: sempre `font-bold` em qualquer contexto

### 2.5 Regras de layout
- Container máximo: `max-w-[1240px] mx-auto px-[5vw]`
- Padding de seção padrão: `py-24` (reduzido de `py-36` original)
- **Transições entre seções**: usar divs separadas sem conteúdo (`aria-hidden="true"`) para gradientes de transição. NUNCA colocar texto dentro de zonas de gradiente — gera problema de contraste ilegível.

Exemplo de div de transição:
```tsx
<div className="h-24 bg-gradient-to-b from-navy to-cream-dark" aria-hidden="true" />
```

### 2.6 Elementos visuais obrigatórios

**Fio condutor vertical** — linha gold fixa à esquerda que percorre toda a página:
```tsx
// components/FioCondutor.tsx
// Linha fixed, left: calc(5vw - 1px), z-index: 50
// Gradiente: transparent → gold → transparent
// Nó dourado que acompanha o scroll via JS
```

**Grain texture** — aplicar via CSS no `body::before`, opacidade 2.5%, SVG inline com `feTurbulence`.

**Scroll reveal** — `IntersectionObserver` com `threshold: 0.1`. Classes: `opacity-0 translate-y-6` → `opacity-100 translate-y-0` com `transition-all duration-700`.

**Nav com sombra ao scroll** — adicionar `shadow-md` via JS quando `window.scrollY > 40`.

### 2.7 Componentes de interação
- **Hover em cards de serviço**: `translateY(-8px)` + `shadow-2xl` + linha gold no topo via `::before scaleX(0 → 1)`
- **Hover em links**: underline gold que expande da esquerda
- **Botão primário**: fundo gold, texto ink, hover gold-light + translateY(-2px)
- **Botão outline**: borda navy, hover fundo navy + texto cream
- **FAQ accordion**: abrir/fechar com `max-height` transition, ícone `+` rotaciona 45deg

---

## 3. ARQUITETURA DE PÁGINAS E ROTAS

### 3.1 Mapa de rotas — atualizar `App.tsx`

| Rota hash | Componente | Tipo |
|---|---|---|
| `#/` | `HomePage` | Redesenhar |
| `#/prof-paulo` | `ProfPauloPage` | Nova |
| `#/servicos` | `ServicosPage` | Nova |
| `#/mentoria` | `MentoriaPage` | Redesenhar |
| `#/consultoria` | `ConsultoriaPage` | Nova |
| `#/cursos` | `CursosPage` | Nova |
| `#/curso/:id` | `CursoVendaPage` | Nova |
| `#/conteudo` | `ConteudoPage` | Redesenhar |
| `#/artigo/:id` | `ArtigoPage` | Redesenhar |
| `#/recursos` | `RecursosPage` | Nova |
| `#/fale-comigo` | `FaleComigo` | Nova |
| `#/admin` | `AdminPage` | Redesenhar (manter funcional) |
| `#/login` | `LoginPage` | Redesenhar (manter funcional) |
| `#/privacy` | `PrivacyPage` | Aplicar novo design |
| `#/terms` | `TermsPage` | Aplicar novo design |
| `#/lp/:slug` | `LandingPage` | Redesenhar (manter dinâmica) |
| `#/em-breve` | `EmBrevePage` | Nova — placeholder simples |
| `#/area-do-aluno` | `AreaAlunoPage` | Nova — captura de cadastro pré-lançamento |

### 3.2 Navegação principal
```
Nav: Prof. Paulo | Serviços | Cursos | Conteúdo | [Fale Comigo] | [Área do Aluno]
```
- "Fale Comigo" — botão com borda navy
- "Área do Aluno" — botão com borda gold, `font-mono`. **Comportamento condicional:**
  - Enquanto LMS não estiver liberado: linka para `#/area-do-aluno` (página de captura)
  - Após liberação: linka para `aluno.phdonassolo.com` (externo)
  - Controlar via flag `lms_liberado: boolean` no `site-config.ts`
- "Serviços" — sem dropdown, linka para `#/servicos`
- Nav é `position: fixed`, `backdrop-blur`, `height: 62px`
- Logo: "Prof. Paulo H. Donassolo" — `font-display font-bold`

---

## 4. ESPECIFICAÇÃO POR PÁGINA

### 4.1 HomePage (`#/`)
Referência visual: `docs/wireframes/phdonassolo-home-v3.html`

**Seções em ordem:**
1. **Hero** — headline "Sua equipe vende. Mas poderia vender mais, e melhor." + tensão + sub + CTAs + credenciais (25+, 20+, 3). Lado direito: área para foto contextual (placeholder até foto real) com overlay de transparência
2. **Metodologia** — fundo navy. 4 passos: Pessoas → Processos → Gestão → Resultados. Dots numerados 80×80px com borda gold e box-shadow duplo. Linha conectora 3px com gradiente horizontal. Seta `›` entre passos
3. **Autoridade** — fundo cream-dark. Narrativa + timeline (4 itens) + citação. Foto contextual pequena com moldura geométrica
4. **Situações** — grid 2×2 com 4 cenários reais. Cards com hover translateY e canto geométrico decorativo
5. **Serviços** — 4 cards: Mentoria, Consultoria, Cursos e Formações, Conteúdo. Números 01–04 em gold visível. Hover: card sobe, fundo branco, linha gold cresce no topo
6. **Conteúdo recente** — layout assimétrico: 1 destaque grande + 2 secundários
7. **Newsletter** — fundo navy. Nome + e-mail + botão. Captura para Firebase (`leads` collection)
8. **Recursos** — 3 cards: Área do Aluno, Cursos Udemy, Livros Amazon
9. **CTA final** — fundo navy. "Vamos conversar sobre o seu desafio?"
10. **Footer** — 4 colunas + copyright + "Pessoas · Processos · Gestão · Resultados"

**Controle CMS via SiteEditor:** cada seção tem flag `visible: boolean` no `SiteConfigContext`. Adicionar ao schema: `hero`, `metodologia`, `autoridade`, `situacoes`, `servicos`, `conteudo`, `newsletter`, `recursos`.

---

### 4.2 MentoriaPage (`#/mentoria`)
Referência visual: `docs/wireframes/phdonassolo-mentoria.html`

**Seções:** Hero navy → Problema (6 itens + citação) → Para quem é / Não é para quem → Como funciona (4 fases conectadas verticalmente, mesma lógica da metodologia da home) → Inclusos (lista + resumo visual) → Mentoria Customizada (3 cards: Individual, Grupo, Corporativo) → Sobre o mentor (timeline) → FAQ (accordion) → CTA "Diagnóstico gratuito de 30 minutos"

**Fases conectadas:** linha vertical gold `left: 39px`, dots 80×80px com box-shadow, fase 04 com tratamento visual diferenciado (destino).

---

### 4.3 ConsultoriaPage (`#/consultoria`)
Referência visual: `docs/wireframes/phdonassolo-consultoria.html`

**Seções:** Hero navy → Problema (5 itens + card de credibilidade) → Frentes de atuação (6 cards 3×2) → Método (5 etapas verticais: Investigação, Diagnóstico, Plano, Implementação, Consolidação) → Para quem + card de setores → Diferencial (4 pontos + citação) → FAQ → CTA "Agendar conversa inicial"

**Nota no método:** "Este é o método central — não um produto fechado. A duração e as frentes são definidas após o diagnóstico."

---

### 4.4 ProfPauloPage (`#/prof-paulo`)
Referência visual: `docs/wireframes/phdonassolo-prof-paulo.html`

**Seções:** Hero navy (25 anos / 20 anos / ainda aprendendo) → Narrativa editorial (texto corrido 4 parágrafos + pull quote) → Linha do tempo (6 marcos: 1998, 2000–2008, 2005, 2010–2018, 2018–2022, 2022–hoje) → Filosofia + Formação acadêmica → Onde leciona (3 cards: ESPM, Unisinos, In-company) → Livros (3 cards navy + link Amazon) → CTA

**Linha do tempo — dados editáveis no Firebase:**
Criar coleção `timeline_items` com campos:
- `ano: string`
- `tag: string`
- `titulo: string`
- `descricao: string`
- `destaque: boolean`
- `ordem: number`

Adicionar CRUD desta coleção no `ContentManager`.

**Especificações de imagem para o CMS:**
- Foto contextual Prof. Paulo: 800×1067px, proporção 3:4, JPG, máx 200kb, foco no rosto no terço superior
- Capas de livros: 400×600px, proporção 2:3, JPG/PNG, máx 100kb
- Foto hero (se usada): 1200×800px, proporção 3:2, JPG, máx 300kb

---

### 4.5 ServicosPage (`#/servicos`)
Referência visual: `docs/wireframes/phdonassolo-servicos.html`

**Seções:** Hero navy com índice de navegação (4 links âncora) → Intro + card "Como escolher" → Lista dos 4 serviços (layout horizontal 3 colunas por card) → Comparativo 4×4 em navy → CTA

**Cards de serviço:** layout grid `grid-cols-[1fr_2fr_1fr]` — número+tipo | título+desc+tags | link. Hover: borda gold à esquerda cresce verticalmente.

---

### 4.6 CursosPage (`#/cursos`) — Vitrine
Referência visual: `docs/wireframes/phdonassolo-cursos-vitrine.html`

**Dados via Supabase** — leitura apenas. Ver Seção 6 para detalhes da integração.

**REGRA CRÍTICA DE FILTRAGEM:** o site NUNCA exibe conteúdo com `visivel_no_site = false`. Esta flag é independente de `publicado` — um curso pode estar publicado e ativo no LMS mas não deve aparecer na vitrine pública do site. A query Supabase SEMPRE inclui `.eq('visivel_no_site', true)`. Sem exceção.

Exemplos de uso desta flag:
- Curso em rascunho → `publicado: false, visivel_no_site: false`
- Curso exclusivo do LMS (não vendido pelo site) → `publicado: true, visivel_no_site: false`
- Curso disponível no site → `publicado: true, visivel_no_site: true`
- Material interno apenas para alunos → `visivel_no_site: false`

**Seções:** Hero navy com stats dinâmicos (contadores do Supabase — apenas `visivel_no_site: true`) → Barra de filtros sticky (Categoria + Acesso + Plataforma) → Seção LMS próprio → Seção Udemy → Seção ESPM → In-company → Footer

**Filtros:** cliente — filtram os cards já carregados, sem nova requisição.

**Três tipos de card:**
- `tipo: 'lms'` — botão "Ver o curso" → `#/curso/:id`
- `tipo: 'udemy'` — botão "Ver na Udemy ↗" → link externo
- `tipo: 'espm'` — botão "Ver na ESPM ↗" → link externo

**Cursos gratuitos:** tag verde "Grátis" na capa, botão "Acessar grátis" com fundo navy.

---

### 4.7 CursoVendaPage (`#/curso/:id`) — Página de venda individual
Referência visual: `docs/wireframes/phdonassolo-curso-venda.html`

**Apenas para cursos `tipo: 'lms'`**. Udemy e ESPM vão direto para o externo.

**Dados:** carregar curso do Supabase pelo `id` da rota.

**Seções:** Hero navy com card de compra → O que vai aprender (checklist) + Ementa (módulos do Supabase) → Para quem é / Não é para quem → Sobre o professor → CTA final com preço

**Card de compra:**
- Preço vem do Supabase
- Preço original (riscado) se houver desconto
- Botão "Comprar via Hotmart" — **Fase 3**: na Fase 1 e 2, o botão exibe "Em breve" ou linka para `#/fale-comigo`
- Garantia "7 dias · Hotmart"
- Checklist do que está incluído (dados do Supabase)

---

### 4.8 ConteudoPage (`#/conteudo`)
Referência visual: `docs/wireframes/phdonassolo-conteudo.html`

**Dados:** artigos e vídeos do Firebase, ferramentas do Supabase.

**Filtros paralelos:** Tipo (Artigo/Vídeo/Ferramenta) + Tema + Pilar — todos client-side.

**Toggle de visualização:** Editorial (padrão) ↔ Grade. Estado salvo em `localStorage`.

**Três tipos de card:**
- Artigo → `#/artigo/:id`
- Vídeo → embed YouTube/Instagram em modal ou nova aba
- Ferramenta → abre modal de captura de lead (`ModalLead`)

**Modal de captura de lead (ferramentas):**
- Campos: nome + e-mail
- Ao submeter: salvar lead no Firebase (`leads` collection com campo `ferramenta: string`)
- Após salvar: redirecionar para URL da ferramenta (vem do Supabase — campo `url_entrega`, tipo `html | externo | download`)
- Três tipos de entrega:
  - `html` — abrir URL interna em nova aba
  - `externo` — abrir URL externa em nova aba
  - `download` — trigger download do arquivo

---

### 4.9 ArtigoPage (`#/artigo/:id`)
Sem wireframe separado — especificação completa aqui.

**Layout:** leitura limpa, sem sidebar.
- Container: `max-w-[680px] mx-auto`
- Tipografia corpo: `font-display text-[1.1rem] leading-[1.8]` (serifa para leitura longa)
- Header: eyebrow (tipo + tema + pilar + data) + título grande + subtítulo + linha separadora gold
- Blockquote: `border-l-[3px] border-gold pl-5 font-display italic`
- Imagens: `w-full` com `figcaption font-mono text-xs text-ink-light text-center`
- Footer do artigo: tags + linha separadora + CTA contextual (baseado no tema do artigo) + 3 artigos relacionados

**CTA contextual por tema:**
- Vendas/Gestão/Liderança → "Conheça a Mentoria" ou "Conheça a Consultoria"
- Negociação → "Ver cursos de Negociação"
- Carreira → "Conheça o programa 4050 ou Mais"

---

### 4.10 RecursosPage (`#/recursos`)
Referência visual: `docs/wireframes/phdonassolo-recursos.html`

**Dados:** cursos do Supabase para os 3 cards principais. Ferramentas do Supabase para a grade de 6.

**Seções:** Hero navy → 3 cards grandes (Área do Aluno, Udemy, Amazon) → 6 ferramentas gratuitas com modal de lead → Lista de links rápidos → CTA

---

### 4.11 FaleComigo (`#/fale-comigo`)
Referência visual: `docs/wireframes/phdonassolo-fale-comigo.html`

**Formulário:** campos Nome, E-mail, WhatsApp, Assunto (select), Mensagem.
Ao submeter: salvar no Firebase (`leads` collection, `tipo: 'contato'`).
Feedback visual: mensagem de sucesso inline, sem redirect.

**WhatsApp flutuante expandido:** nesta página, o botão flutuante expande ao hover mostrando "Fale pelo WhatsApp".

**Seção "O que esperar":** 4 etapas estáticas (não vem do CMS).

**FAQ accordion:** 4 perguntas estáticas.

---

### 4.12 AdminPage (`#/admin`) — Redesenhar, manter funcional
**Não quebrar nenhuma funcionalidade existente.**

**Tabs existentes:** Gestão de Conteúdo | Editor Visual (CMS) | Meus Leads | Conexão API

**Adicionar ao ContentManager:**
- CRUD de `timeline_items` (linha do tempo da página Prof. Paulo)
- Campo `tipo_entrega` nas ferramentas: `html | externo | download`
- Campo `url_entrega` nas ferramentas
- CRUD de itens da newsletter

**Corrigir bug existente:** `handleSave` usa `localStorage` — migrar para Firebase Firestore. O `SiteEditor` está duplicado no `AdminPage` (renderizado duas vezes) — corrigir.

**Expandir SiteEditor** para controlar visibilidade das novas seções da home: `metodologia`, `autoridade`, `situacoes`, `newsletter`.

**Aplicar novo design** ao admin: fundo `cream-dark`, tipografia do sistema, paleta navy/gold. Manter UX e funcionalidade intacta.

---

### 4.13 AreaAlunoPage (`#/area-do-aluno`) — Pré-lançamento
**Sem wireframe** — especificação completa aqui.

**Contexto:** o LMS (`aluno.phdonassolo.com`) está em construção e será liberado até o final de junho/2026. Esta página substitui o link direto para o LMS enquanto ele não está disponível publicamente.

**Layout:** página simples, fundo navy, sem sidebar.

**Conteúdo:**
- Eyebrow: "Área do Aluno"
- Título: "Em breve. Muito em breve."
- Subtítulo em itálico: "A plataforma de ensino do Prof. Paulo H. Donassolo estará disponível até o final de junho de 2026."
- Parágrafo: "Cadastre seu e-mail para receber o aviso assim que a plataforma for liberada — e ter acesso antecipado aos primeiros cursos."
- Formulário: Nome + E-mail + botão "Quero ser avisado"
- Nota: "Sem spam. Você receberá apenas o aviso de lançamento."
- Link discreto: "← Voltar ao início"

**Ao submeter o formulário:**
- Salvar no Firebase, coleção `leads`, com campos: `nome`, `email`, `tipo: 'pre_lancamento_lms'`, `data: timestamp`
- Exibir mensagem de confirmação inline: "Ótimo! Você será avisado assim que a plataforma for liberada."
- Não redirecionar

**Quando o LMS for liberado:**
- Alterar `lms_liberado: true` no `site-config.ts`
- O botão "Área do Aluno" no nav passa a linkar para `aluno.phdonassolo.com`
- A rota `#/area-do-aluno` redireciona automaticamente para `aluno.phdonassolo.com`

**Adicionar ao `site-config.ts`:**
```typescript
lms: {
  liberado: false, // alterar para true quando o LMS for ao ar
  url: 'https://aluno.phdonassolo.com',
  previsao_lancamento: 'junho de 2026'
}
```

---

### 4.15 Páginas de suporte

**PrivacyPage / TermsPage:** aplicar nav + footer + tipografia do sistema. Manter conteúdo existente.

**EmBrevePage (`#/em-breve`):** componente simples — nav + mensagem "Em breve" em `font-display text-4xl` + botão "Voltar ao início".

**LandingPage dinâmica (`#/lp/:slug`):** manter lógica dinâmica existente. Aplicar novo design aos formulários e botões.

---

### 4.16 WhatsApp flutuante
Presente em todas as páginas públicas. Componente global `<WhatsAppFloat />` no `App.tsx`.
- Número configurável no `site-config.ts`
- Padrão: botão circular `#25D366`, 52×52px, `fixed bottom-7 right-7 z-50`
- Na página `#/fale-comigo`: expande ao hover mostrando texto

---

## 5. COMPONENTES REUTILIZÁVEIS

Criar pasta `src/components/ui/` com os seguintes componentes base:

```
Button.tsx        — variantes: primary, outline, ghost
Eyebrow.tsx       — label de seção com linha decorativa
SectionTitle.tsx  — título + eyebrow combinados
Card.tsx          — base para cards com hover
FioCondutor.tsx   — fio vertical gold fixo + nó animado
ScrollReveal.tsx  — wrapper com IntersectionObserver
TransitionDiv.tsx — div de transição entre seções (sem conteúdo)
Modal.tsx         — modal genérico (usar no lead de ferramentas)
FAQAccordion.tsx  — accordion reutilizável
TimelineItem.tsx  — item da linha do tempo
FaseStep.tsx      — etapa do processo (mentoria/consultoria)
CourseCard.tsx    — card de curso (vitrine)
ArticleCard.tsx   — card de artigo (editorial e grade)
NewsletterForm.tsx — formulário de newsletter
ContactForm.tsx   — formulário de contato
```

---

## 6. INTEGRAÇÃO COM SUPABASE

### 6.1 Diagnóstico inicial obrigatório
Antes de escrever qualquer código de integração:

1. Verificar se `supabase` está nas dependências do `package.json` do site
2. Verificar `.env` — existência e nomenclatura das variáveis (`VITE_` prefix para Vite)
3. Se não existir cliente Supabase no projeto do site, instalar: `npm install @supabase/supabase-js`
4. Verificar RLS das tabelas que o site vai consumir — devem ter policy de `SELECT` público ou via `anon key`
5. Inspecionar as tabelas existentes no Supabase para mapear campos reais

### 6.2 Criar `src/services/supabaseService.ts`

```typescript
// Nunca use a service_role key no frontend
// Use apenas a anon key (VITE_SUPABASE_ANON_KEY)
// O site nunca escreve no Supabase — apenas lê

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export const SupabaseService = {
  // Cursos
  getCursos: async (filtros?: { categoria?: string; tipo?: string; acesso?: string }) => {},
  getCursoById: async (id: string) => {},
  getCursosCount: async () => {},

  // Vídeos
  getVideos: async (limit?: number) => {},

  // Ferramentas
  getFerramentas: async () => {},
  getFerramentaById: async (id: string) => {},

  // Recursos
  getRecursos: async () => {},
}
```

### 6.3 Campos esperados por entidade

**Curso (tabela a inspecionar no Supabase):**
Campos mínimos necessários para o site:
- `id`, `titulo`, `descricao`, `carga_horaria`, `nivel`, `categoria`
- `tipo`: `'lms' | 'udemy' | 'espm'`
- `preco`, `preco_original` (para desconto), `gratuito: boolean`
- `url_checkout` (Hotmart para lms, URL externa para udemy/espm)
- `url_capa` (imagem)
- `publicado: boolean` — controla visibilidade no LMS
- `visivel_no_site: boolean` — **controla visibilidade na vitrine pública do site. SEMPRE filtrar por este campo.**
- `ordem: number`
- `modulos: JSON[]` (para página de venda)
- `o_que_aprender: string[]`
- `para_quem: string[]`
- `nao_para_quem: string[]`
- `inclui: string[]`
- `avaliacoes_count: number`, `avaliacoes_media: number`

**Mesma lógica de `visivel_no_site` se aplica a todas as entidades lidas do Supabase:**
- Vídeos: exibir no site apenas se `visivel_no_site: true`
- Ferramentas: exibir no site apenas se `visivel_no_site: true`
- Recursos: exibir no site apenas se `visivel_no_site: true`

**Se o campo `visivel_no_site` não existir nas tabelas do Supabase:** reportar ao usuário antes de prosseguir. Não assumir que todos os registros devem aparecer no site.

Se os campos no Supabase tiverem nomes diferentes, adaptar o `supabaseService.ts` para mapear.

### 6.4 Variáveis de ambiente necessárias
Adicionar ao `.env` antes da Fase 2:
```
VITE_SUPABASE_URL=https://[projeto].supabase.co
VITE_SUPABASE_ANON_KEY=[chave-anon-publica]
```
Adicionar ao `.env.example` os nomes sem valores.

---

## 7. FIREBASE — AJUSTES NECESSÁRIOS

### 7.1 Corrigir bug crítico — handleSave
No `AdminPage`, o `handleSave` usa `localStorage`. Migrar para salvar no Firestore (`site_config` document).

### 7.2 Corrigir bug — SiteEditor duplicado
O `SiteEditor` é renderizado duas vezes no `AdminPage`. Remover a instância duplicada.

### 7.3 Nova coleção — `timeline_items`
```typescript
interface TimelineItem {
  id: string
  ano: string          // ex: "1998–hoje", "2005"
  tag: string          // ex: "Início da carreira comercial"
  titulo: string
  descricao: string
  destaque: boolean    // dot maior, tratamento visual diferenciado
  ordem: number
}
```

### 7.4 Atualizar schema do SiteConfigContext
Adicionar ao schema existente:
```typescript
sections: {
  hero: { visible: boolean }
  metodologia: { visible: boolean }
  autoridade: { visible: boolean }
  situacoes: { visible: boolean }
  servicos: { visible: boolean }
  conteudo: { visible: boolean }
  newsletter: { visible: boolean; titulo?: string; subtitulo?: string }
  recursos: { visible: boolean }
}
```

---

## 8. PLANO DE IMPLEMENTAÇÃO FASEADO

### FASE 1 — Design e estrutura
**Objetivo:** site com novo visual funcionando, sem integração dinâmica.
**Critério de conclusão:** todas as páginas navegáveis com conteúdo estático/placeholder, design system aplicado, admin redesenhado e funcional.

**Tarefas:**
1. Configurar tokens no `tailwind.config.js`
2. Atualizar `index.html` com fontes Google
3. Criar componentes base em `src/components/ui/`
4. Criar `FioCondutor.tsx` e `ScrollReveal.tsx`
5. Redesenhar `HomePage`
6. Redesenhar `MentoriaPage`
7. Criar `ConsultoriaPage`
8. Criar `ProfPauloPage`
9. Criar `ServicosPage`
10. Criar `CursosPage` (vitrine com dados estáticos placeholder)
11. Criar `CursoVendaPage` (com botão "Em breve" no lugar do Hotmart)
12. Redesenhar `ConteudoPage`
13. Criar `RecursosPage`
14. Criar `FaleComigo`
15. Redesenhar `AdminPage` (manter funcional, corrigir bugs)
16. Redesenhar `LoginPage`
17. Aplicar design a `PrivacyPage`, `TermsPage`
18. Criar `EmBrevePage`
19. Criar `AreaAlunoPage` (formulário de pré-cadastro LMS com mensagem de prazo junho/2026)
20. Atualizar `App.tsx` com novas rotas
21. Adicionar `lms.liberado` ao `site-config.ts`
22. Criar `WhatsAppFloat` global
23. Verificar deploy

---

### FASE 2 — Conteúdo dinâmico
**Pré-requisito:** variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` adicionadas ao `.env`.
**Objetivo:** dados reais do Supabase e Firebase aparecendo nas páginas.
**Critério de conclusão:** vitrine de cursos carregando do Supabase, artigos e vídeos do Firebase, ferramentas com modal de lead funcional.

**Tarefas:**
1. Diagnóstico: inspecionar Supabase (tabelas, campos, RLS)
2. Verificar existência do campo `visivel_no_site` em todas as tabelas consumidas pelo site. **Se não existir, reportar ao usuário antes de prosseguir.**
3. Instalar `@supabase/supabase-js` se necessário
4. Criar `src/services/supabaseService.ts` — todas as queries DEVEM incluir `.eq('visivel_no_site', true)`
4. Conectar `CursosPage` ao Supabase
5. Conectar `CursoVendaPage` ao Supabase
6. Conectar `ConteudoPage` ao Firebase (artigos/vídeos) e Supabase (ferramentas)
7. Implementar modal de lead para ferramentas com salvamento no Firebase
8. Conectar `RecursosPage` ao Supabase
9. Conectar stats dinâmicos do hero de cursos ao Supabase
10. Implementar CRUD de `timeline_items` no `ContentManager`
11. Corrigir `handleSave` do admin (localStorage → Firestore)
12. Expandir `SiteEditor` com novas seções
13. Verificar deploy

---

### FASE 3 — Integração Hotmart
**Pré-requisito:** Fases 1 e 2 completas e estáveis. Conta Hotmart configurada com produtos e webhooks.
**Atenção:** esta fase envolve tanto o site quanto a `area-do-aluno`. Ler os arquivos reais do LMS antes de começar.

**Tarefas:**
1. Ler `area-do-aluno/` — mapear fluxo de compra e liberação de acesso atual
2. Verificar se `url_checkout` está populado no Supabase para cada curso LMS
3. Substituir botão "Em breve" pelo botão "Comprar via Hotmart" nas páginas de venda
4. Configurar webhook Hotmart → endpoint que libera acesso no LMS
5. Testar fluxo completo: compra → webhook → acesso liberado no LMS
6. Verificar deploy

---

## 9. ESPECIFICAÇÕES DE IMAGEM PARA O CMS

O admin deve exibir estas orientações ao fazer upload de imagens:

| Contexto | Dimensão | Proporção | Formato | Tamanho máx |
|---|---|---|---|---|
| Foto contextual Prof. Paulo | 800×1067px | 3:4 | JPG | 200kb |
| Capa de livro | 400×600px | 2:3 | JPG/PNG | 100kb |
| Capa de curso | 800×450px | 16:9 | JPG | 150kb |
| Thumbnail de artigo | 1200×630px | 1.91:1 | JPG | 200kb |
| Thumbnail de vídeo | 1280×720px | 16:9 | JPG | 150kb |
| Logo de instituição | 240×80px | variável | PNG (transparente) | 50kb |
| OG Image (social) | 1200×630px | 1.91:1 | JPG | 300kb |

---

## 10. CRITÉRIOS DE ACEITAÇÃO GERAIS

Antes de considerar qualquer fase concluída, verificar:

- [ ] Todas as páginas carregam sem erro de console
- [ ] Nav fixa não sobrepõe conteúdo (padding-top: 62px nas páginas)
- [ ] Fio condutor visível e nó acompanha scroll
- [ ] Scroll reveal funciona em todos os elementos marcados
- [ ] WhatsApp flutuante presente em todas as páginas públicas
- [ ] Transições entre seções sem texto em zona de gradiente
- [ ] Admin funcional — todas as tabs acessíveis
- [ ] Login funcional — autenticação Firebase intacta
- [ ] Botão "Área do Aluno" linka para `#/area-do-aluno` enquanto `lms.liberado = false`
- [ ] Formulário de pré-cadastro LMS salva no Firebase com `tipo: 'pre_lancamento_lms'`
- [ ] Vitrine de cursos exibe apenas registros com `visivel_no_site: true`
- [ ] Ferramentas e vídeos exibem apenas registros com `visivel_no_site: true`
- [ ] Curso com `visivel_no_site: false` não aparece em nenhuma página pública do site
- [ ] Responsivo: testar em 375px (mobile), 768px (tablet), 1240px (desktop)
- [ ] "Prof. Paulo H. Donassolo" sempre em `font-bold` em qualquer contexto
- [ ] Deploy bem-sucedido via GitHub Actions

---

## 11. O QUE NÃO FAZER

- **Não modificar** nada em `area-do-aluno/`
- **Não escrever** no Supabase — apenas leitura
- **Não usar** `service_role key` do Supabase no frontend
- **Não implementar** Hotmart antes da Fase 3
- **Não recriar** o sistema de autenticação Firebase — usar o existente
- **Não usar** `window.location.reload()` para salvar configurações
- **Não quebrar** rotas existentes que podem estar em uso (`#/lp/:slug`, `#/artigo/:id`)
- **Não assumir** nomes de tabelas do Supabase — inspecionar primeiro
- **Não ler** schemas ou blueprints do LMS — ler apenas os arquivos de código reais
- **Não exibir** no site conteúdo do Supabase sem verificar `visivel_no_site: true`
- **Não linkar** "Área do Aluno" para `aluno.phdonassolo.com` enquanto `lms.liberado = false`
- **Não assumir** que todos os registros do Supabase devem aparecer no site — sempre filtrar

---

*Documento gerado para implementação pelo Claude Code.*
*Versão: 1.0 — Junho 2025*
*Projeto: phdonassolo.com redesign*
