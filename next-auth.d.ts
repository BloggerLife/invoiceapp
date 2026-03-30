import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";
import type { User } from "next-auth";
import "next-auth/jwt";
import { DefaultJWT } from "next-auth/jwt";
import { DefaultUser } from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: UserRole;
    firstName: string;
    name: string;
    lastName: string;
    phone: string;
    invoiceCount: number;
    subscription: {
      id: string | null;
      plan: "FREE" | "MONTHLY" | "YEARLY";
      status: string;
      currentPeriodStart: string | null | undefined;
      currentPeriodEnd: string | null | undefined;
      cancelAtPeriodEnd: boolean;
      priceAmount: number | null;
      priceCurrency: string | null;
      interval: string | null;
    } | null;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      name: string;
      firstName: string;
      lastName: string;
      phone: string;
      invoiceCount: number;
      subscription: {
        id: string | null;
        plan: "FREE" | "MONTHLY" | "YEARLY";
        status: string;
        currentPeriodStart: string | null;
        currentPeriodEnd: string | null;
        cancelAtPeriodEnd: boolean;
        priceAmount: number | null;
        priceCurrency: string;
        interval: string | null;
      } | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: UserRole;
    name: string;
    firstName: string;
    lastName: string;
    phone: string;
    invoiceCount: number;
  }
}
