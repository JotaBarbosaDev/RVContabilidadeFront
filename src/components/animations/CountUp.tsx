"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  separator?: string;
  decimalPlaces?: number;
  easing?: string;
  onUpdate?: (value: number) => void;
  onComplete?: () => void;
}

export function CountUp({
  from = 0,
  to,
  duration = 2,
  className = "",
  suffix = "",
  prefix = "",
  separator = "",
  decimalPlaces = 0,
  easing = "power2.out",
  onUpdate,
  onComplete,
}: CountUpProps) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const currentValue = useRef(from);

  useEffect(() => {
    if (!numberRef.current) return;

    const obj = { value: from };
    
    const animation = gsap.to(obj, {
      value: to,
      duration,
      ease: easing,
      onUpdate: () => {
        if (numberRef.current) {
          const formattedValue = formatNumber(obj.value, decimalPlaces, separator);
          numberRef.current.textContent = `${prefix}${formattedValue}${suffix}`;
          currentValue.current = obj.value;
          onUpdate?.(obj.value);
        }
      },
      onComplete: () => {
        onComplete?.();
      },
    });

    return () => {
      animation.kill();
    };
  }, [from, to, duration, easing, suffix, prefix, separator, decimalPlaces, onUpdate, onComplete]);

  const formatNumber = (value: number, decimals: number, sep: string) => {
    const number = Number(value.toFixed(decimals));
    
    if (sep) {
      return number.toLocaleString();
    }
    
    return number.toString();
  };

  return (
    <span ref={numberRef} className={className}>
      {prefix}{formatNumber(from, decimalPlaces, separator)}{suffix}
    </span>
  );
}
