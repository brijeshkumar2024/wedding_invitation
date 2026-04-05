"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import IntroScreen from "@/components/IntroScreen";
import Hero from "@/components/Hero";
import Story from "@/sections/Story";
import Timeline from "@/sections/Timeline";
import Venue from "@/sections/Venue";
import Rsvp from "@/sections/RSVP";

function PetalsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;

    // Front layer petals (larger, more visible, with blur variation)
    const frontPetals = Array.from({ length: 32 }, () => {
      const hasBlur = Math.random() < 0.25; // 25% of petals have motion blur
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 18 + 14,      // larger: 14–32px for premium feel
        speedY: Math.random() * 0.62 + 0.25,
        speedX: Math.random() * 0.9 - 0.45,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() * 0.015 + 0.006) * (Math.random() < 0.5 ? 1 : -1),
        alpha: Math.random() * 0.48 + 0.32,  // 0.32–0.8 for richer depth
        blur: hasBlur ? Math.random() * 1.2 + 0.4 : 0, // 0.4–1.6px blur for some
        layer: 'front' as const,
      };
    });

    // Back layer petals (smaller, more transparent for depth, slower movement)
    const backPetals = Array.from({ length: 40 }, () => {
      const hasBlur = Math.random() < 0.35; // 35% of back petals have blur
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 12 + 6,       // smaller: 6–18px
        speedY: Math.random() * 0.32 + 0.12,  // slower for depth
        speedX: Math.random() * 0.6 - 0.3,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() * 0.008 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
        alpha: Math.random() * 0.28 + 0.09, // 0.09–0.37 for softer appearance
        blur: hasBlur ? Math.random() * 1.8 + 0.8 : 0, // 0.8–2.6px blur for atmospheric effect
        layer: 'back' as const,
      };
    });

    const petals = [...backPetals, ...frontPetals];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const respawnPetal = (petal: (typeof petals)[number]) => {
      petal.y = -30;
      petal.x = Math.random() * (canvas.width + 80) - 40;
      petal.speedX = Math.random() * 0.28 - 0.14;
    };

    const drawPetal = (scale: number) => {
      const s = scale / 30;
      ctx.save();
      ctx.scale(s, s);
      ctx.translate(-15, -15);           // centre the 30×30 path
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.bezierCurveTo(5, 10, 0, 20, 15, 30);
      ctx.bezierCurveTo(30, 20, 25, 10, 15, 0);
      ctx.closePath();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw back layer first (depth culling) with blur for atmospheric effect
      for (const p of petals.filter(x => x.layer === 'back')) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rot += p.rotSpeed;

        if (p.y > canvas.height + 20) {
          respawnPetal(p);
        }
        if (p.x < -50) p.x = canvas.width + 20;
        if (p.x > canvas.width + 50) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        if (p.blur > 0) {
          ctx.filter = `blur(${p.blur}px)`;
        }
        ctx.fillStyle = `rgba(255, 190, 170, ${p.alpha * 0.75})`; // softer, warmer tone for back
        drawPetal(p.size);
        ctx.fill();
        ctx.restore();
      }

      // Draw front layer (more vibrant, with variable blur for depth)
      for (const p of petals.filter(x => x.layer === 'front')) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rot += p.rotSpeed;

        if (p.y > canvas.height + 20) {
          respawnPetal(p);
        }
        if (p.x < -50) p.x = canvas.width + 20;
        if (p.x > canvas.width + 50) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        if (p.blur > 0) {
          ctx.filter = `blur(${p.blur}px)`;
        }
        // Warmer, richer coral-pink tone for front petals
        ctx.fillStyle = `rgba(255, 175, 190, ${p.alpha})`;
        drawPetal(p.size);
        ctx.fill();
        ctx.restore();
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[6]" />;
}

export default function HomePage() {
  const [entered, setEntered] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!entered) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [entered]);

  useEffect(() => {
    const audio = new Audio("/music/ambient.mp3");
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const fadeVolume = (target: number, step = 0.04, intervalMs = 45) => {
    const audio = audioRef.current;
    if (!audio) return;

    const direction = target > audio.volume ? 1 : -1;
    const id = globalThis.setInterval(() => {
      audio.volume = direction > 0 ? Math.min(target, audio.volume + step) : Math.max(target, audio.volume - step);

      if (audio.volume === target) {
        if (target === 0) audio.pause();
        globalThis.clearInterval(id);
      }
    }, intervalMs);
  };

  const startMusicWithFade = async () => {
    const audio = audioRef.current;
    if (!audio || musicEnabled) return;

    try {
      await audio.play();
      fadeVolume(0.75, 0.03);
      setMusicEnabled(true);
    } catch {
      setMusicEnabled(false);
    }
  };

  if (!entered) {
    return <IntroScreen onEnter={() => setEntered(true)} onStartMusic={startMusicWithFade} />;
  }

  return (
    <>
      <PetalsCanvas />
      <div className="relative z-10">
        <main className="overflow-x-hidden">
          <Hero isRevealed />
          <Story />
          <Timeline />
          <Venue />
          <Rsvp />
        </main>
      </div>
    </>
  );
}
