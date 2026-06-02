Need to install the following packages:
mammoth@1.12.0
Ok to proceed? (y) 
__├üREA DO ALUNO__

__Blueprint Completo de Implementa├º├úo__

phdonassolo\.com  |  Prof\. Paulo Henrique Donassolo

__VERS├âO 5\.2  |  MAR├çO 2026__

Documento ├║nico consolidado ÔÇö substitui todas as vers├Áes anteriores

__Ôùå  41 tabelas \+ biblioteca de conte├║do intercambi├ível ┬À Quiz ┬À Tipos de aula ┬À Notas ┬À Notifica├º├Áes ┬À Cupons ┬À Revis├úo espa├ºada ┬À PHD Ramp ┬À Buscador IA no cat├ílogo ┬À Regras de seguran├ºa ┬À Mapa de prioridades P1ÔÇôP5 ┬À CLAUDE\.md v5\.2  Ôùå__

# __0\. Como Usar Este Documento__

Este ├® o documento ├║nico de refer├¬ncia do projeto ├ürea do Aluno\. Substitui todas as vers├Áes anteriores\.

__Parte__

__Se├º├Áes__

__Quem executa__

__Quando__

PARTE A ÔÇö Configura├º├Áes manuais

Se├º├Áes 1 a 6

Voc├¬

Semanas 1ÔÇô2 \(antes de ligar o Claude Code\)

PARTE B ÔÇö Banco de dados

Se├º├úo 7

Claude Code

Semana 3, primeiro passo

PARTE C ÔÇö C├│digo e m├│dulos

Se├º├Áes 8 a 11

Claude Code

Semanas 3ÔÇô9, sequ├¬ncia de prompts

PARTE D ÔÇö Deploy e opera├º├úo

Se├º├Áes 12 a 16

Voc├¬ \+ Claude Code

Uso recorrente p├│s\-lan├ºamento

PARTE E ÔÇö Mapa de prioridades

Se├º├úo 17

Refer├¬ncia

Consultar antes de cada sprint

## __Sistema de prioridades__

Cada funcionalidade neste blueprint tem uma prioridade expl├¡cita:

__P1 ÔÇö CR├ìTICO__

Implementar ANTES da primeira linha de c├│digo\. S├úo regras que previnem bugs graves documentados em projetos similares\.

__P2 ÔÇö ALTA__

Implementar nos 60 dias\. Fazem parte do MVP e do roadmap principal\.

__P3 ÔÇö M├ëDIA__

Implementar junto com o m├│dulo correspondente se o custo for baixo; caso contr├írio, logo ap├│s o lan├ºamento\.

__P4 ÔÇö P├ôS\-LAN├çAMENTO__

Implementar ap├│s valida├º├úo com usu├írios reais\. Requerem dados hist├│ricos ou massa cr├¡tica de alunos\.

__P5 ÔÇö LONGO PRAZO__

Roadmap de m├®dio prazo\. Alta complexidade ou depend├¬ncia de infraestrutura que ainda n├úo existe\.

├ìcones usados:  ­ƒöæ Voc├¬ faz ┬À ­ƒñû Claude Code faz ┬À ÔÜá´©Å Risco ┬À Ô£à Valida├º├úo ┬À ­ƒôü Armazenamento ┬À ­ƒåò Novo v5\.2 ┬À ­ƒöÆ Seguran├ºa

# __1\. Arquitetura Geral ÔÇö Mapa do Sistema__

__Componente__

__O que ├® e onde fica__

phdonassolo\.com

Site atual\. Continua no HostGator\. ├Ünica altera├º├úo: bot├úo '├ürea do Aluno' no Header

alunos\.phdonassolo\.com

├ürea do Aluno\. Next\.js 15 \+ TypeScript na Vercel \(gratuito\)

Supabase

PostgreSQL \+ Auth \+ Storage\. 44 tabelas \+ pgvector para Coach IA \(p├│s\-60 dias\)

HostGator /simuladores/

Simuladores HTML existentes e novos\. Protegidos por token PHP

YouTube n├úo\-listado

V├¡deos das aulas\. Gratuito e ilimitado\. Incorporados via ID

AWS SES / PHDMail

E\-mails autom├íticos transacionais e campanhas

Mercado Pago

Pagamentos avulsos \+ assinaturas \(Pix, Cart├úo, Boleto\)

Claude API

Ferramentas SaaS \+ Simuladores \+ Buscador do cat├ílogo \+ Coach IA

GitHub \(privado\)

C├│digo\-fonte\. Deploy autom├ítico na Vercel a cada git push

## __Mapa de armazenamento__

__Tipo__

__Exemplo__

__Onde fica__

__Como o aluno acessa__

PDFs e planilhas

Checklist Onboarding\.pdf

Supabase Storage

Link tempor├írio 60min

Simuladores HTML

calculo\-preco\.html

HostGator /simuladores/

Link protegido token PHP

Ferramentas SaaS com IA

PHD Ramp

GitHub ÔåÆ Vercel \(c├│digo\)

P├ígina protegida /ferramentas/slug

V├¡deos das aulas

Aula 03 ÔÇö JBP

YouTube n├úo\-listado

Embed via youtube\_id

Thumbnails de cursos

capa\-negociacao\.jpg

Supabase Storage

URL p├║blica permanente

Landing pages

lp/jbp\-checklist

HostGator /lp/

Acesso p├║blico

# __2\. Identidade Visual ÔÇö Design Tokens__

Antes de criar qualquer componente, o Claude Code l├¬ o site atual e gera lib/design\-tokens\.ts\. Este arquivo ├® a ├║nica fonte de verdade visual do projeto\.

__­ƒñû  PROMPT ÔÇö GERAR DESIGN TOKENS \(Semana 2, antes de qualquer c├│digo de UI\)__

"Leia os arquivos em /site\-referencia/ \(index\.html e style\.css do site phdonassolo\.com\)\. Extraia: \(1\) Paleta de cores completa com nomes sem├ónticos\. \(2\) Tipografia: fam├¡lias, tamanhos, pesos\. \(3\) Espa├ºamentos padr├úo\. \(4\) Raios de borda\. \(5\) Sombras\. Gere lib/design\-tokens\.ts como objeto TypeScript exportado\. Todos os componentes da plataforma devem importar exclusivamente deste arquivo\. NUNCA use valores de cor ou fonte hardcodados em componentes\."

# __3\. Claude Code ÔÇö Configura├º├úo do Agente__

## __3\.1 Instala├º├úo__

Instale o Claude Code globalmente: npm install \-g @anthropic\-ai/claude\-code

Inicie em qualquer pasta do projeto: claude

__Ô£à  __Valida├º├úo: prompt interativo do Claude Code com o caminho da pasta = funcionando\.

## __3\.2 Arquivo CLAUDE\.md ÔÇö Contexto Permanente \(v5\.2\)__

Crie na raiz da pasta area\-do\-aluno/\. O Claude Code l├¬ automaticamente em toda sess├úo\.

\# CLAUDE\.md ÔÇö ├ürea do Aluno PHDonassolo v5\.2

\#\# Projeto

Plataforma de ensino do Prof\. Paulo Henrique Donassolo

URL: alunos\.phdonassolo\.com | Site refer├¬ncia visual: phdonassolo\.com

\#\# Stack

\- Frontend: Next\.js 15 \+ TypeScript \+ Tailwind CSS \+ shadcn/ui

\- Backend/BaaS: Supabase \(PostgreSQL \+ Auth \+ Storage \+ pgvector\)

\- Pagamentos: Mercado Pago \(Checkout Pro \+ Assinaturas Preapproval\)

\- IA Ferramentas simples: claude\-haiku\-4\-5 | IA Simuladores: claude\-sonnet\-4\-6

\- Deploy: Vercel \(autom├ítico via GitHub push\) | E\-mail: AWS SES

\- Leads: Google Sheets via Service Account

\#\# M├│dulos do Projeto

M1: Auth e Perfil | M2: Cat├ílogo \+ Player \+ Trilhas | M3: Materiais \+ Simuladores HTML

M4: Pagamentos \+ Planos \+ Convites \+ Certificados | M5: Quiz e Avalia├º├Áes

M6: Dashboard Admin | M7: Comunidade | M8: E\-mails \+ CRON | M9: Ferramentas SaaS

M10: Simuladores Roleplay IA | M11: Coach IA 24/7 \(p├│s\-60d\) | M12: Diagn├│stico \(p├│s\-60d\)

\#\# ÔòÉÔòÉ REGRAS ABSOLUTAS ÔòÉÔòÉ

\#\#\# Seguran├ºa ÔÇö P1 CR├ìTICO \(implementar antes de qualquer c├│digo\)

\- Rate limiting APENAS em /api/\* ÔÇö NUNCA em rotas de p├íginas, assets, CSS ou JS

  \(aplicar em todas as rotas derruba o site: 1 visita dispara 15\-20 requisi├º├Áes de assets\)

\- /admin/login deve ficar FORA do Route Group \(protected\) para evitar loop infinito

  Estrutura correta: /app/\(auth\)/login | /app/\(protected\)/admin/\.\.\.

\- Slugs s├úo SEMPRE ASCII lowercase sem acentos e sem caracteres especiais

  CORRETO: 'gestao\-comercial' | ERRADO: 'gest├úo\-comercial' \(quebra 55\+ links internos\)

\- Validar senha em TODO endpoint de autentica├º├úo ÔÇö nunca verificar apenas o e\-mail

\- NUNCA expor ANTHROPIC\_API\_KEY no frontend ÔÇö sempre via /api/

\- Verificar vencimento do plano em TODA rota protegida de conte├║do

\- Assinatura da plataforma \(planos\_acesso tipo=plataforma\) tem prioridade sobre matr├¡cula

\#\#\# Identidade visual e c├│digo

\- NUNCA hardcodar cores ÔÇö sempre lib/design\-tokens\.ts

\- NUNCA hardcodar pilares ÔÇö sempre buscar da tabela pilares

\- Mobile\-first: componente funciona em 375px antes de desktop

\- Simuladores HTML ficam no HostGator ÔÇö link protegido com token PHP

\- PDFs exclusivos: Supabase Storage com signed URLs de 60min

\#\#\# Gloss├írio ÔÇö USAR SEMPRE ESTES TERMOS

\- M├│dulo = agrupamento de aulas\. NUNCA 'se├º├úo', 'unidade' ou 'cap├¡tulo'

\- Ferramenta = tool SaaS com output direto \(formul├írioÔåÆtexto\)\. Salva em ferramenta\_resultados

\- Simulador = roleplay conversacional multi\-turno\. Salva em simulacoes

\- Biblioteca = tabelas modulos/aulas com curso\_id NULL \+ tabelas cursos\_modulos/modulos\_aulas

\#\# 44 Tabelas do Banco

Perfil:      profiles, pilares, profiles\_pilares

Cursos:      cursos, cursos\_pilares, modulos, aulas, cursos\_modulos, modulos\_aulas

Materiais:   materiais, materiais\_pilares, materiais\_cursos, aulas\_materiais

Acesso:      matriculas, progresso\_aulas, planos\_acesso, assinaturas\_plataforma, convites

Pagamento:   pedidos, precos\_planos, cupons

Avalia├º├Áes:  avaliacoes\_cursos

Quiz:        quizzes, quiz\_perguntas, quiz\_alternativas, quiz\_respostas

Ferramentas: ferramentas, uso\_ferramentas, simulacoes, ferramenta\_resultados

Comunidade:  comunidade\_grupos, grupos\_membros, comunidade\_posts,

             comunidade\_comentarios, post\_curtidas

Aprendizado: notas\_aluno, notificacoes

Certificados: certificados, leads

Engajamento: metas\_aluno, diagnosticos, planos\_indicacao, roi\_treinamento

Auditoria:   admin\_log

\#\# Vari├íveis de Ambiente \(\.env\.local\)

NEXT\_PUBLIC\_SUPABASE\_URL= | NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=

SUPABASE\_SERVICE\_ROLE\_KEY= | NEXT\_PUBLIC\_MP\_PUBLIC\_KEY=

MP\_ACCESS\_TOKEN= | ANTHROPIC\_API\_KEY=

NEXT\_PUBLIC\_SITE\_URL=https://alunos\.phdonassolo\.com

AWS\_SES\_REGION=us\-east\-1 | AWS\_ACCESS\_KEY\_ID= | AWS\_SECRET\_ACCESS\_KEY=

