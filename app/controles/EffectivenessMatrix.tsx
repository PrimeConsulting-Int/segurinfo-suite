import Link from "next/link";
import Badge from "@/components/Badge";
import { MATURITY_LEVELS, EFFECTIVENESS_LEVELS, effectivenessBand, EFFECTIVENESS_BAND_COLORS } from "@/lib/enums";

type ControlForMatrix = {
  id: string;
  code: string;
  title: string;
  madurez: number | null;
  efectividad: number | null;
};

const BAND_CELL_BG: Record<string, string> = {
  Alta: "bg-emerald-50",
  Media: "bg-amber-50",
  Baja: "bg-red-50",
};

export default function EffectivenessMatrix({ controls }: { controls: ControlForMatrix[] }) {
  const evaluated = controls.filter((c) => c.madurez !== null && c.efectividad !== null);
  const notEvaluated = controls.filter((c) => c.madurez === null || c.efectividad === null);

  // cells[efectividad][madurez] -> controles
  const cells: Record<number, Record<number, ControlForMatrix[]>> = {};
  for (const e of EFFECTIVENESS_LEVELS) {
    cells[e] = { 1: [], 2: [], 3: [], 4: [], 5: [] };
  }
  for (const c of evaluated) {
    cells[c.efectividad as number][c.madurez as number].push(c);
  }

  return (
    <div className="card space-y-3 p-5">
      <div>
        <h2 className="font-bold text-gray-900">Mapa de controles por evaluación de efectividad</h2>
        <p className="text-xs text-gray-500">
          Cada control ubicado según su madurez (qué tan implementado está) y su efectividad (qué tan bien funciona en la
          práctica). El color de la celda es la banda más débil de las dos dimensiones: Alta (ambas ≥4), Media (mínimo 3),
          Baja (mínimo ≤2).
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate" style={{ borderSpacing: 4 }}>
          <thead>
            <tr>
              <th className="w-10"></th>
              <th colSpan={5} className="pb-1 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Madurez →
              </th>
            </tr>
          </thead>
          <tbody>
            {[5, 4, 3, 2, 1].map((efectividad) => (
              <tr key={efectividad}>
                {efectividad === 5 && (
                  <td rowSpan={5} className="align-middle">
                    <div className="flex h-full items-center justify-center">
                      <span className="-rotate-90 whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-500">
                        ← Efectividad
                      </span>
                    </div>
                  </td>
                )}
                {MATURITY_LEVELS.map((madurez) => {
                  const band = effectivenessBand(madurez, efectividad);
                  const controlsInCell = cells[efectividad][madurez];
                  return (
                    <td
                      key={madurez}
                      className={`min-w-[9rem] align-top rounded-md border border-gray-200 p-2 ${BAND_CELL_BG[band] ?? ""}`}
                    >
                      <div className="space-y-1">
                        {controlsInCell.map((c) => (
                          <Link key={c.id} href={`/controles/${c.id}`} className="block">
                            <Badge text={c.code} className="w-full justify-start bg-white text-gray-700 border-gray-300" />
                          </Link>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td></td>
              {MATURITY_LEVELS.map((m) => (
                <td key={m} className="pt-1 text-center text-xs font-semibold text-gray-500">
                  {m}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {notEvaluated.length > 0 && (
        <div className="rounded-md border border-gray-100 bg-gray-50 p-3">
          <p className="mb-1 flex items-center gap-2 text-xs font-semibold text-gray-500">
            Sin evaluar (falta madurez y/o efectividad)
            <Badge text={String(notEvaluated.length)} className={EFFECTIVENESS_BAND_COLORS["Sin evaluar"]} />
          </p>
          <div className="flex flex-wrap gap-1">
            {notEvaluated.map((c) => (
              <Link key={c.id} href={`/controles/${c.id}`}>
                <Badge text={c.code} className="bg-white text-gray-600 border-gray-300" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
