import { getBrandByUserId } from "@/actions/brand";
import BrandSettingsForm from "@/components/Forms/BrandSettingsForm";
import { getAuthUser } from "@/config/useAuth";
import { Suspense } from "react";
import BrandSettingsLoading from "./BrandSettingsLoading";

export const dynamic = "force-dynamic";

export default async function BrandSettingsPage() {
  return (
    <Suspense fallback={<BrandSettingsLoading />}>
      <BrandSettingsContent />
    </Suspense>
  );
}

async function BrandSettingsContent() {
  const user = await getAuthUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const brandResult = await getBrandByUserId(user.id);

  if (brandResult.error) {
    console.error("Error fetching brand:", brandResult.error);
  }

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
        currency: brandResult.data.currency || undefined,
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

  return (
    <div>
      <BrandSettingsForm currentBrand={brandProfile} userId={user.id} />
    </div>
  );
}
