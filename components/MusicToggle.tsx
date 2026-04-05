"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type MusicToggleProps = {
  enabled: boolean;
  onToggle: () => void;
  className?: string;
};

export default function MusicToggle({ enabled, onToggle, className }: Readonly<MusicToggleProps>) {
  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "group relative overflow-hidden rounded-full border border-white/20 bg-white/8 px-4 py-2 text-xs tracking-[0.25em] text-white/90 backdrop-blur-xl",
        className
      )}
      onClick={onToggle}
      aria-label={enabled ? "Mute background music" : "Unmute background music"}
      type="button"
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-[#D4AF37]/25 to-transparent transition duration-700 group-hover:translate-x-full" />
      <span className="relative">{enabled ? "SOUND ON" : "SOUND OFF"}</span>
    </motion.button>
  );
}
