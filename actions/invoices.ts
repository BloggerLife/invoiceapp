"use server";

import { getAuthUser } from "@/config/useAuth";
import { db } from "@/prisma/db";
import { InvoiceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface InvoiceStats {
  totalInvoices: number;
  totalRevenue: number;
  totalRevenuePaid: number;
  totalRevenueUnpaid: number;
}

export interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  clientName: string;
  totalAmount: number;
  dueDate: Date;
  remainingDays: number;
  status: InvoiceStatus;
  isPastDue: boolean;
}

export interface InvoiceDashboardData {
  stats: InvoiceStats;
  invoices: InvoiceListItem[];
}

export async function getInvoiceDashboardData(): Promise<InvoiceDashboardData> {
  try {
    // Get authenticated user
    const user = await getAuthUser();
    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = user.id;

    // Get current year date range
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1); // January 1st
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59); // December 31st

    // Fetch all invoices for the current year with client data
    const invoices = await db.invoice.findMany({
      where: {
        userId,
        invoiceDate: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
      include: {
        client: {
          select: {
            companyName: true,
            contactPerson: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate stats
    const totalInvoices = invoices.length;

    const totalRevenue = invoices.reduce((sum, invoice) => {
      return sum + Number(invoice.totalAmount);
    }, 0);

    const totalRevenuePaid = invoices
      .filter((invoice) => invoice.status === InvoiceStatus.PAID)
      .reduce((sum, invoice) => {
        return sum + Number(invoice.totalAmount);
      }, 0);

    const totalRevenueUnpaid = totalRevenue - totalRevenuePaid;

    // Calculate remaining days and format invoice list
    const today = new Date();
    const invoiceList: InvoiceListItem[] = invoices.map((invoice) => {
      const dueDate = new Date(invoice.dueDate);
      const timeDiff = dueDate.getTime() - today.getTime();
      const remainingDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      const isPastDue =
        remainingDays < 0 && invoice.status !== InvoiceStatus.PAID;

      return {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        clientName: invoice.client.companyName || invoice.client.contactPerson,
        totalAmount: Number(invoice.totalAmount),
        dueDate: invoice.dueDate,
        remainingDays,
        status: invoice.status,
        isPastDue,
      };
    });

    const stats: InvoiceStats = {
      totalInvoices,
      totalRevenue,
      totalRevenuePaid,
      totalRevenueUnpaid,
    };

    return {
      stats,
      invoices: invoiceList,
    };
  } catch (error) {
    console.error("Error fetching invoice dashboard data:", error);
    return {
      stats: {
        totalInvoices: 0,
        totalRevenue: 0,
        totalRevenuePaid: 0,
        totalRevenueUnpaid: 0,
      },
      invoices: [],
    };
  }
}

// Additional helper action to get monthly revenue data for charts
export async function getMonthlyRevenueData(): Promise<Array<{
  month: string;
  revenue: number;
  paid: number;
  unpaid: number;
}> | null> {
  try {
    const user = await getAuthUser();
    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = user.id;
    const currentYear = new Date().getFullYear();

    // Get invoices grouped by month
    const monthlyData = await db.invoice.groupBy({
      by: ["invoiceDate"],
      where: {
        userId,
        invoiceDate: {
          gte: new Date(currentYear, 0, 1),
          lte: new Date(currentYear, 11, 31),
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    // Process data by month
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyRevenue = await Promise.all(
      months.map(async (month, index) => {
        const startOfMonth = new Date(currentYear, index, 1);
        const endOfMonth = new Date(currentYear, index + 1, 0, 23, 59, 59);

        const monthInvoices = await db.invoice.findMany({
          where: {
            userId,
            invoiceDate: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        });

        const revenue = monthInvoices.reduce(
          (sum, inv) => sum + Number(inv.totalAmount),
          0
        );
        const paid = monthInvoices
          .filter((inv) => inv.status === InvoiceStatus.PAID)
          .reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
        const unpaid = revenue - paid;

        return {
          month,
          revenue,
          paid,
          unpaid,
        };
      })
    );

    return monthlyRevenue;
  } catch (error) {
    console.error("Error fetching monthly revenue data:", error);
    return null;
  }
}

// Action to get recent activity/notifications
export async function getRecentInvoiceActivity(): Promise<Array<{
  id: string;
  type: "created" | "sent" | "viewed" | "paid" | "overdue";
  invoiceNumber: string;
  clientName: string;
  amount: number;
  date: Date;
}> | null> {
  try {
    const user = await getAuthUser();
    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = user.id;

    // Get recent invoices with activity
    const recentInvoices = await db.invoice.findMany({
      where: {
        userId,
        updatedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      include: {
        client: {
          select: {
            companyName: true,
            contactPerson: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 10, // Limit to 10 recent activities
    });

    const activities = recentInvoices.map((invoice) => {
      let type: "created" | "sent" | "viewed" | "paid" | "overdue" = "created";
      let date = invoice.createdAt;

      // Determine activity type based on status and dates
      if (invoice.status === InvoiceStatus.PAID && invoice.paidAt) {
        type = "paid";
        date = invoice.paidAt;
      } else if (invoice.status === InvoiceStatus.OVERDUE) {
        type = "overdue";
        date = invoice.dueDate;
      } else if (invoice.status === InvoiceStatus.VIEWED && invoice.viewedAt) {
        type = "viewed";
        date = invoice.viewedAt;
      } else if (invoice.status === InvoiceStatus.SENT && invoice.sentAt) {
        type = "sent";
        date = invoice.sentAt;
      }

      return {
        id: invoice.id,
        type,
        invoiceNumber: invoice.invoiceNumber,
        clientName: invoice.client.companyName || invoice.client.contactPerson,
        amount: Number(invoice.totalAmount),
        date,
      };
    });

    return activities;
  } catch (error) {
    console.error("Error fetching recent invoice activity:", error);
    return null;
  }
}

// Action to get invoice status distribution for charts
export async function getInvoiceStatusDistribution(): Promise<Array<{
  status: string;
  count: number;
  amount: number;
}> | null> {
  try {
    const user = await getAuthUser();
    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = user.id;
    const currentYear = new Date().getFullYear();

    const statusDistribution = await db.invoice.groupBy({
      by: ["status"],
      where: {
        userId,
        invoiceDate: {
          gte: new Date(currentYear, 0, 1),
          lte: new Date(currentYear, 11, 31),
        },
      },
      _count: {
        status: true,
      },
      _sum: {
        totalAmount: true,
      },
    });

    return statusDistribution.map((item) => ({
      status: item.status,
      count: item._count.status,
      amount: Number(item._sum.totalAmount || 0),
    }));
  } catch (error) {
    console.error("Error fetching invoice status distribution:", error);
    return null;
  }
}

export async function updateInvoiceStatus(
  invoiceId: string,
  newStatus: InvoiceStatus
) {
  try {
    await db.invoice.update({
      where: {
        id: invoiceId,
      },
      data: {
        status: newStatus,
      },
    });
    revalidatePath(`/invoices/${invoiceId}`);
    revalidatePath(`/dashboard/invoices`);
    revalidatePath(`/dashboard/invoices/${invoiceId}`);
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
}
export async function deleteInvoice(invoiceId: string) {
  try {
    await db.invoice.delete({
      where: {
        id: invoiceId,
      },
    });
    revalidatePath(`/invoices/${invoiceId}`);
    revalidatePath(`/dashboard/invoices`);
    revalidatePath(`/dashboard/invoices/${invoiceId}`);
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
}
