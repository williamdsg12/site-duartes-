"use client";

import { motion } from "framer-motion";
import { Reveal } from "./motion";
import { DIFFERENTIALS } from "@/data/site";

export const Differentials = () => {
  return (
    <section id="diferenciais" data-testid="differentials" className="py-24 md:py-32 bg-primary relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="container-x relative">
        <div className="max-w-2xl mb-14">
          <Reveal>
            <span className="overline text-accent">Por que escolher a Duarte&apos;s</span>
            <h2 className="mt-4 font-heading text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Nossos diferenciais
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {DIFFERENTIALS.map((d, i) => (
            <motion.div
              key={d.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 5) * 0.06 }}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors duration-300 hover:bg-white/10"
              data-testid={`differential-${i}`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent transition-transform duration-300 group-hover:scale-110">
                <d.icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold text-white leading-snug">
                {d.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
