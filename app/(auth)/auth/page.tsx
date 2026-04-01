import LoginForm from "@/components/auth/login-form";
import Link from "next/link";
import Logo from "@/components/global/Logo";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{
    returnUrl?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const returnUrl = resolvedParams.returnUrl || "/choose-plan";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 relative overflow-hidden px-4 py-8">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(59,130,246,0.08),transparent_50%)]"></div>

      {/* Floating shapes - hidden on small screens */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-to-br from-blue-200/20 to-indigo-200/20 blur-xl hidden md:block"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-gradient-to-tl from-cyan-200/15 to-blue-200/15 blur-2xl hidden md:block"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="relative rounded-2xl shadow-xl shadow-slate-900/10 overflow-hidden">
          {/* Gradient border */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 via-transparent to-indigo-200/30 p-[1px] rounded-2xl">
            <div className="rounded-2xl bg-white/95 backdrop-blur-xl h-full w-full"></div>
          </div>

          <div className="relative p-6 sm:p-8 md:p-10">
            <div className="flex flex-col items-center justify-center space-y-6">
              {/* Logo */}
              <div className="p-2.5 px-5 rounded-xl bg-gradient-to-br from-slate-50 to-white shadow border border-slate-200/50">
                <Logo href="/" variant="light" />
              </div>

              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-blue-600 bg-clip-text text-transparent">
                  Welcome to Softinvoice Pro
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
                  Sign in to create professional invoices, collect payments, and
                  manage your business
                </p>
              </div>

              {/* Form */}
              <div className="w-full">
                <LoginForm returnUrl={returnUrl} />
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-100 w-full">
                <p className="text-center text-xs text-slate-500">
                  Need help?{" "}
                  <span className="font-medium text-blue-600 hover:text-blue-700">
                    Contact support
                  </span>
                  {/* <Link
                    href="/contact"
                    className="font-medium text-blue-600 hover:text-blue-700"
                  >
                    Contact support
                  </Link> */}
                </p>
              </div>
            </div>
          </div>

          {/* Corner highlights */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-100/40 to-transparent rounded-tl-2xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-indigo-100/30 to-transparent rounded-br-2xl"></div>
        </div>
      </div>
    </div>
  );
}
