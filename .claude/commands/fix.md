---
description: Start a bug fix on a fix/* branch
argument-hint: <short-kebab-description>
---

Start a bug fix in serene. Same flow as `/feature` with `fix/` prefix and a regression-test bias.

## Steps

1. Reproduce the bug locally first if you haven't already. Capture the failing scenario.

2. Confirm clean working tree:

   ```bash
   git status
   ```

3. Refresh main:

   ```bash
   git checkout main && git pull --ff-only
   ```

4. Create the branch:

   ```bash
   git checkout -b fix/$ARGUMENTS
   ```

5. Plan as a TaskCreate todo. Include a regression test if the bug is reproducible at the unit level.

6. Implement. Commit conventionally:

   ```
   fix(<scope>): <imperative subject>

   <body explaining root cause>

   Fixes #<issue-number>
   ```

7. `/check`, then `/pr`.
