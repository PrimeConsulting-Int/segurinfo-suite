import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteRisk } from "./actions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";
import Badge from "@/components/Badge";
import { RISK_LEVEL_COLORS } from "@/lib/enums";
import { currentRiskLevel, weightedRiskLevel } from "@/lib/risk";
import RiskMatrix from "./RiskMatrix";

export const dynamic = "force-dynamic";

export default async function RiesgosPage() {
  const risks = await prisma.risk.findMany({
    orderBy: { code: "asc" },
    include: { asset: true },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Riesgos (ISO/IEC 27005)</h1>
          <p className="text-sm text-gray-500">
            Identificación, análisis y tratamiento de riesgos de seguridad de la información.
          </p>
        </div>
        <Link href="/riesgos/nuevo" className="btn-primary">
          + Nuevo riesgo
        </Link>
      </div>

      <RiskMatrix risks={risks as any} />

      <div className="card overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Código</th>
              <th>Título</th>
              <th>Categoría</th>
              <th>Activo</th>
              <th>Nivel actual</th>
              <th>Nivel ponderado</th>
              <th>Tratamiento</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {risks.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-6 text-center text-gray-400">
                  No hay riesgos registrados todavía.
                </td>
              </tr>
            )}
            {risks.map((r: any) => {
              const { score, label } = currentRiskLevel(r);
              const w = weightedRiskLevel(r, r.asset?.criticality);
              return (
                <tr key={r.id}>
                  <td className="font-mono text-xs">{r.code}</td>
                  <td className="font-medium text-gray-900">{r.title}</td>
                  <td>{r.category}</td>
                  <td>{r.asset?.name ?? "—"}</td>
                  <td>
                    {label ? (
                      <Badge text={`${label} (${score})`} className={RISK_LEVEL_COLORS[label]} />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    {w.label ? (
                      <Badge text={`${w.label} (${w.weightedScore})`} className={RISK_LEVEL_COLORS[w.label]} />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{r.tratamiento}</td>
                  <td>{r.estado}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link href={`/riesgos/${r.id}`} className="btn-secondary">
                        Editar
                      </Link>
                      <ConfirmDeleteForm action={deleteRisk.bind(null, r.id)} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
