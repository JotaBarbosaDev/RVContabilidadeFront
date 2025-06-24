"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FadeInUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  trigger?: boolean;
}

export function FadeInUp({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  y = 30,
  trigger = true,
}: FadeInUpProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    gsap.set(element, {
      opacity: 0,
      y: y,
    });

    if (trigger) {
      gsap.to(element, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    } else {
      gsap.to(element, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: "power2.out",
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [delay, duration, y, trigger]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

interface ScaleInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  scale?: number;
  trigger?: boolean;
}

export function ScaleIn({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  scale = 0.8,
  trigger = true,
}: ScaleInProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    gsap.set(element, {
      opacity: 0,
      scale: scale,
    });

    if (trigger) {
      gsap.to(element, {
        opacity: 1,
        scale: 1,
        duration,
        delay,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    } else {
      gsap.to(element, {
        opacity: 1,
        scale: 1,
        duration,
        delay,
        ease: "back.out(1.7)",
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [delay, duration, scale, trigger]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
