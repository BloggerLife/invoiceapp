// import { PricingTier } from "@/stores/subscription-store";
import { loadStripe } from "@stripe/stripe-js";
if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "pk_test_placeholder"
);

export const MONTHLY_PRICE = 20;
export const YEARLY_PRICE = 200;

// export type PricingTier = "monthly" | "yearly";

// export interface PricingOption {
//   id: PricingTier;
//   name: string;
//   price: number;
//   interval: string;
//   description: string;
//   features: string[];
// }

// export const pricingOptions: Record<PricingTier, PricingOption> = {
//   monthly: {
//     id: "monthly",
//     name: "Monthly Plan",
//     price: MONTHLY_PRICE,
//     interval: "month",
//     description: "Perfect for individuals and small businesses",
//     features: [
//       "All invoice templates",
//       "Unlimited invoices",
//       "Client management",
//       "Export to PDF/CSV",
//       "Email support",
//     ],
//   },
//   yearly: {
//     id: "yearly",
//     name: "Yearly Plan",
//     price: YEARLY_PRICE,
//     interval: "year",
//     description: "Best value for businesses",
//     features: [
//       "All invoice templates",
//       "Unlimited invoices",
//       "Client management",
//       "Export to PDF/CSV",
//       "Priority support",
//       "Custom branding",
//       "Team access",
//     ],
//   },
// };
