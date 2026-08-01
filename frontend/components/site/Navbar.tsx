"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { NAV_LINKS, waLink, DEFAULT_WA_MSG } from "@/data/site";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      data-testid="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-xl border-b border-slate-100 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="container-x flex items-center justify-between">
        <a href="#top" data-testid="navbar-logo" className="flex items-center gap-3">
          <Image
            src="/assets/logo.png"
            alt="Duarte's Limpezas"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover ring-1 ring-slate-200"
          />
          <span
            className={`font-heading font-bold leading-tight text-xl md:text-2xl transition-colors ${
              scrolled ? "text-primary" : "text-white"
            }`}
          >
            Duarte&apos;s
            <span className="block text-[10px] font-body font-medium tracking-[0.2em] opacity-70">
              LIMPEZAS E MANUTENÇÕES
            </span>
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-${l.href.replace("#", "")}`}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                scrolled ? "text-slate-700" : "text-white/90"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href={waLink(DEFAULT_WA_MSG)}
          target="_blank"
          rel="noreferrer"
          data-testid="navbar-cta"
          className="hidden sm:inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-cta transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
        >
          Solicitar Orçamento
        </a>

        <button
          data-testid="mobile-menu-toggle"
          onClick={() => setOpen(!open)}
          className={`lg:hidden p-2 ${scrolled ? "text-primary" : "text-white"}`}
          aria-label="Menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-white border-b border-slate-100"
          >
            <div className="container-x py-6 flex flex-col gap-4">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-slate-700 font-medium py-1"
                  data-testid={`mobile-nav-${l.href.replace("#", "")}`}
                >
                  {l.label}
                </a>
              ))}
              <a
                href={waLink(DEFAULT_WA_MSG)}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex justify-center items-center rounded-full bg-accent px-5 py-3 font-bold text-accent-foreground"
              >
                Solicitar Orçamento
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
