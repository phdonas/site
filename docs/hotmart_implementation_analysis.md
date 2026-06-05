# Análise de Implementação: Hotmart Exclusiva

Este relatório detalha as necessidades técnicas, comportamentais e o plano de ação (Roadmap) para tornar a Hotmart o único Gateway de Pagamento, operando tanto no site público quanto dentro do LMS (Área do Aluno).

---

## 1. Implementação no Site (`phdonassolo.com`)
O Site atua como vitrine principal, focado na captação de *leads* e novos clientes (primeira compra).

### Mudanças e Implementações
* **Frontend (Botões de Ação):** Os CTAs (Calls to Action) de compra precisarão ser atualizados para ler o campo `url_checkout` (recém-adicionado no banco de dados) ao invés de abrir modais de pagamento próprios.
* **Limpeza de Código Antigo:** Desativar integrações antigas (Stripe/Mercado Pago) do repositório do site público para otimizar o carregamento.
* **Rastreamento (Tracking):** Garantir que os links anexem parâmetros UTM (`?utm_source=site...`) para que as campanhas de tráfego pago marquem as vendas corretamente dentro do painel da Hotmart.

### Fluxo de UX (Aluno / Visitante Novo)
1. **Descoberta:** O visitante entra em uma Landing Page ou na página inicial e decide comprar.
2. **Atrito Zero:** Ao clicar em "Comprar", ele sai do seu site e é direcionado instantaneamente para o checkout segura da Hotmart.
3. **Pagamento:** Insere seus dados do zero (E-mail, Nome, CPF, Cartão/Pix).
4. **Pós-Compra Magico:** 
   - A Hotmart envia o recibo e notifica o nosso sistema (Webhook).
   - O nosso sistema **cria a conta dele silenciosamente** e manda um e-mail de Boas Vindas com o link de acesso à Área do Aluno e uma senha provisória (ou magic link).

---

## 2. Implementação na Área do Aluno (LMS)
A Área do Aluno tem o papel de fidelizar e gerar vendas secundárias (*Upsell / Cross-sell*) para alunos já matriculados.

### Mudanças e Implementações
* **Frontend (Vitrine Interna):** Modificar o botão de "Comprar" dos cursos/ferramentas bloqueados para redirecionar para a `url_checkout` do banco de dados.
* **Passagem de Parâmetros Injetada:** O sistema precisará capturar as informações da sessão do aluno logado (Nome, E-mail, CPF se tiver) e "injetar" na URL da Hotmart.
  * *Exemplo: `hotmart.com/checkout?email=joao@teste.com&name=João`*

### Fluxo de UX (Aluno Logado)
1. **Descoberta Interna:** O aluno clica no cadeado de um curso novo. A tela de vendas interna aparece.
2. **Redirecionamento Confortável:** Ele clica em "Comprar". Ao cair na Hotmart, ele nota que o **seu e-mail e nome já estão preenchidos**. Ele não precisa digitar dados básicos novamente.
3. **Confirmação:** O aluno paga com PIX ou Cartão.
4. **Desbloqueio Automático:** Quando ele fecha a aba da Hotmart e volta para o LMS (que ele já estava logado), o curso aparece instantaneamente na prateleira como "Desbloqueado" sem que ele precise fazer um novo login.

---

## 3. Fluxo de Implementação (Roadmap Técnico)

A execução deste projeto deve seguir uma ordem cronológica que garanta que ninguém fique sem acesso durante a transição.

> [!IMPORTANT]
> **Fase 1: O Cérebro (Backend & Webhooks)**
> 1. Desenvolver a Rota/Endpoint (Supabase Edge Function ou Next.js Route) para escutar a Hotmart (`POST /api/webhooks/hotmart`).
> 2. Programar a lógica de:
>    - Se evento for `PURCHASE_APPROVED`: Buscar e-mail. Se não existir conta, criar conta Supabase Auth + Tabela de Usuários. Em seguida, criar linha na tabela `assinaturas` liberando o curso X.
>    - Se evento for `CANCELED` / `REFUNDED`: Atualizar a tabela de `assinaturas` para status 'bloqueado'.

> [!TIP]
> **Fase 2: O Visual (Frontend Site e LMS)**
> 1. Atualizar o frontend da Área do Aluno para o novo esquema de botões com URLs parametrizadas.
> 2. Atualizar o frontend do Site Institucional para apontar para os mesmos links.

> [!NOTE]
> **Fase 3: Teste e Virada de Chave (Homologação)**
> 1. Utilizar um cartão de teste / boleto teste na Hotmart simulando um comprador inédito (para ver se a conta é criada) e um comprador veterano (para ver se o acesso é somado à conta existente).
> 2. Limpar os códigos de pagamento antigos.
