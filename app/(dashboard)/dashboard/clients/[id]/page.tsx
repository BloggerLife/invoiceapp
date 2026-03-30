import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  getClientById,
  getClientInvoices,
  getClientStats,
  ClientData,
  ClientInvoiceData,
} from "@/actions/client";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Building2,
  Phone,
  MapPin,
  Mail,
  FileText,
  DollarSign,
  AlertCircle,
  Eye,
  Edit,
  Plus,
  Calendar,
  Clock,
  TrendingUp,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { InvoiceStatus } from "@prisma/client";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { getAuthUser } from "@/config/useAuth";
import { getBrandCurrencyByUserId } from "@/actions/limits";

const getStatusColor = (status: InvoiceStatus, isPastDue: boolean) => {
  if (isPastDue) return "destructive";

  switch (status) {
    case InvoiceStatus.PAID:
      return "success";
    case InvoiceStatus.SENT:
      return "warning";
    case InvoiceStatus.VIEWED:
      return "info";
    case InvoiceStatus.DRAFT:
      return "secondary";
    case InvoiceStatus.OVERDUE:
      return "destructive";
    case InvoiceStatus.CANCELLED:
      return "outline";
    default:
      return "secondary";
  }
};

const getRemainingDaysDisplay = (
  remainingDays: number,
  isPastDue: boolean,
  status: InvoiceStatus
) => {
  if (status === InvoiceStatus.PAID) {
    return <span className="text-green-600 font-medium">Paid</span>;
  }

  if (isPastDue) {
    return (
      <span className="text-red-600 font-medium">
        {Math.abs(remainingDays)} days overdue
      </span>
    );
  }

  if (remainingDays === 0) {
    return <span className="text-orange-600 font-medium">Due today</span>;
  }

  if (remainingDays > 0) {
    return <span className="text-gray-600">{remainingDays} days left</span>;
  }

  return <span className="text-gray-500">-</span>;
};

