---
description: Squash-merge the current PR preserving context in the commit message
---

Squash-merge the open PR. The squash commit body must preserve the PR description and the original commit list — `gh pr merge --squash` without a constructed body discards both.

## Steps

1. Confirm a PR is open for the current branch:

   ```bash
   gh pr view --json url,number,title,body,state,mergeable,statusCheckRollup
   ```

2. Confirm CI is green:

   ```bash
   gh pr checks
   ```

   If pending, use `gh pr checks --watch`. If failing, fix and push more commits — do not bypass.

3. Get the commit list for the squash trailer:

   ```bash
   gh pr view --json commits --jq '.commits[] | "\(.oid[0:7]) \(.messageHeadline)"'
   ```

4. Construct the squash commit body:

   ```
   <PR body — Summary + Test plan>

   ---

   Squashed commits:
   abc1234 feat(scope): first commit subject
   def5678 feat(scope): second commit subject
   ...
   ```

5. Squash-merge with the constructed subject + body, and delete the branch:

   ```bash
   gh pr merge --squash \
     --subject "<PR title>" \
     --body "$(cat <<'EOF'
   <constructed body>
   EOF
   )" \
     --delete-branch
   ```

6. Refresh local main and confirm the merge landed cleanly:
   ```bash
   git checkout main && git pull --ff-only
   git log -1 --format="%h%n%s%n%n%b"
   ```

The squash commit on main now contains:

- Subject: PR title (conventional-commit style)
- Body: PR description (Summary + Test plan)
- Trailer: list of original commits as `<short-sha> <subject>`

This is what "squash merge with preserved context" means in this repo.
