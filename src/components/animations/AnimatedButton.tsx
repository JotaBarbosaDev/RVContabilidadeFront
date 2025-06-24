import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export function AnimatedButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
}: AnimatedButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variantClasses = {
    primary: "bg-accounting-primary text-white hover:bg-accounting-primary/90 focus-visible:ring-accounting-primary",
    secondary: "bg-accounting-secondary text-white hover:bg-accounting-secondary/90 focus-visible:ring-accounting-secondary",
    outline: "border-2 border-accounting-primary text-accounting-primary hover:bg-accounting-primary hover:text-white focus-visible:ring-accounting-primary",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}

interface PulseButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function PulseButton({
  children,
  onClick,
  className = "",
  disabled = false,
}: PulseButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(59, 130, 246, 0.4)",
          "0 0 0 10px rgba(59, 130, 246, 0)",
          "0 0 0 0 rgba(59, 130, 246, 0)",
        ],
      }}
      transition={{
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      className={`relative overflow-hidden rounded-lg bg-accounting-primary text-white font-medium transition-colors hover:bg-accounting-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accounting-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}
