"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface LoaderProps {
  show: boolean;
}

export const Loader = ({ show }: LoaderProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          data-testid="loader"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-primary"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-24 w-24 overflow-hidden rounded-full ring-2 ring-white/20"
            >
              <Image
                src="/assets/logo.png"
                alt="Duarte's"
                width={96}
                height={96}
                className="h-full w-full object-cover"
                priority
              />
            </motion.div>
            <div className="h-[3px] w-40 overflow-hidden rounded-full bg-white/15">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />
            </div>
            <span className="text-white/60 text-xs tracking-[0.3em] uppercase font-medium">
              Carregando
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
