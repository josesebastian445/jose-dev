"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Gauge, ArrowRight, Send } from "lucide-react";

export default function HeroSection() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setShowForm(false);
      setSent(false);
      setFormData({ name: "", email: "", website: "", message: "" });
    }, 2000);
  };

  return (
    <section className="relative mx-auto max-w-6xl px-6 pt-28 pb-20 md:pt-36 md:pb-28">
      {/* 🔹 Background Video */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-none md:rounded-2xl border border-white/10 bg-black/40">
        <video
          className="h-full w-full object-cover opacity-30"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/12967147_1920_1080_30fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15)_0%,rgba(0,0,0,0)_70%)] blur-[80px]" />
      </div>

      {/* 🔹 Top badges */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-cyan-300/80 relative">
        <div className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 font-medium backdrop-blur-sm">
          Available for new projects
        </div>
        <div className="flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 font-medium text-violet-300/80 backdrop-blur-sm">
          <Shield size={14} />
          Security Hardening
        </div>
        <div className="flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 font-medium text-cyan-300/80 backdrop-blur-sm">
          <Gauge size={14} />
          Performance Boost
        </div>
      </div>

      {/* 🔹 Hero Content */}
      <div className="relative mt-10 grid items-start gap-12 md:grid-cols-[1fr,360px]">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-balance bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-4xl font-extrabold leading-tight text-transparent md:text-5xl lg:text-6xl"
          >
            I secure, repair & accelerate
            <span className="block text-cyan-400">
              underperforming websites.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/70"
          >
            I fix slow, vulnerable, outdated sites. I improve load speed,
            harden security, and modernize your stack — without killing SEO
            or revenue.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <button
              onClick={() => setShowForm(true)}
              className="group relative flex items-center justify-center gap-2 rounded-xl bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-300 ring-1 ring-cyan-400/40 hover:bg-cyan-500/20 hover:text-white hover:ring-cyan-300/60"
            >
              Request Free Audit
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
              <div className="absolute inset-0 rounded-xl bg-cyan-400/30 blur-xl opacity-20 group-hover:opacity-40" />
            </button>

            <a
              href="#testimonials"
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-center text-sm font-semibold text-white/70 hover:text-white hover:bg-white/[0.06]"
            >
              See Results
            </a>
          </motion.div>
        </div>

        {/* 🔹 Right Side Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_40px_160px_rgba(0,200,255,0.15)]"
        >
          <div className="text-sm font-semibold text-white/70">
            Live Site Health Snapshot
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
            <div className="rounded-lg border border-cyan-400/20 bg-cyan-500/5 p-4">
              <div className="flex items-center gap-2 text-cyan-300">
                <Shield size={16} />
                <span className="font-semibold">Security Status</span>
              </div>
              <div className="mt-2 text-2xl font-bold text-white">Hardened</div>
              <div className="text-[10px] uppercase tracking-wide text-cyan-300/60">
                SSL / WAF / CSP
              </div>
            </div>

            <div className="rounded-lg border border-violet-400/20 bg-violet-600/5 p-4">
              <div className="flex items-center gap-2 text-violet-300">
                <Gauge size={16} />
                <span className="font-semibold">Page Speed</span>
              </div>
              <div className="mt-2 text-2xl font-bold text-white">98/100</div>
              <div className="text-[10px] uppercase tracking-wide text-violet-300/60">
                Lighthouse score
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-white/10 bg-black/30 p-4">
            <div className="text-[10px] uppercase tracking-wide text-white/40">
              What I fix
            </div>
            <ul className="mt-2 space-y-1 text-sm text-white/70">
              <li>• Slow WordPress / bloated plugins</li>
              <li>• Weak security / exposed admin</li>
              <li>• Bad Core Web Vitals & CLS</li>
              <li>• No WAF / no CDN / no backup</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* 🧾 Popup Form Modal with Pulse Glow */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 🔹 Pulsing Glow Background */}
            <motion.div
              className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.1)_0%,rgba(0,0,0,0.9)_70%)]"
              animate={{
                opacity: [0.4, 0.6, 0.4],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* 🔹 Popup Card */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-md rounded-2xl border border-cyan-400/30 bg-black/80 p-8 shadow-[0_0_50px_rgba(0,255,255,0.25)]"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute right-4 top-4 text-white/50 hover:text-white"
              >
                ✕
              </button>

              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Request Free Audit
              </h3>

              {sent ? (
                <div className="text-center py-8 text-cyan-300">
                  ✅ Request Sent Successfully!
                  <p className="text-white/50 text-sm mt-2">
                    I’ll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-white/[0.05] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400 focus:outline-none"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-white/[0.05] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    name="website"
                    placeholder="Website URL"
                    required
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-white/[0.05] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400 focus:outline-none"
                  />
                  <textarea
                    name="message"
                    placeholder="Additional details (optional)"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-white/[0.05] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400 focus:outline-none resize-none"
                  />

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-500/20 border border-cyan-400/40 py-3 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/30 hover:text-white transition"
                  >
                    <Send size={14} />
                    Submit Request
                  </motion.button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
