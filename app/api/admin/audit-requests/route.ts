export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";

// Basic auth check
function checkAuth(req: Request): boolean {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return false;

  const [scheme, credentials] = authHeader.split(" ");
  if (scheme !== "Basic") return false;

  const [username, password] = Buffer.from(credentials, "base64")
    .toString()
    .split(":");

  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  return username === "admin" && password === adminPassword;
}

export async function GET(req: Request) {
  try {
    // Check authentication
    if (!checkAuth(req)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        {
          status: 401,
          headers: {
            "WWW-Authenticate": 'Basic realm="Admin Area"'
          }
        }
      );
    }

    const db = await getDatabase();
    const auditRequests = await db
      .collection("audit_requests")
      .find({})
      .sort({ submittedAt: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json({
      success: true,
      data: auditRequests,
      count: auditRequests.length
    });

  } catch (error) {
    console.error("Error fetching audit requests:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch audit requests" },
      { status: 500 }
    );
  }
}
