import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedCard({ children, delay = 0, className = "" }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface FadeInUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FadeInUp({ children, delay = 0, className = "" }: FadeInUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface SlideInLeftProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function SlideInLeft({ children, delay = 0, className = "" }: SlideInLeftProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function ScaleIn({ children, delay = 0, className = "" }: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
