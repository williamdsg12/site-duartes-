"use client";

import { useEffect, useState } from "react";
import useLenis from "@/hooks/useLenis";
import { Loader } from "@/components/site/Loader";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Differentials } from "@/components/site/Differentials";
import { HowItWorks } from "@/components/site/HowItWorks";
import { ServiceArea } from "@/components/site/ServiceArea";
import { Gallery } from "@/components/site/Gallery";
import { Testimonials } from "@/components/site/Testimonials";
import { FAQ } from "@/components/site/FAQ";
import { CTAFinal } from "@/components/site/CTAFinal";
import { Footer } from "@/components/site/Footer";
import { FloatingButtons } from "@/components/site/FloatingButtons";

export default function Home() {
  const [loading, setLoading] = useState(true);
  useLenis();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="App">
      <Loader show={loading} />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Differentials />
        <HowItWorks />
        <ServiceArea />
        <Gallery />
        <Testimonials />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
