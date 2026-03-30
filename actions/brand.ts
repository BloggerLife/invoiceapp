"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export type BrandProfile = {
  id: string;
  userId: string;
  name: string;
  logo?: string;
  slogan?: string;
  phone?: string;
  address?: string;
  currency?: string;
  email?: string;
  brandColor?: string;
  template: "MINIMAL" | "PROFESSIONAL" | "MODERN" | "CREATIVE";
  paymentInfo?: string;
  contactInfo?: string;
  thankYouMsg?: string;
  taxRate?: number;
  salesTax?: number;
  otherCharges?: number;
};

export type UpdateBrandData = Omit<BrandProfile, "id" | "userId">;

/**
 * Get brand details by user ID
 */
export async function getBrandByUserId(userId: string) {
  try {
    if (!userId) {
      return { error: "User ID is required" };
    }

    const brand = await db.brand.findUnique({
      where: {
        userId: userId,
      },
    });

    return { data: brand };
  } catch (error) {
    console.error("Error fetching brand:", error);
    return { error: "Failed to fetch brand details" };
  }
}

/**
 * Update brand by brand ID
 */
export async function updateBrand(brandId: string, data: UpdateBrandData) {
  try {
    if (!brandId) {
      return { error: "Brand ID is required" };
    }

    // Validate required fields
    if (!data.name || data.name.trim().length < 2) {
      return { error: "Brand name must be at least 2 characters" };
    }

    // Validate email format if provided
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return { error: "Invalid email format" };
    }

    // Validate tax rate if provided (should be between 0 and 100)
    if (
      data.taxRate !== undefined &&
      (data.taxRate < 0 || data.taxRate > 100)
    ) {
      return { error: "Tax rate must be between 0 and 100" };
    }

    // Clean up data - remove empty strings and convert to null
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value === "" || value === undefined) {
        acc[key] = null;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    const updatedBrand = await db.brand.update({
      where: {
        id: brandId,
      },
      data: cleanedData,
    });

    // Revalidate paths that might display brand information
    revalidatePath("/dashboard/settings/brand");
    revalidatePath("/dashboard");

    return { data: updatedBrand };
  } catch (error) {
    console.error("Error updating brand:", error);
    return { error: "Failed to update brand" };
  }
}
