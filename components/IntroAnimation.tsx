"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { initGsap } from "@/lib/animations";

type IntroAnimationProps = {
  onOpen: () => void;
};

export default function IntroAnimation({ onOpen }: IntroAnimationProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    initGsap();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.inOut" } });
      tl.fromTo(".intro-om", { scale: 0.7, opacity: 0, filter: "blur(20px)" }, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.8 })
        .fromTo(".intro-line", { y: 24, opacity: 0, filter: "blur(12px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.1 }, "-=0.6")
        .fromTo(".intro-couple", { opacity: 0, y: 28, letterSpacing: "0.4em" }, { opacity: 1, y: 0, letterSpacing: "0.14em", duration: 1.4 }, "-=0.4")
        .fromTo(".intro-date", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1 }, "-=0.9")
        .fromTo(".intro-cta", { opacity: 0, y: 16, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1.2 }, "-=0.8");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: onOpen, defaults: { ease: "power4.inOut" } });
      tl.to(".intro-content", { scale: 1.08, duration: 1.2 })
        .to(".intro-overlay", { clipPath: "circle(140% at 50% 50%)", opacity: 0, duration: 1.2 }, "<")
        .to(rootRef.current, { opacity: 0, pointerEvents: "none", duration: 0.45 }, "-=0.2");
    }, rootRef);
    setTimeout(() => ctx.revert(), 1800);
  };

  return (
    <div ref={rootRef} className="intro-overlay fixed inset-0 z-50 bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(123,0,0,0.22),transparent_58%)]" />
      <div className="intro-content relative flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="intro-om relative mb-6 w-fit">
          {/* Deep radial aura — bleeds outside the icon bounds */}
          <div className="pointer-events-none absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.28)_0%,transparent_70%)] blur-2xl" />
          {/* Inner soft gradient */}
          <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.16)_0%,transparent_72%)]" />
          {/* Pulsing aura ring */}
          <motion.div
            className="pointer-events-none absolute -inset-3 rounded-full border border-[#d4af37]/20"
            animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.08, 0.5] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Logo — scale + opacity pulse */}
          <motion.div
            animate={{ scale: [0.95, 1, 0.95], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
            className="relative drop-shadow-[0_0_44px_rgba(212,175,55,0.72)]"
          >
            <Image src="/images/ganesha-icon.svg" alt="Lord Ganesha icon" width={148} height={148} priority />
          </motion.div>
        </div>
        <p className="intro-line mb-2 text-xs uppercase tracking-[0.36em] text-[#D4AF37] md:text-sm">Shri Ganeshaya Namah</p>
        <p className="intro-line mb-3 text-xs uppercase tracking-[0.4em] text-white/70 md:text-sm">Together with our families</p>
        <div className="couple-name-wrap" data-text="Rituparna & Abhisek">
          <h1 className="intro-couple shimmer-text mb-4 font-heading text-4xl md:text-6xl">Rituparna &amp; Abhisek</h1>
        </div>
        <p className="intro-date mb-2 text-sm uppercase tracking-[0.24em] text-white/75 md:text-base">20th April 2026 (Monday) | 7:00 PM onwards | Puri</p>
        <p className="intro-date mb-10 text-xs uppercase tracking-[0.2em] text-white/65 md:text-sm">With Warm Regards - Singh &amp; Mohanty Family</p>
        <motion.button
          type="button"
          onClick={handleOpen}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
          className="intro-cta luxury-button group"
        >
          <span className="relative z-10">
            Open Invitation
          </span>
        </motion.button>
      </div>
    </div>
  );
}

