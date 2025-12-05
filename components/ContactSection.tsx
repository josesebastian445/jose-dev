"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Calendar, Send } from "lucide-react";
import SuccessPopup from "@/components/SuccessPopup";

export default function ContactSection() {
  const [showPopup, setShowPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    _hp: "", // honeypot
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/send-contact", {
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
          subject: "",
          message: "",
          _hp: "",
        });
      }
    } catch {
      setErrorPopup("Network error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <section
      id="contact"
      className="relative mx-auto max-w-6xl px-6 py-20 md:py-28"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="grid gap-12 md:grid-cols-2"
      >
        {/* LEFT INFO */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-cyan-400">
            Let’s Work Together
          </div>

          <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
            Need your website secured, fixed, or accelerated?
          </h2>

          <p className="mt-4 max-w-lg text-white/60 text-base leading-relaxed">
            Send me your site details and what’s slowing it down or making it
            risky. I’ll audit security, speed, and UX — and send back a clear
            action plan.
          </p>

          <div className="mt-8 space-y-4 text-sm text-white/70">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-cyan-300" />
              <span className="text-white/80 font-medium">
                hello@joseviews.com
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={16} className="text-violet-300" />
              <span className="text-white/80 font-medium">
                +971 50 123 4567
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-white" />
              <span className="text-white/80 font-medium">
                Remote / UAE-friendly hours
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-[12px] text-white/40">
            <Calendar size={14} className="text-cyan-300" />
            <span>Avg first response: same day</span>
          </div>
        </div>

        {/* RIGHT FORM – EXACT SAME STRUCTURE AS AUDIT FORM */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative rounded-2xl border border-cyan-400/20 bg-white/[0.04] p-8 shadow-[0_0_60px_rgba(0,255,255,0.1)] flex flex-col justify-center"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Send a Message
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              required
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg bg-white/[0.05] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400 transition"
            />

            <input
              type="email"
              name="email"
              required
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg bg-white/[0.05] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400 transition"
            />

            <input
              type="text"
              name="subject"
              required
              placeholder="Subject / Website URL"
              value={formData.subject}
              onChange={handleChange}
              className="w-full rounded-lg bg-white/[0.05] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400 transition"
            />

            <textarea
              name="message"
              rows={3}
              required
              placeholder="How can I help?"
              value={formData.message}
              onChange={handleChange}
              className="w-full rounded-lg bg-white/[0.05] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400 transition resize-none"
            />

            {/* Honeypot */}
            <input
              type="text"
              name="_hp"
              value={formData._hp}
              onChange={handleChange}
              className="hidden"
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
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>

      {/* SUCCESS */}
      <SuccessPopup
        show={showPopup}
        onClose={() => setShowPopup(false)}
        title="Message Sent!"
        message="Thanks for reaching out! I’ll reply within 24 hours."
      />

      {/* ERROR */}
      {errorPopup && (
        <SuccessPopup
          show
          onClose={() => setErrorPopup("")}
          title="Something Went Wrong"
          message={errorPopup}
        />
      )}
    </section>
  );
}
