import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/Badge";
import { INDICATOR_SEMAPHORE_COLORS, indicatorSemaphore } from "@/lib/enums";

export const dynamic = "force-dynamic";

export default async function IndicadoresPage() {
  const indicators = await prisma.indicator.findMany({
    orderBy: { code: "asc" },
    include: { mediciones: { orderBy: { fecha: "desc" }, take: 1 } },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Indicadores KPI / KRI</h1>
          <p className="text-sm text-gray-500">Monitoreo continuo con historial de mediciones y semáforo automático.</p>
        </div>
        <Link href="/indicadores/nuevo" className="btn-primary">
          + Nuevo indicador
        </Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Código</th>
              <th>Tipo</th>
              <th>Nombre</th>
              <th>Meta</th>
              <th>Último valor</th>
              <th>Semáforo</th>
              <th>Frecuencia</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {indicators.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-gray-400">
                  No hay indicadores registrados todavía.
                </td>
              </tr>
            )}
            {indicators.map((i: any) => {
              const last = i.mediciones[0]?.valor ?? null;
              const semaforo = indicatorSemaphore(last, i.direccion, i.umbralAlerta, i.umbralCritico);
              return (
                <tr key={i.id}>
                  <td className="font-mono text-xs">{i.code}</td>
                  <td>
                    <Badge text={i.tipo} className={i.tipo === "KRI" ? "bg-purple-100 text-purple-800 border-purple-300" : "bg-sky-100 text-sky-800 border-sky-300"} />
                  </td>
                  <td className="font-medium text-gray-900">
                    <Link href={`/indicadores/${i.id}`} className="hover:underline">
                      {i.nombre}
                    </Link>
                  </td>
                  <td>
                    {i.meta} {i.unidad ?? ""}
                  </td>
                  <td>{last !== null ? `${last} ${i.unidad ?? ""}` : "—"}</td>
                  <td>
                    <Badge text={semaforo} className={INDICATOR_SEMAPHORE_COLORS[semaforo]} />
                  </td>
                  <td>{i.frecuencia}</td>
                  <td>
                    <Link href={`/indicadores/${i.id}`} className="btn-secondary">
                      Ver / editar
                    </Link>
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
