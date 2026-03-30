// app/api/pro-users/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { getProUsers } from "@/lib/pro-users"; // Your custom data fetching function
import { SubscriptionPlan } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    // Access search parameters using request.nextUrl.searchParams
    const searchParams = request.nextUrl.searchParams;

    // Get each parameter and provide a default value if not present
    const page = searchParams.get("page") ?? "1";
    const limit = searchParams.get("limit") ?? "10";
    const search = searchParams.get("search") ?? "";
    const plan = searchParams.get("plan");

    // Perform validation and type casting
    const result = await getProUsers({
      page: parseInt(page),
      limit: parseInt(limit),
      search: search,
      plan: plan as SubscriptionPlan | undefined,
    });

    // Return the result using NextResponse
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching pro users:", error);

    // Return an error response
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
