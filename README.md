# Merchant Services App

This project demonstrates account management using **Clerk**, **Next.js**, and **Prisma**. It includes three user roles: `ADMIN`, `VENDOR`, and `CUSTOMER`.

## Setup

1. Copy `.env.example` to `.env` and fill in database and Clerk credentials.
2. Run `npx prisma generate` and `npx prisma migrate dev` to set up the database.
3. Seed the database with `npm run seed`.
   Run `npm run seed:clerk` to create matching Clerk users.
4. Start the app with `npm run dev`.

Routes under `/dashboard` require login. Admin pages under `/admin` are restricted to admin users and vendor pages under `/vendor` are restricted to vendors.
The profile page lets users manage passwords and toggle 2FA.

Admin users can view analytics under `/admin/analytics` to monitor transaction history.


## Payment Gateways

This app integrates multiple payment providers using a unified adapter pattern. Supported gateways include:

- **Stripe** – <https://stripe.com/docs/api>
- **Square** – <https://developer.squareup.com/docs>
- **FortisPay** – <https://docs.fortispay.com>
- **First Data** – <https://developer.firstdata.com>
- **Worldpay** – <https://developer.worldpay.com>
- **PaySafe** – <https://developer.paysafe.com>
- **Authorize.Net** – <https://developer.authorize.net/api/reference/>
- **NMI** – <https://docs.nmi.com>

The `lib/paymentRouter.ts` file routes transactions to the appropriate adapter.

See the `multi-gateway-connector` directory for a base connector that unifies these APIs.

## Design Resources

Figma starter and template files live in the `design` folder:

- `figma-starter.fig` – foundation styles and components
- `dashboard-template.fig` – merchant dashboard layout
- `billing-flow-template.fig` – billing and checkout flow screens

Import these files into Figma to explore or customize the UI.

