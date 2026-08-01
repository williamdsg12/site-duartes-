"use client";

import { motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { MaskLine } from "./motion";
import { CONTACT, waLink, DEFAULT_WA_MSG } from "@/data/site";

export const CTAFinal = () => {
  return (
    <section data-testid="cta-final" className="relative overflow-hidden bg-primary py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-30 grain" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />

      <div className="container-x relative text-center max-w-3xl mx-auto">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="overline text-accent"
        >
          Vamos resolver agora
        </motion.span>
        <h2 className="mt-5 font-heading text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
          <MaskLine>Precisando de uma empresa</MaskLine>
          <MaskLine delay={0.08}>especializada?</MaskLine>
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-lg text-white/80"
        >
          Solicite agora mesmo um orçamento sem compromisso. Atendimento rápido e profissional.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
        >
          <a
            href={waLink(DEFAULT_WA_MSG)}
            target="_blank"
            rel="noreferrer"
            data-testid="cta-final-whatsapp"
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-accent px-8 py-5 text-lg font-bold text-accent-foreground shadow-cta transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            <MessageCircle size={22} /> WhatsApp
          </a>
          <a
            href={`tel:+${CONTACT.phoneRaw}`}
            data-testid="cta-final-call"
            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-8 py-5 text-lg font-bold text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/20"
          >
            <Phone size={22} /> Ligar Agora
          </a>
        </motion.div>
      </div>
    </section>
  );
};
