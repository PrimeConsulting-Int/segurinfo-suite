import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteAppetite } from "./actions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";
import Badge from "@/components/Badge";
import {
  RISK_CATEGORIES,
  APPETITE_SEMAPHORE_COLORS,
  appetiteSemaphore,
  formatDate,
} from "@/lib/enums";
import { currentRiskLevel } from "@/lib/risk";

export const dynamic = "force-dynamic";

export default async function ApetitoPage() {
  const [appetites, risks] = await Promise.all([
    prisma.riskAppetite.findMany({ orderBy: { category: "asc" } }),
    prisma.risk.findMany({ where: { estado: { not: "Cerrado" } } }),
  ]);

  const usedCategories = new Set(appetites.map((a: any) => a.category));
  const availableCategories = RISK_CATEGORIES.filter((c) => !usedCategories.has(c));

  const risksByCategory = new Map<string, any[]>();
  for (const r of risks as any[]) {
    if (!risksByCategory.has(r.category)) risksByCategory.set(r.category, []);
    risksByCategory.get(r.category)!.push(r);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Apetito y tolerancia al riesgo</h1>
          <p className="text-sm text-gray-500">
            Comparación en vivo del nivel actual (residual si existe, si no inherente) de los riesgos activos contra los
            umbrales declarados por categoría.
          </p>
        </div>
        {availableCategories.length > 0 && (
          <Link href="/apetito/nuevo" className="btn-primary">
            + Nueva declaración
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {appetites.map((a: any) => {
          const categoryRisks = risksByCategory.get(a.category) ?? [];
          const evaluated = categoryRisks.map((r: any) => {
            const { score, label } = currentRiskLevel(r);
            const semaforo = score !== undefined && score !== null ? appetiteSemaphore(score, a.appetiteThreshold, a.toleranceThreshold) : null;
            return { risk: r, score, label, semaforo };
          });
          const worst = evaluated.reduce((acc: string | null, e: any) => {
            if (!e.semaforo) return acc;
            const order = ["Dentro del apetito", "Dentro de tolerancia", "Excede tolerancia"];
            if (!acc) return e.semaforo;
            return order.indexOf(e.semaforo) > order.indexOf(acc) ? e.semaforo : acc;
          }, null as string | null);

          return (
            <div key={a.id} className="card space-y-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-bold text-gray-900">{a.category}</h2>
                  <p className="mt-1 text-sm text-gray-600">{a.statement}</p>
                </div>
                {worst && <Badge text={worst} className={APPETITE_SEMAPHORE_COLORS[worst as keyof typeof APPETITE_SEMAPHORE_COLORS]} />}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Umbral de apetito:</span> <strong>{a.appetiteThreshold}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Umbral de tolerancia:</span> <strong>{a.toleranceThreshold}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Responsable:</span> {a.responsable ?? "—"}
                </div>
                <div>
                  <span className="text-gray-500">Aprobado:</span>{" "}
                  {formatDate(a.approvedDate)}
                </div>
              </div>

              {evaluated.length > 0 ? (
                <div className="rounded-md border border-gray-100 bg-gray-50 p-2">
                  <p className="mb-1 text-xs font-semibold text-gray-500">Riesgos activos en esta categoría</p>
                  <ul className="space-y-1 text-sm">
                    {evaluated.map((e: any) => (
                      <li key={e.risk.id} className="flex items-center justify-between gap-2">
                        <Link href={`/riesgos/${e.risk.id}`} className="hover:underline">
                          <span className="font-mono text-xs text-gray-500">{e.risk.code}</span> {e.risk.title}
                        </Link>
                        {e.semaforo && (
                          <Badge
                            text={`${e.label} (${e.score}) · ${e.semaforo}`}
                            className={APPETITE_SEMAPHORE_COLORS[e.semaforo as keyof typeof APPETITE_SEMAPHORE_COLORS]}
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-xs text-gray-400">No hay riesgos activos en esta categoría.</p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Link href={`/apetito/${a.id}`} className="btn-secondary">
                  Editar
                </Link>
                <ConfirmDeleteForm action={deleteAppetite.bind(null, a.id)} />
              </div>
            </div>
          );
        })}
      </div>

      {appetites.length === 0 && (
        <p className="text-center text-gray-400">Aún no se han definido declaraciones de apetito de riesgo.</p>
      )}
    </div>
  );
}
