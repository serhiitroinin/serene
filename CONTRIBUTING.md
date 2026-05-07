# Contributing to serene

Thank you for considering a contribution. serene is built in public; the goal is a designer-grade open-source dashboard for athletes with Type 1 Diabetes that anyone can self-host.

## Quick start

1. Fork the repo and clone your fork.
2. `bun install`
3. Copy `.env.example` to `.env` and fill in required vars (see [docs/self-host.md](docs/self-host.md) once it exists).
4. `bun dev` to run locally.

## Workflow

1. **Branch** off `main` with a conventional prefix:
   - `feat/<short-description>` for new features
   - `fix/<short-description>` for bug fixes
   - `chore/<...>`, `docs/<...>`, `refactor/<...>`, `test/<...>`, `perf/<...>`, `build/<...>`, `ci/<...>`

2. **Implement** with small, focused diffs.

3. **Run all checks** before pushing:

   ```bash
   bunx oxlint
   bunx oxfmt --check
   bunx tsc --noEmit
   bunx vitest run
   ```

4. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/):

   ```
   feat(glucose): add AGP percentile-band chart
   fix(whoop): handle expired refresh token on first sync
   ```

5. **Open a PR** with a Summary + Test plan.

6. **Wait for CI green**, address reviews.

7. **Squash merge** preserves the PR description and original commit list in the merge commit body.

## Code conventions

- TypeScript strict; no `any`, no `@ts-ignore` without an explanation.
- No unnecessary comments. Comment only when _why_ is non-obvious.
- No premature abstractions or backwards-compat shims pre-1.0.
- Glucose canonical unit is mmol/L. Convert on display.
- Server-only code in `apps/web/src/server/`. Pure utilities in `packages/core`.

## Anti-scope

Please do not open PRs for: alarms, IOB/COB, treatment decision support, clinician portal, iOS native app, plugin architectures, EU-MDR cert work. These are intentionally out of scope. See [README.md](README.md) for the v0.2 roadmap.

## License

MIT. By contributing, you agree your contributions are licensed under MIT.
