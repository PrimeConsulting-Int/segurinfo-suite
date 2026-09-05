import { CONTINUITY_PLAN_STATES } from "@/lib/enums";

type PlanDefaults = {
  nombre?: string;
  alcance?: string | null;
  rto?: string | null;
  rpo?: string | null;
  estrategia?: string | null;
  estado?: string;
  fechaUltimaPrueba?: Date | string | null;
  fechaProximaPrueba?: Date | string | null;
  responsable?: string | null;
};

function toDateInputValue(d?: Date | string | null) {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export default function PlanForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaults?: PlanDefaults;
  submitLabel: string;
}) {
  return (
    <form action={action} className="card space-y-4 p-6">
      <div>
        <label className="label" htmlFor="nombre">
          Nombre del plan
        </label>
        <input id="nombre" name="nombre" required className="input" defaultValue={defaults?.nombre} />
      </div>

      <div>
        <label className="label" htmlFor="alcance">
          Alcance
        </label>
        <textarea id="alcance" name="alcance" rows={2} className="input" defaultValue={defaults?.alcance ?? ""} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="rto">
            RTO (Recovery Time Objective)
          </label>
          <input id="rto" name="rto" className="input" placeholder="p. ej. 8 horas" defaultValue={defaults?.rto ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor="rpo">
            RPO (Recovery Point Objective)
          </label>
          <input id="rpo" name="rpo" className="input" placeholder="p. ej. 1 hora" defaultValue={defaults?.rpo ?? ""} />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="estrategia">
          Estrategia
        </label>
        <textarea id="estrategia" name="estrategia" rows={2} className="input" defaultValue={defaults?.estrategia ?? ""} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="estado">
            Estado
          </label>
          <select id="estado" name="estado" required className="input" defaultValue={defaults?.estado ?? CONTINUITY_PLAN_STATES[0]}>
            {CONTINUITY_PLAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="responsable">
            Responsable
          </label>
          <input id="responsable" name="responsable" className="input" defaultValue={defaults?.responsable ?? ""} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="fechaUltimaPrueba">
            Fecha de última prueba
          </label>
          <input
            id="fechaUltimaPrueba"
            name="fechaUltimaPrueba"
            type="date"
            className="input"
            defaultValue={toDateInputValue(defaults?.fechaUltimaPrueba)}
          />
        </div>
        <div>
          <label className="label" htmlFor="fechaProximaPrueba">
            Fecha de próxima prueba
          </label>
          <input
            id="fechaProximaPrueba"
            name="fechaProximaPrueba"
            type="date"
            className="input"
            defaultValue={toDateInputValue(defaults?.fechaProximaPrueba)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
