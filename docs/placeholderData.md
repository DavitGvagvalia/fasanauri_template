# Current data and integration

## Menu

The server loads categories through lib/menu/getCategories.ts and the complete catalog through lib/menu/getMenuCatalog.ts. Each helper simulates a 200 to 900 millisecond query. InitialMenu waits for a request below Suspense, loads both concurrently, and sends serializable records to MenuBrowser. The browser filters this complete catalog by branch, category, and multilingual search. All matching dishes are rendered on direct page requests. There is no infinite scroll.

The catalog currently comes from local JSON seeds and shared images. Zod validates domain records. Products have translated descriptions and demo prices in integer GEL minor units. Public categories, products, and product by ID HTTP routes remain available. Product dialogs can resolve direct links independently of active filters.

Switching branches on the loaded menu filters the existing catalog immediately. It does not repeat the simulated catalog query. About galleries still load on the server and show branch specific loading skeletons during navigation.

## Branches and galleries

Branch names and map links come from constants/places.ts. Contact details are withheld for every branch. Map destinations, daily hours, and photographs are temporary content. getPlaceGallery waits 200 to 900 milliseconds and returns image records with stable IDs and imageURL fields. The gallery renders the returned number of records and does not assume five images in its UI.

Branch cards and galleries share /images/placeholder_place_image.webp, served from public/images. The published WebP is a copy of the placeholder asset under assets/images.

## Cart, checkout, and legal content

The cart is browser only and persists validated selections and demo prices. Checkout validates contact fields in memory and clears the cart locally. It creates no order, sends no contact data, and processes no payment. Login does not authenticate. Terms and privacy article bodies still require actual legal content.

## Replacing current data

- Replace local catalog and gallery sources with server only database queries. Preserve typed response contracts and validate external data. Remove simulated delays.
- Supply actual images, branch map destinations, contact details, operating hours, product descriptions, allergens, serving options, prices, and availability.
- Keep authoritative availability, pricing, fees, and totals on the server before introducing a real checkout mutation. Browser selections cannot authorize a purchase.
- Decide delivery coverage, settlement currency, payments, contact handling, authentication needs, and legal policies before adding corresponding integrations.
- Refresh catalog caches deliberately and resolve persisted product IDs against current records. Store configuration and credentials only on the server and document variables in .env.example.
