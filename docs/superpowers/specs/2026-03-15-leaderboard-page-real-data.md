# Leaderboard Page — Real Data Integration

**Date:** 2026-03-15  
**Status:** Approved

## Problem

The `/leaderboard` page currently renders static mock data from `src/app/leaderboard/data.ts`. It does not connect to the database, does not use tRPC, and ignores the server/display/skeleton pattern established in the rest of the codebase. The stats in the hero section (total submissions, avg score) are also hardcoded.

## Goal

Replace all mock data with live database queries via tRPC, following the existing server/display/skeleton pattern. Display 20 leaderboard entries (no pagination) with collapsible syntax-highlighted code blocks, identical in style to the homepage leaderboard. Stats in the hero come from the existing `metrics.stats` procedure.

## Scope

- **In scope:** tRPC backend, leaderboard page components, stats display, deletion of `data.ts`
- **Out of scope:** Pagination, sorting options, filtering, search, upvoting

---

## Backend

### `src/trpc/routers/leaderboard.ts`

Add a `topTwenty` procedure to the existing `leaderboardRouter`. Same shape as `topThree` but with `limit(20)`.

```ts
topTwenty: baseProcedure.query(async ({ ctx }) => {
  const rows = await ctx.db
    .select({
      id: submissions.id,
      code: submissions.code,
      score: submissions.score,
      language: submissions.language,
      shameScore: submissions.shameScore,
    })
    .from(submissions)
    .where(eq(submissions.isPublic, true))
    .orderBy(desc(submissions.shameScore))
    .limit(20);

  return rows.map((row, index) => ({
    id: row.id,
    rank: index + 1,
    score: row.score,
    language: row.language ?? "unknown",
    shameScore: row.shameScore,
    code: row.code,
  }));
}),
```

No changes to `metricsRouter` — `metrics.stats` already provides `totalRoasted` and `avgScore`.

---

## File Structure

Route-specific components live under `src/app/leaderboard/_components/` — not the shared `src/app/_components/`. This follows the Next.js per-route `_components/` convention documented in `src/app/AGENTS.md`.

```
src/app/leaderboard/
├── _components/
│   ├── leaderboard-page-server.tsx    ← Server Component
│   ├── leaderboard-page-display.tsx   ← Client Component ('use client')
│   └── leaderboard-page-skeleton.tsx  ← Skeleton placeholder
├── data.ts                            ← DELETE after implementation
└── page.tsx                           ← Server Component (no 'use client')
```

Stats in the hero reuse the existing `MetricsServer` component from `src/app/_components/metrics-server.tsx` — no new stats components are created.

---

## Components

### `leaderboard-page-server.tsx` (Server Component)

Calls `prefetch(trpc.leaderboard.topTwenty.queryOptions())`, wraps in `HydrateClient` + `<Suspense fallback={<LeaderboardPageSkeleton />}>`.

### `leaderboard-page-display.tsx` (Client Component)

- `useSuspenseQuery(trpc.leaderboard.topTwenty.queryOptions())`
- Maps 20 entries; each entry renders as an `<article>` with:
  - **Meta header** — `<Link href={/result/${row.id}}>` containing rank + score on the left, language on the right. Same height and padding as homepage (`h-10 px-4 bg-[#0F0F0F] border-b border-[#2A2A2A] hover:bg-[#141414]`).
  - **Rank colors:** `#1 → #F59E0B`, `#2 → #6B7280`, `#3 → #6B7280`, `#4–#20 → #4B5563`
  - **Collapsible code block** — `<CollapsibleCode code={row.code} language={row.language} className="w-full" />` (outside the Link to avoid navigation on expand)
- Empty state: single bordered box with `// no submissions yet` centered.

### `leaderboard-page-skeleton.tsx`

20 skeleton rows, each matching the card structure (header bar + code area pulse). Uses `animate-pulse` on placeholder blocks.

### `page.tsx` (Server Component)

Replaces current implementation. No `"use client"`. Structure:

```tsx
import { MetricsServer } from "@/app/_components/metrics-server";
import { LeaderboardPageServer } from "./_components/leaderboard-page-server";

export default function LeaderboardPage() {
  return (
    <main>
      <div className="max-w-[960px] mx-auto ...">
        {/* Hero */}
        <section>
          {/* Static: "> shame_leaderboard" heading + comment */}
          <MetricsServer /> {/* replaces hardcoded submission count + avg score */}
        </section>

        {/* Entries */}
        <LeaderboardPageServer />
      </div>
    </main>
  );
}
```

`MetricsServer` already exists at `src/app/_components/metrics-server.tsx` and prefetches `trpc.metrics.stats`, providing `totalRoasted` and `avgScore`. No duplication needed.

---

## Cleanup

- Delete `src/app/leaderboard/data.ts` after all components are wired up and verified.

---

## Visual Reference

Each entry card:

```
┌─────────────────────────────────────────────────────────┐
│ # 1  score: 1.2                              javascript │  ← Link /result/:id
├─────────────────────────────────────────────────────────┤
│  1  eval(prompt("enter code"))                          │
│  2  document.write(response)                            │
│  3  // trust the user lol                               │
│     // 4 more lines — expand                            │
└─────────────────────────────────────────────────────────┘
```

Rank color mapping:
| Rank | Color |
|------|-------|
| #1 | `#F59E0B` (amber) |
| #2 | `#6B7280` (gray) |
| #3 | `#6B7280` (gray — intentionally same as #2, matching homepage `RANK_COLORS`) |
| #4–#20 | `#4B5563` (dark gray) |

---

## Constraints

- `page.tsx` must remain a Server Component — no `"use client"` at top level
- Client components with `useSuspenseQuery` must always be inside a `<Suspense>` boundary
- Use `useSuspenseQuery` (not `useQuery`) to avoid hydration mismatches
- `NumberFlow` for animated numbers in `stats-display.tsx`
- Named exports only — no default exports from components
- `CollapsibleCode` receives raw `code: string` — no need to tokenize manually
