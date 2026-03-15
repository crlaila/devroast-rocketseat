# Spec: Drizzle ORM + PostgreSQL Database

> Status: **pending**
> Depends on: nenhuma outra spec

---

## Contexto

Atualmente o app é 100% estático — sem API routes, sem persistência. Esta spec define o schema de banco de dados necessário para suportar as três telas do produto:

- **Screen 1** — Submissão de código (input + roast mode)
- **Screen 2** — Resultado do roast (score, análise detalhada, diff sugerido)
- **Screen 3** — Shame Leaderboard (ranking público por shame score)
- **Screen 4** — OG Image gerada por submissão

---

## Stack

| Componente      | Escolha                        |
| --------------- | ------------------------------ |
| ORM             | `drizzle-orm`                  |
| Driver          | `drizzle-orm/node-postgres`    |
| Banco           | PostgreSQL 16 (via Docker)     |
| Migrations      | `drizzle-kit`                  |
| Seed / studio   | `drizzle-kit studio`           |
| Validação       | `zod` + `drizzle-zod`          |

---

## Docker Compose

Arquivo: `docker-compose.yml` na raiz do projeto.

```yaml
services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Variável de ambiente necessária em `.env.local`:

```env
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

---

## Enums

Todos os enums são declarados em `src/db/schema.ts` usando `pgEnum`.

### `verdict_enum`
Controla a classificação geral do roast. Exibida no `roastBadge` (Screen 2) e no OG Image (Screen 4).

```ts
export const verdictEnum = pgEnum("verdict", [
  "legendary_garbage",   // score 0.0 – 2.0
  "needs_serious_help",  // score 2.1 – 4.0  (exemplo atual no design)
  "could_be_worse",      // score 4.1 – 6.0
  "not_terrible",        // score 6.1 – 8.0
  "almost_decent",       // score 8.1 – 10.0
]);
```

### `issue_severity_enum`
Corresponde diretamente às variantes do componente `BadgeStatus` / `AnalysisCard`.

```ts
export const issueSeverityEnum = pgEnum("issue_severity", [
  "critical",  // BadgeStatus variant="critical"  — cor: accent-red
  "warning",   // BadgeStatus variant="warning"   — cor: accent-amber
  "good",      // BadgeStatus variant="good"      — cor: accent-green
]);
```

### `diff_line_type_enum`
Corresponde às variantes do componente `DiffLine`.

```ts
export const diffLineTypeEnum = pgEnum("diff_line_type", [
  "removed",   // linha vermelha removida
  "added",     // linha verde adicionada
  "context",   // linha cinza de contexto
]);
```

---

## Tabelas

### `submissions`

Representa cada envio de código feito por um usuário.  
É a entidade central — todas as outras tabelas fazem referência a ela.

```ts
export const submissions = pgTable("submissions", {
  id:          uuid("id").primaryKey().defaultRandom(),
  code:        text("code").notNull(),               // conteúdo bruto do código
  language:    varchar("language", { length: 64 }),  // detectado automaticamente (ex: "javascript")
  lineCount:   integer("line_count").notNull(),       // número de linhas (para o leaderboard)
  roastMode:   boolean("roast_mode").notNull().default(false), // toggle "roast mode" ativado?
  score:       numeric("score", { precision: 3, scale: 1 }).notNull(), // 0.0 – 10.0
  verdict:     verdictEnum("verdict").notNull(),
  roastQuote:  text("roast_quote").notNull(),         // frase de abertura do roast
  isPublic:    boolean("is_public").notNull().default(true), // aparece no leaderboard?
  shameScore:  numeric("shame_score", { precision: 5, scale: 2 }), // calculado: (10 - score) * peso
  createdAt:   timestamp("created_at").notNull().defaultNow(),
});
```

**Notas:**
- `score` escala 0.0–10.0 com uma casa decimal (ex: `3.5`, `1.2`)
- `shameScore` é o inverso do score com possível peso de upvotes futuros — quanto maior, pior
- `isPublic` permite que o usuário opte por não aparecer no leaderboard (feature futura)
- `language` é preenchido pela lib de detecção automática (spec: `editor-syntax-highlight.md`)

---

### `roast_issues`

Cada problema identificado pelo AI no código submetido.  
Exibido na seção `Analysis Section` (Screen 2) via componente `AnalysisCard`.

```ts
export const roastIssues = pgTable("roast_issues", {
  id:           uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id")
                  .notNull()
                  .references(() => submissions.id, { onDelete: "cascade" }),
  severity:     issueSeverityEnum("severity").notNull(),
  badgeLabel:   varchar("badge_label", { length: 64 }).notNull(),  // ex: "security risk"
  title:        varchar("title", { length: 256 }).notNull(),       // título curto do problema
  description:  text("description").notNull(),                     // explicação detalhada
  sortOrder:    integer("sort_order").notNull().default(0),        // ordem de exibição no grid
});
```

**Notas:**
- Uma submission tem N issues (tipicamente 2–6, exibidos no grid 2×N do design)
- `sortOrder` segue a lógica: `critical` primeiro, depois `warning`, depois `good`
- `badgeLabel` → texto do `BadgeStatus` (ex: `"CRITICAL"`, `"WARNING"`, `"GOOD"`)

---

### `roast_diffs`

Representa as linhas do diff sugerido pelo AI.  
Exibido na seção `Diff Section` (Screen 2) via componente `DiffLine`.

```ts
export const roastDiffs = pgTable("roast_diffs", {
  id:           uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id")
                  .notNull()
                  .references(() => submissions.id, { onDelete: "cascade" }),
  lineType:     diffLineTypeEnum("line_type").notNull(),
  content:      text("content").notNull(),   // conteúdo da linha de código
  lineNumber:   integer("line_number").notNull(), // posição original no arquivo
  sortOrder:    integer("sort_order").notNull(),   // ordem de exibição no diff
  fileName:     varchar("file_name", { length: 256 }), // ex: "main.js" (opcional)
});
```

