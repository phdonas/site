# Como Configurar o Deploy Automático (GitHub Actions)

Para que o GitHub consiga publicar seu site na Hostgator automaticamente toda vez que houver uma atualização de código, você precisa configurar 3 "Secrets" (Senhas secretas) no painel do seu repositório. 

## Passo a Passo

1. **Acesse a página do projeto:** Abra [https://github.com/phdonas/site](https://github.com/phdonas/site) no seu navegador.
2. **Abra as Configurações do Repositório:** Logo abaixo do título do projeto (`phdonas/site`), você verá uma barra com várias abas (`Code`, `Issues`, `Pull requests`, etc). Clique na última aba chamada **⚙️ Settings**. *(Atenção: Não é o Settings do seu perfil global no canto superior direito).*
3. **Menu Lateral:** Na nova página, no menu do lado esquerdo, role para baixo até encontrar a categoria **Security**.
4. **Vá em Secrets:** Clique em **Secrets and variables** e depois selecione a opção **Actions**.
5. **Crie os Segredos:** Clique no botão verde chamado **"New repository secret"**. Você precisará criar 3 segredos um por vez:

### Segredo 1
- **Name:** `FTP_SERVER`
- **Secret:** `ftp.phdonassolo.com` *(ou o IP/Endereço FTP indicado no seu painel cPanel)*

### Segredo 2
- **Name:** `FTP_USERNAME`
- **Secret:** *(Digite o seu usuário FTP ou o usuário principal do cPanel)*

### Segredo 3
- **Name:** `FTP_PASSWORD`
- **Secret:** *(Digite a senha do FTP/cPanel)*

---

## Como testar se funcionou?
Após salvar os 3 segredos, basta fazermos qualquer alteração boba no código (ou clicar na aba **Actions** no próprio GitHub) para ver a engrenagem rodar. Ele fará o `build` do site e subirá a pasta `dist` via FTP para o seu Hostgator sozinho em cerca de 2 a 3 minutos.
