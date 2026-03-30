"use client";
export type CategoryWithDepartment = {
  id: number;
  name: string;
  slug: string;
  image: string;
  products_count?: number;
  banner: string | File | null;
  department: Department;
  department_id: number;
  created_at: string;
  updated_at: string;
};
export type Department = {
  id: number;
  name: string;
  categories_count?: number;
  slug: string;
  banner: string | File | null;
  created_at: string;
  updated_at: string;
};
import { useState } from "react";
import * as XLSX from "xlsx";
// import DataTable from '../ReUsableDataTable/DataTable';
import { formatDate } from "@/lib/utils";

import { format } from "date-fns";
import { toast } from "sonner";

import {
  Column,
  ConfirmationDialog,
  DataTable,
  TableActions,
} from "../ui/data-table";
import { useRouter } from "next/navigation";
export default function CategoryListing({
  categories,
  departments,
  title,
  subtitle,
}: {
  categories: CategoryWithDepartment[];
  departments: Department[];
  title: string;
  subtitle: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<CategoryWithDepartment | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryWithDepartment | null>(null);
  console.log(deleteItem);
  const columns: Column<CategoryWithDepartment>[] = [
    {
      accessorKey: "name",
      header: "Category Name",
      cell: (row) => {
        const cat = row;
        return (
          <div className="flex items-center gap-3">
            <img
              src={`/storage/${cat.image as string}`}
              alt={cat.name}
              className="h-10 w-10 rounded-md object-cover"
            />
            <span className="font-medium">{cat.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "department",
      header: "Department Name",
      cell: (row) => {
        const cat = row;
        return (
          <div className="">
            <span className="font-medium">{cat.department.name}</span>
          </div>
        );
      },
    },
    {
      header: "Date Added",
      accessorKey: (row) => formatDate(row.created_at),
    },
  ];

  const handleAddNew = () => {
    // Reset editing department when adding new
    setEditingCategory(null);
    setModalOpen(true);
  };

  // Export to Excel
  const handleExport = async (filteredProducts: Department[]) => {
    try {
      // Prepare data for export
      const exportData = filteredProducts.map((dep) => ({
        ID: dep.id,
        Name: dep.name,
        Slug: dep.slug,
        Banner: dep.banner,
        "Date Added": formatDate(dep.created_at),
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
  const handleEditClick = (category: CategoryWithDepartment) => {
    router.push(`/dashboard/admin/categories/edit/${category.id}`);
    // setEditingCategory(category);
    // setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  // Handle delete click
  const handleDeleteClick = (cat: CategoryWithDepartment) => {
    setDeleteItem(cat);
    setDeleteDialogOpen(true);
  };
  const handleConfirmDelete = () => {
    if (deleteItem) {
      setIsDeleting(true);
      const count = deleteItem.products_count ?? 0;
      if (count > 0) {
        toast.error("Delete Failed", {
          description: "This Category has associated Products",
        });
        setDeleteDialogOpen(false);
        setIsDeleting(false);
        return;
      }
      console.log("Deleting category with ID:", deleteItem.id);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <DataTable<CategoryWithDepartment>
        title={title}
        subtitle={subtitle}
        data={categories}
        columns={columns}
        keyField="id"
        isLoading={false} // With Suspense, we're guaranteed to have data
        onRefresh={() => console.log("refreshing")}
        actions={{
          onAdd: handleAddNew,
          onExport: handleExport,
        }}
        filters={{
          searchFields: ["name"],
          enableDateFilter: true,
          getItemDate: (item) => item.created_at,
        }}
        renderRowActions={(item) => (
          <TableActions.RowActions
            onEdit={() => handleEditClick(item)}
            onDelete={() => handleDeleteClick(item)}
            // isDeleting={isDeleting}
          />
        )}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Category"
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
