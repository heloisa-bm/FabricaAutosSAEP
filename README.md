# Fábrica de Automóveis 2025

Projeto full stack inspirado na avaliação SAEP 2023, com o objetivo de simular o sistema de uma fábrica de automóveis. O sistema possibilita o **cadastro, consulta, atualização e exclusão** de informações relacionadas a **veículos, clientes, concessionárias e vendas**.

## Ambiente de Desenvolvimento

* **Back-end:** Node.js + Express
* **Banco de Dados:** MySQL (via XAMPP)
* **IDE:** Visual Studio Code
* **Front-end:** HTML, CSS e JavaScript

## Passos para Configuração

1. **Clone** este repositório para o seu computador.
2. Acesse a pasta **API** e execute o comando:

   ```bash
   npm install
   ```

   para instalar as dependências do projeto.
3. **Inicie** o XAMPP e ative os serviços **Apache** e **MySQL**.
4. **Crie** o arquivo `.env` dentro da pasta `/api` com as seguintes informações:

   ```js
   DATABASE_URL="mysql://root@localhost:3306/fabrica2025"
   ```
5. **Execute** a migração do banco de dados:

   ```bash
   npx prisma migrate dev --name init
   ```
6. **Importe** os dados iniciais abrindo o phpMyAdmin (ou via terminal `mysql -u root`) e rodando o script:

   ```bash
   ./docs/importacao.sql
   ```
7. **Inicie** o servidor da API com:

   ```bash
   node server.js
   ```

   ou, para modo de desenvolvimento:

   ```bash
   npm run dev
   ```
8. **Abra** a pasta `web` no VS Code e utilize a extensão **Live Server** para executar o front-end.

## DER (Diagrama Entidade-Relacionamento)

![DER Fábrica de Automóveis 2025](./docs/der.png)

## Capturas de Tela

### Página Inicial

![Página Inicial](./docs/screenshot01.png)

> O desenvolvimento das demais funcionalidades deverá ser continuado conforme as instruções da **Aula de Projeto de Software**.

**Autor:** Gabriel Barbosa Zanon
**GitHub:** [GabrielBZanon](https://github.com/GabrielBZanon)
