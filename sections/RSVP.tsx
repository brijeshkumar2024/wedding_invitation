"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type RSVPForm = {
  name: string;
  attendance: "yes" | "no";
};

const initialState: RSVPForm = {
  name: "",
  attendance: "yes"
};

export default function Rsvp() {
  const [form, setForm] = useState<RSVPForm>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitForm = async () => {
    setSubmitting(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error("Unable to submit RSVP right now.");
      }

      setSuccess("Your RSVP has been received for the engagement of Ritupurna & Abhisek. #AbhiRitukibaari");
      setForm(initialState);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="relative px-6 pb-28 pt-24 md:pb-36 md:pt-32">
      <div className="mx-auto max-w-3xl">
        <p className="section-kicker">RSVP</p>
        <h3 className="section-title">Grace the Engagement of Ritupurna &amp; Abhisek</h3>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/65 md:text-sm">With Warm Regards - Singh &amp; Mohanty Family</p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submitForm();
          }}
          className="glass-card mt-10 space-y-5 p-6 md:p-8"
        >
          <label className="block text-sm text-white/80">
            <span className="mb-2 block uppercase tracking-[0.2em] text-white/55">Name</span>
            <input
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]/80"
              placeholder="Your full name"
            />
          </label>

          <label className="block text-sm text-white/80">
            <span className="mb-2 block uppercase tracking-[0.2em] text-white/55">Attendance</span>
            <select
              value={form.attendance}
              onChange={(event) => setForm((prev) => ({ ...prev, attendance: event.target.value as RSVPForm["attendance"] }))}
              className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]/80"
            >
              <option value="yes">Joyfully Attending</option>
              <option value="no">Regretfully Declining</option>
            </select>
          </label>

          <motion.button
            type="submit"
            disabled={submitting}
            className="luxury-button w-full justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {submitting ? "Sending..." : "Send RSVP"}
          </motion.button>

          <AnimatePresence mode="wait">
            {success && (
              <motion.p
                key="success"
                initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-lg border border-emerald-400/30 bg-emerald-500/12 px-4 py-3 text-sm text-emerald-100"
              >
                {success}
              </motion.p>
            )}
            {error && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-lg border border-red-400/30 bg-red-500/12 px-4 py-3 text-sm text-red-100"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
}
