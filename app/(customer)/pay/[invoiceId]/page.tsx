import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { db } from "@/prisma/db";
import { Skeleton } from "@/components/ui/skeleton";
import InvoicePaymentClient from "./InvoicePaymentClient";

export const dynamic = "force-dynamic";

async function getInvoiceForPayment(invoiceId: string) {
  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      items: { orderBy: { itemOrder: "asc" } },
      client: true,
      user: { include: { brand: true } },
    },
  });

  if (!invoice) return null;

  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    status: invoice.status,
    totalAmount: invoice.totalAmount,
    subtotal: invoice.subtotal,
    taxAmount: invoice.taxAmount,
    invoiceDate: invoice.invoiceDate.toISOString(),
    dueDate: invoice.dueDate.toISOString(),
    companyName: invoice.user.brand?.name || invoice.user.name || "Company",
    companyLogo: invoice.user.brand?.logo || null,
    brandColor: invoice.user.brand?.brandColor || "#000000",
    currency: invoice.user.brand?.currency || "$",
    clientName: invoice.client.companyName || invoice.client.contactPerson,
    clientEmail: invoice.client.email || "",
    items: invoice.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    })),
  };
}

function PaymentSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

async function PaymentContent({ invoiceId }: { invoiceId: string }) {
  const invoice = await getInvoiceForPayment(invoiceId);

  if (!invoice) {
    notFound();
  }

  return <InvoicePaymentClient invoice={invoice} />;
}

export default async function PayInvoicePage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<PaymentSkeleton />}>
        <PaymentContent invoiceId={invoiceId} />
      </Suspense>
    </div>
  );
}
