"use server";

import { notFound } from "next/navigation";
import { Client, InvoiceStatus } from "@prisma/client";
import { getAuthUser } from "@/config/useAuth";
import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

// Client interface
export interface ClientData {
  id: string;
  contactPerson: string;
  companyName: string;
  location: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Stats
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
}

// Client invoice interface
export interface ClientInvoiceData {
  id: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  status: InvoiceStatus;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  isPastDue: boolean;
  remainingDays: number;
  preparedBy: string | null;
}

// Get all clients for the authenticated user
export async function getClients(): Promise<ClientData[]> {
  try {
    const user = await getAuthUser();
    if (!user?.id) {
      return [];
    }

    const userId = user.id;

    // Fetch clients with invoice statistics
    const clients = await db.client.findMany({
      where: {
        userId,
      },
      include: {
        invoices: {
          select: {
            totalAmount: true,
            status: true,
          },
        },
        _count: {
          select: {
            invoices: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform data and calculate statistics
    const clientsWithStats: ClientData[] = clients.map((client) => {
      const totalInvoices = client._count.invoices;
      const totalAmount = client.invoices.reduce(
        (sum, invoice) => sum + Number(invoice.totalAmount),
        0
      );
      const paidAmount = client.invoices
        .filter((invoice) => invoice.status === InvoiceStatus.PAID)
        .reduce((sum, invoice) => sum + Number(invoice.totalAmount), 0);
      const unpaidAmount = totalAmount - paidAmount;

      return {
        id: client.id,
        contactPerson: client.contactPerson,
        companyName: client.companyName,
        location: client.location,
        phone: client.phone,
        email: client.email,
        notes: client.notes,
        isActive: client.isActive,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
        totalInvoices,
        totalAmount,
        paidAmount,
        unpaidAmount,
      };
    });

    return clientsWithStats;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}

// Get client by ID with detailed information
export async function getClientById(clientId: string): Promise<ClientData> {
  try {
    const user = await getAuthUser();
    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = user.id;

    const client = await db.client.findFirst({
      where: {
        id: clientId,
        userId, // Ensure user can only access their own clients
      },
      include: {
        invoices: {
          select: {
            totalAmount: true,
            status: true,
          },
        },
        _count: {
          select: {
            invoices: true,
          },
        },
      },
    });

    if (!client) {
      notFound();
    }

    // Calculate statistics
    const totalInvoices = client._count.invoices;
    const totalAmount = client.invoices.reduce(
      (sum, invoice) => sum + Number(invoice.totalAmount),
      0
    );
    const paidAmount = client.invoices
      .filter((invoice) => invoice.status === InvoiceStatus.PAID)
      .reduce((sum, invoice) => sum + Number(invoice.totalAmount), 0);
    const unpaidAmount = totalAmount - paidAmount;

    return {
      id: client.id,
      contactPerson: client.contactPerson,
      companyName: client.companyName,
      location: client.location,
      phone: client.phone,
      email: client.email,
      notes: client.notes,
      isActive: client.isActive,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      totalInvoices,
      totalAmount,
      paidAmount,
      unpaidAmount,
    };
  } catch (error) {
    console.error("Error fetching client:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      throw error;
    }
    notFound();
  }
}
export async function getLastClientByUserId(
  userId: string,
  clientId: string | undefined
) {
  try {
    let client: Client | null | undefined;

    if (clientId) {
      client = await db.client.findFirst({
        where: {
          id: clientId,
        },
      });
    } else {
      client = await db.client.findFirst({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
    if (!client) {
      return undefined;
    }

    return {
      billToContactPerson: client.contactPerson,
      billToCompanyName: client.companyName,
      billToLocation: client.location,
      billToPhone: client.phone,
      customerID: client.customerID,
    };
  } catch (error) {
    console.error("Error fetching client:", error);
    return undefined;
  }
}

// Get all invoices for a specific client
export async function getClientInvoices(
  clientId: string
): Promise<ClientInvoiceData[]> {
  try {
    const user = await getAuthUser();
    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = user.id;

    // First verify the client belongs to the user
    const client = await db.client.findFirst({
      where: {
        id: clientId,
        userId,
      },
    });

    if (!client) {
      notFound();
    }

    // Fetch client invoices
    const invoices = await db.invoice.findMany({
      where: {
        clientId,
        userId, // Double check for security
      },
      orderBy: {
        invoiceDate: "desc",
      },
    });

    // Transform data and calculate remaining days
    const today = new Date();
    const clientInvoices: ClientInvoiceData[] = invoices.map((invoice) => {
      const dueDate = new Date(invoice.dueDate);
      const timeDiff = dueDate.getTime() - today.getTime();
      const remainingDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      const isPastDue =
        remainingDays < 0 && invoice.status !== InvoiceStatus.PAID;

      return {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        status: invoice.status,
        subtotal: Number(invoice.subtotal),
        taxAmount: Number(invoice.taxAmount),
        totalAmount: Number(invoice.totalAmount),
        isPastDue,
        remainingDays,
        preparedBy: invoice.preparedBy,
      };
    });

    return clientInvoices;
  } catch (error) {
    console.error("Error fetching client invoices:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      throw error;
    }
    notFound();
  }
}

// Get client statistics summary
export async function getClientStats(clientId: string) {
  try {
    const user = await getAuthUser();
    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = user.id;

    // Get invoices grouped by status
    const invoiceStats = await db.invoice.groupBy({
      by: ["status"],
      where: {
        clientId,
        userId,
      },
      _count: {
        status: true,
      },
      _sum: {
        totalAmount: true,
      },
    });

    // Get recent invoices (last 30 days)
    const recentInvoicesCount = await db.invoice.count({
      where: {
        clientId,
        userId,
        invoiceDate: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Get overdue invoices
    const overdueInvoicesCount = await db.invoice.count({
      where: {
        clientId,
        userId,
        dueDate: {
          lt: new Date(),
        },
        status: {
          not: InvoiceStatus.PAID,
        },
      },
    });

    return {
      invoiceStats: invoiceStats.map((stat) => ({
        status: stat.status,
        count: stat._count.status,
        amount: Number(stat._sum.totalAmount || 0),
      })),
      recentInvoicesCount,
      overdueInvoicesCount,
    };
  } catch (error) {
    console.error("Error fetching client stats:", error);
    throw new Error("Failed to fetch client statistics");
  }
}

// Delete client (with validation)
export async function deleteClient(clientId: string) {
  try {
    const user = await getAuthUser();
    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = user.id;

    // Check if client has any invoices
    const invoiceCount = await db.invoice.count({
      where: {
        clientId,
        userId,
      },
    });

    if (invoiceCount > 0) {
      return {
        success: false,
        error: "Cannot delete client with existing invoices",
      };
    }

    // Delete the client
    await db.client.delete({
      where: {
        id: clientId,
        userId, // Ensure user can only delete their own clients
      },
    });
    revalidatePath(`/dashboard/clients`);
    revalidatePath(`/dashboard/clients/${clientId}`);
    return { success: true, error: "" };
  } catch (error) {
    console.error("Error deleting client:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete client",
    };
  }
}
