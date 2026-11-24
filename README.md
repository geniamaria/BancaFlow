# BancaFlow

Plataforma multi-banco para digitalização de serviços bancários em Moçambique: localização de agências, consulta de serviços, acompanhamento de filas, marcação de atendimentos e gestão de documentos.

> **Etapa actual:** estrutura visual e navegação inicial. A lógica de negócio, autenticação, integrações bancárias, mapas, notificações e upload de documentos **não estão implementados**. Todos os dados apresentados são fictícios.

---

## 1. Estrutura do projecto

```text
bancaflow/
├── frontend/               # Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui
│   ├── app/
│   │   ├── (public)/       # Páginas públicas (grupo de rotas, não aparece no URL)
│   │   │   ├── page.tsx            # /
│   │   │   ├── entrar/page.tsx     # /entrar
│   │   │   ├── registo/page.tsx    # /registo
│   │   │   ├── agencias/page.tsx   # /agencias
│   │   │   └── servicos/page.tsx   # /servicos
│   │   ├── (client)/dashboard/     # /dashboard
│   │   ├── (admin)/admin/          # /admin
│   │   ├── globals.css             # Tokens de cor e base Tailwind
│   │   └── layout.tsx              # Layout raiz (metadata, idioma)
│   ├── components/
│   │   ├── brand/          # Logótipo
│   │   ├── features/       # Componentes de cada área funcional
│   │   ├── layout/         # Cabeçalho, rodapé, shells público e interno
│   │   └── ui/             # Primitivas reutilizáveis estilo shadcn/ui
│   ├── lib/                # Utilitários, navegação e dados de demonstração
│   └── .env.example
├── backend/                # Express + TypeScript + Prisma
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── config/         # Configuração a partir de variáveis de ambiente
│   │   ├── lib/            # Cliente Prisma (singleton)
│   │   ├── middleware/     # 404 e tratamento de erros
│   │   └── routes/         # Rotas versionadas (/api/v1)
│   └── .env.example
└── README.md
```

Cada aplicação tem `package.json`, `tsconfig.json` e dependências próprios.

---

## 2. Pré-requisitos

- Node.js 20 ou superior (testado com Node 24)
- npm 10 ou superior
- PostgreSQL 14 ou superior (necessário para migration, seed e validação relacional)

---

## 3. Instalação

```bash
# Na raiz do projecto
cd frontend && npm install
cd ../backend && npm install
```

> Com npm 11, os scripts de instalação podem ser bloqueados por predefinição. O `backend/package.json` já aprova os scripts necessários ao Prisma e ao esbuild. Se o Prisma Client não for gerado automaticamente, execute `npm run prisma:generate` no backend.

### Variáveis de ambiente

```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

| Aplicação | Variável | Descrição | Valor por omissão |
| --- | --- | --- | --- |
| frontend | `NEXT_PUBLIC_API_URL` | URL base da API REST | `http://localhost:4000` |
| frontend | `NEXT_PUBLIC_APP_ENV` | Ambiente da aplicação | `development` |
| backend | `PORT` | Porta HTTP | `4000` |
| backend | `NODE_ENV` | Ambiente de execução | `development` |
| backend | `CORS_ORIGIN` | Origem autorizada (frontend) | `http://localhost:3000` |
| backend | `DATABASE_URL` | Ligação PostgreSQL usada pelo Prisma | — |

> Nunca colocar credenciais reais no código ou nos ficheiros `.env.example`. Os ficheiros `.env*` locais estão ignorados pelo Git.

---

## 4. Execução em desenvolvimento

Em dois terminais separados:

```bash
# Terminal 1 — API (http://localhost:4000)
cd backend
npm run dev

# Terminal 2 — Frontend (http://localhost:3000)
cd frontend
npm run dev
```

Endpoints disponíveis nesta etapa:

| Método | Caminho | Descrição |
| --- | --- | --- |
| `GET` | `/` | Identificação do serviço |
| `GET` | `/api/v1` | Lista de endpoints da API |
| `GET` | `/api/v1/health` | Estado do serviço, ambiente e tempo de actividade |

---

## 5. Páginas implementadas

| Caminho | Conteúdo |
| --- | --- |
| `/` | Página inicial pública com destaque de serviços e pré-visualização das filas |
| `/entrar` | Estrutura visual do login |
| `/registo` | Estrutura visual do registo |
| `/dashboard` | Área do cliente com resumo, progresso e agências próximas |
| `/agencias` | Lista demonstrativa com pesquisa local por nome, banco e cidade |
| `/servicos` | Contas, atendimento, documentos e vídeos planeados |
| `/admin` | Painel administrativo inicial com indicadores e tabela de agências |

---

## 6. Scripts úteis

### Frontend

```bash
npm run dev        # servidor de desenvolvimento
npm run build      # build de produção
npm run start      # servir o build de produção
npm run typecheck  # verificação TypeScript
```

### Backend

```bash
npm run dev              # API com recarregamento automático (tsx watch)
npm run build            # compilação TypeScript para dist/
npm run start            # executar dist/server.js
npm run typecheck        # verificação TypeScript
npm run prisma:format    # formatar o schema
npm run prisma:validate  # validar o schema
npm run prisma:generate  # gerar o Prisma Client
npm run prisma:migrate   # criar/aplicar migrações em desenvolvimento
npm run prisma:seed      # executar dados fictícios de desenvolvimento
npm run db:setup         # migration inicial + seed
npm run db:reset         # repor base de desenvolvimento e voltar a semear
```

