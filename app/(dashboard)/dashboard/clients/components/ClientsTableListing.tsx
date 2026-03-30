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

import {
  Eye,
  Building2,
  Phone,
  MapPin,
  Mail,
  DollarSign,
  FileText,
  Plus,
} from "lucide-react";
import { ClientData, deleteClient } from "@/actions/client";

export default function ClientsTableListing({
  clients,
  title,
  subtitle,
  currency,
}: {
  clients: ClientData[];
  title: string;
  subtitle: string;
  currency: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<ClientData | null>(null);

  // Helper function to get client status
  const getClientStatus = (client: ClientData) => {
    if (!client.isActive)
      return { label: "Inactive", variant: "secondary" as const };
    if (client.totalInvoices === 0)
      return { label: "New", variant: "info" as const };
    if (client.unpaidAmount > 0)
      return { label: "Has Outstanding", variant: "warning" as const };
    return { label: "Active", variant: "success" as const };
  };

  const columns: Column<ClientData>[] = [
    {
      accessorKey: "companyName",
      header: "Client Info",
      cell: (row) => {
        const client = row;
        const status = getClientStatus(client);

        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{client.companyName}</span>
              <span className="text-sm text-gray-500">
                {client.contactPerson}
              </span>
              <Badge variant={status.variant} className="w-fit mt-1">
                {status.label}
              </Badge>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "location",
      header: "Contact Details",
      cell: (row) => {
        const client = row;
        return (
          <div className="space-y-1">
            {client.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-3 h-3" />
                <span>{client.location}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-3 h-3" />
                <span>{client.phone}</span>
              </div>
            )}
            {client.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-3 h-3" />
                <span>{client.email}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "totalInvoices",
      header: "Invoices",
      cell: (row) => {
        const client = row;
        return (
          <div className="text-center">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="font-semibold">{client.totalInvoices}</span>
            </div>
            <span className="text-xs text-gray-500">total invoices</span>
          </div>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Revenue",
      cell: (row) => {
        const client = row;
        return (
          <div className="text-right">
            <div className="font-semibold text-lg">
              {formatCurrency(client.totalAmount, currency)}
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div className="text-green-600">
                Paid: {formatCurrency(client.paidAmount, currency)}
              </div>
              {client.unpaidAmount > 0 && (
                <div className="text-orange-600">
                  Unpaid: {formatCurrency(client.unpaidAmount, currency)}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    // {
    //   accessorKey: "createdAt",
    //   header: "Date Added",
    //   cell: (row) => {
    //     const client = row;
    //     return (
    //       <div className="text-sm">
    //         <div>{formatISODate(client.createdAt)}</div>
    //         <div className="text-gray-500">
    //           {format(client.createdAt, "h:mm a")}
    //         </div>
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: "id",
      header: "Actions",
      cell: (row) => {
        const client = row;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/clients/${client.id}`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              <span>View Details</span>
            </Button>
          </div>
        );
      },
    },
  ];

  const handleAddNew = () => {
    router.push("/dashboard/clients/new");
  };

  // Export to Excel
  const handleExport = async (filteredClients: ClientData[]) => {
    try {
      // Prepare data for export
      const exportData = filteredClients.map((client) => ({
        "Company Name": client.companyName,
        "Contact Person": client.contactPerson,
        Location: client.location || "",
        Phone: client.phone || "",
        Email: client.email || "",
        "Total Invoices": client.totalInvoices,
        "Total Revenue": client.totalAmount,
        "Paid Amount": client.paidAmount,
        "Unpaid Amount": client.unpaidAmount,
        Status: client.isActive ? "Active" : "Inactive",
        "Date Added": format(client.createdAt, "yyyy-MM-dd"),
      }));

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");

      // Generate filename with current date
      const fileName = `Clients_${format(new Date(), "yyyy-MM-dd")}.xlsx`;

      // Export to file
      XLSX.writeFile(workbook, fileName);

      toast.success("Export successful", {
        description: `Clients exported to ${fileName}`,
      });
    } catch (error) {
      toast.error("Export failed", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  // Handle edit click
  const handleEditClick = (client: ClientData) => {
    // router.push(`/dashboard/clients/${client.id}/edit`);
    toast.success("Customer editing is coming soon");
  };

  // Handle delete click
  const handleDeleteClick = (client: ClientData) => {
    setDeleteItem(client);
    setDeleteDialogOpen(true);
    // toast.error("Customer Delete is not yet supported");
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;

    setIsDeleting(true);
    try {
      // toast.success("Customer Delete is coming soon");
      const result = await deleteClient(deleteItem.id);
      if (result.success) {
        toast.success("Client deleted successfully");
        setDeleteDialogOpen(false);
        setDeleteItem(null);
      } else {
        toast.error(result.error || "Failed to delete client");
      }
    } catch (error) {
      toast.error("Failed to delete client");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <DataTable<ClientData>
        title={title}
        subtitle={subtitle}
        data={clients}
        columns={columns}
        keyField="id"
        isLoading={false}
        onRefresh={() => window.location.reload()}
        actions={{
          onAdd: handleAddNew,
          onExport: handleExport,
        }}
        filters={{
          searchFields: ["companyName", "contactPerson", "phone", "email"],
          enableDateFilter: true,
          getItemDate: (item) => item.createdAt,
        }}
        renderRowActions={(item) => (
          <TableActions.RowActions
            // onEdit={() => handleEditClick(item)}
            onDelete={() => handleDeleteClick(item)}
            isDeleting={isDeleting && deleteItem?.id === item.id}
          />
        )}
        renderMobileCard={(client) => {
          const status = getClientStatus(client);
          return (
            <div className="border border-gray-200 rounded-lg p-3 bg-white">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-sm font-semibold truncate">{client.companyName}</span>
                  </div>
                  <div className="text-xs text-gray-500 ml-6">{client.contactPerson}</div>
                </div>
                <Badge variant={status.variant} className="shrink-0 text-xs">
                  {status.label}
                </Badge>
              </div>
              {(client.phone || client.location) && (
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
                  {client.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />{client.phone}
                    </span>
                  )}
                  {client.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{client.location}
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  {client.totalInvoices} invoice{client.totalInvoices !== 1 ? "s" : ""}
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{formatCurrency(client.totalAmount, currency)}</div>
                  {client.unpaidAmount > 0 && (
                    <div className="text-xs text-orange-600">Unpaid: {formatCurrency(client.unpaidAmount, currency)}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => router.push(`/dashboard/clients/${client.id}`)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <TableActions.RowActions
                  onDelete={() => handleDeleteClick(client)}
                  isDeleting={isDeleting && deleteItem?.id === client.id}
                />
              </div>
            </div>
          );
        }}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Client"
        description={
          deleteItem ? (
            <>
              Are you sure you want to delete{" "}
              <strong>{deleteItem.companyName}</strong>? This action cannot be
              undone.
              {deleteItem.totalInvoices > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                  <strong>Warning:</strong> This client has{" "}
                  {deleteItem.totalInvoices} invoice(s). You cannot delete a
                  client with existing invoices.
                </div>
              )}
            </>
          ) : (
            "Are you sure you want to delete this client?"
          )
        }
        onConfirm={handleConfirmDelete}
        isConfirming={isDeleting}
        confirmLabel="Delete"
        variant="destructive"
        // disabled={
        //   deleteItem?.totalInvoices ? deleteItem.totalInvoices > 0 : false
        // }
      />
    </div>
  );
}
