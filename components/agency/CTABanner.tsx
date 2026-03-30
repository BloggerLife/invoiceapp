import React from "react";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-12 md:px-16 md:py-20">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs md:text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5 mr-1.5" />
              Start for free — no credit card required
            </div>

            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
              Stop chasing payments.
              <br />
              <span className="text-blue-200">Start getting paid.</span>
            </h2>

            <p className="text-sm md:text-lg text-blue-100 mb-8 md:mb-10 max-w-2xl mx-auto">
              Join thousands of businesses across East Africa who use InvoicePro
              to create invoices, collect payments, and manage their finances —
              all from their phone.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link
                href="/auth"
                className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 rounded-xl bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl group text-sm md:text-base"
              >
                Create Your First Invoice
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm md:text-base"
              >
                View Pricing
              </Link>
            </div>

            <p className="text-xs md:text-sm text-blue-200/70 mt-4 md:mt-6">
              1 free invoice per day on the free plan. Upgrade anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