SIMULADOR\_TOKEN\_SECRET=<string aleat├│ria 32 chars>

GOOGLE\_SHEETS\_LEADS\_ID=<ID da planilha Google>

GOOGLE\_SERVICE\_ACCOUNT\_KEY=<JSON da service account>

# __4\. Reposit├│rios GitHub ÔÇö Refer├¬ncias de Arquitetura__

__Reposit├│rio__

__Extrair deste reposit├│rio__

adrianhajdin/saas\-app

Estrutura geral, rotas protegidas, dashboard, pagamentos, organiza├º├úo de componentes

oompas/open\-lms

Player YouTube \+ controle de progresso \+ sidebar de m├│dulos e aulas

KolbySisk/next\-supabase\-stripe\-starter

Middleware de auth, RLS no Supabase, webhook \(adaptar Stripe ÔåÆ Mercado Pago\)

__­ƒñû  PROMPT ÔÇö AN├üLISE DE REPOSIT├ôRIOS \(Semana 2, antes de criar o projeto\)__

"Analise os reposit├│rios abaixo como refer├¬ncia de arquitetura\. Extraia padr├Áes e adapte ao stack deste projeto \(Next\.js 15 \+ Supabase \+ Mercado Pago \+ Claude API\): \(1\) adrianhajdin/saas\-app: rotas protegidas, componentes de auth, layout dashboard, integra├º├úo de pagamento\. \(2\) oompas/open\-lms: player com progresso, sidebar de aulas com status\. \(3\) KolbySisk/next\-supabase\-stripe\-starter: middleware, webhook handler, RLS\. ATEN├ç├âO: os reposit├│rios informam 'como fazer'\. O CLAUDE\.md informa 'o que fazer'\. Decis├Áes de schema no CLAUDE\.md sempre prevalecem sobre padr├Áes inferidos dos reposit├│rios\."

# __5\. Configura├º├Áes Manuais ÔÇö Voc├¬ Faz nas Semanas 1 e 2__

## __5\.1 GitHub__

Acesse github\.com ÔåÆ New Repository ÔåÆ nome: area\-do\-aluno ÔåÆ Private ÔåÆ Create\. Clique 'Code' ÔåÆ copie a URL SSH\. No terminal: git clone \[url\] && cd area\-do\-aluno

## __5\.2 Supabase__

Acesse supabase\.com ÔåÆ New Project ÔåÆ nome: phdonassolo\-lms ÔåÆ regi├úo: South America \(S├úo Paulo\) ÔåÆ senha forte ÔåÆ Create\. Copie as chaves em Project Settings ÔåÆ API\.

__Ô£à  __Na aba 'Table Editor' deve aparecer 'No tables found'\.

## __5\.3 Vercel__

Acesse vercel\.com ÔåÆ Sign Up com GitHub ÔåÆ Add New Project ÔåÆ selecione area\-do\-aluno ÔåÆ Framework: Next\.js ÔåÆ adicione todas as vari├íveis de ambiente do CLAUDE\.md ÔåÆ Deploy ÔåÆ Settings ÔåÆ Domains ÔåÆ alunos\.phdonassolo\.com

## __5\.4 HostGator ÔÇö DNS__

__Campo__

__Valor__

Type

CNAME

Name

alunos

Value

cname\.vercel\-dns\.com \(fornecido pela Vercel\)

TTL

3600

## __5\.5 Mercado Pago__

Credenciais ÔåÆ copie Public Key \(NEXT\_PUBLIC\_MP\_PUBLIC\_KEY\) e Access Token \(MP\_ACCESS\_TOKEN\)\. Configure Webhooks ÔåÆ URL: https://alunos\.phdonassolo\.com/api/webhooks/mercadopago ÔåÆ Pagamentos \+ Planos \+ Assinaturas\.

## __5\.6 Anthropic__

platform\.anthropic\.com ÔåÆ Settings ÔåÆ API Keys ÔåÆ Create Key ÔåÆ nomeie: area\-do\-aluno\-prod\. Em Billing ÔåÆ Spend Limits: configure USD 50/m├¬s e alerta em USD 30\.

__ÔÜá´©Å  __A API para automaticamente ao atingir o limite\. Configure ANTES de publicar qualquer ferramenta SaaS\.

## __5\.7 Google Service Account \(para Leads ÔåÆ Google Sheets\)__

console\.cloud\.google\.com ÔåÆ novo projeto ÔåÆ ativar Google Sheets API ÔåÆ Credenciais ÔåÆ Service Account ÔåÆ criar chave JSON\. Compartilhe a planilha Google Sheets com o e\-mail da service account\.

# __6\. Prote├º├úo dos Simuladores HTML ÔÇö Token PHP__

__­ƒöÆ  __Sem esta prote├º├úo, qualquer pessoa que souber a URL direta acessa o simulador sem estar logada\.

## __Como funciona__

1\. Aluno clica 'Abrir Simulador' ÔåÆ plataforma gera JWT de 15 min\. 2\. URL enviada: phdonassolo\.com/simuladores/arquivo\.html?token=xyz\. 3\. token\-check\.php valida antes de exibir\. 4\. Sem token v├ílido ÔåÆ redirect para login\.

## __6\.1 Crie token\-check\.php no HostGator__

<?php

// /public\_html/simuladores/token\-check\.php

$secret = 'SEU\_SECRET\_AQUI'; // mesmo valor de SIMULADOR\_TOKEN\_SECRET no Vercel

$token = $\_GET\['token'\] ?? '';

if \(empty\($token\)\) \{

  header\('Location: https://alunos\.phdonassolo\.com/login'\); exit;

\}

$parts = explode\('\.', $token\);

if \(count\($parts\) \!== 3\) \{

  header\('Location: https://alunos\.phdonassolo\.com/login'\); exit;

\}

$payload = json\_decode\(base64\_decode\(strtr\($parts\[1\], '\-\_', '\+/'\)\), true\);

$sig = hash\_hmac\('sha256', $parts\[0\]\.'\.'\.$parts\[1\], $secret, true\);

$expected = rtrim\(strtr\(base64\_encode\($sig\), '\+/', '\-\_'\), '='\);

if \($parts\[2\] \!== $expected || $payload\['exp'\] < time\(\)\) \{

  header\('Location: https://alunos\.phdonassolo\.com/login'\); exit;

\}

// Token v├ílido ÔÇö continua exibindo o simulador

?>

## __6\.2 Adicione no in├¡cio de cada simulador HTML__

<?php require\_once 'token\-check\.php'; ?>

# __7\. Banco de Dados ÔÇö Schema Completo \(44 Tabelas\)__

## __7\.1 Vis├úo geral__

__Grupo__

__Tabelas__

__v5\.2__

Perfil

profiles, pilares, profiles\_pilares

ÔÇö

Cursos

cursos, cursos\_pilares, modulos, aulas

\+ campos tipo, conteudo\_html, status, etc\.

Biblioteca

cursos\_modulos, modulos\_aulas

­ƒåò P2 ÔÇö m├│dulos/aulas reutiliz├íveis entre cursos

Materiais

materiais, materiais\_pilares, materiais\_cursos, aulas\_materiais

ÔÇö

Acesso

matriculas, progresso\_aulas, planos\_acesso, assinaturas\_plataforma, convites

ÔÇö

Pagamento

pedidos, precos\_planos, cupons

ÔÇö

Avalia├º├úo

avaliacoes\_cursos

ÔÇö

Quiz

quizzes, quiz\_perguntas, quiz\_alternativas, quiz\_respostas

ÔÇö

Ferramentas

ferramentas, uso\_ferramentas, simulacoes, ferramenta\_resultados

ÔÇö

Comunidade

comunidade\_grupos, grupos\_membros, comunidade\_posts, comunidade\_comentarios, post\_curtidas

ÔÇö

Aprendizado

notas\_aluno, notificacoes

ÔÇö

Certificados

certificados, leads

ÔÇö

Engajamento

metas\_aluno, diagnosticos, planos\_indicacao, roi\_treinamento

ÔÇö

Auditoria

admin\_log

ÔÇö

__­ƒñû  PROMPT ÔÇö CRIAR O BANCO \(Semana 3, primeiro prompt ao Claude Code\)__

"Crie o schema completo do banco de dados no Supabase\. Execute o SQL abaixo em sequ├¬ncia ÔÇö s├úo 44 tabelas\. Ap├│s criar todas as tabelas, habilite Row Level Security e crie as pol├¡ticas da se├º├úo 7\.3\. Confirme listando as tabelas criadas\."

## __7\.2 SQL Completo ÔÇö 44 Tabelas__

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

\-\- GRUPO 1: PERFIL E PILARES

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

CREATE TABLE profiles \(

  id UUID REFERENCES auth\.users\(id\) PRIMARY KEY,

  email TEXT NOT NULL, nome TEXT NOT NULL, foto\_url TEXT,

  papel TEXT DEFAULT 'aluno' CHECK \(papel IN \('aluno','admin'\)\),

  bio TEXT, linkedin TEXT,

  lgpd\_aceito\_em TIMESTAMPTZ, lgpd\_versao TEXT,

  cadastro TIMESTAMPTZ DEFAULT NOW\(\), ultimo\_acesso TIMESTAMPTZ

\);

CREATE TABLE pilares \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  nome TEXT NOT NULL UNIQUE, slug TEXT NOT NULL UNIQUE,

  descricao TEXT, ativo BOOLEAN DEFAULT TRUE, ordem INTEGER DEFAULT 0,

  created\_at TIMESTAMPTZ DEFAULT NOW\(\)

\);

CREATE TABLE profiles\_pilares \(

  profile\_id UUID REFERENCES profiles\(id\) ON DELETE CASCADE,

  pilar\_id UUID REFERENCES pilares\(id\) ON DELETE CASCADE,

  PRIMARY KEY \(profile\_id, pilar\_id\)

\);

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

\-\- GRUPO 2: CURSOS

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

CREATE TABLE cursos \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  titulo TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,

  descricao TEXT, thumbnail TEXT,

  video\_apresentacao\_id TEXT,

  o\_que\_voce\_vai\_aprender JSONB,

  para\_quem\_e\_este\_curso JSONB,

  requisitos JSONB,

  nivel TEXT DEFAULT 'todos' CHECK \(nivel IN \('iniciante','intermediario','avancado','todos'\)\),

  idioma TEXT DEFAULT 'pt\-BR',

  carga\_h INTEGER DEFAULT 0,

  atualizado\_em TIMESTAMPTZ,

  preco NUMERIC\(10,2\) DEFAULT 0,

  preco\_promo NUMERIC\(10,2\),

  preco\_promo\_ate TIMESTAMPTZ,

  proximo\_curso\_id UUID REFERENCES cursos\(id\),

  status TEXT DEFAULT 'rascunho' CHECK \(status IN \('rascunho','publicado','arquivado'\)\),

  codigo\_editorial TEXT,  \-\- ex: 'PHD\_015' ÔÇö ponte com planilha editorial

  created\_at TIMESTAMPTZ DEFAULT NOW\(\)

\);

CREATE TABLE cursos\_pilares \(

  curso\_id UUID REFERENCES cursos\(id\) ON DELETE CASCADE,

  pilar\_id UUID REFERENCES pilares\(id\) ON DELETE CASCADE,

  PRIMARY KEY \(curso\_id, pilar\_id\)

\);

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

\-\- GRUPO 3: M├ôDULOS \(com suporte a biblioteca\)

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

\-\- curso\_id NULL = m├│dulo na biblioteca \(reutiliz├ível entre cursos\)

\-\- M├│dulo vinculado diretamente a 1 curso: usar curso\_id normal

\-\- M├│dulo reutilizado em N cursos: curso\_id NULL \+ tabela cursos\_modulos

\-\- GLOSS├üRIO: M├│dulo = agrupamento de aulas\. NUNCA 'se├º├úo' ou 'cap├¡tulo'\.

CREATE TABLE modulos \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  curso\_id UUID REFERENCES cursos\(id\) ON DELETE CASCADE,  \-\- NULL = biblioteca

  titulo TEXT NOT NULL,

  descricao TEXT,

  conteudo\_html TEXT,

  ordem INTEGER NOT NULL DEFAULT 0,

  status TEXT DEFAULT 'publicado' CHECK \(status IN \('rascunho','publicado'\)\),

  codigo\_editorial TEXT  \-\- ponte com planilha editorial

\);

