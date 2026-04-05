"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { initGsap } from "@/lib/animations";

const events = [
  { time: "7:00 PM", title: "Guest Arrival", desc: "Warm welcome for friends and family at Sai Kalyan Mandap." },
  { time: "7:30 PM", title: "Engagement Ceremony", desc: "Ritupurna and Abhisek exchange rings in the presence of loved ones." },
  { time: "8:30 PM", title: "Blessings & Family Moments", desc: "A heartfelt celebration with the Singh and Mohanty family." },
  { time: "9:00 PM onwards", title: "Dinner & Celebration", desc: "An evening of joy, music, and togetherness in Puri." }
];

export default function Timeline() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    initGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".timeline-line",
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 70%",
            end: "bottom 80%",
            scrub: true
          }
        }
      );

      gsap.utils.toArray<HTMLElement>(".timeline-card").forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: index % 2 === 0 ? -40 : 40,
            y: 16,
            filter: "blur(6px)"
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: card,
              start: "top 84%"
            }
          }
        );
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="timeline" ref={ref} className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <p className="section-kicker">Engagement Timeline</p>
        <h3 className="section-title">An Evening In Chapters</h3>

        <div className="relative mt-12 grid gap-7">
          <div className="timeline-line absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-linear-to-b from-[#D4AF37]/25 via-[#D4AF37] to-[#D4AF37]/20 md:block" />
          {events.map((event, index) => (
            <article
              key={event.title}
              className={`timeline-card glass-card p-6 md:w-[47%] ${index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"}`}
            >
              <p className="text-xs tracking-[0.24em] text-[#D4AF37]">{event.time}</p>
              <h4 className="mt-2 font-heading text-2xl text-white">{event.title}</h4>
              <p className="mt-2 text-sm text-white/72">{event.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
