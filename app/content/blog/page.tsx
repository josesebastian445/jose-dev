"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import BlogHero from "@/components/BlogHero";

type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: string;
  tags: string[];
  featuredImage: string;
  author: string;
  createdAt: string;
  updatedAt: string;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.tags.includes(selectedCategory)));
    }
  }, [selectedCategory, posts]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blogs");
      const data = await response.json();

      if (data.success) {
        setPosts(data.data);
        setFilteredPosts(data.data);

        // Extract unique categories from all posts
        const allTags = data.data.flatMap((post: BlogPost) => post.tags);
        const uniqueTags = Array.from(new Set(allTags)).sort();
        setCategories(uniqueTags as string[]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <main
      id="blog"
      className="relative min-h-screen overflow-hidden bg-[#05060d] text-white"
    >
      {/* Neon gradient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-24 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,170,255,0.18)_0%,rgba(0,0,0,0)_70%)] blur-[60px]" />
        <div className="absolute -right-40 top-1/3 h-[400px] w-[400px] rotate-12 rounded-full bg-[radial-gradient(circle_at_center,rgba(81,0,255,0.11)_0%,rgba(0,0,0,0)_70%)] blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-screen"
          style={{
            backgroundImage:
              "linear-gradient(to_right,rgba(0,255,255,.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,.15)_1px,transparent_1px)",
            backgroundSize: "36px 36px",
            maskImage:
              "radial-gradient(circle at 50% 30%,rgba(0,0,0,1) 0%,rgba(0,0,0,0) 70%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 30%,rgba(0,0,0,1) 0%,rgba(0,0,0,0) 70%)",
          }}
        />
      </div>

      {/* Hero section */}
      <BlogHero />

      {/* Category Filter */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-white/60 text-sm font-medium">Filter by category:</span>
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
            }`}
          >
            All Posts ({posts.length})
          </button>
          {categories.map((category) => {
            const count = posts.filter(p => p.tags.includes(category)).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                    : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                }`}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="mx-auto max-w-6xl px-6 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
            <p className="mt-4 text-white/60">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/60 mb-4">
              {selectedCategory === "all"
                ? "No blog posts found. Create your first post in the admin dashboard!"
                : `No posts found in "${selectedCategory}" category.`}
            </p>
            {selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200"
              >
                View All Posts
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#0a0a1f] to-[#111133] border border-blue-500/20 shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                <Link href={`/content/blog/${post.slug}`}>
                  {post.featuredImage && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover opacity-90"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-cyan-400 mb-2 hover:text-cyan-300 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-white/70 text-sm mb-4 line-clamp-3">
                      {post.excerpt || post.content.substring(0, 150) + "..."}
                    </p>
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span>{post.author}</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 py-12 text-center text-sm text-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6">
          <div className="font-medium text-white/80">
            Jose Cyber — Secure. Fast. Future-Ready.
          </div>
          <div className="mt-2 text-white/40">© 2025 Jose. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
