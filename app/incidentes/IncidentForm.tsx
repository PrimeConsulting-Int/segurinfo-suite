import { INCIDENT_CATEGORIES, INCIDENT_SEVERITIES, INCIDENT_STATES } from "@/lib/enums";

type RiskOption = { id: string; code: string; title: string };
type AssetOption = { id: string; name: string };

type IncidentDefaults = {
  title?: string;
  description?: string | null;
  categoria?: string;
  severidad?: string;
  estado?: string;
  fechaDeteccion?: Date | string | null;
  fechaResolucion?: Date | string | null;
  causaRaiz?: string | null;
  leccionesAprendidas?: string | null;
  riskId?: string | null;
  assetIds?: string[];
};

function toDateInputValue(d?: Date | string | null) {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export default function IncidentForm({
  action,
  risks,
  assets,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  risks: RiskOption[];
  assets: AssetOption[];
  defaults?: IncidentDefaults;
  submitLabel: string;
}) {
  const selectedAssets = new Set(defaults?.assetIds ?? []);

  return (
    <form action={action} className="card space-y-4 p-6">
      <div>
        <label className="label" htmlFor="title">
          Título
        </label>
        <input id="title" name="title" required className="input" defaultValue={defaults?.title} />
      </div>

      <div>
        <label className="label" htmlFor="description">
          Descripción
        </label>
        <textarea id="description" name="description" rows={2} className="input" defaultValue={defaults?.description ?? ""} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="categoria">
            Categoría
          </label>
          <select id="categoria" name="categoria" required className="input" defaultValue={defaults?.categoria ?? INCIDENT_CATEGORIES[0]}>
            {INCIDENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="severidad">
            Severidad
          </label>
          <select id="severidad" name="severidad" required className="input" defaultValue={defaults?.severidad ?? "Media"}>
            {INCIDENT_SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="estado">
            Estado
          </label>
          <select id="estado" name="estado" required className="input" defaultValue={defaults?.estado ?? INCIDENT_STATES[0]}>
            {INCIDENT_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="fechaDeteccion">
            Fecha de detección
          </label>
          <input
            id="fechaDeteccion"
            name="fechaDeteccion"
            type="date"
            required
            className="input"
            defaultValue={toDateInputValue(defaults?.fechaDeteccion)}
          />
        </div>
        <div>
          <label className="label" htmlFor="fechaResolucion">
            Fecha de resolución
          </label>
          <input
            id="fechaResolucion"
            name="fechaResolucion"
            type="date"
            className="input"
            defaultValue={toDateInputValue(defaults?.fechaResolucion)}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="causaRaiz">
          Causa raíz
        </label>
        <textarea id="causaRaiz" name="causaRaiz" rows={2} className="input" defaultValue={defaults?.causaRaiz ?? ""} />
      </div>

      <div>
        <label className="label" htmlFor="leccionesAprendidas">
          Lecciones aprendidas
        </label>
        <textarea id="leccionesAprendidas" name="leccionesAprendidas" rows={2} className="input" defaultValue={defaults?.leccionesAprendidas ?? ""} />
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

      <fieldset className="rounded-md border border-gray-200 p-4">
        <legend className="px-1 text-sm font-semibold text-gray-700">Activos afectados</legend>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {assets.map((a) => (
            <label key={a.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="assetIds" value={a.id} defaultChecked={selectedAssets.has(a.id)} />
              {a.name}
            </label>
          ))}
          {assets.length === 0 && <p className="text-xs text-gray-400">No hay activos registrados.</p>}
        </div>
      </fieldset>

      <div className="flex justify-end gap-2">
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
