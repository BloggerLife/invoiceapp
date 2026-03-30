import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, Shield } from "lucide-react";

export default function ProfileSettingsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 relative overflow-hidden">
      {/* Premium background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(120,119,198,0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(59,130,246,0.06),transparent_50%)]"></div>

      {/* Floating geometric shapes */}
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-blue-200/20 to-indigo-200/20 blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-gradient-to-tl from-cyan-200/15 to-blue-200/15 blur-2xl"></div>

      <div className="relative z-10 p-6 lg:p-8">
        {/* Premium Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 mb-4 animate-pulse">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <div className="h-10 bg-slate-200 rounded-lg w-64 mx-auto animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-12 gap-8">
            {/* Main Form Skeleton */}
            <div className="lg:col-span-8 col-span-full space-y-6">
              {/* Personal Information Card Skeleton */}
              <Card className="border-0 shadow-2xl shadow-slate-900/5 bg-white/80 backdrop-blur-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-transparent to-indigo-200/20 p-[1px] rounded-xl">
                  <div className="rounded-xl bg-white/90 backdrop-blur-sm h-full w-full"></div>
                </div>

                <div className="relative">
                  <CardHeader className="bg-gradient-to-r from-slate-50/80 to-blue-50/40 border-b border-slate-200/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md animate-pulse">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-5 bg-slate-200 rounded w-40 animate-pulse"></div>
                        <div className="h-3 bg-slate-200 rounded w-64 animate-pulse"></div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-8">
                    <div className="space-y-6">
                      {/* Name Fields Skeleton */}
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-3">
                          <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
                          <div className="h-12 bg-slate-200 rounded animate-pulse"></div>
                        </div>
                        <div className="space-y-3">
                          <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
                          <div className="h-12 bg-slate-200 rounded animate-pulse"></div>
                        </div>
                      </div>

                      {/* Email Field Skeleton */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
                          <div className="flex items-center space-x-1">
                            <Shield className="w-3 h-3 text-emerald-500 animate-pulse" />
                            <div className="h-3 bg-slate-200 rounded w-12 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="h-12 bg-slate-100/80 rounded animate-pulse"></div>
                        <div className="h-3 bg-slate-200 rounded w-64 animate-pulse"></div>
                      </div>

                      {/* Phone Field Skeleton */}
                      <div className="space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
                        <div className="h-12 bg-slate-200 rounded animate-pulse"></div>
                      </div>

                      {/* Job Title Field Skeleton */}
                      <div className="space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
                        <div className="h-12 bg-slate-200 rounded animate-pulse"></div>
                      </div>

                      {/* Save Button Skeleton */}
                      <div className="pt-6 border-t border-slate-200/60">
                        <div className="flex justify-end">
                          <div className="h-12 bg-slate-200 rounded w-32 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>

            {/* Profile Image Section Skeleton */}
            <div className="lg:col-span-4 col-span-full">
              <div className="sticky top-6">
                <Card className="border-0 shadow-2xl shadow-slate-900/5 bg-white/80 backdrop-blur-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-transparent to-indigo-200/20 p-[1px] rounded-xl">
                    <div className="rounded-xl bg-white/90 backdrop-blur-sm h-full w-full"></div>
                  </div>

                  <div className="relative p-6">
                    <div className="text-center mb-6 space-y-2">
                      <div className="h-6 bg-slate-200 rounded w-28 mx-auto animate-pulse"></div>
                      <div className="h-4 bg-slate-200 rounded w-36 mx-auto animate-pulse"></div>
                    </div>

                    {/* Image Upload Skeleton */}
                    <div className="w-full h-48 bg-slate-200 rounded-lg animate-pulse mb-4"></div>

                    {/* Security Notice Skeleton */}
                    <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-200/50">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-3 h-3 text-emerald-500 animate-pulse" />
                        <div className="h-3 bg-slate-200 rounded w-44 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
