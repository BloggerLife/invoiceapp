import { Suspense } from "react";

import { TableLoading } from "@/components/ui/data-table";

export const dynamic = "force-dynamic";

import ClientsTableListing from "./components/ClientsTableListing";
import { getClients } from "@/actions/client";
import { getAuthUser } from "@/config/useAuth";
import { getBrandCurrencyByUserId } from "@/actions/limits";

// Create an async component for data fetching
async function ClientsListingWithData() {
  const clients = (await getClients()) || [];
  const user = await getAuthUser();
  const currency = await getBrandCurrencyByUserId(user?.id ?? "");
  return (
    <ClientsTableListing
      title={`Clients (${clients.length})`}
      subtitle="Manage Clients"
      clients={clients}
      currency={currency}
    />
  );
}

export default function Clients() {
  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
      <Suspense fallback={<TableLoading />}>
        <ClientsListingWithData />
      </Suspense>
    </div>
  );
}
