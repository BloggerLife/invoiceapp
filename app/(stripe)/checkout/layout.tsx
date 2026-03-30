import { getAuthUser } from "@/config/useAuth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

export default async function CheckoutLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getAuthUser();
  if (!user) {
    redirect("/auth?returnUrl=/checkout");
  }
  return <div>{children}</div>;
}
