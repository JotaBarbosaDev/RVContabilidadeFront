"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ShinyTextProps {
  text: string;
  className?: string;
  shimmerWidth?: number;
  animationSpeed?: number;
  background?: string;
  disabled?: boolean;
}

export function ShinyText({
  text,
  className = "",
  shimmerWidth = 100,
  animationSpeed = 2,
  background = "linear-gradient(110deg, #000 45%, #fff 55%, #000 65%)",
  disabled = false,
}: ShinyTextProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current || disabled) return;

    const element = textRef.current;
    
    gsap.set(element, {
      backgroundImage: background,
      backgroundSize: `${shimmerWidth}% 100%`,
      backgroundPosition: "-100% 0",
      backgroundRepeat: "no-repeat",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
    });

    const animation = gsap.to(element, {
      backgroundPosition: "200% 0",
      duration: animationSpeed,
      ease: "none",
      repeat: -1,
    });

    return () => {
      animation.kill();
    };
  }, [text, shimmerWidth, animationSpeed, background, disabled]);

  if (disabled) {
    return <div className={className}>{text}</div>;
  }

  return (
    <div
      ref={textRef}
      className={`inline-block ${className}`}
      style={{
        backgroundImage: background,
        backgroundSize: `${shimmerWidth}% 100%`,
        backgroundPosition: "-100% 0",
        backgroundRepeat: "no-repeat",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
      }}
    >
      {text}
    </div>
  );
}
