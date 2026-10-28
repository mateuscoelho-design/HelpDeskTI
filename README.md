# HelpDeskTI

Sistema de gerenciamento de demandas de suporte técnico, desenvolvido com Node.js, Express, Sequelize, MySQL, React e Vite.

O sistema possui dois perfis de usuário: Coordenador de Service Desk (admin) e Analista de Suporte de TI (funcionario), com diferentes permissões de acesso.

Projeto acadêmico desenvolvido a partir do código-base trabalhado em aula com o professor Nivaldo.

## Como executar o projeto

### 1. Instalar as dependências do backend

Na pasta principal do projeto, execute:

```bash
npm install
```

### 2. Criar o banco de dados

No MySQL Workbench, execute:

```sql
CREATE DATABASE IF NOT EXISTS helpdeskti;
```

As tabelas serão criadas automaticamente pelo Sequelize ao iniciar a API.

### 3. Configurar o arquivo .env

Crie uma cópia do arquivo `.env.example` e renomeie para `.env`.

Configure as informações do MySQL, a chave JWT e os dados do administrador inicial.

### 4. Verificar o backend

Execute:

```bash
npm run build
```

Esse comando verifica a sintaxe dos arquivos JavaScript do backend.

### 5. Criar o administrador inicial

Execute:

```bash
npm run criar-admin
```

O script cadastra o primeiro administrador, caso ainda não exista.

### 6. Iniciar o backend

Na pasta principal do projeto, execute:

```bash
npm run dev
```

Ou, para execução normal:

```bash
npm start
```

A API estará disponível em:

`http://localhost:3030`

### 7. Instalar as dependências do frontend

Abra um segundo terminal e acesse a pasta do frontend:

```bash
cd frontend
npm install
```

### 8. Iniciar o frontend

Ainda na pasta `frontend`, execute:

```bash
npm run dev
```

Acesse a interface no navegador:

`http://localhost:5173`

**Importante:** o MySQL, o backend e o frontend precisam estar em execução para o sistema funcionar corretamente.

### 9. Verificar o frontend

Na pasta `frontend`, execute:

```bash
npm run build
```

Esse comando gera a versão de produção da interface React e verifica se a compilação foi concluída corretamente.

## Interface do sistema

O frontend foi desenvolvido com React, Vite, JavaScript e CSS.

A interface possui três telas principais:

- **Login:** autenticação dos usuários cadastrados.
- **Cadastro:** criação de novos funcionários.
- **Painel de demandas:** consulta e gerenciamento das demandas de suporte técnico.

O painel apresenta indicadores com o total de demandas, demandas pendentes e demandas concluídas.

As opções disponíveis na interface variam conforme o perfil do usuário. As permissões também são verificadas pelo backend.

## Funcionalidades e permissões

### Coordenador de Service Desk (admin)

- Consultar usuários cadastrados pela API.
- Criar demandas.
- Listar e consultar demandas.
- Editar e excluir demandas.
- Concluir demandas.

### Analista de Suporte de TI (funcionario)

- Listar e consultar demandas.
- Concluir demandas.

O funcionário não possui permissão para criar, editar ou excluir demandas.

## Rotas da API

### Usuários

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /users/register | Cadastrar funcionário |
| POST | /users/login | Realizar login |
| GET | /users | Listar usuários (admin) |

### Demandas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /demandas | Listar demandas |
| GET | /demandas/:id | Consultar demanda |
| POST | /demandas | Criar demanda (admin) |
| PUT | /demandas/:id | Editar demanda (admin) |
| DELETE | /demandas/:id | Excluir demanda (admin) |
| PATCH | /demandas/:id/concluir | Concluir demanda |

## Autenticação e autorização

A autenticação utiliza e-mail e senha, com bcrypt para verificar as senhas e JWT para gerar os tokens de acesso.

A autorização verifica o tipo de usuário e permite apenas as operações correspondentes ao seu perfil.

As rotas protegidas utilizam os middlewares `verifyToken` e `verifyAdmin`.

O frontend envia o token JWT nas requisições protegidas.

## Regras de negócio

- O cadastro público cria usuários do tipo funcionario.
- O primeiro administrador é criado por um script separado.
- Somente administradores podem criar, editar e excluir demandas.
- Administradores e funcionários podem consultar e concluir demandas.
- Toda demanda começa com status pendente.
- Uma demanda concluída não pode ser concluída novamente.
- Demandas concluídas não podem ser editadas.
- Título e descrição são obrigatórios.
- A prioridade pode ser baixa, media ou alta.

## Status codes HTTP

| Código | Significado |
|--------|-------------|
| 200 | Operação realizada com sucesso |
| 201 | Registro criado |
| 400 | Regra de negócio não atendida |
| 401 | Usuário não autenticado |
| 403 | Usuário sem permissão |
| 404 | Registro não encontrado |
| 422 | Dados inválidos |
| 500 | Erro interno no servidor |

## Tecnologias utilizadas

### Backend

- Node.js
- Express
- MySQL
- Sequelize
- bcrypt
- JWT
- express-validator

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

## Organização do projeto

- `controllers/` - Operações e regras de negócio.
- `db/` - Conexão com MySQL.
- `helpers/` - Validações, autenticação e autorização.
- `models/` - Models do Sequelize.
- `routes/` - Rotas da API.
- `scripts/` - Criação do administrador inicial.
- `frontend/` - Interface React e configuração do Vite.
- `frontend/src/pages/` - Telas de login, cadastro e demandas.
- `frontend/src/styles.css` - Estilização da interface.
- `server.js` - Inicialização da API.

## Observações

O arquivo `.env` não é enviado ao GitHub por segurança.

Cada pessoa deve configurar suas próprias credenciais utilizando o `.env.example`.

O frontend utiliza o proxy do Vite para acessar a API durante o desenvolvimento local.

Projeto desenvolvido para fins acadêmicos.
