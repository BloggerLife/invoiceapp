import { getUserPlan } from "@/actions/users";
import NotFound from "@/app/not-found";
import { authOptions } from "@/config/auth";
import { getAuthUser } from "@/config/useAuth";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  FileText,
  ArrowRight,
  CheckCircle,
  Zap,
  TrendingUp,
  Shield,
  Star,
} from "lucide-react";
import Link from "next/link";
import { getInvoiceQuota } from "@/actions/limits";
import UsageBanner from "../components/usage-alert-banner";

// Upgrade Required Component
function UpgradeRequired({ remainingInvoices }: { remainingInvoices: number }) {
  const isLimitReached = remainingInvoices <= 0;
  const isNearLimit = remainingInvoices <= 5 && remainingInvoices > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Main Upgrade Card */}
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Crown className="w-10 h-10 text-white" />
            </div>

            <div className="space-y-2">
              <Badge variant="warning" className="mb-2">
                {isLimitReached ? "Limit Reached" : "Upgrade Recommended"}
              </Badge>

              <CardTitle className="text-3xl md:text-4xl font-bold text-slate-900">
                {isLimitReached
                  ? "Invoice Limit Reached!"
                  : "You're Almost Out of Invoices!"}
              </CardTitle>

              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                {isLimitReached
                  ? "You've used all your free invoices. Upgrade to Invoice Pro to continue creating unlimited professional invoices."
                  : `You have ${remainingInvoices} invoice${remainingInvoices !== 1 ? "s" : ""} remaining on your free plan. Upgrade now to unlock unlimited invoicing.`}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Current Plan Status */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Free Plan</h3>
                    <p className="text-slate-500 text-sm">
                      {isLimitReached ? "0" : remainingInvoices} invoices
                      remaining
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="w-32 bg-slate-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        isLimitReached
                          ? "bg-red-500 w-full"
                          : remainingInvoices <= 2
                            ? "bg-orange-500"
                            : "bg-blue-500"
                      }`}
                      style={{
                        width: `${Math.max(5, ((10 - remainingInvoices) / 10) * 100)}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500">
                    {10 - remainingInvoices} of 10 used
                  </p>
                </div>
              </div>
            </div>

            {/* Upgrade Benefits */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Unlimited Invoices
                </h4>
                <p className="text-slate-600 text-sm">
                  Create as many invoices as you need without any limits
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Advanced Features
                </h4>
                <p className="text-slate-600 text-sm">
                  Access premium templates, analytics, and automation tools
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Priority Support
                </h4>
                <p className="text-slate-600 text-sm">
                  Get faster response times and dedicated customer support
                </p>
              </div>
            </div>

            {/* Pricing Comparison */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">
                Choose Your Plan
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Current Plan */}
                <div className="border-2 border-slate-200 rounded-xl p-6">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-slate-900">
                      Free Plan
                    </h4>
                    <div className="text-3xl font-bold text-slate-900 mt-2">
                      $0
                    </div>
                    <p className="text-slate-500 text-sm mt-1">per month</p>
                  </div>

                  <ul className="space-y-3 mt-6">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-slate-600">
                        10 invoices per month
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-slate-600">
                        Basic templates
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-slate-600">PDF export</span>
                    </li>
                  </ul>

                  <Badge
                    variant="secondary"
                    className="w-full justify-center mt-6"
                  >
                    Current Plan
                  </Badge>
                </div>

                {/* Pro Plan */}
                <div className="border-2 border-blue-500 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>

                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-slate-900">
                      Invoice Pro
                    </h4>
                    <div className="text-3xl font-bold text-blue-600 mt-2">
                      $9.99
                    </div>
                    <p className="text-slate-500 text-sm mt-1">per month</p>
                  </div>

                  <ul className="space-y-3 mt-6">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-slate-600">
                        Unlimited invoices
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-slate-600">
                        Premium templates
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-slate-600">
                        Advanced analytics
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-slate-600">
                        Priority support
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-slate-600">
                        Custom branding
                      </span>
                    </li>
                  </ul>

                  <Button
                    asChild
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                  >
                    <Link href="/pricing">
                      <Zap className="w-4 h-4 mr-2" />
                      Upgrade Now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
                >
                  <Link href="/pricing">
                    <Crown className="w-5 h-5 mr-2" />
                    View All Plans
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="text-lg px-8"
                >
                  <Link href="/dashboard">Return to Dashboard</Link>
                </Button>
              </div>

              <p className="text-sm text-slate-500">
                Questions?{" "}
                <Link href="/contact" className="text-blue-600 hover:underline">
                  Contact our sales team
                </Link>
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>30-day money back</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>Instant activation</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getAuthUser();
  if (!user) {
    return notFound();
  }

  const res = await getInvoiceQuota(user?.id ?? "");
  if (!res) {
    redirect("/login");
  }

  // Show upgrade UI when user is on free plan and has 5 or fewer invoices remaining
  if (res.remaining <= 0) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center">
        <UsageBanner usageData={res} />
      </div>
    );
  }

  return <div>{children}</div>;
}
