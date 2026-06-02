# Auditoria e Plano de Implementação: Área do Aluno (LMS)

Com base na análise do repositório atual do seu site (`c:\Projetos\phdonassolo-site\`) e do documento **Blueprint_Area_do_Aluno_v5.2.docx**, realizei uma auditoria sistemática voltada para arquitetura, segurança e ausência de refação. 

Temos aqui a especificação de um projeto robusto: uma Área do Aluno baseada em **Next.js 15 e Supabase**, com recursos avançados de IA (Anthropic) e vendas conectadas ao ecossistema existente (HostGator e Mercado Pago).

---

## 1. Auditoria do Ecossistema

### O Site Atual (`phdonassolo.com`)
*   **Tech Stack Principal:** Desenvolvido como Single Page Application (SPA) em React 19 + Vite.
*   **Roteamento:** Usa `react-router-dom` (Hash Router `/#/`).
*   **Integrações Existentes:**
    *   **WordPress:** Fetch API (`services/dataService.ts`) consumindo a REST API do WP para obter Mocks de artigos e vídeos (no HostGator).
    *   **Firebase:** Usa Firestore para listar landing pages dinâmicas, recursos, livros e possui um Auth bem elementar (apenas para acesso à rota `#/admin` via `admin@phdonassolo.com`).
*   **Hospedagem Atual:** Build estático (Vite) hospedado via cPanel/HostGator.

### O Blueprint (Versão 5.2 - Área do Aluno)
*   **Escopo:** Módulo isolado, priorizado em sprints focadas e incrementais (MVP de 60 dias).
*   **Novo Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS + shadcn/ui.
*   **Backend:** Supabase (BaaS PostgreSQL) com 44 tabelas, Role-Level Security (RLS) e `pgvector`.
*   **Hospedagem Exigida:** Vercel sob o domínio `alunos.phdonassolo.com`.
*   **Integrações Externas Ocultas no Front:** Claude API (SaaS/Roleplay), AWS SES (E-mail) e Mercado Pago (Assinaturas).

---

## 2. Gaps e Conflitos de Arquitetura Identificados

> **Atenção:** Solucionar estes Gaps agora evitará toda a regressão estrutural.

1.  **Conflito de Backends: Firebase (Site) vs. Supabase (Área do Aluno)**
    *   **Gap:** O site atual consome o Firebase para listar alguns conteúdos (cursos, LPs). O Blueprint move *toda* a inteligência e banco de dados para o Supabase. 
    *   **Solução:** Manteremos o Firebase apenas alimentando a vitrine estática do site atual. A *Área do Aluno* será 100% no Supabase. No futuro, você pode aposentar a leitura no Firebase do site atual e fazê-lo ler via API pública do seu novo Supabase.
2.  **Conflito de Repositório (React + Vite vs. Next.js 15)**
    *   **Gap:** O repositório atual (`phdonassolo-site`) já é um projeto Node configurado para SPA Vite. Injetar o Next.js 15 na mesma raiz causará quebra de rotas, pacotes sobrepostos e conflito extremo.
    *   **Solução Inicial:** Criaremos uma subpasta chamada `area-do-aluno` **isolada** dentro do projeto, inicializando do zero o Next.js apenas para o ecossistema do LMS.
3.  **Cross-Origin nos Simuladores HTML (`token-check.php`)**
    *   **Gap:** O Blueprint prevê simuladores abrigados no HostGator sob trava via script PHP, abertos mediante JWT (Token) gerado na Vercel (Next.js).
    *   **Atenção aos Detalhes:** A comunicação e a validação de secret keys (SECRETS) entre o HostGator e a Vercel exige consistência. A expiração estrita (15 min) garantirá contra o compartilhamento pirata de URLs, a implementação precisará ser validada nas duas pontas na Semana 5.

---

## 3. Oportunidades Técnicas Encontradas

1.  **Geração dos "Design Tokens" (Fidelidade Visual)**
    *   Como o site Vite tem uma UI muito profissional, o Blueprint recomenda ler o CSS atual (`site-referencia/`) e transcrevê-lo para o Tailwind no Next.js (`lib/design-tokens.ts`). Isso trará agilidade absurda e consistência imediata entre os dois domínios sem a necessidade de UI designer.
2.  **Uso Majestoso das Políticas Postgres (RLS - Row Level Security)** 
    *   A lógica estabelecida para as bibliotecas de conteúdo serem dinamicamente distribuídas e o filtro de conteúdo (Ex: `tem_acesso_curso()`) será validada diretamente no banco de dados. Um pedido não verificado sequer baixa os assets pesados no frontend. É o pico da performance.
3.  **Roadmap Pragmatista**
    *   O Blueprint detalha o custo de uso de IA (API) com maestria e orienta as features de forma sequencial (Do Login até os Simuladores RAG). Focar em um módulo e fechá-lo (S1 -> S9) extirpará toda possibilidade de retrabalho.

---

## 4. Plano de Implementação Progressiva (Sem Regressões)

O plano tático que propomos para colocar a Área do Aluno de pé e seguir metodicamente os ritos delimitados no doc:

### Passo 1: Fundação do App LMS, Design e Segregação (Equivalente a S1/S2)
*   **Ação:** Criar a subpasta `area-do-aluno/` e inicializar o projeto Next.js 15 puro (App Router).
*   **Design:** Mapear configurações em `tailwind.config.ts`, integrando cores, tipografias padrão copiadas do atual Vite App para montar o `design-tokens.ts` (Sua fonte de verdade).
*   Instalação das packages: `@supabase/ssr`, `@supabase/supabase-js`, `mercadopago`, `@anthropic-ai/sdk`, etc.

### Passo 2: O Núcleo Real: Banco de Dados Supabase (S3)
*   **Ação:** Criação do Database Migration local com as orquestrações das **44 tabelas SQL** fornecidas no Blueprint.
*   **Arquitetura de Reutilização (N:N)**: O banco deve OBRIGATORIAMENTE ser hibridizado num conceito de "Biblioteca". Mapear as tabelas pivô: `cursos_pilares` (1 curso em vários pilares), `cursos_modulos` (1 módulo solto reciclado em vários cursos), `modulos_aulas` (1 aula em vários módulos) e `aulas_materiais`. O schema deve suportar a modelagem onde `curso_id`, `modulo_id` ou `aula_id` possam ser `NULL` em suas entidades reais para designar que são "Recursos da Biblioteca".
*   **Blindagem:** Injetaremos automaticamente e via query as Políticas RLS em cada tabela e adicionaremos sua função essencial PostgreSQL `tem_acesso_curso()`.

### Passo 3: Rotas Protegidas e o Core do Aluno (S3 e S4)
*   **O Auth Inteligente (Módulo 1):** Roteamento em `(auth)` vs `(protected)` para proteger contra os loops infinitos mapeados no Blueprint (P1 Crítico!).
*   **Catálogo e Módulo de Módulos (Módulo 2 e 6):** Lógica da vitrine customizada, integrando visualização de vídeos com `posicao_s` (State de progresso + Revisão Espaçada - Módulos 2 e Biblioteca).

### Passo 4: Motor de Vendas, Proteção de Hospedagem (S4, S5 e S6)
*   **Backend de API:** Endpoint `/api/pagamentos/*` para checkouts via Mercado Pago, vencimentos, assinaturas e cupons automatizados.
*   **Proteção via PHP:** Instanciação do script gerador/verificador de Token JWT nos `.html` contendo seus Simuladores estáticos existentes salvos no cPanel.

### Passo 5: O Arsenal Engajador - SaaS e Auth de IA (S7, S8 e S9)
*   Integrar avaliações, comunidade básica e cronograma (E-mails).
*   Criar endpoints baseados no Node.js/Next invocadores de endpoints do Claude (`Haiku/Sonnet`) limitados via uso/Tokens por aluno, finalizando com o glorioso Simulador de Negociação e Mapeador de Objeções via Streaming. 

---

### Próximos Passos Iniciais

Estou inteiramente a postos e com total ciência das regras do projeto. Para iniciarmos na prática e não perdermos o foco do que é essencial **(P1/Crítico):**

1. Devo criar agora a estrutura independente `area-do-aluno` (Next.js 15) dentro deste diretório para isolá-lo de conflitos com o seu atual Vite/React?
2. Deseja que eu já inclua o comando para inicializar o setup Tailwind e gerar o `design-tokens.ts` extraído do CSS atual?
