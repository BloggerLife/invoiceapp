// This endpoint is deprecated - payments now use DGateway.
// See /api/checkout/route.ts for the active payment endpoint.
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Use /api/checkout instead." },
    { status: 410 }
  );
}
