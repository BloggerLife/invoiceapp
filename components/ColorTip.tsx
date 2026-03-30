"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export function ColorTipBanner() {
  const [isDismissed, setIsDismissed] = useState(true); // Start as true to prevent flash

  useEffect(() => {
    // Check localStorage after component mounts
    const dismissed = localStorage.getItem("colorTipDismissed");
    setIsDismissed(dismissed === "true");
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("colorTipDismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 max-w-md z-50">
      <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-medium text-sm">
            Customize Your Invoice Colors and Currency
          </h3>
          <p className="text-xs text-gray-300 mt-1">
            Want to change your invoice color or Currency? Go to{" "}
            <Link
              href="/dashboard/settings/brand"
              className="font-semibold text-blue-400 hover:text-blue-300 underline transition-colors"
            >
              Settings → Brand Settings
            </Link>{" "}
            and add a dark hex color (#000000) or Your currency symbol
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
