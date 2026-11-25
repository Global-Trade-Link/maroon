# Maroon frontend

This repository contains the React/Vite storefront and owner admin UI. The Rust API, PostgreSQL migrations, database configuration, uploads, API tests and backend deployment files are in the separate [maroon-backend repository](../maroon-backend/README.md) at `D:\Work\maroon-backend`.

## Run locally

Start the backend first in its own terminal using its README. It listens on `http://127.0.0.1:3001` by default.

In a second PowerShell terminal:

```powershell
cd D:\Work\maroon
npm ci
Copy-Item .env.example .env
npm run dev
```

The frontend command starts Vite only. Rust and PostgreSQL run separately from the backend checkout.

- Storefront: [http://localhost:5173](http://localhost:5173)
- Owner studio: [http://admin.localhost:5173](http://admin.localhost:5173)
- Legacy `/admin` links redirect to the admin subdomain; the studio renders only on `admin.(domain)`.

`.env.example` contains only `API_PROXY_TARGET`, the development proxy destination. `/api` and `/uploads` are proxied to the API so browser requests stay on the frontend origin. Change the target if your API runs on another port; configure the matching storefront/admin origins in the backend's environment. Database passwords and other backend secrets belong only in `maroon-backend/.env`.

Owner provisioning is performed from the backend repository with `cargo run --locked -- admin-setup`. There is no default owner account or signup.

## Check and build

```powershell
npm run build
npm test
```

`npm run preview` previews the static build only; it does not run or proxy the API. Use the Vite development server for the complete local user flow, or the production stack for a complete production-like deployment.

The frontend Dockerfile builds the React app and serves it with Nginx. It contains no Rust compiler, API binary or database. Nginx handles SPA fallback and prevents indexing the admin hostname. Production routing of `/api` and `/uploads` is managed by the separate deployment stack.

## Production deployment

Clone both repositories as siblings:

```text
/work/maroon/          React frontend and frontend Dockerfile
/work/maroon-backend/  Rust API and production deployment stack
```

The [backend deployment guide](../maroon-backend/README.md#production-deployment) runs PostgreSQL, the Rust API, the independently built frontend container and Caddy. Configure DNS for `maroon.com.np` and `admin.maroon.com.np` to the deployment server. On both hostnames, Caddy sends `/api` and `/uploads` to Rust and all other requests to the frontend container. This preserves the host-only admin cookie and same-origin API calls.

For another hosting arrangement, serve the frontend `dist/` on both hostnames, use SPA fallback, and reverse proxy `/api` and `/uploads` to the Rust API on each origin. Hosting static files alone will not support checkout. Keep database credentials out of frontend build variables.

## Test the user flow

The API and Vite dev server must both be running. Existing owner credentials are preserved.

1. Open http://localhost:5173 and add a ready-made piece and a custom design.
   Repeated clicks on the same ready-made piece increase its quantity in one row. Older duplicate rows are consolidated on reload. Each item is limited to 20; independently customized designs remain separate.
2. Open the bag. Change the custom quantity, select **Edit design**, change a chain/charm/slot or assembly choice, and **Save changes**. The same bag item is updated; its quantity, repeated charms and empty slots are retained. **Back to bag** cancels unsaved edits.
3. Continue to checkout. Name, phone, **email**, delivery area/address and policy acceptance are required. The shared storefront header and footer remain available.
4. Continue to payment, then submit a transaction reference or private screenshot. The browser redirects to a confirmation page with the order number, email, items and delivery details. No customer account or order-status navigation is shown.
5. In the owner studio, review the payment independently, mark Paid with receipt confirmation, and save. This queues the order-confirmation email. Shipping, payment rejection and cancellation also queue customer updates. Review the **Customer emails** section for delivery status.

For payment-free local tests, use fictional details and a made-up reference. Do not send money. The existing local database is already enabled for checkout. On another sample database, run `cargo run --locked -- dev-checkout-setup` from `D:\Work\maroon-backend`. This requires development mode and a loopback database, refuses real merchant settings, and preserves existing owner credentials/catalog/orders. The generated placeholder is not a payment QR; the customer UI shows a neutral missing-QR state until the owner uploads the real one. Sample banners and test notices are not rendered in the storefront.

The browser retains the bag, pending checkout key and guest payment capability so refresh/retries can recover an unfinished payment. An unpaid order has a persistent **Resume payment** banner, a **Payment** navigation link and a resume action in the bag/checkout, including an empty bag. New bag items stay separate from the saved order, and checkout resumes that order before creating another. The reminder clears after payment details are submitted, payment is confirmed or the order is cancelled; returning to the window checks the server. Submitted orders redirect to confirmation rather than a status dashboard. Prices and availability are checked by the server; order layouts and totals are immutable snapshots.

### Email setup

Local development defaults to `EMAIL_DELIVERY_MODE=preview`. The backend worker writes private JSON messages to `D:\Work\maroon-backend\data\emails` and marks them **Local preview saved** in the studio. No credentials are needed for this mode, and it sends nothing to inboxes. Preview files are not publicly served. Messages already previewed are not resent when changing modes; place a new order for an inbox test.

For actual inbox delivery, set these in **maroon-backend/.env**, then restart the API:

```dotenv
EMAIL_DELIVERY_MODE=resend
RESEND_API_KEY=re_your_sending_api_key
EMAIL_FROM="Maroon <orders@your-verified-domain.com>"
```

Use a Resend sending key and a sender/domain verified in that account. No email secrets belong in Vite variables. Production requires these credentials and does not allow preview mode. See the [backend email guide](../maroon-backend/docs/EMAIL.md) and [Resend sending documentation](https://resend.com/docs/api-reference/emails/send-email).

Payment submission queues an acknowledgement explaining that verification is pending. The owner's Paid action queues confirmation. Messages are committed with the order change, deduplicated by order/event and retried separately; mail failure never deletes an order or marks a payment paid. **Accepted by email provider** means the provider accepted the message, not that the recipient opened or received it. No owner notification emails are currently sent.

Manual payment needs no Fonepay API credentials. Automatic payment verification remains a later phase, documented in the [Fonepay integration plan](../maroon-backend/docs/FONEPAY.md). Inventory deduction, courier APIs, analytics and customer accounts are not implemented. The owner must approve catalog details, policies and real merchant settings before accepting real orders.
