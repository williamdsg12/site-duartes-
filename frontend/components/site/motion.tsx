"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export const fadeUp = {
  initial: { y: 40, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
};

export const stagger = {
  initial: {},
  whileInView: {},
  viewport: { once: true, margin: "-80px" },
  transition: { staggerChildren: 0.09 },
};

export const childUp = {
  initial: { y: 30, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

interface MaskLineProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function MaskLine({ children, delay = 0, className = "" }: MaskLineProps) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "110%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
