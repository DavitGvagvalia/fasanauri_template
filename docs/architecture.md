# Architecture

## Stack

Next.js App Router, React, strict TypeScript, Tailwind CSS, shadcn and Base UI primitives, next-intl, Zod, React Hook Form, and Zustand.

## Ownership

| Directory             | Responsibility                                          |
| --------------------- | ------------------------------------------------------- |
| `app/[locale]`        | Localized pages, layout, metadata, and route boundaries |
| `app/api`             | Public read endpoints                                   |
| `components/features` | Menu, branch, cart, and checkout UI                     |
| `components/shared`   | Header, footer, theme, images, and legal content        |
| `components/ui`       | Generated shadcn primitives                             |
| `hooks`               | Client behavior and store selectors                     |
| `lib`                 | Queries, stores, and focused utilities                  |
| `schemas`             | Input, response, and storage validation                 |
| `types`               | Shared domain contracts                                 |
| `constants`           | Client safe constants and ECategory and EPlace enums    |
| `messages`, `i18n`    | Translations and locale navigation                      |
| `tests`               | Feature grouped behavior and regression tests           |

Tests are grouped under cart, checkout, menu, places, sharing, i18n, and theme. The test command discovers nested test files. Keep behavior and regression coverage with its owning feature, and avoid duplicate checks or assertions tied only to temporary fixture content.

## Rendering and state

The locale layout suppresses hydration warnings on the body element because browser extensions can add attributes before React hydrates. Page components retain hydration checks.

Server Components compose routes and fetch the complete menu and branch gallery. Serializable data reaches interactive components. Menu filters live in URL parameters and operate on the supplied catalog without infinite scrolling. The matching dishes render in the server response for direct category and search links.

Branch selection on the menu uses the same native history updates as other menu filters. The URL remains the source of truth for the header and catalog, with no server navigation needed for data already supplied. About branch navigation uses a branch keyed Suspense boundary so the new URL can commit with a gallery skeleton while server data loads.

The locale layout rejects unsupported locales without explicitly opting into instant navigation validation. Pages retain framework default validation, while the catch all 404 page opts out. The shared food placeholder uses eager loading consistently because it also appears above the fold. Other card images follow their individual loading policy. The application favicon uses the header utensils symbol.

Zustand owns cart selections, totals, sheet visibility, and appearance. Browser consumers share stores. Server rendering uses isolated empty snapshots. Cart and theme storage restore after mounting, without inline script rendering. Only cart lines and appearance persist. Contact fields and completion state remain local to checkout.

One URL driven product modal supports menu, cart, and toast entry points. Opening it preserves an existing cart sheet. Shared image dialogs handle full screen viewing. Layout composition stays in route layouts.

## Internationalization and styling

Locale prefixed routes support ka, en, and ru. All UI copy uses translation keys. Georgian uses Noto Sans Georgian, while English and Russian use Inter. Palette tokens live in app/globals.css. Feature styles live under app/styles. Components use responsive Tailwind classes and shared shadcn primitives.

The dark menu panel token uses Tailwind zinc 900 to match the shadcn zinc palette. Category filters and the footer use it without transparency in dark mode. On desktop, the checkout main and order grid grow into the existing layout space. This gives the sticky form room to move above the footer without an additional minimum page height.

See [current data fetching](placeholderData.md) and [security boundaries](security.md).
