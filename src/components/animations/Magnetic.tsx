"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  speed?: number;
  borderRadius?: string;
}

export function Magnetic({
  children,
  className = "",
  intensity = 0.3,
  speed = 0.2,
  borderRadius = "0px",
}: MagneticProps) {
  const magneticRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!magneticRef.current) return;

    const magnetic = magneticRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = magnetic.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const deltaX = (e.clientX - centerX) * intensity;
      const deltaY = (e.clientY - centerY) * intensity;

      gsap.to(magnetic, {
        x: deltaX,
        y: deltaY,
        duration: speed,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(magnetic, {
        x: 0,
        y: 0,
        duration: speed * 2,
        ease: "elastic.out(1, 0.3)",
      });
    };

    magnetic.addEventListener("mousemove", handleMouseMove);
    magnetic.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      magnetic.removeEventListener("mousemove", handleMouseMove);
      magnetic.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [intensity, speed]);

  return (
    <div
      ref={magneticRef}
      className={`inline-block ${className}`}
      style={{ borderRadius }}
    >
      {children}
    </div>
  );
}