\-\- V├¡nculo m├│dulo da biblioteca Ôåö cursos \(com ordem independente por curso\)

\-\- Permite que 'T├®cnicas de Negocia├º├úo' apare├ºa no curso A na posi├º├úo 3

\-\- e no curso B na posi├º├úo 5, sem duplicar o conte├║do

CREATE TABLE cursos\_modulos \(

  curso\_id UUID REFERENCES cursos\(id\) ON DELETE CASCADE,

  modulo\_id UUID REFERENCES modulos\(id\) ON DELETE CASCADE,

  ordem INTEGER NOT NULL,

  PRIMARY KEY \(curso\_id, modulo\_id\)

\);

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

\-\- GRUPO 4: AULAS \(com suporte a biblioteca\)

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

\-\- tipo define o componente renderizado pelo player:

\-\- 'video'    ÔåÆ youtube\_id \(YouTube IFrame API\)

\-\- 'texto'    ÔåÆ conteudo\_html \(rich text\)

\-\- 'quiz'     ÔåÆ tabela quizzes

\-\- 'download' ÔåÆ aulas\_materiais

\-\- 'link'     ÔåÆ link\_externo \(nova aba\)

\-\- 'live'     ÔåÆ link\_externo \+ data\_live

CREATE TABLE aulas \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  modulo\_id UUID REFERENCES modulos\(id\) ON DELETE CASCADE,  \-\- NULL = biblioteca

  titulo TEXT NOT NULL,

  tipo TEXT DEFAULT 'video' CHECK \(tipo IN \('video','texto','quiz','download','link','live'\)\),

  ordem INTEGER NOT NULL DEFAULT 0,

  youtube\_id TEXT,

  conteudo\_html TEXT,

  link\_externo TEXT,

  data\_live TIMESTAMPTZ,

  duracao\_min INTEGER DEFAULT 0,

  pergunta\_reflexao TEXT,

  transcricao TEXT,

  transcricao\_json JSONB,  \-\- \[\{start\_s, text\}\] para sincroniza├º├úo

  gratuita BOOLEAN DEFAULT FALSE,

  status TEXT DEFAULT 'publicado' CHECK \(status IN \('rascunho','publicado'\)\),

  codigo\_editorial TEXT  \-\- ponte com planilha editorial \(ex: 'PHD\_015'\)

\);

\-\- V├¡nculo aula da biblioteca Ôåö m├│dulos \(com ordem independente por m├│dulo\)

CREATE TABLE modulos\_aulas \(

  modulo\_id UUID REFERENCES modulos\(id\) ON DELETE CASCADE,

  aula\_id UUID REFERENCES aulas\(id\) ON DELETE CASCADE,

  ordem INTEGER NOT NULL,

  PRIMARY KEY \(modulo\_id, aula\_id\)

\);

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

\-\- GRUPO 5: MATERIAIS

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

CREATE TABLE materiais \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  titulo TEXT NOT NULL, descricao TEXT,

  tipo TEXT CHECK \(tipo IN \('pdf','xlsx','pptx','docx','simulador','link','zip'\)\),

  tipo\_acesso TEXT DEFAULT 'curso' CHECK \(

    tipo\_acesso IN \('todos','pilar','curso','combinado'\)\),

  storage\_path TEXT,

  url\_externa TEXT,

  gratuito BOOLEAN DEFAULT FALSE,

  codigo\_editorial TEXT,  \-\- ponte com planilha editorial

  created\_at TIMESTAMPTZ DEFAULT NOW\(\)

\);

CREATE TABLE materiais\_pilares \(

  material\_id UUID REFERENCES materiais\(id\) ON DELETE CASCADE,

  pilar\_id UUID REFERENCES pilares\(id\) ON DELETE CASCADE,

  PRIMARY KEY \(material\_id, pilar\_id\)

\);

CREATE TABLE materiais\_cursos \(

  material\_id UUID REFERENCES materiais\(id\) ON DELETE CASCADE,

  curso\_id UUID REFERENCES cursos\(id\) ON DELETE CASCADE,

  PRIMARY KEY \(material\_id, curso\_id\)

\);

CREATE TABLE aulas\_materiais \(

  aula\_id UUID REFERENCES aulas\(id\) ON DELETE CASCADE,

  material\_id UUID REFERENCES materiais\(id\) ON DELETE CASCADE,

  ordem INTEGER DEFAULT 0,

  PRIMARY KEY \(aula\_id, material\_id\)

\);

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

\-\- GRUPO 6: MATR├ìCULAS E ACESSO

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

CREATE TABLE matriculas \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  user\_id UUID REFERENCES profiles\(id\),

  curso\_id UUID REFERENCES cursos\(id\),

  origem TEXT DEFAULT 'plataforma' CHECK \(

    origem IN \('plataforma','hotmart','udemy','espm','unisinos','in\-company','convite','manual'\)\),

  status TEXT DEFAULT 'ativo' CHECK \(status IN \('ativo','concluido','suspenso'\)\),

  progresso INTEGER DEFAULT 0,

  matriculado\_em TIMESTAMPTZ DEFAULT NOW\(\), concluido\_em TIMESTAMPTZ,

  UNIQUE\(user\_id, curso\_id\)

\);

CREATE TABLE progresso\_aulas \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  user\_id UUID REFERENCES profiles\(id\),

  aula\_id UUID REFERENCES aulas\(id\),

  concluida BOOLEAN DEFAULT FALSE,

  posicao\_s INTEGER DEFAULT 0,

  proxima\_revisao DATE,

  intervalo\_revisao\_dias INT DEFAULT 1,

  updated\_at TIMESTAMPTZ DEFAULT NOW\(\),

  UNIQUE\(user\_id, aula\_id\)

\);

CREATE TABLE planos\_acesso \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  user\_id UUID REFERENCES profiles\(id\),

  tipo TEXT CHECK \(tipo IN \('curso','plataforma'\)\),

  curso\_id UUID REFERENCES cursos\(id\),

  pedido\_id UUID,

  inicio TIMESTAMPTZ DEFAULT NOW\(\),

  vencimento TIMESTAMPTZ,

  ativo BOOLEAN DEFAULT TRUE,

  created\_at TIMESTAMPTZ DEFAULT NOW\(\)

\);

CREATE TABLE assinaturas\_plataforma \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  user\_id UUID REFERENCES profiles\(id\),

  plano\_acesso\_id UUID REFERENCES planos\_acesso\(id\),

  gateway\_id TEXT,

  ciclo TEXT CHECK \(ciclo IN \('mensal','anual'\)\),

  valor\_ciclo NUMERIC\(10,2\),

  status TEXT DEFAULT 'ativo' CHECK \(status IN \('ativo','cancelado','suspenso'\)\),

  proximo\_vencimento TIMESTAMPTZ,

  created\_at TIMESTAMPTZ DEFAULT NOW\(\)

\);

CREATE TABLE convites \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  email TEXT NOT NULL,

  curso\_id UUID REFERENCES cursos\(id\),

  plano\_tipo TEXT DEFAULT '90dias' CHECK \(plano\_tipo IN \('90dias','1ano','vitalicio'\)\),

  origem TEXT,

  status TEXT DEFAULT 'pendente' CHECK \(status IN \('pendente','aceito','expirado'\)\),

  token TEXT UNIQUE DEFAULT encode\(gen\_random\_bytes\(16\),'hex'\),

  criado\_em TIMESTAMPTZ DEFAULT NOW\(\), aceito\_em TIMESTAMPTZ,

  expira\_em TIMESTAMPTZ DEFAULT NOW\(\) \+ INTERVAL '90 days'

\);

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

\-\- GRUPO 7: PAGAMENTOS

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

CREATE TABLE pedidos \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  user\_id UUID REFERENCES profiles\(id\),

  curso\_id UUID REFERENCES cursos\(id\),

  cupom\_id UUID,

  tipo\_plano TEXT CHECK \(tipo\_plano IN \(

    '90dias','1ano','vitalicio','plataforma\_anual','plataforma\_vitalicia'\)\),

  valor NUMERIC\(10,2\) NOT NULL,

  desconto NUMERIC\(10,2\) DEFAULT 0,

  status TEXT DEFAULT 'pendente' CHECK \(status IN \(

    'pendente','aprovado','cancelado','reembolsado'\)\),

  gateway\_id TEXT, metodo TEXT,

  created\_at TIMESTAMPTZ DEFAULT NOW\(\)

\);

CREATE TABLE precos\_planos \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  curso\_id UUID REFERENCES cursos\(id\),

  tipo\_plano TEXT NOT NULL CHECK \(tipo\_plano IN \(

    '90dias','1ano','vitalicio','plataforma\_anual','plataforma\_vitalicia'\)\),

  preco NUMERIC\(10,2\) NOT NULL,

  ativo BOOLEAN DEFAULT TRUE,

  created\_at TIMESTAMPTZ DEFAULT NOW\(\)

\);

CREATE TABLE cupons \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  codigo TEXT UNIQUE NOT NULL,

  desconto\_pct NUMERIC\(5,2\), desconto\_fixo NUMERIC\(10,2\),

  curso\_id UUID REFERENCES cursos\(id\),

  valido\_ate TIMESTAMPTZ,

  usos\_max INTEGER, usos\_atual INTEGER DEFAULT 0,

  ativo BOOLEAN DEFAULT TRUE,

  created\_at TIMESTAMPTZ DEFAULT NOW\(\)

\);

ALTER TABLE planos\_acesso ADD CONSTRAINT fk\_planos\_pedido

  FOREIGN KEY \(pedido\_id\) REFERENCES pedidos\(id\);

ALTER TABLE pedidos ADD CONSTRAINT fk\_pedidos\_cupom

  FOREIGN KEY \(cupom\_id\) REFERENCES cupons\(id\);

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

\-\- GRUPO 8: AVALIA├ç├âO DO CURSO

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

CREATE TABLE avaliacoes\_cursos \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  user\_id UUID REFERENCES profiles\(id\),

  curso\_id UUID REFERENCES cursos\(id\),

  nota INTEGER CHECK \(nota BETWEEN 1 AND 5\),

  comentario TEXT,

  created\_at TIMESTAMPTZ DEFAULT NOW\(\),

  UNIQUE\(user\_id, curso\_id\)

\);

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

\-\- GRUPO 9: QUIZ

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

CREATE TABLE quizzes \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  aula\_id UUID REFERENCES aulas\(id\) ON DELETE CASCADE,

  modulo\_id UUID REFERENCES modulos\(id\) ON DELETE CASCADE,

  titulo TEXT NOT NULL, instrucoes TEXT,

  nota\_minima INTEGER DEFAULT 70,

  tentativas\_max INTEGER DEFAULT 0,

  tempo\_max\_min INTEGER,

  mostrar\_gabarito BOOLEAN DEFAULT TRUE

\);

CREATE TABLE quiz\_perguntas \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  quiz\_id UUID REFERENCES quizzes\(id\) ON DELETE CASCADE,

  enunciado TEXT NOT NULL,

  tipo TEXT DEFAULT 'multipla' CHECK \(tipo IN \('multipla','verdadeiro\_falso'\)\),

  explicacao TEXT, ordem INTEGER NOT NULL

\);

CREATE TABLE quiz\_alternativas \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  pergunta\_id UUID REFERENCES quiz\_perguntas\(id\) ON DELETE CASCADE,

  texto TEXT NOT NULL, correta BOOLEAN DEFAULT FALSE, ordem INTEGER NOT NULL

\);

CREATE TABLE quiz\_respostas \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  user\_id UUID REFERENCES profiles\(id\),

  quiz\_id UUID REFERENCES quizzes\(id\),

  respostas\_json JSONB,

  pontuacao INTEGER, aprovado BOOLEAN,

  tentativa INTEGER DEFAULT 1,

  respondido\_em TIMESTAMPTZ DEFAULT NOW\(\)

\);

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

\-\- GRUPO 10: FERRAMENTAS SaaS

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

CREATE TABLE ferramentas \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  nome TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,

  descricao TEXT,

  categoria TEXT,

  usa\_ia BOOLEAN DEFAULT TRUE,

  modelo\_claude TEXT DEFAULT 'claude\-haiku\-4\-5',

  prompt\_sistema TEXT,

  limite\_uso\_mes INTEGER DEFAULT 3,  \-\- 999 = ilimitado

  ativa BOOLEAN DEFAULT TRUE

\);

