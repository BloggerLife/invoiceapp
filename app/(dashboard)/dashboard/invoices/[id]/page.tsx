import React, { Suspense } from "react";
import { notFound } from "next/navigation";

// import { getInvoiceById, getInvoiceMetadata } from "@/actions/invoices";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Loader2 } from "lucide-react";
import UserInvoiceForm from "../components/UserInvoiceForm";
import { getInvoiceById, getInvoiceMetadata } from "@/actions/invoice-details";
import InvoiceStatusPopup from "../components/StatusUpdateButton";
import { InvoiceStatus } from "@prisma/client";
import { getAuthUser } from "@/config/useAuth";
import { getBrandCurrencyByUserId } from "@/actions/limits";

export const dynamic = "force-dynamic";

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

// Loading component for page header
function HeaderSkeleton() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-48" />
      </div>
      <Skeleton className="h-4 w-96" />
    </div>
  );
}

// Main invoice content component
async function InvoiceContent({
  invoiceId,
  currency,
}: {
  invoiceId: string;
  currency: string;
}) {
  const invoiceData = await getInvoiceById(invoiceId);

  return (
    <UserInvoiceForm
      currency={currency}
      initialInvoiceData={invoiceData}
      editingId={invoiceId}
    />
  );
}

// Header content component
async function InvoiceHeader({
  invoiceId,
  currency,
}: {
  invoiceId: string;
  currency: string;
}) {
  const metadata = await getInvoiceMetadata(invoiceId);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex items-center justify-between  w-full">
          <h1 className="text-3xl font-bold text-gray-900">
            Invoice {metadata.invoiceNumber}
          </h1>
          <InvoiceStatusPopup
            invoiceId={invoiceId}
            currentStatus={metadata.status}
          />
        </div>
      </div>
      <p className="text-gray-600">
        Invoice for {metadata.clientName} • {currency}
        {metadata.totalAmount.toLocaleString()} • Status: {metadata.status}
      </p>
    </div>
  );
}

// Main page component
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InvoiceDetailPage({ params }: PageProps) {
  const invoiceId = (await params).id;
  const user = await getAuthUser();
  const currency = await getBrandCurrencyByUserId(user?.id ?? "");
  // Validate invoice ID
  if (!invoiceId || typeof invoiceId !== "string") {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header with Suspense */}
      <Suspense fallback={<HeaderSkeleton />}>
        <InvoiceHeader currency={currency} invoiceId={invoiceId} />
      </Suspense>

      {/* Invoice Content with Suspense */}
      <Suspense fallback={<InvoiceFormSkeleton />}>
        <InvoiceContent currency={currency} invoiceId={invoiceId} />
      </Suspense>
    </div>
  );
}
