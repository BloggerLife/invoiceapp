import { Suspense } from "react";

import { TableLoading } from "@/components/ui/data-table";

import InvoiceTableListing from "./components/InvoiceTableListing";
import { getInvoiceDashboardData } from "@/actions/invoices";

import { getAuthUser } from "@/config/useAuth";
import { redirect } from "next/navigation";
import { getBrandCurrencyByUserId, getInvoiceQuota } from "@/actions/limits";
import UsageBanner from "@/app/(dashboard)/dashboard/invoices/components/usage-alert-banner";
import GettingStartedTimeline from "@/components/dashboard/GettingStartedTimeline";
import NewFeaturesBanner from "@/components/dashboard/NewFeaturesBanner";

export const dynamic = "force-dynamic";

// Create an async component for data fetching
async function InvoiceListingWithData() {
  const user = await getAuthUser();

  // Check authentication first
  if (!user?.id) {
    redirect("/login");
  }

  const [{ invoices, stats }, quotaRes, currency] = await Promise.all([
    getInvoiceDashboardData(),
    getInvoiceQuota(user.id),
    getBrandCurrencyByUserId(user.id),
  ]);

  if (!quotaRes) {
    redirect("/login");
  }

  return (
    <div className="">
      <div className="px-8 space-y-4">
        <NewFeaturesBanner />
        <UsageBanner usageData={quotaRes} />
        <GettingStartedTimeline variant="invoices" />
      </div>
      <InvoiceTableListing
        title="Invoices"
        subtitle="Manage Invoices"
        invoices={invoices}
        stats={stats}
        currency={currency}
      />
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
      <Suspense fallback={<TableLoading />}>
        <InvoiceListingWithData />
      </Suspense>
    </div>
  );
}
