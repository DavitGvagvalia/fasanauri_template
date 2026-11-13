<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:application-main-rules -->

# Fasanauri food ordering and delivery agent guide

This file is the execution contract for repository work. Detailed decisions are owned by:

- `docs/architecture.md` - system structure, data boundaries, integrations, and folder ownership.
- `docs/productRequirements.md` - product behavior, page map, and feature acceptance requirements.
- `docs/security.md` - authentication, authorization, validation, and external-service boundaries.
- `ROADMAP.md` - implementation order, phase dependencies, and deferred work.

If guidance conflicts, security constraints take precedence, then this file, then architecture and product requirements, then roadmap sequencing. Update all affected documents when intentionally changing a decision.

## Core engineering rules

- Always use TypeScript with strict typing. Never use `any` when the type is unknown; narrow `unknown` instead.
- Use absolute `@/` imports for repository modules. There is no `src/` directory.
- Prefer `const` over `let` and ES modules over CommonJS.
- Require explicit return types for named functions, components, hooks, and exported utilities. Allow inferred return types for contextually typed inline callbacks. Preserve generated-code conventions.
- Use arrow functions for components, hooks, utilities, and handlers. Next.js convention files may use function declarations when that matches the installed framework documentation.
- Prefix interfaces with `I` and type aliases with `T`.
- Use `IProps` for a component's file-local props interface. Imported shared props interfaces retain their domain names. Prefix enums with `E`, keep them under `constants/`, and use enums for category identifiers.
- Use the imported `ReactElement` type for component return types instead of `React.JSX.Element`. Import `ReactNode` when a component accepts React children.
- Name image URL fields `imageURL` in domain types, API responses, fixtures, and application props.
- Prefer named exports for utilities, hooks, schemas, and stores. React component files use a default export with one blank line before the export.
- Keep files focused and prefer composition over duplication. Outside framework convention files and generated/vendor code, each implementation file owns one primary unit: one React component, one hook, one utility function, one schema, one store, or one closely related server action/query operation.
- A component file may contain imports, its single component, a file-local props interface, and small private helpers or constants used only by that component when keeping them together improves clarity. Move child components, hooks, schemas, shared/domain types, and reusable or substantial helpers to focused files in their owning directories.
- Do not define subordinate render functions such as `renderLink`, `renderInline`, or `renderItem` inside a component. Prefer extracting a focused child component; use a render helper only as a documented last resort when a component boundary would materially harm clarity or behavior.
- A hook file may contain imports, its single hook, both file-local options and return interfaces, and small private helpers or constants used only by that hook when keeping them together improves clarity. Move reusable types and reusable or substantial helpers to focused files in their owning directories.
- A utility file may contain imports and one exported utility function, plus small private helpers or constants when keeping them together improves clarity. Extract reusable or substantial helpers into focused utility files.
- Keep reusable and domain types under `types/`, grouped by domain. Props, options, and return interfaces used by exactly one component or hook stay beside that implementation; shared props and all other reusable types move to `types/`.
- Keep shared constants under `constants/`, grouped by domain, and use `SCREAMING_SNAKE_CASE`. Export client-safe shared constants through the intentional shallow `@/constants` public API. Keep server-only constants in focused server-only modules outside this public API. Do not move constants that are required by a framework convention or generated integration.
- Treat `components/ui/` as shadcn-owned code: do not split its components, relocate its internal types/constants/helpers, rename its files, or otherwise restructure generated component internals to satisfy the one-unit rule.
- Separate top-level functions with one empty line. Inside a function body, place one empty line before each `return` statement. Keep consecutive hook declarations together, with one empty line before and after the hook block.
- Always use braces for `if`, `else`, loops, and other control-flow bodies, including guard clauses. Write `if (!value) {` followed by an indented `return` on its own line; never use a one-line `if (...) return` or `if (...) throw`.
- Prefer a bounded `for` loop over `while` whenever the iteration can be expressed with an initializer, condition, and update. Use `while` only when the loop is genuinely condition-driven and a `for` loop would obscure its intent.
- Prefer named event handlers in JSX (`onClick={scrollPrev}`, `onOpenChange={handleOpenChange}`) over inline arrow functions. Use an inline callback only when it is a trivial value adapter or needs a per-item argument and extracting it would reduce clarity.
- Move reusable regular expressions to a focused file under `constants/`, following the shared-constant visibility rules above. Keep a regex inline only when it is a one-off implementation detail whose name would not improve readability.
- Keep implementation files at or below 200 lines. Split components, hooks, helpers, types, and constants before exceeding that limit; exceed it only when a concise nearby comment explains why the unit is genuinely indivisible. Next.js convention files, generated code, migrations, and shadcn files are exempt when splitting would violate their owning convention.
- Add a concise nearby comment when a non-obvious pattern is intentional. Explain the architectural reason, not mechanics visible in the code. Human comments start with lowercase letters and use only dots and commas as punctuation. Prefer descriptive wording such as matches, preserves, or resolves. Preserve machine directives and generated framework comments.
- Use camelCase for custom non-component files (`settingsStore.ts`, `authContext.tsx`). Use PascalCase for React component files (`ProductCard.tsx`). Existing component files may be migrated when touched; do not perform unrelated mass renames. Next.js convention and generated filenames are exempt.
- Prefer `async`/`await` over promise `.then()` chains. Callbacks are allowed where framework APIs, event handlers, array operations, transactions, subscriptions, or dependency injection require them.
- Prefer readable names over abbreviations. Do not use names such as `i`, `idx`, or `char` when `index` or `character` is clearer.
- Before final verification after any repository change, run `npm run format`. When unrelated working-tree changes are present, format only files touched by the task with `npx --no-install prettier --write <files>` instead; the current `format` script always targets the whole repository, so passing filenames to it does not narrow its scope. Always run `npm run format:check` and report any pre-existing failures separately without modifying unrelated files.

