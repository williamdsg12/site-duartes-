import { Phone, Mail, Instagram, Facebook, MapPin, Clock, MessageCircle } from "lucide-react";
import Image from "next/image";
import { CONTACT, NAV_LINKS, SERVICES, waLink, DEFAULT_WA_MSG } from "@/data/site";

export const Footer = () => {
  return (
    <footer id="contato" data-testid="footer" className="bg-primary-hover text-white">
      <div className="container-x py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/assets/logo.png"
              alt="Duarte's Limpezas"
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover ring-1 ring-white/20"
            />
            <div className="font-heading font-bold leading-tight">
              Duarte&apos;s
              <span className="block text-[10px] font-body font-medium tracking-[0.2em] text-white/60">
                LIMPEZAS · MANUTENÇÕES
              </span>
            </div>
          </div>
          <p className="mt-5 text-sm text-white/60 leading-relaxed">
            Há 5 anos oferecendo soluções completas em limpeza, desentupimento e manutenção em {CONTACT.region}.
          </p>
          <div className="mt-5 flex gap-3">
            <a href={CONTACT.instagram} target="_blank" rel="noreferrer" data-testid="footer-instagram" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent hover:text-accent-foreground">
              <Instagram size={18} />
            </a>
            <a href={CONTACT.facebook} target="_blank" rel="noreferrer" data-testid="footer-facebook" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent hover:text-accent-foreground">
              <Facebook size={18} />
            </a>
            <a href={waLink(DEFAULT_WA_MSG)} target="_blank" rel="noreferrer" data-testid="footer-whatsapp" aria-label="WhatsApp" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent hover:text-accent-foreground">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-white/50">Navegação</h4>
          <ul className="mt-5 space-y-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm text-white/80 transition-colors hover:text-accent">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-white/50">Serviços</h4>
          <ul className="mt-5 space-y-3">
            {SERVICES.slice(0, 6).map((s) => (
              <li key={s.title} className="text-sm text-white/80">{s.title}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-white/50">Contato</h4>
          <ul className="mt-5 space-y-4 text-sm text-white/80">
            <li className="flex items-start gap-3">
              <Phone size={18} className="mt-0.5 shrink-0 text-accent" />
              <a href={`tel:+${CONTACT.phoneRaw}`} className="hover:text-accent" data-testid="footer-phone">{CONTACT.phoneDisplay}</a>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-accent" />
              <a href={`mailto:${CONTACT.email}`} className="break-all hover:text-accent" data-testid="footer-email">{CONTACT.email}</a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-accent" />
              <span>{CONTACT.address}<br />{CONTACT.city}<br />{CONTACT.cep}</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock size={18} className="mt-0.5 shrink-0 text-accent" />
              <span>Segunda a Sexta<br />08h às 18h</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-x pb-12">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <iframe
            title="Localização Duarte's - Paranavaí"
            src="https://www.google.com/maps?q=Av.%20Paulino%20Rech,%20203,%20Paranava%C3%AD%20-%20PR,%2087702-430&z=15&output=embed"
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <span>© {new Date().getFullYear()} Duarte&apos;s Limpezas, Desentupidora e Manutenções. Todos os direitos reservados.</span>
          <span>Paranavaí - PR · {CONTACT.instagramHandle}</span>
        </div>
      </div>
    </footer>
  );
};
