import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import IndicatorForm from "../IndicatorForm";
import { updateIndicator, deleteIndicator, addMeasurement, deleteMeasurement } from "../actions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";
import Badge from "@/components/Badge";
import { INDICATOR_SEMAPHORE_COLORS, indicatorSemaphore, formatDate } from "@/lib/enums";

export const dynamic = "force-dynamic";

function toDateInputValue(d?: Date | string | null) {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export default async function IndicadorDetailPage({ params }: { params: { id: string } }) {
  const [indicator, risks] = await Promise.all([
    prisma.indicator.findUnique({
      where: { id: params.id },
      include: { mediciones: { orderBy: { fecha: "desc" } } },
    }),
    prisma.risk.findMany({ orderBy: { code: "asc" }, select: { id: true, code: true, title: true } }),
  ]);

  if (!indicator) notFound();

  const last = indicator.mediciones[0]?.valor ?? null;
  const semaforo = indicatorSemaphore(last, indicator.direccion, indicator.umbralAlerta, indicator.umbralCritico);
  const addMeasurementWithId = addMeasurement.bind(null, indicator.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">
            {indicator.code} — {indicator.nombre}
          </h1>
          <Badge text={semaforo} className={INDICATOR_SEMAPHORE_COLORS[semaforo]} />
        </div>
        <ConfirmDeleteForm action={deleteIndicator.bind(null, indicator.id)} />
      </div>

      <IndicatorForm
        action={updateIndicator.bind(null, indicator.id)}
        risks={risks}
        defaults={indicator}
        submitLabel="Guardar cambios"
      />

      <div className="card space-y-4 p-6">
        <h2 className="font-bold text-gray-900">Historial de mediciones</h2>

        <form action={addMeasurementWithId} className="grid grid-cols-1 gap-3 rounded-md border border-gray-200 p-4 sm:grid-cols-4">
          <div>
            <label className="label" htmlFor="fecha">
              Fecha
            </label>
            <input id="fecha" name="fecha" type="date" required className="input" defaultValue={toDateInputValue(new Date())} />
          </div>
          <div>
            <label className="label" htmlFor="valor">
              Valor
            </label>
            <input id="valor" name="valor" type="number" step="any" required className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="nota">
              Nota
            </label>
            <input id="nota" name="nota" className="input" />
          </div>
          <div className="sm:col-span-4 flex justify-end">
            <button type="submit" className="btn-primary">
              Registrar medición
            </button>
          </div>
        </form>

        <table className="table-base">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Valor</th>
              <th>Nota</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {indicator.mediciones.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-gray-400">
                  Sin mediciones registradas — semáforo: "Sin datos".
                </td>
              </tr>
            )}
            {indicator.mediciones.map((m: any) => (
              <tr key={m.id}>
                <td>{formatDate(m.fecha)}</td>
                <td>
                  {m.valor} {indicator.unidad ?? ""}
                </td>
                <td>{m.nota ?? "—"}</td>
                <td>
                  <ConfirmDeleteForm
                    action={deleteMeasurement.bind(null, indicator.id, m.id)}
                    confirmMessage="¿Eliminar esta medición?"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
