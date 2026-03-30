"use client";
import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { createInvoice, generateInvoiceNumber } from "@/actions/create-invoice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { generateCustomerId } from "../helpers/getCustomerId";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import LogoUploader from "@/components/FormInputs/LogoUploader";
import { BrandProfile } from "@/actions/brand";
import { cn } from "@/lib/utils";
import { sendCustomerInvoice } from "@/actions/mails";

// Define interfaces matching schema
interface InvoiceItem {
  quantity: number;
  description: string;
  unitPrice: number;
  taxable: boolean;
  amount: number;
}

export type DocumentType = "invoice" | "quotation";

export interface InvoiceData {
  // Document Type
  documentType: DocumentType;

  // Brand/Company Info (matching Brand model)
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  logoUrl: string;
  contactInfo: string;
  paymentInfo: string;
  thankYouMessage: string;
  brandColor: string;

  // Client Info (matching Client model)
  billToContactPerson: string;
  billToCompanyName: string;
  billToLocation: string;
  billToPhone: string;

  // Invoice Details (matching Invoice model)
  invoiceNumber: string;
  invoiceDate: string;
  invoiceDueDate: string;
  customerID: string;
  preparedBy: string;

  // Financial Data
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  salesTax: number;
  other: number;
  total: number;
}

// Updated placeholder data with schema-matching fields
const initialData: InvoiceData = {
  documentType: "invoice",
  companyName: "DESISHUB",
  companyAddress: "DESISHUB",
  companyPhone: "0762063160 | 0756384580",
  companyEmail: "info@desishub.com",
  brandColor: "#000000",
  logoUrl: "https://utfs.io/f/xfyx7VpiVmTbx8SIrtpiVmTbZrh9RFQWYcvt2JxzPpKfwnL1",
  contactInfo:
    "If you have any questions concerning this Invoice, please contact: Call or Whatsapp: 0762 063 160 | 0756 384 580",
  paymentInfo:
    "All dues are Payable to Desishub through Cash or MTN MOMO 0762 063 160",
  thankYouMessage: "Thank you for your business!",

  billToContactPerson: "Mary Awalith",
  billToCompanyName: "CODELABS CO. LTD",
  billToLocation: "South Sudan",
  billToPhone: "922031601",
  customerID: "CODM-742",

  invoiceDate: "2025-05-22",
  invoiceNumber: "INV-69062-1875",
  preparedBy: "JB",
  invoiceDueDate: "2025-05-22",

  items: [
    {
      quantity: 1,
      description:
        "Payment for Backend Development of a Shipment and Tracking Web application",
      unitPrice: 300.0,
      taxable: false,
      amount: 300.0,
    },
    { quantity: 0, description: "", unitPrice: 0, taxable: false, amount: 0 },
    { quantity: 0, description: "", unitPrice: 0, taxable: false, amount: 0 },
  ],
  subtotal: 300.0,
  taxRate: 10,
  salesTax: 30,
  other: 4,
  total: 334.0,
};

