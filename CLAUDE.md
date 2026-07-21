# champion-motors

Web application for **Champion Motors Israel** (צ'מפיון מוטורס) — the official Israeli
importer of Volkswagen, VW Commercial Vehicles, Audi, SEAT, CUPRA and Škoda.

The product is **Hebrew-first and RTL by default**. Treat that as an architectural
constraint, not a localization step bolted on at the end.

## Stack
- **Vite + React + TypeScript** — SPA, strict mode
- **Tailwind CSS + shadcn/ui** — all styling
- **Vitest + React Testing Library** — unit and component tests

## Rules
Read these before writing code. They are binding, not suggestions.

@.claude/rules/code-style.md
@.claude/rules/testing.md
@.claude/rules/design.md

## Brand
Champion Motors is an **importer** — it does not own the marques it sells. Before
producing anything customer-facing (copy, campaign, model page, launch material),
invoke the `champion-motors-brand-guideline` skill and resolve which layer the work
sits in: Champion corporate, marque product, or co-branded service. Getting that
wrong is a compliance failure, not a style preference.

Never invent an OEM's colors, fonts or logo treatment. If the marque manual isn't at
hand, use neutral placeholders and say so.

## Conventions
- Commit messages: imperative present tense, one concern per commit
- Never commit secrets, `.env` files, or customer data
- Never disable a lint rule or a type check to make something pass — fix the cause
