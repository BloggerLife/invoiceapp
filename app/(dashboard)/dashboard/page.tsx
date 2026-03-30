import { getInvoiceDashboardData } from "@/actions/invoices";
import { getBrandCurrencyByUserId } from "@/actions/limits";
import WelcomeSection from "@/components/dashboard/WelcomeMessage";
import GettingStartedTimeline from "@/components/dashboard/GettingStartedTimeline";
import NewFeaturesBanner from "@/components/dashboard/NewFeaturesBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthUser } from "@/config/useAuth";
import { formatCurrency } from "@/lib/utils";
import { AlertCircle, CheckCircle, DollarSign, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const user = await getAuthUser();
  const { invoices, stats } = await getInvoiceDashboardData();
  const currency = await getBrandCurrencyByUserId(user?.id ?? "");
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <NewFeaturesBanner />
      <WelcomeSection
        user={{
          name: user?.name ?? "",
          image: user?.image,
          role: user?.role ?? "USER",
        }}
      />
      <GettingStartedTimeline variant="dashboard" />
      <div className="">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Invoices
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">{stats.totalInvoices}</div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">
                {formatCurrency(stats.totalRevenue, currency)}
              </div>
              <p className="text-xs text-muted-foreground">All invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Paid Revenue
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-base md:text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalRevenuePaid, currency)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.totalRevenue > 0
                  ? `${((stats.totalRevenuePaid / stats.totalRevenue) * 100).toFixed(1)}% collected`
                  : "No revenue yet"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Unpaid Revenue
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-base md:text-2xl font-bold text-orange-600">
                {formatCurrency(stats.totalRevenueUnpaid, currency)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.totalRevenue > 0
                  ? `${((stats.totalRevenueUnpaid / stats.totalRevenue) * 100).toFixed(1)}% pending`
                  : "No pending revenue"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* {role === "ADMIN" && (
        <div className="space-y-6">
          <AnalyticsDashboard stats={adminStats} />
        </div>
      )} */}
    </main>
  );
}
