import React from "react";
import UserInvoiceForm from "../components/UserInvoiceForm";
import { getAuthUser } from "@/config/useAuth";
import { getBrandByUserId } from "@/actions/brand";
import { getLastClientByUserId } from "@/actions/client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ clientId: string }>;
}) {
  const user = await getAuthUser();

  if (!user) {
    redirect("/auth");
  }
  const brandResult = await getBrandByUserId(user?.id ?? "");

  if (brandResult.error) {
    console.error("Error fetching brand:", brandResult.error);
  }
  const { clientId = "" } = await searchParams;
  const lastClient = await getLastClientByUserId(user.id || "", clientId);

  const brandProfile = brandResult.data
    ? {
        id: brandResult.data.id,
        userId: brandResult.data.userId,
        name: brandResult.data.name,
        logo: brandResult.data.logo || undefined,
        slogan: brandResult.data.slogan || undefined,
        phone: brandResult.data.phone || undefined,
        address: brandResult.data.address || undefined,
        email: brandResult.data.email || undefined,
        brandColor: brandResult.data.brandColor || "#000000",
        template: brandResult.data.template as
          | "MINIMAL"
          | "PROFESSIONAL"
          | "MODERN"
          | "CREATIVE",
        paymentInfo: brandResult.data.paymentInfo || undefined,
        contactInfo: brandResult.data.contactInfo || undefined,
        thankYouMsg: brandResult.data.thankYouMsg || undefined,
        taxRate: brandResult.data.taxRate || undefined,
        salesTax: brandResult.data.salesTax || undefined,
        otherCharges: brandResult.data.otherCharges || undefined,
      }
    : undefined;
  const currency = brandResult.data?.currency || "$";
  return (
    <div>
      <UserInvoiceForm
        lastClient={lastClient}
        currentBrand={brandProfile}
        preparedBy={user.name ?? ""}
        currency={currency}
      />
    </div>
  );
}
