---
description: Start a new feature on a feat/* branch
argument-hint: <short-kebab-description>
---

Start a new feature in serene. Branch + plan + initial todo list.

## Steps

1. Confirm clean working tree:

   ```bash
   git status
   ```

   If there are uncommitted changes that don't belong to this feature, stop and resolve first.

2. Refresh main:

   ```bash
   git checkout main && git pull --ff-only
   ```

3. Create the branch (kebab-case description, ≤ 50 chars total):

   ```bash
   git checkout -b feat/$ARGUMENTS
   ```

4. Plan the change as a TaskCreate todo list. Keep tasks small and concrete; reference specific files where possible.

5. Implement, committing in conventional-commit style as you go:

   ```
   feat(<scope>): <imperative subject>

   <optional body explaining *why*>
   ```

6. Run `/check` before opening the PR.

7. Use `/pr` to open the PR.
