import { ColorTipBanner } from "@/components/ColorTip";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import { authOptions } from "@/config/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen flex bg-slate-50/30">
      <ColorTipBanner />
      {/* Fixed Sidebar - hidden on mobile */}
      <aside className="fixed left-0 top-0 z-40 h-screen hidden md:block">
        <Sidebar role={session.user.role} session={session} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-[80px] lg:ml-[280px] transition-all duration-300">
        <Navbar session={session} />
        <div className="p-4 lg:p-6 pb-24 md:pb-6 bg-white/50 backdrop-blur-sm min-h-[calc(100vh-60px)]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
