# BancaFlow — Backend

API REST do BancaFlow em Node.js, Express e TypeScript, com PostgreSQL e Prisma.
Esta documentação cobre a fase de autenticação e gestão inicial de utilizadores.

## Instalação

```bash
cd backend
npm install
```

> Com npm 11, scripts de instalação podem ser bloqueados. O `package.json` já
> aprova explicitamente `@prisma/client`, `@prisma/engines`, `prisma`, `esbuild`
> e `bcrypt`. Se o Prisma Client não for gerado automaticamente, execute
> `npm run prisma:generate`.

## Configuração

Copie o exemplo e ajuste apenas para o seu ambiente local:

```bash
cp .env.example .env
```

| Variável | Descrição | Valor por omissão |
| --- | --- | --- |
| `PORT` | Porta HTTP | `4000` |
| `NODE_ENV` | Ambiente de execução | `development` |
| `CORS_ORIGIN` | Origem autorizada a consumir a API | `http://localhost:3000` |
| `DATABASE_URL` | Ligação PostgreSQL usada pelo Prisma | — |
| `JWT_SECRET` | Segredo HMAC dos tokens; obrigatório, mínimo 16 caracteres | — |
| `JWT_EXPIRES_IN` | Expiração do access token JWT | `1h` |
| `BCRYPT_ROUNDS` | Custo do hash bcrypt | `10` |
| `RATE_LIMIT_MAX` | Pedidos por janela nas rotas de autenticação | `60` |
| `RATE_LIMIT_WINDOW_MS` | Janela do rate limiting em milissegundos | `900000` |

Nunca use credenciais reais nem segredos partilhados em ficheiros versionados.

## Execução

```bash
npm run dev        # API com recarregamento automático
npm run build      # compilação para dist/
npm start          # executar dist/server.js
npm run typecheck  # verificação TypeScript
npm test           # testes de integração com node:test + supertest
```

Com PostgreSQL activo:

```bash
npm run prisma:format
npm run prisma:validate
npm run prisma:generate
npm run prisma:migrate -- --name <nome>
npm run prisma:migrate:deploy
npm run prisma:seed
```

O seed é idempotente e usa apenas dados fictícios. A migração
`add_auth_sessions` é aditiva: cria apenas a tabela `AuthSession`, índices e a
chave estrangeira para `User`. Nenhuma tabela existente foi removida.

## Endpoints implementados

Base URL: `http://localhost:4000/api/v1`

| Método | Caminho | Autenticação | Descrição |
| --- | --- | --- | --- |
| `GET` | `/` | não | Identificação do serviço |
| `GET` | `/health` | não | Estado do serviço |
| `POST` | `/auth/register` | não | Registo público de cliente (`CUSTOMER`) |
| `POST` | `/auth/login` | não | Login com emissão de JWT |
| `GET` | `/auth/me` | Bearer token | Dados básicos do utilizador autenticado |
| `POST` | `/auth/logout` | Bearer token | Revogação real da sessão |
| `GET` | `/users` | Bearer token + papel | Lista de utilizadores com isolamento por banco/agência |

### Registo

```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"fullName":"Cliente Novo","email":"cliente.novo@example.com","phone":"+258 84 000 0000","password":"Senha@123"}'
```

Resposta `201`:

```json
{
  "user": {
    "id": "…",
    "fullName": "Cliente Novo",
    "email": "cliente.novo@example.com",
    "phone": "+258 84 000 0000",
    "role": "CUSTOMER",
    "bankId": null,
    "branchId": null,
    "isActive": true,
    "createdAt": "…",
    "updatedAt": "…"
  },
  "accessToken": "…",
  "tokenType": "Bearer",
  "expiresIn": "1h",
  "expiresAt": "…"
}
```

Qualquer campo extra, incluindo `role`, é recusado com `400`. O papel é sempre
definido no servidor como `CUSTOMER`.

### Login

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"cliente.demo@example.com","password":"Demo@123"}'
```

Resposta `200` com a mesma forma do registo. Credenciais inválidas, conta
inactiva e email inexistente devolvem sempre `401 {"error":"Credenciais inválidas."}`.

### Utilizador autenticado

```bash
curl http://localhost:4000/api/v1/auth/me \
  -H 'Authorization: Bearer <accessToken>'
```

Resposta `200`: `{ "user": { … } }`, sem `passwordHash` nem outros dados sensíveis.
Sem token ou com token inválido: `401`.

### Logout

```bash
curl -X POST http://localhost:4000/api/v1/auth/logout \
  -H 'Authorization: Bearer <accessToken>'
