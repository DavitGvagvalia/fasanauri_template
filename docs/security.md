# Security boundaries

Public menu and gallery data are readable without authentication. Locale routing and branch selection do not authorize operations.

Zustand state and localStorage are untrusted browser data. Cart restoration validates records and migrates older selections. Server rendering never shares customer cart state. Only cart lines and appearance persist. Contact fields remain in form memory and are not transmitted or saved.

Checkout currently clears the local cart without a server mutation. Login provides no authentication. No database, payment provider, or live order processing is configured.

Before introducing protected operations, authenticate the actor, authorize the exact operation and target, validate inputs on the server, and calculate prices and availability from trusted records. Keep secrets server only, exclude customer information from public caches and logs, and verify external webhook signatures when relevant.

See [current data boundaries](placeholderData.md).
