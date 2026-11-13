# Product requirements

## Current application

A Georgian restaurant browsing website with English and Russian translations, branch selection, product details, a browser cart, and validated local checkout.

| Route                | Behavior                                                     |
| -------------------- | ------------------------------------------------------------ |
| `/[locale]`          | Complete menu with category, branch, and search filters      |
| `/[locale]/about`    | Selected branch gallery, opening hours, and contact sections |
| `/[locale]/cart`     | Saved selections, quantities, serving choices, and totals    |
| `/[locale]/checkout` | Local contact validation and completion                      |
| `/[locale]/login`    | Informational page                                           |
| `/[locale]/terms`    | Legal article with section navigation                        |
| `/[locale]/privacy`  | Privacy article with section navigation                      |

## Menu and product behavior

Render all matching dishes in the server response. Filter the supplied catalog in the browser, without infinite scrolling. Search matches titles across supported languages. URL state preserves branch, category, search, and selected product. Display category counts beside headings.

Selecting a branch closes the location sheet immediately. On the menu, update the branch URL, header label, and filtered catalog together without waiting for a server request. Preserve language, category, and search, and reset the pagination cursor. On the About page, switch the branch and show gallery skeletons while its server data loads.

Product details support descriptions, quantity, serving selection, sharing, and full screen image viewing. Share controls use a common tooltip delay. Opening details from a cart or removal toast preserves the cart sheet.

## Cart and checkout

Use Zustand for shared application state. Keep cart selections between reloads, validate saved values, and retain bottle and glass identities. Cap quantity at 99. Confirm removal before deleting a line. Added and removed item toasts have equal widths.

Validate name, country aware phone number, and address locally. Prioritize Georgia, Russia, and Ukraine in the country selector. Keep validation messages visible while focused fields use the normal focus border. Completion clears the browser cart and does not create an order or take payment.

The Georgian national phone field displays XXX XX XX XX and accepts at most nine digits. Entered digits replace those positions without changing the spacing. Other countries use their international national number grouping, with the calling code displayed separately. Typing, pasting, and changing countries all limit national digits to the selected mask length.

Checkout retains its existing page height. On desktop, the order grid fills the available space above the footer so the form and total can remain sticky with short orders. Short viewports allow the form column to scroll so every field and the submit button stay reachable. Mobile checkout uses the normal document flow.

## Presentation

Support Georgian, English, and Russian, mobile layouts, visible keyboard focus, accessible names, reduced motion, and persisted light and dark themes. The narrow header retains the branch below the brand, square location controls, uniform icon sizes, compact US language flag, and overlaid cart count.

The dark category strip and footer share an opaque zinc 900 background.

About galleries receive variable length image records from a server query. Do not publish actual addresses, phone numbers, or email addresses for branches.

Data limitations and integration changes are documented in [placeholder data](placeholderData.md).
