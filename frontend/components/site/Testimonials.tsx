"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";
import { Reveal } from "./motion";
import { TESTIMONIALS } from "@/data/site";
import type { TestimonialItem } from "@/types/site";

const StarRow = ({ n = 5 }: { n?: number }) => (
  <div className="flex gap-1 text-accent">
    {[...Array(5)].map((_, s) => (
      <Star key={s} size={18} fill={s < n ? "currentColor" : "none"} className={s < n ? "" : "text-slate-300"} />
    ))}
  </div>
);

export const Testimonials = () => {
  const [dbItems, setDbItems] = useState<TestimonialItem[] | null>(null);

  useEffect(() => {
    fetch("/api/site-data")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          setDbItems(
            data.testimonials.map((t: any) => ({
              name: t.name,
              role: t.role,
              text: t.text,
              rating: t.rating || 5,
              photo: t.photo || null,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const items: TestimonialItem[] = dbItems || TESTIMONIALS.map((t) => ({ ...t, rating: 5 }));

  return (
    <section id="depoimentos" data-testid="testimonials" className="py-24 md:py-32 bg-surface">
      <div className="container-x">
        <div className="max-w-2xl mb-12">
          <Reveal>
            <span className="overline text-secondary">Depoimentos</span>
            <h2 className="mt-4 font-heading text-4xl md:text-5xl font-bold tracking-tight text-primary leading-tight">
              A confiança de quem já foi atendido
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.slice(0, 6).map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              className="relative flex flex-col rounded-2xl border border-slate-100 bg-white p-8 shadow-soft"
              data-testid={`testimonial-${i}`}
            >
              <Quote className="absolute top-6 right-6 text-accent/20" size={44} />
              <StarRow n={t.rating} />
              <blockquote className="mt-5 flex-1 text-lg italic text-slate-700 leading-relaxed line-clamp-6">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                {t.photo ? (
                  <Image
                    src={t.photo}
                    alt={t.name}
                    width={40}
                    height={40}
                    unoptimized
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-heading font-bold text-primary">
                    {t.name?.charAt(0) || "C"}
                  </span>
                )}
                <div>
                  <div className="font-heading font-semibold text-primary leading-tight">{t.name}</div>
                  <div className="text-sm text-slate-400">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};
