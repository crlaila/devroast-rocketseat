# DevRoast — Agent Context

## What this is
A Next.js 16 app where users paste code and get an AI-generated roast/score. Dark terminal aesthetic throughout.

## Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 (no config file — uses `@theme` in `globals.css`)
- **Linting/Formatting:** Biome (`npm run lint`)
- **Font loading:** `next/font/google` — JetBrains Mono, IBM Plex Mono, Inter

## Design system
Source of truth is `/Users/crlaila/Desktop/devroast.pen` (Pencil file).  
Variables live in Pencil — always read them via MCP before creating/editing components.

Key tokens:
| Token | Value |
|---|---|
| `bg-page` | `#0A0A0A` |
| `bg-surface` | `#0F0F0F` |
| `bg-input` | `#111111` |
| `border-primary` | `#2A2A2A` |
| `text-primary` | `#FAFAFA` |
| `text-secondary` | `#6B7280` |
| `text-tertiary` | `#4B5563` |
| `accent-green` | `#22C55E` |
| `accent-red` | `#EF4444` |
| `accent-amber` | `#F59E0B` |

## Component library (`src/components/ui/`)
All components are extracted **directly from the Pencil file** — never invented.  
Exports via `src/components/index.ts` → `src/components/ui/index.ts`.

| File | Component |
|---|---|
| `button.tsx` | `Button` — variants: `primary`, `secondary`, `link` |
| `toggle.tsx` | `Toggle` — on/off with label |
| `badge-status.tsx` | `BadgeStatus` — variants: `critical`, `warning`, `good`, `verdict` |
| `analysis-card.tsx` | `AnalysisCard` — badge header + title + description |
| `code-block.tsx` | `CodeBlock` — macOS dots + line numbers + syntax tokens |
| `diff-line.tsx` | `DiffLine` — variants: `removed`, `added`, `context` |
| `table-row.tsx` | `TableRow` — rank / score / code / language |
| `navbar.tsx` | `Navbar` — logo + spacer + links |
| `score-ring.tsx` | `ScoreRing` — SVG arc, score/maxScore |

## Global rules
- **Named exports only** — no default exports from components
- **No new components** without reading the Pencil file first
- Typography: JetBrains Mono for all code/UI text; IBM Plex Mono for descriptions
- Use `font-['JetBrains_Mono',monospace]` inline class (Tailwind v4 arbitrary)
- `cn()` from `@/lib/utils` for conditional class merging
- All data is static for now — no API calls yet
- `Navbar` lives in `layout.tsx` (shared across all pages)
- Content max-width: `max-w-[960px] mx-auto`; editor/actions: `max-w-[780px] mx-auto`
