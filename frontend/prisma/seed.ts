import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Admin User
  const passwordHash = await bcrypt.hash("duartes1234", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@duartes.com.br" },
    update: { passwordHash },
    create: {
      name: "Administrador Duarte's",
      email: "admin@duartes.com.br",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log("Admin user created/verified:", admin.email);

  // 2. SiteInfo
  await prisma.siteInfo.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      companyName: "Duarte's Limpezas, Desentupidora e Manutenções",
      slogan: "Soluções completas em limpeza, desentupimento e manutenção",
      description:
        "Empresa especializada em limpeza de caixa d'água, desentupimento, hidrojateamento, limpeza de fossa, caixa de gordura, dedetização e manutenção hidráulica e elétrica em Paranavaí e Região Noroeste do Paraná.",
      aboutText:
        "A Duarte's Limpezas, Desentupidora e Manutenções atua há 5 anos oferecendo serviços especializados para residências, empresas e condomínios. Nosso compromisso é entregar qualidade, segurança e agilidade em cada atendimento, utilizando equipamentos modernos e mão de obra qualificada.",
      phoneDisplay: "(44) 99706-9677",
      phoneRaw: "5544997069677",
      email: "duarteslimpezacaixadeagua@gmail.com",
      address: "Av. Paulino Rech, 203",
      city: "Paranavaí - PR",
      cep: "CEP 87702-430",
      hours: "Segunda a Sexta, 08h às 18h",
      region: "Paranavaí e toda Região Noroeste do Paraná",
    },
  });

  // 3. HeroBanner
  await prisma.heroBanner.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      badgeText: "Há 5 anos em Paranavaí e Região",
      titleLine1: "Duarte's Limpezas,",
      titleLine2: "Desentupidora e",
      titleLine3: "Manutenções",
      subtitle:
        "Soluções completas em limpeza, desentupimento e manutenção para residências, empresas e condomínios.",
      videoUrl: "/assets/hero-video.mp4",
      posterUrl: "/assets/gallery/g4.jpg",
      button1Text: "Solicitar Orçamento",
      button1Link:
        "https://wa.me/5544997069677?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento%20com%20a%20Duarte's.",
      button2Text: "Falar no WhatsApp",
      button2Link:
        "https://wa.me/5544997069677?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Duarte's%20e%20gostaria%20de%20solicitar%20um%20or%C3%A7amento.",
    },
  });

  // 4. Services
  const initialServices = [
    {
      title: "Limpeza de Caixa d'Água",
      description:
        "Higienização completa com produtos adequados, garantindo água limpa e segura para sua família.",
      icon: "Droplets",
      buttonText: "Solicitar orçamento",
      order: 1,
    },
    {
      title: "Desentupimento",
      description:
        "Desentupimento de pias, ralos, vasos e tubulações com equipamentos profissionais.",
      icon: "Waves",
      buttonText: "Solicitar orçamento",
      order: 2,
    },
    {
      title: "Hidrojateamento",
      description:
        "Limpeza de alta pressão para remover resíduos e restaurar o fluxo das tubulações.",
      icon: "Gauge",
      buttonText: "Solicitar orçamento",
      order: 3,
    },
    {
      title: "Limpeza de Caixa de Gordura",
      description:
        "Remoção e higienização de caixas de gordura para residências, comércios e condomínios.",
      icon: "Trash2",
      buttonText: "Solicitar orçamento",
      order: 4,
    },
    {
      title: "Dedetização",
      description:
        "Controle de pragas com produtos registrados e técnicas seguras para o ambiente.",
      icon: "Bug",
      buttonText: "Solicitar orçamento",
      order: 5,
    },
    {
      title: "Manutenção Hidráulica",
      description:
        "Reparos, instalações e manutenção preventiva em toda a parte hidráulica.",
      icon: "Wrench",
      buttonText: "Solicitar orçamento",
      order: 6,
    },
    {
      title: "Manutenção Elétrica",
      description:
        "Instalações e reparos elétricos com segurança e mão de obra qualificada.",
      icon: "Zap",
      buttonText: "Solicitar orçamento",
      order: 7,
    },
  ];

  for (const s of initialServices) {
    const existing = await prisma.serviceItem.findFirst({ where: { title: s.title } });
    if (!existing) {
      await prisma.serviceItem.create({ data: s });
    }
  }

  // 5. Gallery Media
  const initialGallery = [
    { src: "/assets/gallery/g1.jpg", alt: "Caixa d'água elevada e veículo da Duarte's", order: 1 },
    { src: "/assets/gallery/g2.jpg", alt: "Manutenção de boia e válvula em reservatório", order: 2 },
    { src: "/assets/gallery/g3.jpg", alt: "Interior de caixa d'água higienizada", order: 3 },
    { src: "/assets/gallery/g4.jpg", alt: "Reservatório durante processo de limpeza", order: 4 },
    { src: "/assets/gallery/g5.jpg", alt: "Inspeção interna de caixa d'água", order: 5 },
  ];

  for (const g of initialGallery) {
    const existing = await prisma.galleryMedia.findFirst({ where: { src: g.src } });
    if (!existing) {
      await prisma.galleryMedia.create({ data: g });
    }
  }

  // 6. Testimonials
  const initialTestimonials = [
    {
      name: "Cliente Residencial",
      role: "Paranavaí - PR",
      text: "Excelente atendimento. Muito rápido e serviço impecável na limpeza da caixa d'água.",
      rating: 5,
      order: 1,
    },
    {
      name: "Síndico de Condomínio",
      role: "Região Noroeste",
      text: "Equipe pontual e profissional. Resolveram o desentupimento do prédio no mesmo dia.",
      rating: 5,
      order: 2,
    },
    {
      name: "Estabelecimento Comercial",
      role: "Paranavaí - PR",
      text: "Contratamos a manutenção hidráulica e ficamos impressionados com o comprometimento.",
      rating: 5,
      order: 3,
    },
  ];

  for (const t of initialTestimonials) {
    const existing = await prisma.testimonialItem.findFirst({ where: { name: t.name, text: t.text } });
    if (!existing) {
      await prisma.testimonialItem.create({ data: t });
    }
  }

  // 7. FAQs
  const initialFaqs = [
    {
      question: "Quanto custa um desentupimento?",
      answer:
        "O valor varia conforme o tipo e a extensão do entupimento. Fazemos uma avaliação e enviamos um orçamento sem compromisso pelo WhatsApp.",
      order: 1,
    },
    {
      question: "Vocês atendem emergência?",
      answer:
        "Sim. Priorizamos atendimentos urgentes com agilidade. Entre em contato pelo WhatsApp e informamos a disponibilidade da equipe.",
      order: 2,
    },
    {
      question: "Atendem condomínios?",
      answer:
        "Sim. Atendemos residências, empresas e condomínios em Paranavaí e toda a Região Noroeste do Paraná.",
      order: 3,
    },
    {
      question: "Fazem limpeza de caixa d'água?",
      answer:
        "Sim. Realizamos higienização completa da caixa d'água, garantindo água limpa e segura para sua família ou empresa.",
      order: 4,
    },
    {
      question: "Qual região atendem?",
      answer: "Atendemos Paranavaí e toda a Região Noroeste do Paraná.",
      order: 5,
    },
    {
      question: "Como solicitar orçamento?",
      answer:
        "É simples: clique em qualquer botão de orçamento do site para falar direto no WhatsApp, ou ligue para nós. O orçamento é sem compromisso.",
      order: 6,
    },
  ];

  for (const f of initialFaqs) {
    const existing = await prisma.faqItem.findFirst({ where: { question: f.question } });
    if (!existing) {
      await prisma.faqItem.create({ data: f });
    }
  }

  // 8. ServiceAreaConfig
  await prisma.serviceAreaConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      badgeText: "Área de Atendimento",
      title: "Atendemos Paranavaí e toda a Região Noroeste do Paraná",
      description:
        "Nossa equipe se desloca com agilidade para atender residências, empresas e condomínios em toda a região.",
      citiesJson: JSON.stringify([
        "Paranavaí",
        "Nova Esperança",
        "Alto Paraná",
        "Mandaguaçu",
        "Loanda",
        "Terra Rica",
        "Cruzeiro do Sul",
        "Paraíso do Norte",
        "Tamboara",
        "Amaporã",
      ]),
      mapUrl: "https://www.google.com/maps?q=Paranava%C3%AD,PR&z=11&output=embed",
    },
  });

  // 9. SocialConfig
  await prisma.socialConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      instagram: "https://instagram.com/duarteslimpezacaixadeagua",
      facebook: "https://facebook.com/duarteslimpezacaixadeagua",
      whatsapp: "https://wa.me/5544997069677",
      activeInsta: true,
      activeFb: true,
      activeWa: true,
    },
  });

  // 10. SeoConfig
  await prisma.seoConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      metaTitle: "Duarte's Limpezas | Desentupidora em Paranavaí",
      metaDescription:
        "Empresa especializada em limpeza de caixa d'água, desentupimento, hidrojateamento, limpeza de fossa, caixa de gordura, dedetização e manutenção hidráulica e elétrica em Paranavaí e Região Noroeste do Paraná.",
      keywords:
        "desentupidora Paranavaí, limpeza caixa d'água Paranavaí, hidrojateamento Paranavaí, limpeza caixa de gordura, limpeza de fossa, dedetização Paranavaí, manutenção hidráulica, manutenção elétrica",
      ogTitle: "Duarte's Limpezas | Desentupidora em Paranavaí",
      ogDescription:
        "Limpeza de caixa d'água, desentupimento, hidrojateamento, dedetização e manutenção hidráulica e elétrica em Paranavaí e Região Noroeste.",
      ogImage: "/assets/logo-hero.png",
      twitterCard: "summary_large_image",
      canonicalUrl: "https://manutencao-duartes.preview.emergentagent.com/",
      robots: "index, follow",
    },
  });

  // 11. SiteSettings
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      logoUrl: "/assets/logo.png",
      logoHeroUrl: "/assets/logo-hero.png",
      faviconUrl: "/assets/logo.png",
      primaryColor: "#0B3C5D",
      accentColor: "#FFC107",
      footerText: "Há 5 anos oferecendo soluções completas em limpeza, desentupimento e manutenção.",
      copyrightText: "© 2026 Duarte's Limpezas, Desentupidora e Manutenções. Todos os direitos reservados.",
      waButtonText: "Orçamento Rápido",
      callButtonText: "Ligar Agora",
    },
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
