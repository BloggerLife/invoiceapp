# Invoice Generator SAAS Checkout Setup

## Prerequisites

1. **Next.js project** with TypeScript support
2. **Tailwind CSS** configured
3. **Stripe account** with API keys
4. **Environment variables** set up

## Installation

### 1. Install Required Dependencies

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js stripe canvas-confetti
npm install -D @types/canvas-confetti
```

### 2. Environment Variables

Create or update your `.env.local` file:

```env
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Database URL (if using database)
DATABASE_URL=your_database_url
```

### 3. Stripe Setup

#### Create Products and Prices in Stripe Dashboard

1. **Monthly Plan:**

   - Product Name: "Invoice Generator Pro - Monthly"
   - Price: $20.00 USD
   - Billing: Monthly
   - Copy the Price ID (starts with `price_`)

2. **Yearly Plan:**
   - Product Name: "Invoice Generator Pro - Yearly"
   - Price: $200.00 USD
   - Billing: Yearly
   - Copy the Price ID (starts with `price_`)

#### Update Price IDs in Code

Replace the placeholder price IDs in the checkout component:

```typescript
const pricingTiers: PricingTier[] = [
  {
    id: "monthly",
    stripePriceId: "price_YOUR_MONTHLY_PRICE_ID", // Replace this
    // ... other properties
  },
  {
    id: "yearly",
    stripePriceId: "price_YOUR_YEARLY_PRICE_ID", // Replace this
    // ... other properties
  },
];
```

#### Set Up Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret

## File Structure

```
your-project/
├── pages/
│   ├── api/
│   │   ├── create-payment-intent.ts
│   │   └── webhooks/
│   │       └── stripe.ts
│   ├── checkout/
│   │   ├── index.tsx (checkout page)
│   │   └── success.tsx (success page)
├── components/
│   ├── CheckoutComponent.tsx
│   └── SuccessPage.tsx
└── .env.local
```

Or for App Router:

```
your-project/
├── app/
│   ├── api/
│   │   ├── create-payment-intent/
│   │   │   └── route.ts
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts
│   ├── checkout/
│   │   ├── page.tsx
│   │   └── success/
│   │       └── page.tsx
└── .env.local
```

## Usage

### 1. Checkout Page

```typescript
// pages/checkout/index.tsx or app/checkout/page.tsx
import CheckoutPage from "../components/CheckoutComponent";

export default function Checkout() {
  return <CheckoutPage />;
}
```

### 2. Success Page

```typescript
// pages/checkout/success.tsx or app/checkout/success/page.tsx
import SuccessPage from "../../components/SuccessPage";

export default function Success() {
  return <SuccessPage />;
}
```

## Database Integration (Optional)

If you want to store subscription data, create a database schema:

```sql
-- Example PostgreSQL schema
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  customer_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  plan_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  stripe_customer_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Testing

### 1. Use Stripe Test Cards

For testing payments, use these test card numbers:

- **Successful payment:** 4242 4242 4242 4242
- **Payment requires authentication:** 4000 0025 0000 3155
- **Payment declined:** 4000 0000 0000 0002

### 2. Test Webhooks Locally

Use Stripe CLI to forward webhooks to your local server:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Deployment Checklist

1. **Environment Variables:**

   - Set production Stripe keys
   - Update webhook secret for production endpoint

2. **Webhook Endpoint:**

   - Update Stripe webhook URL to production domain
   - Verify webhook is receiving events

3. **Security:**

   - Ensure webhook signature validation is working
   - Verify environment variables are secure

4. **Testing:**
   - Test both monthly and yearly subscriptions
   - Verify email notifications are sent
   - Test webhook event handling

## Customization Options

### Styling

- Modify Tailwind classes in components
- Update color scheme in gradient classes
- Customize animation timings and effects

### Features

- Add discount codes support
- Implement trial periods
- Add multiple subscription tiers
- Integrate with email services (SendGrid, Mailgun, etc.)

### Payment Methods

- Enable additional payment methods in Stripe
- Add support for bank transfers
- Implement Buy Now, Pay Later options

## Troubleshooting

### Common Issues

1. **"No such price" error:**

   - Verify price IDs are correct in your code
   - Ensure you're using the right Stripe account (test vs live)

2. **Webhook not receiving events:**

   - Check webhook URL is accessible
   - Verify endpoint URL in Stripe dashboard
   - Check webhook signing secret

3. **Payment not completing:**
   - Check browser console for JavaScript errors
   - Verify Stripe publishable key is correct
   - Ensure HTTPS in production

### Debug Mode

Add logging to track payment flow:

```typescript
// Add to checkout component
console.log("Stripe loaded:", !!stripe);
console.log("Elements loaded:", !!elements);
console.log("Payment intent response:", response);
```

## Support

For additional help:

- [Stripe Documentation](https://stripe.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
