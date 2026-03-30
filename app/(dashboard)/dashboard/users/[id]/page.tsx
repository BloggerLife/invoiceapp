// app/users/[userId]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { UserDetailPageSkeleton } from "../components/user-loading";
import { getUserDetails } from "@/actions/user-details";
import { UserDetailPage } from "../components/user-details-page";

interface UserPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    invoicePage?: string;
    clientPage?: string;
  }>;
}

// Loading component for suspense
function UserDetailLoading() {
  return <UserDetailPageSkeleton />;
}

// Main user detail component that fetches data
async function UserDetailContent({
  userId,
  invoicePage,
  clientPage,
}: {
  userId: string;
  invoicePage: number;
  clientPage: number;
}) {
  const userData = await getUserDetails(userId, invoicePage, clientPage);

  if (!userData) {
    notFound();
  }

  return (
    <UserDetailPage
      userData={userData}
      initialInvoicePage={invoicePage}
      initialClientPage={clientPage}
      userId={userId}
    />
  );
}

export default async function UserPage({
  params,
  searchParams,
}: UserPageProps) {
  const invoicePage = parseInt((await searchParams).invoicePage || "1", 10);
  const clientPage = parseInt((await searchParams).clientPage || "1", 10);
  const { id } = await params;
  return (
    <Suspense fallback={<UserDetailLoading />}>
      <UserDetailContent
        userId={id}
        invoicePage={invoicePage}
        clientPage={clientPage}
      />
    </Suspense>
  );
}
