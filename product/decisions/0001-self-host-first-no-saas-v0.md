---
name: "ADR-0001: Self-host first; no hosted SaaS for v0.1"
description: serene v0.1 ships as a self-hosted Docker compose; no hosted offering.
type: decision
updated: 2026-05-10
status: Accepted
---

# ADR-0001: Self-host first; no hosted SaaS for v0.1

## Status

**Accepted** (2026-05-10)

## Context

serene targets T1D endurance athletes who:

- Are technically capable (run Docker, manage their own keys)
- Prefer to control their own health data
- Are skeptical of yet another health-data SaaS

A hosted SaaS would have advantages: lower friction for non-technical users, hosted backups, easier upgrades. But it also requires:

- HIPAA / GDPR-grade infrastructure
- Auth + multi-tenant security from day 1
- Operational on-call for a single founder
- Business model (paid tier, billing infra)

## Options considered

### Option A: Self-host only (Docker compose)

- **Pros:** Audience trusts it; no infra cost; no on-call; no auth/multi-tenant required for v0.1; values-aligned with target persona
- **Cons:** Smaller audience reach; no metrics from real-world users by default

### Option B: Hosted SaaS only

- **Pros:** Reach more users; consistent UX; revenue model
- **Cons:** Burdens v0.1 with auth, billing, multi-tenant, infra ops, compliance — solo dev cannot ship in 4 weeks

### Option C: Both at launch

- **Pros:** Capture both segments
- **Cons:** Double the surface area; doubles testing; v0.1 ships nothing well

## Decision

**Self-host only for v0.1.** Docker compose, single-tenant runtime, multi-tenant-ready schema.

## Consequences

### What becomes easier

- v0.1 scope shrinks dramatically — no auth, no billing, no multi-tenant infra
- Trust narrative is clean: "your data lives on your machine"
- Solo-developer-friendly deployment story

### What becomes harder

- Audience reach is smaller (must self-host); some interested users will bounce
- No automatic metrics — telemetry is opt-in only
- v0.2+ multi-tenant migration is still ahead (mitigated by schema design)

### Risks

- "Nobody self-hosts" → mitigated by the persona being technical
- "We can't measure success" → metrics are GitHub stars, anonymized opt-in pings, qualitative feedback

## References

- [Vision](../strategy/vision.md)
- [Constraints — B2](../constraints.md)
