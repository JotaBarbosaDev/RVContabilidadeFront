import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface CounterProps {
  from: number;
  to: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export function Counter({ from, to, duration = 2, suffix = "", className = "" }: CounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [current, setCurrent] = useState(from);

  useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration,
        ease: "easeInOut",
        onUpdate: (value) => setCurrent(Math.round(value)),
      });
      return controls.stop;
    }
  }, [isInView, from, to, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      <span>{current}{suffix}</span>
    </motion.div>
  );
}

interface FloatingElementProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export function FloatingElement({ 
  children, 
  duration = 3, 
  delay = 0, 
  className = "" 
}: FloatingElementProps) {
  return (
    <motion.div
      animate={{
        y: [-10, 10, -10],
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface GlowEffectProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export function GlowEffect({ 
  children, 
  color = "rgba(59, 130, 246, 0.3)", 
  className = "" 
}: GlowEffectProps) {
  return (
    <motion.div
      whileHover={{
        boxShadow: `0 0 20px ${color}, 0 0 40px ${color}, 0 0 60px ${color}`,
        scale: 1.02,
      }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
