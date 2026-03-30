"use client";
import { useState } from "react";
import {
  ChevronDown,
  X,
  Check,
  Clock,
  Send,
  Eye,
  DollarSign,
  FileText,
  Ban,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateInvoiceStatus } from "@/actions/invoices";
import { toast } from "sonner";

// Invoice Status enum based on your Prisma model
type InvoiceStatus =
  | "DRAFT"
  | "SENT"
  | "VIEWED"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

interface InvoiceStatusPopupProps {
  invoiceId: string;
  currentStatus: InvoiceStatus;
}

const statusConfig: Record<
  InvoiceStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }
> = {
  DRAFT: {
    label: "Draft",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    icon: FileText,
    description: "Invoice is being prepared",
  },
  SENT: {
    label: "Sent",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    icon: Send,
    description: "Invoice has been sent to client",
  },
  VIEWED: {
    label: "Viewed",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    icon: Eye,
    description: "Client has viewed the invoice",
  },
  PAID: {
    label: "Paid",
    color: "text-green-600",
    bgColor: "bg-green-100",
    icon: Check,
    description: "Payment has been received",
  },
  OVERDUE: {
    label: "Overdue",
    color: "text-red-600",
    bgColor: "bg-red-100",
    icon: Clock,
    description: "Payment is past due date",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    icon: Ban,
    description: "Invoice has been cancelled",
  },
};

export default function InvoiceStatusPopup({
  invoiceId,
  currentStatus,
}: InvoiceStatusPopupProps) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<InvoiceStatus>(currentStatus);

  const handleStatusUpdate = async () => {
    if (selectedStatus === currentStatus) {
      setOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      await updateInvoiceStatus(invoiceId, selectedStatus);
      setOpen(false);
      toast.success("Invoice Updated successfully");
    } catch (error) {
      console.error("Failed to update invoice status:", error);
      toast.error("Invoice failed to update");
      // You can add toast notification here
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setSelectedStatus(currentStatus);
    }
  };

  const currentConfig = statusConfig[currentStatus];
  const CurrentIcon = currentConfig.icon;
  const selectedConfig = statusConfig[selectedStatus];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors hover:opacity-80 ${currentConfig.color} ${currentConfig.bgColor}`}
        >
          <CurrentIcon className="h-4 w-4 mr-2" />
          Update Invoice Status
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${currentConfig.bgColor}`}>
              <CurrentIcon className={`h-5 w-5 ${currentConfig.color}`} />
            </div>
            <div>
              <DialogTitle>Update Invoice Status</DialogTitle>
              <DialogDescription>Invoice ID: {invoiceId}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status Display */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Current Status:
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentConfig.color} ${currentConfig.bgColor}`}
              >
                <CurrentIcon className="h-4 w-4 mr-2" />
                {currentConfig.label}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {currentConfig.description}
            </p>
          </div>

          {/* Status Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Select New Status:
            </label>
            <Select
              value={selectedStatus}
              onValueChange={(value: InvoiceStatus) => setSelectedStatus(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded ${selectedConfig.bgColor}`}>
                      {(() => {
                        const SelectedIcon = selectedConfig.icon;
                        return (
                          <SelectedIcon
                            className={`h-4 w-4 ${selectedConfig.color}`}
                          />
                        );
                      })()}
                    </div>
                    <span>{selectedConfig.label}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(statusConfig) as InvoiceStatus[]).map(
                  (status) => {
                    const config = statusConfig[status];
                    const StatusIcon = config.icon;
                    const isCurrent = status === currentStatus;

                    return (
                      <SelectItem
                        key={status}
                        value={status}
                        disabled={isCurrent}
                        className="flex items-center space-x-2"
                      >
                        <div className="flex items-center space-x-2 w-full">
                          <div className={`p-1 rounded ${config.bgColor}`}>
                            <StatusIcon className={`h-4 w-4 ${config.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {config.label}
                              </span>
                              {isCurrent && (
                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {config.description}
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  }
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Status Change Preview */}
          {selectedStatus !== currentStatus && (
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Changing to:</span>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedConfig.color} ${selectedConfig.bgColor}`}
                >
                  {(() => {
                    const SelectedIcon = selectedConfig.icon;
                    return <SelectedIcon className="h-3 w-3 mr-1" />;
                  })()}
                  {selectedConfig.label}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {selectedConfig.description}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStatusUpdate}
            disabled={isUpdating || selectedStatus === currentStatus}
          >
            {isUpdating ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Updating...</span>
              </div>
            ) : (
              "Update Status"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Example usage component
function ExampleUsage() {
  const [invoiceStatus, setInvoiceStatus] = useState<InvoiceStatus>("DRAFT");

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold">Invoice Status Management</h2>

      {/* Example Invoice Cards */}
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Invoice #INV-2025-001
              </h3>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Status:</span>
                <InvoiceStatusPopup
                  invoiceId="INV-2025-001"
                  currentStatus="DRAFT"
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">$1,250.00</p>
              <p className="text-sm text-gray-500">Due: Jan 15, 2025</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Invoice #INV-2025-002
              </h3>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Status:</span>
                <InvoiceStatusPopup
                  invoiceId="INV-2025-002"
                  currentStatus="SENT"
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">$875.50</p>
              <p className="text-sm text-gray-500">Due: Jan 20, 2025</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Invoice #INV-2025-003
              </h3>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Status:</span>
                <InvoiceStatusPopup
                  invoiceId="INV-2025-003"
                  currentStatus="PAID"
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">$2,100.00</p>
              <p className="text-sm text-green-600">Paid on Jan 10, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