CREATE TABLE uso\_ferramentas \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  user\_id UUID REFERENCES profiles\(id\),

  ferramenta\_id UUID REFERENCES ferramentas\(id\),

  tokens\_input INTEGER DEFAULT 0, tokens\_output INTEGER DEFAULT 0,

  custo\_usd NUMERIC\(10,6\) DEFAULT 0,

  created\_at TIMESTAMPTZ DEFAULT NOW\(\)

\);

CREATE TABLE simulacoes \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  user\_id UUID REFERENCES profiles\(id\),

  ferramenta\_id UUID REFERENCES ferramentas\(id\),

  tipo TEXT,

  historico JSONB, pontuacao INT, feedback TEXT, duracao\_s INT,

  created\_at TIMESTAMPTZ DEFAULT NOW\(\)

\);

CREATE OR REPLACE FUNCTION limpar\_simulacoes\_antigas\(\) RETURNS TRIGGER AS $$

BEGIN

  DELETE FROM simulacoes WHERE id IN \(

    SELECT id FROM simulacoes

    WHERE user\_id=NEW\.user\_id AND ferramenta\_id=NEW\.ferramenta\_id

    ORDER BY created\_at DESC OFFSET 10\);

  RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg\_limpar\_simulacoes AFTER INSERT ON simulacoes

FOR EACH ROW EXECUTE FUNCTION limpar\_simulacoes\_antigas\(\);

CREATE TABLE ferramenta\_resultados \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  user\_id UUID REFERENCES profiles\(id\),

  ferramenta\_id UUID REFERENCES ferramentas\(id\),

  input\_json JSONB, output\_text TEXT,

  created\_at TIMESTAMPTZ DEFAULT NOW\(\)

\);

CREATE OR REPLACE FUNCTION limpar\_resultados\_antigos\(\) RETURNS TRIGGER AS $$

BEGIN

  DELETE FROM ferramenta\_resultados WHERE id IN \(

    SELECT id FROM ferramenta\_resultados

    WHERE user\_id=NEW\.user\_id AND ferramenta\_id=NEW\.ferramenta\_id

    ORDER BY created\_at DESC OFFSET 5\);

  RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg\_limpar\_resultados AFTER INSERT ON ferramenta\_resultados

FOR EACH ROW EXECUTE FUNCTION limpar\_resultados\_antigos\(\);

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

\-\- GRUPOS 11\-15: COMUNIDADE, APRENDIZADO,

\-\- CERTIFICADOS, ENGAJAMENTO, AUDITORIA

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

CREATE TABLE comunidade\_grupos \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  nome TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,

  curso\_id UUID REFERENCES cursos\(id\),

  tipo TEXT DEFAULT 'curso' CHECK \(tipo IN \('curso','geral','pilar'\)\),

  ordem INTEGER DEFAULT 0

\);

CREATE TABLE grupos\_membros \(

  grupo\_id UUID REFERENCES comunidade\_grupos\(id\) ON DELETE CASCADE,

  user\_id UUID REFERENCES profiles\(id\) ON DELETE CASCADE,

  entrou\_em TIMESTAMPTZ DEFAULT NOW\(\),

  PRIMARY KEY \(grupo\_id, user\_id\)

\);

CREATE TABLE comunidade\_posts \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  grupo\_id UUID REFERENCES comunidade\_grupos\(id\),

  user\_id UUID REFERENCES profiles\(id\),

  conteudo TEXT NOT NULL, fixado BOOLEAN DEFAULT FALSE,

  tipo TEXT DEFAULT 'post' CHECK \(tipo IN \('post','aviso','caso','desafio'\)\),

  created\_at TIMESTAMPTZ DEFAULT NOW\(\)

\);

CREATE TABLE comunidade\_comentarios \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  post\_id UUID REFERENCES comunidade\_posts\(id\) ON DELETE CASCADE,

  user\_id UUID REFERENCES profiles\(id\),

  conteudo TEXT NOT NULL, created\_at TIMESTAMPTZ DEFAULT NOW\(\)

\);

CREATE TABLE post\_curtidas \(

  post\_id UUID REFERENCES comunidade\_posts\(id\) ON DELETE CASCADE,

  user\_id UUID REFERENCES profiles\(id\) ON DELETE CASCADE,

  created\_at TIMESTAMPTZ DEFAULT NOW\(\),

  PRIMARY KEY \(post\_id, user\_id\)

\);

CREATE TABLE notas\_aluno \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  user\_id UUID REFERENCES profiles\(id\),

  aula\_id UUID REFERENCES aulas\(id\),

  conteudo TEXT NOT NULL,

  tipo TEXT DEFAULT 'nota' CHECK \(tipo IN \('nota','reflexao'\)\),

  created\_at TIMESTAMPTZ DEFAULT NOW\(\), updated\_at TIMESTAMPTZ DEFAULT NOW\(\)

\);

CREATE TABLE notificacoes \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  user\_id UUID REFERENCES profiles\(id\),

  tipo TEXT NOT NULL,

  titulo TEXT NOT NULL, corpo TEXT, link TEXT,

  lida BOOLEAN DEFAULT FALSE,

  created\_at TIMESTAMPTZ DEFAULT NOW\(\)

\);

CREATE TABLE certificados \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  user\_id UUID REFERENCES profiles\(id\),

  curso\_id UUID REFERENCES cursos\(id\),

  modulo\_id UUID REFERENCES modulos\(id\),

  codigo TEXT UNIQUE DEFAULT encode\(gen\_random\_bytes\(8\),'hex'\),

  emitido\_em TIMESTAMPTZ DEFAULT NOW\(\),

  UNIQUE\(user\_id, curso\_id\)

\);

CREATE TABLE leads \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  nome TEXT NOT NULL, email TEXT NOT NULL,

  material\_id UUID REFERENCES materiais\(id\),

  origem\_lp TEXT, created\_at TIMESTAMPTZ DEFAULT NOW\(\)

\);

CREATE TABLE metas\_aluno \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  matricula\_id UUID REFERENCES matriculas\(id\),

  meta TEXT NOT NULL, progresso INT DEFAULT 0,

  concluida BOOLEAN DEFAULT FALSE,

  ultimo\_checkin\_em TIMESTAMPTZ,

  created\_at TIMESTAMPTZ DEFAULT NOW\(\)

\);

CREATE TABLE diagnosticos \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  user\_id UUID REFERENCES profiles\(id\),

  curso\_id UUID REFERENCES cursos\(id\),

  perfil\_resultado JSONB, lacunas JSONB,

  trilha\_recomendada TEXT, created\_at TIMESTAMPTZ DEFAULT NOW\(\)

\);

CREATE TABLE planos\_indicacao \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  user\_id UUID REFERENCES profiles\(id\),

  codigo TEXT UNIQUE, conversoes INT DEFAULT 0,

  creditos\_r NUMERIC\(10,2\) DEFAULT 0,

  created\_at TIMESTAMPTZ DEFAULT NOW\(\)

\);

CREATE TABLE roi\_treinamento \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  matricula\_id UUID REFERENCES matriculas\(id\),

  kpi\_nome TEXT, valor\_antes NUMERIC, valor\_depois NUMERIC,

  data\_antes TIMESTAMPTZ, data\_depois TIMESTAMPTZ

\);

CREATE TABLE admin\_log \(

  id UUID DEFAULT gen\_random\_uuid\(\) PRIMARY KEY,

  admin\_id UUID REFERENCES profiles\(id\),

  acao TEXT NOT NULL, tabela TEXT, registro\_id UUID,

  detalhes JSONB, created\_at TIMESTAMPTZ DEFAULT NOW\(\)

\);

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

\-\- FUN├ç├âO: VERIFICA├ç├âO DE ACESSO

\-\- ÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉÔòÉ

CREATE OR REPLACE FUNCTION tem\_acesso\_curso\(p\_user\_id UUID, p\_curso\_id UUID\)

RETURNS BOOLEAN AS $$

BEGIN

  IF EXISTS \(SELECT 1 FROM planos\_acesso

    WHERE user\_id=p\_user\_id AND tipo='plataforma' AND ativo=TRUE

    AND \(vencimento IS NULL OR vencimento>NOW\(\)\)\) THEN RETURN TRUE; END IF;

  IF EXISTS \(SELECT 1 FROM planos\_acesso

    WHERE user\_id=p\_user\_id AND tipo='curso' AND curso\_id=p\_curso\_id AND ativo=TRUE

    AND \(vencimento IS NULL OR vencimento>NOW\(\)\)\) THEN RETURN TRUE; END IF;

  IF EXISTS \(SELECT 1 FROM matriculas

    WHERE user\_id=p\_user\_id AND curso\_id=p\_curso\_id AND status='ativo'\)

    THEN RETURN TRUE; END IF;

  RETURN FALSE;

END; $$ LANGUAGE plpgsql SECURITY DEFINER;

## __7\.3 Pol├¡ticas RLS__

__­ƒñû  PROMPT ÔÇö RLS \(ap├│s criar as 44 tabelas\)__

"Habilite Row Level Security em todas as 44 tabelas\. Pol├¡ticas: \(1\) profiles, notas\_aluno, metas\_aluno, diagnosticos, planos\_indicacao, roi\_treinamento, ferramenta\_resultados: RW apenas pr├│prio registro\. \(2\) matriculas, progresso\_aulas, planos\_acesso, assinaturas\_plataforma, uso\_ferramentas, simulacoes, quiz\_respostas, notificacoes: READ apenas pr├│prio\. \(3\) cursos, pilares, ferramentas, quizzes: todos leem publicados/ativos; admin gerencia todos\. \(4\) aulas: todos leem aulas publicadas de m├│dulos publicados; admin l├¬ todas\. \(5\) materiais: l├│gica verificar\_acesso\_material\(\) ÔÇö gratuito=true OR pilar em materiais\_pilaresÔê®profiles\_pilares OR tem\_acesso\_curso\(\) para cursos em materiais\_cursos\. \(6\) comunidade\_posts/comentarios: membros do grupo leem; criador edita o pr├│prio; admin edita todos\. \(7\) post\_curtidas, grupos\_membros: aluno gerencia os pr├│prios\. \(8\) convites: admin gerencia todos; aluno l├¬ apenas com seu e\-mail\. \(9\) admin\_log: apenas admins leem\. \(10\) avaliacoes\_cursos: todos leem; aluno insere/edita a pr├│pria\. \(11\) precos\_planos, cupons: todos leem ativos; admin gerencia\. \(12\) cursos\_modulos, modulos\_aulas: seguem l├│gica das tabelas pai\."

__­ƒåò  __BIBLIOTECA DE CONTE├ÜDO INTERCAMBI├üVEL \(P2\): Para criar um m├│dulo reutiliz├ível, cadastre com curso\_id=NULL no admin\. Para vincul├í\-lo a um curso, use /admin/cursos/\[slug\]/editar ÔåÆ 'Adicionar m├│dulo da biblioteca'\. O v├¡nculo fica em cursos\_modulos com a ordem definida por curso\. A mesma l├│gica se aplica a aulas via modulos\_aulas\.

# __8\. Estrutura do Projeto Next\.js 15__

__­ƒñû  PROMPT ÔÇö CRIAR O PROJETO__

"Crie um projeto Next\.js 15 com TypeScript, Tailwind CSS e shadcn/ui\. Use App Router\. Instale: @supabase/ssr, @supabase/supabase\-js, mercadopago, @anthropic\-ai/sdk, @aws\-sdk/client\-ses, react\-hook\-form, zod, lucide\-react, recharts, date\-fns, jose\. Antes de criar qualquer componente, leia /site\-referencia/ e gere lib/design\-tokens\.ts com a identidade visual extra├¡da\. REGRA P1: Estrutura de rotas OBRIGAT├ôRIA para evitar loop de autentica├º├úo: /app/\(auth\)/login e /app/\(auth\)/cadastro ficam FORA do Route Group protegido\. /app/\(protected\)/aluno/\* e /app/\(protected\)/admin/\* ficam dentro\. Crie a estrutura de pastas abaixo\."

area\-do\-aluno/

Ôö£ÔöÇÔöÇ CLAUDE\.md                        ÔåÉ lido automaticamente pelo Claude Code

Ôö£ÔöÇÔöÇ site\-referencia/                 ÔåÉ index\.html e style\.css do site atual

Ôö£ÔöÇÔöÇ app/

Ôöé   Ôö£ÔöÇÔöÇ \(auth\)/                      ÔåÉ FORA do grupo protegido \(sem verifica├º├úo\)

