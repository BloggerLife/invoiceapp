"use server";

import { db } from "@/prisma/db";
import {
  DollarSign,
  LayoutGrid,
  LucideProps,
  Users,
  Users2,
} from "lucide-react";
export type AnalyticsProps = {
  title: string;
  total: number;
  href: string;
  icon: any;
  isCurrency?: boolean;
};

export async function getDashboardStats() {
  try {
    const users = await db.user.count();
    const invoices = await db.invoice.count();
    const blogCategories = 0;
    const blogs = 0;
    const stats = {
      users,
      invoices,
      blogCategories,
      blogs,
    };

    return stats;
  } catch (error) {
    console.log(error);
    return null;
  }
}
