import { db } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

// DGateway sends webhooks when transaction status changes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data } = body;

    console.log("DGateway webhook received:", event, data);

    if (!data?.reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 });
    }

    if (
      event === "transaction.completed" &&
      data.direction === "collect" &&
      data.status === "completed"
    ) {
      // Find payment by DGateway reference
      const payment = await db.payment.findUnique({
        where: { dgwReference: data.reference },
      });

      if (payment && payment.status !== "SUCCEEDED") {
        // Update payment status
        await db.payment.update({
          where: { id: payment.id },
          data: {
            status: "SUCCEEDED",
            paidAt: new Date(),
          },
        });

        // Update subscription
        const plan = payment.plan;
        const periodStart = new Date();
        const periodEnd = new Date();

        if (plan === "YEARLY") {
          periodEnd.setFullYear(periodEnd.getFullYear() + 1);
        } else {
          periodEnd.setMonth(periodEnd.getMonth() + 1);
        }

        await db.subscription.upsert({
          where: { userId: payment.userId },
          update: {
            plan,
            status: "ACTIVE",
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            priceAmount: data.amount || payment.amount,
            priceCurrency: (data.currency || payment.currency || "ugx").toLowerCase(),
            interval: plan === "YEARLY" ? "year" : "month",
            cancelAtPeriodEnd: false,
            cancelAt: null,
            canceledAt: null,
          },
          create: {
            userId: payment.userId,
            plan,
            status: "ACTIVE",
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            priceAmount: data.amount || payment.amount,
            priceCurrency: (data.currency || payment.currency || "ugx").toLowerCase(),
            interval: plan === "YEARLY" ? "year" : "month",
          },
        });

        // Reset invoice quota
        await db.user.update({
          where: { id: payment.userId },
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
      } else if (!payment) {
        // Payment record not found — log for debugging
        console.warn(
          "DGateway webhook: no payment record found for reference",
          data.reference
        );
      }
    }

    if (event === "transaction.failed" && data.status === "failed") {
      const payment = await db.payment.findUnique({
        where: { dgwReference: data.reference },
      });

      if (payment) {
        await db.payment.update({
          where: { id: payment.id },
          data: {
            status: "FAILED",
            failedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("DGateway webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
