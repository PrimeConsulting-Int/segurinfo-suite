import { INDICATOR_TYPES, INDICATOR_DIRECTIONS, INDICATOR_DIRECTION_LABELS, INDICATOR_FREQUENCIES } from "@/lib/enums";

type RiskOption = { id: string; code: string; title: string };

type IndicatorDefaults = {
  tipo?: string;
  nombre?: string;
  descripcion?: string | null;
  unidad?: string | null;
  direccion?: string;
  meta?: number;
  umbralAlerta?: number;
  umbralCritico?: number;
  frecuencia?: string;
  responsable?: string | null;
  riskId?: string | null;
};

export default function IndicatorForm({
  action,
  risks,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  risks: RiskOption[];
  defaults?: IndicatorDefaults;
  submitLabel: string;
}) {
  return (
    <form action={action} className="card space-y-4 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="tipo">
            Tipo
          </label>
          <select id="tipo" name="tipo" required className="input" defaultValue={defaults?.tipo ?? INDICATOR_TYPES[0]}>
            {INDICATOR_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="frecuencia">
            Frecuencia de medición
          </label>
          <select id="frecuencia" name="frecuencia" required className="input" defaultValue={defaults?.frecuencia ?? INDICATOR_FREQUENCIES[2]}>
            {INDICATOR_FREQUENCIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="nombre">
          Nombre
        </label>
        <input id="nombre" name="nombre" required className="input" defaultValue={defaults?.nombre} />
      </div>

      <div>
        <label className="label" htmlFor="descripcion">
          Descripción
        </label>
        <textarea id="descripcion" name="descripcion" rows={2} className="input" defaultValue={defaults?.descripcion ?? ""} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="unidad">
            Unidad
          </label>
          <input id="unidad" name="unidad" className="input" defaultValue={defaults?.unidad ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor="direccion">
            Dirección
          </label>
          <select id="direccion" name="direccion" required className="input" defaultValue={defaults?.direccion ?? INDICATOR_DIRECTIONS[0]}>
            {INDICATOR_DIRECTIONS.map((d) => (
              <option key={d} value={d}>
                {INDICATOR_DIRECTION_LABELS[d]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="meta">
            Meta
          </label>
          <input id="meta" name="meta" type="number" step="any" required className="input" defaultValue={defaults?.meta} />
        </div>
        <div>
          <label className="label" htmlFor="umbralAlerta">
            Umbral de alerta
          </label>
          <input id="umbralAlerta" name="umbralAlerta" type="number" step="any" required className="input" defaultValue={defaults?.umbralAlerta} />
        </div>
        <div>
          <label className="label" htmlFor="umbralCritico">
            Umbral crítico
          </label>
          <input id="umbralCritico" name="umbralCritico" type="number" step="any" required className="input" defaultValue={defaults?.umbralCritico} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="responsable">
            Responsable
          </label>
          <input id="responsable" name="responsable" className="input" defaultValue={defaults?.responsable ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor="riskId">
            Riesgo relacionado (opcional)
          </label>
          <select id="riskId" name="riskId" className="input" defaultValue={defaults?.riskId ?? ""}>
            <option value="">— Sin riesgo asociado —</option>
            {risks.map((r) => (
              <option key={r.id} value={r.id}>
                {r.code} — {r.title}
              </option>
            ))}
          </select>
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
