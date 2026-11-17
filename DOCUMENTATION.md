# Application overview

Pasanauri is a multilingual restaurant menu with branch browsing, a persistent browser cart, and a local checkout preview.

- Georgian, English, and Russian routes, with Georgian as the default language.
- Menu filtering by category, branch, and search, plus product details and image viewing.
- A persistent cart with serving choices, quantities, and totals.
- Validated local checkout with optional notes, session-only demo orders, confirmation states, and order history.
- In-page order notices, optional sound alerts, and permission-based browser notifications.
- Branch galleries, opening hours, and public information pages.
- Responsive layouts, persisted light and dark themes, and localized PWA installation metadata and icons.

Checkout does not submit server orders or process payments. Staff review, delivery quotes, Wolt Drive dispatch, live updates, and background Web Push are not connected. Demo orders and notes disappear on reload, and contact fields remain in form memory. Login is informational. PWA installation does not provide offline ordering.

## Project references

- [Architecture](docs/architecture.md)
- [Product requirements](docs/productRequirements.md)
- [Current data and integration limitations](docs/placeholderData.md)
- [Security](docs/security.md)
- [Roadmap](ROADMAP.md)

## Verification

Run `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`. Browser checks should cover all three languages, mobile layout, keyboard access, dialogs, cart restoration, and checkout validation.

Last implementation verification: 2026-11-17T17:14:48+04:00. Formatting, lint, type checking, and the production build passed for the mobile header spacing change. Theme, language, and order controls now use equal eight pixel mobile gaps. All 107 behavior tests passed before this styling change. Firefox access was not approved, so visual, drag, and keyboard checks in all locales remain unverified. Native PWA appearance, sound, and native notifications also remain unverified.
