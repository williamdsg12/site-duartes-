# PRD — Duarte's Limpezas, Desentupidora e Manutenções

## Problem Statement
Premium institutional single-page website to convert visitors into clients via WhatsApp for a cleaning/plumbing/maintenance company in Paranavaí-PR (5 years in business). Must feel agency-crafted, not template/AI. Palette: deep blue #0B3C5D, medium blue #175C8A, white, light gray, yellow #FFC107 for CTAs. Light mode only. SEO + performance + responsive.

## Stack
React (CRA/craco) + Tailwind + Framer Motion + Lenis smooth scroll. No backend/auth/DB (frontend-only marketing site). Fonts: Cabinet Grotesk (headings) + Satoshi (body) via Fontshare.

## User Choices
- WhatsApp/phone: (44) 99706-9677 -> wa.me/5544997069677
- Quote buttons open WhatsApp directly with pre-filled message
- Email: duarteslimpezacaixadeagua@gmail.com
- Instagram/Facebook: @duarteslimpezacaixadeagua

## Implemented (2025-12)
- Elegant loading screen, fixed glass navbar w/ mobile menu, kinetic hero (video bg, masked line reveal, parallax, badges)
- Editorial marquee, About (Quem Somos) w/ 5-year badge, 8 service cards (WhatsApp CTA each)
- 10 Differentials, 5-step How It Works timeline, Service Area (embedded map + city chips)
- Premium bento Gallery w/ lightbox (keyboard nav), Testimonials (placeholder, labeled), FAQ accordion
- Final CTA (WhatsApp + Ligar), footer w/ contacts + embedded map, floating WhatsApp + back-to-top
- SEO: title, meta description/keywords, OG tags, LocalBusiness JSON-LD, pt-BR, canonical, favicon
- Assets from user zip: logo, hero video, 5 gallery photos in /app/frontend/public/assets/
- Tested via testing_agent: frontend 100% pass, no issues

## Content source
All static content in /app/frontend/src/data/site.js

## Backlog / Next
- P1: Lead-capture form saving quotes to MongoDB + admin panel
- P2: Real testimonials/Google reviews integration
- P2: Blog for local SEO; WhatsApp click analytics
