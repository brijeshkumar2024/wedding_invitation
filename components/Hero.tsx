"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { initGsap } from "@/lib/animations";
import { scrollToId } from "@/lib/utils";

type HeroProps = {
  isRevealed: boolean;
};

export default function Hero({ isRevealed }: Readonly<HeroProps>) {
  const heroRef = useRef<HTMLElement>(null);
  const particles = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    if (!isRevealed || !heroRef.current) return;
    initGsap();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(".hero-bg", { scale: 1.12, filter: "blur(18px)" }, { scale: 1, filter: "blur(2px)", duration: 2.4, ease: "power4.out" })
        .fromTo(".hero-kicker",  { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, ease: "expo.out" }, "-=.75")
        .fromTo(".hero-headline",{ opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 1.3, ease: "expo.out" }, "-=.7")
        .fromTo(".hero-tagline", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1, ease: "expo.out" }, "-=.85")
        .fromTo(".hero-divider", { scaleX: 0 }, { scaleX: 1, duration: .85, ease: "power3.out" }, "-=.6")
        .fromTo(".hero-date",    { opacity: 0, y: 8 },  { opacity: 1, y: 0, duration: .9, ease: "expo.out" }, "-=.55")
        .fromTo(".hero-venue",   { opacity: 0, y: 8 },  { opacity: 1, y: 0, duration: .9, ease: "expo.out" }, "-=.65")
        .fromTo(".hero-cta",     { opacity: 0, y: 12, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: .9, ease: "expo.out" }, "-=.6");
    }, heroRef);
    return () => ctx.revert();
  }, [isRevealed]);

  // Floating petals — canvas-drawn, match the reference image style
  useEffect(() => {
    if (!isRevealed || !heroRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.className = "pointer-events-none absolute inset-0 h-full w-full";
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;z-index:4;";
    heroRef.current.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId = 0;
    let parallaxX = 0;
    let parallaxY = 0;
    let targetParallaxX = 0;
    let targetParallaxY = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      targetParallaxX = relX * 26;
      targetParallaxY = relY * 18;
    };

    const petals = Array.from({ length: 58 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 16 + 7,
      depth: Math.random() * 0.9 + 0.55,
      speedY: Math.random() * 0.7 + 0.18,
      speedX: Math.random() * 0.32 - 0.16,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.008,
      swayAmount: Math.random() * 0.55 + 0.35,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() * 0.018 + 0.005) * (Math.random() < 0.5 ? 1 : -1),
      alpha: Math.random() * 0.4 + 0.16,
      hue: Math.random() < 0.55 ? "rgba(239,120,136," : "rgba(214,98,120,",
    }));

    const drawPetal = (scale: number) => {
      const s = scale / 28;
      ctx.save();
      ctx.scale(s, s);
      ctx.translate(-14, -14);
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.bezierCurveTo(4, 9, 0, 19, 14, 28);
      ctx.bezierCurveTo(28, 19, 24, 9, 14, 0);
      ctx.closePath();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parallaxX += (targetParallaxX - parallaxX) * 0.045;
      parallaxY += (targetParallaxY - parallaxY) * 0.045;

      for (const p of petals) {
        p.x += p.speedX * p.depth;
        p.y += p.speedY * p.depth;
        p.swayPhase += p.swaySpeed;
        p.x += Math.sin(p.swayPhase) * p.swayAmount;
        p.rot += p.rotSpeed;

        if (p.y > canvas.height + 20 || p.x < -40 || p.x > canvas.width + 40) {
          p.y = -26;
          p.x = Math.random() * (canvas.width + 80) - 40;
        }

        const depthShiftX = parallaxX * (0.05 + p.depth * 0.08);
        const depthShiftY = parallaxY * (0.03 + p.depth * 0.05);

        ctx.save();
        ctx.translate(p.x + depthShiftX, p.y + depthShiftY);
        ctx.rotate(p.rot);
        ctx.fillStyle = `${p.hue}${p.alpha})`;
        drawPetal(p.size);
        ctx.fill();
        ctx.restore();
      }
      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    globalThis.addEventListener("pointermove", onPointerMove);
    globalThis.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      globalThis.removeEventListener("pointermove", onPointerMove);
      globalThis.removeEventListener("resize", resize);
      canvas.remove();
    };
  }, [isRevealed]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="hero-cinematic relative flex min-h-screen items-center justify-center overflow-hidden px-6 pb-16 pt-24"
    >
      {/* Background layers */}
      <div className="hero-bg hero-bg-image absolute inset-0" />
      <div className="hero-bg-overlay absolute inset-0" />
      <div className="hero-red-overlay absolute inset-0" />
      <div className="hero-cinematic-rays absolute inset-0" />
      <div className="hero-vignette absolute inset-0" />
      <div className="hero-grain absolute inset-0" />

      {particles.map((particle) => (
        <span key={particle} className={`hero-glow-particle hero-glow-particle-${particle}`} />
      ))}

      {/* Gold corner accents */}
      <div className="hero-corner-accent top-left" />
      <div className="hero-corner-accent top-right" />
      <div className="hero-corner-accent bottom-left" />
      <div className="hero-corner-accent bottom-right" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 mx-auto w-full max-w-3xl text-center"
      >
        <div className="hero-symbol mb-5">
          <span className="om-symbol-teal block text-6xl leading-none md:text-7xl">
            ॐ
          </span>
        </div>

        {/* Kicker */}
        <p className="hero-kicker mb-5 text-[0.72rem] uppercase tracking-[0.42em] text-[#f1d88a]/85 md:text-sm">
          Together with our families
        </p>

        <h1 className="hero-headline mb-6 leading-[1.04]">
          <span className="hero-name-lux">
            <span className="hero-name-initial">R</span>
            <span className="hero-name-rest">itupurna</span>
          </span>
          <span className="hero-name-ampersand"> &amp; </span>
          <span className="hero-name-lux">
            <span className="hero-name-initial">A</span>
            <span className="hero-name-rest">bhisek</span>
          </span>
        </h1>

        <p className="hero-tagline hero-tagline-serif mb-8 text-base italic leading-relaxed text-[#fdf8ea]/72 md:text-xl">
          Invite you to join us in the celebration of our love
        </p>

        {/* Top divider */}
        <div className="hero-divider mx-auto mb-0 h-0.5 max-w-xl bg-linear-to-r from-transparent via-[#d4af37] to-transparent shadow-[0_0_8px_rgba(212,175,55,0.6)]" />

        {/* Date */}
        <p className="hero-date py-3 text-[0.82rem] uppercase tracking-[0.32em] text-white/82 md:text-[0.92rem]">
          20th April 2026
        </p>

        {/* Bottom divider */}
        <div className="hero-divider mx-auto mb-5 h-0.5 max-w-xl bg-linear-to-r from-transparent via-[#d4af37] to-transparent shadow-[0_0_8px_rgba(212,175,55,0.6)]" />

        {/* Venue */}
        <p className="hero-venue mb-10 text-[0.78rem] uppercase tracking-[0.24em] text-white/50 md:text-sm">
          Sai Kalyan Mandap, Puri
        </p>

        <button
          type="button"
          onClick={() => scrollToId("story")}
          className="hero-cta luxury-button"
        >
          Enter Our Story
        </button>
      </motion.div>
    </section>
  );
}

