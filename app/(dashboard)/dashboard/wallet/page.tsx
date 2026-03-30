import React, { Suspense } from "react";
import { getWalletData } from "@/actions/wallet";
import { Skeleton } from "@/components/ui/skeleton";
import WalletClient from "@/components/dashboard/WalletClient";
import GettingStartedTimeline from "@/components/dashboard/GettingStartedTimeline";
import NewFeaturesBanner from "@/components/dashboard/NewFeaturesBanner";

export const dynamic = "force-dynamic";

function WalletSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}

async function WalletContent() {
  const data = await getWalletData();

  return (
    <WalletClient
      wallets={data.wallets.map((w) => ({
        id: w.id,
        currency: w.currency,
        balance: w.balance,
      }))}
      transactions={data.transactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        fee: t.fee,
        netAmount: t.netAmount,
        currency: t.currency,
        description: t.description,
        reference: t.reference,
        invoiceId: t.invoiceId,
        status: t.status,
        createdAt: t.createdAt.toISOString(),
      }))}
    />
  );
}

export default function WalletPage() {
  return (
    <div className="p-6">
      <div className="mb-6 space-y-4">
        <NewFeaturesBanner />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
          <p className="text-gray-500 mt-1">
            View your balances, payment history, and withdraw funds
          </p>
        </div>
        <GettingStartedTimeline variant="wallet" />
      </div>

      <Suspense fallback={<WalletSkeleton />}>
        <WalletContent />
      </Suspense>
    </div>
  );
}
