# Spec: tRPC — Camada de API

> Status: **em andamento**
> Depends on: `drizzle-database.md`

---

## Contexto

Atualmente as API routes do projeto são plain Next.js Route Handlers (`src/app/api/`). Esta spec substitui essa camada por tRPC v11 com integração TanStack React Query, aproveitando Server Components e SSR do Next.js App Router para prefetch tipado de dados no servidor.

O tRPC expõe um único endpoint HTTP em `/api/trpc` e substitui qualquer Route Handler que exponha dados de negócio. A Route Handler de `detect-language` fica de fora do tRPC por ser um utilitário de infraestrutura, não uma procedure de negócio.

---

## Decisão Técnica

| Componente | Escolha |
|---|---|
| tRPC | v11 (`@trpc/server`, `@trpc/client`, `@trpc/tanstack-react-query`) |
| Integração React | `@trpc/tanstack-react-query` — novo client nativo TanStack |
| Transport | `httpBatchLink` (client) / fetch adapter (server) |
| Validação de input | `zod` (já presente via `drizzle-zod`) |
| SSR/Prefetch | `createTRPCOptionsProxy` + `HydrationBoundary` |
| Contexto de request | `cache()` do React (garantia de singleton por request) |
| Boundary server/client | `server-only` e `client-only` para evitar vazamento de imports |

Não usamos `superjson` por ora — os tipos do schema são todos serializáveis nativamente (strings, numbers, booleans, Date serializado como ISO string).

---

## Estrutura de Arquivos

```
src/
└── trpc/
    ├── init.ts            — initTRPC, contexto, helpers base (server-only)
    ├── query-client.ts    — makeQueryClient com defaults de SSR
    ├── server.ts          — createTRPCOptionsProxy, getQueryClient, HydrateClient, prefetch, caller (server-only)
    ├── client.tsx         — TRPCReactProvider, useTRPC, TRPCProvider ('use client')
    └── routers/
        ├── _app.ts        — appRouter raiz (agrega todos os sub-routers)
        ├── submissions.ts — procedures de submissions
        └── leaderboard.ts — procedures do leaderboard

src/app/
└── api/
    ├── trpc/
    │   └── [trpc]/
    │       └── route.ts   — fetch adapter, GET + POST em /api/trpc
    └── detect-language/   — mantido como Route Handler simples (fora do tRPC)
```

---

## Arquitetura

### `trpc/init.ts` (server-only)

```ts
import { initTRPC } from '@trpc/server';
import { cache } from 'react';
import { db } from '@/db';

export const createTRPCContext = cache(async () => {
  return { db };
});

const t = initTRPC.context<typeof createTRPCContext>().create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
```

### `trpc/server.ts` (server-only)

```ts
import 'server-only';
import { createTRPCOptionsProxy, TRPCQueryOptions } from '@trpc/tanstack-react-query';
import { cache } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { makeQueryClient } from './query-client';
import { createTRPCContext } from './init';
import { appRouter } from './routers/_app';

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

// Caller direto para Server Components (sem cache de query client)
export const caller = appRouter.createCaller(createTRPCContext);

// Helpers de conveniência para uso em Server Components
export function HydrateClient({ children }: { children: React.ReactNode }) {
  return (
    <HydrationBoundary state={dehydrate(getQueryClient())}>
      {children}
    </HydrationBoundary>
  );
}

export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(queryOptions: T) {
  const qc = getQueryClient();
  if (queryOptions.queryKey[1]?.type === 'infinite') {
    void qc.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void qc.prefetchQuery(queryOptions);
  }
}
```

### `trpc/client.tsx` ('use client')

- Exporta `TRPCReactProvider` para montar em `layout.tsx`
- Exporta `useTRPC` para uso em Client Components
- `getQueryClient` singleton no browser para evitar recriação no Suspense

### Routers planejados

**`submissions`**
- `submissions.create` — mutation: recebe `{ code, roastMode }`, chama AI, persiste, retorna `id`
- `submissions.byId` — query: retorna submission + issues + diffs pelo `id`

**`leaderboard`**
- `leaderboard.list` — query: retorna submissions públicas ordenadas por `shameScore` DESC com paginação cursor

---

## Padrão de Uso nos Pages/Components

### Server Component com prefetch

```tsx
// src/app/leaderboard/page.tsx
import { trpc, HydrateClient, prefetch } from '@/trpc/server';

export default function LeaderboardPage() {
  prefetch(trpc.leaderboard.list.queryOptions({ limit: 20 }));
  return (
    <HydrateClient>
      <LeaderboardTable />
    </HydrateClient>
  );
}
```

### Client Component consumindo

```tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';

export function LeaderboardTable() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.leaderboard.list.queryOptions({ limit: 20 }));
  // ...
}
```

### Dados diretos no servidor (sem cache no client)

```tsx
import { caller } from '@/trpc/server';

export default async function ResultPage({ params }) {
  const submission = await caller.submissions.byId({ id: params.id });
  // use diretamente no JSX
}
```

---

## To-Dos de Implementação

### SETUP

- [ ] **SETUP-1** — Instalar dependências:
  ```bash
  npm install @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query client-only server-only
  ```

- [ ] **SETUP-2** — Criar `src/trpc/init.ts` com `initTRPC`, `createTRPCContext` (injeta `db` do Drizzle), exports base (`createTRPCRouter`, `baseProcedure`, `createCallerFactory`)

- [ ] **SETUP-3** — Criar `src/trpc/query-client.ts` com `makeQueryClient` e defaults de SSR (`staleTime: 30s`, `shouldDehydrateQuery` incluindo pending)

- [ ] **SETUP-4** — Criar `src/trpc/client.tsx` (`'use client'`) com `TRPCReactProvider`, `useTRPC`, singleton `browserQueryClient`

- [ ] **SETUP-5** — Criar `src/trpc/server.ts` (`server-only`) com `getQueryClient`, `trpc` proxy, `caller`, `HydrateClient`, `prefetch`

- [ ] **SETUP-6** — Criar `src/app/api/trpc/[trpc]/route.ts` com fetch adapter expondo `GET` e `POST`

- [ ] **SETUP-7** — Montar `TRPCReactProvider` em `src/app/layout.tsx` wrappando o `children`

---

### ROUTERS

- [ ] **ROUTER-1** — Criar `src/trpc/routers/submissions.ts` com procedures `create` e `byId`

- [ ] **ROUTER-2** — Criar `src/trpc/routers/leaderboard.ts` com procedure `list` (paginação cursor, limit padrão 20)

- [ ] **ROUTER-3** — Criar `src/trpc/routers/_app.ts` agregando os routers acima e exportando `AppRouter` type

---

### MIGRAÇÃO

- [ ] **MIG-1** — Substituir dados hardcoded do leaderboard em `src/app/page.tsx` por `prefetch(trpc.leaderboard.list.queryOptions())` + `HydrateClient`

- [ ] **MIG-2** — Substituir stats hardcoded (`"2,847 codes roasted"`) por query real via `caller` no Server Component

- [ ] **MIG-3** — Página de resultado (`src/app/result/`) passar a usar `caller.submissions.byId` ou prefetch + Client Component

---

## Referências

- [tRPC — Server Components setup](https://trpc.io/docs/client/tanstack-react-query/server-components)
- [tRPC — TanStack React Query setup](https://trpc.io/docs/client/tanstack-react-query/setup)
- [TanStack Query — Advanced Server Rendering](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)
