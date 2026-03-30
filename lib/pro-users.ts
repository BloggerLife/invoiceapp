import { db } from "@/prisma/db";
import { PrismaClient, SubscriptionPlan, PaymentStatus } from "@prisma/client";

interface ProUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: string;
  currentPlanPrice: number;
  totalSpent: number;
  totalPayments: number;
  stripeCustomerId?: string | null;
  joinedDate: Date;
  lastPaymentDate?: Date;
}

interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  plan?: SubscriptionPlan;
}

interface PaginatedResult {
  users: ProUser[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export async function getProUsers({
  page = 1,
  limit = 10,
  search = "",
  plan,
}: PaginationParams): Promise<PaginatedResult> {
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {
    subscription: {
      status: {
        in: ["ACTIVE", "TRIALING"],
      },
      plan: {
        in: ["MONTHLY", "YEARLY"],
      },
    },
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { brand: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (plan) {
    where.subscription.plan = plan;
  }

  // Get total count
  const total = await db.user.count({
    where,
  });

  // Get users with their subscription and payment data
  const users = await db.user.findMany({
    where,
    skip,
    take: limit,
    include: {
      subscription: true,
      brand: {
        select: {
          name: true,
        },
      },
      payments: {
        where: {
          status: "SUCCEEDED",
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform the data
  const proUsers = users.map((user) => {
    const successfulPayments = user.payments.filter(
      (p) => p.status === "SUCCEEDED"
    );
    const totalSpent = successfulPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const lastPayment = successfulPayments[0];

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      companyName: user.brand?.name,
      subscriptionPlan: user.subscription?.plan || "FREE",
      subscriptionStatus: user.subscription?.status || "INACTIVE",
      currentPlanPrice: user.subscription?.priceAmount || 0,
      totalSpent,
      totalPayments: successfulPayments.length,
      stripeCustomerId: user.stripeCustomerId,
      joinedDate: user.createdAt,
      lastPaymentDate: lastPayment?.paidAt,
    };
  });

  return {
    users: proUsers as ProUser[],
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1,
  };
}

// Additional utility functions
export async function getProUsersStats() {
  const [totalProUsers, monthlyRevenue, yearlyRevenue] = await Promise.all([
    db.user.count({
      where: {
        subscription: {
          status: {
            in: ["ACTIVE", "TRIALING"],
          },
          plan: {
            in: ["MONTHLY", "YEARLY"],
          },
        },
      },
    }),
    db.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: "SUCCEEDED",
        plan: "MONTHLY",
        paidAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    db.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: "SUCCEEDED",
        plan: "YEARLY",
        paidAt: {
          gte: new Date(new Date().getFullYear(), 0, 1),
        },
      },
    }),
  ]);

  return {
    totalProUsers,
    monthlyRevenue: monthlyRevenue._sum.amount || 0,
    yearlyRevenue: yearlyRevenue._sum.amount || 0,
  };
}