// Loading components
function ClientHeaderSkeleton() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Contact Info Skeleton */}
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-5 w-5" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-16 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function InvoiceTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right space-y-1">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Main content components
async function ClientHeader({ clientId }: { clientId: string }) {
  const user = await getAuthUser();
  const [client, stats, currency] = await Promise.all([
    getClientById(clientId),
    getClientStats(clientId),
    getBrandCurrencyByUserId(user?.id ?? ""),
  ]);

  const getClientStatus = (client: ClientData) => {
    if (!client.isActive)
      return { label: "Inactive", variant: "secondary" as const };
    if (client.totalInvoices === 0)
      return { label: "New Client", variant: "info" as const };
    if (client.unpaidAmount > 0)
      return { label: "Has Outstanding", variant: "warning" as const };
    return { label: "Active", variant: "success" as const };
  };

  const status = getClientStatus(client);

  return (
    <div className="mb-8">
      {/* Client Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">
              {client.companyName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <User className="w-4 h-4 text-gray-500" />
              <p className="text-gray-600">{client.contactPerson}</p>
            </div>
            <Badge variant={status.variant} className="mt-2">
              {status.label}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            className={buttonVariants({
              variant: "ghost",
            })}
            href={`/dashboard/clients/${clientId}/edit`}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Client
          </Link>

          <Link
            className={buttonVariants()}
            href={`/dashboard/invoices/new?clientId=${clientId}`}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Link>
        </div>
      </div>

      {/* Contact Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {client.phone && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{client.phone}</p>
                </div>
              </div>
            )}
            {client.email && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium break-all">{client.email}</p>
                </div>
              </div>
            )}
            {client.location && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{client.location}</p>
                </div>
              </div>
            )}
          </div>

          {client.notes && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-500 mb-2">Notes</p>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {client.notes}
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                Client since: {format(client.createdAt, "MMM dd, yyyy")}
              </span>
              <span>
                Last updated: {format(client.updatedAt, "MMM dd, yyyy")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invoices
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{client.totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              {stats.recentInvoicesCount} in last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(client.totalAmount, currency)}
            </div>
            <p className="text-xs text-muted-foreground">All time revenue</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(client.paidAmount, currency)}
            </div>
            <p className="text-xs text-muted-foreground">
              {client.totalAmount > 0
                ? `${((client.paidAmount / client.totalAmount) * 100).toFixed(1)}% collected`
                : "No revenue yet"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(client.unpaidAmount, currency)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.overdueInvoicesCount > 0
                ? `${stats.overdueInvoicesCount} overdue invoice${stats.overdueInvoicesCount > 1 ? "s" : ""}`
                : "No overdue invoices"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

async function ClientInvoices({ clientId }: { clientId: string }) {
  const invoices = await getClientInvoices(clientId);
  const user = await getAuthUser();
  const currency = await getBrandCurrencyByUserId(user?.id ?? "");
  if (invoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Invoices
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                No invoices found for this client
              </p>
            </div>
            <Button asChild>
              <Link href={`/dashboard/invoices/new?clientId=${clientId}`}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Invoice
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No invoices yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Get started by creating your first invoice for this client. Track
              payments and manage billing efficiently.
            </p>
            <Button asChild>
              <Link href={`/dashboard/invoices/new?clientId=${clientId}`}>
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Separate invoices by status for better organization
  const paidInvoices = invoices.filter(
    (inv) => inv.status === InvoiceStatus.PAID
  );
  const overdueInvoices = invoices.filter(
    (inv) => inv.isPastDue && inv.status !== InvoiceStatus.PAID
  );
  const pendingInvoices = invoices.filter(
    (inv) => !inv.isPastDue && inv.status !== InvoiceStatus.PAID
  );

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Invoices ({invoices.length})
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                All invoices for this client
              </p>
            </div>
            <Button asChild>
              <Link href={`/dashboard/invoices/new?clientId=${clientId}`}>
                <Plus className="w-4 h-4 mr-2" />
                New Invoice
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {paidInvoices.length}
              </div>
              <div className="text-sm text-gray-500">Paid</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {pendingInvoices.length}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {overdueInvoices.length}
              </div>
              <div className="text-sm text-gray-500">Overdue</div>
            </div>
          </div>

          {/* Invoice List */}
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-4"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {invoice.invoiceNumber}
                      </span>
                      <Badge
                        variant={getStatusColor(
                          invoice.status,
                          invoice.isPastDue
                        )}
                      >
                        {invoice.isPastDue ? "Overdue" : invoice.status}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Created: {format(invoice.invoiceDate, "MMM dd, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          Due: {format(invoice.dueDate, "MMM dd, yyyy")}
                        </span>
                      </div>
                      {invoice.preparedBy && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>By: {invoice.preparedBy}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4">
                  <div className="text-right">
                    <div className="font-semibold text-lg">
                      {formatCurrency(invoice.totalAmount, currency)}
                    </div>
                    <div className="text-sm">
                      {getRemainingDaysDisplay(
                        invoice.remainingDays,
                        invoice.isPastDue,
                        invoice.status
                      )}
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/invoices/${invoice.id}`}>
                      <Eye className="w-4 h-4" />
                      <span className="sr-only">View invoice</span>
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main page component
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClientDetailPage({ params }: PageProps) {
  const clientId = (await params).id;

  if (!clientId || typeof clientId !== "string") {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Client Header with Suspense */}
      <Suspense fallback={<ClientHeaderSkeleton />}>
        <ClientHeader clientId={clientId} />
      </Suspense>

      {/* Client Invoices with Suspense */}
      <Suspense fallback={<InvoiceTableSkeleton />}>
        <ClientInvoices clientId={clientId} />
      </Suspense>
    </div>
  );
}

// Helper functions
// const formatCurrency = (amount: number) => {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//   }).format(amount);
// };

// Main content components
// async function ClientHeader({ clientId }: { clientId: string }) {
//   const [client, stats] = await Promise.all([
//     getClientById(clientId),
//     getClientStats(clientId)
//   ]);

//   const getClientStatus = (client: ClientData) => {
//     if (!client.isActive) return { label: "Inactive", variant: "secondary" as const };
//     if (client.totalInvoices === 0) return { label: "New Client", variant: "info" as const };
//     if (client.unpaidAmount > 0) return { label: "Has Outstanding", variant: "warning" as const };
//     return { label: "Active", variant: "success" as const };
//   };

//   const status = getClientStatus(client);

//   return (
//     <div className="mb-8">
//       {/* Client Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
//         <div className="flex items-center gap-4">
//           <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
//             <Building2 className="w-8 h-8 text-blue-600" />
//           </div>
//           <div className="min-w-0">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">
//               {client.companyName}
//             </h1>
//             <div className="flex items-center gap-2 mt-1">
//               <User className="w-4 h-4 text-gray-500" />
//               <p className="text-gray-600">{client.contactPerson}</p>
//             </div>
//             <Badge variant={status.variant} className="mt-2">
//               {status.label}
//             </Badge>
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-2">
//           <Button variant="outline" asChild className="w-full sm:w-auto">
//             <Link href={`/dashboard/clients/${clientId}/edit`}>
//               <Edit className="w-4 h-4 mr-2" />
//               Edit Client
//             </Link>
//           </Button>
//           <Button asChild className="w-full sm:w-auto">
//             <Link href={`/dashboard/invoices/new?clientId=${clientId}`}>
//               <Plus className="w-4 h-4 mr-2" />
//               New Invoice
//             </Link>
//           </Button>
//         </div>
//       </div>

//       {/* Contact Information */}
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle className="text-lg flex items-center gap-2">
//             <User className="w-5 h-5" />
//             Contact Information
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {client.phone && (
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
//                   <Phone className="w-5 h-5 text-green-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Phone</p>
//                   <p className="font-medium">{client.phone}</p>
//                 </div>
//               </div>
//             )}
//             {client.email && (
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
//                   <Mail className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Email</p>
//                   <p className="font-medium break-all">{client.email}</p>
//                 </div>
//               </div>
//             )}
//             {client.location && (
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
//                   <MapPin className="w-5 h-5 text-purple-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Location</p>
//                   <p className="font-medium">{client.location}</p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {client.notes && (
//             <div className="mt-6 pt-6 border-t">
//               <p className="text-sm text-gray-500 mb-2">Notes</p>
//               <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{client.notes}</p>
//             </div>
//           )}

//           <div className="mt-6 pt-6 border-t">
//             <div className="flex items-center justify-between text-sm text-gray-500">
//               <span>Client since: {format(client.createdAt, "MMM dd, yyyy")}</span>
//               <span>Last updated: {format(client.updatedAt, "MMM dd, yyyy")}</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card className="hover:shadow-md transition-shadow">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
//             <FileText className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{client.totalInvoices}</div>
//             <p className="text-xs text-muted-foreground">
//               {stats.recentInvoicesCount} in last 30 days
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="hover:shadow-md transition-shadow">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{formatCurrency(client.totalAmount)}</div>
//             <p className="text-xs text-muted-foreground">
//               All time revenue
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="hover:shadow-md transition-shadow">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
//             <DollarSign className="h-4 w-4 text-green-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">
//               {formatCurrency(client.paidAmount)}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               {client.totalAmount > 0
//                 ? `${((client.paidAmount / client.totalAmount) * 100).toFixed(1)}% collected`
//                 : "No revenue yet"
//               }
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="hover:shadow-md transition-shadow">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
//             <AlertCircle className="h-4 w-4 text-orange-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-orange-600">
//               {formatCurrency(client.unpaidAmount)}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               {stats.overdueInvoicesCount > 0
//                 ? `${stats.overdueInvoicesCount} overdue invoice${stats.overdueInvoicesCount > 1 ? 's' : ''}`
//                 : "No overdue invoices"
//               }
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
