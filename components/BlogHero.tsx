"use client";
import { motion } from "framer-motion";

export default function BlogHero() {
  return (
    <div className="text-center py-24 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-violet-500 to-gold-400 bg-clip-text text-transparent">
          Latest Insights & Articles
        </h1>
        <p className="text-blue-200 mt-4 text-lg">
          Stay updated with tips on performance, SEO, and creative design.
        </p>
      </motion.div>

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15)_0%,transparent_80%)] blur-3xl"></div>
    </div>
  );
}
