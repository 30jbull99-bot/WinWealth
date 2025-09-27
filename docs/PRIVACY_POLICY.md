# WinWealth Privacy & Data Ethics Policy (MVP)

_Last updated: September 27, 2025_

WinWealth is committed to ethical, transparent handling of user information. The MVP only collects the minimum data needed to deliver earning recommendations and payout tracking.

## 1. Data we collect

| Category | Examples | Purpose |
| --- | --- | --- |
| Authentication | Google account UID, display name, email (from Firebase Auth) | Secure login & payout verification. |
| Gameplay & earnings | Task completion logs, Fortune Spin results, streak counter | Personalised recommendations & fraud prevention. |
| Optional analytics | Device type, country, preferred focus area | Aggregate insights for product optimisation and paid research reports. |

## 2. Consent-first design

- No data is shared externally unless the user **opts in** via the in-app toggle (`Ethical data boost`).
- Opted-in data is anonymised (no names, emails, IPs) before generating CSV reports.
- Opt-out can be triggered at any time inside the settings panel or by emailing `privacy@winwealth.app`. Opt-out deletes existing analytics entries within 7 days.

## 3. Storage & retention

- Firebase Authentication & Firestore host all records in Google Cloud (free tier, multi-region).
- Backups are exported weekly to encrypted Google Drive folders accessible only to the founder.
- Task & payout logs are retained for 24 months for compliance, unless removal is requested sooner.

## 4. Data sharing & monetisation

- Affiliate partners only receive anonymised performance metrics (e.g., "120 Swagbucks signups"), never personal identities.
- Paid reports sold to governments/NGOs use aggregated statistics by country, task type, age bracket.
- No advertising network receives personal data before obtaining consent (AdMob displayed only after opt-in).

## 5. User rights

Users may request:

1. **Access** – receive a CSV of their activity logs within 5 business days.
2. **Correction** – update incorrect profile information.
3. **Deletion** – erase authentication profile + all Firestore documents.
4. **Data portability** – export anonymised stats for personal use.

Submit requests via `privacy@winwealth.app` or WhatsApp +61-000-000-000.

## 6. Security safeguards

- Enforce Firebase security rules (read/write restricted to authenticated users; admin service account for exports only).
- Enable multi-factor authentication on founder accounts.
- Rotate API keys quarterly and store secrets in `.env.local` (never commit to Git).

## 7. Contact & updates

Questions? Email `privacy@winwealth.app`. Policy updates appear in-app and on the GitHub Pages footer.

By using WinWealth you agree to this policy and confirm you are 18+.
