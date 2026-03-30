// app/billing/page.tsx (Server Component)
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  getInvoiceCount,
  getPayments,
  getSubscriptionData,
} from "@/actions/billing-actions";
import { authOptions } from "@/config/auth";

export const dynamic = "force-dynamic";
import BillingClient from "@/components/dashboard/ManageBilling";
import { getInvoiceQuota } from "@/actions/limits";
import UsageBanner from "../invoices/components/usage-alert-banner";

interface BillingPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

// Loading component for the billing data
function BillingLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div>
                <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>

        {/* Payment Method Skeleton */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="h-6 bg-gray-200 rounded w-20 mb-4 animate-pulse"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>

        {/* Invoices Table Skeleton */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="h-6 bg-gray-200 rounded w-20 mb-6 animate-pulse"></div>
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 pb-3 border-b border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
            {/* Table Rows */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-4 py-4">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-12 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Cancellation Skeleton */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-10 bg-red-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Billing data fetcher component
async function BillingData({ searchParams }: BillingPageProps) {
  // Parse search params
  const pageParam = (await searchParams).page;
  const limitParam = (await searchParams).limit;
  const page = parseInt(pageParam || "1", 10);
  const limit = parseInt(limitParam || "10", 10);

  // Fetch data server-side
  const [subscription, paymentsData, invoiceCount] = await Promise.all([
    getSubscriptionData(),
    getPayments(page, limit),
    getInvoiceCount(),
  ]);

  // Get session for user email
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/auth?returnUrl=/billing");
  }
  const res = await getInvoiceQuota(session.user?.id ?? "");
  if (!res) {
    redirect("/auth/auth?returnUrl=/billing");
  }
  return (
    <div className="">
      <div className="max-w-4xl mx-auto">
        <UsageBanner usageData={res} />
      </div>
      <BillingClient
        initialSubscription={subscription}
        initialPayments={paymentsData.payments}
        pagination={paymentsData.pagination}
        userEmail={session?.user?.email || ""}
        invoiceCount={invoiceCount}
      />
    </div>
  );
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
  // Check authentication
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/billing");
  }

  return (
    <Suspense fallback={<BillingLoading />}>
      <BillingData searchParams={searchParams} />
    </Suspense>
  );
}
