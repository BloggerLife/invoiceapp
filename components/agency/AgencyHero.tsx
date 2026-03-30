import React from "react";
import {
  ArrowRight,
  FileText,
  Zap,
  CheckCircle,
  Users,
  Sparkles,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative min-h-[90vh] md:min-h-screen pt-12 md:pt-20 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:64px_64px] opacity-20"></div>
        <div className="absolute top-1/4 -right-20 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full filter blur-[100px] opacity-40"></div>
        <div className="absolute bottom-1/3 -left-20 w-48 md:w-80 h-48 md:h-80 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full filter blur-[90px] opacity-40"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs md:text-sm font-semibold mb-6 md:mb-8 border border-blue-100 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 text-blue-500" />
            <span>Trusted by 10,000+ Businesses</span>
            <BadgeCheck className="w-3.5 h-3.5 md:w-4 md:h-4 ml-1.5 text-indigo-500" />
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-slate-900 mb-4 md:mb-6 leading-tight">
            <span className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Stunning Invoices & Quotations
            </span>
            <br />
            <span className="inline-block mt-1 md:mt-2">
              That Get You Paid Faster
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base md:text-xl lg:text-2xl text-slate-600 mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed px-2">
            Create professional invoices, share payment links, and collect money
            via{" "}
            <span className="font-semibold text-emerald-600">
              Mobile Money & Card
            </span>
            . Get paid directly into your wallet and withdraw instantly.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12 px-2">
            {[
              { text: "Mobile Money Payments", icon: CheckCircle },
              { text: "Card Payments", icon: Zap },
              { text: "Instant Withdrawals", icon: Users },
              { text: "Invoices & Quotations", icon: FileText },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center px-3 py-2 md:px-4 md:py-2.5 rounded-lg bg-white/80 backdrop-blur-sm border border-slate-200 text-xs md:text-base font-medium text-slate-700 shadow-sm"
              >
                <feature.icon className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2 text-blue-500" />
                {feature.text}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4 sm:px-0">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl group text-sm md:text-base"
            >
              <span className="flex items-center">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 rounded-xl bg-white text-slate-800 font-semibold border-2 border-slate-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md group text-sm md:text-base"
            >
              <span className="flex items-center">
                View Pricing
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
