"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { db } from "@/prisma/db";
import { disbursePayment } from "@/lib/dgateway";
import { revalidatePath } from "next/cache";

const PLATFORM_FEE_RATE = 0.08; // 8%

// Get or create wallet for a user+currency pair
export async function getOrCreateWallet(userId: string, currency: string) {
  let wallet = await db.wallet.findUnique({
    where: { userId_currency: { userId, currency: currency.toUpperCase() } },
  });

  if (!wallet) {
    wallet = await db.wallet.create({
      data: {
        userId,
        currency: currency.toUpperCase(),
        balance: 0,
      },
    });
  }

  return wallet;
}

// Credit wallet after invoice payment (called from invoice-payment status route)
export async function creditWalletForInvoice({
  userId,
  invoiceId,
  grossAmount,
  currency,
  dgwReference,
}: {
  userId: string;
  invoiceId: string;
  grossAmount: number;
  currency: string;
  dgwReference: string;
}) {
  const fee = Math.round(grossAmount * PLATFORM_FEE_RATE * 100) / 100;
  const netAmount = Math.round((grossAmount - fee) * 100) / 100;

  const wallet = await getOrCreateWallet(userId, currency);

  // Create transaction and update balance in a transaction
  await db.$transaction([
    db.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "CREDIT",
        amount: grossAmount,
        fee,
        netAmount,
        currency: currency.toUpperCase(),
        description: `Payment received for invoice`,
        reference: dgwReference,
        invoiceId,
        status: "completed",
      },
    }),
    db.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: netAmount } },
    }),
  ]);

  return { fee, netAmount };
}

// Get wallet data for authenticated user
export async function getWalletData() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  const wallets = await db.wallet.findMany({
    where: { userId: user.id },
    orderBy: { currency: "asc" },
  });

  const transactions = await db.walletTransaction.findMany({
    where: { wallet: { userId: user.id } },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      wallet: { select: { currency: true } },
    },
  });

  return { wallets, transactions };
}

// Request withdrawal
export async function requestWithdrawal({
  amount,
  currency,
  phone_number,
}: {
  amount: number;
  currency: string;
  phone_number: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, message: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Check wallet balance
    const wallet = await db.wallet.findUnique({
      where: {
        userId_currency: { userId: user.id, currency: currency.toUpperCase() },
      },
    });

    if (!wallet || wallet.balance < amount) {
      return {
        success: false,
        message: `Insufficient ${currency} balance. Available: ${wallet?.balance ?? 0}`,
      };
    }

    if (amount <= 0) {
      return { success: false, message: "Amount must be greater than 0" };
    }

    // Call DGateway disburse
    const result = await disbursePayment({
      amount,
      currency: currency.toUpperCase(),
      phone_number,
      provider: "iotec",
      description: `Withdrawal to ${phone_number}`,
    });

    // Create withdrawal transaction and debit balance
    await db.$transaction([
      db.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "WITHDRAWAL",
          amount,
          fee: 0,
          netAmount: amount,
          currency: currency.toUpperCase(),
          description: `Withdrawal to ${phone_number}`,
          reference: result.data.reference,
          status: "completed",
        },
      }),
      db.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      }),
    ]);

    revalidatePath("/dashboard/wallet");

    return { success: true, message: "Withdrawal initiated successfully" };
  } catch (error) {
    console.error("Withdrawal error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Withdrawal failed",
    };
  }
}
