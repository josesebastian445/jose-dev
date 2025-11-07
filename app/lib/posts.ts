// app/lib/posts.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";

const postsDir = path.join(process.cwd(), "content", "blog");

export function getAllPosts() {
  // If folder doesn't exist yet, return empty list (prevents ENOENT)
  if (!fs.existsSync(postsDir)) return [];

  const files = fs
    .readdirSync(postsDir)
    .filter((f) => f.toLowerCase().endsWith(".mdx"));

  return files
    .map((filename) => {
      const file = fs.readFileSync(path.join(postsDir, filename), "utf8");
      const { data } = matter(file);
      return { ...data, slug: filename.replace(/\.mdx$/i, "") };
    })
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

export function getPost(slug: string) {
  const fullPath = path.join(postsDir, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    // 404 nicely if someone visits a missing post
    notFound();
  }
  const file = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(file);
  return { data, content };
}
