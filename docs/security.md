# Security model

## Threat model

serene is a **single-tenant, self-hosted** dashboard for one athlete's health data. The threat model assumes:

- The host machine is trusted (not shared, not exposed to the public internet by default).
- The user controls the encryption key.
- Network traffic to upstream sources (LibreLinkUp, WHOOP, Garmin) goes over TLS.
- The browser session is local; no remote authentication exists in v0.1.

What we explicitly defend against:

- **Disk theft / SQLite exfiltration.** If someone copies `serene.db`, third-party credentials must remain unreadable without the encryption key.
- **Casual log inspection.** Credentials, tokens, and email addresses must not appear in logs or error messages.
- **Token leakage on screen.** The settings UI never displays a stored token; only "connected" / "not connected."

What we do **not** defend against in v0.1:

- A malicious local process with the user's UID — that process can read both the SQLite file and the env-var key.
- A malicious admin of the same host.
- Network-level adversaries with TLS-MITM capabilities (browser/OS trust store applies).

## Encryption

Every third-party credential payload (LibreLinkUp tokens, WHOOP OAuth refresh tokens, Garmin OAuth1+2 tokens, and the email/password fallback) is encrypted at rest using **AES-256-GCM**.

- **Algorithm:** `aes-256-gcm` (authenticated encryption with 16-byte tag)
- **Key length:** 32 bytes
- **IV length:** 12 bytes (random per encryption)
- **Tag length:** 16 bytes (appended to ciphertext)
- **Encoding:** base64 of `iv` followed by `tag` followed by `ciphertext`
- **Source:** `apps/web/src/server/db/encryption.ts`

The plaintext is never stored. The `data_source_credentials.encrypted_payload` column holds only the base64 envelope.

## Key lifecycle

The key is provided via the `SERENE_ENCRYPTION_KEY` environment variable.

```bash
# Generate
openssl rand -base64 32

# Set
export SERENE_ENCRYPTION_KEY="<paste base64 string>"
```

Rules:

- **Set before first run.** serene refuses to boot if `SERENE_ENCRYPTION_KEY` is missing.
- **Don't rotate yet.** v0.1 has no key-rotation tooling. Rotating means re-connecting every source. v0.2 will add `serene rotate-key`.
- **Don't lose it.** If you lose the key, re-create credentials from scratch — there is no recovery path.
- **Treat it like a password manager master key.** Back it up to a password manager.

In Docker compose, mount the key from a `.env` file or a Docker secret. Never commit a real key to a repo.

## What's NOT encrypted

- Glucose readings, activity track-points, recovery scores, scheduled workouts — these are user health data, not credentials. They live in the SQLite file in plaintext (the file itself is the security boundary).
- Sync timestamps and last-error strings — these may include API messages but never tokens.
- Email addresses on the `users` table — used for display only, not for re-auth.

If you need at-rest encryption for the health data itself (e.g., a shared host), use full-disk encryption or an encrypted SQLite extension. v0.1 does not require this.

## Verification

The encryption round-trip and "no plaintext in storage" properties are covered by tests in `apps/web/src/server/db/encryption.test.ts`. Run them with `bun run test`.

## References

- ADR-0002: [No treatment decision support](../product/decisions/0002-no-treatment-decision-support.md) — defines what data we never accept (so it isn't at risk).
- Constraints — [R2: GDPR / health-data minimization](../product/constraints.md).
