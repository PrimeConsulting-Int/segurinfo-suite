import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateControlImplementation } from "../actions";
import { CONTROL_STATES, MATURITY_LEVELS, EFFECTIVENESS_LEVELS, CONTROL_FAMILY_LABELS } from "@/lib/enums";

export const dynamic = "force-dynamic";

function toDateInputValue(d?: Date | string | null) {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export default async function EditarControlPage({ params }: { params: { id: string } }) {
  const control = await prisma.control.findUnique({ where: { id: params.id } });
  if (!control) notFound();

  const action = updateControlImplementation.bind(null, control.id);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="card p-5">
        <p className="font-mono text-xs text-gray-500">{control.code}</p>
        <h1 className="text-lg font-bold text-gray-900">{control.title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {CONTROL_FAMILY_LABELS[control.family as keyof typeof CONTROL_FAMILY_LABELS]}
          {control.isPractice && " — práctica de guía, no Anexo A"}
        </p>
        {control.anexoACategoria && <p className="text-xs text-gray-400">Categoría Anexo A: {control.anexoACategoria}</p>}
        {control.principio29100 && <p className="text-xs text-gray-400">Principio ISO/IEC 29100: {control.principio29100}</p>}
        {control.clausula && <p className="text-xs text-gray-400">Cláusula: {control.clausula}</p>}
        {control.proceso27031 && <p className="text-xs text-gray-400">Fase PDCA de continuidad: {control.proceso27031}</p>}
        {control.practica27032 && <p className="text-xs text-gray-400">Tipo de práctica: {control.practica27032}</p>}
        <p className="mt-2 text-xs italic text-gray-400">
          El texto base del control es de solo lectura (catálogo de referencia sembrado). Solo la implementación es editable.
        </p>
      </div>

      <form action={action} className="card space-y-4 p-6">
        <div className="flex items-center gap-2">
          <input
            id="aplicable"
            name="aplicable"
            type="checkbox"
            defaultChecked={control.aplicable}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="aplicable" className="text-sm font-medium text-gray-700">
            Aplicable a la organización
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="estado">
              Estado de implementación
            </label>
            <select id="estado" name="estado" required className="input" defaultValue={control.estado}>
              {CONTROL_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="madurez">
              Madurez (1-5)
            </label>
            <select id="madurez" name="madurez" className="input" defaultValue={control.madurez ?? ""}>
              <option value="">— No evaluada —</option>
              {MATURITY_LEVELS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-400">Qué tan implementado está el control.</p>
          </div>
          <div>
            <label className="label" htmlFor="efectividad">
              Efectividad (1-5)
            </label>
            <select id="efectividad" name="efectividad" className="input" defaultValue={control.efectividad ?? ""}>
              <option value="">— No evaluada —</option>
              {EFFECTIVENESS_LEVELS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-400">Qué tan bien está funcionando el control en la práctica.</p>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="responsable">
            Responsable
          </label>
          <input id="responsable" name="responsable" className="input" defaultValue={control.responsable ?? ""} />
        </div>

        <div>
          <label className="label" htmlFor="justificacion">
            Justificación
          </label>
          <textarea id="justificacion" name="justificacion" rows={2} className="input" defaultValue={control.justificacion ?? ""} />
        </div>

        <div>
          <label className="label" htmlFor="evidencia">
            Evidencia
          </label>
          <textarea id="evidencia" name="evidencia" rows={2} className="input" defaultValue={control.evidencia ?? ""} />
        </div>

        <div>
          <label className="label" htmlFor="fechaRevision">
            Fecha de revisión
          </label>
          <input
            id="fechaRevision"
            name="fechaRevision"
            type="date"
            className="input"
            defaultValue={toDateInputValue(control.fechaRevision)}
          />
        </div>

        <fieldset className="rounded-md border border-gray-200 p-4">
          <legend className="px-1 text-sm font-semibold text-gray-700">
            Banderas de aplicabilidad a otras normas (mapeo de partida, ajustable)
          </legend>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="appliesTo27017" defaultChecked={control.appliesTo27017} className="h-4 w-4 rounded border-gray-300" />
              Aplica a servicios en la nube (ISO/IEC 27017)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="appliesTo27018" defaultChecked={control.appliesTo27018} className="h-4 w-4 rounded border-gray-300" />
              Relevante para PII en nube pública (ISO/IEC 27018)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="appliesTo27701" defaultChecked={control.appliesTo27701} className="h-4 w-4 rounded border-gray-300" />
              Relevante para el PIMS (ISO/IEC 27701)
            </label>
          </div>
        </fieldset>

        <div className="flex justify-end gap-2">
          <button type="submit" className="btn-primary">
            Guardar implementación
          </button>
        </div>
      </form>
    </div>
  );
}
