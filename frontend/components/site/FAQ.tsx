"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "./motion";
import { FAQS, waLink, DEFAULT_WA_MSG } from "@/data/site";

export const FAQ = () => {
  const [open, setOpen] = useState<number>(0);
  const [faqList, setFaqList] = useState<any[] | null>(null);

  useEffect(() => {
    fetch("/api/site-data")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.faqs) && data.faqs.length > 0) {
          setFaqList(data.faqs);
        }
      })
      .catch(() => {});
  }, []);

  const list = faqList || FAQS.map((f) => ({ q: f.q, a: f.a }));

  return (
    <section id="faq" data-testid="faq" className="py-24 md:py-32 bg-white">
      <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <Reveal>
            <span className="overline text-secondary">Perguntas Frequentes</span>
            <h2 className="mt-4 font-heading text-4xl md:text-5xl font-bold tracking-tight text-primary leading-tight">
              Tire suas dúvidas
            </h2>
            <p className="mt-6 text-slate-600 leading-relaxed">
              Não encontrou o que procurava? Fale com a gente pelo WhatsApp.
            </p>
            <a
              href={waLink(DEFAULT_WA_MSG)}
              target="_blank"
              rel="noreferrer"
              data-testid="faq-cta"
              className="mt-5 inline-flex rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground shadow-cta transition-transform hover:scale-[1.03]"
            >
              Falar no WhatsApp
            </a>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          {list.map((f, i) => {
            const isOpen = open === i;
            const questionText = f.question || f.q;
            const answerText = f.answer || f.a;

            return (
              <div key={i} className="border-b border-slate-200" data-testid={`faq-item-${i}`}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                  data-testid={`faq-trigger-${i}`}
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-lg md:text-xl font-semibold text-primary">
                    {questionText}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      isOpen ? "bg-accent text-accent-foreground" : "bg-surface text-primary"
                    }`}
                  >
                    <Plus size={20} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-12 text-slate-600 leading-relaxed">{answerText}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
