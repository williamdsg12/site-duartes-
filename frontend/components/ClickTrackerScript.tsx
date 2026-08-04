"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ClickTrackerScript() {
  const pathname = usePathname();

  useEffect(() => {
    // Avoid tracking inside admin area
    if (pathname?.startsWith("/admin")) return;

    // Track Page Visit
    const deviceType =
      window.innerWidth < 768 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop";

    const referrer = document.referrer;
    let origin = "Direto";
    if (referrer.includes("google")) origin = "Google";
    else if (referrer.includes("instagram")) origin = "Instagram";
    else if (referrer.includes("facebook")) origin = "Facebook";
    else if (referrer.includes("wa.me") || referrer.includes("whatsapp")) origin = "WhatsApp";

    fetch("/api/track/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageUrl: pathname || "/", device: deviceType, origin }),
    }).catch(() => {});

    // Track Button Clicks
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const clickable = target.closest("a, button") as HTMLAnchorElement | HTMLButtonElement | null;
      if (!clickable) return;

      const href = clickable.getAttribute("href") || "";
      const text = clickable.innerText?.trim() || clickable.getAttribute("aria-label") || "Botão";

      let buttonName = "";
      if (href.includes("wa.me") || href.includes("whatsapp") || text.toLowerCase().includes("whatsapp")) {
        buttonName = `WhatsApp (${text || "Botão"})`;
      } else if (href.includes("tel:") || text.toLowerCase().includes("ligar")) {
        buttonName = `Ligar (${text || "Telefone"})`;
      } else if (text.toLowerCase().includes("orçamento") || href.includes("orcamento")) {
        buttonName = `Pedir Orçamento (${text})`;
      }

      if (buttonName) {
        fetch("/api/track/click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ buttonName, pageUrl: pathname || "/", device: deviceType, origin }),
        }).catch(() => {});
      }
    };

    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, [pathname]);

  return null;
}
