import React, { Suspense } from "react";
import { notFound } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";

import { FileText, Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

import {
  getInvoiceById,
  getInvoiceMetadata,
  getUserInvoiceById,
} from "@/actions/invoice-details";
import UserInvoiceForm from "@/app/(dashboard)/dashboard/invoices/components/UserInvoiceForm";
import { getAuthUser } from "@/config/useAuth";
import { getBrandCurrencyByUserId } from "@/actions/limits";

// Loading component for the invoice form
function InvoiceFormSkeleton() {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-8">
      {/* Action Buttons Skeleton */}
      <div className="p-4 bg-gray-100 border-b flex flex-wrap justify-end gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-24" />
      </div>

      {/* Form Content Skeleton */}
      <div className="p-8 space-y-6">
        <Skeleton className="h-8 w-48" />

        {/* Company Info Section */}
        <div className="border rounded p-4 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Bill To Section */}
        <div className="border rounded p-4 space-y-4">
          <Skeleton className="h-6 w-20" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Details Section */}
        <div className="border rounded p-4 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Items Section */}
        <div className="border rounded p-4 space-y-4">
          <Skeleton className="h-6 w-16" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full col-span-2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border rounded p-4 space-y-4">
          <Skeleton className="h-6 w-24" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        </div>

        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

// Main invoice content component
async function InvoiceContent({
  invoiceId,
  userId,
}: {
  invoiceId: string;
  userId: string;
}) {
  const currency = await getBrandCurrencyByUserId(userId);
  const invoiceData = await getUserInvoiceById(invoiceId, userId);

  return (
    <UserInvoiceForm
      isCustomer={true}
      initialInvoiceData={invoiceData}
      editingId={invoiceId}
      currency={currency}
    />
  );
}

// Main page component
interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    userId: string;
  }>;
}

export default async function InvoiceDetailPage({
  params,
  searchParams,
}: PageProps) {
  const invoiceId = (await params).id;
  const userId = (await searchParams).userId;
  console.log(invoiceId);
  // Validate invoice ID
  if (!invoiceId || typeof invoiceId !== "string" || !userId) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Invoice Content with Suspense */}
      <Suspense fallback={<InvoiceFormSkeleton />}>
        <InvoiceContent userId={userId} invoiceId={invoiceId} />
      </Suspense>
    </div>
  );
}
