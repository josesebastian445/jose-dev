export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";

// Public API - Get all published blog posts
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const slug = searchParams.get("slug");

    const db = await getDatabase();

    // If slug is provided, return single post
    if (slug) {
      const post = await db.collection("blog_posts").findOne({
        slug,
        status: "published"
      });

      if (!post) {
        return NextResponse.json(
          { success: false, error: "Post not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: post
      });
    }

    // Return list of published posts
    const posts = await db
      .collection("blog_posts")
      .find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: posts,
      count: posts.length
    });

  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
