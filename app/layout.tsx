"use client";

import "./globals.css";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";
import HeaderNav from "@/components/HeaderNav";
import GlowGrid from "@/components/GlowGrid";
import CursorGlow from "@/components/CursorGlow";
import { useEffect } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  // smooth scroll reset on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [path]);

  return (
    <html lang="en" className="scroll-smooth">
      <body className="relative bg-[#050a12] text-white overflow-x-hidden selection:bg-cyan-400/20 selection:text-cyan-100">
        {/* ✨ Global Background Effects */}
        <GlowGrid />
        <CursorGlow />

        {/* 🧭 Fixed Header */}
        <HeaderNav />

        {/* 🌀 Animated Page Transition */}
        <AnimatePresence mode="wait">
          <motion.main
            key={path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.main>
        </AnimatePresence>

        {/* 📊 Vercel Speed Insights */}
        <SpeedInsights />
      </body>
    </html>
  );
}
