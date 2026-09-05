import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/Badge";
import { CONTROL_FAMILIES, CONTROL_FAMILY_LABELS, SOA_PRACTICE_FAMILIES } from "@/lib/enums";
import { computeSoaCompliance } from "@/lib/soa";
import EffectivenessMatrix from "./EffectivenessMatrix";

export const dynamic = "force-dynamic";

const STATE_COLORS: Record<string, string> = {
  "No iniciado": "bg-gray-100 text-gray-600 border-gray-300",
  "En progreso": "bg-amber-100 text-amber-800 border-amber-300",
  Implementado: "bg-emerald-100 text-emerald-800 border-emerald-300",
  "No aplica": "bg-gray-100 text-gray-500 border-gray-200 line-through",
};

export default async function ControlesPage({ searchParams }: { searchParams: { familia?: string } }) {
  const allControls = await prisma.control.findMany({ orderBy: [{ family: "asc" }, { code: "asc" }] });
  const soa = computeSoaCompliance(allControls);

  const familia = searchParams.familia;
  const controls = familia ? allControls.filter((c: any) => c.family === familia) : allControls;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Controles y Declaración de Aplicabilidad (SoA)</h1>
        <p className="text-sm text-gray-500">
          Catálogo de referencia sembrado (no editable en su texto base); solo la implementación es editable.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <p className="text-sm text-gray-500">% de cumplimiento SoA (controles certificables)</p>
          <p className="text-3xl font-bold text-brand-700">{soa.percentage}%</p>
          <p className="mt-1 text-xs text-gray-400">
            {soa.implementedCertifiable} de {soa.applicableCertifiable} controles aplicables implementados (
            {soa.totalCertifiable} en catálogo certificable: 27001/27002, 27017 CLD, 27018, 27701 Anexo A/B)
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500">Prácticas de guía en marcha (27031 / 27032 — no Anexo A)</p>
          <p className="text-3xl font-bold text-gray-700">{soa.practicesPercentage}%</p>
          <p className="mt-1 text-xs text-gray-400">
            {soa.implementedPractices} de {soa.applicablePractices} prácticas aplicables implementadas ({soa.totalPractices} en total).
            No se incluyen en el % de cumplimiento SoA por no ser Anexo A.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/controles"
          className={`badge ${!familia ? "bg-brand-600 text-white border-brand-600" : "bg-white text-gray-600 border-gray-300"}`}
        >
          Todas ({allControls.length})
        </Link>
        {CONTROL_FAMILIES.map((f) => {
          const count = allControls.filter((c: any) => c.family === f).length;
          const isPracticeFamily = SOA_PRACTICE_FAMILIES.includes(f);
          return (
            <Link
              key={f}
              href={`/controles?familia=${f}`}
              className={`badge ${familia === f ? "bg-brand-600 text-white border-brand-600" : "bg-white text-gray-600 border-gray-300"}`}
              title={isPracticeFamily ? "Práctica de guía, no Anexo A" : undefined}
            >
              {CONTROL_FAMILY_LABELS[f]} ({count})
            </Link>
          );
        })}
      </div>

      <EffectivenessMatrix controls={controls as any} />

      <div className="card overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Código</th>
              <th>Título</th>
              <th>Familia</th>
              <th>Aplicable</th>
              <th>Estado</th>
              <th>Madurez</th>
              <th>Efectividad</th>
              <th>Responsable</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {controls.map((c: any) => (
              <tr key={c.id}>
                <td className="font-mono text-xs">{c.code}</td>
                <td className="max-w-md">
                  <div className="font-medium text-gray-900">{c.title}</div>
                  {c.isPractice && (
                    <Badge text="Práctica, no Anexo A" className="mt-1 bg-violet-100 text-violet-700 border-violet-300" />
                  )}
                  {c.principio29100 && <p className="text-xs text-gray-400">Principio 29100: {c.principio29100}</p>}
                  {c.clausula && <p className="text-xs text-gray-400">{c.clausula}</p>}
                  {c.proceso27031 && <p className="text-xs text-gray-400">Fase: {c.proceso27031}</p>}
                  {c.practica27032 && <p className="text-xs text-gray-400">Tipo: {c.practica27032}</p>}
                </td>
                <td className="text-xs">{CONTROL_FAMILY_LABELS[c.family as keyof typeof CONTROL_FAMILY_LABELS]}</td>
                <td>{c.aplicable ? "Sí" : "No"}</td>
                <td>
                  <Badge text={c.estado} className={STATE_COLORS[c.estado]} />
                </td>
                <td>{c.madurez ?? "—"}</td>
                <td>{c.efectividad ?? "—"}</td>
                <td>{c.responsable ?? "—"}</td>
                <td>
                  <Link href={`/controles/${c.id}`} className="btn-secondary">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
