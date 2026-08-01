"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Instagram, ChevronLeft, ChevronRight, Play, Heart, ExternalLink } from "lucide-react";
import { Reveal } from "./motion";
import { GALLERY, CONTACT } from "@/data/site";

interface PostItem {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  thumbnail_url: string;
  permalink: string;
  timestamp?: string;
  like_count?: number | null;
}

export const Gallery = () => {
  const [posts, setPosts] = useState<PostItem[] | null>(null);
  const [profileUrl, setProfileUrl] = useState<string>(CONTACT.instagram);
  const [username, setUsername] = useState<string>("duarteslimpezacaixadeagua");
  const [loading, setLoading] = useState(true);

  // Embla Carousel Hook
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
      dragFree: false,
    },
    [
      Autoplay({
        delay: 3500,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    fetch("/api/instagram/feed")
      .then((res) => res.json())
      .then((data) => {
        if (data.profileUrl) setProfileUrl(data.profileUrl);
        if (data.username) setUsername(data.username);

        if (data && Array.isArray(data.items) && data.items.length > 0) {
          setPosts(data.items);
        } else {
          setPosts(
            GALLERY.map((g, i) => ({
              id: `fallback-${i}`,
              caption: g.alt,
              media_type: "IMAGE",
              media_url: g.src,
              thumbnail_url: g.src,
              permalink: data.profileUrl || CONTACT.instagram,
            }))
          );
        }
      })
      .catch(() => {
        setPosts(
          GALLERY.map((g, i) => ({
            id: `fallback-${i}`,
            caption: g.alt,
            media_type: "IMAGE",
            media_url: g.src,
            thumbnail_url: g.src,
            permalink: CONTACT.instagram,
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
    } catch {
      return "";
    }
  };

  return (
    <section id="galeria" data-testid="gallery" className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container-x">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <Reveal>
              <span className="overline text-secondary">Galeria Instagram</span>
              <h2 className="mt-4 font-heading text-4xl md:text-5xl font-bold tracking-tight text-primary leading-tight">
                Nosso trabalho de perto
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="flex items-center gap-3">
              {/* Manual Navigation Arrows */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={scrollPrev}
                  aria-label="Anterior"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-primary shadow-xs transition-colors hover:bg-primary hover:text-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={scrollNext}
                  aria-label="Próximo"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-primary shadow-xs transition-colors hover:bg-primary hover:text-white"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Dynamic Instagram Follow Button */}
              <a
                href={profileUrl}
                target="_blank"
                rel="noreferrer"
                data-testid="gallery-instagram-link"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-primary shadow-soft transition-colors hover:bg-primary hover:text-white"
              >
                <Instagram size={18} /> Seguir no Instagram
              </a>
            </div>
          </Reveal>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* Instagram Feed Embla Carousel */}
        {!loading && posts && (
          <Reveal delay={0.2}>
            <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
              <div className="flex -ml-4">
                {posts.map((post, i) => (
                  <div
                    key={post.id || i}
                    className="flex-[0_0_80%] sm:flex-[0_0_45%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] xl:flex-[0_0_20%] pl-4"
                  >
                    <a
                      href={post.permalink || profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={post.caption || "Ver post no Instagram"}
                      className="group relative block aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                    >
                      <Image
                        src={post.thumbnail_url || post.media_url}
                        alt={post.caption}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Video Type Badge */}
                      {post.media_type === "VIDEO" && (
                        <span className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/70 text-white backdrop-blur-xs">
                          <Play size={14} fill="currentColor" />
                        </span>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-between text-white">
                        <div className="flex items-center justify-between text-xs text-white/80">
                          <span className="inline-flex items-center gap-1">
                            <Instagram size={14} /> @{username}
                          </span>
                          {post.timestamp && <span>{formatDate(post.timestamp)}</span>}
                        </div>

                        <div>
                          <p className="text-xs line-clamp-3 leading-relaxed text-white/90">
                            {post.caption}
                          </p>

                          <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/20 text-xs font-semibold">
                            {post.like_count ? (
                              <span className="inline-flex items-center gap-1 text-accent">
                                <Heart size={14} fill="currentColor" /> {post.like_count}
                              </span>
                            ) : (
                              <span className="text-accent font-bold">Ver publicação</span>
                            )}
                            <ExternalLink size={14} className="text-white/80" />
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
};
