"use client";

import React, { useState, useTransition } from "react";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Phone,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { requestWithdrawal } from "@/actions/wallet";
import { useRouter } from "next/navigation";

interface WalletData {
  id: string;
  currency: string;
  balance: number;
}

interface TransactionData {
  id: string;
  type: string;
  amount: number;
  fee: number;
  netAmount: number;
  currency: string;
  description: string | null;
  reference: string | null;
  invoiceId: string | null;
  status: string;
  createdAt: string;
}

interface WalletClientProps {
  wallets: WalletData[];
  transactions: TransactionData[];
}

export default function WalletClient({
  wallets,
  transactions,
}: WalletClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawPhone, setWithdrawPhone] = useState("");
  const [withdrawCurrency, setWithdrawCurrency] = useState(
    wallets[0]?.currency || "UGX"
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const formatAmount = (amount: number, currency: string) => {
    if (currency === "USD") return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    return `${currency} ${amount.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleWithdraw = () => {
    setError(null);
    setSuccess(null);

    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (!withdrawPhone || withdrawPhone.length < 10) {
      setError("Enter a valid phone number (e.g., 256771234567)");
      return;
    }

    startTransition(async () => {
      const result = await requestWithdrawal({
        amount,
        currency: withdrawCurrency,
        phone_number: withdrawPhone,
      });

      if (result.success) {
        setSuccess(result.message);
        setWithdrawAmount("");
        setWithdrawPhone("");
        setShowWithdraw(false);
        router.refresh();
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {wallets.length > 0 ? (
          wallets.map((w) => (
            <div
              key={w.id}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">
                  {w.currency} Balance
                </span>
              </div>
              <p className="text-lg md:text-2xl font-bold text-gray-900">
                {formatAmount(w.balance, w.currency)}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-3 bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              No wallet balance yet. You'll see funds here when clients pay your invoices.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowWithdraw(!showWithdraw)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <ArrowUpCircle className="h-4 w-4" />
          Withdraw
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-700 hover:text-red-900"
          >
            x
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
          {success}
        </div>
      )}

      {/* Withdrawal Form */}
      {showWithdraw && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
            Withdraw Funds
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={withdrawCurrency}
                onChange={(e) => setWithdrawCurrency(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5"
              >
                {wallets.length > 0 ? (
                  wallets.map((w) => (
                    <option key={w.id} value={w.currency}>
                      {w.currency} (Balance: {formatAmount(w.balance, w.currency)})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="UGX">UGX (Balance: UGX 0)</option>
                    <option value="USD">USD (Balance: $0.00)</option>
                    <option value="KES">KES (Balance: KES 0)</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                placeholder="Amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="256771234567"
                  value={withdrawPhone}
                  onChange={(e) => setWithdrawPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleWithdraw}
            disabled={isPending}
            className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Phone className="h-4 w-4" />
                Withdraw to Mobile Money
              </>
            )}
          </button>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
          Transaction History
        </h3>

        {transactions.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Type</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Description</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500">Gross</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500">Fee</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500">Net</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="py-3 text-sm text-gray-600">{formatDate(tx.createdAt)}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${tx.type === "CREDIT" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                          {tx.type === "CREDIT" ? <ArrowDownCircle className="h-3 w-3" /> : <ArrowUpCircle className="h-3 w-3" />}
                          {tx.type === "CREDIT" ? "Received" : "Withdrawal"}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-gray-600">{tx.description || "-"}</td>
                      <td className="py-3 text-sm text-gray-900 text-right font-medium">{formatAmount(tx.amount, tx.currency)}</td>
                      <td className="py-3 text-sm text-red-500 text-right">{tx.fee > 0 ? `-${formatAmount(tx.fee, tx.currency)}` : "-"}</td>
                      <td className="py-3 text-sm text-right font-semibold">
                        <span className={tx.type === "CREDIT" ? "text-green-600" : "text-orange-600"}>
                          {tx.type === "CREDIT" ? "+" : "-"}{formatAmount(tx.netAmount, tx.currency)}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${tx.status === "completed" ? "bg-green-100 text-green-700" : tx.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${tx.type === "CREDIT" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {tx.type === "CREDIT" ? <ArrowDownCircle className="h-3 w-3" /> : <ArrowUpCircle className="h-3 w-3" />}
                      {tx.type === "CREDIT" ? "Received" : "Withdrawal"}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${tx.status === "completed" ? "bg-green-100 text-green-700" : tx.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      {tx.status}
                    </span>
                  </div>
                  {tx.description && (
                    <p className="text-xs text-gray-600">{tx.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{formatDate(tx.createdAt)}</span>
                    <span className={`text-sm font-semibold ${tx.type === "CREDIT" ? "text-green-600" : "text-orange-600"}`}>
                      {tx.type === "CREDIT" ? "+" : "-"}{formatAmount(tx.netAmount, tx.currency)}
                    </span>
                  </div>
                  {tx.fee > 0 && (
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Gross: {formatAmount(tx.amount, tx.currency)}</span>
                      <span className="text-red-500">Fee: -{formatAmount(tx.fee, tx.currency)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400 py-8">
            No transactions yet
          </p>
        )}
      </div>
    </div>
  );
}