Ôöé   Ôöé   Ôö£ÔöÇÔöÇ login/page\.tsx

Ôöé   Ôöé   Ôö£ÔöÇÔöÇ cadastro/page\.tsx

Ôöé   Ôöé   ÔööÔöÇÔöÇ auth/confirm/route\.ts

Ôöé   Ôö£ÔöÇÔöÇ \(protected\)/                 ÔåÉ Route Group protegido pelo middleware

Ôöé   Ôöé   Ôö£ÔöÇÔöÇ aluno/

Ôöé   Ôöé   Ôöé   Ôö£ÔöÇÔöÇ dashboard/page\.tsx

Ôöé   Ôöé   Ôöé   Ôö£ÔöÇÔöÇ cursos/

Ôöé   Ôöé   Ôöé   Ôöé   Ôö£ÔöÇÔöÇ page\.tsx         ÔåÉ cat├ílogo \+ buscador IA

Ôöé   Ôöé   Ôöé   Ôöé   ÔööÔöÇÔöÇ \[slug\]/

Ôöé   Ôöé   Ôöé   Ôöé       Ôö£ÔöÇÔöÇ page\.tsx     ÔåÉ p├ígina do curso

Ôöé   Ôöé   Ôöé   Ôöé       ÔööÔöÇÔöÇ aula/\[id\]/page\.tsx

Ôöé   Ôöé   Ôöé   Ôö£ÔöÇÔöÇ materiais/page\.tsx

Ôöé   Ôöé   Ôöé   Ôö£ÔöÇÔöÇ comunidade/\[slug\]/page\.tsx

Ôöé   Ôöé   Ôöé   Ôö£ÔöÇÔöÇ ferramentas/\[slug\]/page\.tsx

Ôöé   Ôöé   Ôöé   Ôö£ÔöÇÔöÇ simuladores/\[tipo\]/page\.tsx

Ôöé   Ôöé   Ôöé   ÔööÔöÇÔöÇ perfil/page\.tsx

Ôöé   Ôöé   ÔööÔöÇÔöÇ admin/

Ôöé   Ôöé       Ôö£ÔöÇÔöÇ page\.tsx             ÔåÉ KPIs

Ôöé   Ôöé       Ôö£ÔöÇÔöÇ alunos/page\.tsx

Ôöé   Ôöé       Ôö£ÔöÇÔöÇ cursos/

Ôöé   Ôöé       Ôöé   Ôö£ÔöÇÔöÇ page\.tsx

Ôöé   Ôöé       Ôöé   ÔööÔöÇÔöÇ \[slug\]/editar/page\.tsx  ÔåÉ editor hier├írquico

Ôöé   Ôöé       Ôö£ÔöÇÔöÇ materiais/page\.tsx

Ôöé   Ôöé       Ôö£ÔöÇÔöÇ biblioteca/page\.tsx   ÔåÉ m├│dulos e aulas reutiliz├íveis

Ôöé   Ôöé       Ôö£ÔöÇÔöÇ pilares/page\.tsx

Ôöé   Ôöé       Ôö£ÔöÇÔöÇ planos/page\.tsx

Ôöé   Ôöé       Ôö£ÔöÇÔöÇ cupons/page\.tsx

Ôöé   Ôöé       Ôö£ÔöÇÔöÇ convites/page\.tsx

Ôöé   Ôöé       Ôö£ÔöÇÔöÇ ferramentas/page\.tsx

Ôöé   Ôöé       Ôö£ÔöÇÔöÇ custos\-ia/page\.tsx

Ôöé   Ôöé       Ôö£ÔöÇÔöÇ configuracoes/page\.tsx

Ôöé   Ôöé       Ôö£ÔöÇÔöÇ saude/page\.tsx        ÔåÉ health check rotas cr├¡ticas \(P3\)

Ôöé   Ôöé       ÔööÔöÇÔöÇ log/page\.tsx

Ôöé   Ôö£ÔöÇÔöÇ certificados/\[codigo\]/page\.tsx  ÔåÉ p├║blico

Ôöé   Ôö£ÔöÇÔöÇ api/

Ôöé   Ôöé   Ôö£ÔöÇÔöÇ webhooks/mercadopago/route\.ts

Ôöé   Ôöé   Ôö£ÔöÇÔöÇ pagamentos/criar\-preferencia/route\.ts

Ôöé   Ôöé   Ôö£ÔöÇÔöÇ cupons/validar/route\.ts

Ôöé   Ôöé   Ôö£ÔöÇÔöÇ ferramentas/\[slug\]/route\.ts

Ôöé   Ôöé   Ôö£ÔöÇÔöÇ catalogo/buscar/route\.ts  ÔåÉ buscador IA \(P3\)

Ôöé   Ôöé   Ôö£ÔöÇÔöÇ simulacoes/analisar/route\.ts

Ôöé   Ôöé   Ôö£ÔöÇÔöÇ simuladores/token/route\.ts

Ôöé   Ôöé   Ôö£ÔöÇÔöÇ storage/signed\-url/route\.ts

Ôöé   Ôöé   Ôö£ÔöÇÔöÇ leads/registrar/route\.ts

Ôöé   Ôöé   ÔööÔöÇÔöÇ saude/check/route\.ts      ÔåÉ health check \(P3\)

Ôöé   Ôö£ÔöÇÔöÇ layout\.tsx

Ôöé   ÔööÔöÇÔöÇ page\.tsx

Ôö£ÔöÇÔöÇ lib/

Ôöé   Ôö£ÔöÇÔöÇ design\-tokens\.ts             ÔåÉ EXTRA├ìDO DO SITE ATUAL

Ôöé   Ôö£ÔöÇÔöÇ supabase/client\.ts \+ server\.ts

Ôöé   Ôö£ÔöÇÔöÇ mercadopago\.ts

Ôöé   Ôö£ÔöÇÔöÇ anthropic\.ts                 ÔåÉ calcCusto \+ modelPricing

Ôöé   Ôö£ÔöÇÔöÇ email\.ts

Ôöé   ÔööÔöÇÔöÇ token\.ts                     ÔåÉ JWT para simuladores HTML

Ôö£ÔöÇÔöÇ middleware\.ts                    ÔåÉ protege \(protected\)/\* \+ rate limit /api/\*

ÔööÔöÇÔöÇ types/database\.types\.ts

__­ƒöÆ  __REGRA P1 ÔÇö Rate limiting: aplicar EXCLUSIVAMENTE em rotas /api/\*\. Aplicar em rotas de p├íginas derruba o site \(1 visita dispara 15\-20 requisi├º├Áes de assets\)\. Limite recomendado: 120 req/min por IP em /api/\*\. Use middleware\.ts para esta l├│gica\.

# __9\. M├│dulos M1 a M8 ÔÇö Prompts para o Claude Code__

Passe estes prompts em sequ├¬ncia\. Valide cada m├│dulo antes de avan├ºar\.

__­ƒñû  M├ôDULO 1 ÔÇö Autentica├º├úo, Perfil e Pilares__

"Implemente autentica├º├úo com Supabase Auth\. REGRA P1 OBRIGAT├ôRIA: /login e /cadastro ficam em /app/\(auth\)/ FORA do Route Group \(protected\)\. Se ficarem dentro, ocorre loop infinito de redirecionamento\. \(1\) /login com email\+senha e Google\. \(2\) /cadastro: nome, email, senha; aceite LGPD salvando lgpd\_aceito\_em e lgpd\_versao; ap├│s cadastro, tela de sele├º├úo de pilares buscados da tabela pilares \(NUNCA hardcodar\)\. \(3\) Middleware em \(protected\)/\*: verificar sess├úo \+ em rotas de conte├║do chamar tem\_acesso\_curso\(\)\. \(4\) /perfil: edi├º├úo de nome, foto, bio, LinkedIn e pilares\. \(5\) Modal ADI na primeira abertura de curso matriculado ÔÇö metas sem limite de 3\."

__­ƒñû  M├ôDULO 2 ÔÇö Cat├ílogo, Player e Buscador IA \(P3\)__

"Implemente o m├│dulo de cursos\. \(1\) /aluno/cursos: grid de cards\. Filtro por pilar buscado da tabela pilares\. Pre├ºo: buscar em precos\_planos \(ativo=TRUE\); se preco\_promo\_ate>NOW\(\) exibir promocional\. Nota m├®dia calculada de avaliacoes\_cursos\. BUSCADOR IA \(P3\): campo de texto livre no topo ÔÇö ex: 'sou consultor imobili├írio iniciante'\. Ao submeter, chamar /api/catalogo/buscar que envia a descri├º├úo ao claude\-haiku\-4\-5 com o cat├ílogo de cursos publicados e retorna os 3 mais relevantes com justificativa\. \(2\) /cursos/\[slug\]: se├º├Áes o\_que\_voce\_vai\_aprender, para\_quem\_e\_este\_curso, requisitos; trailer se video\_apresentacao\_id preenchido; avalia├º├Áes; seletor de plano\. Campo de cupom ÔåÆ /api/cupons/validar\. \(3\) /cursos/\[slug\]/aula/\[id\]: verificar tem\_acesso\_curso\(\)\. Player condicional por tipo de aula\. YouTube: seekTo\(posicao\_s\) ao carregar, controles de velocidade 0\.75x/1x/1\.25x/1\.5x/2x, salvar posicao\_s a cada 30s\. Modal de reflex├úo ao concluir se pergunta\_reflexao preenchida\. SM\-2 em proxima\_revisao\. Ao atingir 100%: certificado \+ modal de avalia├º├úo \+ upsell\."

__­ƒñû  M├ôDULO 3 ÔÇö Materiais, PDFs e Simuladores HTML__

"Implemente /aluno/materiais\. Visibilidade: gratuito=true ÔåÆ todos\. pilar em materiais\_pilares Ôê® profiles\_pilares do aluno ÔåÆ logados\. tem\_acesso\_curso\(\) para cursos em materiais\_cursos ÔåÆ matriculados\. Download: signed URL 60min\. Simulador: JWT 15min ÔåÆ \[url\_externa\]?token=\[jwt\]\. Material gratuito: captura nome\+email ÔåÆ leads com origem\_lp ÔåÆ SES \+ Google Sheets\. Na p├ígina da aula: exibir materiais de aulas\_materiais inline abaixo do player\."

__­ƒñû  M├ôDULO 4 ÔÇö Pagamentos, Planos, Cupons, Convites e Certificados__

"PAGAMENTOS: /api/pagamentos/criar\-preferencia ÔÇö buscar pre├ºo em precos\_planos; validar cupom se informado; calcular vencimento \(90d/365d/NULL\)\. CUPONS: /admin/cupons CRUD\. /api/cupons/validar retorna desconto\. CONVITES: /admin/convites com import CSV \(email,curso\_id,plano\_tipo,origem\)\. Cadastro por convite: /cadastro?token=\[token\] ÔÇö bloquear e\-mail diferente; criar matr├¡cula origem=convite \+ plano\_acesso\. CERTIFICADOS: ao atingir 100%, gerar PDF com: nome do aluno, nome do curso, carga hor├íria, matriculado\_em, concluido\_em, logo do professor \(configur├ível\), assinatura digital \(configur├ível\), QR Code ÔåÆ /certificados/\[codigo\]\. Enviar por e\-mail\. Modal de avalia├º├úo \(1\-5 estrelas \+ coment├írio opcional\) ÔåÆ avaliacoes\_cursos\."

__­ƒñû  M├ôDULO 5 ÔÇö Quiz e Avalia├º├Áes__

"Player de aula tipo='quiz': carregar quiz vinculado ├á aula\. Verificar tentativas\_max \(0=ilimitado\)\. Cron├┤metro se tempo\_max\_min preenchido\. Perguntas uma a uma\. Ao submeter: salvar quiz\_respostas, calcular pontuacao, determinar aprovado \(>=nota\_minima\)\. Se mostrar\_gabarito=TRUE: exibir acertos/erros \+ campo explicacao\. Aula tipo='quiz': conclu├¡da apenas se aprovado=TRUE\. Admin /admin/quizzes: CRUD completo com editor de perguntas\."

__­ƒñû  M├ôDULO 6 ÔÇö Dashboard Admin com Biblioteca de Conte├║do__

