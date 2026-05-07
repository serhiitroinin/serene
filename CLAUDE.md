# CLAUDE.md — serene

Guidance for Claude Code (and any AI agent) working in this repository.

## What this is

**serene** — A designer-grade open-source dashboard for athletes with Type 1 Diabetes. Glucose alongside recovery and training. Self-host with one Docker compose.

- Status: W18 of a 4-week sprint to ship v0.1 by **May 31, 2026**.
- Public from day 1.
- Single-tenant runtime, multi-tenant-ready schema.
- License: MIT.

## Stack

| Layer | Tool |
|---|---|
| Runtime | Bun (≥ 1.3.x) |
| Framework | TanStack Start (v1, 2026) |
| Language | TypeScript strict + `exactOptionalPropertyTypes` |
| Database | SQLite via `bun:sqlite` |
| ORM | Drizzle (SQLite dialect) |
| UI | shadcn/ui + Tailwind |
| Charts | shadcn Charts (Recharts) for basic; custom SVG + visx for signature (AGP, CGM trace, glucose × workout) |
| Maps | mapcn.dev (MapLibre + Protomaps tiles) |
| Validation | zod |
| Scheduling | croner (in-process) |
| Lint | oxlint |
| Format | oxfmt |
| Tests | Vitest (units), Playwright (one e2e: setup wizard) |
| Hooks | lefthook |
| CI | GitHub Actions |
| Versioning | Changesets + Conventional Commits |
| Deploy | Docker + docker-compose |

See `ARCHITECTURE.md` (added during W18 scaffolding) for the full architectural plan.

## Repo layout

```
apps/web/            TanStack Start application
packages/core/       Shared types, schemas, stats, ranges (pure TS, no runtime deps)
packages/cli/        Thin HTTP client for serene's API
docs/                Architecture, extending, self-host, data-sources
.github/             CI workflows + issue/PR templates
.claude/             AI workflow commands and settings
```

## Development workflow

Every change follows the same flow. No shortcuts.

1. **Branch** — start from up-to-date `main`, conventional prefix
2. **Implement** — small focused diff; tests where they matter
3. **Check** — run all local checks (`/check`)
4. **Commit** — conventional-commit style messages
5. **PR** — open a PR with Summary + Test plan (`/pr`)
6. **Review** — wait for CI green; address review comments
7. **Merge** — squash merge preserving context (`/merge-pr`)

### Branch naming

Branch prefix matches the conventional-commit type. Kebab-case description, ≤ 50 chars. No scopes in the branch (the scope goes in the commit message).

| Prefix | Use for |
|---|---|
| `feat/<desc>` | New feature |
| `fix/<desc>` | Bug fix |
| `chore/<desc>` | Tooling, deps, repo housekeeping |
| `docs/<desc>` | Documentation only |
| `refactor/<desc>` | Code change with no behavior change |
| `test/<desc>` | Tests only |
| `perf/<desc>` | Performance improvement |
| `build/<desc>` | Build system / Docker |
| `ci/<desc>` | CI config only |

### Conventional commits

Format:

```
<type>(<scope>)?: <subject>

<body>

<footer>
```

- **type**: matches branch prefix (feat, fix, chore, docs, refactor, test, perf, build, ci)
- **scope** *(optional)*: a directory or domain (`glucose`, `whoop`, `db`, `ui`, `setup`, etc.)
- **subject**: imperative, no trailing period, ≤ 72 chars
- **body**: wrap at 100 chars; explain *why*, not *what*
- **footer**: `BREAKING CHANGE:` for incompatibilities; issue refs (`Fixes #12`, `Refs #34`)

Examples:

```
feat(glucose): add AGP percentile-band chart
fix(whoop): handle expired refresh token on first sync
chore: bump bun to 1.3.10
```

### Local checks (before push)

Run `/check` or:

```bash
bunx oxlint
bunx oxfmt --check
bunx tsc --noEmit
bunx vitest run
```

If any check fails, fix the root cause. Do not use `--no-verify` or skip flags. lefthook runs the same checks on `pre-push` once it's wired up.

### Pull requests

Title: matches the conventional-commit subject of the squash commit.

Body template:

```markdown
## Summary
- 1–3 bullets on what changed and why.

## Test plan
- [ ] Bullet checklist of how the change was verified.

## Screenshots / Loom
(UI changes only.)
```

### Squash merge with context preserved

Always squash-merge. The squash commit message must preserve context:

- **Subject**: PR title (conventional-commit style)
- **Body**: PR description (Summary + Test plan)
- **Trailer**: list of original commits as `<short-sha> <subject>`

Use `/merge-pr` to construct this correctly. A bare `gh pr merge --squash` discards the PR body and original commits.

## Code conventions

- **TypeScript strict.** No `any`, no `@ts-ignore` without a why-comment. Use `unknown` and narrow.
- **No unnecessary comments.** Only comment when *why* is non-obvious. Don't explain *what* — code says that. Don't reference current task / issue / fix in comments — that belongs in the commit/PR.
- **No backwards-compat shims** during sprint. Rename freely; we are pre-1.0.
- **No premature abstractions.** Three similar lines is better than the wrong abstraction.
- **No defensive validation** beyond system boundaries (env vars via zod, server function inputs via zod).
- **Imports**: workspace packages by name (`@serene/core`); relative imports within the same package.
- **File naming**: `kebab-case.ts` for files; `PascalCase` for React components in `components/`.
- **Server-only code** lives in `apps/web/src/server/`. TanStack Start enforces the split via build.
- **Glucose canonical unit** is mmol/L. Convert on display, never in storage.

## Sprint context (current week)

- **W18 (May 5–10):** scaffolding — repo, monorepo, Drizzle schema, encryption, TanStack Start scaffold, theme system, Libre TS port, first chart, Docker boot.
- **W19 (May 11–17):** WHOOP + Garmin ports, AGP, stats, glucose × workout overlay, design polish. **Garmin gate at end of day 2** — defer to v0.2 if not working in ≤4hr.
- **W20 (May 18–24):** share token, partner view, mapcn integration, glucose-on-route, light theme, wizard polish.
- **W21 (May 25–31):** hand-crafted accents, docs, public deploy, Loom, r/T1D launch.

## Slash commands

- `/check` — run all local checks
- `/feature <description>` — start a feature on a `feat/*` branch
- `/fix <description>` — start a bug fix on a `fix/*` branch
- `/pr` — open a PR for the current branch
- `/merge-pr` — squash-merge the current PR preserving context

## Anti-scope (do not implement, even if asked offhandedly)

- Alarms, IOB/COB, treatment decision support — regulatory landmine
- Clinician portal — out of scope
- iOS native app — out of scope
- Plugin marketplace — premature abstraction
- EU-MDR certification — out of scope
- Backwards-compatibility shims — pre-1.0, freely rename

## Specifically allowed offhandedly

- Renaming variables, files, columns
- Removing dead code, unused exports, redundant types
- Switching libraries when the choice is wrong
- Reorganizing folders
