"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Droplets, Waves, Gauge, Trash2, Bug, Wrench, Zap } from "lucide-react";
import { Reveal } from "./motion";
import { SERVICES, waLink } from "@/data/site";

const ICON_MAP: Record<string, any> = {
  Droplets,
  Waves,
  Gauge,
  Trash2,
  Bug,
  Wrench,
  Zap,
};

export const Services = () => {
  const [serviceList, setServiceList] = useState<any[] | null>(null);

  useEffect(() => {
    fetch("/api/site-data")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.services) && data.services.length > 0) {
          setServiceList(data.services);
        }
      })
      .catch(() => {});
  }, []);

  const list = serviceList || SERVICES.map((s) => ({ ...s, desc: s.desc, iconName: s.icon }));

  return (
    <section id="servicos" data-testid="services" className="py-24 md:py-32 bg-surface">
      <div className="container-x">
        <div className="max-w-2xl mb-14">
          <Reveal>
            <span className="overline text-secondary">Nossos Serviços</span>
            <h2 className="mt-4 font-heading text-4xl md:text-5xl font-bold tracking-tight text-primary leading-tight">
              Tudo o que sua casa ou empresa precisa
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((s, i) => {
            const IconComp =
              typeof s.icon === "string"
                ? ICON_MAP[s.icon] || Wrench
                : s.icon || Wrench;

            return (
              <motion.div
                key={s.title || i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: [0.25, 1, 0.5, 1] }}
                className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-lift hover:border-primary/20"
                data-testid={`service-card-${i}`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-secondary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  <IconComp size={26} strokeWidth={1.6} />
                </div>
                <h3 className="mt-5 font-heading text-xl font-semibold text-primary">
                  {s.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-slate-500 leading-relaxed">
                  {s.description || s.desc}
                </p>
                <a
                  href={s.buttonLink || waLink(`Olá! Gostaria de um orçamento para: ${s.title}.`)}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={`service-cta-${i}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-secondary transition-colors group-hover:text-primary"
                >
                  {s.buttonText || "Solicitar orçamento"}
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
