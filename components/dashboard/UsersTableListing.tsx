"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
import { formatISODate } from "@/lib/utils";

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

import { Eye } from "lucide-react";
import { User } from "@prisma/client";
// type User = {
//   name: string;
//   id: string;
//   phone: string | null;
//   email: string;
//   image: string | null;
//   totalInvoicesCreated: number | null;
//   invoiceCount: string | null;
//   createdAt: Date;
// };
export default function UsersTableListing({
  users,
  title,
  subtitle,
}: {
  users: User[];
  title: string;
  subtitle: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // console.log(deleteItem);
  const columns: Column<User>[] = [
    {
      accessorKey: "name",
      header: "User Info",
      cell: (row) => {
        const user = row;
        const image = user.image || "/placeholder-avatar.png";
        return (
          <div className="flex items-center gap-3">
            <img
              src={`${image}`}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="font-medium">{user.name}</span>
              <span className="text-sm text-gray-500">{user.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "invoiceCount",
      header: "Invoices",
      cell: (row) => {
        const user = row;
        return (
          <div className="">
            <span className="font-medium">
              {user.totalInvoicesCreated || "N/A"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date Added",
      cell: (row) => {
        const user = row;
        return (
          <div className="">
            <span>{formatISODate(user.createdAt)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "id",
      header: "Actions",
      cell: (row) => {
        const user = row;
        return (
          <div className="">
            <Button
              variant="ghost"
              size="sm"
              href={`/dashboard/users/${user.id}`}
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
    setModalOpen(true);
  };

  // Export to Excel
  const handleExport = async (filteredUsers: User[]) => {
    try {
      // Prepare data for export
      const exportData = filteredUsers.map((user) => ({
        ID: user.id,
        Name: user.name,
        Image: user.image,
        "Date Added": formatISODate(user.createdAt),
      }));

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

      // Generate filename with current date
      const fileName = `Products_${format(new Date(), "yyyy-MM-dd")}.xlsx`;

      // Export to file
      XLSX.writeFile(workbook, fileName);

      toast.success("Export successful", {
        description: `Products exported to ${fileName}`,
      });
    } catch (error) {
      toast.error("Export failed", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      // setIsExporting(false);
    }
  };

  // Handle edit click
  const handleEditClick = (course: User) => {
    router.push(`/dashboard/courses/${course.id}/edit`);
    // setEditingCategory(category);
    // setModalOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (course: User) => {
    setDeleteItem(course);
    setDeleteDialogOpen(true);
  };
  const handleConfirmDelete = () => {
    console.log("object");
  };

  return (
    <div className="container mx-auto py-6">
      <DataTable<User>
        title={title}
        subtitle={subtitle}
        data={users}
        columns={columns}
        keyField="id"
        isLoading={false}
        onRefresh={() => console.log("refreshing")}
        actions={{
          onAdd: handleAddNew,
          onExport: handleExport,
        }}
        filters={{
          searchFields: ["name"],
          enableDateFilter: true,
          getItemDate: (item) => item.createdAt,
        }}
        renderRowActions={(item) => (
          <TableActions.RowActions
            onEdit={() => handleEditClick(item)}
            onDelete={() => handleDeleteClick(item)}
          />
        )}
        renderMobileCard={(user) => (
          <div className="border border-gray-200 rounded-lg p-3 bg-white">
            <div className="flex items-center gap-3">
              <img
                src={user.image || "/placeholder-avatar.png"}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{user.name}</div>
                <div className="text-xs text-gray-500 truncate">{user.email}</div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <div className="flex gap-4 text-xs text-gray-500">
                <span>{user.totalInvoicesCreated || 0} invoices</span>
                <span>{formatISODate(user.createdAt)}</span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => router.push(`/dashboard/users/${user.id}`)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <TableActions.RowActions
                  onEdit={() => handleEditClick(user)}
                  onDelete={() => handleDeleteClick(user)}
                />
              </div>
            </div>
          </div>
        )}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Course"
        description={
          deleteItem ? (
            <>
              Are you sure you want to delete <strong>{deleteItem.name}</strong>
              ? This action cannot be undone.
            </>
          ) : (
            "Are you sure you want to delete this Department?"
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
