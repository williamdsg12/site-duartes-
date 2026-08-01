"use client";

import { useState, useEffect } from "react";
import { MapPin, Navigation } from "lucide-react";
import { Reveal } from "./motion";
import { waLink, DEFAULT_WA_MSG } from "@/data/site";

const defaultCities = [
  "Paranavaí", "Nova Esperança", "Alto Paraná", "Mandaguaçu", "Loanda",
  "Terra Rica", "Cruzeiro do Sul", "Paraíso do Norte", "Tamboara", "Amaporã",
];

export const ServiceArea = () => {
  const [areaData, setAreaData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/site-data")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.serviceArea) {
          setAreaData(data.serviceArea);
        }
      })
      .catch(() => {});
  }, []);

  const badgeText = areaData?.badgeText || "Área de Atendimento";
  const titleText = areaData?.title || "Atendemos Paranavaí e toda a Região Noroeste do Paraná";
  const descText =
    areaData?.description ||
    "Nossa equipe se desloca com agilidade para atender residências, empresas e condomínios em toda a região.";
  const cities = Array.isArray(areaData?.cities) && areaData.cities.length > 0 ? areaData.cities : defaultCities;
  const mapUrl = areaData?.mapUrl || "https://www.google.com/maps?q=Paranava%C3%AD,PR&z=11&output=embed";

  return (
    <section id="area" data-testid="service-area" className="py-24 md:py-32 bg-surface">
      <div className="container-x grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div>
          <Reveal>
            <span className="overline text-secondary">{badgeText}</span>
            <h2 className="mt-4 font-heading text-4xl md:text-5xl font-bold tracking-tight text-primary leading-tight">
              {titleText}
            </h2>
            <p className="mt-6 text-slate-600 text-lg leading-relaxed">
              {descText}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {cities.map((c: string) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-primary"
                >
                  <MapPin size={14} className="text-accent" /> {c}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <a
              href={waLink(DEFAULT_WA_MSG)}
              target="_blank"
              rel="noreferrer"
              data-testid="area-cta"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-bold text-white transition-transform duration-300 hover:scale-[1.03]"
            >
              <Navigation size={18} /> Sua cidade está na lista? Fale conosco
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-soft">
            <iframe
              title="Área de atendimento - Paranavaí"
              src={mapUrl}
              width="100%"
              height="440"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
};
