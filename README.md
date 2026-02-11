# 🤖 Discord Bot — Gerador de Código Rockstar (2FA)

Bot para Discord que gera **códigos temporários (TOTP / 2FA)** da Rockstar via interação com **slash commands, botões e modais**, utilizando **discord.js v14** e **OTPAuth**.

---

## 🚀 Funcionalidades

* Slash command `/codigo_rockstar`
* Envio automático de embed com botão
* Modal para inserção do token secreto
* Geração automática de código 2FA (TOTP)
* Interface amigável e segura
* Resposta privada (ephemeral)
* Sistema protegido por `.env`

---

## 🧰 Tecnologias Utilizadas

* Node.js
* discord.js v14
* OTPAuth
* dotenv
* fs

---

## 📦 Instalação

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

---

### 2️⃣ Instale as dependências

```bash
npm install
```

---

### 3️⃣ Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```
JWT_SECRET=SEU_TOKEN_DO_DISCORD
```

⚠️ **Nunca compartilhe esse token.**

---

### 4️⃣ Configure o arquivo `config.json`

```json
{
  "clientId": "SEU_CLIENT_ID",
  "guildId": "SEU_GUILD_ID"
}
```

---

### 5️⃣ Inicie o bot

```bash
node index.js
```

ou

```bash
npm start
```

---

## 🛠️ Como Usar

### 1️⃣ Execute o comando:

```
/codigo_rockstar
```

### 2️⃣ Informe o ID do canal onde o embed será enviado

### 3️⃣ Clique no botão **Receber Código**

### 4️⃣ Insira o token secreto da conta Rockstar

### 5️⃣ Receba seu código 2FA automaticamente 🎉

---

## 🔐 Segurança

* Tokens armazenados apenas em `.env`
* Nenhuma informação sensível é salva
* Respostas privadas para maior segurança
* Compatível com políticas do GitHub Push Protection

---

## 📁 Estrutura do Projeto

```
📦 bot-discord
 ┣ 📜 index.js
 ┣ 📜 config.json
 ┣ 📜 .env
 ┣ 📜 package.json
 ┗ 📜 README.md
```

---

## ⚠️ Aviso Legal

Este projeto **não é afiliado à Rockstar Games**.

Ferramenta desenvolvida **apenas para fins educacionais e automação pessoal**.

---

## 📜 Licença

Este projeto não possui nenhuma licença.

---

## ✨ Autor

**Victor Compertino**
Desenvolvedor | Programador | Estudante de Tecnologia 🚀

---

Se você gostou do projeto, deixe uma ⭐ no repositório!
