"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { initGsap } from "@/lib/animations";

export default function Venue() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    initGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".venue-map, .venue-card",
        { opacity: 0, scale: 0.96, y: 24, filter: "blur(8px)" },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
          stagger: 0.16,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 78%"
          }
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="venue" ref={ref} className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="section-kicker">Venue</p>
        <h3 className="section-title">Sai Kalyan Mandap, Puri</h3>

        <div className="mt-12 overflow-hidden rounded-4xl border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.55)]">
          <div className="venue-map relative">
            <iframe
              title="Wedding Venue Map"
              src="https://www.google.com/maps?q=Sai%20Kalyan%20Mandap%20Kumbharpada%20Road%20Puri&output=embed"
              className="h-95 w-full md:h-115"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="venue-card glass-card absolute bottom-4 left-4 right-4 p-5 md:bottom-7 md:left-7 md:max-w-md">
              <p className="text-xs uppercase tracking-[0.24em] text-[#D4AF37]">Location</p>
              <h4 className="mt-2 font-heading text-2xl text-white">Sai Kalyan Mandap</h4>
              <p className="mt-2 text-sm text-white/75">Kumbharpada Road, Puri</p>
              <a
                href="https://maps.google.com/?q=Sai%20Kalyan%20Mandap%20Kumbharpada%20Road%20Puri"
                target="_blank"
                rel="noreferrer noopener"
                className="luxury-button mt-4 inline-flex"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