## Before changing code

- Read the relevant installed Next.js guide under `node_modules/next/dist/docs/` before changing framework-facing code.
- Read the relevant documents linked above and the active phase in `ROADMAP.md`.
- Inspect existing components, query helpers, schemas, actions, and constants before creating new ones.
- Check the working tree and preserve unrelated user changes.
- Check `.env.example` when adding or changing configuration. Keep required variables documented.
- Do not introduce a library without a clear benefit and a check for an existing stack solution.
- Stay within the requested scope and current roadmap phase unless the user explicitly requests work from a later phase. Such a request authorizes advancing the relevant roadmap work; update the roadmap and affected decision documents to reflect the new scope and status. Flag missing product decisions instead of inventing features.

## Next.js and data flow

- Use the App Router and prefer Server Components.
- Add `"use client"` only at the smallest boundary that needs browser state or interactivity.
- Read database data in Server Components or focused helpers under `lib/db/queries/`.
- Use Server Actions for application mutations and Route Handlers for public HTTP boundaries such as payment webhooks and delivery integrations.
- Use native `fetch` for external HTTP. Use Next.js caching only where data may safely be shared; never cache cart, checkout, account, order, or admin data.
- Pass only serializable props from Server Components to Client Components.
- Use route-segment `loading.tsx`, `error.tsx`, and `not-found.tsx` where latency, failure, or absence is meaningful. Every session- or role-gated segment needs a representative loading state.
- Keep layout composition inside the corresponding `app/**/layout.tsx`. Do not create a top-level `layouts/` directory.

## Security boundaries

- Follow `docs/security.md` for all authentication and authorization work.
- Consult `docs/security.md` for current authentication and authorization status. Locale routing in `proxy.ts` provides no authentication guarantee; define authentication and staff authorization server boundaries before introducing protected routes.
- Layouts and hidden controls are not mutation security boundaries. Every privileged Server Action and Route Handler must authenticate the actor, authorize the exact operation and target, validate input, and scope reads/writes server-side.
- Server Actions accepting user input must parse it with the relevant Zod schema on the server, even when the client already validated it.
- Never expose secrets or trust client-provided identity, role, price, stock, ownership, or totals.

## Components, UI, and styling

