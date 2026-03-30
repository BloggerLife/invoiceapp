import * as React from "react";
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  Link,
  Img,
} from "@react-email/components";

// Invoice Item interface
interface InvoiceItem {
  quantity: number;
  description: string;
  unitPrice: number;
  taxable: boolean;
  amount: number;
}

// Updated interface to match your requirements
export interface InvoiceEmailDataProps {
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

  // New prop for invoice URL
  invoiceUrl: string;
  paymentUrl?: string; // Payment collection link
}

export type InvoiceEmailProps = {
  data: InvoiceEmailDataProps;
};

export default function InvoiceEmail({ data }: InvoiceEmailProps) {
  const currentYear = new Date().getFullYear();
  const formattedDate = data.invoiceDate
    ? new Date(data.invoiceDate).toLocaleDateString()
    : "";
  const formattedDueDate = data.invoiceDueDate
    ? new Date(data.invoiceDueDate).toLocaleDateString()
    : "";

  // Use brand color or default to blue
  const primaryColor = data.brandColor || "#1d4ed8";
  const lightColor = data.brandColor ? `${data.brandColor}20` : "#dbeafe";

  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>
          Invoice {data.invoiceNumber} from {data.companyName}
        </Preview>
        <Body className="bg-gray-50 font-sans py-6">
          <Container className="border border-gray-200 rounded-lg mx-auto p-0 max-w-[600px] overflow-hidden shadow-sm">
            {/* Header with Logo and Company Info */}
            <Section
              className="px-6 py-6 text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <Row>
                <Column>
                  {data.logoUrl && (
                    <Img
                      src={data.logoUrl}
                      alt={`${data.companyName} Logo`}
                      className="mb-2 max-h-12 w-auto"
                    />
                  )}
                  <Text className="text-white font-bold text-xl m-0">
                    {data.companyName}
                  </Text>
                  <Text className="text-white text-sm mt-1 opacity-90">
                    {data.companyAddress}
                  </Text>
                </Column>
                <Column className="text-right">
                  <Text className="text-white text-lg font-semibold m-0">
                    INVOICE
                  </Text>
                  <Text className="text-white text-sm mt-1 opacity-90">
                    #{data.invoiceNumber}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Invoice Information */}
            <Section className="bg-white px-6 pt-6 pb-4">
              <Row>
                <Column>
                  <Heading className="text-2xl font-bold text-gray-800 m-0 mb-2">
                    Invoice Details
                  </Heading>
                  <Text className="text-gray-600 text-sm m-0">
                    <strong>Invoice Date:</strong> {formattedDate}
                  </Text>
                  <Text className="text-gray-600 text-sm m-0">
                    <strong>Due Date:</strong> {formattedDueDate}
                  </Text>
                  <Text className="text-gray-600 text-sm m-0">
                    <strong>Customer ID:</strong> {data.customerID}
                  </Text>
                  <Text className="text-gray-600 text-sm m-0">
                    <strong>Prepared By:</strong> {data.preparedBy}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Bill To Information */}
            <Section className="bg-white px-6 py-4">
              <Heading
                className="text-lg font-bold mb-3"
                style={{ color: primaryColor }}
              >
                Bill To
              </Heading>
              <Text className="text-gray-800 font-medium m-0">
                {data.billToContactPerson}
              </Text>
              <Text className="text-gray-700 text-sm m-0">
                {data.billToCompanyName}
              </Text>
              <Text className="text-gray-700 text-sm m-0">
                {data.billToLocation}
              </Text>
              <Text className="text-gray-700 text-sm m-0">
                {data.billToPhone}
              </Text>
              <Hr className="border-gray-200 my-4" />
            </Section>

            {/* Invoice Items Table */}
            <Section className="bg-white px-6 py-4">
              <Heading
                className="text-lg font-bold mb-3"
                style={{ color: primaryColor }}
              >
                Items
              </Heading>

              <Section className="border border-gray-200 rounded-md overflow-hidden">
                <Row
                  className="text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Column className="p-3 font-bold">Description</Column>
                  <Column className="p-3 font-bold text-center">Qty</Column>
                  <Column className="p-3 font-bold text-right">
                    Unit Price
                  </Column>
                  <Column className="p-3 font-bold text-center">Taxable</Column>
                  <Column className="p-3 font-bold text-right">Amount</Column>
                </Row>

                {data.items.map((item, index) => (
                  <Row
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <Column className="p-3 border-r border-t border-gray-200">
                      <Text className="font-medium text-gray-800 m-0">
                        {item.description}
                      </Text>
                    </Column>
                    <Column className="p-3 border-r border-t border-gray-200 text-center">
                      <Text className="m-0">{item.quantity}</Text>
                    </Column>
                    <Column className="p-3 border-r border-t border-gray-200 text-right">
                      <Text className="m-0">${item.unitPrice.toFixed(2)}</Text>
                    </Column>
                    <Column className="p-3 border-r border-t border-gray-200 text-center">
                      <Text className="m-0">
                        {item.taxable ? (
                          <span className="text-green-600 font-medium">
                            Yes
                          </span>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </Text>
                    </Column>
                    <Column className="p-3 border-t border-gray-200 text-right">
                      <Text className="m-0">${item.amount.toFixed(2)}</Text>
                    </Column>
                  </Row>
                ))}

                {/* Totals Section */}
                <Row className="bg-gray-50">
                  <Column
                    className="p-3 border-t border-gray-200 text-right font-medium"
                    colSpan={4}
                  >
                    Subtotal:
                  </Column>
                  <Column className="p-3 border-t border-gray-200 text-right">
                    <Text className="m-0">${data.subtotal.toFixed(2)}</Text>
                  </Column>
                </Row>

                <Row className="bg-gray-50">
                  <Column
                    className="p-3 border-t border-gray-200 text-right font-medium"
                    colSpan={4}
                  >
                    Tax ({data.taxRate}%):
                  </Column>
                  <Column className="p-3 border-t border-gray-200 text-right">
                    <Text className="m-0">${data.salesTax.toFixed(2)}</Text>
                  </Column>
                </Row>

                {data.other > 0 && (
                  <Row className="bg-gray-50">
                    <Column
                      className="p-3 border-t border-gray-200 text-right font-medium"
                      colSpan={4}
                    >
                      Other:
                    </Column>
                    <Column className="p-3 border-t border-gray-200 text-right">
                      <Text className="m-0">${data.other.toFixed(2)}</Text>
                    </Column>
                  </Row>
                )}

                <Row
                  className="text-white font-bold"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Column className="p-3 text-right" colSpan={4}>
                    TOTAL:
                  </Column>
                  <Column className="p-3 text-right">
                    <Text className="m-0 text-white font-bold">
                      ${data.total.toFixed(2)}
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Section>

            {/* Payment Information */}
            <Section className="bg-white px-6 py-4">
              <Heading
                className="text-lg font-bold mb-3"
                style={{ color: primaryColor }}
              >
                Payment Information
              </Heading>
              <Text className="text-gray-700 whitespace-pre-line">
                {data.paymentInfo}
              </Text>
            </Section>

            {/* Action Buttons */}
            <Section className="bg-white px-6 py-6 text-center">
              <Link
                href={data.invoiceUrl}
                className="bg-blue-600 hover:bg-blue-700 rounded-md text-white py-3 px-6 font-medium no-underline text-center inline-block shadow-sm mr-3"
                style={{ backgroundColor: primaryColor }}
              >
                View & Print Invoice
              </Link>

              {data.paymentUrl && (
                <Link
                  href={data.paymentUrl}
                  className="bg-green-600 hover:bg-green-700 rounded-md text-white py-3 px-6 font-medium no-underline text-center inline-block shadow-sm mr-3"
                >
                  Pay Now
                </Link>
              )}

              <Link
                href={`mailto:${data.companyEmail}?subject=Invoice ${data.invoiceNumber}&body=Regarding invoice ${data.invoiceNumber}`}
                className="bg-gray-600 hover:bg-gray-700 rounded-md text-white py-3 px-6 font-medium no-underline text-center inline-block shadow-sm"
              >
                Contact Us
              </Link>
            </Section>

            {/* Thank You Message */}
            <Section className="bg-white px-6 py-4">
              <Text className="text-gray-700 text-center font-medium">
                {data.thankYouMessage}
              </Text>
            </Section>

            {/* Contact Information */}
            <Section className="bg-white px-6 py-4 border-t border-gray-200">
              <Heading
                className="text-md font-bold mb-3"
                style={{ color: primaryColor }}
              >
                Contact Information
              </Heading>
              <Text className="text-gray-700 whitespace-pre-line">
                {data.contactInfo}
              </Text>
              <Text className="text-gray-700 mt-2">
                Email:{" "}
                <span style={{ color: primaryColor }} className="font-medium">
                  {data.companyEmail}
                </span>
              </Text>
              <Text className="text-gray-700">
                Phone:{" "}
                <span style={{ color: primaryColor }} className="font-medium">
                  {data.companyPhone}
                </span>
              </Text>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <Text className="text-gray-500 text-xs m-0 text-center">
                {data.companyName} | {data.companyAddress}
              </Text>
              <Text className="text-gray-500 text-xs m-0 text-center">
                © {currentYear} {data.companyName}. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