```

Resposta `200`: `{ "message": "Sessão encerrada." }`. O mesmo token passa a
devolver `401` em `/auth/me` imediatamente.

### Lista de utilizadores

```bash
curl 'http://localhost:4000/api/v1/users?bankId=<id-do-banco>' \
  -H 'Authorization: Bearer <accessToken>'
```

Resposta `200`: `{ "data": [ { … } ] }`. `SUPER_ADMIN` pode filtrar por qualquer
banco; os restantes papéis são sempre limitados ao seu próprio `bankId`, e
`BRANCH_MANAGER`/`EMPLOYEE` também ao seu `branchId`. Clientes recebem `403`.

## Estratégia de autenticação e logout

1. O login/registo cria um `AuthSession` com expiração igual à do JWT.
2. O JWT assinado como HS256 contém `sub` (utilizador), `sid` (sessão), `role`,
   `bankId` e `branchId`.
3. O middleware `authenticate` verifica a assinatura, a expiração do JWT **e**
   consulta a sessão no backend. Uma sessão revogada, expirada ou de um
   utilizador inactivo é rejeitada mesmo que o JWT ainda não tenha expirado.
4. O `logout` marca `revokedAt` na sessão correspondente ao `sid` do token.
   Isto é uma invalidação real no servidor, não apenas a remoção do token no
   cliente.
5. Não são usados cookies nesta fase; o token é enviado em
   `Authorization: Bearer`. Se cookies passarem a ser usados, devem ser
   configurados com `HttpOnly`, `Secure` em produção e `SameSite` adequado.

Não há endpoint de refresh: após `JWT_EXPIRES_IN` o cliente deve fazer login
novamente. Isto mantém o âmbito desta fase simples e a revogação imediata.

## Autorização e multi-banco

Middlewares disponíveis:

- `authenticate` — valida JWT e sessão persistida.
- `authorize(...roles)` — verifica o papel na base de dados do utilizador autenticado.
- `requireBankAccess(source)` — compara o `bankId` pedido com as relações do
  utilizador autenticado; para clientes, confirma que existem marcações,
  documentos ou senhas naquele banco; para staff, usa o `bankId` da conta e,
  quando presente, valida também o `branchId`.

O `bankId` enviado pelo frontend nunca é confiado isoladamente: os filtros são
recalculados no serviço a partir da identidade autenticada.

O schema actual já permite que um cliente global (`User.bankId` nulo) use vários
bancos, porque `Appointment`, `CustomerDocument` e `QueueTicket` registam o
banco de cada operação. Para pessoal que precise de papéis diferentes em vários
bancos, a melhoria futura recomendada é uma entidade de associação
`UserBankAccess` (`userId`, `bankId`, `role`, `scope`, `branchId?`). Isso não foi
implementado nesta fase para evitar alterações estruturais desnecessárias.

## Utilizadores de demonstração

Todos os utilizadores criados pelo seed usam a palavra-passe fictícia `Demo@123`,
armazenada apenas como hash bcrypt:

| Email | Papel | Banco |
| --- | --- | --- |
| `superadmin@bancaflow.example` | `SUPER_ADMIN` | — |
| `admin.aurora@bancaflow.example` | `BANK_ADMIN` | Banco Aurora |
| `admin.meridiano@bancaflow.example` | `BANK_ADMIN` | Banco Meridiano |
| `gestor.baixa@aurora.example` | `BRANCH_MANAGER` | Banco Aurora / Agência Baixa |
| `operador.matola@meridiano.example` | `EMPLOYEE` | Banco Meridiano / Agência Matola |
| `cliente.demo@example.com` | `CUSTOMER` | vários bancos |
| `cliente2.demo@example.com` | `CUSTOMER` | vários bancos |

Nenhuma destas contas corresponde a uma pessoa ou credencial real.

## Segurança

- Palavras-passe com hash bcrypt; nunca devolvidas nem registadas.
- Validação de entrada com Zod em modo estrito.
- Segredo JWT por variável de ambiente; tokens HS256 com expiração.
- Rate limiting nas rotas de autenticação.
- CORS limitado a `CORS_ORIGIN`.
- Erros centralizados; detalhes de validação não incluem valores recebidos.
- Logs não registam palavras-passe, tokens nem corpos dos pedidos.
- Proibição de criação pública de administradores.
