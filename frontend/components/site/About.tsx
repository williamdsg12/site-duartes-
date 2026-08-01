"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Reveal } from "./motion";

const points = [
  "Equipamentos modernos",
  "Mão de obra qualificada",
  "Qualidade e segurança",
  "Agilidade no atendimento",
];

export const About = () => {
  return (
    <section id="sobre" data-testid="about" className="py-24 md:py-32 bg-white">
      <div className="container-x grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-center">
        <div className="relative">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] shadow-lift h-[420px] md:h-[520px] w-full">
              <Image
                src="/assets/gallery/g2.jpg"
                alt="Profissional da Duarte's realizando manutenção"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover contrast-105 saturate-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>
          </Reveal>
          <motion.div
            initial={{ opacity: 0, y: 30, x: -20 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="absolute -bottom-8 -right-2 md:right-8 rounded-2xl bg-accent px-7 py-5 shadow-cta z-10"
          >
            <div className="font-heading text-4xl font-extrabold text-accent-foreground">5</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-accent-foreground/80">
              Anos de experiência
            </div>
          </motion.div>
        </div>

        <div>
          <Reveal>
            <span className="overline text-secondary">Quem Somos</span>
            <h2 className="mt-4 font-heading text-4xl md:text-5xl font-bold tracking-tight text-primary leading-tight">
              Soluções completas, feitas com compromisso
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-6 space-y-4 text-slate-600 leading-relaxed text-base md:text-lg">
              <p>
                A <strong className="text-primary">Duarte&apos;s Limpezas, Desentupidora e Manutenções</strong> atua
                há 5 anos oferecendo serviços especializados para residências, empresas e condomínios.
              </p>
              <p>
                Nosso compromisso é entregar qualidade, segurança e agilidade em cada atendimento,
                utilizando equipamentos modernos e mão de obra qualificada.
              </p>
              <p>
                Atendemos Paranavaí e toda a Região Noroeste, com soluções completas para limpeza,
                manutenção e desentupimento.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-3 text-primary font-medium">
                  <CheckCircle2 size={20} className="text-accent shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
