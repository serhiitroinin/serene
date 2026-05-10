# LibreLinkUp source

serene reads glucose data via the **LibreLinkUp follower API** — the same API used by the LibreLinkUp mobile app that family members install to follow a sensor wearer's glucose.

## Important: LibreLink ≠ LibreLinkUp

These are **two separate Abbott accounts**:

|                 | What it is                                                                     | Who uses it                                                                            |
| --------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| **LibreLink**   | The patient app — runs on the sensor wearer's phone, scans the sensor          | The athlete/patient                                                                    |
| **LibreLinkUp** | The follower app — installed by family/caregivers to see the patient's glucose | A follower (a caregiver, partner, or — for serene — _yourself with a different email_) |

The LibreLinkUp **follower API** only authenticates _follower_ accounts. **You cannot sign in to serene with your patient credentials.**

## Setting up serene as your own follower

Most serene users are _the same person_ who wears the sensor. To use serene, you need a follower account that follows yourself.

1. Open the **LibreLink** patient app on the phone you use to scan the sensor.
2. Go to **Connected apps** → **LibreView** (or in some regions: **Sharing** → **Add follower**).
3. Invite a follower. Use any email you have access to — a `+`-alias of your usual email works fine (e.g., `you+libre@gmail.com`).
4. Open the invitation in that inbox. The link prompts you to download the **LibreLinkUp** app and create a follower account.
5. Create the follower account; accept the invite.
6. Use **those follower credentials** when connecting LibreLinkUp in serene's setup wizard.

## Region

LibreLinkUp accounts are bound to a region (EU, US, AU, etc.). Pick the one your LibreLink app is registered in. If you pick the wrong region serene's auto-redirect will follow the API's `redirect` response and find the right one — but if both regions reject you, the credentials are wrong.

## Common errors

| Error                           | What it means                                           | What to do                                                                                                                                                                |
| ------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bad credentials`               | Username or password rejected by Abbott                 | Sign in at https://www.libreview.io/ to verify the credentials work. If they do not, you may be using LibreLink (patient) credentials in a follower endpoint — see above. |
| `accept the Terms of Use first` | The follower account has a pending consent screen       | Open the LibreLinkUp app on a phone, accept the Terms of Use, then retry.                                                                                                 |
| `no connected patients found`   | Login worked but no sensor is shared with this follower | The patient hasn't accepted the share request, or it expired. Re-invite from LibreLink.                                                                                   |
| `account is locked`             | Too many failed sign-ins                                | Sign in once via the LibreView website to unlock.                                                                                                                         |

## Polling cadence

serene polls every minute. The API's free tier supports this; we have not seen rate-limit responses in extended use.

## Privacy

LibreLinkUp credentials are encrypted at rest using AES-256-GCM (see [security.md](../security.md)). Only the SHA256 hash of your `user.id` is stored in the `Account-Id` header for subsequent API requests — never your email or password.

## Source code

`apps/web/src/server/sources/libre.ts` — port from [luff/packages/libre](https://github.com/serhiitroinin/luff/tree/main/packages/libre) per [ADR-0003](../../product/decisions/0003-port-source-clients-from-luff.md).
