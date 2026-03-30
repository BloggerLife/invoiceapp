"use server";

import { getAuthUser } from "@/config/useAuth";
import { db } from "@/prisma/db";
import { InvoiceStatus, InvoiceTemplate } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getInvoiceQuota } from "./limits";

interface InvoiceItemData {
  quantity: number;
  description: string;
  unitPrice: number;
  taxable: boolean;
  amount: number;
}

interface CreateInvoiceData {
  // Brand/Company Info
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  logoUrl?: string;
  contactInfo?: string;
  paymentInfo?: string;
  thankYouMessage?: string;

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
  items: InvoiceItemData[];
  subtotal: number;
  taxRate?: number;
  salesTax?: number;
  other?: number;
  total: number;
}
// Helper function to check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
export async function createInvoice(data: CreateInvoiceData) {
  try {
    // Get authenticated user
    const user = await getAuthUser();
    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = user.id;

    // Check invoice quota before proceeding
    const quota = await getInvoiceQuota(userId);
    if (!quota) {
      return {
        success: false,
      };
    }
    if (!quota.hasUnlimited && quota.remaining <= 0) {
      return {
        success: false,
        message:
          `You've reached your daily limit of ${quota.dailyLimit} invoices. ` +
          `Please try again after ${quota.resetTime.toLocaleTimeString()} or upgrade your plan.`,
      };
    }

    // Parse dates
    const invoiceDate = new Date(data.invoiceDate);
    const dueDate = new Date(data.invoiceDueDate);

    // Start a transaction
    const result = await db.$transaction(async (tx) => {
      // 1. Create or update brand
      let brand = await tx.brand.findUnique({
        where: { userId },
      });

      if (!brand) {
        // Create new brand
        brand = await tx.brand.create({
          data: {
            userId,
            name: data.companyName,
            logo: data.logoUrl,
            phone: data.companyPhone,
            address: data.companyAddress,
            email: data.companyEmail,
            paymentInfo: data.paymentInfo,
            thankYouMsg: data.thankYouMessage,
            taxRate: data.taxRate ? parseFloat(data.taxRate.toString()) : null,
            salesTax: data.salesTax
              ? parseFloat(data.salesTax.toString())
              : null,
            otherCharges: data.other ? parseFloat(data.other.toString()) : null,
            template: InvoiceTemplate.PROFESSIONAL, // Default template
          },
        });
      } else {
        // Update existing brand with latest info
        brand = await tx.brand.update({
          where: { userId },
          data: {
            name: data.companyName,
            logo: data.logoUrl,
            phone: data.companyPhone,
            address: data.companyAddress,
            email: data.companyEmail,
            paymentInfo: data.paymentInfo,
            thankYouMsg: data.thankYouMessage,
            taxRate: data.taxRate ? parseFloat(data.taxRate.toString()) : null,
            salesTax: data.salesTax
              ? parseFloat(data.salesTax.toString())
              : null,
            otherCharges: data.other ? parseFloat(data.other.toString()) : null,
          },
        });
      }

      // 2. Create or find client
      let client = await tx.client.findFirst({
        where: {
          userId,
          OR: [
            { companyName: data.billToCompanyName },
            {
              AND: [
                { contactPerson: data.billToContactPerson },
                { phone: data.billToPhone },
              ],
            },
          ],
        },
      });

      if (!client) {
        // Create new client
        client = await tx.client.create({
          data: {
            userId,
            contactPerson: data.billToContactPerson,
            companyName: data.billToCompanyName,
            location: data.billToLocation,
            phone: data.billToPhone,
            customerID: data.customerID,
            email: "", // Not provided in current form
          },
        });
      }

      // 3. Create invoice
      const invoice = await tx.invoice.create({
        data: {
          userId,
          clientId: client.id,
          invoiceNumber: data.invoiceNumber,
          invoiceDate,
          dueDate,
          preparedBy: data.preparedBy,
          status: InvoiceStatus.DRAFT,
          subtotal: parseFloat(data.subtotal.toString()),
          taxAmount: data.salesTax ? parseFloat(data.salesTax.toString()) : 0,
          totalAmount: parseFloat(data.total.toString()),
          notes: data.contactInfo,
          terms: data.paymentInfo,
        },
      });

      // 4. Create invoice items
      const invoiceItems = await Promise.all(
        data.items
          .filter((item) => item.quantity > 0 && item.description.trim() !== "")
          .map((item, index) =>
            tx.invoiceItem.create({
              data: {
                invoiceId: invoice.id,
                description: item.description,
                quantity: parseFloat(item.quantity.toString()),
                unitPrice: parseFloat(item.unitPrice.toString()),
                totalPrice: parseFloat(item.amount.toString()),
                itemOrder: index + 1,
              },
            })
          )
      );

      // 5. Update user invoice counters - simplified using quota check
      await tx.user.update({
        where: { id: userId },
        data: {
          dailyInvoicesCreated: {
            increment: 1,
          },
          lastInvoiceDate: new Date(),
          totalInvoicesCreated: {
            increment: 1,
          },
        },
      });

      return {
        invoice,
        client,
        brand,
        items: invoiceItems,
      };
    });

    // Revalidate pages
    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: result,
      message: "Invoice created successfully",
      // remainingQuota: await getInvoiceQuota(userId), // Return updated quota
    };
  } catch (error) {
    console.error("Error creating invoice:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create invoice",
    };
  }
}

// Helper function to generate unique invoice number
export async function generateInvoiceNumber(): Promise<string> {
  try {
    const user = await getAuthUser();
    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = user.id;

    // Get current year
    const currentYear = new Date().getFullYear();

    // Count existing invoices for this year to get next sequence
    const existingInvoicesCount = await db.invoice.count({
      where: {
        userId,
        invoiceDate: {
          gte: new Date(currentYear, 0, 1),
          lt: new Date(currentYear + 1, 0, 1),
        },
      },
    });

    // Generate invoice number: INV-YYYY-XXXX
    const sequence = (existingInvoicesCount + 1).toString().padStart(4, "0");
    return `INV-${currentYear}-${sequence}`;
  } catch (error) {
    // Fallback to random number if database query fails
    const prefix = "INV";
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const timestamp = new Date().getTime().toString().slice(-4);
    return `${prefix}-${randomDigits}-${timestamp}`;
  }
}
