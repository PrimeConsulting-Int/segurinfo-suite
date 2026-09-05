import Link from "next/link";
import Badge from "@/components/Badge";
import { RISK_LEVEL_COLORS, riskLevelFromScore } from "@/lib/enums";
import { currentProbImpacto, weightedRiskLevel } from "@/lib/risk";

type RiskForMatrix = {
  id: string;
  code: string;
  title: string;
  probabilidad: number;
  impacto: number;
  probabilidadResidual: number | null;
  impactoResidual: number | null;
  nivelInherente: number;
  nivelResidual: number | null;
  asset: { name: string; criticality: string } | null;
};

const CELL_BASE_COLORS: Record<string, string> = {
  Bajo: "bg-emerald-50",
  Medio: "bg-amber-50",
  Alto: "bg-orange-50",
  Crítico: "bg-red-50",
};

export default function RiskMatrix({ risks }: { risks: RiskForMatrix[] }) {
  // cells[impacto][probabilidad] -> riesgos
  const cells: Record<number, Record<number, RiskForMatrix[]>> = {};
  for (let i = 1; i <= 5; i++) {
    cells[i] = { 1: [], 2: [], 3: [], 4: [], 5: [] };
  }
  for (const r of risks) {
    const { probabilidad, impacto } = currentProbImpacto(r);
    if (impacto >= 1 && impacto <= 5 && probabilidad >= 1 && probabilidad <= 5) {
      cells[impacto][probabilidad].push(r);
    }
  }

  return (
    <div className="card space-y-3 p-5">
      <div>
        <h2 className="font-bold text-gray-900">Mapa de riesgos — probabilidad × impacto</h2>
        <p className="text-xs text-gray-500">
          Posición según probabilidad e impacto vigentes (residual si está definido, si no inherente). El color de fondo de
          cada celda refleja el nivel bruto (probabilidad × impacto); el color de cada riesgo dentro de la celda refleja su
          nivel <strong>ponderado por la criticidad del activo</strong> relacionado (Bajo ×0.75, Medio ×1.0, Alto ×1.25,
          Crítico ×1.5; sin activo asociado = factor neutro 1.0).
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate" style={{ borderSpacing: 4 }}>
          <thead>
            <tr>
              <th className="w-10"></th>
              <th colSpan={5} className="pb-1 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Probabilidad →
              </th>
            </tr>
          </thead>
          <tbody>
            {[5, 4, 3, 2, 1].map((impacto) => (
              <tr key={impacto}>
                {impacto === 5 && (
                  <td rowSpan={5} className="align-middle">
                    <div className="flex h-full items-center justify-center">
                      <span className="-rotate-90 whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-500">
                        ← Impacto
                      </span>
                    </div>
                  </td>
                )}
                {[1, 2, 3, 4, 5].map((probabilidad) => {
                  const baseLevel = riskLevelFromScore(probabilidad * impacto);
                  const risksInCell = cells[impacto][probabilidad];
                  return (
                    <td
                      key={probabilidad}
                      className={`min-w-[9rem] align-top rounded-md border border-gray-200 p-2 ${
                        baseLevel ? CELL_BASE_COLORS[baseLevel] : ""
                      }`}
                    >
                      <div className="mb-1 text-[10px] font-medium text-gray-400">
                        P{probabilidad} × I{impacto} = {probabilidad * impacto}
                      </div>
                      <div className="space-y-1">
                        {risksInCell.map((r) => {
                          const w = weightedRiskLevel(r, r.asset?.criticality);
                          return (
                            <Link key={r.id} href={`/riesgos/${r.id}`} className="block">
                              <Badge
                                text={`${r.code} · pond. ${w.weightedScore}`}
                                className={`w-full justify-start ${w.label ? RISK_LEVEL_COLORS[w.label] : ""}`}
                              />
                            </Link>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td></td>
              {[1, 2, 3, 4, 5].map((p) => (
                <td key={p} className="pt-1 text-center text-xs font-semibold text-gray-500">
                  {p}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {risks.length === 0 && <p className="text-center text-xs text-gray-400">No hay riesgos para ubicar en el mapa.</p>}
    </div>
  );
}
