---
description: Run all local quality checks (lint, format, typecheck, tests)
---

Run the same checks CI runs, locally. Do this before every push.

```bash
bunx oxlint && bunx oxfmt --check && bunx tsc --noEmit && bunx vitest run
```

If any step fails, fix the root cause and re-run. Never use `--no-verify`, `--skip-checks`, or similar bypasses. lefthook runs the same set on `pre-push` once it's wired up.

If oxlint or oxfmt suggest auto-fixes, apply them with:

```bash
bunx oxlint --fix
bunx oxfmt
```

then re-run /check.

If the project is not yet scaffolded (no `package.json` at the repo root), report that and skip — checks will become meaningful starting from W18 day 2 once the workspace is initialized.
