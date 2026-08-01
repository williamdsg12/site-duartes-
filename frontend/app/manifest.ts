import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Duarte's Limpezas, Desentupidora e Manutenções",
    short_name: "Duarte's",
    description:
      "Empresa especializada em limpeza de caixa d'água, desentupimento, hidrojateamento, limpeza de fossa, caixa de gordura, dedetização e manutenção hidráulica e elétrica em Paranavaí e Região Noroeste do Paraná.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B3C5D",
    theme_color: "#0B3C5D",
    icons: [
      {
        src: "/assets/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/assets/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