"\(1\) KPIs: recharts\. \(2\) /admin/cursos/\[slug\]/editar: EDITOR HIER├üRQUICO ÔÇö duas colunas: esquerda=m├│dulos com drag\-and\-drop de ordem; direita=aulas do m├│dulo selecionado com drag\-and\-drop\. Bot├úo 'Adicionar m├│dulo': \(a\) Novo m├│dulo; \(b\) M├│dulo da biblioteca \(lista cursos\_modulos com curso\_id NULL\)\. Bot├úo 'Adicionar aula': \(a\) Nova aula; \(b\) Aula da biblioteca\. Drawer de edi├º├úo de aula por tipo\. Preview como aluno\. CRUD de materiais da aula via aulas\_materiais\. \(3\) /admin/biblioteca: listar m├│dulos e aulas com curso\_id/modulo\_id NULL; criar/editar/excluir; ver em quais cursos est├úo vinculados\. \(4\) /admin/materiais CRUD\. \(5\) /admin/pilares CRUD drag\-and\-drop\. \(6\) /admin/planos: tabela precos\_planos por curso\. \(7\) /admin/cupons CRUD\. \(8\) /admin/convites CSV\. \(9\) /admin/configuracoes: logo URL, assinatura URL, e\-mails\. \(10\) /admin/custos\-ia\. \(11\) /admin/log: admin\_log com filtros\. Toda a├º├úo destrutiva: snapshot em admin\_log\."

__­ƒñû  M├ôDULO 7 ÔÇö Comunidade e Notifica├º├Áes In\-App__

"\(1\) /aluno/comunidade: lista grupos\. Bot├úo Entrar/Sair \(grupos\_membros\)\. Feed com tipos\. Curtidas via post\_curtidas\. \(2\) Header global: ├¡cone de sino com badge COUNT notificacoes lida=FALSE\. Drawer com lista \+ 'Marcar todas como lidas'\. \(3\) Admin: fixar e excluir posts\."

__­ƒñû  M├ôDULO 8 ÔÇö E\-mails, CRON e Engajamento__

"E\-mails via AWS SES \+ notificacao in\-app para: cadastro, matr├¡cula, vencimento 7 dias, vencimento hoje, novo material no curso, certificado emitido, convite externo, material gratuito\. CRON segunda 8h: inatividade 7 dias, progresso<10% e matr├¡cula>14 dias, check\-in de metas \(ultimo\_checkin>7 dias\), revis├úo espa├ºada \(proxima\_revisao=TODAY\(\)\)\."

# __10\. M├│dulos M9 a M12 ÔÇö IA__

__ÔÜá´©Å  __Antes de qualquer m├│dulo de IA: limite USD 50 em platform\.anthropic\.com ÔåÆ Billing ÔåÆ Spend Limits\. limite\_uso\_mes=999 = ilimitado\. Ferramentas \(formul├írioÔåÆtexto\) salvam em ferramenta\_resultados\. Simuladores \(roleplay multi\-turno\) salvam em simulacoes\.

// lib/anthropic\.ts

export const modelPricing = \{

  'claude\-haiku\-4\-5':  \{ input: 0\.80, output: 4\.00 \},

  'claude\-sonnet\-4\-6': \{ input: 3\.00, output: 15\.00 \},

\};

export const calcCusto = \(modelo, i, o\) =>

  \(i/1\_000\_000 \* modelPricing\[modelo\]\.input\) \+ \(o/1\_000\_000 \* modelPricing\[modelo\]\.output\);

__­ƒñû  DASHBOARD DO ALUNO ÔÇö /aluno/dashboard \(junto com M2\)__

"Se├º├Áes: \(1\) MEUS CURSOS: progresso % \+ progresso por m├│dulo calculado dinamicamente \+ retomada da ├║ltima posi├º├úo \(posicao\_s>0\) \+ alerta vencimento 7 dias \+ badge 'Certificado dispon├¡vel'\. \(2\) METAS ADI: checkbox \+ bot├úo adicionar\. \(3\) REVISAR HOJE: aulas com proxima\_revisao<=TODAY\(\)\. \(4\) FERRAMENTAS RECENTES: ├║ltimas 3 de uso\_ferramentas\. \(5\) PR├ôXIMOS PASSOS: proximo\_curso\_id ou aleat├│rio mesmo pilar\. \(6\) Banner renova├º├úo se plano vencido\."

__­ƒñû  M├ôDULO 9A ÔÇö Base de Ferramentas__

"\(1\) /aluno/ferramentas: cat├ílogo com filtro por categoria\. Usos no m├¬s vs limite\. \(2\) /api/ferramentas/\[slug\]: verificar limite; streaming; salvar uso \+ ferramenta\_resultados \(trigger limpa >5\)\. \(3\) /aluno/ferramentas/\[slug\]/historico: ├║ltimas 5 de ferramenta\_resultados\."

__­ƒñû  M├ôDULO 9B ÔÇö PHD Ramp \(P2 ÔÇö REQ\-16\)__

"Crie /aluno/ferramentas/phd\-ramp\. Formul├írio: cargo, setor, tamanho da equipe, produto/servi├ºo, principal desafio no onboarding\. INSERT ferramentas: nome='PHD Ramp', slug='phd\-ramp', categoria='Gestao Comercial', usa\_ia=TRUE, modelo='claude\-haiku\-4\-5', limite\_uso\_mes=3, prompt\_sistema='Voc├¬ ├® o Prof\. Paulo Donassolo\. Crie um Plano de Ramp Up de Vendedor completo\. Inclua: semana 1 \(imers├úo, produto e ICP\), semana 2 \(processo e obje├º├Áes\), semana 3 \(campo\), semana 4 \(negocia├º├Áes independentes\), KPIs por semana, scripts de feedback semanal\. Portugu├¬s brasileiro, exemplos de PMEs\. Markdown com t├¡tulos e tabelas\.'"

__­ƒñû  M├ôDULO 9C ÔÇö Matriz de Obje├º├Áes \(P2 ÔÇö REQ\-11\)__

"Crie /aluno/ferramentas/matriz\-objecoes\. Formul├írio: produto\_servico, segmento \(select de pilares ativos\), objecoes\_conhecidas\. INSERT: nome='Matriz de Obje├º├Áes', slug='matriz\-objecoes', categoria='Negociacao', usa\_ia=TRUE, modelo='claude\-haiku\-4\-5', limite\_uso\_mes=3, prompt='Voc├¬ ├® o Prof\. Paulo Donassolo\. 12\-15 obje├º├Áes reais\. Para cada: Nome, Contexto, Resposta recomendada, Argumento de valor, Pergunta de revers├úo\. Tabela Markdown\.' Bot├úo 'Baixar PDF' via window\.print\(\)\."

__­ƒñû  M├ôDULO 9D ÔÇö Construtor de Argument├írio \(P2 ÔÇö REQ\-17\)__

"Crie /aluno/ferramentas/argumentario\. Formul├írio: produto\_servico, publico\_alvo, diferenciais, tom \(Formal/Consultivo/Direto/Relacional\)\. INSERT: nome='Construtor de Argument├írio', slug='argumentario', categoria='Comunicacao', usa\_ia=TRUE, modelo='claude\-haiku\-4\-5', limite\_uso\_mes=3, prompt='Crie 5 formatos: Elevator Pitch 60 palavras, Apresenta├º├úo AIDA 5 par├ígrafos, E\-mail de Prospec├º├úo assunto\+corpo\+CTA, Mensagem WhatsApp 3 linhas, Post LinkedIn 200 palavras\.' Cards com bot├úo de copiar\."

__­ƒñû  M├ôDULO 9E ÔÇö Mapeador de Perfil de Negocia├º├úo \(P2 ÔÇö REQ\-19\)__

"20 perguntas situacionais\. INSERT: nome='Mapeador de Perfil de Negocia├º├úo', slug='perfil\-negociacao', categoria='Negociacao', usa\_ia=TRUE, modelo='claude\-sonnet\-4\-6', limite\_uso\_mes=2, prompt='Analise 20 respostas\. Retorne APENAS JSON: perfil\_predominante, pontuacao\_5\_dimensoes \{Competitivo/Colaborativo/Evitativo/Acomodativo/Compromissador: 0\-100\}, forcas\[3\], riscos\[3\], situacoes\_forte\[2\], situacoes\_cuidado\[2\], plano\_desenvolvimento\[2 par├ígrafos\], indice\_confianca\{valor:0\-100, descricao\}\.' Gr├ífico radar recharts \+ relat├│rio\. Salvar em ferramenta\_resultados\."

__­ƒñû  M├ôDULO 10 ÔÇö Simulador de Negocia├º├úo \(P2 ÔÇö REQ\-09\)__

"INSERT: nome='Simulador de Negocia├º├úo', slug='sim\-negociacao', categoria='Negociacao', usa\_ia=TRUE, modelo='claude\-sonnet\-4\-6', limite\_uso\_mes=5\. Configura├º├úo: perfil do cliente, contexto, produto, dificuldade\. Chat com streaming\. Bot├úo 'Finalizar': /api/simulacoes/analisar ÔåÆ pontuacao \+ feedback 6 dimens├Áes \(Identifica├º├úo Necessidades, Manejo Obje├º├Áes, Argumenta├º├úo, Escuta Ativa, Fechamento, ├ìndice de Confian├ºa\)\. Radar 6 dimens├Áes \+ PDF via window\.print\(\)\. /aluno/simuladores/historico: ├║ltimas 10 por ferramenta\."

__­ƒñû  M├ôDULO 11 ÔÇö Coach IA 24/7 \(P4 ÔÇö p├│s\-lan├ºamento\)__

"Requer transcri├º├Áes preenchidas em aulas\.transcricao\. INSERT: nome='Coach de IA', slug='coach\-ia', categoria='Aprendizado', usa\_ia=TRUE, modelo='claude\-haiku\-4\-5', limite\_uso\_mes=30\. RAG: pgvector em aula\_embeddings\. Responde apenas com base nos cursos com tem\_acesso\_curso\(\)=TRUE\. Admin: bot├úo 'Processar Transcri├º├Áes para IA' ÔåÆ embeddings em chunks de 500 palavras\."

__­ƒñû  M├ôDULO 12 ÔÇö Diagn├│stico de Entrada \(P4 ÔÇö p├│s\-lan├ºamento\)__

"15 perguntas ap├│s matr├¡cula e antes da 1┬¬ aula\. INSERT: nome='Diagn├│stico de Entrada', slug='diagnostico\-entrada', modelo='claude\-sonnet\-4\-6', limite\_uso\_mes=3\. JSON: perfil\_atual, lacunas, trilha\_recomendada, meta\_sugerida\. Salvar em diagnosticos\. Pr├®\-preencher ADI antes de redirecionar para trilha\."

# __11\. Integra├º├úo com phdonassolo\.com__

__ÔÜá´©Å  __├ÜNICA altera├º├úo no site principal\. \.htaccess com /go de afiliados deve ser preservado\. Deploy: npm run build ÔåÆ upload APENAS index\.html e assets/ via cPanel\.

__­ƒñû  PROMPT ÔÇö BOT├âO ├üREA DO ALUNO__

"No arquivo de navega├º├úo do site phdonassolo\.com \(Header\.tsx ou similar\), adicione APENAS um bot├úo/link '├ürea do Aluno' apontando para https://alunos\.phdonassolo\.com\. Destaque visual usando lib/design\-tokens\.ts\. Posi├º├úo: canto direito do menu em desktop, menu hamb├║rguer em mobile\. N├âO altere nenhuma outra parte do Header\. N├âO altere o \.htaccess\. N├âO remova rotas existentes\."

# __12\. Roadmap de 60 Dias__

__ÔÜá´©Å  __1 a 2 horas por dia de acompanhamento\. Claude Code executa, mas precisa de direcionamento e valida├º├úo a cada m├│dulo\.

__S__

__Bloco__

__O que acontece__

__Respons├ível__

__Resultado verific├ível__

S1

Funda├º├úo

GitHub \+ Supabase \(S├úo Paulo\) \+ Vercel \+ DNS \+ chaves API \(Mercado Pago, Anthropic, Google Service Account\)

Voc├¬

alunos\.phdonassolo\.com resolve para a Vercel

S2

Funda├º├úo

site\-referencia/ \+ CLAUDE\.md v5\.2 \+ Claude Code \+ design\-tokens\.ts \+ an├ílise reposit├│rios

Voc├¬ \+ Claude Code

design\-tokens\.ts gerado\. 44 tabelas criadas

S3

MVP Core

