import FloatingSocials from "@/components/agency/FloatingSocials";
import Footer from "@/components/agency/Footer";
import Navbar from "@/components/agency/Navbar";
import { getAuthUser } from "@/config/useAuth";
import React, { ReactNode } from "react";

export default async function AgencyLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = (await getAuthUser()) || null;
  return (
    <div>
      <Navbar user={user} />
      {children}
      <FloatingSocials />
      <Footer />
    </div>
  );
}
