"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: Record<string, string | number>;
  to?: Record<string, string | number>;
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "center" | "right";
  onLetterAnimationComplete?: () => void;
}

export function SplitText({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
}: SplitTextProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const element = textRef.current;
    
    // Split text based on splitType
    let splitElements: HTMLElement[] = [];
    
    if (splitType === "chars") {
      const chars = text.split("");
      element.innerHTML = chars
        .map((char) => `<span class="inline-block">${char === " " ? "&nbsp;" : char}</span>`)
        .join("");
      splitElements = Array.from(element.querySelectorAll("span"));
    } else if (splitType === "words") {
      const words = text.split(" ");
      element.innerHTML = words
        .map((word) => `<span class="inline-block mr-2">${word}</span>`)
        .join("");
      splitElements = Array.from(element.querySelectorAll("span"));
    }

    // Set initial state
    gsap.set(splitElements, from);

    // Create animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: `top ${100 - threshold * 100}%`,
        toggleActions: "play none none none",
      },
    });

    tl.to(splitElements, {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
      onComplete: onLetterAnimationComplete,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [text, delay, duration, ease, splitType, from, to, threshold, rootMargin, onLetterAnimationComplete]);

  return (
    <div
      ref={textRef}
      className={`${className} ${textAlign === "center" ? "text-center" : textAlign === "right" ? "text-right" : "text-left"}`}
      style={{ textAlign }}
    >
      {text}
    </div>
  );
}

// Componente adicional para texto com efeito de revelação
export function SplitTextReveal({
  text,
  className = "",
  delay = 50,
  duration = 0.8,
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <SplitText
      text={text}
      className={className}
      delay={delay}
      duration={duration}
      splitType="chars"
      from={{ opacity: 0, y: 50, rotateX: -90 }}
      to={{ opacity: 1, y: 0, rotateX: 0 }}
      ease="back.out(1.7)"
    />
  );
}
