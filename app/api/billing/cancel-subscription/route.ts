// app/api/billing/cancel-subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/prisma/db";
import { authOptions } from "@/config/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { immediate } = await request.json();

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { subscription: true },
    });

    if (!user || !user.subscription) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    const subscription = user.subscription;

    // Update our database directly
    const updatedSubscription = await db.subscription.update({
      where: { userId: user.id },
      data: {
        cancelAtPeriodEnd: !immediate,
        cancelAt: immediate ? new Date() : subscription.currentPeriodEnd,
        canceledAt: immediate ? new Date() : null,
        status: immediate ? "CANCELLED" : subscription.status,
      },
    });

    return NextResponse.json({
      message: immediate
        ? "Subscription cancelled immediately"
        : "Subscription will be cancelled at the end of the current period",
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}