### Base de dados

Com o PostgreSQL activo e o `backend/.env` configurado:

```bash
cd backend
npm run prisma:format
npm run prisma:validate
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
```

O seed é idempotente e cria dois bancos fictícios, três agências por banco,
serviços, produtos, vídeos, documentos exigidos, utilizadores de demonstração,
marcações, filas, senhas e documentos enviados (apenas metadados).

---

## 7. Identidade visual

| Cor | Código | Utilização |
| --- | --- | --- |
| Azul Royal | `#003B71` | Identidade principal, cabeçalhos e barras de destaque |
| Azul Vivo | `#0066CC` | Botões principais, links e elementos interactivos |
| Turquesa | `#00A6A6` | Indicadores positivos e destaques |
| Amarelo | `#FFB800` | Alertas, notificações e chamadas de atenção |
| Fundo claro | `#F4F7FC` | Fundo das páginas |
| Azul profundo | `#101D35` | Textos importantes, sidebars e áreas escuras |
| Branco | `#FFFFFF` | Cartões e superfícies |

Os valores estão declarados como tokens Tailwind em `frontend/app/globals.css` (`bg-royal`, `bg-vivid`, `bg-turquoise`, `bg-gold`, `bg-canvas`, `bg-deep`). Foram acrescentadas variantes derivadas para garantir contraste em texto pequeno (`text-turquoise-ink`, `text-turquoise-light`, `text-gold-ink`) e fundos suaves (`bg-royal-soft`, `bg-turquoise-soft`, `bg-gold-soft`). O design evita gradientes, sombras excessivas e animações.

---

## 8. Modelo de dados

O schema completo está em `backend/prisma/schema.prisma`, a configuração da CLI em `backend/prisma.config.ts` e a migração inicial em `backend/prisma/migrations/`. O modelo usa PostgreSQL, UUID, enums, índices e regras de unicidade.

| Modelo | Finalidade |
| --- | --- |
| `Bank` | Instituição bancária com slug único e identificadores visuais |
| `User` | Utilizadores com perfil (`SUPER_ADMIN`, `BANK_ADMIN`, `BRANCH_MANAGER`, `EMPLOYEE`, `CUSTOMER`) |
| `Branch` | Agência pertencente a um banco |
| `Service` | Serviço oferecido por um banco |
| `BankProduct` | Produto bancário com taxas em `Decimal`, vantagens e requisitos |
| `ProductVideo` | Vídeo explicativo associado a um produto |
| `RequiredDocument` | Documento exigido por um serviço **ou** por um produto |
| `CustomerDocument` | Metadados e `storageKey` privado de um ficheiro enviado |
| `Appointment` | Marcação de atendimento com intervalo e estado |
| `Queue` | Fila de um serviço numa agência, com data e estado |
| `QueueTicket` | Senha digital com posição, estado e tempos de chamada/atendimento |

### Relacionamentos principais

```text
Bank ──< Branch ──< Queue ──< QueueTicket
  │       └──────< Appointment >── User (cliente)
  ├──────< Service ──< Appointment
  │          └──────< RequiredDocument
  ├──────< BankProduct ──< ProductVideo
  │            └───────< RequiredDocument
  └──────< User (administradores)
User (cliente) ──< CustomerDocument >── RequiredDocument
```

### Isolamento por banco

- Entidades de negócio possuem `bankId` e índices compostos para pesquisas rápidas.
- `Appointment`, `Queue` e `CustomerDocument` usam chaves estrangeiras compostas
  (`branchId + bankId`, `serviceId + bankId`, `requiredDocumentId + bankId`),
  impedindo referências cruzadas entre bancos.
- Utilizadores administrativos têm `bankId` e, quando aplicável, `branchId`;
  a chave composta `branchId + bankId` impede um gestor de agência de outro banco.
- Clientes são contas globais (`bankId` nulo) e podem interagir com vários bancos
  sem duplicação de utilizador.
- Um `RequiredDocument` só pode pertencer a um serviço **ou** a um produto,
  garantido por restrição `CHECK` na migration inicial.
- Ficheiros não são guardados na base: apenas `storageKey` sob `private/...`,
  `mimeType`, tamanho e estados de revisão.

Nenhuma destas entidades é utilizada pelas rotas nesta etapa — o objectivo é preparar a estrutura sem implementar endpoints de negócio.

---

## 9. Dependências principais

**Frontend:** Next.js, React, TypeScript, Tailwind CSS, class-variance-authority, clsx, tailwind-merge, @radix-ui/react-slot, lucide-react.

**Backend:** Express, TypeScript, Prisma Client, cors, dotenv, tsx (desenvolvimento), Prisma CLI (desenvolvimento).

---

## 10. Próximas etapas (fora do âmbito actual)

- Autenticação e autorização com isolamento por banco.
- API REST para agências, serviços, marcações e documentos.
- Upload seguro de ficheiros.
- Socket.IO para filas em tempo real.
- Integração com mapas e geolocalização.
- Notificações e conteúdos vídeo.
