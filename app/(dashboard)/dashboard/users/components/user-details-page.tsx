"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserInfoCard } from "./user-info-card";
import { UserMetricsCards } from "./user-metrics-cards";
import { BrandDetailsCard } from "./brand-details-card";
import { UserDetailsResponse } from "@/types/user";
import { InvoicesTable } from "./user-invoices-table";
import { ClientsTable } from "./user-clients-table";

interface UserDetailPageProps {
  userData: UserDetailsResponse;
  initialInvoicePage: number;
  initialClientPage: number;
  userId: string;
}

export function UserDetailPage({
  userData,
  initialInvoicePage,
  initialClientPage,
  userId,
}: UserDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [invoicePage, setInvoicePage] = useState(initialInvoicePage);
  const [clientPage, setClientPage] = useState(initialClientPage);

  const handleInvoicePageChange = (page: number) => {
    setInvoicePage(page);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("invoicePage", page.toString());
      router.push(`?${params.toString()}`);
    });
  };

  const handleClientPageChange = (page: number) => {
    setClientPage(page);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("clientPage", page.toString());
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
          <p className="text-muted-foreground">
            Complete overview of user information and activity
          </p>
        </div>
      </div>

      {/* User Info Card */}
      <UserInfoCard user={userData.user} />

      {/* Metrics Cards */}
      <UserMetricsCards
        metrics={userData.metrics}
        currency={userData.brand?.currency || "$"}
      />

      {/* Brand Details */}
      <BrandDetailsCard brand={userData.brand} />

      {/* Tables Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* Invoices Table */}
        <InvoicesTable
          invoices={userData.invoices}
          currentPage={invoicePage}
          onPageChange={handleInvoicePageChange}
          limit={10}
          currency={userData.brand?.currency || "$"}
          userId={userId}
        />

        {/* Clients Table */}
        <ClientsTable
          clients={userData.clients}
          currentPage={clientPage}
          onPageChange={handleClientPageChange}
          limit={10}
        />
      </div>

      {/* Loading overlay */}
      {isPending && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              <span>Loading...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
