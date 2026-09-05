import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/Badge";
import {
  NORMAS,
  RISK_LEVEL_COLORS,
  INDICATOR_SEMAPHORE_COLORS,
  indicatorSemaphore,
  appetiteSemaphore,
} from "@/lib/enums";
import { currentRiskLevel } from "@/lib/risk";
import { computeSoaCompliance } from "@/lib/soa";

export const dynamic = "force-dynamic";

const LEVEL_ORDER = ["Bajo", "Medio", "Alto", "Crítico"] as const;
const LEVEL_BAR_COLORS: Record<string, string> = {
  Bajo: "bg-emerald-500",
  Medio: "bg-amber-500",
  Alto: "bg-orange-500",
  Crítico: "bg-red-500",
};

export default async function DashboardPage() {
  const [controls, risks, appetites, indicators, incidents, plans] = await Promise.all([
    prisma.control.findMany(),
    prisma.risk.findMany({ include: { asset: true } }),
    prisma.riskAppetite.findMany(),
    prisma.indicator.findMany({ include: { mediciones: { orderBy: { fecha: "desc" }, take: 1 } } }),
    prisma.incident.findMany(),
    prisma.continuityPlan.findMany(),
  ]);

  const soa = computeSoaCompliance(controls);

  const riskLevels = (risks as any[]).map((r) => currentRiskLevel(r));
  const levelCounts: Record<string, number> = { Bajo: 0, Medio: 0, Alto: 0, Crítico: 0 };
  for (const { label } of riskLevels) {
    if (label) levelCounts[label]++;
  }
  const maxLevelCount = Math.max(1, ...Object.values(levelCounts));

  const appetiteByCategory = new Map<string, any>((appetites as any[]).map((a) => [a.category, a]));
  const risksExceedingTolerance = (risks as any[]).filter((r) => {
    if (r.estado === "Cerrado") return false;
    const appetite = appetiteByCategory.get(r.category);
    if (!appetite) return false;
    const { score } = currentRiskLevel(r);
    if (score === null || score === undefined) return false;
    return appetiteSemaphore(score, appetite.appetiteThreshold, appetite.toleranceThreshold) === "Excede tolerancia";
  });

  const indicatorSummary: Record<string, number> = { "En objetivo": 0, Alerta: 0, Crítico: 0, "Sin datos": 0 };
  for (const i of indicators as any[]) {
    const last = i.mediciones[0]?.valor ?? null;
    const s = indicatorSemaphore(last, i.direccion, i.umbralAlerta, i.umbralCritico);
    indicatorSummary[s]++;
  }

  const openIncidents = (incidents as any[]).filter((i) => !["Resuelto", "Cerrado"].includes(i.estado));
  const criticalIncidents = (incidents as any[]).filter((i) => i.severidad === "Crítica" && !["Resuelto", "Cerrado"].includes(i.estado));

  const planStateCounts: Record<string, number> = { Borrador: 0, Aprobado: 0, Probado: 0, Desactualizado: 0 };
  for (const p of plans as any[]) planStateCounts[p.estado] = (planStateCounts[p.estado] ?? 0) + 1;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">Dashboard del SGSI</h1>
        <p className="text-sm text-gray-500">Vista integrada de cumplimiento, riesgo, monitoreo e incidentes.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <p className="text-sm text-gray-500">% cumplimiento SoA</p>
          <p className="text-3xl font-bold text-brand-700">{soa.percentage}%</p>
          <Link href="/controles" className="text-xs text-brand-600 hover:underline">
            Ver controles →
          </Link>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500">Riesgos que exceden tolerancia</p>
          <p className="text-3xl font-bold text-red-600">{risksExceedingTolerance.length}</p>
          <Link href="/apetito" className="text-xs text-brand-600 hover:underline">
            Ver apetito →
          </Link>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500">Incidentes abiertos / críticos</p>
          <p className="text-3xl font-bold text-orange-600">
            {openIncidents.length} / {criticalIncidents.length}
          </p>
          <Link href="/incidentes" className="text-xs text-brand-600 hover:underline">
            Ver incidentes →
          </Link>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500">Planes de continuidad</p>
          <p className="text-3xl font-bold text-gray-700">{plans.length}</p>
          <Link href="/continuidad" className="text-xs text-brand-600 hover:underline">
            Ver continuidad →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-3 font-bold text-gray-900">Riesgos por nivel</h2>
          <div className="space-y-2">
            {LEVEL_ORDER.map((level) => (
              <div key={level} className="flex items-center gap-2">
                <span className="w-16 text-sm text-gray-600">{level}</span>
                <div className="h-4 flex-1 rounded bg-gray-100">
                  <div
                    className={`h-4 rounded ${LEVEL_BAR_COLORS[level]}`}
                    style={{ width: `${(levelCounts[level] / maxLevelCount) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-sm font-semibold">{levelCounts[level]}</span>
              </div>
            ))}
          </div>
          {risksExceedingTolerance.length > 0 && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3">
              <p className="mb-1 text-xs font-semibold text-red-700">Riesgos que exceden la tolerancia declarada:</p>
              <ul className="space-y-1 text-sm">
                {risksExceedingTolerance.map((r: any) => (
                  <li key={r.id}>
                    <Link href={`/riesgos/${r.id}`} className="hover:underline">
                      <span className="font-mono text-xs text-gray-500">{r.code}</span> {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="card p-5">
          <h2 className="mb-3 font-bold text-gray-900">Indicadores KPI / KRI por semáforo</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(indicatorSummary).map(([s, count]) => (
              <div key={s} className="flex items-center justify-between rounded-md border border-gray-100 p-3">
                <Badge text={s} className={INDICATOR_SEMAPHORE_COLORS[s as keyof typeof INDICATOR_SEMAPHORE_COLORS]} />
                <span className="text-lg font-bold">{count}</span>
              </div>
            ))}
          </div>
          <Link href="/indicadores" className="mt-3 inline-block text-xs text-brand-600 hover:underline">
            Ver indicadores →
          </Link>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="mb-3 font-bold text-gray-900">Estado de planes de continuidad</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(planStateCounts).map(([s, count]) => (
            <div key={s} className="rounded-md border border-gray-100 p-3 text-center">
              <p className="text-xs text-gray-500">{s}</p>
              <p className="text-xl font-bold">{count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <h2 className="mb-1 font-bold text-gray-900">Marco normativo</h2>
        <p className="mb-3 text-xs text-gray-500">
          Cada norma según su naturaleza real: requisitos del SGSI, catálogo de controles, gestión de riesgo, lineamiento/guía o
          gestión de incidentes.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {NORMAS.map((n) => (
            <Link key={n.code} href={n.href} className="rounded-md border border-gray-200 p-3 hover:border-brand-400 hover:bg-brand-50">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">{n.code}</span>
                <Badge text={n.nature} className="bg-gray-100 text-gray-600 border-gray-300 text-[10px]" />
              </div>
              <p className="mt-1 text-sm text-gray-700">{n.name}</p>
              <p className="mt-1 text-xs text-gray-500">{n.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
