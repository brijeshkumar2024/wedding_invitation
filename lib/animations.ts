"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function initGsap() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power4.out" });
  registered = true;
}

export function luxuryFadeUp(target: gsap.TweenTarget, delay = 0) {
  return gsap.fromTo(
    target,
    { y: 32, opacity: 0, filter: "blur(10px)" },
    {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.1,
      delay,
      ease: "expo.out"
    }
  );
}
