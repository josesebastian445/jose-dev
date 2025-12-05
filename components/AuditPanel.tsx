"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState } from "react";
import SuccessPopup from "@/components/SuccessPopup";

export default function AuditPanel() {
  const [showPopup, setShowPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    message: "",
    _hp: "", // honeypot
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/send-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.ok) {
        setErrorPopup(data.error || "Something went wrong.");
      } else {
        setShowPopup(true);
        setFormData({
          name: "",
          email: "",
          website: "",
          message: "",
          _hp: "",
        });
      }
    } catch (err) {
      setErrorPopup("Network error. Please try again.");
    }

    setLoading(false);
  };

  const rows = [
    { label: "SSL / HTTPS", value: "ENFORCED", status: "ok" },
    { label: "Firewall / WAF", value: "ACTIVE", status: "ok" },
    { label: "Exposed Admin URL", value: "LOCKED", status: "ok" },
    { label: "Page Speed (Lighthouse)", value: "98 / 100", status: "ok" },
    { label: "TTFB", value: "320ms", status: "ok" },
    { label: "Backup Strategy", value: "AUTOMATED", status: "ok" },
  ];

  return (
    <section
      id="audit"
      className="relative mx-auto max-w-6xl px-6 py-20 md:py-28"
    >
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-stretch">
        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-[0_0_40px_rgba(0,200,255,0.1)] flex flex-col justify-between"
        >
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-cyan-400">
              Security & Speed Snapshot
            </div>
            <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
              What you get in the free audit
            </h2>
            <p className="mt-4 text-white/60 text-base leading-relaxed">
              I’ll scan your live site (no downtime) and send you a short
              report: what’s risky, what’s slow, and what to fix first. No
              fluff.
            </p>
          </div>

          <div className="mt-8 divide-y divide-white/5 text-sm">
            {rows.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_auto] items-center py-3 text-white/70"
              >
                <div className="text-white/60">{row.label}</div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">
                    {row.value}
                  </span>
                  <span className="rounded-md border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cyan-300/80">
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT SIDE FORM */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative rounded-2xl border border-cyan-400/20 bg-white/[0.04] p-8 shadow-[0_0_60px_rgba(0,255,255,0.1)] flex flex-col justify-center"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Request Your Free Audit
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              required
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg bg-white/[0.05] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400 focus:outline-none transition"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg bg-white/[0.05] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400 focus:outline-none transition"
            />
            <input
              type="text"
              name="website"
              required
              placeholder="Website URL"
              value={formData.website}
              onChange={handleChange}
              className="w-full rounded-lg bg-white/[0.05] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400 focus:outline-none transition"
            />
            <textarea
              name="message"
              rows={3}
              placeholder="Additional details (optional)"
              value={formData.message}
              onChange={handleChange}
              className="w-full rounded-lg bg-white/[0.05] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400 focus:outline-none transition resize-none"
            />

            {/* HONEYPOT FIELD (hidden from users) */}
            <input
              type="text"
              name="_hp"
              value={formData._hp}
              onChange={handleChange}
              className="hidden"
              autoComplete="off"
            />

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              className={`w-full flex items-center justify-center gap-2 rounded-lg border py-3 text-sm font-semibold transition
                ${
                  loading
                    ? "bg-cyan-500/10 border-cyan-400/20 text-white/40 cursor-wait"
                    : "bg-cyan-500/20 border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30 hover:text-white"
                }
              `}
            >
              <Send size={14} />
              {loading ? "Sending..." : "Get My Free Audit"}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* SUCCESS POPUP */}
      <SuccessPopup
        show={showPopup}
        onClose={() => setShowPopup(false)}
        title="Audit Request Sent!"
        message="Thanks for your submission. You’ll receive your free audit within 24 hours."
      />

      {/* ERROR POPUP */}
      {errorPopup && (
        <SuccessPopup
          show={!!errorPopup}
          onClose={() => setErrorPopup("")}
          title="Something Went Wrong"
          message={errorPopup}
        />
      )}
    </section>
  );
}
