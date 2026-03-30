// app/api/billing/payments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { db } from "@/prisma/db";

export async function GET(request: NextRequest) {
  try {
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

    // Get URL search params for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status"); // Filter by payment status
    const planType = searchParams.get("plan"); // Filter by plan type

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build where clause for filtering
    const whereClause: any = {
      userId: user.id,
    };

    if (
      status &&
      ["PENDING", "SUCCEEDED", "FAILED", "CANCELLED", "REFUNDED"].includes(
        status
      )
    ) {
      whereClause.status = status;
    }

    if (planType && ["FREE", "MONTHLY", "YEARLY"].includes(planType)) {
      whereClause.plan = planType;
    }

    // Get payments with pagination
    const [payments, totalCount] = await Promise.all([
      db.payment.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
        select: {
          id: true,
          stripePaymentId: true,
          amount: true,
          currency: true,
          status: true,
          description: true,
          plan: true,
          interval: true,
          paidAt: true,
          failedAt: true,
          refundedAt: true,
          receiptUrl: true,
          invoiceUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      db.payment.count({
        where: whereClause,
      }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Calculate totals for summary
    const paymentSummary = await db.payment.aggregate({
      where: {
        userId: user.id,
        status: "SUCCEEDED",
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    // Get payments by status for overview
    const statusCounts = await db.payment.groupBy({
      by: ["status"],
      where: {
        userId: user.id,
      },
      _count: {
        id: true,
      },
    });

    return NextResponse.json({
      payments,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit,
      },
      summary: {
        totalPaid: paymentSummary._sum.amount || 0,
        totalPayments: paymentSummary._count || 0,
        statusBreakdown: statusCounts.reduce(
          (acc, item) => {
            acc[item.status] = item._count.id;
            return acc;
          },
          {} as Record<string, number>
        ),
      },
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}

// Get a specific payment by ID
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, paymentId } = await request.json();

    if (action !== "get_payment_details") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get specific payment with full details
    const payment = await db.payment.findFirst({
      where: {
        id: paymentId,
        userId: user.id, // Ensure user can only access their own payments
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json({ payment });
  } catch (error) {
    console.error("Error fetching payment details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}
