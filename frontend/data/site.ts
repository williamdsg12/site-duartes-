import {
  Droplets,
  Waves,
  Gauge,
  Trash2,
  Bug,
  Wrench,
  Zap,
  Clock,
  FileCheck,
  Home,
  Building2,
  Building,
  Cog,
  Users,
  HeartHandshake,
  Timer,
  ShieldCheck,
} from "lucide-react";
import type {
  ContactInfo,
  NavLink,
  ServiceItem,
  DifferentialItem,
  StepItem,
  GalleryItem,
  TestimonialItem,
  FaqItem,
} from "@/types/site";

export const CONTACT: ContactInfo = {
  phoneDisplay: "(44) 99706-9677",
  phoneRaw: "5544997069677",
  email: "duarteslimpezacaixadeagua@gmail.com",
  instagram: "https://instagram.com/duarteslimpezacaixadeagua",
  instagramHandle: "@duarteslimpezacaixadeagua",
  facebook: "https://facebook.com/duarteslimpezacaixadeagua",
  address: "Av. Paulino Rech, 203",
  city: "Paranavaí - PR",
  cep: "CEP 87702-430",
  hours: "Segunda a Sexta, 08h às 18h",
  region: "Paranavaí e toda Região Noroeste do Paraná",
};

export const waLink = (msg: string): string =>
  `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent(msg)}`;

export const DEFAULT_WA_MSG =
  "Olá! Vim pelo site da Duarte's e gostaria de solicitar um orçamento.";

export const NAV_LINKS: NavLink[] = [
  { label: "Sobre", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Diferenciais", href: "#diferenciais" },
  { label: "Galeria", href: "#galeria" },
  { label: "FAQ", href: "#faq" },
  { label: "Contato", href: "#contato" },
];

export const SERVICES: ServiceItem[] = [
  {
    icon: Droplets,
    title: "Limpeza de Caixa d'Água",
    desc: "Higienização completa com produtos adequados, garantindo água limpa e segura para sua família.",
  },
  {
    icon: Waves,
    title: "Desentupimento",
    desc: "Desentupimento de pias, ralos, vasos e tubulações com equipamentos profissionais.",
  },
  {
    icon: Gauge,
    title: "Hidrojateamento",
    desc: "Limpeza de alta pressão para remover resíduos e restaurar o fluxo das tubulações.",
  },
  {
    icon: Trash2,
    title: "Limpeza de Caixa de Gordura",
    desc: "Remoção e higienização de caixas de gordura para residências, comércios e condomínios.",
  },
  {
    icon: Bug,
    title: "Dedetização",
    desc: "Controle de pragas com produtos registrados e técnicas seguras para o ambiente.",
  },
  {
    icon: Wrench,
    title: "Manutenção Hidráulica",
    desc: "Reparos, instalações e manutenção preventiva em toda a parte hidráulica.",
  },
  {
    icon: Zap,
    title: "Manutenção Elétrica",
    desc: "Instalações e reparos elétricos com segurança e mão de obra qualificada.",
  },
];

export const DIFFERENTIALS: DifferentialItem[] = [
  { icon: Timer, title: "Atendimento rápido" },
  { icon: FileCheck, title: "Orçamento sem compromisso" },
  { icon: Home, title: "Atendimento residencial" },
  { icon: Building2, title: "Atendimento comercial" },
  { icon: Building, title: "Condomínios" },
  { icon: Cog, title: "Equipamentos modernos" },
  { icon: Users, title: "Equipe qualificada" },
  { icon: HeartHandshake, title: "Comprometimento" },
  { icon: Clock, title: "Pontualidade" },
  { icon: ShieldCheck, title: "Segurança" },
];

export const STEPS: StepItem[] = [
  { n: "01", title: "Contato", desc: "Você entra em contato pelo WhatsApp ou telefone e nos conta o que precisa." },
  { n: "02", title: "Agendamento", desc: "Definimos o melhor dia e horário para realizar o serviço." },
  { n: "03", title: "Atendimento", desc: "Nossa equipe chega pontualmente com equipamentos modernos." },
  { n: "04", title: "Serviço realizado", desc: "Executamos o serviço com qualidade, segurança e agilidade." },
  { n: "05", title: "Cliente satisfeito", desc: "Você recebe garantia de um serviço bem feito e sem preocupações." },
];

export const GALLERY: GalleryItem[] = [
  { src: "/assets/gallery/g1.jpg", alt: "Caixa d'água elevada e veículo da Duarte's" },
  { src: "/assets/gallery/g2.jpg", alt: "Manutenção de boia e válvula em reservatório" },
  { src: "/assets/gallery/g3.jpg", alt: "Interior de caixa d'água higienizada" },
  { src: "/assets/gallery/g4.jpg", alt: "Reservatório durante processo de limpeza" },
  { src: "/assets/gallery/g5.jpg", alt: "Inspeção interna de caixa d'água" },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Cliente Residencial",
    role: "Paranavaí - PR",
    text: "Excelente atendimento. Muito rápido e serviço impecável na limpeza da caixa d'água.",
  },
  {
    name: "Síndico de Condomínio",
    role: "Região Noroeste",
    text: "Equipe pontual e profissional. Resolveram o desentupimento do prédio no mesmo dia.",
  },
  {
    name: "Estabelecimento Comercial",
    role: "Paranavaí - PR",
    text: "Contratamos a manutenção hidráulica e ficamos impressionados com o comprometimento.",
  },
];

export const FAQS: FaqItem[] = [
  {
    q: "Quanto custa um desentupimento?",
    a: "O valor varia conforme o tipo e a extensão do entupimento. Fazemos uma avaliação e enviamos um orçamento sem compromisso pelo WhatsApp.",
  },
  {
    q: "Vocês atendem emergência?",
    a: "Sim. Priorizamos atendimentos urgentes com agilidade. Entre em contato pelo WhatsApp e informamos a disponibilidade da equipe.",
  },
  {
    q: "Atendem condomínios?",
    a: "Sim. Atendemos residências, empresas e condomínios em Paranavaí e toda a Região Noroeste do Paraná.",
  },
  {
    q: "Fazem limpeza de caixa d'água?",
    a: "Sim. Realizamos higienização completa da caixa d'água, garantindo água limpa e segura para sua família ou empresa.",
  },
  {
    q: "Qual região atendem?",
    a: "Atendemos Paranavaí e toda a Região Noroeste do Paraná.",
  },
  {
    q: "Como solicitar orçamento?",
    a: "É simples: clique em qualquer botão de orçamento do site para falar direto no WhatsApp, ou ligue para nós. O orçamento é sem compromisso.",
  },
];