Schema 44 tabelas \+ RLS \+ M1 \(Auth com Route Groups corretos, pilares din├ómicos, ADI\)

Claude Code

Login sem loop\. Pilares do banco\. ADI ativo

S4

MVP Core

M2 \(Cat├ílogo\+player\+buscador IA\) \+ M4 \(Pagamentos\+planos\+cupons\+convites\+certificado\)

Claude Code

Compra cria plano com prazo\. Cupom funciona\. Certificado PDF com QR

S5

Materiais

M3 \(Materiais por pilar/curso/combinado \+ token simuladores \+ leads Google Sheets\)

Claude Code

Simulador protegido\. Lead na planilha com origem

S6

Admin

M6 \(Admin completo com biblioteca de conte├║do \+ editor hier├írquico\) \+ bot├úo site principal

Claude Code \+ Voc├¬

Biblioteca funciona\. Admin gerencia pilares e planos

S7

Comunidade

M5 \(Quiz\) \+ M7 \(Comunidade\+notifica├º├Áes\) \+ M8 \(E\-mails\+CRON\+revis├úo\) \+ dashboard

Claude Code

Quiz funciona\. Sino com badge\. CRON revis├úo espa├ºada ativo

S8

Ferramentas IA

M9 completo: PHD Ramp \+ Matriz Obje├º├Áes \+ Argument├írio \+ Perfil Negocia├º├úo

Claude Code

4 ferramentas\. Hist├│rico de 5 resultados\. Limites respeitados

S9

Simulador \+ Launch

M10 \(Simulador Negocia├º├úo\) \+ testes checklist 36 itens \+ health check

Claude Code \+ Voc├¬

36/36 aprovados\. Primeiros alunos na plataforma

__Ô£à  __P├ôS\-60 DIAS: M11 Coach IA RAG \+ M12 Diagn├│stico \+ Simuladores Atendimento e JBP \+ Relat├│rio B2B \+ Dashboard m├®tricas avan├ºado \+ Importa├º├úo editorial da planilha

# __13\. Custos ÔÇö Desenvolvimento e Opera├º├úo__

__Bloco__

__Estimativa__

__Observa├º├úo__

S1\-S2 ÔÇö Funda├º├úo

R$ 0

Voc├¬ executa\. Zero tokens Claude Code

S3\-S4 ÔÇö MVP Core

USD 18ÔÇô25 \(~R$ 95ÔÇô130\)

Schema \+ auth \+ cat├ílogo \+ pagamentos

S5\-S6 ÔÇö Materiais e Admin

USD 13ÔÇô20 \(~R$ 70ÔÇô105\)

CRUD admin \+ biblioteca \+ prote├º├úo JWT

S7 ÔÇö Quiz \+ Comunidade \+ E\-mails

USD 8ÔÇô12 \(~R$ 42ÔÇô65\)

Quiz, grupos, CRON, buscador IA

S8 ÔÇö Ferramentas SaaS IA

USD 10ÔÇô15 \(~R$ 53ÔÇô80\)

4 ferramentas \+ Claude API \+ limites

S9 ÔÇö Simulador \+ testes

USD 12ÔÇô18 \(~R$ 65ÔÇô95\)

Simulador \+ itera├º├Áes de corre├º├úo

TOTAL

USD 61ÔÇô90 \(~R$ 325ÔÇô475\)

Inclui itera├º├Áes e testes

__Servi├ºo__

__Custo__

__Condi├º├úo__

HostGator

R$ 0 adicional

J├í pago\. Simuladores HTML permanecem aqui

Vercel Hobby

R$ 0

At├® 100GB banda/m├¬s gratuito

Supabase Free

R$ 0

At├® 50k alunos/m├¬s, 500MB banco, 1GB storage

Supabase Pro

USD 25/m├¬s \(~R$ 130\)

Somente ao ultrapassar os limites free

AWS SES

~R$ 2ÔÇô10/m├¬s

R$ 0,40 por 1\.000 e\-mails

Claude API \(ferramentas\)

~USD 5ÔÇô30/m├¬s \(~R$ 26ÔÇô160\)

Depende do volume\. Limite USD 50 configurado

Mercado Pago

3,49ÔÇô4,99% por venda

Sem mensalidade fixa

TOTAL FIXO MENSAL

< R$ 50/m├¬s

Antes da comiss├úo do Mercado Pago

# __14\. Ritos de Deploy e Atualiza├º├úo__

## __14\.1 Rito de deploy da ├ürea do Aluno__

1. Descreva a mudan├ºa para o Claude Code
2. Claude Code edita os arquivos necess├írios
3. Claude Code: git add \. && git commit \-m 'descricao' && git push
4. Vercel publica automaticamente em 2ÔÇô3 minutos
5. Acesse /admin/saude para verificar as rotas cr├¡ticas \(P3\)
6. Acesse alunos\.phdonassolo\.com para validar visualmente

## __14\.2 Rito de publicar novo simulador HTML__

1. Crie ou atualize o arquivo \.html do simulador
2. Adicione na primeira linha: <?php require\_once 'token\-check\.php'; ?>
3. HostGator cPanel ÔåÆ File Manager ÔåÆ public\_html/simuladores/ ÔåÆ upload
4. Em /admin/materiais: tipo='simulador', url\_externa='https://phdonassolo\.com/simuladores/nome\.html', vincule ao curso
5. Teste: clicar 'Abrir Simulador' ÔåÆ abre no HostGator\. URL direta ÔåÆ redireciona para login

## __14\.3 Rito de adicionar curso com m├│dulos da biblioteca__

1. Em /admin/cursos: criar novo curso com dados b├ísicos
2. Em /admin/cursos/\[slug\]/editar: 'Adicionar m├│dulo' ÔåÆ 'Da biblioteca'
3. Selecionar m├│dulo existente ÔåÆ definir ordem no curso
4. Para aulas novas no m├│dulo: 'Adicionar aula' ÔåÆ tipo ÔåÆ youtube\_id ou conteudo\_html
5. Publicar curso ÔåÆ testar acesso como aluno via 'Preview como aluno'

## __14\.4 Rito de atualiza├º├úo do site principal \(phdonassolo\.com\)__

__ÔÜá´©Å  __N├âO muda em rela├º├úo ao processo atual\.

1. Altera├º├Áes no c├│digo React localmente
2. npm run build
3. HostGator cPanel ÔåÆ File Manager ÔåÆ upload APENAS de: index\.html e pasta assets/
4. NUNCA sobrescrever: \.htaccess, wordpress/, lp/, simuladores/

# __15\. Checklist de Valida├º├úo Final ÔÇö 36 Itens__

## __Bloco 1 ÔÇö Infraestrutura \(S2\)__

__Item__

__Como validar__

__S__

DNS e SSL

alunos\.phdonassolo\.com carrega com cadeado verde

2

Identidade visual

Comparar lado a lado ÔÇö fontes e cores id├¬nticas ao phdonassolo\.com

2

Login Google

Entrar com Google ÔåÆ autorizar ÔåÆ logado

3

Login e\-mail \+ LGPD

Cadastrar ÔåÆ lgpd\_aceito\_em salvo em profiles

3

## __Bloco 2 ÔÇö Seguran├ºa P1 \(S3\)__

__Item__

__Como validar__

__S__

Login SEM loop infinito

/admin/login carrega sem redirecionar para si mesmo

3

Rate limit s├│ em /api/\*

Abrir /cursos ÔåÆ 20 assets carregam sem erro 429

3

Slug sem acento

Criar curso 'Gest├úo Comercial' ÔåÆ slug gerado 'gestao\-comercial'

3

Senha obrigat├│ria no login

Tentar acessar com email v├ílido sem senha ÔåÆ bloqueado

3

## __Bloco 3 ÔÇö Pilares, Perfil e M├│dulos \(S3\)__

__Item__

__Como validar__

__S__

Pilares pelo admin

/admin/pilares ÔåÆ criar ÔåÆ aparecer no cadastro

3

M├║ltiplos pilares no aluno

Cadastrar com 2 pilares ÔåÆ profiles\_pilares com 2 registros

3

Cat├ílogo filtrado

Aluno pilar X ÔåÆ cursos do pilar pr├®\-filtrados

3

Aula tipo texto

Criar aula tipo='texto' ÔåÆ player exibe HTML sem v├¡deo

3

Aula tipo live

Criar tipo='live' ÔåÆ exibe data\_live e bot├úo de acesso

3

Status rascunho

Aula rascunho ÔåÆ invis├¡vel para aluno, vis├¡vel no admin

3

## __Bloco 4 ÔÇö Player, Notas e Revis├úo \(S4\)__

__Item__

__Como validar__

__S__

Retomada de v├¡deo

Assistir 2min ÔåÆ sair ÔåÆ voltar ÔåÆ v├¡deo retoma do segundo salvo

4

Controle de velocidade

Bot├úo 1\.5x ÔåÆ playback muda visivelmente

4

Pergunta de reflex├úo

Aula com pergunta ÔåÆ modal ao concluir ÔåÆ nota tipo='reflexao' salva

4

Revis├úo espa├ºada

Concluir aula ÔåÆ proxima\_revisao = hoje\+1d

4

'Revisar hoje' no dashboard

For├ºar proxima\_revisao=hoje ÔåÆ aparece no dashboard

4

Progresso por m├│dulo

Sidebar exibe '2/5 aulas' por m├│dulo

4

## __Bloco 5 ÔÇö Planos, Cupons e Certificados \(S4\)__

__Item__

__Como validar__

__S__

Pre├ºo de precos\_planos

Editar pre├ºo no admin ÔåÆ LP atualiza sem redeploy

4

Cupom percentual

Cupom 20% ÔåÆ desconto correto no checkout

4

Cupom expirado ÔåÆ erro

Cupom vencido ÔåÆ mensagem clara

4

Plano 90 dias

Comprar ÔåÆ vencimento=hoje\+90d

4

Acesso vencido ÔåÆ bloqueio

Vencimento ontem ÔåÆ aula bloqueia ÔåÆ redireciona renova├º├úo

4

Convite e\-mail errado

Cadastrar com e\-mail diferente do convite ÔåÆ bloqueado

4

Certificado completo

PDF com logo, assinatura, QR, datas in├¡cio/conclus├úo

4

## __Bloco 6 ÔÇö Biblioteca, Materiais e Quiz \(S5ÔÇôS7\)__

__Item__

__Como validar__

__S__

M├│dulo da biblioteca em 2 cursos

M├│dulo biblioteca ÔåÆ vincular a curso A e curso B ÔåÆ aparece nos dois

6

Atualizar m├│dulo compartilhado

Editar t├¡tulo do m├│dulo biblioteca ÔåÆ t├¡tulo atualiza nos dois cursos

6

Material por pilar

Aluno pilar X v├¬ material pilar X, n├úo v├¬ pilar Y

5

Material dentro da aula

aulas\_materiais preenchido ÔåÆ arquivo abaixo do player na aula

5

Lead para Google Sheets

Baixar material gratuito ÔåÆ linha na planilha com origem\_lp

5

Quiz: aula conclu├¡da s├│ se aprovado

Reprovar quiz ÔåÆ aula n├úo marcada conclu├¡da

7

Quiz: gabarito com explica├º├úo

Responder ÔåÆ acertos/erros \+ campo explicacao exibido

7

## __Bloco 7 ÔÇö Comunidade, Notifica├º├Áes e Ferramentas IA \(S7ÔÇôS9\)__

__Item__

__Como validar__

__S__

Curtida em post

Curtir ÔåÆ contagem \+1\. Descurtir ÔåÆ \-1

7

Notifica├º├úo in\-app

A├º├úo trigger ÔåÆ sino com badge ÔåÆ drawer mostra notifica├º├úo

7

PHD Ramp

Preencher ÔåÆ plano streaming ÔåÆ salvo em ferramenta\_resultados

8

Hist├│rico de ferramenta

5 resultados ÔåÆ gerar 6┬║ ÔåÆ mais antigo some

8

Buscador IA no cat├ílogo

'sou consultor imobili├írio' ÔåÆ 3 cursos sugeridos com justificativa

8

Simulador de Negocia├º├úo

Configurar ÔåÆ simular ÔåÆ radar 6 dimens├Áes ÔåÆ download PDF

9

Hist├│rico de simula├º├Áes

10 simula├º├Áes ÔåÆ adicionar 11┬¬ ÔåÆ mais antiga some

9

Admin log

Cancelar acesso ÔåÆ registro em admin\_log com snapshot

