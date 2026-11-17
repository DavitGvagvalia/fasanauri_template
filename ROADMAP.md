# Roadmap

## Overall scope

Pasanauri is a Georgian restaurant menu and food ordering application with Georgian, English, and Russian interfaces. The intended live service covers branch browsing, menu selection, customer checkout, manual restaurant review, delivery pricing, customer confirmation, payment, and courier tracking.

The current application is a frontend preview backed by local catalog data and browser state. Public read endpoints exist, but there is no database, authenticated staff area, server order submission, payment processing, or courier integration. Connecting these trusted backend operations is the next implementation phase.

## Implemented

| Area                      | Current capability                                                                                                                                                                                                                                   |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Application foundation    | Next.js App Router, strict TypeScript, Tailwind, shadcn primitives, localized routes, shared layout, loading states, and error recovery.                                                                                                             |
| Languages and appearance  | Georgian by default, English and Russian translations, Georgian and Latin/Cyrillic fonts, persisted light and dark themes, responsive layouts, keyboard controls, and reduced motion support.                                                        |
| Menu                      | Complete server-rendered catalog, URL-based category, branch, and multilingual search filters, category counts, and immediate filtering of loaded data.                                                                                              |
| Products                  | Direct-link dialogs, mobile drawers, image viewing, serving choices, unit prices, and add, update, and remove actions. Sharing support exists behind a disabled feature flag.                                                                        |
| Branches                  | Branch switching, server-loaded galleries with loading states, opening hours, and contact sections. Images, hours, and map destinations remain placeholders, and contact details are withheld.                                                       |
| Cart                      | Validated browser persistence, quantity limits, bottle and glass identities, totals, removal confirmation, item feedback, and a shared store that survives development module refreshes.                                                             |
| Checkout preview          | Local name, country-aware phone, and address validation, optional notes up to 500 characters, responsive order summary, and local completion. Delivery is identified as an additional cost.                                                          |
| Demo orders               | Session-only snapshots independent of cart edits, staff pending and customer confirmation states, confirmed, courier, declined, and delivered examples, grouped history, decline reasons, and arrival clocks. Staff acceptance is simulated locally. |
| Order notices             | Prioritized courier and waiting-order notices, collapsible cards, carousel overflow, sidebar-aware positioning, hiding during mobile product drawers, swipe and mouse dragging with spaced slides, and a confirmation indicator in the order drawer. |
| Notification preview      | In-page status updates, interaction-enabled sound, optional browser notifications, permission retry guidance, and a saved reminder dismissal preference. No live event source or background push exists.                                             |
| Public pages and branding | About, terms, privacy, and informational login routes, shared brand artwork, image placeholders, and localized error recovery. Legal article content still requires replacement.                                                                     |
| Installed presentation    | Localized PWA manifests, shared app scope, installation and Apple icons, standalone display requests, and theme-aware window colors. No service worker or offline ordering.                                                                          |
| Data contracts and checks | Typed and validated seed data, public category and product read routes, feature-grouped behavior and regression tests, formatting, lint, type checking, and build scripts.                                                                           |

Cart selections, appearance, and notification reminder preferences persist locally. Submitted demo orders and notes disappear on reload. Contact fields remain in form memory. Browser totals and statuses are not authoritative for real orders.

## Decisions required before live integration

- Choose the backend and database hosting approach, database tooling, and media storage. Existing server query boundaries can connect to a database or an agreed external backend without changing the UI contracts unnecessarily.
- Decide whether restaurant review belongs in an admin area or a dedicated staff area, including branch access and operational roles.
- Decide customer authentication or guest order access, ownership verification, and how customers recover orders after closing the page.
- Choose a payment provider and confirm settlement currency. GEL is currently the display assumption.
- Confirm delivery coverage and verify Wolt Drive quote, dispatch, webhook, and tracking contracts before relying on them.
- Choose live update and notification channels. In-page updates, sound, native browser notifications, and background Web Push have different requirements.
- Approve real catalog and branch content, customer-facing decline reasons, contact handling, retention, and legal policies. Publishing branch contact details requires an explicit product decision.

## Remaining implementation

### 1. Connect authoritative backend data

