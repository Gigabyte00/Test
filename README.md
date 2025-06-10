# Merchant Services App

This project demonstrates account management using **Clerk**, **Next.js**, and **Prisma**. It includes three user roles: `ADMIN`, `VENDOR`, and `CUSTOMER`.

## Setup

1. Copy `.env.example` to `.env` and fill in database, Clerk, Stripe, First Data/Fiserv, Square, and other gateway credentials.
2. Run `npx prisma generate` and `npx prisma migrate dev` to set up the database.
3. Seed the database with `npm run seed`.
   Run `npm run seed:clerk` to create matching Clerk users.
4. Start the app with `npm run dev`.

Routes under `/dashboard` require login. Admin pages under `/admin` are restricted to admin users and vendor pages under `/vendor` are restricted to vendors.
The profile page lets users manage passwords and toggle 2FA.

Admin users can view analytics under `/admin/analytics` to monitor transaction history.

### Merchant Onboarding Dashboard

Visit `/dashboard` to manage onboarding for all merchants. The dashboard lets you search merchants by business name or email, view details in a modal, manually mark statuses, and resend onboarding links. The backend provides admin API routes to update status (`/api/admin/mark-status`), resend onboarding (`/api/admin/resend-onboarding`), and send reminder emails (`/api/admin/send-reminders`).

## Merchant Onboarding

New vendors can complete a multi-step onboarding wizard under `/onboarding`. The wizard collects business information, bank details, owner KYC, and pricing plan selection before submitting to `/onboarding/api/submit`.

### KYC Verification via Stripe Identity

During the owner KYC step, merchants can click **Verify Identity with Stripe** which starts a Stripe Identity session via `/api/kyc/create-session`. When verification succeeds, Stripe calls `/api/stripe/kyc-webhook` to update the merchant record with `kycStatus = "VERIFIED"`.

### FortisPay Hosted Application

After submitting the onboarding form, merchants can be redirected to FortisPay's hosted application to finish underwriting. Step 5 of the wizard includes a **Complete Fortis Application** button which calls `/api/fortis/startApplication`. FortisPay then notifies the app via `/api/fortis/webhook` when the merchant is approved.

### Square OAuth Onboarding

Merchants that prefer Square can connect their account using the OAuth flow. Clicking **Connect with Square** sends them to `/api/square/connect` which generates the Square authorization URL. Square redirects back to `/api/square/callback` where the app exchanges the code for an access token and stores `squareMerchantId` and `squareAccessToken` on the merchant record.

### Stripe Connect Payouts

Merchants can also set up payouts through **Stripe Connect Standard**. The onboarding wizard offers a **Setup Stripe Payouts** button that calls `/api/stripe/connect` to create an account onboarding link. After completing the Stripe flow, merchants return to `/onboarding/stripe-return` and their `stripeAccountId` is stored in the database.

## Payment Gateways

This app integrates multiple payment providers using a unified adapter pattern. Supported gateways include:

- **Stripe** – <https://stripe.com/docs/api>
- **Square** – <https://developer.squareup.com/docs>
  - Start OAuth via `/api/square/connect` and handle the callback at `/api/square/callback`
- **FortisPay** – <https://docs.fortispay.com>
- **First Data / Fiserv BuyPass** – <https://developer.firstdata.com>
  - Submit merchant applications via `/lib/firstdata/onboard.ts` and `/api/firstdata/onboard`
  - Handle approval updates through `/api/firstdata/webhook`
- **Worldpay / TSYS** – <https://developer.worldpay.com>
  - Submit merchant applications via `/lib/worldpay/onboard.ts` and `/api/worldpay/onboard`
  - Handle status callbacks through `/api/worldpay/webhook`
- **PaySafe** – <https://developer.paysafe.com>
  - Submit merchant applications via `/lib/paysafe/onboard.ts` and `/api/paysafe/onboard`
  - Receive webhook updates through `/api/paysafe/webhook`
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
