"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function BlogCard({ post }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#0a0a1f] to-[#111133] border border-blue-500/20 shadow-lg hover:shadow-blue-500/30 transition-all"
    >
      <Link href={`/blog/${post.slug}`}>
        <Image
          src={post.featuredImage}
          alt={post.title}
          width={600}
          height={300}
          className="h-48 w-full object-cover opacity-90"
        />
        <div className="p-6">
          <h3 className="text-xl font-bold text-gold-400 mb-2">{post.title}</h3>
          <p className="text-white/70 text-sm">{post.excerpt}</p>
          <p className="text-xs text-blue-400 mt-3">{post.date}</p>
        </div>
      </Link>
    </motion.div>
  );
}
