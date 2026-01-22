export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

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

// GET - Fetch all blog posts (with optional filter for published/draft)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // published, draft, or null (all)
    const limit = parseInt(searchParams.get("limit") || "50");

    const db = await getDatabase();
    const query = status ? { status } : {};

    const posts = await db
      .collection("blog_posts")
      .find(query)
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

// POST - Create new blog post (requires auth)
export async function POST(req: Request) {
  try {
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

    const body = await req.json();
    const { title, slug, content, excerpt, status, tags, featuredImage, author } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Check if slug already exists
    const existing = await db.collection("blog_posts").findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A post with this slug already exists" },
        { status: 409 }
      );
    }

    const newPost = {
      title,
      slug,
      content,
      excerpt: excerpt || "",
      status: status || "draft",
      tags: tags || [],
      featuredImage: featuredImage || "",
      author: author || "Admin",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("blog_posts").insertOne(newPost);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newPost }
    });

  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}

// PUT - Update existing blog post (requires auth)
export async function PUT(req: Request) {
  try {
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

    const body = await req.json();
    const { _id, title, slug, content, excerpt, status, tags, featuredImage, author } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Check if new slug conflicts with another post
    if (slug) {
      const existing = await db.collection("blog_posts").findOne({
        slug,
        _id: { $ne: new ObjectId(_id) }
      });
      if (existing) {
        return NextResponse.json(
          { success: false, error: "Another post with this slug already exists" },
          { status: 409 }
        );
      }
    }

    const updateData: any = {
      updatedAt: new Date()
    };

    if (title) updateData.title = title;
    if (slug) updateData.slug = slug;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (status) updateData.status = status;
    if (tags) updateData.tags = tags;
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
    if (author) updateData.author = author;

    const result = await db.collection("blog_posts").updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Post updated successfully"
    });

  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog post (requires auth)
export async function DELETE(req: Request) {
  try {
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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.collection("blog_posts").deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
