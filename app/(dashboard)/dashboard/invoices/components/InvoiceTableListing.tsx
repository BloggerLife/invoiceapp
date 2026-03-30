"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
import { formatCurrency, formatISODate } from "@/lib/utils";

import { format } from "date-fns";
import { toast } from "sonner";

import {
  Column,
  ConfirmationDialog,
  DataTable,
  TableActions,
} from "@/components/ui/data-table";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Eye,
  FileText,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Plus,
  Download,
  Edit,
} from "lucide-react";
import {
  deleteInvoice,
  InvoiceListItem,
  InvoiceStats,
} from "@/actions/invoices";
import { InvoiceStatus } from "@prisma/client";

export default function InvoiceTableListing({
  invoices,
  stats,
  title,
  subtitle,
  currency,
}: {
  invoices: InvoiceListItem[];
  stats: InvoiceStats;
  title: string;
  subtitle: string;
  currency: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<InvoiceListItem | null>(null);

  // Helper function to get status color
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

  // Helper function to get remaining days display
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

  const columns: Column<InvoiceListItem>[] = [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice",
      cell: (row) => {
        const invoice = row;
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{invoice.invoiceNumber}</span>
              <span className="text-sm text-gray-500">
                {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "clientName",
      header: "Client",
      cell: (row) => {
        const invoice = row;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{invoice.clientName}</span>
            <span className="text-sm text-gray-500">
              Due: {format(new Date(invoice.dueDate), "MMM dd")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Amount",
      cell: (row) => {
        const invoice = row;
        return (
          <div className="text-right">
            <span className="font-semibold text-lg">
              {formatCurrency(invoice.totalAmount, currency)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (row) => {
        const invoice = row;
        return (
          <Badge variant={getStatusColor(invoice.status, invoice.isPastDue)}>
            {invoice.isPastDue ? "Overdue" : invoice.status}
          </Badge>
        );
      },
    },
    // {
    //   accessorKey: "remainingDays",
    //   header: "Due Status",
    //   cell: (row) => {
    //     const invoice = row;
    //     return getRemainingDaysDisplay(
    //       invoice.remainingDays,
    //       invoice.isPastDue,
    //       invoice.status
    //     );
    //   },
    // },
    {
      accessorKey: "id",
      header: "Actions",
      cell: (row) => {
        const invoice = row;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/invoices/${invoice.id}`)}
            >
              <Eye className="h-4 w-4" />
              View
            </Button>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditClick(invoice)}
            >
              <Edit className="h-4 w-4" />
            </Button> */}
          </div>
        );
      },
    },
  ];

  const handleAddNew = () => {
    router.push("/dashboard/invoices/new");
  };

  // Export to Excel
  const handleExport = async (filteredInvoices: InvoiceListItem[]) => {
    try {
      // Prepare data for export
      const exportData = filteredInvoices.map((invoice) => ({
        "Invoice Number": invoice.invoiceNumber,
        "Client Name": invoice.clientName,
        "Total Amount": invoice.totalAmount,
        "Due Date": format(new Date(invoice.dueDate), "yyyy-MM-dd"),
        Status: invoice.isPastDue ? "Overdue" : invoice.status,
        "Remaining Days": invoice.remainingDays,
        "Amount (USD)": formatCurrency(invoice.totalAmount, currency),
      }));

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");

      // Generate filename with current date
      const fileName = `Invoices_${format(new Date(), "yyyy-MM-dd")}.xlsx`;

      // Export to file
      XLSX.writeFile(workbook, fileName);

      toast.success("Export successful", {
        description: `Invoices exported to ${fileName}`,
      });
    } catch (error) {
      toast.error("Export failed", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  // Handle edit click
  const handleEditClick = (invoice: InvoiceListItem) => {
    // router.push(`/dashboard/invoices/${invoice.id}/edit`);
    toast.error("Invoice editing is Not supported yet");
  };

  // Handle delete click
  const handleDeleteClick = (invoice: InvoiceListItem) => {
    // toast.error("Invoice Delete is Not supported yet");
    setDeleteItem(invoice);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;

    setIsDeleting(true);
    try {
      // Add your delete logic here
      await deleteInvoice(deleteItem.id);
      toast.success("Invoice deleted successfully");
      setDeleteDialogOpen(false);
      setDeleteItem(null);
    } catch (error) {
      toast.error("Failed to delete invoice");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invoices
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-base md:text-2xl font-bold">{stats.totalInvoices}</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-base md:text-2xl font-bold">
              {formatCurrency(stats.totalRevenue, currency)}
            </div>
            <p className="text-xs text-muted-foreground">All invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Revenue</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm md:text-2xl font-bold text-green-600">
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
            <div className="text-sm md:text-2xl font-bold text-orange-600">
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

      {/* Data Table */}
      <DataTable<InvoiceListItem>
        title={title}
        subtitle={subtitle}
        data={invoices}
        columns={columns}
        keyField="id"
        isLoading={false}
        onRefresh={() => window.location.reload()}
        actions={{
          onAdd: handleAddNew,
          onExport: handleExport,
        }}
        filters={{
          searchFields: ["clientName", "invoiceNumber"],
          enableDateFilter: true,
          getItemDate: (item) => new Date(item.dueDate),
        }}
        renderRowActions={(item) => (
          <TableActions.RowActions
            // onEdit={() => handleEditClick(item)}
            onDelete={() => handleDeleteClick(item)}
            isDeleting={isDeleting && deleteItem?.id === item.id}
          />
        )}
        renderMobileCard={(invoice) => (
          <div className="border border-gray-200 rounded-lg p-3 bg-white">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{invoice.invoiceNumber}</div>
                  <div className="text-xs text-gray-500">{invoice.clientName}</div>
                </div>
              </div>
              <Badge variant={getStatusColor(invoice.status, invoice.isPastDue)} className="shrink-0">
                {invoice.isPastDue ? "Overdue" : invoice.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Due: {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
              </span>
              <span className="text-sm font-semibold">
                {formatCurrency(invoice.totalAmount, currency)}
              </span>
            </div>
            <div className="flex items-center justify-end gap-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => router.push(`/dashboard/invoices/${invoice.id}`)}
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              <TableActions.RowActions
                onDelete={() => handleDeleteClick(invoice)}
                isDeleting={isDeleting && deleteItem?.id === invoice.id}
              />
            </div>
          </div>
        )}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Invoice"
        description={
          deleteItem ? (
            <>
              Are you sure you want to delete invoice{" "}
              <strong>{deleteItem.invoiceNumber}</strong>? This action cannot be
              undone.
            </>
          ) : (
            "Are you sure you want to delete this invoice?"
          )
        }
        onConfirm={handleConfirmDelete}
        isConfirming={isDeleting}
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
