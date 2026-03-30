import { authOptions } from "@/config/auth";
import { verifyTransaction } from "@/lib/dgateway";
import { db } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { reference, planType } = await req.json();

    if (!reference) {
      return NextResponse.json(
        { error: "Transaction reference is required" },
        { status: 400 }
      );
    }

    // Verify session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify transaction with DGateway
    const result = await verifyTransaction(reference);
    const status = result.data.status;

    // If completed, update subscription and create payment record
    if (status === "completed") {
      const user = await db.user.findUnique({
        where: { email: session.user.email },
        include: { subscription: true },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Check if already fully processed (idempotency)
      const existingPayment = await db.payment.findUnique({
        where: { dgwReference: reference },
      });

      // Skip if payment already marked SUCCEEDED (already processed by webhook or prior poll)
      if (!existingPayment || existingPayment.status !== "SUCCEEDED") {
        const plan =
          planType === "yearly" ? "YEARLY" : ("MONTHLY" as const);
        const periodStart = new Date();
        const periodEnd = new Date();

        if (plan === "YEARLY") {
          periodEnd.setFullYear(periodEnd.getFullYear() + 1);
        } else {
          periodEnd.setMonth(periodEnd.getMonth() + 1);
        }

        // Upsert payment record (may already exist as PENDING from /api/checkout)
        await db.payment.upsert({
          where: { dgwReference: reference },
          update: {
            status: "SUCCEEDED",
            amount: result.data.amount,
            currency: result.data.currency.toLowerCase(),
            description: `${plan} subscription payment via ${result.data.provider}`,
            paidAt: new Date(),
          },
          create: {
            userId: user.id,
            dgwReference: reference,
            amount: result.data.amount,
            currency: result.data.currency.toLowerCase(),
            status: "SUCCEEDED",
            description: `${plan} subscription payment via ${result.data.provider}`,
            plan,
            interval: plan === "YEARLY" ? "year" : "month",
            paidAt: new Date(),
          },
        });

        // Upsert subscription
        await db.subscription.upsert({
          where: { userId: user.id },
          update: {
            plan,
            status: "ACTIVE",
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            priceAmount: result.data.amount,
            priceCurrency: result.data.currency.toLowerCase(),
            interval: plan === "YEARLY" ? "year" : "month",
            cancelAtPeriodEnd: false,
            cancelAt: null,
            canceledAt: null,
          },
          create: {
            userId: user.id,
            plan,
            status: "ACTIVE",
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            priceAmount: result.data.amount,
            priceCurrency: result.data.currency.toLowerCase(),
            interval: plan === "YEARLY" ? "year" : "month",
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
          where: { plan },
          update: {},
          create: { plan },
        });
      }
    }

    return NextResponse.json({
      status,
      reference: result.data.reference,
      amount: result.data.amount,
      currency: result.data.currency,
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to verify transaction",
      },
      { status: 500 }
    );
  }
}
