"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { db } from "@/prisma/db";
import { authOptions } from "@/config/auth";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCEEDED" | "FAILED" | "CANCELLED" | "REFUNDED";
  description: string | null;
  plan: "FREE" | "MONTHLY" | "YEARLY";
  interval: string | null;
  paidAt?: string;
  failedAt?: string;
  refundedAt?: string;
  receiptUrl?: string | null;
  invoiceUrl?: string | null;
  createdAt: string;
}

interface Subscription {
  id: string;
  plan: "FREE" | "MONTHLY" | "YEARLY";
  status: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  cancelAt?: string;
  priceAmount?: number;
  priceCurrency: string;
  interval?: string;
}

// Get user session and validate
async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: { subscription: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

// Server action to fetch subscription data
export async function getSubscriptionData(): Promise<Subscription | null> {
  try {
    const user = await getAuthenticatedUser();

    if (!user.subscription) {
      return null;
    }

    return {
      id: user.subscription.id,
      plan: user.subscription.plan,
      status: user.subscription.status,
      currentPeriodStart: user.subscription.currentPeriodStart?.toISOString(),
      currentPeriodEnd: user.subscription.currentPeriodEnd?.toISOString(),
      cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd,
      cancelAt: user.subscription.cancelAt?.toISOString(),
      priceAmount: user.subscription.priceAmount || 0,
      priceCurrency: user.subscription.priceCurrency || "usd",
      interval: user.subscription.interval ?? "",
    };
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  } finally {
    await db.$disconnect();
  }
}

export async function getInvoiceCount(): Promise<number> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user.invoiceCount;
  } catch (error) {
    console.error("Error fetching invoice count:", error);
    return 0;
  } finally {
    await db.$disconnect();
  }
}

// Server action to fetch payments
export async function getPayments(
  page: number = 1,
  limit: number = 10
): Promise<{
  payments: Payment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}> {
  try {
    const user = await getAuthenticatedUser();

    const offset = (page - 1) * limit;

    const [payments, totalCount] = await Promise.all([
      db.payment.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
        select: {
          id: true,
          stripePaymentId: true,
          dgwReference: true,
          amount: true,
          currency: true,
          status: true,
          description: true,
          plan: true,
          interval: true,
          paidAt: true,
          failedAt: true,
          refundedAt: true,
          receiptUrl: true,
          invoiceUrl: true,
          createdAt: true,
        },
      }),
      db.payment.count({
        where: { userId: user.id },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      payments: payments.map((payment) => ({
        ...payment,
        paidAt: payment.paidAt?.toISOString(),
        failedAt: payment.failedAt?.toISOString(),
        refundedAt: payment.refundedAt?.toISOString(),
        createdAt: payment.createdAt.toISOString(),
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching payments:", error);
    return {
      payments: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  } finally {
    await db.$disconnect();
  }
}

// Server action to cancel subscription (DB-only, no Stripe call)
export async function cancelSubscription(immediate: boolean = false): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const user = await getAuthenticatedUser();

    if (!user.subscription) {
      return {
        success: false,
        message: "No active subscription found",
      };
    }

    const subscription = user.subscription;

    // Update our database directly
    await db.subscription.update({
      where: { userId: user.id },
      data: {
        cancelAtPeriodEnd: !immediate,
        cancelAt: immediate ? new Date() : subscription.currentPeriodEnd,
        canceledAt: immediate ? new Date() : null,
        status: immediate ? "CANCELLED" : subscription.status,
      },
    });

    revalidatePath("/dashboard/billing");

    return {
      success: true,
      message: immediate
        ? "Subscription cancelled immediately"
        : "Subscription will be cancelled at the end of the current period",
    };
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return {
      success: false,
      message: "Failed to cancel subscription",
    };
  } finally {
    await db.$disconnect();
  }
}

// Server action to redirect to checkout with selected plan
export async function redirectToCheckout(planType: "monthly" | "yearly") {
  const validPlans = ["monthly", "yearly"];

  if (!validPlans.includes(planType)) {
    throw new Error("Invalid plan type");
  }

  return { success: true, planType };
}
