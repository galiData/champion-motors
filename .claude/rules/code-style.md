# Code Style

## TypeScript
- Strict mode is on (`"strict": true` in tsconfig) — never disable it
- Always type function parameters and return values explicitly
- Use `interface` for object shapes, `type` for unions and aliases
- Never use `any` — use `unknown` and narrow it, or define a proper type
- Prefer `const` over `let`; never use `var`
- No `@ts-ignore` / `@ts-expect-error` without a comment explaining why and a follow-up

## React
- Functional components only — no class components
- Named exports only — no default exports for components or hooks
- One component per file
- Component and file names: PascalCase → `ModelCard.tsx`
- Hook files: camelCase with `use` prefix → `useLeasingQuote.ts`
- Keep components small — if a component exceeds ~150 lines, split it
- Data fetching lives in hooks, never inline in a component body

## Folder conventions
- `components/ui/` — generic, reusable primitives (Button, Card, Input, Modal)
- `components/features/{domain}/` — domain-specific components
  (e.g. `features/models/ModelCard.tsx`, `features/leasing/QuoteSummary.tsx`,
  `features/service/ServiceCenterTable.tsx`)
- `hooks/` — custom React hooks; one hook per file
- `types/` — shared TypeScript types; group by domain (e.g. `types/model.ts`, `types/leasing.ts`)
- `utils/` — pure functions with no side effects, fully unit-testable
- `lib/` — configured clients and integrations (API client, analytics, i18n setup)

## Imports
- Use absolute imports configured via tsconfig paths (e.g. `@/components/ui/Button`)
- Import order: React → third-party libraries → internal modules → types
- Never import server-only modules into frontend code — keep the boundary explicit
- Never deep-import into another feature's internals; go through its public entry

## Styling
- Tailwind CSS for all styling — no inline `style` props, no CSS modules
- Use shadcn/ui as the base component layer; extend with Tailwind classes via `className`
- Avoid writing custom CSS unless there is no Tailwind equivalent
- Use `cn()` utility (from `src/utils/cn.ts`) to merge conditional class names
- **Brand tokens only** — never an arbitrary hex or an off-scale spacing value.
  If a color isn't in `design.md`, it doesn't go in the product
- **Logical properties only** — `ms-*` `me-*` `ps-*` `pe-*` `start-*` `end-*`
  `text-start` `text-end`. Never `ml-*` `mr-*` `left-*` `right-*` `text-left`,
  which hard-code LTR and break Hebrew layout

## Hebrew and RTL
- `dir="rtl" lang="he"` on the document root — RTL is the default, not a mode
- All user-facing strings in Hebrew; never hardcode English UI text
- Latin model names, numerals and prices stay LTR inline (`אאודי Q6 e-tron`,
  `החל מ־189,000 ₪`) — let the bidi algorithm handle it; wrap in `<span dir="ltr">`
  only when a specific string renders wrong
- Mirror directional icons (arrows, chevrons, back/next, progress).
  Do **not** mirror logos or icons depicting real objects — a car icon still faces
  the way it faced
- No letter-spacing, condensing or stretching on Hebrew text; emphasis comes from
  weight and size (Hebrew has no uppercase)
- Format currency and dates through a shared util — never inline `toLocaleString`
  calls scattered across components

## Naming
- Variables and functions: camelCase
- Constants: SCREAMING_SNAKE_CASE only for true module-level constants
- Boolean variables: prefix with `is`, `has`, or `can` (e.g. `isLoading`, `hasPermission`)
- Event handlers: prefix with `handle` (e.g. `handleSubmit`, `handleModelSelect`)
- Name things in English in code, even when the UI they render is Hebrew
