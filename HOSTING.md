# Wobbledink G-Docs site deployment

Public origin: `https://wobbledink-g-docs.2iq.club`

Namecheap Advanced DNS / Cloudflare Pages custom domain:

- Type: `CNAME`
- Name: `wobbledink-g-docs`
- Target: `wobbledink-g-docs.pages.dev`
- TTL: Auto

Create the CNAME in Namecheap Advanced DNS, then add `wobbledink-g-docs.2iq.club` as a Custom domain in the existing Cloudflare Pages project so Cloudflare provisions TLS. Every file in this repository is served from the web root.

Before deployment, replace `REPLACE_WITH_RESTRICTED_GOOGLE_PICKER_API_KEY` in `picker-config.js` with the browser API key created in Google Cloud project `wobbledink-g-docs-oauth`. Restrict the key to Google Picker API and these website referrers:

- `https://wobbledink-g-docs.2iq.club/*`
- `https://docs.google.com/*`

For Google ownership verification, add Google's TXT record to the root `2iq.club` DNS zone in Namecheap and verify a Search Console Domain property. The Google Cloud project owner or editor must use the same Google account that verifies the domain.
