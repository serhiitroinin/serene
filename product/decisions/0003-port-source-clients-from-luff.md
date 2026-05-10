---
name: "ADR-0003: Port source clients from luff verbatim, do not re-derive from spec"
description: LibreLinkUp / WHOOP / Garmin clients are reverse-engineered against bot-protected APIs; luff has working implementations.
type: decision
updated: 2026-05-10
status: Accepted
---

# ADR-0003: Port source clients from luff verbatim

## Status
**Accepted** (2026-05-10)

## Context

The three v0.1 source integrations (LibreLinkUp, WHOOP, Garmin Connect) hit endpoints with anti-bot protection (Cloudflare and similar). The user has working implementations in their `luff` repo, field-tested against their real accounts.

In the early implementation of `serene/apps/web/src/server/sources/libre.ts`, we *re-derived* the headers and auth flow from RFC + community references rather than porting from luff. This produced three speculative deviations:

1. Bumped `version` header to a guess (4.12.0 instead of luff's tested 4.16.0)
2. Added a custom User-Agent
3. Sent a preemptive `account-id` header derived from email instead of `user.id`

The combined deviations caused Cloudflare to reject otherwise-valid credentials with a confusing `status: 2 / "incorrect username/password"` response. Cost: PR #5, #6, #7 + ~2 hours of debugging on the wrong hypothesis. Fixed by porting luff's implementation verbatim in PR #8.

## Options considered

### Option A: Re-derive from spec / community references
- **Pros:** Cleaner code; no luff dependency in serene's mental model
- **Cons:** Bot-protected APIs reject fingerprints they don't recognize; speculative deviations cost real time

### Option B: Port luff verbatim, document the source
- **Pros:** Field-tested; survives bot-protection layer
- **Cons:** Two implementations of the same thing now exist

### Option C: Make luff a dependency
- **Pros:** Single source of truth
- **Cons:** Couples two unrelated projects; luff is a CLI mono-repo not designed as a library

## Decision

**Port verbatim. Document the source clearly.**

For each source client:
- Header set must match luff exactly unless we have *evidence* a deviation is needed.
- Auth flow (OAuth state machine, SSO ticket flow, account-id derivation) must match luff exactly.
- Code comments link to the corresponding luff path.
- A project memory note records this rule so future agents don't speculate.

When luff updates, we update serene with a matching PR.

## Consequences

### What becomes easier
- Source clients work on day one against real accounts.
- Bot-protection regressions are diagnosable: "did luff change?"

### What becomes harder
- Two copies to maintain. (Mitigated by both being trivial; both are < 300 lines.)

### Risks
- **Risk:** luff changes a header and serene drifts. Mitigation: project memory note + checklist when adding/updating a source.

## References
- [serene PR #8](https://github.com/serhiitroinin/serene/pull/8) — the fix that ported libre.ts verbatim
- [luff — packages/libre/src/providers/libre.ts](https://github.com/serhiitroinin/luff/blob/main/packages/libre/src/providers/libre.ts)
- Project memory: `LibreLinkUp auth canonical reference is luff`
