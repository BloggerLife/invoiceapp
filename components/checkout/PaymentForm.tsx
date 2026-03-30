"use client";
import React, { useState, FormEvent, useEffect, useCallback } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useSession } from "next-auth/react";
import { PricingTier, useSubscription } from "@/stores/subscription-store";
import { useRouter } from "next/navigation";
import { Phone, CreditCard, Loader2, CheckCircle, XCircle } from "lucide-react";

// Pricing is now in UGX directly

interface PaymentFormProps {
  subtotal: number;
  discount?: number;
  total: number;
  selectedTier: PricingTier;
}

type PaymentMethod = "iotec" | "stripe";
type PaymentStatus =
  | "idle"
  | "creating"
  | "awaiting_card"
  | "processing"
  | "completed"
  | "failed";

// Inner Stripe card form (rendered inside Elements provider)
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
          return_url: window.location.origin + "/success",
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
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors ${
          isProcessing ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {isProcessing ? "Processing..." : "Pay with Card"}
      </button>
    </form>
  );
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

export const PaymentForm: React.FC<PaymentFormProps> = ({
  subtotal,
  discount = 0,
  total,
  selectedTier,
}) => {
  const { data: session } = useSession();
  const { clearSelectedPlan } = useSubscription();
  const router = useRouter();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("iotec");
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  // Stripe card payment state
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // total is already in UGX
  const ugxAmount = total;

  // Poll for payment status
  const pollStatus = useCallback(
    async (ref: string) => {
      setStatus("processing");
      const planType = selectedTier === "yearly" ? "yearly" : "monthly";

      for (let attempt = 0; attempt < 60; attempt++) {
        try {
          const res = await fetch(`${baseUrl}/api/checkout/status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: ref, planType }),
          });

          const result = await res.json();

          if (result.status === "completed") {
            setStatus("completed");
            clearSelectedPlan();
            setTimeout(() => router.push("/success"), 1500);
            return;
          }

          if (result.status === "failed") {
            setStatus("failed");
            setError("Payment was declined or failed. Please try again.");
            return;
          }
        } catch {
          // Network error, continue polling
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      // Timeout
      setStatus("failed");
      setError("Payment verification timed out. If you were charged, please contact support.");
    },
    [selectedTier, clearSelectedPlan, router]
  );

  // Initiate mobile money payment
  const handleMobileMoneySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number (e.g., 256771234567)");
      return;
    }

    setStatus("creating");

    try {
      const res = await fetch(`${baseUrl}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planType: selectedTier === "yearly" ? "yearly" : "monthly",
          provider: "iotec",
          phone_number: phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      setReference(data.reference);
      pollStatus(data.reference);
    } catch (err) {
      setStatus("failed");
      setError(err instanceof Error ? err.message : "Payment failed");
    }
  };

  // Initiate card payment
  const handleCardPayment = async () => {
    setError(null);
    setStatus("creating");

    try {
      const res = await fetch(`${baseUrl}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planType: selectedTier === "yearly" ? "yearly" : "monthly",
          provider: "stripe",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      setReference(data.reference);

      if (data.client_secret && data.stripe_publishable_key) {
        setClientSecret(data.client_secret);
        setStripePromise(loadStripe(data.stripe_publishable_key));
        setStatus("awaiting_card");
      } else {
        throw new Error("Card payment setup failed — missing Stripe credentials");
      }
    } catch (err) {
      setStatus("failed");
      setError(err instanceof Error ? err.message : "Payment failed");
    }
  };

  // After Stripe card confirmation, poll for status
  const handleCardSuccess = () => {
    if (reference) {
      pollStatus(reference);
    }
  };

  const handleRetry = () => {
    setStatus("idle");
    setError(null);
    setReference(null);
    setClientSecret(null);
    setStripePromise(null);
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-6">Payment</h2>

      {/* Status Messages */}
      {status === "completed" && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div>
            <p className="font-medium text-green-800">Payment Successful!</p>
            <p className="text-sm text-green-600">Redirecting to dashboard...</p>
          </div>
        </div>
      )}

      {status === "processing" && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
          <div>
            <p className="font-medium text-blue-800">
              {selectedMethod === "iotec"
                ? "Waiting for payment confirmation..."
                : "Verifying payment..."}
            </p>
            <p className="text-sm text-blue-600">
              {selectedMethod === "iotec"
                ? "Please check your phone and approve the payment prompt"
                : "Please wait while we confirm your payment"}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <XCircle className="h-6 w-6 text-red-600" />
          <div className="flex-1">
            <p className="font-medium text-red-800">Payment Failed</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Payment Method Selection */}
      {(status === "idle" || status === "creating" || status === "failed") && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setSelectedMethod("iotec")}
              disabled={status === "creating"}
              className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                selectedMethod === "iotec"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Phone className="h-5 w-5" />
              <span className="font-medium">Mobile Money</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMethod("stripe")}
              disabled={status === "creating"}
              className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                selectedMethod === "stripe"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <CreditCard className="h-5 w-5" />
              <span className="font-medium">Card Payment</span>
            </button>
          </div>

          {/* Mobile Money Form */}
          {selectedMethod === "iotec" && (
            <form onSubmit={handleMobileMoneySubmit} className="space-y-4">
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
                  Enter phone in international format (e.g., 256 for Uganda)
                </p>
              </div>

              <button
                type="submit"
                disabled={status === "creating"}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors ${
                  status === "creating" ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {status === "creating" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Initiating...
                  </span>
                ) : (
                  `Pay UGX ${ugxAmount.toLocaleString()}`
                )}
              </button>
            </form>
          )}

          {/* Card Payment Button */}
          {selectedMethod === "stripe" && (
            <div className="space-y-4">
              <button
                onClick={handleCardPayment}
                disabled={status === "creating"}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors ${
                  status === "creating" ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {status === "creating" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Setting up...
                  </span>
                ) : (
                  `Pay UGX ${ugxAmount.toLocaleString()} with Card`
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Stripe Card Elements (shown after initiating card payment) */}
      {status === "awaiting_card" &&
        stripePromise &&
        clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#1d4ed8",
                  colorBackground: "#ffffff",
                  colorText: "#1f2937",
                  colorDanger: "#ef4444",
                  fontFamily: "system-ui, sans-serif",
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

      {/* Price Summary */}
      <div className="border-t border-gray-200 pt-4 mt-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">
            UGX {ugxAmount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between mt-4">
          <span className="text-lg font-medium">Total</span>
          <span className="text-lg font-bold">
            UGX {ugxAmount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
