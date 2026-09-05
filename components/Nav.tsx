import Link from "next/link";

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
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 px-4 py-3 sm:px-6">
        <Link href="/dashboard" className="mr-4 text-base font-bold text-brand-700">
          SGSI
        </Link>
        <nav className="flex flex-wrap gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
