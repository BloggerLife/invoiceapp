import { collectPayment } from "@/lib/dgateway";
import { db } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { invoiceId, provider, phone_number } = await req.json();

    if (!invoiceId || !provider) {
      return NextResponse.json(
        { error: "invoiceId and provider are required" },
        { status: 400 }
      );
    }

    if (provider === "iotec" && !phone_number) {
      return NextResponse.json(
        { error: "Phone number is required for mobile money" },
        { status: 400 }
      );
    }

    // Fetch invoice
    const invoice = await db.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        user: { include: { brand: true } },
        client: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Check invoice is payable
    if (invoice.status === "PAID") {
      return NextResponse.json(
        { error: "This invoice has already been paid" },
        { status: 400 }
      );
    }

    if (invoice.status === "CANCELLED") {
      return NextResponse.json(
        { error: "This invoice has been cancelled" },
        { status: 400 }
      );
    }

    const amount = invoice.totalAmount;
    // Determine currency from brand or default
    const brandCurrency = invoice.user.brand?.currency || "$";
    // Map currency symbol to code
    const currencyMap: Record<string, string> = {
      $: "USD",
      UGX: "UGX",
      KES: "KES",
      EUR: "EUR",
      GBP: "GBP",
    };
    const currency =
      provider === "iotec" ? "UGX" : currencyMap[brandCurrency] || "USD";

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const result = await collectPayment({
      amount,
      currency,
      phone_number: provider === "iotec" ? phone_number : undefined,
      provider,
      description: `Payment for Invoice ${invoice.invoiceNumber}`,
      callback_url: `${baseUrl}/api/webhooks/dgateway`,
      metadata: {
        invoiceId: invoice.id,
        userId: invoice.userId,
        invoiceNumber: invoice.invoiceNumber,
      },
    });

    // Mark invoice as viewed if it was just sent
    if (invoice.status === "SENT" || invoice.status === "DRAFT") {
      await db.invoice.update({
        where: { id: invoiceId },
        data: { status: "VIEWED", viewedAt: new Date() },
      });
    }

    return NextResponse.json({
      reference: result.data.reference,
      status: result.data.status,
      amount,
      currency,
      provider,
      client_secret: result.data.client_secret || null,
      stripe_publishable_key: result.data.stripe_publishable_key || null,
    });
  } catch (error) {
    console.error("Invoice payment error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to initiate payment",
      },
      { status: 500 }
    );
  }
}
