"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { initGsap } from "@/lib/animations";

const STORY_TEXT = "Love is not just about finding the right person, but creating the right relationship. It\u2019s not about how much love you have in the beginning but how much love you build until the end. We are starting our forever, and we want you to be part of it.";

function useTypewriter(text: string, trigger: boolean, speed = 48) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!trigger) return;
    setDisplayed("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [trigger, text, speed]);
  return { displayed, done };
}

// ── Canvas petal animation — soft blush petals on cream ──────────────────
function StoryPetals() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId = 0;

    const petals = Array.from({ length: 22 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 12 + 7,
      speedY: Math.random() * 0.38 + 0.14,
      speedX: Math.random() * 0.35 - 0.17,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() * 0.012 + 0.003) * (Math.random() < 0.5 ? 1 : -1),
      // Low opacity — atmospheric, not decorative
      alpha: Math.random() * 0.10 + 0.07,
      r: 195 + Math.floor(Math.random() * 25),
      g: 120 + Math.floor(Math.random() * 25),
      b: 128 + Math.floor(Math.random() * 20),
    }));

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    // Actual petal bezier shape — not hearts
    const drawPetal = (size: number) => {
      const s = size / 26;
      ctx.save();
      ctx.scale(s, s);
      ctx.translate(-13, -13);
      ctx.beginPath();
      ctx.moveTo(13, 0);
      ctx.bezierCurveTo(4, 8, 0, 18, 13, 26);
      ctx.bezierCurveTo(26, 18, 22, 8, 13, 0);
      ctx.closePath();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of petals) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rot += p.rotSpeed;
        if (p.y > canvas.height + 16) { p.y = -16; p.x = Math.random() * canvas.width; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.alpha})`;
        drawPetal(p.size);
        ctx.fill();
        ctx.restore();
      }
      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Story() {
  const ref = useRef<HTMLElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const [typeTrigger, setTypeTrigger] = useState(false);
  const { displayed, done } = useTypewriter(STORY_TEXT, typeTrigger);

  // Fire typewriter as soon as paragraph enters viewport
  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTypeTrigger(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    initGsap();
    const ctx = gsap.context(() => {
      // Title fades up
      gsap.fromTo(
        ".story-title-wrap",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "expo.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%" } }
      );

      // Profiles slide in from sides
      gsap.fromTo(".story-profile-left",
        { x: -44, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.1, ease: "expo.out",
          scrollTrigger: { trigger: ".story-profiles", start: "top 80%" } }
      );
      gsap.fromTo(".story-profile-right",
        { x: 44, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.1, ease: "expo.out", delay: 0.1,
          scrollTrigger: { trigger: ".story-profiles", start: "top 80%" } }
      );

      // Heart appears with gentle scale
      gsap.fromTo(".story-heart-icon",
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.1, ease: "back.out(1.6)", delay: 0.22,
          scrollTrigger: { trigger: ".story-profiles", start: "top 80%" } }
      );

      // Continuous gentle heart breath
      gsap.to(".story-heart-icon", {
        scale: 1.09, duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.4
      });

      // Description fades up — clean, no typewriter
      gsap.fromTo(".story-description",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "expo.out",
          scrollTrigger: { trigger: ".story-description", start: "top 88%" } }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="story" ref={ref} className="story-section relative overflow-hidden px-6 py-24 md:py-32">

      <StoryPetals />

      <div className="relative z-10 mx-auto max-w-4xl">

        {/* ── Title ──────────────────────────────────────────────────── */}
        <div className="story-title-wrap mb-16 text-center">
          <h2 className="story-heading">Our Story</h2>
          <div className="story-heading-line mx-auto mt-3" />
        </div>

        {/* ── Profiles ───────────────────────────────────────────────── */}
        <div className="story-profiles flex flex-col items-center gap-12 md:flex-row md:items-start md:justify-center md:gap-0">

          {/* Groom */}
          <div className="story-profile-left flex-1 text-center md:max-w-[280px]">
            <div className="story-avatar mx-auto mb-6">
              <Image
                src="/images/groom.jpg"
                alt="Abhisek"
                width={200}
                height={200}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <h3 className="story-name mb-3">Abhisek</h3>
            <p className="story-quote">
              &ldquo;The moment I saw her, I knew my search was over.&rdquo;
            </p>
          </div>

          {/* Gold heart */}
          <div className="story-heart-icon flex flex-1 items-center justify-center pt-0 md:max-w-[120px] md:pt-[4.5rem]">
            <svg viewBox="0 0 48 44" width="50" height="46" aria-hidden="true">
              <defs>
                <filter id="hg" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <path
                d="M24 40 C12 30 2 23 2 13 C2 6 7.4 2 13 2 C17.2 2 21 4.4 24 8 C27 4.4 30.8 2 35 2 C40.6 2 46 6 46 13 C46 23 36 30 24 40Z"
                fill="#D4AF37"
                filter="url(#hg)"
              />
            </svg>
          </div>

          {/* Bride */}
          <div className="story-profile-right flex-1 text-center md:max-w-[280px]">
            <div className="story-avatar mx-auto mb-6">
              <Image
                src="/images/bride.jpg"
                alt="Ritupurna"
                width={200}
                height={200}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <h3 className="story-name mb-3">Ritupurna</h3>
            <p className="story-quote">
              &ldquo;In him, I found my love, my best friend, and my home.&rdquo;
            </p>
          </div>

        </div>

        {/* ── Description — typewriter ───────────────────────────── */}
        <p ref={descRef} className="story-description mx-auto mt-16 max-w-2xl text-center">
          {displayed}
          {!done && (
            <span className="ml-[1px] inline-block h-[1.1em] w-[2px] translate-y-[2px] animate-pulse bg-[#d4af37]" />
          )}
        </p>

      </div>
    </section>
  );
}