// --- Invoice Preview Component (unchanged) ---
const InvoicePreview: React.FC<{
  invoiceData: InvoiceData;
  currency: string;
}> = ({ invoiceData, currency }) => {
  const bg = `bg-[${invoiceData.brandColor}]`;
  return (
    <div>
      {/* Header */}
      <div
        style={{ backgroundColor: invoiceData.brandColor }}
        className="mb-4 md:mb-8 p-4 md:p-6 text-white flex justify-between items-center rounded-t-lg"
      >
        <div>
          {invoiceData.logoUrl ? (
            <img
              src={invoiceData.logoUrl}
              alt="Company Logo"
              className="h-16"
            />
          ) : (
            <div className="text-xl md:text-4xl font-bold">{invoiceData.companyName}</div>
          )}
          {/* <div className="text-sm">Leveraging Technology</div> */}
        </div>
        <div className="text-2xl md:text-5xl font-bold text-right">{invoiceData.documentType === "quotation" ? "QUOTATION" : "INVOICE"}</div>
      </div>

      {/* Company & Invoice Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-4 md:mb-8 px-4 md:px-8">
        <div>
          <h3 className="text-sm md:text-lg font-semibold mb-2 text-gray-700">
            Company Address
          </h3>
          <p className="text-gray-600 text-xs md:text-base">{invoiceData.companyName}</p>
          <p className="text-gray-600 text-xs md:text-base">Phone: {invoiceData.companyPhone}</p>
          <p className="text-gray-600 text-xs md:text-base">Email: {invoiceData.companyEmail}</p>
        </div>
        <div className="text-right">
          <p>
            <span className="font-semibold text-gray-700">Date:</span>{" "}
            <span className="text-gray-600">{invoiceData.invoiceDate}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-700">{invoiceData.documentType === "quotation" ? "Quotation #:" : "Invoice #:"}</span>{" "}
            <span className="text-gray-600">{invoiceData.invoiceNumber}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-700">Customer ID:</span>{" "}
            <span className="text-gray-600">{invoiceData.customerID}</span>
          </p>
        </div>
      </div>

      {/* Bill To & Prepared By */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-4 md:mb-8 px-4 md:px-8">
        <div>
          <h3 className="text-sm md:text-lg font-semibold mb-2 text-gray-700">Bill To</h3>
          <p className="text-gray-600 text-xs md:text-base">
            Contact Person: {invoiceData.billToContactPerson}
          </p>
          <p className="text-gray-600 text-xs md:text-base">
            Company Name: {invoiceData.billToCompanyName}
          </p>
          <p className="text-gray-600 text-xs md:text-base">
            Location: {invoiceData.billToLocation}
          </p>
          <p className="text-gray-600 text-xs md:text-base">Phone: {invoiceData.billToPhone}</p>
        </div>
        <div className="text-right">
          <p>
            <span className="font-semibold text-gray-700">Prepared by:</span>{" "}
            <span className="text-gray-600">{invoiceData.preparedBy}</span>
          </p>
        </div>
      </div>

      {/* Invoice Due Date */}
      <div className="mb-4 md:mb-8 px-4 md:px-8">
        <p>
          <span className="font-semibold text-gray-700">{invoiceData.documentType === "quotation" ? "Quotation Due Date:" : "Invoice Due Date:"}</span>{" "}
          <span className="text-gray-600">{invoiceData.invoiceDueDate}</span>
        </p>
      </div>

      {/* Items Table */}
      <div className="mb-4 md:mb-8 px-4 md:px-8">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr
              style={{ backgroundColor: invoiceData.brandColor }}
              className=" text-white"
            >
              <th className="p-3 border border-gray-300 text-left text-sm font-semibold">
                Quantity
              </th>
              <th className="p-3 border border-gray-300 text-left text-sm font-semibold">
                Description
              </th>
              <th className="p-3 border border-gray-300 text-right text-sm font-semibold">
                Unit Price
              </th>
              <th className="p-3 border border-gray-300 text-center text-sm font-semibold">
                Taxable?
              </th>
              <th className="p-3 border border-gray-300 text-right text-sm font-semibold">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr
                key={index}
                className={`border-b border-gray-200 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="p-3 border-l border-r border-gray-300 text-gray-700 text-center">
                  {item.quantity || ""}
                </td>
                <td className="p-3 border-l border-r border-gray-300 text-gray-700">
                  {item.description}
                </td>
                <td className="p-3 border-l border-r border-gray-300 text-gray-700 text-right">
                  {item.unitPrice
                    ? `${currency}${item.unitPrice.toLocaleString("en-US", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}`
                    : ""}
                </td>
                <td className="p-3 border-l border-r border-gray-300 text-gray-700 text-center">
                  {item.taxable ? "Yes" : item.quantity > 0 ? "No" : ""}
                </td>
                <td className="p-3 border-l border-r border-gray-300 text-gray-700 text-right">
                  {item.amount
                    ? `${currency}${item.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}`
                    : ""}
                </td>
              </tr>
            ))}
            <tr className="border-b border-gray-300">
              <td colSpan={5} className="p-0"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="flex justify-end mb-8 px-8">
        <div className="w-1/3">
          <div className="flex justify-between py-2 border-b border-gray-300">
            <span className="text-gray-700">Subtotal</span>
            <span className="text-gray-700">
              {currency}
              {invoiceData.subtotal.toLocaleString("en-US", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-300">
            <span className="text-gray-700">Tax Rate</span>
            <span className="text-gray-700">
              {invoiceData.taxRate ? `${invoiceData.taxRate}%` : "-"}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-300">
            <span className="text-gray-700">Sales Tax</span>
            <span className="text-gray-700">
              {invoiceData.salesTax
                ? `${currency}${invoiceData.salesTax.toLocaleString("en-US", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}`
                : "-"}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-300">
            <span className="text-gray-700">Other</span>
            <span className="text-gray-700">
              {invoiceData.other
                ? `${currency}${invoiceData.other.toLocaleString("en-US", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}`
                : "-"}
            </span>
          </div>
          <div
            style={{ backgroundColor: invoiceData.brandColor }}
            className="flex justify-between py-2 font-bold  text-white px-3 mt-2 rounded"
          >
            <span>TOTAL</span>
            <span>
              {currency}
              {invoiceData.total.toLocaleString("en-US", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs md:text-sm text-gray-600 px-4 md:px-8 pb-4 md:pb-8 border-t border-gray-200 pt-4 md:pt-6">
        <p className="mb-2">{invoiceData.contactInfo}</p>
        <p className="mb-4">{invoiceData.paymentInfo}</p>
        <p className="text-lg font-semibold text-gray-800">
          {invoiceData.thankYouMessage}
        </p>
      </div>
    </div>
  );
};

// --- Updated Invoice Form Component ---
const InvoiceForm: React.FC<{
  initialData: InvoiceData;
  editingId?: string;
  onSubmit: (data: InvoiceData) => void;
  currency: string;
}> = ({ initialData, editingId, onSubmit, currency }) => {
  const [formData, setFormData] = useState<InvoiceData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData.logoUrl);
  console.log(imageUrl);
  const router = useRouter();

  // Generate invoice number on component mount if not already set
  useEffect(() => {
    const initializeInvoiceNumber = async () => {
      if (
        !formData.invoiceNumber ||
        formData.invoiceNumber === initialData.invoiceNumber
      ) {
        try {
          const generatedInvoiceNumber = await generateInvoiceNumber();
          setFormData((prev) => ({
            ...prev,
            invoiceNumber: editingId
              ? initialData.invoiceNumber
              : generatedInvoiceNumber,
          }));
        } catch (error) {
          console.error("Failed to generate invoice number:", error);
          // Fallback to client-side generation
          const fallbackNumber = `INV-${Date.now()}`;
          setFormData((prev) => ({
            ...prev,
            invoiceNumber: editingId
              ? initialData.invoiceNumber
              : fallbackNumber,
          }));
        }
      }
    };

    initializeInvoiceNumber();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    const updatedItems = [...formData.items];
    const itemKey = name as keyof InvoiceItem;

    let parsedValue: string | number | boolean = value;
    if (type === "number") {
      parsedValue = parseFloat(value) || 0;
    }

    if (itemKey in updatedItems[index]) {
      (updatedItems[index] as any)[itemKey] = parsedValue;

      // Recalculate amount if quantity or unitPrice changes
      if (itemKey === "quantity" || itemKey === "unitPrice") {
        updatedItems[index].amount =
          updatedItems[index].quantity * updatedItems[index].unitPrice;
      }

      setFormData((prev) => ({ ...prev, items: updatedItems }));
      recalculateTotals(updatedItems);
    }
  };

  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      quantity: 0,
      description: "",
      unitPrice: 0,
      taxable: false,
      amount: 0,
    };

    const updatedItems = [...formData.items, newItem];
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const removeInvoiceItem = (index: number) => {
    if (formData.items.length <= 1) return;

    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
    recalculateTotals(updatedItems);
  };

  const recalculateTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxRate = formData.taxRate || 0;
    const salesTax =
      taxRate > 0 ? subtotal * (taxRate / 100) : formData.salesTax || 0;
    const other = formData.other || 0;
    const total = subtotal + salesTax + other;

    setFormData((prev) => ({
      ...prev,
      subtotal,
      salesTax,
      total,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      formData.logoUrl = imageUrl;
      formData.customerID = generateCustomerId(formData.billToCompanyName);
      console.log(formData);
      const result = await createInvoice(formData);
      if (result.success) {
        toast.success("Invoice created successfully!");
        onSubmit(formData);
        router.push("/dashboard/invoices");
      } else {
        toast.error(result.error || "Failed to create invoice");
      }
    } catch (error) {
      console.error("Error submitting invoice:", error);
      toast.error("Failed to create invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to generate invoice number (client-side fallback)
  const handleGenerateInvoiceNumber = async () => {
    try {
      const generatedInvoiceNumber = await generateInvoiceNumber();
      setFormData((prev) => ({
        ...prev,
        invoiceNumber: generatedInvoiceNumber,
      }));
    } catch (error) {
      const fallbackNumber = `INV-${Date.now()}`;
      setFormData((prev) => ({
        ...prev,
        invoiceNumber: fallbackNumber,
      }));
    }
  };

  // Rest of the form JSX remains exactly the same...
  return (
    <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg md:text-2xl font-semibold">New {formData.documentType === "quotation" ? "Quotation" : "Invoice"}</h2>
        <Link
          className={buttonVariants({
            variant: "outline",
            size: "sm",
          })}
          href="/dashboard/invoices"
        >
          <span className="hidden sm:inline">Close and Back to Invoices</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </div>
      {/* Company Info Section */}
      <fieldset className="border p-3 md:p-4 rounded">
        <legend className="text-sm md:text-lg font-medium px-2">Company Info</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700"
            >
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              id="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="companyAddress"
              className="block text-sm font-medium text-gray-700"
            >
              Company Address
            </label>
            <input
              type="text"
              name="companyAddress"
              id="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="companyPhone"
              className="block text-sm font-medium text-gray-700"
            >
              Company Phone
            </label>
            <input
              type="text"
              name="companyPhone"
              id="companyPhone"
              value={formData.companyPhone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="companyEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Company Email
            </label>
            <input
              type="email"
              name="companyEmail"
              id="companyEmail"
              value={formData.companyEmail}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="logoUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Logo (Optional)
            </label>
            <LogoUploader
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              endpoint="logoImage"
            />
          </div>
        </div>
      </fieldset>

      {/* Bill To Section */}
      <fieldset className="border p-3 md:p-4 rounded">
        <legend className="text-sm md:text-lg font-medium px-2">Bill To</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="billToContactPerson"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Person
            </label>
            <input
              type="text"
              name="billToContactPerson"
              id="billToContactPerson"
              value={formData.billToContactPerson}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="billToCompanyName"
              className="block text-sm font-medium text-gray-700"
            >
              Company Name
            </label>
            <input
              type="text"
              name="billToCompanyName"
              id="billToCompanyName"
              value={formData.billToCompanyName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="billToLocation"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              type="text"
              name="billToLocation"
              id="billToLocation"
              value={formData.billToLocation}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="billToPhone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              type="text"
              name="billToPhone"
              id="billToPhone"
              value={formData.billToPhone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
            />
          </div>
        </div>
      </fieldset>

      {/* Invoice Details Section */}
      <fieldset className="border p-3 md:p-4 rounded">
        <legend className="text-sm md:text-lg font-medium px-2">Document Details</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="documentType"
              className="block text-sm font-medium text-gray-700"
            >
              Document Type
            </label>
            <select
              name="documentType"
              id="documentType"
              value={formData.documentType}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
            >
              <option value="invoice">Invoice</option>
              <option value="quotation">Quotation</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="invoiceNumber"
              className="block text-sm font-medium text-gray-700"
            >
              {formData.documentType === "quotation" ? "Quotation #" : "Invoice #"}
              <button
                type="button"
                onClick={handleGenerateInvoiceNumber}
                className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Generate
              </button>
            </label>
            <input
              type="text"
              name="invoiceNumber"
              id="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="invoiceDate"
              className="block text-sm font-medium text-gray-700"
            >
              Invoice Date
            </label>
            <input
              type="date"
              name="invoiceDate"
              id="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="invoiceDueDate"
              className="block text-sm font-medium text-gray-700"
            >
              Due Date
            </label>
            <input
              type="date"
              name="invoiceDueDate"
              id="invoiceDueDate"
              value={formData.invoiceDueDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="preparedBy"
              className="block text-sm font-medium text-gray-700"
            >
              Prepared By
            </label>
            <input
              type="text"
              name="preparedBy"
              id="preparedBy"
              value={formData.preparedBy}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
            />
          </div>
        </div>
      </fieldset>

      {/* Items Section */}
      <fieldset className="border p-3 md:p-4 rounded">
        <legend className="text-sm md:text-lg font-medium px-2">
          Items
          <button
            type="button"
            onClick={addInvoiceItem}
            className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
          >
            Add Item
          </button>
        </legend>
        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-3 md:mb-2 items-center">
            <input
              type="number"
              name="quantity"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, e)}
              className="border border-gray-300 rounded-md shadow-sm p-2"
              min="0"
              step="0.01"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleItemChange(index, e)}
              className="col-span-2 md:col-span-2 border border-gray-300 rounded-md shadow-sm p-2 text-sm"
            />
            <input
              type="number"
              name="unitPrice"
              placeholder="Unit Price"
              value={item.unitPrice}
              onChange={(e) => handleItemChange(index, e)}
              className="border border-gray-300 rounded-md shadow-sm p-2"
              min="0"
              step="0.01"
            />
            <span className="text-right p-2">
              {currency}
              {item.amount.toLocaleString("en-US", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
            </span>
            <button
              type="button"
              onClick={() => removeInvoiceItem(index)}
              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              disabled={formData.items.length <= 1}
            >
              Remove
            </button>
          </div>
        ))}
      </fieldset>

      {/* Tax and Totals Section */}
      <fieldset className="border p-3 md:p-4 rounded">
        <legend className="text-sm md:text-lg font-medium px-2">
          Tax and Additional Charges
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="taxRate"
              className="block text-sm font-medium text-gray-700"
            >
              Tax Rate (%)
            </label>
            <input
              type="number"
              name="taxRate"
              id="taxRate"
              value={formData.taxRate || ""}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                setFormData((prev) => {
                  const newSalesTax = (prev.subtotal * value) / 100;
                  const newTotal =
                    prev.subtotal + newSalesTax + (prev.other || 0);
                  return {
                    ...prev,
                    taxRate: value,
                    salesTax: newSalesTax,
                    total: newTotal,
                  };
                });
              }}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label
              htmlFor="salesTax"
              className="block text-sm font-medium text-gray-700"
            >
              Sales Tax ({currency})
            </label>
            <input
              type="number"
              name="salesTax"
              id="salesTax"
              value={formData.salesTax || ""}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                setFormData((prev) => {
                  const newTotal = prev.subtotal + value + (prev.other || 0);
                  return { ...prev, salesTax: value, total: newTotal };
                });
              }}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label
              htmlFor="other"
              className="block text-sm font-medium text-gray-700"
            >
              Other Charges ({currency})
            </label>
            <input
              type="number"
              name="other"
              id="other"
              value={formData.other || ""}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                setFormData((prev) => {
                  const newTotal = prev.subtotal + (prev.salesTax || 0) + value;
                  return { ...prev, other: value, total: newTotal };
                });
              }}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">Subtotal:</span>
              <span>
                {currency}
                {formData.subtotal.toLocaleString("en-US", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Sales Tax:</span>
              <span>
                {currency}
                {(formData.salesTax || 0).toLocaleString("en-US", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Other:</span>
              <span>
                {currency}
                {(formData.other || 0).toLocaleString("en-US", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span>TOTAL:</span>
              <span>
                {currency}
                {formData.total.toLocaleString("en-US", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
              </span>
            </div>
          </div>
        </div>
      </fieldset>

      {/* Footer Info Section */}
      <fieldset className="border p-3 md:p-4 rounded">
        <legend className="text-sm md:text-lg font-medium px-2">Footer Info</legend>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="contactInfo"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Info
            </label>
            <textarea
              name="contactInfo"
              id="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              rows={2}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="paymentInfo"
              className="block text-sm font-medium text-gray-700"
            >
              Payment Info
            </label>
            <textarea
              name="paymentInfo"
              id="paymentInfo"
              value={formData.paymentInfo}
              onChange={handleChange}
              rows={2}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="thankYouMessage"
              className="block text-sm font-medium text-gray-700"
            >
              Thank You Message
            </label>
            <input
              type="text"
              name="thankYouMessage"
              id="thankYouMessage"
              value={formData.thankYouMessage}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
            />
          </div>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Creating Invoice..." : "Save Invoice"}
      </button>
    </form>
  );
};

// --- Send Mail Popup Component ---
const SendMailPopup: React.FC<{
  onClose: () => void;
  onSend: (emails: string) => void;
}> = ({ onClose, onSend }) => {
  const [emails, setEmails] = useState("");

  const handleSend = () => {
    onSend(emails);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-[999]">
      <div className="m-12 bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">Send Invoice via Email</h3>
        <textarea
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          placeholder="Enter email addresses, separated by commas"
          rows={3}
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// --- PDF Document Component ---
const styles = StyleSheet.create({
  page: { flexDirection: "column", backgroundColor: "#FFFFFF", padding: 30 },
  logo: {
    width: 150, // Scaled down proportionally
    height: 52.5, // 150 * (350/1000) = 52.5
    objectFit: "contain",
  },
  logoContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    maxWidth: "60%", // Prevent logo from taking too much space
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#000000",
    color: "#FFFFFF",
    padding: 20,
    marginBottom: 20,
  },
  headerText: { fontSize: 12 },
  invoiceTitle: { fontSize: 30, fontWeight: "bold" },
  section: { marginBottom: 15, fontSize: 10 },
  grid: { flexDirection: "row", justifyContent: "space-between" },
  col: { width: "48%" },
  h3: { fontSize: 12, fontWeight: "bold", marginBottom: 5 },
  text: { marginBottom: 3 },
  textRight: { textAlign: "right" },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
  },
  tableHeader: { backgroundColor: "#000000", color: "#FFFFFF" },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 9,
    fontWeight: "bold",
  },
  tableColDescHeader: {
    width: "40%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 9,
    fontWeight: "bold",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 9,
  },
  tableColDesc: {
    width: "40%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 9,
  },
  tableCell: { textAlign: "right" },
  tableCellCenter: { textAlign: "center" },
  totalsSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
    fontSize: 10,
  },
  totalsBox: { width: "35%" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
  },
  totalLabel: {},
  totalValue: {},
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    backgroundColor: "#000000",
    color: "#FFFFFF",
    marginTop: 5,
  },
  grandTotalLabel: { fontWeight: "bold" },
  grandTotalValue: { fontWeight: "bold" },
  footer: {
    fontSize: 9,
    color: "#555555",
    borderTopColor: "#cccccc",
    borderTopWidth: 1,
    paddingTop: 10,
  },
  footerText: { marginBottom: 5 },
  thankYou: { fontSize: 12, fontWeight: "bold", marginTop: 10 },
});

const InvoicePDF: React.FC<{ invoiceData: InvoiceData; currency: string; logoBase64?: string | null }> = ({
  invoiceData,
  currency,
  logoBase64,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: invoiceData.brandColor,
          color: "#FFFFFF",
          padding: 20,
          marginBottom: 20,
        }}
      >
        <View style={styles.logoContainer}>
          {(logoBase64 || invoiceData.logoUrl) ? (
            <Image style={styles.logo} src={logoBase64 || invoiceData.logoUrl} />
          ) : (
            <View>
              <Text style={styles.headerText}>{invoiceData.companyName}</Text>
              <Text style={styles.headerText}>Leveraging Technology</Text>
            </View>
          )}
        </View>
        <Text style={styles.invoiceTitle}>{invoiceData.documentType === "quotation" ? "QUOTATION" : "INVOICE"}</Text>
      </View>

      {/* Company & Invoice Details */}
      <View style={[styles.section, styles.grid]}>
        <View style={styles.col}>
          <Text style={styles.h3}>Company Address</Text>
          <Text style={styles.text}>{invoiceData.companyName}</Text>
          <Text style={styles.text}>Phone: {invoiceData.companyPhone}</Text>
          <Text style={styles.text}>Email: {invoiceData.companyEmail}</Text>
        </View>
        <View style={[styles.col, styles.textRight]}>
          <Text style={styles.text}>Date: {invoiceData.invoiceDate}</Text>
          <Text style={styles.text}>
            {invoiceData.documentType === "quotation" ? "Quotation #:" : "Invoice #:"} {invoiceData.invoiceNumber}
          </Text>
          <Text style={styles.text}>Customer ID: {invoiceData.customerID}</Text>
        </View>
      </View>

      {/* Bill To & Prepared By */}
      <View style={[styles.section, styles.grid]}>
        <View style={styles.col}>
          <Text style={styles.h3}>Bill To</Text>
          <Text style={styles.text}>
            Contact Person: {invoiceData.billToContactPerson}
          </Text>
          <Text style={styles.text}>
            Company Name: {invoiceData.billToCompanyName}
          </Text>
          <Text style={styles.text}>
            Location: {invoiceData.billToLocation}
          </Text>
          <Text style={styles.text}>Phone: {invoiceData.billToPhone}</Text>
        </View>
        <View style={[styles.col, styles.textRight]}>
          <Text style={styles.text}>Prepared by: {invoiceData.preparedBy}</Text>
        </View>
      </View>

      {/* Invoice Due Date */}
      <View style={styles.section}>
        <Text style={styles.text}>
          {invoiceData.documentType === "quotation" ? "Quotation Due Date:" : "Invoice Due Date:"} {invoiceData.invoiceDueDate}
        </Text>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <View
          style={[
            styles.tableRow,
            { backgroundColor: invoiceData.brandColor, color: "#FFFFFF" },
          ]}
        >
          <View style={styles.tableColHeader}>
            <Text>Quantity</Text>
          </View>
          <View style={styles.tableColDescHeader}>
            <Text>Description</Text>
          </View>
          <View style={[styles.tableColHeader, styles.tableCell]}>
            <Text>Unit Price</Text>
          </View>
          <View style={[styles.tableColHeader, styles.tableCellCenter]}>
            <Text>Taxable?</Text>
          </View>
          <View style={[styles.tableColHeader, styles.tableCell]}>
            <Text>Amount</Text>
          </View>
        </View>
        {invoiceData.items
          .filter((item) => item.quantity > 0)
          .map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={[styles.tableCol, styles.tableCellCenter]}>
                <Text>{item.quantity}</Text>
              </View>
              <View style={styles.tableColDesc}>
                <Text>{item.description}</Text>
              </View>
              <View style={[styles.tableCol, styles.tableCell]}>
                <Text>
                  {currency}
                  {item.unitPrice.toLocaleString("en-US", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                </Text>
              </View>
              <View style={[styles.tableCol, styles.tableCellCenter]}>
                <Text>{item.taxable ? "Yes" : "No"}</Text>
              </View>
              <View style={[styles.tableCol, styles.tableCell]}>
                <Text>
                  {currency}
                  {item.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                </Text>
              </View>
            </View>
          ))}
      </View>

      {/* Totals Section */}
      <View style={styles.totalsSection}>
        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>
              {currency}
              {invoiceData.subtotal.toLocaleString("en-US", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax Rate</Text>
            <Text style={styles.totalValue}>
              {invoiceData.taxRate ? `${invoiceData.taxRate}%` : "-"}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sales Tax</Text>
            <Text style={styles.totalValue}>
              {invoiceData.salesTax
                ? `${invoiceData.salesTax.toLocaleString("en-US", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}`
                : "-"}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Other</Text>
            <Text style={styles.totalValue}>
              {invoiceData.other
                ? `${invoiceData.other.toLocaleString("en-US", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}`
                : "-"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 5,
              backgroundColor: invoiceData.brandColor,
              color: "#FFFFFF",
              marginTop: 5,
            }}
          >
            <Text style={styles.grandTotalLabel}>TOTAL</Text>
            <Text style={styles.grandTotalValue}>
              {currency}
              {invoiceData.total.toLocaleString("en-US", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>{invoiceData.contactInfo}</Text>
        <Text style={styles.footerText}>{invoiceData.paymentInfo}</Text>
        <Text style={styles.thankYou}>{invoiceData.thankYouMessage}</Text>
      </View>
    </Page>
  </Document>
);

export type LastClientProps = {
  billToContactPerson: string;
  billToCompanyName: string;
  billToLocation: string | null;
  billToPhone: string | null;
  customerID: string | null;
};
// --- Main Invoice Component ---
export default function UserInvoiceForm({
  initialInvoiceData = initialData,
  editingId,
  currentBrand,
  lastClient,
  preparedBy,
  isCustomer = false,
  currency,
}: {
  initialInvoiceData?: InvoiceData;
  isCustomer?: boolean;
  editingId?: string;
  currentBrand?: BrandProfile;
  lastClient?: LastClientProps;
  preparedBy?: string;
  currency: string;
}) {
  const [isEditMode, setIsEditMode] = useState(editingId ? false : true); // Start in edit mode
  const today = new Date();
  const oneMonthFromToday = new Date();
  oneMonthFromToday.setMonth(today.getMonth() + 1);

  const invoiceDate = today.toISOString().split("T")[0]; // "2025-06-09"
  const invoiceDueDate = oneMonthFromToday.toISOString().split("T")[0]; // "2025-07-09"

  const defaultInvoiceData = {
    ...initialInvoiceData,
    documentType: initialInvoiceData.documentType || "invoice" as DocumentType,
    invoiceDate: invoiceDate,
    invoiceDueDate: invoiceDueDate,
    preparedBy: preparedBy || "JB",
    billToContactPerson: lastClient?.billToContactPerson || "Mary Kuper",
    billToCompanyName: lastClient?.billToCompanyName || "CODELABS CO. LTD",
    billToLocation: lastClient?.billToLocation || "South Sudan",
    billToPhone: lastClient?.billToPhone || "922031601",
    customerID: lastClient?.customerID || "CODM-742",
    companyName: currentBrand?.name || "DESISHUB",
    companyAddress: currentBrand?.address || "Kampala",
    companyPhone: currentBrand?.phone || "0762063160 | 0756384580",
    brandColor: currentBrand?.brandColor || "#000000",
    companyEmail: currentBrand?.email || "info@desishub.com",
    logoUrl:
      currentBrand?.logo ||
      "https://utfs.io/f/xfyx7VpiVmTbx8SIrtpiVmTbZrh9RFQWYcvt2JxzPpKfwnL1",
    contactInfo:
      currentBrand?.contactInfo ||
      "If you have any questions concerning this Invoice, please contact: Call or Whatsapp: 0762 063 160 | 0756 384 580",
    paymentInfo:
      currentBrand?.paymentInfo ||
      "All dues are Payable to Desishub through Cash or MTN MOMO 0762 063 160",
    thankYouMessage:
      currentBrand?.thankYouMsg || "Thank you for your business!",
    taxRate: currentBrand?.taxRate || 10,
    salesTax: currentBrand?.salesTax || 30,
    other: currentBrand?.otherCharges || 4,
  };
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(
    editingId ? initialInvoiceData : defaultInvoiceData
  );
  console.log(initialInvoiceData);
  const [showMailPopup, setShowMailPopup] = useState(false);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  // Fetch logo as base64 for PDF rendering (CORS workaround)
  useEffect(() => {
    const fetchLogoBase64 = async () => {
      const url = invoiceData.logoUrl;
      if (!url) return;
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoBase64(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.warn("Failed to convert logo to base64:", err);
      }
    };
    fetchLogoBase64();
  }, [invoiceData.logoUrl]);

  // Print Handler
  const handlePrint = useReactToPrint({
    documentTitle: `${invoiceData.documentType === "quotation" ? "Quotation" : "Invoice"}-${invoiceData.invoiceNumber}`,
    //  @ts-ignore
    contentRef: componentRef,
  });

  // Download Handler
  const PdfLinkComponent = (
    <PDFDownloadLink
      document={<InvoicePDF currency={currency} invoiceData={invoiceData} logoBase64={logoBase64} />}
      fileName={`${invoiceData.documentType === "quotation" ? "Quotation" : "Invoice"}-${invoiceData.invoiceNumber}.pdf`}
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 no-underline"
    >
      {/* @ts-ignore */}
      {({ blob, url, loading, error }) =>
        loading ? "Loading PDF..." : "Download PDF"
      }
    </PDFDownloadLink>
  );
  const [sending, setSending] = useState(false);
  // Send Mail Handler
  const handleSendMailClick = () => {
    setShowMailPopup(true);
  };

  const handleSendMailSubmit = async (emails: string) => {
    setSending(true);
    console.log("Sending invoice to:", emails.split(","));
    alert(`Invoice would be sent to: ${emails}`);
    console.log(initialInvoiceData);
    const data = {
      ...initialInvoiceData,
      invoiceUrl: process.env.NEXT_PUBLIC_BASE_URL || "http//localhost:3000",
    };
    const newMails = emails.split(",").map((e) => e.trim());
    try {
      if (editingId) {
        await sendCustomerInvoice(data, newMails, editingId);
        toast.success("Invoice sent successfully");
        setSending(false);
      } else {
        toast.error("You need to create the ivoice first");
      }
    } catch (error) {
      setSending(false);
      toast.error("Something went wrong");
    }
  };

  // Edit Mode Toggle
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // Form Submit Handler
  const handleFormSubmit = (data: InvoiceData) => {
    console.log("Invoice Form Submitted:", data);
    setInvoiceData(data);
    setIsEditMode(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-8">
      {/* Action Buttons Area */}
      <div className="p-4 bg-gray-100 border-b flex flex-wrap justify-end gap-2">
        {!isEditMode && (
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 text-sm"
          >
            Print
          </button>
        )}
        {!isEditMode && PdfLinkComponent}
        {!isEditMode && editingId && (
          <button
            disabled={sending}
            onClick={handleSendMailClick}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-200 text-sm"
          >
            {sending ? "Sending..." : "Send Via Mail"}
          </button>
        )}
        {!isEditMode && editingId && !isCustomer && (
          <button
            onClick={() => {
              const paymentUrl = `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/pay/${editingId}`;
              navigator.clipboard.writeText(paymentUrl);
              toast.success("Payment link copied to clipboard!");
            }}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition duration-200 text-sm"
          >
            Copy Payment Link
          </button>
        )}
        {!editingId && (
          <button
            onClick={toggleEditMode}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition duration-200 text-sm"
          >
            {isEditMode ? "Preview Mode" : "Edit Mode"}
          </button>
        )}
      </div>

      {/* Invoice Content Area */}
      <div ref={componentRef} className="invoice-content-area">
        {isEditMode ? (
          <InvoiceForm
            initialData={invoiceData}
            onSubmit={handleFormSubmit}
            editingId={editingId}
            currency={currency}
          />
        ) : (
          <InvoicePreview currency={currency} invoiceData={invoiceData} />
        )}
      </div>

      {/* Mail Popup */}
      {showMailPopup && (
        <SendMailPopup
          onClose={() => setShowMailPopup(false)}
          onSend={handleSendMailSubmit}
        />
      )}
    </div>
  );
}
