// stores/subscription-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PricingTier = "free" | "monthly" | "yearly";

export interface PricingOption {
  id: PricingTier;
  name: string;
  price: number;
  priceUGX: number;
  interval: string;
  description: string;
  features: string[];
  dailyInvoices: string;
  popular?: boolean;
}

export const pricingOptions: Record<PricingTier, PricingOption> = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    priceUGX: 0,
    interval: "forever",
    description: "Get started for free",
    dailyInvoices: "1",
    features: [
      "1 invoice per day",
      "All templates",
      "PDF download & print",
      "Email sending",
      "Client management",
      "Custom branding",
    ],
  },
  monthly: {
    id: "monthly",
    name: "Starter",
    price: 0,
    priceUGX: 35000,
    interval: "month",
    description: "For growing businesses",
    dailyInvoices: "5",
    features: [
      "5 invoices per day",
      "All templates",
      "PDF download & print",
      "Email sending",
      "Payment collection",
      "Multi-currency wallet",
      "Withdrawals",
      "Client management",
      "Custom branding",
      "Email support",
    ],
  },
  yearly: {
    id: "yearly",
    name: "Pro",
    price: 0,
    priceUGX: 75000,
    interval: "month",
    description: "For power users & agencies",
    dailyInvoices: "Unlimited",
    popular: true,
    features: [
      "Unlimited invoices",
      "All templates",
      "PDF download & print",
      "Email sending",
      "Payment collection",
      "Multi-currency wallet",
      "Withdrawals",
      "Client management",
      "Custom branding",
      "Priority support",
    ],
  },
};

interface SubscriptionState {
  selectedPlan: PricingTier | null;
  selectedPlanDetails: PricingOption | null;
  currentSubscription: {
    plan: "FREE" | "MONTHLY" | "YEARLY";
    status: string;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
  } | null;
  invoiceCount: number;
  maxInvoices: number;
  isLoading: boolean;

  setSelectedPlan: (plan: PricingTier) => void;
  clearSelectedPlan: () => void;
  setCurrentSubscription: (subscription: any) => void;
  setInvoiceCount: (count: number) => void;
  incrementInvoiceCount: () => void;
  setLoading: (loading: boolean) => void;
  canCreateInvoice: () => boolean;
  getRemainingInvoices: () => number;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      selectedPlan: null,
      selectedPlanDetails: null,
      currentSubscription: null,
      invoiceCount: 0,
      maxInvoices: 1,
      isLoading: false,

      setSelectedPlan: (plan: PricingTier) => {
        const planDetails = pricingOptions[plan];
        set({ selectedPlan: plan, selectedPlanDetails: planDetails });
      },

      clearSelectedPlan: () => {
        set({ selectedPlan: null, selectedPlanDetails: null });
      },

      setCurrentSubscription: (subscription) => {
        set({ currentSubscription: subscription });
      },

      setInvoiceCount: (count: number) => {
        set({ invoiceCount: count });
      },

      incrementInvoiceCount: () => {
        const { invoiceCount } = get();
        set({ invoiceCount: invoiceCount + 1 });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      canCreateInvoice: () => {
        const { currentSubscription, invoiceCount, maxInvoices } = get();
        if (
          currentSubscription &&
          currentSubscription.plan === "YEARLY" &&
          currentSubscription.status === "ACTIVE"
        ) {
          return true; // Pro = unlimited
        }
        if (
          currentSubscription &&
          currentSubscription.plan === "MONTHLY" &&
          currentSubscription.status === "ACTIVE"
        ) {
          return invoiceCount < 5; // Starter = 5/day
        }
        return invoiceCount < maxInvoices; // Free = 1/day
      },

      getRemainingInvoices: () => {
        const { currentSubscription, invoiceCount, maxInvoices } = get();
        if (
          currentSubscription &&
          currentSubscription.plan === "YEARLY" &&
          currentSubscription.status === "ACTIVE"
        ) {
          return -1; // Unlimited
        }
        if (
          currentSubscription &&
          currentSubscription.plan === "MONTHLY" &&
          currentSubscription.status === "ACTIVE"
        ) {
          return Math.max(0, 5 - invoiceCount);
        }
        return Math.max(0, maxInvoices - invoiceCount);
      },
    }),
    {
      name: "subscription-storage",
      partialize: (state) => ({
        selectedPlan: state.selectedPlan,
        selectedPlanDetails: state.selectedPlanDetails,
        currentSubscription: state.currentSubscription,
        invoiceCount: state.invoiceCount,
        maxInvoices: state.maxInvoices,
      }),
    }
  )
);

export const useSubscription = () => {
  const store = useSubscriptionStore();

  return {
    ...store,
    selectPlanAndRedirect: (plan: PricingTier, router: any) => {
      store.setSelectedPlan(plan);
      router.push("/checkout");
    },
    getSubscriptionStatusDisplay: () => {
      const { currentSubscription } = store;
      if (!currentSubscription) return "Free Plan";
      const planName =
        currentSubscription.plan === "MONTHLY"
          ? "Starter"
          : currentSubscription.plan === "YEARLY"
            ? "Pro"
            : "Free";
      return `${planName} Plan - ${currentSubscription.status}`;
    },
  };
};
