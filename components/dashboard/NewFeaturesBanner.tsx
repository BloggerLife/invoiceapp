"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const BANNER_DISMISS_KEY = "new-features-banner-dismissed-v1";

export default function NewFeaturesBanner() {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash

  useEffect(() => {
    const val = localStorage.getItem(BANNER_DISMISS_KEY);
    setDismissed(val === "true");
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(BANNER_DISMISS_KEY, "true");
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors z-10"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="relative flex items-start gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm">
            New Features Available!
          </h3>
          <p className="text-white/80 text-xs mt-1 leading-relaxed">
            Collect payments via Mobile Money & Card directly from your invoices.
            Multi-currency wallet with instant withdrawals. Invoice & Quotation
            document types. And more!
          </p>
          <div className="flex items-center gap-3 mt-3">
            <Link
              href="/changelog"
              className="inline-flex items-center gap-1 text-xs font-medium bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              See What's New
              <ArrowRight className="h-3 w-3" />
            </Link>
            <button
              onClick={handleDismiss}
              className="text-xs text-white/60 hover:text-white/90 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
