# Manual de Configuração: Hotmart (Apenas Checkout)

Este guia documenta o processo passo a passo para cadastrar seus Cursos, Ferramentas e Recursos na Hotmart. O foco desta configuração é utilizar a Hotmart **apenas como Gateway de Pagamento**, mantendo todo o conteúdo e a experiência do usuário restritos à sua própria Área do Aluno.

---

## 1. Criação do Produto
Como não haverá hospedagem de vídeos na Hotmart, a criação do produto foca apenas na "casca" comercial.

1. Acesse o painel da Hotmart e vá em **Produtos > Cadastrar Produto**.
2. Escolha o formato: **Cursos Online, Área de Membros, Serviços de Assinatura** (ou Arquivo/Ebook, dependendo do recurso).
3. Na seção de definição de onde o conteúdo será entregue, selecione **"Outra Plataforma"** (ou pule a configuração do Hotmart Club). Isso avisa à Hotmart que ela não é responsável por hospedar os vídeos ou arquivos.
4. Preencha os dados básicos:
   - **Nome do Produto** (Idêntico ao cadastrado no seu banco de dados).
   - **Descrição** para a página de checkout.
   - **Imagem de Capa** (Use a mesma *thumbnail* do seu sistema).

---

## 2. Configuração de Preços e Ofertas
1. Navegue até a aba **Precificação**.
2. Crie a sua oferta principal (ex: Preço à vista, Parcelamento personalizado, ou Assinatura recorrente).
3. Ative os métodos de pagamento desejados (Pix, Cartão de Crédito, Boleto).

---

## 3. Página de Obrigado (Redirecionamento Pós-Compra)
Para garantir uma experiência sem fricção, o usuário não deve ficar preso nas telas da Hotmart após pagar.

1. Vá em **Página de Produto > Página de Obrigado**.
2. Configure para que, após a aprovação da compra, o usuário seja **redirecionado automaticamente** para a página de Login da sua Área do Aluno (`https://seusite.com/login` ou rota similar).

---

## 4. Configuração do Webhook (O "Cérebro" da Integração)
O Webhook é o mensageiro que avisa a sua Área do Aluno que alguém pagou e precisa ter o acesso liberado.

1. No menu lateral esquerdo, vá em **Navegue > Ferramentas > Webhook (API e Notificações)**.
2. Crie uma nova configuração e insira a **URL do seu Webhook** (o endpoint do seu backend, ex: `https://seusite.com/api/webhooks/hotmart`).
3. Selecione os eventos essenciais que a Hotmart deve enviar:
   - `Compra Aprovada` (Gatilho para criar conta e liberar acesso)
   - `Compra Cancelada` / `Chargeback` (Gatilho para revogar acesso)
   - `Assinatura Cancelada` (Gatilho para inativar acesso recorrente)
4. A Hotmart gerará um **Token de Autenticação (Hottok)**. Guarde essa chave em segurança (no `.env` do servidor ou variáveis do Supabase) para que seu sistema possa validar que a mensagem realmente veio da Hotmart.

---

## 5. Extração do Link de Venda (HotLinks)
Este é o link que conectará o seu botão "Comprar" ao carrinho de compras.

1. Com o produto cadastrado, vá em **Produtos > Sou Produtor > Links de Divulgação (HotLinks)**.
2. Copie a URL correspondente à **"Página de Pagamento"** (Checkout).
3. Cole esta URL no campo `url_checkout` diretamente nos painéis de administração da sua Área do Aluno (aba "Integração Comercial e Vendas").
