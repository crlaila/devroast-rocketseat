# tRPC — Arquitetura e Padrões

Camada de API do projeto. tRPC v11 com TanStack React Query, integrado ao Next.js App Router.

## Estrutura de arquivos

```
src/trpc/
├── init.ts          — initTRPC, createTRPCContext (injeta db), exports base
├── query-client.ts  — makeQueryClient com defaults SSR
├── server.tsx       — server-only: proxy trpc, getQueryClient, HydrateClient, prefetch, caller
├── client.tsx       — 'use client': TRPCReactProvider, useTRPC
└── routers/
    ├── _app.ts      — appRouter raiz, exporta AppRouter type
    └── *.ts         — sub-routers por domínio
```

## Boundary server / client

- `server.tsx` tem `import 'server-only'` no topo — nunca importar em client components
- `client.tsx` tem `'use client'` — nunca importar em server components
- Importar `useTRPC` apenas de `@/trpc/client`
- Importar `trpc`, `caller`, `HydrateClient`, `prefetch` apenas de `@/trpc/server`

## Contexto

O contexto injeta o cliente Drizzle:

```ts
export const createTRPCContext = cache(async () => {
  return { db };
});
```

`cache()` do React garante singleton por request no servidor.

## Adicionando um novo router

1. Criar `src/trpc/routers/<dominio>.ts`
2. Usar `baseProcedure` para procedures sem autenticação
3. Registrar no `appRouter` em `routers/_app.ts`

```ts
// routers/_app.ts
export const appRouter = createTRPCRouter({
  metrics: metricsRouter,
  novoRouter: novoRouter, // adicionar aqui
});
```

## Padrão de uso em Server Components (prefetch + stream)

Preferir sempre este padrão — inicia a query no servidor sem bloquear o HTML:

```tsx
// page.tsx (server component)
import { trpc, HydrateClient, prefetch } from '@/trpc/server';
import { MeuClientComponent } from './_components/meu-client-component';

export default function Page() {
  prefetch(trpc.dominio.procedure.queryOptions());
  return (
    <HydrateClient>
      <Suspense fallback={<MeuSkeleton />}>
        <MeuClientComponent />
      </Suspense>
    </HydrateClient>
  );
}
```

```tsx
// _components/meu-client-component.tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';

export function MeuClientComponent() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.dominio.procedure.queryOptions());
  // ...
}
```

## Padrão alternativo: dados diretos no servidor (sem hydration)

Usar `caller` quando os dados só são necessários no servidor e não precisam estar no client cache:

```tsx
import { caller } from '@/trpc/server';

export default async function Page() {
  const data = await caller.dominio.procedure();
  return <div>{data.value}</div>;
}
```

**Atenção:** `caller` não popula o QueryClient — o cliente não terá esses dados em cache.

## QueryClient

- `staleTime: 30s` — evita refetch imediato no cliente após SSR
- `shouldDehydrateQuery` inclui queries `pending` — permite streaming de dados

## Endpoint HTTP

`/api/trpc` — fetch adapter com suporte a batching (`httpBatchLink`).  
Route handler em `src/app/api/trpc/[trpc]/route.ts`.
