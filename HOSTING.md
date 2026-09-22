# Wobbledink G-Docs site deployment

Public origin: `https://wobbledink-g-docs.2iqlabs.com`

Cloudflare DNS / Cloudflare Pages custom domain:

- Type: `CNAME`
- Name: `wobbledink-g-docs`
- Target: `wobbledink-g-docs.pages.dev`
- Proxy status: DNS only
- TTL: Auto

Create the CNAME in the `2iqlabs.com` Cloudflare DNS zone with proxying disabled, then add `wobbledink-g-docs.2iqlabs.com` as a Custom domain in the existing Cloudflare Pages project so Cloudflare provisions TLS. Every file in this repository is served from the web root.

The browser API key in `picker-config.js` is restricted to Google Picker API and these website referrers:

- `https://wobbledink-g-docs.2iqlabs.com/*`
- `https://wobbledink-g-docs.pages.dev/*`
- `https://docs.google.com/*`

For Google ownership verification, add Google's TXT record to the root `2iqlabs.com` Cloudflare DNS zone and verify a Search Console Domain property. The Google Cloud project owner or editor must use the same Google account that verifies the domain.
