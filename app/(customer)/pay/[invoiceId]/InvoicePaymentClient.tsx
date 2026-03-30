"use client";

import React, { useState, FormEvent, useCallback } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Phone,
  CreditCard,
  Loader2,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";

interface InvoiceForPayment {
  id: string;
  invoiceNumber: string;
  status: string;
  totalAmount: number;
  subtotal: number;
  taxAmount: number;
  invoiceDate: string;
  dueDate: string;
  companyName: string;
  companyLogo: string | null;
  brandColor: string;
  currency: string;
  clientName: string;
  clientEmail: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

type PaymentStatus =
  | "idle"
  | "creating"
  | "awaiting_card"
  | "processing"
  | "completed"
  | "failed";

// Inner Stripe card form
function StripeCardForm({
  clientSecret,
  onSuccess,
  onError,
}: {
  clientSecret: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        onError(submitError.message || "Card submission failed");
        setIsProcessing(false);
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: "if_required",
      });

      if (error) {
        onError(error.message || "Payment failed");
        setIsProcessing(false);
      } else {
        onSuccess();
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : "Payment failed");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-70"
      >
        {isProcessing ? "Processing..." : "Pay with Card"}
      </button>
    </form>
  );
}

export default function InvoicePaymentClient({
  invoice,
}: {
  invoice: InvoiceForPayment;
}) {
  const [selectedMethod, setSelectedMethod] = useState<"iotec" | "stripe">(
    "iotec"
  );
  const [status, setStatus] = useState<PaymentStatus>(
    invoice.status === "PAID" ? "completed" : "idle"
  );
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const isPaid = invoice.status === "PAID" || status === "completed";

  const currencySymbol = invoice.currency;
  const formatAmount = (amount: number) =>
    `${currencySymbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;

  // Poll for payment status
  const pollStatus = useCallback(
    async (ref: string) => {
      setStatus("processing");

      for (let attempt = 0; attempt < 60; attempt++) {
        try {
          const res = await fetch("/api/invoice-payment/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              reference: ref,
              invoiceId: invoice.id,
            }),
          });

          const result = await res.json();

          if (result.status === "completed") {
            setStatus("completed");
            return;
          }

          if (result.status === "failed") {
            setStatus("failed");
            setError("Payment was declined or failed.");
            return;
          }
        } catch {
          // continue polling
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      setStatus("failed");
      setError("Payment verification timed out. Contact the invoice issuer.");
    },
    [invoice.id]
  );

  const handleMobileMoneySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number (e.g., 256771234567)");
      return;
    }

    setStatus("creating");

    try {
      const res = await fetch("/api/invoice-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: invoice.id,
          provider: "iotec",
          phone_number: phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initiate payment");

      setReference(data.reference);
      pollStatus(data.reference);
    } catch (err) {
      setStatus("failed");
      setError(err instanceof Error ? err.message : "Payment failed");
    }
  };

  const handleCardPayment = async () => {
    setError(null);
    setStatus("creating");

    try {
      const res = await fetch("/api/invoice-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: invoice.id,
          provider: "stripe",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initiate payment");

      setReference(data.reference);

      if (data.client_secret && data.stripe_publishable_key) {
        setClientSecret(data.client_secret);
        setStripePromise(loadStripe(data.stripe_publishable_key));
        setStatus("awaiting_card");
      } else {
        throw new Error("Card payment setup failed");
      }
    } catch (err) {
      setStatus("failed");
      setError(err instanceof Error ? err.message : "Payment failed");
    }
  };

  const handleCardSuccess = () => {
    if (reference) pollStatus(reference);
  };

  const handleRetry = () => {
    setStatus("idle");
    setError(null);
    setReference(null);
    setClientSecret(null);
    setStripePromise(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        {invoice.companyLogo ? (
          <img
            src={invoice.companyLogo}
            alt={invoice.companyName}
            className="h-16 mx-auto mb-4"
          />
        ) : (
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: invoice.brandColor }}
          >
            <FileText className="h-8 w-8 text-white" />
          </div>
        )}
        <h1 className="text-2xl font-bold text-gray-900">
          {invoice.companyName}
        </h1>
        <p className="text-gray-500 mt-1">
          Invoice #{invoice.invoiceNumber}
        </p>
      </div>

      {/* Invoice Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Bill to</span>
          <span className="font-medium text-gray-900">{invoice.clientName}</span>
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-2">
          {invoice.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.description}{" "}
                <span className="text-gray-400">x{item.quantity}</span>
              </span>
              <span className="text-gray-900">{formatAmount(item.totalPrice)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatAmount(invoice.subtotal)}</span>
          </div>
          {invoice.taxAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span>{formatAmount(invoice.taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>{formatAmount(invoice.totalAmount)}</span>
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-400 mt-4">
          <span>
            Date: {new Date(invoice.invoiceDate).toLocaleDateString()}
          </span>
          <span>
            Due: {new Date(invoice.dueDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Payment Section */}
      {isPaid ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-green-800">
            Payment Successful
          </h2>
          <p className="text-green-600 mt-1">
            This invoice has been paid. Thank you!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pay this invoice
          </h2>

          {/* Status messages */}
          {status === "processing" && (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              <div>
                <p className="font-medium text-blue-800">
                  {selectedMethod === "iotec"
                    ? "Check your phone..."
                    : "Verifying payment..."}
                </p>
                <p className="text-sm text-blue-600">
                  {selectedMethod === "iotec"
                    ? "Approve the payment prompt on your phone"
                    : "Please wait while we confirm your payment"}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <XCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-700 flex-1">{error}</p>
              <button
                onClick={handleRetry}
                className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded"
              >
                Retry
              </button>
            </div>
          )}

          {/* Payment method selection */}
          {(status === "idle" || status === "creating" || status === "failed") && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setSelectedMethod("iotec")}
                  disabled={status === "creating"}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors text-sm ${
                    selectedMethod === "iotec"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Phone className="h-4 w-4" />
                  Mobile Money
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod("stripe")}
                  disabled={status === "creating"}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors text-sm ${
                    selectedMethod === "stripe"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  Card
                </button>
              </div>

              {selectedMethod === "iotec" && (
                <form onSubmit={handleMobileMoneySubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="256771234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      International format (e.g., 256 for Uganda)
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={status === "creating"}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-70"
                  >
                    {status === "creating" ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Initiating...
                      </span>
                    ) : (
                      `Pay ${formatAmount(invoice.totalAmount)}`
                    )}
                  </button>
                </form>
              )}

              {selectedMethod === "stripe" && (
                <button
                  onClick={handleCardPayment}
                  disabled={status === "creating"}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-70"
                >
                  {status === "creating" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Setting up...
                    </span>
                  ) : (
                    `Pay ${formatAmount(invoice.totalAmount)} with Card`
                  )}
                </button>
              )}
            </>
          )}

          {/* Stripe Elements */}
          {status === "awaiting_card" && stripePromise && clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: invoice.brandColor,
                    borderRadius: "8px",
                  },
                },
              }}
            >
              <StripeCardForm
                clientSecret={clientSecret}
                onSuccess={handleCardSuccess}
                onError={(msg) => {
                  setStatus("failed");
                  setError(msg);
                }}
              />
            </Elements>
          )}
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-6">
        Payments processed securely by DGateway
      </p>
    </div>
  );
}
