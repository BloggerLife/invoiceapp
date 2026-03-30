import { authOptions } from "@/config/auth";
import { collectPayment } from "@/lib/dgateway";
import { db } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const PRICING_CONFIG = {
  monthly: {
    amountUGX: 35000,
    description: "Starter Plan - Invoice Generator Pro",
  },
  yearly: {
    amountUGX: 75000,
    description: "Pro Plan - Invoice Generator Pro",
  },
};

export async function POST(req: NextRequest) {
  try {
    const { planType, provider, phone_number } = await req.json();

    // Validate
    if (!planType || !["monthly", "yearly"].includes(planType)) {
      return NextResponse.json(
        { error: "Invalid plan type. Must be 'monthly' or 'yearly'" },
        { status: 400 }
      );
    }

    if (!provider || !["iotec", "stripe"].includes(provider)) {
      return NextResponse.json(
        { error: "Invalid provider. Must be 'iotec' or 'stripe'" },
        { status: 400 }
      );
    }

    if (provider === "iotec" && !phone_number) {
      return NextResponse.json(
        { error: "Phone number is required for mobile money payments" },
        { status: 400 }
      );
    }

    // Verify session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const config = PRICING_CONFIG[planType as keyof typeof PRICING_CONFIG];

    // All pricing is in UGX
    const amount = config.amountUGX;
    const currency = "UGX";

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Call DGateway collect
    const result = await collectPayment({
      amount,
      currency,
      phone_number: provider === "iotec" ? phone_number : undefined,
      provider,
      description: config.description,
      callback_url: `${baseUrl}/api/webhooks/dgateway`,
      metadata: {
        userId: user.id,
        email: session.user.email,
        planType,
      },
    });

    // Create a PENDING payment record immediately so webhooks can find it
    const plan = planType === "yearly" ? "YEARLY" : ("MONTHLY" as const);
    await db.payment.upsert({
      where: { dgwReference: result.data.reference },
      update: {},
      create: {
        userId: user.id,
        dgwReference: result.data.reference,
        amount,
        currency: currency.toLowerCase(),
        status: "PENDING",
        description: config.description,
        plan,
        interval: plan === "YEARLY" ? "year" : "month",
      },
    });

    return NextResponse.json({
      reference: result.data.reference,
      status: result.data.status,
      amount,
      currency,
      provider,
      // For Stripe card payments, return client_secret for frontend
      client_secret: result.data.client_secret || null,
      stripe_publishable_key: result.data.stripe_publishable_key || null,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to initiate payment",
      },
      { status: 500 }
    );
  }
}
