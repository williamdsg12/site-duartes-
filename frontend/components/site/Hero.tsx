"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { MessageCircle, FileText, Zap, Clock, Users, MapPin } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { MaskLine } from "./motion";
import { waLink, DEFAULT_WA_MSG } from "@/data/site";

const badges = [
  { icon: Zap, label: "Atendimento rápido" },
  { icon: Clock, label: "5 anos de experiência" },
  { icon: Users, label: "Equipe especializada" },
  { icon: MapPin, label: "Paranavaí e Região Noroeste" },
];

export const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [heroData, setHeroData] = useState<{
    badgeText?: string;
    titleLine1?: string;
    titleLine2?: string;
    titleLine3?: string;
    subtitle?: string;
    videoUrl?: string;
    posterUrl?: string;
    button1Text?: string;
    button1Link?: string;
    button2Text?: string;
    button2Link?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/site-data")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hero) {
          setHeroData(data.hero);
        }
      })
      .catch(() => {});
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  const badgeText = heroData?.badgeText || "Há 5 anos em Paranavaí e Região";
  const titleLine1 = heroData?.titleLine1 || "Duarte's Limpezas,";
  const titleLine2 = heroData?.titleLine2 || "Desentupidora";
  const titleLine3 = heroData?.titleLine3 || "Manutenções";
  const subtitle =
    heroData?.subtitle ||
    "Soluções completas em limpeza, desentupimento e manutenção para residências, empresas e condomínios.";
  const videoUrl = heroData?.videoUrl || "/assets/hero-video.mp4";
  const posterUrl = heroData?.posterUrl || "/assets/gallery/g4.jpg";
  const b1Text = heroData?.button1Text || "Solicitar Orçamento";
  const b1Link =
    heroData?.button1Link || waLink("Olá! Gostaria de solicitar um orçamento com a Duarte's.");
  const b2Text = heroData?.button2Text || "Falar no WhatsApp";
  const b2Link = heroData?.button2Link || waLink(DEFAULT_WA_MSG);

  return (
    <section
      id="top"
      ref={ref}
      data-testid="hero"
      className="relative min-h-[100svh] w-full overflow-hidden bg-primary"
    >
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <video
          className="h-[120%] w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={posterUrl}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </motion.div>

      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 z-10 bg-gradient-to-r from-primary via-primary/85 to-primary/40"
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary/90 via-transparent to-primary/30" />

      <div className="relative z-20 container-x flex min-h-[100svh] flex-col justify-center pt-28 pb-32">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="overline text-accent mb-6"
        >
          {badgeText}
        </motion.span>

        <h1 className="font-heading font-extrabold text-white tracking-tighter leading-[0.95] text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
          <MaskLine delay={0.5}>{titleLine1}</MaskLine>
          <MaskLine delay={0.62}>
            <span className="text-accent">{titleLine2}</span> e
          </MaskLine>
          <MaskLine delay={0.74}>{titleLine3}</MaskLine>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-7 max-w-xl text-base md:text-lg text-white/80 leading-relaxed"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.8 }}
          className="mt-9 flex flex-col sm:flex-row gap-4"
        >
          <a
            href={b1Link}
            target="_blank"
            rel="noreferrer"
            data-testid="hero-orcamento-btn"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 font-bold text-accent-foreground shadow-cta transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            <FileText size={20} /> {b1Text}
          </a>
          <a
            href={b2Link}
            target="_blank"
            rel="noreferrer"
            data-testid="hero-whatsapp-btn"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/20"
          >
            <MessageCircle size={20} /> {b2Text}
          </a>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6 max-w-3xl"
        >
          {badges.map((b) => (
            <li key={b.label} className="flex items-center gap-2.5 text-white/85">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                <b.icon size={16} />
              </span>
              <span className="text-xs md:text-sm font-medium">{b.label}</span>
            </li>
          ))}
        </motion.ul>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/40 p-1.5">
          <motion.div
            className="h-2 w-1 rounded-full bg-accent"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
          />
        </div>
      </motion.div>
    </section>
  );
};
