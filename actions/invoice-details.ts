"use server";

import { getAuthUser } from "@/config/useAuth";
import { db } from "@/prisma/db";
import { notFound } from "next/navigation";

// Interface matching your component's InvoiceData
interface InvoiceData {
  // Document Type
  documentType: "invoice" | "quotation";

  // Brand/Company Info
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  logoUrl: string;
  contactInfo: string;
  paymentInfo: string;
  thankYouMessage: string;
  brandColor: string;

  // Client Info
  billToContactPerson: string;
  billToCompanyName: string;
  billToLocation: string;
  billToPhone: string;

  // Invoice Details
  invoiceNumber: string;
  invoiceDate: string;
  invoiceDueDate: string;
  customerID: string;
  preparedBy: string;

  // Financial Data
  items: Array<{
    quantity: number;
    description: string;
    unitPrice: number;
    taxable: boolean;
    amount: number;
  }>;
  subtotal: number;
  taxRate: number;
  salesTax: number;
  other: number;
  total: number;
}

export async function getInvoiceById(invoiceId: string): Promise<InvoiceData> {
  try {
    // Get authenticated user
    const user = await getAuthUser();
    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = user.id;

    // Fetch invoice with all related data
    const invoice = await db.invoice.findFirst({
      where: {
        id: invoiceId,
        userId, // Ensure user can only access their own invoices
      },
      include: {
        client: true,
        items: {
          orderBy: {
            itemOrder: "asc",
          },
        },
        user: {
          include: {
            brand: true,
          },
        },
      },
    });

    if (!invoice) {
      notFound();
    }

    // Get brand data (create default if not exists)
    let brand = invoice.user.brand;
    if (!brand) {
      // Create a default brand if none exists
      brand = await db.brand.create({
        data: {
          userId,
          name: invoice.user.name || "Desishub",
          template: "PROFESSIONAL",
        },
      });
    }

    // Format dates for form inputs (YYYY-MM-DD format)
    const formatDateForInput = (date: Date): string => {
      return date.toISOString().split("T")[0];
    };

    // Calculate tax rate from tax amount and subtotal
    const calculatedTaxRate =
      invoice.subtotal > 0
        ? (Number(invoice.taxAmount) / Number(invoice.subtotal)) * 100
        : 0;

    // Calculate other charges (total - subtotal - tax)
    const otherCharges =
      Number(invoice.totalAmount) -
      Number(invoice.subtotal) -
      Number(invoice.taxAmount);

    // Transform database data to component format
    const invoiceData: InvoiceData = {
      documentType: "invoice",
      // Brand/Company Info
      companyName: brand.name || "Your Company",
      companyAddress: brand.address || "",
      brandColor: brand.brandColor || "#000000",
      companyPhone: brand.phone || "",
      companyEmail: brand.email || "",
      logoUrl: brand.logo || "",
      contactInfo: invoice.notes || brand.paymentInfo || "",
      paymentInfo: invoice.terms || brand.paymentInfo || "",
      thankYouMessage: brand.thankYouMsg || "Thank you for your business!",

      // Client Info
      billToContactPerson: invoice.client.contactPerson,
      billToCompanyName: invoice.client.companyName,
      billToLocation: invoice.client.location || "",
      billToPhone: invoice.client.phone || "",

      // Invoice Details
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: formatDateForInput(invoice.invoiceDate),
      invoiceDueDate: formatDateForInput(invoice.dueDate),
      customerID: invoice.client.customerID || "",
      preparedBy: invoice.preparedBy || "",

      // Financial Data
      items: invoice.items.map((item) => ({
        quantity: Number(item.quantity),
        description: item.description,
        unitPrice: Number(item.unitPrice),
        taxable: false, // You might want to add this field to your schema
        amount: Number(item.totalPrice),
      })),
      subtotal: Number(invoice.subtotal),
      taxRate: calculatedTaxRate,
      salesTax: Number(invoice.taxAmount),
      other: otherCharges,
      total: Number(invoice.totalAmount),
    };

    return invoiceData;
  } catch (error) {
    console.error("Error fetching invoice:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      throw error;
    }
    notFound();
  }
}
export async function getUserInvoiceById(
  invoiceId: string,
  userId: string
): Promise<InvoiceData> {
  try {
    // Fetch invoice with all related data
    const invoice = await db.invoice.findFirst({
      where: {
        id: invoiceId,
        userId, // Ensure user can only access their own invoices
      },
      include: {
        client: true,
        items: {
          orderBy: {
            itemOrder: "asc",
          },
        },
        user: {
          include: {
            brand: true,
          },
        },
      },
    });

    if (!invoice) {
      notFound();
    }

    // Get brand data (create default if not exists)
    let brand = invoice.user.brand;
    if (!brand) {
      // Create a default brand if none exists
      brand = await db.brand.create({
        data: {
          userId,
          name: invoice.user.name || "Desishub",
          template: "PROFESSIONAL",
        },
      });
    }

    // Format dates for form inputs (YYYY-MM-DD format)
    const formatDateForInput = (date: Date): string => {
      return date.toISOString().split("T")[0];
    };

    // Calculate tax rate from tax amount and subtotal
    const calculatedTaxRate =
      invoice.subtotal > 0
        ? (Number(invoice.taxAmount) / Number(invoice.subtotal)) * 100
        : 0;

    // Calculate other charges (total - subtotal - tax)
    const otherCharges =
      Number(invoice.totalAmount) -
      Number(invoice.subtotal) -
      Number(invoice.taxAmount);

    // Transform database data to component format
    const invoiceData: InvoiceData = {
      documentType: "invoice",
      // Brand/Company Info
      companyName: brand.name || "Your Company",
      companyAddress: brand.address || "",
      brandColor: brand.brandColor || "#000000",
      companyPhone: brand.phone || "",
      companyEmail: brand.email || "",
      logoUrl: brand.logo || "",
      contactInfo: invoice.notes || brand.paymentInfo || "",
      paymentInfo: invoice.terms || brand.paymentInfo || "",
      thankYouMessage: brand.thankYouMsg || "Thank you for your business!",

      // Client Info
      billToContactPerson: invoice.client.contactPerson,
      billToCompanyName: invoice.client.companyName,
      billToLocation: invoice.client.location || "",
      billToPhone: invoice.client.phone || "",

      // Invoice Details
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: formatDateForInput(invoice.invoiceDate),
      invoiceDueDate: formatDateForInput(invoice.dueDate),
      customerID: invoice.client.customerID || "",
      preparedBy: invoice.preparedBy || "",

      // Financial Data
      items: invoice.items.map((item) => ({
        quantity: Number(item.quantity),
        description: item.description,
        unitPrice: Number(item.unitPrice),
        taxable: false, // You might want to add this field to your schema
        amount: Number(item.totalPrice),
      })),
      subtotal: Number(invoice.subtotal),
      taxRate: calculatedTaxRate,
      salesTax: Number(invoice.taxAmount),
      other: otherCharges,
      total: Number(invoice.totalAmount),
    };

    return invoiceData;
  } catch (error) {
    console.error("Error fetching invoice:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      throw error;
    }
    notFound();
  }
}

// Additional helper to get invoice basic info for metadata
export async function getInvoiceMetadata(invoiceId: string) {
  try {
    const user = await getAuthUser();
    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    const invoice = await db.invoice.findFirst({
      where: {
        id: invoiceId,
        userId: user.id,
      },
      select: {
        invoiceNumber: true,
        totalAmount: true,
        status: true,
        client: {
          select: {
            companyName: true,
            contactPerson: true,
          },
        },
      },
    });

    if (!invoice) {
      notFound();
    }

    return {
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.client.companyName || invoice.client.contactPerson,
      totalAmount: Number(invoice.totalAmount),
      status: invoice.status,
    };
  } catch (error) {
    console.error("Error fetching invoice metadata:", error);
    notFound();
  }
}
