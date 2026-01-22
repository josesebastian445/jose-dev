"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blogs?slug=${slug}`);
      const data = await response.json();

      if (data.success && data.data) {
        setPost(data.data);
      } else {
        setNotFoundError(true);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      setNotFoundError(true);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05060d] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
          <p className="mt-4 text-white/60">Loading post...</p>
        </div>
      </div>
    );
  }

  if (notFoundError || !post) {
    return notFound();
  }

  return (
    <article className="relative min-h-screen bg-[#05060d] text-white">
      {/* Neon gradient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-24 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,170,255,0.18)_0%,rgba(0,0,0,0)_70%)] blur-[60px]" />
        <div className="absolute -right-40 top-1/3 h-[400px] w-[400px] rotate-12 rounded-full bg-[radial-gradient(circle_at_center,rgba(81,0,255,0.11)_0%,rgba(0,0,0,0)_70%)] blur-[80px]" />
      </div>

      {/* Back Button */}
      <div className="mx-auto max-w-4xl px-6 pt-24">
        <Link
          href="/content/blog"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </Link>
      </div>

      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl px-6 pb-10"
      >
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
          {post.title}
        </h1>

        {/* Meta Info */}
        <div className="flex items-center gap-6 text-white/60 text-sm mb-8">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-white/80 leading-relaxed mb-8 p-6 bg-white/5 border border-white/10 rounded-xl">
            {post.excerpt}
          </p>
        )}

        {/* Featured Image */}
        {post.featuredImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-cyan-500/20"
          >
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        )}
      </motion.section>

      {/* Blog Content */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mx-auto max-w-4xl px-6 py-12"
      >
        <div className="prose prose-invert prose-lg max-w-none
          prose-headings:text-cyan-400 prose-headings:font-bold
          prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
          prose-p:text-white/80 prose-p:leading-relaxed
          prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:text-cyan-300 hover:prose-a:underline
          prose-strong:text-white prose-strong:font-bold
          prose-code:text-pink-400 prose-code:bg-white/5 prose-code:px-2 prose-code:py-1 prose-code:rounded
          prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10
          prose-blockquote:border-l-cyan-500 prose-blockquote:text-white/70
          prose-ul:text-white/80 prose-ol:text-white/80
          prose-li:text-white/80
          prose-img:rounded-xl prose-img:shadow-lg"
        >
          {/* Render content as HTML or markdown */}
          <div dangerouslySetInnerHTML={{ __html: formatContent(post.content) }} />
        </div>
      </motion.section>

      {/* Share Section */}
      <section className="mx-auto max-w-4xl px-6 py-12 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-cyan-400 mb-2">Share this post</h3>
            <p className="text-white/60 text-sm">Help others discover this content</p>
          </div>
          <div className="flex gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
              aria-label="Share on Twitter"
            >
              <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
              aria-label="Share on LinkedIn"
            >
              <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 py-12 text-center text-sm text-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6">
          <div className="font-medium text-white/80">
            Jose Cyber — Secure. Fast. Future-Ready.
          </div>
          <div className="mt-2 text-white/40">© 2025 Jose. All rights reserved.</div>
        </div>
      </footer>
    </article>
  );
}

// Helper function to format content (convert markdown to HTML or preserve HTML)
function formatContent(content: string): string {
  // Simple markdown-like formatting
  let formatted = content
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />');

  return `<p>${formatted}</p>`;
}
