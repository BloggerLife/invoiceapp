"use server";
import { ResetPasswordEmail } from "@/components/email-templates/reset-password";
import { db } from "@/prisma/db";

import { revalidatePath } from "next/cache";

import { Resend } from "resend";
import { generateToken } from "@/lib/token";

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
import { z } from "zod";

const UpdateUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  jobTitle: z.string().optional(),
  image: z.string().optional(),
});
type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export async function getAllMembers() {
  try {
    const members = await db.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return members;
  } catch (error) {
    console.error("Error fetching the count:", error);
    return 0;
  }
}
export async function getAllUsers() {
  try {
    const members = await db.user.findMany({
      orderBy: [
        {
          totalInvoicesCreated: "desc", // Users with highest invoices first
        },
        // {
        //   createdAt: "desc", // Then by most recent creation date
        // },
      ],
      where: {
        role: "USER",
      },
    });
    return members;
  } catch (error) {
    console.error("Error fetching the count:", error);
    return 0;
  }
}

export async function deleteUser(id: string) {
  try {
    const deleted = await db.user.delete({
      where: {
        id,
      },
    });

    return {
      ok: true,
      data: deleted,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
  }
}
export async function sendResetLink(email: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return {
        status: 404,
        error: "We cannot associate this email with any user",
        data: null,
      };
    }
    const token = generateToken();
    const update = await db.user.update({
      where: {
        email,
      },
      data: {
        token,
      },
    });
    const userFirstname = user.firstName;

    const resetPasswordLink = `${baseUrl}/reset-password?token=${token}&&email=${email}`;
    const { data, error } = await resend.emails.send({
      from: "NextAdmin <info@desishub.com>",
      to: email,
      subject: "Reset Password Request",
      react: ResetPasswordEmail({ userFirstname, resetPasswordLink }),
    });
    if (error) {
      return {
        status: 404,
        error: error.message,
        data: null,
      };
    }
    console.log(data);
    return {
      status: 200,
      error: null,
      data: data,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      error: "We cannot find your email",
      data: null,
    };
  }
}

export async function updateUser(userId: string, data: UpdateUserInput) {
  try {
    // Validate input data
    const validatedData = UpdateUserSchema.parse(data);

    // Check if email is being changed and if it's already taken
    if (data.email) {
      const existingUser = await db.user.findFirst({
        where: {
          email: data.email,
          NOT: {
            id: userId,
          },
        },
      });

      if (existingUser) {
        return {
          error: "Email already in use",
        };
      }
    }

    // Check if phone is being changed and if it's already taken
    if (data.phone) {
      const existingUser = await db.user.findFirst({
        where: {
          phone: data.phone,
          NOT: {
            id: userId,
          },
        },
      });

      if (existingUser) {
        return {
          error: "Phone number already in use",
        };
      }
    }

    // Update user
    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        jobTitle: validatedData.jobTitle,
        name: `${validatedData.firstName} ${validatedData.lastName}`, // Update full name
        image: validatedData.image,
      },
    });
    // Revalidate user data
    revalidatePath("/dashboard/settings/profile");
    revalidatePath("/dashboard");
    return {
      data: updatedUser,
      error: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: "Invalid data provided",
      };
    }

    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
    return {
      error: "Something went wrong",
    };
  }
}

export async function getUserPlan(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      return {
        currentPlan: 0,
        remainingInvoices: 0,
      };
    }

    const currentPlan = user?.subscription?.plan;
    const remainingInvoices = 5 - user?.invoiceCount;
    return {
      currentPlan,
      remainingInvoices,
    };
  } catch (error) {
    return {
      currentPlan: 0,
      remainingInvoices: 0,
    };
  }
}
