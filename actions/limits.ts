// app/actions/getInvoiceQuota.ts
"use server";

import { db } from "@/prisma/db";
import { PlanLimit, Subscription } from "@prisma/client";

export type InvoiceQuotaResponse = {
  remaining: number;
  dailyLimit: number;
  totalUsedToday: number;
  hasUnlimited: boolean;
  resetTime: Date;
};

export async function getInvoiceQuota(
  userId: string
): Promise<InvoiceQuotaResponse | null> {
  try {
    // Get user with their subscription data
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });
    if (!user) {
      return null;
    }

    let userSubscription = await db.subscription.findFirst({
      where: {
        userId: user?.id ?? "",
      },
    });
    if (!userSubscription) {
      userSubscription = await db.subscription.create({
        data: {
          userId: user?.id ?? "",
        },
      });
    }

    let planLimits: PlanLimit | null;
    // Get plan limits
    planLimits = await db.planLimit.findUnique({
      where: { plan: userSubscription?.plan || "FREE" },
    });
    if (!planLimits) {
      planLimits = await db.planLimit.create({
        data: {
          plan: "FREE",
          maxDailyInvoices: 1,
        },
      });
    }
    // Ensure correct limits per plan
    const correctLimits: Record<string, number> = { FREE: 1, MONTHLY: 5 };
    const expectedLimit = correctLimits[planLimits.plan];
    if (expectedLimit && planLimits.maxDailyInvoices !== expectedLimit) {
      planLimits = await db.planLimit.update({
        where: { plan: planLimits.plan },
        data: { maxDailyInvoices: expectedLimit },
      });
    }
    const dailyLimit = planLimits?.maxDailyInvoices || 1;
    // Only YEARLY (Pro) plan gets unlimited
    const hasUnlimited = userSubscription?.plan === "YEARLY";

    console.log("user subscription =>", userSubscription);
    console.log("user subscription Plan =>", userSubscription?.plan);

    // Check if we need to reset the counter (new day)
    const now = new Date();
    const lastInvoiceDate = user.lastInvoiceDate || new Date(0); // Default to epoch if null

    let remaining = 0;
    let totalUsedToday = user.dailyInvoicesCreated;
    let resetTime = new Date();

    if (!isSameDay(now, lastInvoiceDate)) {
      // It's a new day - counter should be reset
      remaining = dailyLimit;
      totalUsedToday = 0;
      resetTime = getTomorrowStart();
    } else {
      // Same day - calculate remaining
      remaining = Math.max(0, dailyLimit - user.dailyInvoicesCreated);
      resetTime = getTomorrowStart();
    }

    return {
      remaining: hasUnlimited ? Infinity : remaining,
      dailyLimit,
      totalUsedToday,
      hasUnlimited,
      resetTime,
    };
  } catch (error) {
    console.error("Error getting invoice quota:", error);
    throw new Error("Failed to get invoice quota");
  }
}
export async function getBrandCurrencyByUserId(
  userId: string
): Promise<string> {
  try {
    // Get user with their subscription data
    const brand = await db.brand.findUnique({
      where: { userId: userId },
      select: {
        currency: true,
      },
    });
    if (!brand) {
      return "$";
    }

    const currency = brand?.currency || "$";

    return currency;
  } catch (error) {
    console.error("Error getting invoice quota:", error);
    return "$";
  }
}

// Helper functions
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function getTomorrowStart(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}
