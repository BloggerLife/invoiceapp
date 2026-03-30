"use server";

import InvoiceEmail, {
  InvoiceEmailDataProps,
} from "@/components/email-templates/invoice-email";
import { getAuthUser } from "@/config/useAuth";
import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export async function sendCustomerInvoice(
  data: InvoiceEmailDataProps,
  emails: string[],
  invoiceId: string
) {
  try {
    // Send the email
    const link = `${baseUrl}/invoices/${invoiceId}`;
    const paymentLink = `${baseUrl}/pay/${invoiceId}`;
    data.invoiceUrl = link;
    data.paymentUrl = paymentLink;
    const { error } = await resend.emails.send({
      from: "Invoice Pro <noreply@desishub.com>",
      // Update with your sender email
      to: emails,
      subject: `Invoice ${data.invoiceNumber} from ${data.companyName}`,
      react: InvoiceEmail({ data }),
    });

    if (error) {
      return {
        success: false,
      };
    }
    // Update the invoice
    await db.invoice.update({
      where: {
        id: invoiceId,
      },
      data: {
        status: "SENT",
      },
    });

    revalidatePath("/dashboard/invoices");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error sending sales order email:", error);
    throw error;
  }
}
