# Application overview

Pasanauri is a multilingual restaurant menu with branch browsing, a persistent browser cart, and a local checkout flow.

- Georgian, English, and Russian routes, with Georgian as the default language.
- Complete server rendered menu, with client side category, branch, and multilingual search filters.
- Product details, image viewing, social sharing, and bottle or glass selection.
- Zustand cart state with validated localStorage persistence, quantities, totals, removal confirmation, and image toasts.
- Checkout contact validation and local completion. No order submission or payment processing.
- Branch gallery, daily opening hours, and contact sections without published contact details.
- About, terms, privacy, and informational login pages.
- Persisted light and dark appearance, responsive controls, translated labels, and error recovery pages.

## Project references

- [Architecture](docs/architecture.md)
- [Product requirements](docs/productRequirements.md)
- [Current data and future integration](docs/placeholderData.md)
- [Security](docs/security.md)

## Verification

Run `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`. Browser checks cover all three languages, mobile layout, keyboard access, dialogs, cart restoration, and checkout validation.

Tests live in feature folders under tests. The test command discovers nested .test.ts files. Coverage focuses on behavior, validation, persistence, navigation, and regressions rather than temporary fixture contents or component markup.

## Current verification

2026-11-13T19:42:54+04:00. Production build, lint, type checking, and formatting pass after the category panel and footer zinc palette adjustment. The build required network access to download Google Fonts. The prior test run reported all 56 tests passing across 18 files. Browser verification of colors, extension injected attributes, all locales, mobile layout, and keyboard interaction remains unavailable because the browser access host is unavailable.
