# serene

A designer-grade open-source dashboard for athletes with Type 1 Diabetes. Glucose alongside recovery and training. Self-host with one Docker compose.

> **Status:** scaffolding. v0.1 sprint runs May 5 – May 31, 2026. Building in public.

## What's planned in v0.1

- LibreLinkUp + WHOOP + Garmin ingestion
- Designer-grade dashboard: AGP, CGM trace, glucose × workout overlay, recovery trend
- Map-based activity view with glucose-on-route overlay
- Single-link partner share with token URLs
- First-run setup wizard
- Both light and dark themes (dark-first; light at ~80% in v0.1)
- Self-host via Docker compose

## v0.2 roadmap

- Apple Health ingestion
- Multi-tenant + GitHub OAuth (Better Auth)
- Treatment tracking (insulin, carbs, exercise events) — opt-in, no clinical decision support
- Light-theme polish to parity
- MCP server for machine-readable API access
- Mobile-responsive polish

## Anti-scope

serene will not include: alarms, IOB/COB, clinician portal, EU-MDR certification, iOS native app, plugin marketplace. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE).
