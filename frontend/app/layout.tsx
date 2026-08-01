import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://manutencao-duartes.preview.emergentagent.com"),
  title: "Duarte's Limpezas | Desentupidora em Paranavaí",
  description:
    "Empresa especializada em limpeza de caixa d'água, desentupimento, hidrojateamento, limpeza de fossa, caixa de gordura, dedetização e manutenção hidráulica e elétrica em Paranavaí e Região Noroeste do Paraná.",
  keywords: [
    "desentupidora Paranavaí",
    "limpeza caixa d'água Paranavaí",
    "hidrojateamento Paranavaí",
    "limpeza caixa de gordura",
    "limpeza de fossa",
    "dedetização Paranavaí",
    "manutenção hidráulica",
    "manutenção elétrica",
  ],
  authors: [{ name: "Duarte's Limpezas, Desentupidora e Manutenções" }],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://manutencao-duartes.preview.emergentagent.com/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://manutencao-duartes.preview.emergentagent.com/",
    title: "Duarte's Limpezas | Desentupidora em Paranavaí",
    description:
      "Limpeza de caixa d'água, desentupimento, hidrojateamento, dedetização e manutenção hidráulica e elétrica em Paranavaí e Região Noroeste.",
    images: [
      {
        url: "/assets/logo-hero.png",
        width: 1200,
        height: 630,
        alt: "Duarte's Limpezas, Desentupidora e Manutenções",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Duarte's Limpezas | Desentupidora em Paranavaí",
    description:
      "Limpeza de caixa d'água, desentupimento, hidrojateamento, dedetização e manutenção hidráulica e elétrica em Paranavaí e Região Noroeste.",
    images: ["/assets/logo-hero.png"],
  },
  icons: {
    icon: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B3C5D",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Duarte's Limpezas, Desentupidora e Manutenções",
    image: "/assets/logo-hero.png",
    telephone: "+5544997069677",
    email: "duarteslimpezacaixadeagua@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Paulino Rech, 203",
      addressLocality: "Paranavaí",
      addressRegion: "PR",
      postalCode: "87702-430",
      addressCountry: "BR",
    },
    areaServed: "Paranavaí e Região Noroeste do Paraná",
    openingHours: "Mo-Fr 08:00-18:00",
  };

  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
