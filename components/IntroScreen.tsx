"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { initGsap } from "@/lib/animations";

type IntroScreenProps = {
  onEnter: () => void;
  onStartMusic: () => void;
};

function IntroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;

    const sparkles = Array.from({ length: 38 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.2 + 0.4,
      alpha: Math.random() * 0.45 + 0.12,
      pulse: Math.random() * 0.012 + 0.004,
      driftX: Math.random() * 0.18 - 0.09,
      driftY: Math.random() * 0.28 + 0.08,
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of sparkles) {
        s.x += s.driftX;
        s.y += s.driftY;
        s.alpha += s.pulse;
        if (s.alpha >= 0.78 || s.alpha <= 0.08) s.pulse *= -1;
        if (s.y > canvas.height + 10) { s.y = -10; s.x = Math.random() * canvas.width; }
        if (s.x < -10) s.x = canvas.width + 10;
        if (s.x > canvas.width + 10) s.x = -10;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,232,168,${s.alpha})`;
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />;
}

export default function IntroScreen({ onEnter, onStartMusic }: Readonly<IntroScreenProps>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const enteringRef = useRef(false);

  // 3D tilt on cursor
  useEffect(() => {
    if (!cardRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (enteringRef.current) return;
      const rect = cardRef.current!.getBoundingClientRect();
      const deltaX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const deltaY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      cardRef.current!.style.transform = `perspective(1200px) rotateX(${deltaY * 3.5}deg) rotateY(${deltaX * -4}deg)`;
    };

    const handleMouseLeave = () => {
      if (cardRef.current && !enteringRef.current)
        cardRef.current.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg)`;
    };

    globalThis.addEventListener("mousemove", handleMouseMove);
    globalThis.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      globalThis.removeEventListener("mousemove", handleMouseMove);
      globalThis.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    initGsap();

    const ctx = gsap.context(() => {
      gsap.set(".curtain-left",  { xPercent: 0, transformOrigin: "right center" });
      gsap.set(".curtain-right", { xPercent: 0, transformOrigin: "left center" });
      gsap.set(".golden-line", { scaleX: 0, opacity: 0, transformOrigin: "center center" });
      gsap.set(".center-glow",  { opacity: 0 });
      gsap.set(".reveal-glow",  { opacity: 0, scale: 0.75 });

      gsap.fromTo(
        ".landing-card",
        { opacity: 0, y: 22, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "expo.out", delay: 0.15 }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handleEnter = () => {
    if (enteringRef.current) return;
    enteringRef.current = true;
    onStartMusic();

    if (cardRef.current)
      cardRef.current.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg)`;

    gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: onEnter });

      // ── Step 1: Card dissolves away ──────────────────────────────────
      tl.to(".landing-card", {
        opacity: 0, y: -8, scale: 1.04,
        duration: 0.52, ease: "power2.inOut"
      })

      // ── Step 2: Pre-reveal centre pulse ─────────────────────────────
        .to(".gate-divider",  { opacity: 1.6, duration: 0.28 }, "+=0.06")
        .to(".intro-bg",      { filter: "blur(5px)", duration: 0.85, ease: "power2.inOut" }, "<")
        .to(".center-glow",   { opacity: 0.55, duration: 0.8, ease: "power2.out" }, "<+0.12")
        .to(".gate-divider",  { opacity: 0, duration: 0.24 }, "<+0.24")
        .to(".golden-line",   { scaleX: 1, opacity: 1, duration: 0.4, ease: "power4.out" }, "<+0.05")

      // ── Step 3: Golden line ritual ───────────────────────────────────
        .to(".golden-line", { scaleX: 3.5, duration: 0.34, ease: "power2.inOut" }, "+=0.16")
        .to(".golden-line", { scaleX: 1.0, duration: 0.36, ease: "power3.out" })
        .to(".golden-line", { opacity: 0.4, duration: 0.1, yoyo: true, repeat: 5, ease: "none" }, "+=0.02")
        .to(".golden-line", { opacity: 1, duration: 0.08 })

      // ── Step 4: GRAND CURTAIN REVEAL ────────────────────────────────
        .addLabel("curtainOpen", "+=0.22");

      // Left curtain — 3-phase organic fabric motion
      // Phase 1: slight anticipation (fabric breathes inward)
      // Phase 2: acceleration — cloth stretches, skews opposite
      // Phase 3: deceleration — fabric settles with trailing edge bounce
      const leftTL = gsap.timeline()
        .to(".curtain-left", {
          xPercent: -8, skewY: 1.1,
          duration: 0.22, ease: "power1.in"
        })
        .to(".curtain-left", {
          xPercent: -76, skewY: -3.2, scaleY: 1.016,
          filter: "blur(0.9px)",
          duration: 0.47, ease: "power2.in"
        })
        .to(".curtain-left", {
          xPercent: -132, skewY: 0.7, scaleY: 1.0,
          rotate: -2.5, filter: "blur(0px)",
          duration: 0.64, ease: "circ.out"
        });

      // Right curtain — 0.14s stagger for asymmetric organic feel
      const rightTL = gsap.timeline()
        .to(".curtain-right", {
          xPercent: 8, skewY: -1.1,
          duration: 0.22, ease: "power1.in"
        })
        .to(".curtain-right", {
          xPercent: 76, skewY: 3.2, scaleY: 1.016,
          filter: "blur(0.9px)",
          duration: 0.47, ease: "power2.in"
        })
        .to(".curtain-right", {
          xPercent: 132, skewY: -0.7, scaleY: 1.0,
          rotate: 2.5, filter: "blur(0px)",
          duration: 0.64, ease: "circ.out"
        });

      tl.add(leftTL,  "curtainOpen")
        .add(rightTL, "curtainOpen+=0.14")

      // ── Glow SURGES at mid-open (peak cinematic moment) ─────────────
      // Timed to when curtains are ~55% through their acceleration phase
        .to(".center-glow", {
          opacity: 1, duration: 0.38, ease: "power2.out"
        }, "curtainOpen+=0.54")
        .to(".reveal-glow", {
          opacity: 1, scale: 1.35, duration: 0.45, ease: "power2.out"
        }, "curtainOpen+=0.54")

      // ── Glow fades as curtains reach full open ───────────────────────
        .to(".golden-line", {
          opacity: 0, scaleY: 2.2, duration: 0.38, ease: "power2.in"
        }, "curtainOpen+=0.74")
        .to(".center-glow", {
          opacity: 0, duration: 0.52, ease: "power2.in"
        }, "curtainOpen+=1.02")
        .to(".reveal-glow", {
          opacity: 0, scale: 0.85, duration: 0.48, ease: "power2.in"
        }, "curtainOpen+=1.05")
        .to(".intro-bg", {
          filter: "blur(0px)", duration: 0.78, ease: "power2.out"
        }, "curtainOpen+=0.88")

      // ── Step 5: Handoff to main site ────────────────────────────────
        .to(rootRef.current, {
          opacity: 0, duration: 0.55, pointerEvents: "none"
        }, "curtainOpen+=1.52");
    }, rootRef);
  };

  return (
    <div ref={rootRef} className="fixed inset-0 z-50 overflow-hidden">

      {/* ── Background ───────────────────────────────────────────────── */}
      <div className="intro-bg absolute inset-0">
        <div className="intro-bg-image absolute inset-0" />
        <div className="intro-bg-overlay absolute inset-0" />
        <div className="intro-dot-texture absolute inset-0 opacity-[0.022]" />
      </div>

      {/* ── Ambient particles ────────────────────────────────────────── */}
      <div className="absolute inset-0 z-[6]">
        <IntroParticles />
      </div>

      {/* ── Grand reveal glow — surges during curtain opening ────────── */}
      <div className="reveal-glow pointer-events-none absolute inset-0 z-[15]" />

      {/* ── Curtain Left ─────────────────────────────────────────────── */}
      <div className="curtain-panel curtain-left absolute inset-y-0 left-0 z-20">
        <div className="curtain-body relative h-full w-full overflow-hidden">
          {/* Base velvet fabric */}
          <div className="absolute inset-0 bg-[linear-gradient(96deg,#150404_0%,#3d0a0a_45%,#280606_75%,#1a0404_100%)]" />
          {/* Floral brocade pattern */}
          <div className="absolute inset-0 opacity-[0.13]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Cg fill='none' stroke='%23d4af37' stroke-width='0.7'%3E%3C!-- Lotus petals --%3E%3Cellipse cx='36' cy='36' rx='6' ry='11' transform='rotate(0 36 36)' /%3E%3Cellipse cx='36' cy='36' rx='6' ry='11' transform='rotate(45 36 36)' /%3E%3Cellipse cx='36' cy='36' rx='6' ry='11' transform='rotate(90 36 36)' /%3E%3Cellipse cx='36' cy='36' rx='6' ry='11' transform='rotate(135 36 36)' /%3E%3C!-- Inner circle --%3E%3Ccircle cx='36' cy='36' r='3.5' /%3E%3C!-- Corner diamonds --%3E%3Cpath d='M4 36 L8 32 L12 36 L8 40 Z' /%3E%3Cpath d='M60 36 L64 32 L68 36 L64 40 Z' /%3E%3Cpath d='M36 4 L40 8 L36 12 L32 8 Z' /%3E%3Cpath d='M36 60 L40 64 L36 68 L32 64 Z' /%3E%3C!-- Connecting vines --%3E%3Cpath d='M12 36 Q24 28 32 36' stroke-width='0.5' /%3E%3Cpath d='M40 36 Q48 28 60 36' stroke-width='0.5' /%3E%3Cpath d='M36 12 Q28 24 36 32' stroke-width='0.5' /%3E%3Cpath d='M36 40 Q28 48 36 60' stroke-width='0.5' /%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "72px 72px",
          }} />
          {/* Warm gold highlight */}
          <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_0%,rgba(212,175,55,0.05)_28%,rgba(255,200,100,0.09)_48%,rgba(212,175,55,0.04)_68%,transparent_100%)]" />
          {/* Curved sheen */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_42%,rgba(255,180,80,0.09),transparent_55%)]" />
          {/* Inner depth shadow from right edge */}
          <div className="absolute inset-y-0 right-0 w-24 bg-[linear-gradient(to_left,rgba(0,0,0,0.55),transparent)]" />
          {/* Seam glow */}
          <div className="curtain-seam-l absolute inset-y-0 right-0 w-[2px] bg-[linear-gradient(to_bottom,transparent_2%,rgba(212,175,55,0.45)_18%,rgba(255,220,100,0.88)_50%,rgba(212,175,55,0.45)_82%,transparent_98%)]" />
        </div>
      </div>

      {/* ── Curtain Right ────────────────────────────────────────────── */}
      <div className="curtain-panel curtain-right absolute inset-y-0 right-0 z-20">
        <div className="curtain-body relative h-full w-full overflow-hidden">
          {/* Base velvet fabric */}
          <div className="absolute inset-0 bg-[linear-gradient(264deg,#150404_0%,#3d0a0a_45%,#280606_75%,#1a0404_100%)]" />
          {/* Floral brocade pattern */}
          <div className="absolute inset-0 opacity-[0.13]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Cg fill='none' stroke='%23d4af37' stroke-width='0.7'%3E%3Cellipse cx='36' cy='36' rx='6' ry='11' transform='rotate(0 36 36)' /%3E%3Cellipse cx='36' cy='36' rx='6' ry='11' transform='rotate(45 36 36)' /%3E%3Cellipse cx='36' cy='36' rx='6' ry='11' transform='rotate(90 36 36)' /%3E%3Cellipse cx='36' cy='36' rx='6' ry='11' transform='rotate(135 36 36)' /%3E%3Ccircle cx='36' cy='36' r='3.5' /%3E%3Cpath d='M4 36 L8 32 L12 36 L8 40 Z' /%3E%3Cpath d='M60 36 L64 32 L68 36 L64 40 Z' /%3E%3Cpath d='M36 4 L40 8 L36 12 L32 8 Z' /%3E%3Cpath d='M36 60 L40 64 L36 68 L32 64 Z' /%3E%3Cpath d='M12 36 Q24 28 32 36' stroke-width='0.5' /%3E%3Cpath d='M40 36 Q48 28 60 36' stroke-width='0.5' /%3E%3Cpath d='M36 12 Q28 24 36 32' stroke-width='0.5' /%3E%3Cpath d='M36 40 Q28 48 36 60' stroke-width='0.5' /%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "72px 72px",
          }} />
          {/* Warm gold highlight */}
          <div className="absolute inset-0 bg-[linear-gradient(75deg,transparent_0%,rgba(212,175,55,0.04)_32%,rgba(255,200,100,0.09)_52%,rgba(212,175,55,0.05)_72%,transparent_100%)]" />
          {/* Curved sheen */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_82%_42%,rgba(255,180,80,0.09),transparent_55%)]" />
          {/* Inner depth shadow from left edge */}
          <div className="absolute inset-y-0 left-0 w-24 bg-[linear-gradient(to_right,rgba(0,0,0,0.55),transparent)]" />
          {/* Seam glow */}
          <div className="curtain-seam-r absolute inset-y-0 left-0 w-[2px] bg-[linear-gradient(to_bottom,transparent_2%,rgba(212,175,55,0.45)_18%,rgba(255,220,100,0.88)_50%,rgba(212,175,55,0.45)_82%,transparent_98%)]" />
        </div>
      </div>

      {/* ── Static gate divider ──────────────────────────────────────── */}
      <div className="gate-divider gate-divider-bar pointer-events-none absolute left-1/2 top-0 z-[22] h-full w-px -translate-x-1/2" />

      {/* ── Cinematic centre glow ─────────────────────────────────────── */}
      <div className="center-glow pointer-events-none absolute inset-0 z-[35] flex items-center justify-center">
        <div className="center-glow-beam h-full w-[40%]" />
      </div>

      {/* ── Golden light beam ────────────────────────────────────────── */}
      <div className="golden-light-beam golden-line pointer-events-none absolute left-1/2 top-0 z-40 h-full w-px -translate-x-1/2">
        <div className="golden-shimmer-sweep absolute inset-x-0 top-0 h-[28%] bg-linear-to-b from-transparent via-white/45 to-transparent" />
      </div>

      {/* ── Landing card ─────────────────────────────────────────────── */}
      <div
        ref={cardRef}
        className="landing-card absolute inset-0 z-45 flex flex-col items-center justify-center gap-5 px-5 transition-transform duration-300 ease-out landing-card-3d"
      >
        <div className="relative w-full max-w-2xl border border-[#d4af37]/55 bg-[rgba(12,3,3,0.75)] px-10 py-9 text-center backdrop-blur-[8px] shadow-[0_8px_28px_rgba(0,0,0,0.45)] rounded-lg overflow-hidden">
          <div className="pointer-events-none absolute inset-0 rounded-lg border border-[#d4af37]/20" />
          <p className="relative script-text mb-1 text-[3rem] leading-tight text-[#d4af37] drop-shadow-[0_0_18px_rgba(212,175,55,0.45)] md:text-[3.5rem]">
            You Are Invited
          </p>
          <div className="relative mx-auto my-4 h-px w-16 bg-linear-to-r from-transparent via-[#d4af37]/50 to-transparent" />
          <h1 className="relative mb-6 font-heading text-4xl font-bold tracking-wide text-white md:text-5xl">
            Ritupurna &amp; Abhisek
          </h1>
          <button type="button" onClick={handleEnter} className="relative invite-rect-btn">
            Open Invitation
          </button>
        </div>
        <p className="text-[0.68rem] italic tracking-widest text-[#d4af37]/45">
          Tap to begin the celebration
        </p>
      </div>

      {/* ── Vignette ─────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-50 bg-[radial-gradient(ellipse_at_center,transparent_34%,rgba(0,0,0,0.62)_100%)]" />
    </div>
  );
}
