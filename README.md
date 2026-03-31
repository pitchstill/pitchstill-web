# PitchStill Website

Static marketing site for GitHub Pages and a custom domain.

## Files

- `index.html` - landing page
- `privacy/index.html` - privacy policy page
- `support/index.html` - support page
- `assets/styles.css` - shared styling
- `assets/app.js` - optional GA4 loader and click tracking
- `assets/config.js` - site configuration
- `CNAME` - GitHub Pages custom domain

## Before Deploying

1. Set `gaMeasurementId` in `assets/config.js` to your GA4 property ID, for example `G-XXXXXXXXXX`.
2. If you want the App Store offer-code link used anywhere public, add it intentionally. The main site currently uses the public App Store listing only.
3. Upload the contents of this `website/` folder to the GitHub Pages repository root.
4. In your DNS provider, point `pitchstill.com` to GitHub Pages and set `pitchstill.app` to redirect.

## Screenshot Assets

The landing page currently uses the five images from `assets/screenshots_iphone-6.9_en-3/` copied into `website/assets/images/`.