9

Mobile 375px

Sem scroll horizontal em todas as telas

9

Site principal intacto

phdonassolo\.com OK\. \.htaccess preservado\. /go ativos

9

# __16\. Mapa de Requisitos ÔÇö 43 Funcionalidades__

## __Implementados nos 60 dias \(P2\)__

__REQ__

__Funcionalidade__

__M├│dulo__

__Semana__

REQ\-02

Trilhas por perfil profissional

M2

S3ÔÇôS4

REQ\-04

Certificado com QR e verifica├º├úo p├║blica

M4

S4

REQ\-07

ADI ÔÇö Agenda de Desenvolvimento Individual

M1

S3

REQ\-24

Detec├º├úo de risco de evas├úo

M8

S7

REQ\-29

Desafio Semanal na Comunidade

M7

S7

REQ\-27

Feed de Casos Reais

M7

S7

REQ\-42

Upsell inteligente p├│s\-conclus├úo

M2

S4

REQ\-16

PHD Ramp

M9

S8

REQ\-11

Gerador de Matriz de Obje├º├Áes

M9

S8

REQ\-17

Construtor de Argument├írio

M9

S8

REQ\-19

Mapeador de Perfil de Negocia├º├úo

M9

S8

REQ\-09

Simulador de Negocia├º├úo: O Cliente Dif├¡cil

M10

S9

REQ\-43

├ìndice de Confian├ºa do Vendedor

M9\+M10

S8ÔÇôS9

## __P├│s\-60 dias \(P4 e P5\)__

__REQ__

__Funcionalidade__

__Prioridade__

__Motivo do prazo__

REQ\-23

Coach de IA 24/7 \(RAG\)

P4

Requer transcri├º├Áes preenchidas

REQ\-22

Diagn├│stico de Entrada

P4

Calibrar com feedback real de alunos

REQ\-10

Simulador de Atendimento

P4

Arquitetura pronta no M10

REQ\-13

Simulador de JBP

P4

Idem REQ\-10

REQ\-38

Planos em tiers

P4

Validar pricing com alunos reais

REQ\-34

Relat├│rio para gestores B2B

P4

Depende de clientes corporativos

REQ\-40

Turmas fechadas corporativas

P4

Mesma l├│gica B2B

REQ\-37

ROI de Treinamento

P4

Requer dados hist├│ricos

REQ\-03

Microlearning e revis├úo avan├ºada

P5

Dados acumulados 3\+ meses

REQ\-33

Mapa de compet├¬ncias visual

P5

M├║ltiplos diagn├│sticos no tempo

REQ\-05

Estudo em dupla

P5

Massa cr├¡tica de alunos simult├óneos

# __17\. Mapa Completo de Prioridades ÔÇö P1 a P5__

Refer├¬ncia consolidada de todas as funcionalidades, decis├Áes e regras com sua prioridade expl├¡cita\. Consultar antes de cada sprint\.

## __P1 ÔÇö CR├ìTICO: Implementar ANTES da primeira linha de c├│digo__

__­ƒöÆ  __Estas regras previnem os 3 bugs mais comuns em projetos LMS constru├¡dos rapidamente\. Documentados em produ├º├úo real \(projeto Brasil GEO, mar├ºo 2026\)\.

__Regra__

__Onde aplicar__

__O que acontece se ignorar__

Rate limiting APENAS em /api/\*

middleware\.ts

1 visita dispara 15\-20 requisi├º├Áes de assets\. Site fica inacess├¡vel para todos os usu├írios\. Erro 429 em vez de HTML\.

/admin/login FORA do Route Group protegido

/app/\(auth\)/login ÔÇö NUNCA dentro de \(protected\)

Layout verifica sess├úo ÔåÆ redireciona para login ÔåÆ herda layout ÔåÆ loop infinito\. Painel admin inacess├¡vel\.

Slugs sempre ASCII sem acentos

Toda cria├º├úo de slug no c├│digo e no admin

Script de corre├º├úo de acentos quebra URLs\. 55\+ links internos quebrados simultaneamente\.

Validar senha em todo endpoint de auth

Todos os /api/auth/\*

Atacante com e\-mail do admin acessa o sistema sem senha \(vulnerabilidade cr├¡tica de bypass\)\.

ANTHROPIC\_API\_KEY apenas no servidor

/api/\* nunca no frontend

Chave exposta no bundle JS\. Qualquer pessoa pode usar sua cota da API\.

tem\_acesso\_curso\(\) em toda rota de conte├║do

middleware e /api/cursos/\*

Aluno com plano vencido continua acessando conte├║do pago\.

## __P2 ÔÇö ALTA: Implementar nos 60 dias \(MVP\)__

__Funcionalidade__

__M├│dulo__

__Semana__

__Observa├º├úo__

Schema 44 tabelas \+ RLS

Banco

S3

Base de tudo\. N├úo come├ºar c├│digo sem o banco validado

Biblioteca de m├│dulos \(cursos\_modulos, modulos\_aulas\)

Banco

S3

Evita duplica├º├úo de conte├║do\. Custo zero se feito agora, alto se feito depois

Autentica├º├úo \+ pilares din├ómicos

M1

S3

Pilares NUNCA hardcodados

Player com tipos de aula \(v├¡deo/texto/quiz/download/link/live\)

M2

S4

Cada tipo renderiza componente diferente\. Definir no schema evita retrabalho

Retomada de v├¡deo \(seekTo \+ salvar a cada 30s\)

M2

S4

Experi├¬ncia b├ísica esperada por qualquer aluno

Pergunta de reflex├úo ao concluir aula

M2

S4

Andragogia: adulto aprende melhor com reflex├úo imediata

Revis├úo espa├ºada \(SM\-2 simplificado\)

M2

S4

Diferencial competitivo\. Dados preparados no schema\. Custo de implementa├º├úo baixo

Pagamentos \+ precos\_planos configur├íveis

M4

S4

Pre├ºos edit├íveis sem redeploy

Cupons de desconto

M4

S4

Ferramenta de vendas essencial

Convites com import CSV

M4

S4

Para migra├º├úo de alunos Hotmart/Udemy/ESPM

Certificado PDF com QR \+ campos configur├íveis

M4

S4

Logo e assinatura configur├íveis no admin

Materiais com l├│gica gratuito/pilar/curso/combinado

M3

S5

Controle granular de acesso

Biblioteca de conte├║do no admin

M6

S6

CRUD de m├│dulos/aulas com curso\_id NULL \+ vincula├º├úo

Editor hier├írquico com drag\-and\-drop

M6

S6

Gest├úo de cursos sem c├│digo

Preview como aluno

M6

S6

Validar antes de publicar

Quiz com gabarito e explica├º├úo por pergunta

M5

S7

Avalia├º├úo formativa ÔÇö adultos precisam de feedback imediato

Notifica├º├Áes in\-app \(sino \+ badge\)

M7

S7

Engajamento sem depender s├│ de e\-mail

CRON de revis├úo espa├ºada

M8

S7

E\-mail 'Hora de revisar: \[aula\]' baseado em proxima\_revisao

PHD Ramp

M9

S8

Ferramenta mais relevante para o p├║blico de gestores

Matriz de Obje├º├Áes

M9

S8

Alta demanda do p├║blico comercial

Construtor de Argument├írio

M9

S8

Alta demanda do p├║blico comercial

Mapeador de Perfil de Negocia├º├úo

M9

S8

Diferencial ÔÇö ├ìndice de Confian├ºa

Simulador de Negocia├º├úo

M10

S9

Simulador flagship\. Base para os demais

admin\_log ÔÇö auditoria de a├º├Áes destrutivas

M6

S6

Rastreabilidade\. Baixo custo, alto valor operacional

## __P3 ÔÇö M├ëDIA: Implementar junto com o m├│dulo correspondente se custo for baixo__

__Funcionalidade__

__M├│dulo__

__Observa├º├úo__

Buscador IA no cat├ílogo de cursos

M2

Campo de linguagem natural ÔåÆ haiku\-4\-5 ÔåÆ 3 sugest├Áes\. ~$0,001/busca\. Implementar junto com /aluno/cursos

Rota /admin/saude para health check p├│s\-deploy

M6

Testa rotas cr├¡ticas ap├│s cada push\. ~50 linhas\. Previne bugs silenciosos em produ├º├úo

CSRF via valida├º├úo Origin/Referer em endpoints admin

M6

Prote├º├úo padr├úo\. Implementar junto com as rotas /admin/api/\*

Rate limiter em Redis \(Upstash\) em vez de mem├│ria

M1

Rate limiter em mem├│ria reseta a cada deploy serverless = ineficaz\. Migrar para Upstash Redis no M1

Notas do aluno \+ exportar PDF do curso

M2

Painel colaps├ível na aula\. Export via window\.print\(\)\. Andragogia: anota├º├úo contextual

Avalia├º├úo do curso \(estrelas \+ coment├írio\)

M4

Modal ap├│s certificado\. Aparece na p├ígina de vendas do curso

post\_curtidas na comunidade

M7

Engajamento\. 1 tabela j├í no schema

Check\-in de metas no CRON

M8

E\-mail semanal 'Como est├úo suas metas?' ÔåÆ metas\_aluno\.ultimo\_checkin\_em

codigo\_editorial nos campos \(cursos, modulos, aulas, materiais\)

Banco

Ponte com planilha de planejamento editorial\. Campo simples, custo zero

Hist├│rico de resultados de ferramentas

M9

├Ültimas 5 por ferramenta em ferramenta\_resultados\. J├í no schema, incluir na UI

Trailer do curso \(video\_apresentacao\_id\)

M2

YouTube embed na p├ígina do curso\. 1 campo, alto impacto visual na convers├úo

## __P4 ÔÇö P├ôS\-LAN├çAMENTO: Ap├│s valida├º├úo com usu├írios reais__

__Funcionalidade__

__M├│dulo__

__Por que esperar__

Coach IA 24/7 com RAG

M11

Requer transcri├º├Áes de aulas preenchidas \+ pipeline de embeddings pgvector

Diagn├│stico de Entrada

M12

Calibrar perguntas com base em feedback real de alunos

Simulador de Atendimento

M10 extens├úo

Arquitetura pronta no M10 ÔÇö adicionar novo tipo ├® r├ípido p├│s\-lan├ºamento

Simulador de JBP

M10 extens├úo

Idem Simulador de Atendimento

Importa├º├úo editorial da planilha

Admin

Bot├úo 'Importar como aula' ÔÇö ligar codigo\_editorial da planilha a aulas do banco

Dashboard de m├®tricas avan├ºado

Admin

Alunos ativos 7d, taxa de abandono por aula, ferramentas mais usadas, custo IA acumulado

ROI de Treinamento

M engajamento

Requer dados hist├│ricos antes/depois para ser significativo

Relat├│rio para gestores B2B

Novo m├│dulo

Depende de ter clientes corporativos para desenvolver com feedback real

Turmas fechadas corporativas

Novo m├│dulo

Mesma l├│gica de turmas B2B ÔÇö validar demanda antes de construir

Planos de assinatura em tiers

M4 extens├úo

Validar pricing com base de alunos real antes de definir os tiers

## __P5 ÔÇö LONGO PRAZO: M├®dio prazo, alta complexidade__

__Funcionalidade__

__Complexidade__

__Depend├¬ncia__

Microlearning e revis├úo espa├ºada visual \(REQ\-03\)

M├®dia

Dados hist├│ricos de revis├úo acumulados por 3\+ meses

Mapa de compet├¬ncias visual

Alta

M├║ltiplos diagn├│sticos por aluno ao longo do tempo

Estudo em dupla / pares de aprendizado

Alta

Massa cr├¡tica de alunos simult├óneos online

Transcricao\_json com timestamps \(legendas sincronizadas\)

Alta

Requer processo de gera├º├úo de timestamps por aula

Pipeline de cross\-posting editorial \(BlogÔåÆLPÔåÆE\-mailÔåÆPost\)

Alta

Integra├º├úo com WordPress \+ m├║ltiplos canais\. Planilha atual ├® mais eficiente por ora

GEO / llms\.txt para citabilidade em IAs

M├®dia

Criar /llms\.txt descrevendo cursos e o professor para que ChatGPT/Gemini citem corretamente

Prof\. Paulo Henrique Donassolo  |  phdonassolo\.com  |  Blueprint ├ürea do Aluno v5\.2  |  Mar├ºo 2026

