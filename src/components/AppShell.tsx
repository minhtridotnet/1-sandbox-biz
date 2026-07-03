import { useState } from 'react';
import type { ReactNode } from 'react';
import { Sparkles, BarChart3, ShieldQuestion, Coins, Info, FolderOpen, Menu, X } from 'lucide-react';
import type { View } from '@/types';
import logoWhite from '@/assets/logo-white.png';

interface AppShellProps {
  view: View;
  onNavigate: (view: View) => void;
  onRestart: () => void;
  onOpenSessions: () => void;
  children: ReactNode;
}

interface NavLink {
  href: string;
  label: string;
  icon: ReactNode;
}

const NAV_LINKS: NavLink[] = [
  { href: '#top', label: 'Trang chủ', icon: <Sparkles size={15} /> },
  { href: '#khac-biet', label: 'Giới thiệu', icon: <BarChart3 size={15} /> },
  { href: '#bang-gia', label: 'Bảng giá', icon: <Coins size={15} /> },
  { href: '#ai-minh-bach', label: 'AI minh bạch', icon: <ShieldQuestion size={15} /> },
];

export default function AppShell({ view, onNavigate, onRestart, onOpenSessions, children }: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToTarget = (href: string) => {
    if (href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToSection = (href: string) => {
    setMenuOpen(false);
    if (view === 'landing') {
      scrollToTarget(href);
    } else {
      onNavigate('landing');
      setTimeout(() => scrollToTarget(href), 80);
    }
  };

  const handleLogo = () => {
    setMenuOpen(false);
    if (view === 'landing') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNavigate('landing');
    }
  };

  return (
    <div className="relative min-h-screen bg-sandbox-navy">
      <header className="no-print sticky top-0 z-50 border-b border-cyanish bg-[rgba(2,8,23,0.82)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <button
            onClick={handleLogo}
            className="group flex items-center gap-2.5"
            aria-label="1 SANDBOX BIZ — về trang chủ"
          >
            <span className="relative">
              <img
                src={logoWhite}
                alt="1 SANDBOX BIZ"
                className="h-8 w-auto transition group-hover:drop-shadow-[0_0_12px_rgba(255,199,44,0.45)]"
              />
            </span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => goToSection(link.href)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-sandbox-softText transition hover:text-sandbox-cyan"
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenSessions();
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                view === 'sessions'
                  ? 'text-sandbox-cyan'
                  : 'text-sandbox-softText hover:text-sandbox-cyan'
              }`}
            >
              <FolderOpen size={15} />
              <span className="hidden sm:inline">Kế hoạch của tôi</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onRestart();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyanish px-3 py-2 text-sm font-medium text-sandbox-softText transition hover:border-sandbox-cyan hover:text-sandbox-cyan"
            >
              <Info size={15} />
              <span className="hidden sm:inline">Bắt đầu lại</span>
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cyanish text-sandbox-softText transition hover:border-sandbox-cyan hover:text-sandbox-cyan md:hidden"
              aria-label="Mở menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-divider bg-sandbox-card px-5 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => goToSection(link.href)}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-sandbox-softText transition hover:bg-white/[0.04] hover:text-sandbox-cyan"
                >
                  {link.icon}
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenSessions();
                }}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-sandbox-softText transition hover:bg-white/[0.04] hover:text-sandbox-cyan"
              >
                <FolderOpen size={15} />
                Kế hoạch của tôi
              </button>
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="no-print mt-16 border-t border-divider bg-sandbox-navy">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 py-10 text-center">
          <img src={logoWhite} alt="1 SANDBOX BIZ" className="h-7 w-auto opacity-80" />
          <p className="text-xs text-sandbox-muted">
            From Ideas To Real Business — nguyên mẫu cho cuộc thi The NextX 2026
          </p>
          <p className="max-w-xl text-xs text-sandbox-muted">
            Gợi ý từ AI mang tính tham khảo, không phải tư vấn tài chính, pháp lý hay đầu tư.
            Hãy kiểm chứng với khách hàng thật trước khi quyết định.
          </p>
        </div>
      </footer>
    </div>
  );
}
