"use client";

import { motion } from "framer-motion";
import { Reveal } from "./motion";
import { STEPS } from "@/data/site";

export const HowItWorks = () => {
  return (
    <section id="como-funciona" data-testid="how-it-works" className="py-24 md:py-32 bg-white">
      <div className="container-x">
        <div className="max-w-2xl mb-16">
          <Reveal>
            <span className="overline text-secondary">Como Funciona</span>
            <h2 className="mt-4 font-heading text-4xl md:text-5xl font-bold tracking-tight text-primary leading-tight">
              Simples do início ao fim
            </h2>
          </Reveal>
        </div>

        <div className="relative pl-2">
          <div className="absolute left-[27px] top-2 bottom-2 w-[2px] bg-slate-200" />
          <div className="space-y-10">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="relative flex gap-6 md:gap-10"
                data-testid={`step-${i}`}
              >
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-slate-200 bg-white">
                  <span className="font-heading text-sm font-bold text-primary">{s.n}</span>
                  <span className="absolute inset-0 rounded-full ring-4 ring-accent/0 transition-all" />
                </div>
                <div className="pt-1 pb-2 flex-1 border-b border-slate-100">
                  <div className="flex items-baseline gap-4">
                    <span className="hidden md:block font-heading text-5xl font-bold text-primary/10">
                      {s.n}
                    </span>
                    <div>
                      <h3 className="font-heading text-xl md:text-2xl font-semibold text-primary">
                        {s.title}
                      </h3>
                      <p className="mt-1 text-slate-500 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
