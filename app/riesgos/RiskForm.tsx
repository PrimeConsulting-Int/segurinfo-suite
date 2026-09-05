import { RISK_CATEGORIES, RISK_TREATMENTS, RISK_STATES, SCALE_1_5, CONTROL_FAMILY_LABELS } from "@/lib/enums";

type AssetOption = { id: string; name: string };
type ControlOption = { id: string; code: string; title: string; family: string };

type RiskDefaults = {
  title?: string;
  category?: string;
  assetId?: string | null;
  causa?: string | null;
  vulnerabilidad?: string | null;
  amenaza?: string | null;
  probabilidad?: number;
  impacto?: number;
  tratamiento?: string;
  probabilidadResidual?: number | null;
  impactoResidual?: number | null;
  estado?: string;
  responsable?: string | null;
  controlIds?: string[];
};

export default function RiskForm({
  action,
  assets,
  controls,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  assets: AssetOption[];
  controls: ControlOption[];
  defaults?: RiskDefaults;
  submitLabel: string;
}) {
  const selectedControls = new Set(defaults?.controlIds ?? []);
  const byFamily = new Map<string, ControlOption[]>();
  for (const c of controls) {
    if (!byFamily.has(c.family)) byFamily.set(c.family, []);
    byFamily.get(c.family)!.push(c);
  }

  return (
    <form action={action} className="card space-y-6 p-6">
      <div>
        <label className="label" htmlFor="title">
          Título
        </label>
        <input id="title" name="title" required className="input" defaultValue={defaults?.title} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="category">
            Categoría
          </label>
          <select id="category" name="category" required className="input" defaultValue={defaults?.category ?? RISK_CATEGORIES[0]}>
            {RISK_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="assetId">
            Activo relacionado
          </label>
          <select id="assetId" name="assetId" className="input" defaultValue={defaults?.assetId ?? ""}>
            <option value="">— Sin activo asociado —</option>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="causa">
            Causa
          </label>
          <textarea id="causa" name="causa" rows={2} className="input" defaultValue={defaults?.causa ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor="vulnerabilidad">
            Vulnerabilidad
          </label>
          <textarea id="vulnerabilidad" name="vulnerabilidad" rows={2} className="input" defaultValue={defaults?.vulnerabilidad ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor="amenaza">
            Amenaza
          </label>
          <textarea id="amenaza" name="amenaza" rows={2} className="input" defaultValue={defaults?.amenaza ?? ""} />
        </div>
      </div>

      <fieldset className="rounded-md border border-gray-200 p-4">
        <legend className="px-1 text-sm font-semibold text-gray-700">Análisis inherente</legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="probabilidad">
              Probabilidad (1-5)
            </label>
            <select id="probabilidad" name="probabilidad" required className="input" defaultValue={defaults?.probabilidad ?? 3}>
              {SCALE_1_5.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="impacto">
              Impacto (1-5)
            </label>
            <select id="impacto" name="impacto" required className="input" defaultValue={defaults?.impacto ?? 3}>
              {SCALE_1_5.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          El nivel inherente se calcula automáticamente como probabilidad × impacto al guardar.
        </p>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="tratamiento">
            Tratamiento
          </label>
          <select id="tratamiento" name="tratamiento" required className="input" defaultValue={defaults?.tratamiento ?? RISK_TREATMENTS[0]}>
            {RISK_TREATMENTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="estado">
            Estado
          </label>
          <select id="estado" name="estado" required className="input" defaultValue={defaults?.estado ?? RISK_STATES[0]}>
            {RISK_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="rounded-md border border-gray-200 p-4">
        <legend className="px-1 text-sm font-semibold text-gray-700">
          Análisis residual (opcional, tras aplicar controles de tratamiento)
        </legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="probabilidadResidual">
              Probabilidad residual (1-5)
            </label>
            <select
              id="probabilidadResidual"
              name="probabilidadResidual"
              className="input"
              defaultValue={defaults?.probabilidadResidual ?? ""}
            >
              <option value="">— No definida —</option>
              {SCALE_1_5.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="impactoResidual">
              Impacto residual (1-5)
            </label>
            <select
              id="impactoResidual"
              name="impactoResidual"
              className="input"
              defaultValue={defaults?.impactoResidual ?? ""}
            >
              <option value="">— No definido —</option>
              {SCALE_1_5.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Si se definen ambos valores, el nivel residual se calcula automáticamente y se usa como nivel actual del riesgo.
        </p>
      </fieldset>

      <div>
        <label className="label" htmlFor="responsable">
          Responsable
        </label>
        <input id="responsable" name="responsable" className="input" defaultValue={defaults?.responsable ?? ""} />
      </div>

      <fieldset className="rounded-md border border-gray-200 p-4">
        <legend className="px-1 text-sm font-semibold text-gray-700">Controles de tratamiento asociados</legend>
        <div className="max-h-96 space-y-4 overflow-y-auto pr-2">
          {[...byFamily.entries()].map(([family, list]) => (
            <div key={family}>
              <h4 className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">
                {CONTROL_FAMILY_LABELS[family as keyof typeof CONTROL_FAMILY_LABELS] ?? family}
              </h4>
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {list.map((c) => (
                  <label key={c.id} className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="controlIds"
                      value={c.id}
                      defaultChecked={selectedControls.has(c.id)}
                      className="mt-1"
                    />
                    <span>
                      <span className="font-mono text-xs text-gray-500">{c.code}</span> {c.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
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