- Prefer one React component per file and follow the file-size rule above.
- Keep business logic outside presentation components and move reusable behavior into hooks or utilities.
- `components/ui/` is reserved for shadcn/ui. App components belong in `components/features/`, `components/admin/`, or `components/shared/` as described in `docs/architecture.md`.
- Prefer shadcn/ui primitives and Lucide icons, as selected by preset `bcivVKbY`. Do not mix icon libraries.
- When shadcn/ui provides a component for the interaction or visual primitive, prefer that component over a custom equivalent and compose application behavior around it.
- Use Tailwind CSS and shadcn design tokens. Do not hardcode component colors or arbitrary radii; shared token registration belongs in `app/globals.css`, and palette values currently live in `app/globals.css`; extract theme files only when multiple themes are introduced.
- Use the shadcn tooltip component for supplementary hover or focus explanations. Do not use native browser tooltips such as the HTML `title` attribute.
- Use `cn()` from `@/lib/utils` for conditional classes.
- Build mobile-first and keep every page, including admin, responsive.
- Use semantic HTML, accessible labels, keyboard-operable controls, and real buttons for actions.
- Never hardcode user-facing copy in components. Add flat translation keys to every supported locale namespace.
- The supported UI languages are Georgian (default, `ka`), English (`en`), and Russian (`ru`), using next-intl and locale-prefixed routes. Use Noto Sans Georgian for Georgian and retain Inter with Latin/Cyrillic support for English/Russian. Homepage, placeholder, accessibility, and other user-facing text must all use the translation system.

## Forms and state

- When forms are introduced, prefer React Hook Form, `@hookform/resolvers/zod`, and schemas under `schemas/`. Check `package.json` before adding form or validation dependencies.
- Show validation errors beside their fields and reuse the same schema at the server boundary.
- Keep state local unless unrelated components genuinely share it. Prefer Zustand if a global state library becomes necessary; check `package.json` before adding it.
- Menu filter, sort, search, pagination, and price-range state belongs in URL search parameters.

## Imports and public APIs

- Group external imports, repository imports, and type-only imports with blank lines where helpful. ESLint currently uses the Next.js presets; do not claim additional enforced rules without configuring them.
- Do not create a barrel for every multi-file directory. Use `index.ts` only for a genuinely global or shared public API whose consumers should not know internal file layout, such as `constants/`, a reusable shared component package, or a stable feature boundary.
- Keep barrels shallow and export only the intended public surface. Feature-internal and route-local code should use direct imports.
- Do not add `optimizePackageImports` speculatively. Consult the installed Next.js documentation and add it only for a measured large-package import cost.

## Data and integrations

- Consult `docs/architecture.md` and `ROADMAP.md` for provider decisions and integration readiness. Do not carry over integrations from the previous project without a product decision.
- Keep database access and sensitive integrations in focused modules under `lib/` marked with `import "server-only"`; never instantiate drivers in presentation components. Keep these modules and server-only constants out of barrels consumed by client code, including `@/constants`.
- Keep future schemas and migrations in their integration-owned folders. Never edit an applied migration.
- Calculate item prices, modifiers, availability, delivery eligibility, fees, discounts, and totals on the server.
- Use integer minor units for money and centralize formatting. GEL is the initial display-currency assumption; confirm settlement currency before payment integration.
- Keep payment credentials and webhooks server-side; document provider requirements in `.env.example`.

## Minimum verification

- Apply the formatting procedure in Core engineering rules for every repository change, including documentation-only changes. Run `npm run lint` and `npm run typecheck` for implementation changes.
- Run `npm run build` for routing, framework, styling, dependency, or configuration changes.
- Add or update focused tests for changed business logic and regression tests for bug fixes when they can meaningfully verify behavior. Establish appropriate test tooling when meaningful testable behavior is introduced and no suitable tooling exists; avoid tests that merely mirror implementation details.
- For UI changes, verify the affected flows in a browser in all supported locales, including mobile layout and keyboard interaction.
- For documentation-only changes, inspect links, references, terminology, formatting, and the diff.
- If a required check cannot run, report exactly why and what remains unverified.

## Change documentation

- Keep `DOCUMENTATION.md` concise and focused on the current application, with an ISO 8601 verification timestamp including timezone. Keep current data sources and integration limitations in `docs/placeholderData.md`.
- Do not add an entry for read-only reviews or explanations unless the user explicitly requests one.
- Update current-state documentation instead of appending implementation history.

<!-- END:application-main-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
