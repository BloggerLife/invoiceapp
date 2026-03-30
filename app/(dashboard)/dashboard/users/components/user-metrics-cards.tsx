import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserMetrics } from "@/types/user";
import { DollarSign, FileText, Users, Clock, CheckCircle } from "lucide-react";

interface UserMetricsCardsProps {
  metrics: UserMetrics;
  currency?: string;
}

export function UserMetricsCards({
  metrics,
  currency = "$",
}: UserMetricsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency === "$" ? "USD" : "USD",
    }).format(amount);
  };

  const metricsData = [
    {
      title: "Total Revenue",
      value: formatCurrency(metrics.totalRevenue),
      icon: DollarSign,
      description: "From paid invoices",
      color: "text-green-600",
    },
    {
      title: "Total Invoices",
      value: metrics.totalInvoices.toString(),
      icon: FileText,
      description: "All time invoices",
      color: "text-blue-600",
    },
    {
      title: "Paid Invoices",
      value: metrics.paidInvoices.toString(),
      icon: CheckCircle,
      description: "Successfully paid",
      color: "text-green-600",
    },
    {
      title: "Pending Invoices",
      value: metrics.pendingInvoices.toString(),
      icon: Clock,
      description: "Awaiting payment",
      color: "text-orange-600",
    },
    {
      title: "Total Clients",
      value: metrics.totalClients.toString(),
      icon: Users,
      description: "Active clients",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {metricsData.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
