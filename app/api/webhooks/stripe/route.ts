// This webhook handler is deprecated - payments now use DGateway.
// See /api/webhooks/dgateway/route.ts for the active webhook handler.
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("Stripe webhook received but Stripe integration is deprecated. Use DGateway.");
  return NextResponse.json({ received: true, deprecated: true });
}
