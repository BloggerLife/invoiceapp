// app/api/billing/customer-portal/route.ts
// This endpoint is no longer used (was for Stripe billing portal).
// Kept as a stub to avoid 404s if referenced anywhere.
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error:
        "Customer portal is not available. Please manage your subscription from the billing page.",
    },
    { status: 410 }
  );
}
