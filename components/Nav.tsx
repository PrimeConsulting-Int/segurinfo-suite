"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/activos", label: "Activos" },
  { href: "/riesgos", label: "Riesgos" },
  { href: "/apetito", label: "Apetito" },
  { href: "/controles", label: "Controles / SoA" },
  { href: "/indicadores", label: "Indicadores" },
  { href: "/incidentes", label: "Incidentes" },
  { href: "/continuidad", label: "Continuidad" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-brand-100 bg-white/95 backdrop-blur">
      <div className="border-b border-brand-900/10 bg-brand-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-[11px] tracking-wider text-white/60 sm:px-6">
          <span className="font-mono uppercase">Prime Consulting International LLC</span>
          <span className="hidden font-mono uppercase sm:inline">
            ISO/IEC 27001 · 27002 · 27005 · 27017 · 27018 · 27701
          </span>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 px-4 py-3 sm:px-6">
        <Link href="/dashboard" className="mr-6 flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold tracking-tight text-brand-900">SGSI</span>
          <span className="rounded-sm bg-brand-900 px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-widest text-gold-300">
            Seguridad de la Información
          </span>
        </Link>
        <nav className="flex flex-wrap gap-1">
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname?.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  active
                    ? "relative rounded-md px-3 py-1.5 text-sm font-medium text-brand-900"
                    : "relative rounded-md px-3 py-1.5 text-sm font-medium text-brand-500 hover:bg-brand-50 hover:text-brand-900"
                }
              >
                {l.label}
                {active && (
                  <span className="absolute inset-x-2 -bottom-[13px] h-[2px] rounded-full bg-gold-500" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
