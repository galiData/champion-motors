# Champion Motors — Internal Operations Portal

An internal web portal for Champion Motors Israel (צ'מפיון מוטורס) employees: company
news and events, an operational directory (branches, customers, cars, staff), analytics
reports, and productivity tools.

<!-- demo change: verifying the push + PR workflow from the local environment -->


The application is **Hebrew-first and right-to-left by default**. That is an
architectural constraint, not a localisation step added at the end.

> This repository is workshop material. It was built end to end with Claude Code as a
> teaching exercise. The walkthrough of how it was made is in
> [`docs/workshop/`](docs/workshop/).

---

## Prerequisites (Windows)

Install these in order. Every command below is written for **PowerShell**.

### 1. Node.js 22 LTS

The project needs Node 20 or newer; 22 LTS is what it is developed and built against.

Download the Windows installer from [nodejs.org](https://nodejs.org/), or use winget:

```powershell
winget install OpenJS.NodeJS.LTS
```

Close and reopen PowerShell afterwards so `PATH` picks it up, then verify:

```powershell
node -v    # v22.x.x
npm -v     # 10.x.x
```

### 2. Git

```powershell
winget install Git.Git
```

Then set your identity (used on every commit):

```powershell
git config --global user.name  "Your Name"
git config --global user.email "you@championmotors.co.il"
```

### 3. Visual Studio Code

```powershell
winget install Microsoft.VisualStudioCode
```

### 4. Claude Code

Claude Code is the AI coding agent used to build this project. Install it globally with
npm, then add the VS Code extension:

```powershell
npm install -g @anthropic-ai/claude-code
claude --version
```

In VS Code, open the Extensions panel (`Ctrl+Shift+X`), search for **Claude Code**, and
install it. Sign in when prompted.

### 5. GitHub CLI (optional, for pull requests and CI runs)

```powershell
winget install GitHub.cli
gh auth login
```

---

## Getting the project running

```powershell
git clone https://github.com/galiData/champion-motors.git
cd champion-motors
npm install
npm run dev
```

Vite prints a local URL (usually <http://localhost:5173>). Open it in a browser.

There is no backend to run and no environment variables to set. The app is served
entirely from a typed in-memory fixture layer — see [Data](#data) below.

### Sign-in

Authentication is a shell around a mock employee. Any submission on the login screen
signs you in; there is no credential check yet.

---

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Typecheck (`tsc -b`) then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over the whole project |
| `npm run typecheck` | TypeScript only, no bundle |
| `npm run test` | Vitest in watch mode |
| `npm run test:run` | Vitest once (what CI runs) |
| `npm run test:ui` | Vitest's browser UI |

Before pushing, run what CI runs:

```powershell
npm run lint; npm run typecheck; npm run test:run; npm run build
```

---

## Project structure

```
src/
  app/
    navigation.ts        The nav registry — sidebar AND routes are generated from it
    routes.tsx           Route tree, built from the registry
  components/
    layout/              AppShell, Sidebar, Topbar, PageHeader
    ui/                  Primitives (Button, Card, Table, Badge, states…)
    features/            Domain components, grouped by area
  pages/                 One thin component per route
  hooks/                 One hook per file; data access lives here
  lib/
    api/client.ts        Fake async client
    api/fixtures/        Hebrew demonstration data
    auth/                AuthProvider, RequireAuth
    charts/palette.ts    Validated chart colours — do not edit by eye
  types/                 Shared domain types
  utils/                 Pure, unit-testable helpers
```

### Adding a page

The sidebar and the router both read `src/app/navigation.ts`, so they cannot drift
apart. To add a page:

1. Create the component under `src/pages/`.
2. Add one entry to the relevant section in `navigation.ts` (path, Hebrew label, icon,
   component, and an optional `detail` route).

That is the whole change. Nothing else needs touching.

---

## Data

Every screen is backed by `src/lib/api/client.ts`, a fake async client over typed
fixtures with a small artificial delay so loading states are real rather than
theoretical. Analytics figures are **invented demonstration data** — the reports label
themselves `נתוני הדגמה` in the filter row.

Replacing this with real HTTP means rewriting `client.ts` only. The hooks and pages
depend on its method signatures, not on the fixtures.

---

## Conventions

Binding rules live in [`CLAUDE.md`](CLAUDE.md), which imports:

- [`.claude/rules/code-style.md`](.claude/rules/code-style.md) — TypeScript, React,
  folders, imports, styling, Hebrew/RTL, naming
- [`.claude/rules/testing.md`](.claude/rules/testing.md) — what to test and what not to
- [`.claude/rules/design.md`](.claude/rules/design.md) — the Champion Motors design
  language, colour tokens and accessibility floor

The two that catch people out:

**RTL is enforced through logical properties.** Use `ms-*`, `me-*`, `ps-*`, `pe-*`,
`start-*`, `end-*`, `text-start`. Never `ml-*`, `left-*`, `text-left` — those hard-code
left-to-right and silently break the Hebrew layout. In RTL, `start` is the **right**
side.

**Chart colours are validated, not chosen.** `src/lib/charts/palette.ts` documents the
commands that produced each value and why Deep Blue is unusable as a data fill. Re-run
the validator before changing any of them.

---

## Continuous integration

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every push and pull
request to `main`: `npm ci` → lint → typecheck → test → build, on Node 22.

`npm ci` installs strictly from `package-lock.json` and fails if it has drifted from
`package.json`, so always commit the lockfile alongside dependency changes.

---

## Deployment

The app is hosted on **AWS Amplify**, which watches `main` and rebuilds on every push
using [`amplify.yml`](amplify.yml). That build runs the same lint and test gates as CI
before it will publish, so a red build never reaches the live URL.

Because the app is a single-page application, Amplify carries a rewrite rule sending
unmatched paths to `/index.html`. Without it, refreshing on a deep link such as
`/customers/cus-1001` would return a 404 instead of letting React Router resolve it.
