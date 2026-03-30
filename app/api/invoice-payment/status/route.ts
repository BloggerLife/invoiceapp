import { verifyTransaction } from "@/lib/dgateway";
import { creditWalletForInvoice } from "@/actions/wallet";
import { db } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { reference, invoiceId } = await req.json();

    if (!reference || !invoiceId) {
      return NextResponse.json(
        { error: "reference and invoiceId are required" },
        { status: 400 }
      );
    }

    // Verify with DGateway
    const result = await verifyTransaction(reference);
    const status = result.data.status;

    if (status === "completed") {
      // Fetch invoice to check it hasn't already been processed
      const invoice = await db.invoice.findUnique({
        where: { id: invoiceId },
      });

      if (!invoice) {
        return NextResponse.json(
          { error: "Invoice not found" },
          { status: 404 }
        );
      }

      // Idempotency: only process if not already paid
      if (invoice.status !== "PAID") {
        // Update invoice status
        await db.invoice.update({
          where: { id: invoiceId },
          data: {
            status: "PAID",
            paidAt: new Date(),
            paidVia: `dgateway_${result.data.provider}`,
            dgwReference: reference,
          },
        });

        // Credit the invoice owner's wallet (with 8% fee deducted)
        await creditWalletForInvoice({
          userId: invoice.userId,
          invoiceId: invoice.id,
          grossAmount: result.data.amount,
          currency: result.data.currency,
          dgwReference: reference,
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
    console.error("Invoice payment status error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to verify payment",
      },
      { status: 500 }
    );
  }
}
