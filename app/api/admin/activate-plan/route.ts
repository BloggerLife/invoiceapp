import { db } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

// One-time admin route to manually activate a user's plan
// DELETE THIS ROUTE after use or secure it properly
export async function POST(req: NextRequest) {
  try {
    const { email, secret } = await req.json();

    // Simple secret check to prevent unauthorized use
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const periodStart = new Date();
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    // Upsert subscription to MONTHLY (Starter) plan
    await db.subscription.upsert({
      where: { userId: user.id },
      update: {
        plan: "MONTHLY",
        status: "ACTIVE",
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        priceAmount: 35000,
        priceCurrency: "ugx",
        interval: "month",
        cancelAtPeriodEnd: false,
        cancelAt: null,
        canceledAt: null,
      },
      create: {
        userId: user.id,
        plan: "MONTHLY",
        status: "ACTIVE",
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        priceAmount: 35000,
        priceCurrency: "ugx",
        interval: "month",
      },
    });

    // Create payment record
    await db.payment.create({
      data: {
        userId: user.id,
        amount: 35000,
        currency: "ugx",
        status: "SUCCEEDED",
        description: "MONTHLY subscription - manually activated",
        plan: "MONTHLY",
        interval: "month",
        paidAt: new Date(),
      },
    });

    // Reset invoice quota
    await db.user.update({
      where: { id: user.id },
      data: {
        dailyInvoicesCreated: 0,
        lastInvoiceDate: new Date(),
      },
    });

    // Ensure plan limits exist
    await db.planLimit.upsert({
      where: { plan: "MONTHLY" },
      update: {},
      create: { plan: "MONTHLY" },
    });

    return NextResponse.json({
      success: true,
      message: `Activated MONTHLY (Starter) plan for ${email} until ${periodEnd.toISOString()}`,
    });
  } catch (error) {
    console.error("Activate plan error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 }
    );
  }
}
