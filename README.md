## DropVentures Marketplace

DropVentures is an African-focused dropshipping marketplace inspired by Jumia's buyer experience with a blue/green brand system. Sellers onboard with a Paystack-verified flow, while buyers browse CJdropshipping-powered catalogues.

### Tech stack
- Next.js App Router + TypeScript
- Tailwind CSS v4 via `@tailwindcss/postcss`
- Firebase Auth & Firestore for identity and profiles
- Paystack inline checkout for seller onboarding fee
- CJdropshipping API (pluggable, mocked for now)

### Getting started
1. Copy `.env.example` to `.env.local` and provide Firebase, Paystack, and CJdropshipping credentials.
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`
4. Visit `http://localhost:3000`

### Key user journeys
- **Authentication**: `/auth/sign-in`, `/auth/sign-up`
- **Role onboarding**: `/onboarding/role`
- **Buyer experience**: homepage, `/categories`, `/product/[id]`, `/buyer/cart`, `/buyer/checkout`
- **Seller funnel**: `/seller`, `/seller/verify`, `/seller/dashboard`

CJdropshipping calls fall back to mock data until valid credentials are supplied. Seller verification payments automatically persist to Firestore after a successful Paystack transaction.

### Scripts
- `npm run dev` – start local development
- `npm run build` – production build
- `npm run start` – serve production build
- `npm run lint` – run ESLint
