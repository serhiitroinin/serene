# serene

A designer-grade open-source dashboard for athletes with Type 1 Diabetes. Glucose alongside recovery and training, in one place. Self-host with one Docker compose.

> **Status:** v0.1 sprint runs May 5 – May 31, 2026. Building in public. [Roadmap](product/roadmap.md).
> **It is not a medical device.** [What serene is and isn't](docs/anti-scope.md).

## What's in v0.1

- Three sources: **LibreLinkUp** (CGM), **WHOOP** (recovery), **Garmin Connect** (activities + scheduled workouts).
- Today + Tomorrow cards: latest glucose with trend arrow, today's planned/actual workout, recovery, overnight TIR; tomorrow's session + 7 nights of overnight glucose mini-traces + 7d recovery strip.
- AGP-style 14-day percentile-band glucose chart.
- Glucose × workout synced overlay (HR / speed / glucose on a shared time axis) + per-HR-zone median glucose.
- Activity map with glucose-on-route coloring.
- Per-activity share links — read-only, signed, expiring.
- Encrypted-at-rest credentials (AES-256-GCM); see [docs/security.md](docs/security.md).

## Install — `docker compose up`

```bash
git clone https://github.com/serhiitroinin/serene.git
cd serene
cp .env.example .env

# Generate the at-rest encryption key and put it in .env
echo "SERENE_ENCRYPTION_KEY=$(openssl rand -base64 32)" >> .env

docker compose up -d
```

Open `http://localhost:3001` and walk through the setup wizard. Connect LibreLinkUp first — see [docs/sources/librelinkup.md](docs/sources/librelinkup.md) for the _follower account_ gotcha that catches most first-time users.

For WHOOP, register a developer app at [developer.whoop.com](https://developer.whoop.com) and set `WHOOP_CLIENT_ID` / `WHOOP_CLIENT_SECRET` / `WHOOP_REDIRECT_URI` in `.env` before bringing up the stack.

## Develop

```bash
bun install
cp apps/web/.env.example apps/web/.env  # edit SERENE_ENCRYPTION_KEY
bun run dev
```

Run all checks: `bun run check`. Lefthook runs them on `pre-push`.

## Project layout

```
apps/web/        TanStack Start app (UI + server functions + sync scheduler)
packages/core/   Pure-TS shared types, ranges, stats
packages/cli/    Thin HTTP client (placeholder; v0.2)
docs/            Engineering docs (security, anti-scope, source guides)
product/         Markdown PM system: vision, roadmap, personas, JTBD, ADRs
```

## v0.2 roadmap

- Apple Health + Dexcom sources
- Multi-tenant + GitHub OAuth (Better Auth)
- Manual treatment annotations (no IOB/COB; description only)
- Cross-source insights: glucose-at-zone heatmap, fueling-effectiveness curve, recovery-adjusted CV
- Light-theme polish to parity
- Coach-side share-link experience polish

See [product/roadmap.md](product/roadmap.md) for the full list.

## Anti-scope

serene **will not** include: alarms, IOB/COB, dose math, glucose predictions, clinician portal, FDA/EU-MDR submission, iOS native app, plugin marketplace. See [docs/anti-scope.md](docs/anti-scope.md).

## License

[MIT](LICENSE).
