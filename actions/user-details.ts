// lib/actions/user-actions.ts
"use server";

import { db } from "@/prisma/db";
import { UserDetailsResponse, UserMetrics } from "@/types/user";

export async function getUserDetails(
  userId: string,
  invoicePage: number = 1,
  clientPage: number = 1,
  invoiceLimit: number = 10,
  clientLimit: number = 10
): Promise<UserDetailsResponse | null> {
  try {
    // Fetch user with subscription
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          select: {
            plan: true,
            status: true,
            currentPeriodEnd: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    // Fetch brand details
    const brand = await db.brand.findUnique({
      where: { userId },
    });

    // Calculate metrics
    const [
      totalInvoices,
      totalRevenue,
      paidInvoices,
      pendingInvoices,
      totalClients,
    ] = await Promise.all([
      // Total invoices count
      db.invoice.count({
        where: { userId },
      }),

      // Total revenue (sum of paid invoices)
      db.invoice.aggregate({
        where: {
          userId,
          status: "PAID",
        },
        _sum: {
          totalAmount: true,
        },
      }),

      // Paid invoices count
      db.invoice.count({
        where: {
          userId,
          status: "PAID",
        },
      }),

      // Pending invoices count
      db.invoice.count({
        where: {
          userId,
          status: { in: ["SENT", "VIEWED", "OVERDUE"] },
        },
      }),

      // Total clients count
      db.client.count({
        where: { userId },
      }),
    ]);

    // Fetch invoices with pagination
    const [invoices, invoiceTotal] = await Promise.all([
      db.invoice.findMany({
        where: { userId },
        include: {
          client: {
            select: {
              contactPerson: true,
              companyName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (invoicePage - 1) * invoiceLimit,
        take: invoiceLimit,
      }),
      db.invoice.count({ where: { userId } }),
    ]);

    // Fetch clients with pagination
    const [clients, clientTotal] = await Promise.all([
      db.client.findMany({
        where: { userId },
        include: {
          _count: {
            select: { invoices: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (clientPage - 1) * clientLimit,
        take: clientLimit,
      }),
      db.client.count({ where: { userId } }),
    ]);

    const metrics: UserMetrics = {
      totalInvoices,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      paidInvoices,
      pendingInvoices,
      totalClients,
    };

    return {
      user: {
        id: user.id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        jobTitle: user.jobTitle,
        role: user.role,
        status: user.status,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        totalInvoicesCreated: user.totalInvoicesCreated,
        subscription: user.subscription,
      },
      brand,
      metrics,
      invoices: {
        data: invoices,
        total: invoiceTotal,
      },
      clients: {
        data: clients,
        total: clientTotal,
      },
    };
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw new Error("Failed to fetch user details");
  }
}
