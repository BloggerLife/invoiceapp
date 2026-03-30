"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Wallet,
  Plus,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/dashboard/invoices", icon: FileText, label: "Invoices" },
  { href: "/dashboard/invoices/new", icon: Plus, label: "New", isAction: true },
  { href: "/dashboard/wallet", icon: Wallet, label: "Wallet" },
  { href: "/dashboard/clients", icon: Menu, label: "More" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(tab.href);

          if (tab.isAction) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                  <tab.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-[10px] text-blue-600 font-medium mt-1">
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center flex-1 py-1"
            >
              <tab.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-blue-600" : "text-gray-400"
                )}
              />
              <span
                className={cn(
                  "text-[10px] mt-1 transition-colors",
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-400"
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
