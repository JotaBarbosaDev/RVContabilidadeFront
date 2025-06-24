"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  animateBy?: "words" | "chars";
  onAnimationComplete?: () => void;
}

export function BlurText({
  text,
  className = "",
  delay = 200,
  animateBy = "words",
  onAnimationComplete,
}: BlurTextProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const element = textRef.current;
    
    // Split text based on animateBy
    let splitElements: HTMLElement[] = [];
    
    if (animateBy === "words") {
      const words = text.split(" ");
      element.innerHTML = words
        .map((word) => `<span class="inline-block mr-2">${word}</span>`)
        .join("");
      splitElements = Array.from(element.querySelectorAll("span"));
    } else {
      const chars = text.split("");
      element.innerHTML = chars
        .map((char) => `<span class="inline-block">${char === " " ? "&nbsp;" : char}</span>`)
        .join("");
      splitElements = Array.from(element.querySelectorAll("span"));
    }

    // Set initial state
    gsap.set(splitElements, { 
      filter: "blur(10px)",
      opacity: 0 
    });

    // Create animation
    const tl = gsap.timeline();
    
    tl.to(splitElements, {
      filter: "blur(0px)",
      opacity: 1,
      duration: 1.2,
      ease: "power2.out",
      stagger: delay / 1000,
      onComplete: onAnimationComplete,
    });

    return () => {
      tl.kill();
    };
  }, [text, delay, animateBy, onAnimationComplete]);

  return (
    <div
      ref={textRef}
      className={className}
    >
      {text}
    </div>
  );
}
