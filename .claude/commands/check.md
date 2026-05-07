---
description: Run all local quality checks (lint, format, build, typecheck, tests)
---

Run the same checks CI runs, locally. Do this before every push.

```bash
bun run check
```

Which expands to:

```bash
bun run lint && bun run format:check && bun run build && bun run typecheck && bun run test
```

The `build` step is intentional: it generates `routeTree.gen.ts`, which `typecheck` depends on. Without it, fresh clones (or branches that touched routes) would fail typecheck even though CI passes.

If any step fails, fix the root cause and re-run. Never use `--no-verify`, `--skip-checks`, or similar bypasses. Lefthook runs the same set on `pre-push`.

If oxlint or oxfmt suggest auto-fixes, apply them with:

```bash
bun run lint:fix
bun run format
```

then re-run `/check`.
