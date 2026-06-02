# 📖 MANUAL DO GESTOR DE DOWNLOADS E MATERIAIS

**Arquivo:** `gestor-downloads-materiais-phdsite.html`

---

## 🚀 COMO USAR

### **PASSO 1: Abrir o Gestor**

1. Localize o arquivo: `gestor-downloads-materiais-phdsite.html`
2. **Duplo clique** para abrir no navegador
3. Recomendado: Chrome ou Edge

---

### **PASSO 2: Adicionar Material**

1. Clique no botão **"+ Novo Material"**
2. Preencha os campos:
   - **ID:** Identificador único (ex: `simulador-preco-gas`)
   - **Nome:** Título que aparece no card
   - **Descrição:** Texto curto (opcional)
   - **URL do Material:** Link completo (landing page, YouTube, PDF, etc)
   - **URL da Imagem:** Thumbnail 1200×800
   - **Categoria:** Escolha uma das opções
   - **Canais:** Clique para selecionar (pode selecionar vários)

3. **Preview atualiza automaticamente** enquanto você digita
4. Clique em **"💾 Salvar Material"**

---

### **PASSO 3: Editar Material**

1. Na lista de materiais, clique em **"✏️ Editar"**
2. Faça as alterações
3. Clique em **"💾 Salvar Material"**

---

### **PASSO 4: Deletar Material**

1. Na lista de materiais, clique em **"🗑️ Deletar"**
2. Confirme a exclusão

---

### **PASSO 5: Copiar Código**

1. Clique no botão **"📋 Copiar Código"**
2. Modal abre com o código completo
3. Clique em **"📋 Copiar Código"**
4. O código é copiado automaticamente

---

### **PASSO 6: Atualizar o Site**

1. Abra o arquivo: `C:\Projetos\phdonassolo-site\constants.tsx`
2. Procure por: `export const MOCK_RESOURCES`
3. **Delete** toda a seção antiga
4. **Cole** o código novo que você copiou
5. Salve (Ctrl+S)
6. Build: `npm run build`
7. Deploy: Upload da pasta `dist/`

---

## 📋 CAMPOS EXPLICADOS

### **ID:**
- Identificador único
- Apenas: letras minúsculas, números, hífens
- Exemplos: `simulador-preco`, `guia-dre`, `video-mc`

### **Nome:**
- Título que aparece no card
- Máximo: 60 caracteres
- Exemplo: `Simulador para Cálculo de Preço`

### **Descrição (opcional):**
- Texto curto que aparece abaixo do título
- Máximo: 150 caracteres
- Exemplo: `Calcule preços e margens rapidamente`

### **URL do Material:**
- Link completo para onde o usuário vai ao clicar
- Pode ser:
  - Landing page: `https://phdonassolo.com/lp/simulador`
  - YouTube: `https://youtu.be/ABC123`
  - PDF: `https://phdonassolo.com/downloads/guia.pdf`
  - Qualquer URL externa

### **URL da Imagem:**
- Thumbnail do card
- Resolução: 1200×800 (16:9)
- Caminho: `https://phdonassolo.com/imagens/nome.jpg`
- **IMPORTANTE:** Faça upload da imagem no HostGator antes!

### **Categoria:**
- 🔧 Ferramentas
- 📄 PDFs
- 🎬 Vídeos
- 📊 Planilhas
- 📖 Guias
- 📝 Templates

### **Canais:**
- 👨‍🏫 Prof. Paulo
- 🔥 Academia do Gás
- 🏠 Consultor Imobiliário
- ⏰ 40-50 ou mais
- **Pode selecionar vários!** (clique em cada um)

---

## 💾 SALVAMENTO AUTOMÁTICO

- ✅ Dados salvos no navegador (localStorage)
- ✅ Não perde ao fechar o navegador
- ✅ Funciona offline
- ⚠️ Cada navegador tem seu próprio salvamento

---

## 🎨 PREVIEW EM TEMPO REAL

- Atualiza enquanto você digita
- Mostra como vai ficar no site
- Inclui ícone da categoria
- Visual igual ao site real

---

## 📊 ESTATÍSTICAS

**No topo da página:**
- **Total de Materiais:** Quantos cadastrados
- **Total de Categorias:** Quantas diferentes

---

## 🔧 FUNCIONALIDADES

### **Novo Material:**
- Adiciona um novo material
- Preview em tempo real

### **Editar:**
- Modifica material existente
- Mantém ID original

### **Deletar:**
- Remove material (com confirmação)
- Irreversível!

### **Copiar Código:**
- Gera código do `constants.tsx`
- Copia automaticamente
- Pronto para colar

### **Limpar Tudo:**
- Deleta TODOS os materiais
- Requer confirmação dupla
- Use com cuidado!

---

## ⚠️ IMPORTANTE

### **Upload de Imagens:**
**Antes de cadastrar**, faça upload da thumbnail:

1. Criar imagem 1200×800
2. HostGator → cPanel → File Manager
3. Pasta: `/public_html/imagens/`
4. Upload da imagem
5. URL será: `https://phdonassolo.com/imagens/nome.jpg`

### **Validação de URLs:**
- Sempre use URLs completas
- Comece com `https://`
- Teste a URL no navegador antes

### **IDs Únicos:**
- Nunca use o mesmo ID duas vezes
- Use nomes descritivos
- Sem espaços ou acentos

---

## 🔄 WORKFLOW COMPLETO

```
1. Abrir gestor-downloads-materiais-phdsite.html
2. Criar/editar materiais
3. Copiar código
4. Colar em constants.tsx
5. npm run build
6. Upload dist/ para servidor
7. Testar site
```

---

## 💡 DICAS

### **Organização:**
- Use categorias consistentes
- IDs padronizados (ex: `video-`, `simulador-`, `guia-`)
- Descrições claras e objetivas

### **URLs:**
- Sempre teste antes de salvar
- Para vídeos: use YouTube ou Vimeo
- Para downloads: hospede no servidor

### **Thumbnails:**
- Mantenha padrão visual
- Resolução consistente
- Otimize tamanho (200-500 KB)

---

## 🆘 TROUBLESHOOTING

### **Gestor não abre:**
- Use Chrome ou Edge
- Desative bloqueadores
- Clique direito → Abrir com

### **Dados sumiram:**
- Limpou cache do navegador?
- Navegador diferente? (dados não compartilham)
- Use sempre o mesmo navegador

### **Código não copia:**
- Permita acesso à área de transferência
- Copie manualmente (Ctrl+C)
- Recarregue a página

### **Preview não atualiza:**
- Reload (F5)
- Limpe cache (Ctrl+Shift+R)

---

## 📞 SUPORTE

**Se tiver problemas:**
1. Reload (F5)
2. Limpar cache (Ctrl+Shift+R)
3. Fechar e reabrir navegador
4. Verificar console (F12)

---

## ✅ CHECKLIST

**Antes de fazer deploy:**

- [ ] Todos os materiais cadastrados
- [ ] Thumbnails uploaded no servidor
- [ ] URLs testadas
- [ ] Código copiado
- [ ] constants.tsx atualizado
- [ ] Build sem erros
- [ ] Testado localmente

---

**Gestor pronto para uso! 🚀**
