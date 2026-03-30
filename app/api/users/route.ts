import { db } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const users = await db.user.findMany();
    const result = users.map((user) => {
      return {
        name: user.name,
        email: user.email,
      };
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching usage:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}
