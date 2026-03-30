// app/api/cron/reset-invoice-counters/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/prisma/db";

export const dynamic = "force-dynamic"; // Ensure this route is server-side only
export const revalidate = 0; // Prevent caching

export async function GET(request: NextRequest) {
  // Optional: Add basic security check
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get current date at midnight for consistency
    const now = new Date();
    const todayMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // Reset counters for all free plan users
    const { count } = await db.user.updateMany({
      where: {
        subscription: {
          plan: "FREE", // Only reset free users
        },
        // Optional: Only reset users who have created invoices
        // dailyInvoicesCreated: { gt: 0 }
      },
      data: {
        dailyInvoicesCreated: 0,
        lastInvoiceDate: todayMidnight,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Reset invoice counters for ${count} users`,
      resetTime: todayMidnight.toISOString(),
    });
  } catch (error) {
    console.error("Error resetting invoice counters:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
