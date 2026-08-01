import type { LucideIcon } from "lucide-react";

export interface ContactInfo {
  phoneDisplay: string;
  phoneRaw: string;
  email: string;
  instagram: string;
  instagramHandle: string;
  facebook: string;
  address: string;
  city: string;
  cep: string;
  hours: string;
  region: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface ServiceItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface DifferentialItem {
  icon: LucideIcon;
  title: string;
}

export interface StepItem {
  n: string;
  title: string;
  desc: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
  full?: string;
  permalink?: string;
  type?: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  text: string;
  rating?: number;
  photo?: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface GoogleReview {
  author: string;
  rating: number;
  text: string;
  relative_time?: string;
  profile_photo?: string;
  publish_time?: string;
}

export interface GoogleReviewsResponse {
  configured: boolean;
  rating?: number | null;
  total?: number | null;
  reviews?: GoogleReview[];
  cached?: boolean;
}

export interface InstagramMedia {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
}

export interface InstagramFeedResponse {
  configured: boolean;
  items?: InstagramMedia[];
  cached?: boolean;
}
