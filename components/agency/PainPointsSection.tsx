import React from "react";
import {
  Clock,
  AlertTriangle,
  XCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const painPoints = [
  {
    icon: Clock,
    problem: "Chasing late payments",
    solution: "Payment links with instant mobile money & card checkout",
  },
  {
    icon: AlertTriangle,
    problem: "Manually creating invoices in Word or Excel",
    solution: "Professional invoices generated in under 60 seconds",
  },
  {
    icon: XCircle,
    problem: "No easy way to collect money digitally",
    solution: "Clients pay via MTN, Airtel, or card from a single link",
  },
];

export default function PainPointsSection() {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-red-50 text-red-600 text-xs md:text-sm font-semibold mb-3 md:mb-4">
            The Problem
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
            Sound familiar?
          </h2>
          <p className="text-sm md:text-lg text-slate-600">
            Most businesses in East Africa still struggle with these problems
            every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {painPoints.map((item, index) => (
            <div
              key={index}
              className="relative bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm"
            >
              {/* Problem */}
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <span className="text-xs font-medium text-red-500 uppercase tracking-wide">
                    Problem
                  </span>
                  <p className="text-base md:text-lg font-semibold text-slate-900 mt-1">
                    {item.problem}
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center mb-6">
                <ArrowRight className="w-5 h-5 text-slate-300 rotate-90" />
              </div>

              {/* Solution */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <span className="text-xs font-medium text-emerald-500 uppercase tracking-wide">
                    Solution
                  </span>
                  <p className="text-sm md:text-base text-slate-700 mt-1">
                    {item.solution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
