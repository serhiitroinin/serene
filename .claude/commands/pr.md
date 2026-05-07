---
description: Open a pull request for the current branch with summary and test plan
---

Open a PR for the current branch. Title and body are constructed from commits + branch context.

## Steps

1. Confirm `/check` passed locally.

2. Push current branch (set upstream on first push):

   ```bash
   git push -u origin HEAD
   ```

3. Read commits on this branch since main to construct the PR title/body:

   ```bash
   git log --pretty=format:"%h %s" main..HEAD
   git diff --stat main..HEAD
   ```

4. **Title**: the conventional-commit subject of the eventual squash commit.
   - Single commit on branch → use that subject.
   - Multiple commits → summarize at the same conventional-commit grain (`feat(<scope>): <subject>`).

5. **Body** template:

   ```markdown
   ## Summary

   - 1–3 bullets on what changed and why (focus on _why_).

   ## Test plan

   - [ ] How the change was verified locally.
   - [ ] What CI is expected to confirm.

   ## Screenshots / Loom

   (UI changes only.)
   ```

6. Open the PR:

   ```bash
   gh pr create --title "<title>" --body "$(cat <<'EOF'
   ## Summary
   ...

   ## Test plan
   - [ ] ...
   EOF
   )"
   ```

7. Return the PR URL.
