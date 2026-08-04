"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Info,
  Layers,
  Wrench,
  Image as ImageIcon,
  MessageSquareQuote,
  HelpCircle,
  MapPin,
  Share2,
  PhoneCall,
  Search,
  Settings,
  Users,
  Database,
  History,
  LogOut,
  ExternalLink,
  Menu,
  X,
  UserCheck,
  FileText,
} from "lucide-react";

const MENU_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Orçamentos", href: "/admin/quotations", icon: FileText },
  { label: "Informações Gerais", href: "/admin/general", icon: Info },
  { label: "Banner Principal", href: "/admin/hero", icon: Layers },
  { label: "Serviços", href: "/admin/services", icon: Wrench },
  { label: "Galeria", href: "/admin/gallery", icon: ImageIcon },
  { label: "Depoimentos", href: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "Perguntas Frequentes", href: "/admin/faq", icon: HelpCircle },
  { label: "Área de Atendimento", href: "/admin/service-area", icon: MapPin },
  { label: "Redes Sociais", href: "/admin/social", icon: Share2 },
  { label: "Contato", href: "/admin/contact", icon: PhoneCall },
  { label: "SEO", href: "/admin/seo", icon: Search },
  { label: "Configurações", href: "/admin/settings", icon: Settings },
  { label: "Usuários", href: "/admin/users", icon: Users },
  { label: "Backup", href: "/admin/backup", icon: Database },
  { label: "Logs", href: "/admin/logs", icon: History },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthenticated");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (isLoginPage) return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-400">Carregando Painel CMS...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0B3C5D] text-white flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-white/10">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <Image
              src="/assets/logo.png"
              alt="Duarte's"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover ring-1 ring-white/30"
            />
            <span className="font-heading font-bold text-lg tracking-tight">Duarte&apos;s CMS</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-300 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-accent text-[#0B3C5D] font-bold shadow-md"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-[#0B3C5D]" : "text-white/70"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 bg-[#072A42]/60">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xs">
              <UserCheck size={16} />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-bold truncate">{user?.name || "Administrador"}</div>
              <div className="text-[10px] text-white/60 truncate">{user?.email}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
            >
              <Menu size={22} />
            </button>
            <h2 className="font-heading font-semibold text-lg text-slate-800 hidden sm:block">
              {MENU_ITEMS.find((m) => m.href === pathname)?.label || "Painel CMS"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <ExternalLink size={14} /> Ver Site Ao Vivo
            </a>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-50 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
            >
              <LogOut size={14} /> Sair
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