**Notas:**
- `fileName` alimenta o header do `DiffBlock` (campo `diffHeader` no design)
- `lineType` mapeia diretamente para a prop `variant` do componente `DiffLine`

---

## Índices recomendados

```ts
// Leaderboard: busca os piores códigos em ordem
export const submissionsShameIdx = index("submissions_shame_score_idx")
  .on(submissions.shameScore.desc());

// Submissões públicas mais recentes
export const submissionsPublicCreatedIdx = index("submissions_public_created_idx")
  .on(submissions.isPublic, submissions.createdAt.desc());

// Issues por submission (muito frequente)
export const roastIssuesSubmissionIdx = index("roast_issues_submission_idx")
  .on(roastIssues.submissionId);

// Diffs por submission em ordem
export const roastDiffsSubmissionIdx = index("roast_diffs_submission_idx")
  .on(roastDiffs.submissionId, roastDiffs.sortOrder);
```

---

## Estrutura de arquivos

```
src/
└── db/
    ├── index.ts          — instância do cliente drizzle (singleton)
    ├── schema.ts         — todos os enums, tabelas e índices
    └── migrations/       — gerado pelo drizzle-kit (não editar manualmente)

drizzle.config.ts         — configuração do drizzle-kit (raiz do projeto)
docker-compose.yml        — serviço postgres (raiz do projeto)
```

---

## To-Dos de implementação

### SETUP

- [ ] **SETUP-1** — Instalar dependências
  ```bash
  npm install drizzle-orm pg
  npm install -D drizzle-kit @types/pg
  # opcional mas recomendado para validação de inputs
  npm install zod drizzle-zod
  ```

- [ ] **SETUP-2** — Criar `docker-compose.yml` na raiz conforme descrito acima

- [ ] **SETUP-3** — Adicionar `DATABASE_URL` ao `.env.local` e ao `.env.example`

- [ ] **SETUP-4** — Criar `drizzle.config.ts` na raiz:
  ```ts
  import type { Config } from "drizzle-kit";

  export default {
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
      url: process.env.DATABASE_URL!,
    },
  } satisfies Config;
  ```

- [ ] **SETUP-5** — Adicionar scripts ao `package.json`:
  ```json
  "db:generate": "drizzle-kit generate",
  "db:migrate":  "drizzle-kit migrate",
  "db:studio":   "drizzle-kit studio",
  "db:push":     "drizzle-kit push"
  ```

---

### SCHEMA

- [ ] **SCHEMA-1** — Criar `src/db/schema.ts` com todos os enums e tabelas acima

- [ ] **SCHEMA-2** — Criar `src/db/index.ts` com o singleton do cliente:
  ```ts
  import { drizzle } from "drizzle-orm/node-postgres";
  import { Pool } from "pg";
  import * as schema from "./schema";

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  export const db = drizzle(pool, { schema });
  ```

- [ ] **SCHEMA-3** — Gerar e aplicar a primeira migration:
  ```bash
  docker compose up -d
  npm run db:generate
  npm run db:migrate
  ```

---

### API ROUTES

- [ ] **API-1** — Criar `POST /api/submissions` — recebe `{ code, roastMode }`, chama a AI, persiste tudo (submission + issues + diffs), retorna o id

- [ ] **API-2** — Criar `GET /api/submissions/[id]` — retorna a submission completa com issues e diffs para a página de resultados (Screen 2)

- [ ] **API-3** — Criar `GET /api/leaderboard` — retorna as submissions públicas ordenadas por `shameScore` DESC com paginação (para Screen 3)

---

### DADOS ESTÁTICOS

- [ ] **STATIC-1** — Substituir o array `LEADERBOARD` hardcoded em `src/app/page.tsx` por dados reais vindos de `GET /api/leaderboard` (fetch no Server Component)

- [ ] **STATIC-2** — Substituir as stats hardcoded (`"2,847 codes roasted"`, `"avg score: 4.2/10"`) por queries reais ao banco:
  - `count(*)` em `submissions`
  - `avg(score)` em `submissions`

---

### OG IMAGE

- [ ] **OG-1** — Criar `GET /api/og/[id]` usando `@vercel/og` que lê a submission do banco e gera a imagem conforme Screen 4 do design (score, verdict, roastQuote, language, lineCount)

---

## Diagrama de relações

```
submissions (1)
    ├── roast_issues (N)   — cascade delete
    └── roast_diffs  (N)   — cascade delete
```

---

## Dados de exemplo para seed (desenvolvimento)

Baseado nos dados hardcoded atuais em `src/app/page.tsx`:

```ts
// src/db/seed.ts
const seed = [
  {
    code: 'eval(prompt("enter code"))\ndocument.write(response)\n// trust the user lol',
    language: "javascript",
    lineCount: 3,
    score: "1.2",
    verdict: "legendary_garbage",
    roastQuote: "this code was written during a power outage... in 2005.",
    issues: [
      { severity: "critical", badgeLabel: "SECURITY RISK", title: "eval() com input do usuário", description: "Executa código arbitrário do usuário. Isso é uma vulnerabilidade crítica de XSS e injeção de código.", sortOrder: 0 },
      { severity: "critical", badgeLabel: "XSS", title: "document.write() com dados externos", description: "Escreve HTML diretamente sem sanitização. Qualquer string pode injetar scripts maliciosos.", sortOrder: 1 },
    ],
  },
  // ... demais entradas do leaderboard
];
```