- [ ] Configure the chosen backend and database, migrations, server-only credentials, and documented environment variables in `.env.example`.
- [ ] Replace JSON catalog and simulated gallery queries with trusted server data. Preserve validated response contracts and remove artificial query delays.
- [ ] Store branches, localized categories and products, serving options, prices in integer minor units, availability, and media references.
- [ ] Replace placeholder imagery, maps, hours, descriptions, allergens, and legal content with approved records.
- [ ] Define catalog cache invalidation and reconcile persisted cart product IDs with current availability and prices. Keep customer and order data out of shared caches.

Completion means menu and branch pages use real records, while checkout still cannot accept live orders until the security and order boundaries below are ready.

### 2. Establish authentication and durable order submission

- [ ] Implement the agreed staff authentication and customer access model, with server-side authorization for each operation and target order.
- [ ] Add durable orders, item snapshots, contact and delivery details, notes, statuses, and timestamps. Define allowed transitions and retain ownership independently of browser state.
- [ ] Replace local checkout completion with a validated server mutation. Resolve current products and calculate availability, food prices, and totals on the server.
- [ ] Handle invalid selections, unavailable items, duplicate submissions, and failed requests without losing the customer's editable cart.
- [ ] Load only the customer's authorized orders after navigation or reload. Remove seeded orders and automatic fixture transitions from live operation.
- [ ] Apply the agreed privacy and retention rules to contact details and notes, excluding them from public caches, logs, and notifications.

Completion means a valid checkout creates one persistent order awaiting restaurant review, with secure customer retrieval and no payment or dispatch implied by submission.

### 3. Implement restaurant review and customer reconfirmation

- [ ] Build the selected staff surface with authorized order reads and accept or decline actions, scoped to the permitted branch and operation.
- [ ] Store customer-facing decline reasons and notify the owning customer without charging a declined order.
- [ ] After staff acceptance, obtain a verified Wolt Drive quote and calculate the authoritative food total, delivery fee, and final payable amount.
- [ ] Show the updated amount to the customer and persist their reconfirmation of that exact quote and total. Handle expired or changed quotes before payment.
- [ ] Connect existing order details and notices to authorized backend state, with the selected live update mechanism and recovery after disconnects.

Completion means restaurant decisions and customer reconfirmation survive reloads and cannot be forged by editing browser state.

### 4. Connect payment, delivery, and tracking

- [ ] Create provider payment requests for the server-approved amount and bind them to the correct order and customer.
- [ ] Verify payment callbacks or webhooks through trusted server boundaries. Handle failed, repeated, and out-of-order events without duplicate side effects.
- [ ] Dispatch the courier and release the order for kitchen preparation only after verified successful payment. Make these operations idempotent and define recovery for provider failures.
- [ ] Validate delivery callbacks and provider responses, update delivery status and arrival estimates, and expose the tracking link only to the owning customer.
- [ ] Replace sample fees, durations, and courier records with provider-backed values. Agree payment failure, cancellation, refund, and dispatch failure behavior before launch.

Completion means payment, preparation, dispatch, and tracking follow verified server events rather than local confirmation controls.

### 5. Verify and prepare for launch

- [ ] Implement the chosen notification channels from authenticated events. Add background Web Push only if selected, with its own service worker and subscription lifecycle.
- [ ] Verify all three locales, mobile layouts, keyboard flows, reload recovery, unavailable products, declines, quote changes, payment failures, and delivery failures.
- [ ] Exercise database and provider integrations in staging, including authorization failures and duplicate webhook delivery.
- [ ] Verify installed PWA appearance, audible alerts, and native notification permission behavior on supported browsers and devices.
- [ ] Configure production secrets, HTTPS, database backups, operational monitoring, and provider failure recovery before accepting live orders.
- [ ] Run formatting, lint, type checking, behavior tests, and a production build. Update current-state documentation with the verified integrations and remaining limits.

## Approved live order sequence

Customer submission, staff acceptance or decline, delivery quote and final total, customer reconfirmation, verified payment, courier dispatch and kitchen preparation, then customer tracking.

A decline ends the order without payment. Customer reconfirmation alone never establishes payment or courier dispatch. The exact staff surface, backend providers, notification channels, and operational policies remain open decisions.

Offline ordering and additional product features are outside the current approved scope. Detailed visual acceptance criteria belong in the product requirements rather than this implementation plan.

## References

- [Application overview and verification](DOCUMENTATION.md)
- [Architecture and ownership](docs/architecture.md)
- [Product requirements](docs/productRequirements.md)
- [Current data and integration limitations](docs/placeholderData.md)
- [Security boundaries](docs/security.md)
