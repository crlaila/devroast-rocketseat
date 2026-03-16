# App — Padrões de Páginas e Componentes

## Pages são Server Components por padrão

`page.tsx` nunca deve ter `"use client"` no topo.  
Toda lógica interativa (useState, event handlers) deve ser extraída para client components.

## Onde colocar client components

Client components específicos de uma página vivem em `src/app/_components/`.  
Componentes reutilizáveis entre páginas vivem em `src/components/ui/`.

```
src/app/
├── _components/        ← client components específicos de páginas
│   ├── home-editor.tsx
│   ├── metrics-display.tsx
│   ├── metrics-server.tsx
│   └── metrics-skeleton.tsx
├── page.tsx            ← server component
├── layout.tsx          ← server component (monta TRPCReactProvider e Navbar)
└── [rota]/
    ├── page.tsx        ← server component
    └── _components/    ← client components da rota (se necessário)
```

## Padrão para features com dados assíncronos

Toda feature que carrega dados do tRPC segue esta estrutura de 3 arquivos:

| Arquivo | Tipo | Responsabilidade |
|---|---|---|
| `*-server.tsx` | Server Component | `prefetch` + `HydrateClient` + `<Suspense>` |
| `*-skeleton.tsx` | Server ou Client | Placeholder visual durante carregamento |
| `*-display.tsx` | Client Component (`'use client'`) | Consome dados via `useQuery` + renderiza |

### Exemplo: MetricsServer

```tsx
// metrics-server.tsx (server component)
import { Suspense } from 'react';
import { trpc, HydrateClient, prefetch } from '@/trpc/server';
import { MetricsDisplay } from './metrics-display';
import { MetricsSkeleton } from './metrics-skeleton';

export function MetricsServer() {
  prefetch(trpc.metrics.stats.queryOptions());
  return (
    <HydrateClient>
      <Suspense fallback={<MetricsSkeleton />}>
        <MetricsDisplay />
      </Suspense>
    </HydrateClient>
  );
}
```

```tsx
// metrics-display.tsx (client component)
'use client';
import NumberFlow from '@number-flow/react';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';

export function MetricsDisplay() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.metrics.stats.queryOptions());
  // ...
}
```

## Números animados

Usar `<NumberFlow />` de `@number-flow/react` para qualquer número que carrega após hydration.  
Sempre dentro de um client component. Anima de 0 → valor real automaticamente.

```tsx
import NumberFlow from '@number-flow/react';

<NumberFlow value={count} format={{ useGrouping: true }} />
```

## layout.tsx

Monta `TRPCReactProvider` e `Navbar` — ambos compartilhados por todas as páginas.  
Nunca adicionar lógica de página específica aqui.
