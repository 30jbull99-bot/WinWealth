# WinWealth MVP (React + Firebase + GitHub Pages)

Launch the earn-first WinWealth web app today with the following all-in-one blueprint. Everything below is optimised for a zero-budget founder running from a laptop + Android phone.

---

## Phase 1 – Environment setup (start of day)

1. **Install Node.js 20 LTS**
   - macOS: `brew install node@20`
   - Windows: download from [nodejs.org](https://nodejs.org/en) and tick "Add to PATH".
   - Linux: `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs`
2. **Clone & install dependencies**
   ```bash
   git clone https://github.com/<your-user>/WinWealth.git
   cd WinWealth
   npm install
   ```
3. **Create Firebase project (free tier)**
   - Console ➜ *Add project* ➜ `winwealth-mvp` ➜ disable Google Analytics for now (enable later).
   - Go to **Build → Authentication → Get started** ➜ enable Google provider.
   - Go to **Firestore Database → Create database → Start in production mode**.
   - Copy the config snippet (**Project settings → General → SDK setup**).
4. **Add local environment variables**
   ```bash
   cp .env.example .env.local   # create this file if it does not exist yet
   ```
   Fill keys from Firebase (API key, auth domain, project ID, storage bucket, sender ID, app ID, measurement ID). Never commit `.env.local`.
5. **Link GitHub repository + Pages**
   - Create GitHub repo `WinWealth`.
   - Add remote: `git remote add origin git@github.com:<your-user>/WinWealth.git`.
   - Enable GitHub Pages (Settings → Pages → Deploy from branch → `gh-pages`).

---

## Phase 2 – Core code walkthrough

The MVP lives inside [`src/App.jsx`](src/App.jsx) with Tailwind-on-CDN styles in [`src/index.css`](src/index.css).

Key building blocks:

| Feature | Description |
| --- | --- |
| **AI onboarding quiz** | Captures time commitment, goal, and confidence to pick focus area (`surveys`, `gigs`, `cashback`). |
| **Dashboard** | Lists three affiliate placeholder missions (Swagbucks, Fiverr, Survey Junkie) with complete + open actions. |
| **Fortune Spin** | Weighted RNG (80% cash rewards, 15% badges, 5% jackpot) with 24h cooldown and local history log. |
| **Consent toggle** | Calls `saveConsent` in [`src/firebase.js`](src/firebase.js) to store opt-in metadata in Firestore. |
| **Localization** | Language dropdown (English, Hindi, Portuguese) using the `translations` object. |
| **AI summary** | Generates a suggested plan (copy button ready to paste into social or notes). |
| **Side panel** | Power teams snapshot, passive boosts, badge shelf, payout checklist, marketing prompts, AdMob placeholder.

Firebase helpers in [`src/firebase.js`](src/firebase.js) guard against missing credentials, so the UI still works locally until `.env.local` is filled.

---

## Phase 3 – Integrations checklist

1. **Affiliate programmes (same-day approval tips)**
   - Swagbucks: apply to affiliate programme via [Prodege](https://prodege.com/). Replace URLs and add your referral parameters in `affiliateTasks`.
   - Fiverr: join the Fiverr Affiliate Network, use `https://track.fiverr.com/visit/?bta=XXXX&brand=fiverrhybrid` style links.
   - Survey Junkie: apply via CJ.com (Commission Junction). Update mission details once the link is live.
   - Add more partners (UserTesting, Amazon MTurk, Upwork) by extending the `affiliateTasks` array.
2. **AdMob**
   - Sign up for AdMob (free) → create an *App* (web) and banner/interstitial units.
   - Replace the placeholder box with the official script (`<script async src="https://pagead2.googlesyndication.com/...">`). Only load ads after user consent to comply with policies.
3. **Premium subscription**
   - Use Stripe or PayPal basic links (no monthly fee) to sell the $4.99 plan. Add buttons inside the Premium section pointing to payment links.
4. **Manual payout flow**
   - Create Firestore collections: `taskHistory`, `userConsents`, `payouts`.
   - After receiving affiliate commission, add a doc in `payouts` (`uid`, `amount`, `status`, `evidenceUrl`). Pay out 70–90% via PayPal/Stripe manual payouts.
5. **Data compliance**
   - Privacy policy lives in [`docs/PRIVACY_POLICY.md`](docs/PRIVACY_POLICY.md). Link it in your GitHub Pages footer.
   - Honor opt-out by clearing any consent docs + exclude from exports.

---

## Phase 4 – Deployment pipeline (GitHub Pages)

1. **Set base path**
   - Create `.env.production` with `VITE_GITHUB_PAGES_BASE=/WinWealth/` (replace with repo name).
2. **Build + deploy**
   ```bash
   npm run build
   npm run deploy
   ```
   The script uses `gh-pages` to push the `dist` folder to the `gh-pages` branch automatically.
3. **Mobile testing**
   - Open `https://<your-user>.github.io/WinWealth/` on your Oppo (Chrome).
   - Add to home screen → runs as PWA-like standalone page.
   - Test sign-in, Fortune Spin, language switch, consent toggle.
4. **Bug fixes**
   - Use Chrome DevTools → Lighthouse Mobile preset → ensure Performance > 80.
   - Document issues in GitHub Projects (create *Launch Day Board*).

---

## Phase 5 – Data tools & revenue assets

1. **CSV exporter** – run the helper script with Node to create anonymised datasets from Firestore exports.
   ```bash
   node scripts/exportAnonymizedData.js exports/userConsents.json exports/taskHistory.json
   ```
   This produces `exports/winwealth-anonymized.csv` ready for spreadsheets or Tableau Public.
2. **Sample report** – follow [`docs/DATA_REPORT_TEMPLATE.md`](docs/DATA_REPORT_TEMPLATE.md) for paid deliverables (e.g., *Global Income Trends 2025* priced at $15K).
3. **LinkedIn pitch** – copy/paste [`docs/LINKEDIN_PITCH.md`](docs/LINKEDIN_PITCH.md) when DM-ing governments, NGOs, and foundations.

---

## Phase 6 – Organic marketing sprint (today)

All content is pre-written in [`docs/MARKETING_PLAYBOOK.md`](docs/MARKETING_PLAYBOOK.md) including:

- 5 Reddit post drafts tailored to r/sidehustle, r/beermoney, r/IndiaInvestments, r/BrasilEmpreendedor, r/digitalnomad.
- 3 TikTok/Reels scripts (English/Hindi/Portuguese) with Oppo filming checklist.
- 10 launch hashtags.
- Community response templates for FAQs ("Is this legit?", "How do payouts work?").

Go live immediately after deployment – no waitlist.

---

## Phase 7 – Monitoring & optimisation

1. Enable Firebase Analytics (Project settings ➜ Integrations). Update `.env.local` with Measurement ID.
2. Call `initAnalytics()` on first render (already handled lazily in [`src/firebase.js`](src/firebase.js)).
3. Build dashboards:
   - Daily active users (DAU) vs. conversions (payout requests).
   - Spin engagement → `fortune_spin` event breakdown.
   - Consent opt-in rate vs. revenue from reports.
4. Iteration ideas:
   - Ship referral codes (Firestore collection `referrals`).
   - Add passive income autopilot tips (RSS from finance blogs).
   - Launch weekly livestream recaps using free tools (YouTube Live).

---

## Launch simulation (target: 100 early users)

| Metric | Value | Notes |
| --- | --- | --- |
| Signups | 100 | 60% via Reddit, 25% via TikTok, 15% via referrals. |
| Active teams | 8 | Average 12 users/team. |
| Spin participation | 240 spins | 2.4 spins/user leveraging bonus spins. |
| Affiliate conversions | 30 | Swagbucks (18), Fiverr (7), Survey Junkie (5). |
| Day-one revenue | $20 | $12 affiliate commissions, $5 ads, $3 premium trials. |
| Cash reserved for payouts | $14 | Pay users 70% of affiliate earnings while still net-positive. |

Stay cash-positive by reinvesting affiliate commissions and data-report sales into future rewards.

---

## Contributing & next steps

- Fork → feature branch → PR via GitHub.
- Keep all services free-tier compliant.
- Prioritise accessibility: test with screen readers, add alt text.
- Track roadmap tasks inside `/docs` or GitHub Projects.

Good luck launching WinWealth today – dominate the earn-not-burn market! 🚀
