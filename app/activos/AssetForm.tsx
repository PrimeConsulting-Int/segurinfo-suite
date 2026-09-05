import { ASSET_TYPES, CRITICALITY_LEVELS } from "@/lib/enums";

type AssetDefaults = {
  name?: string;
  type?: string;
  owner?: string;
  criticality?: string;
  description?: string | null;
};

export default function AssetForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaults?: AssetDefaults;
  submitLabel: string;
}) {
  return (
    <form action={action} className="card space-y-4 p-6">
      <div>
        <label className="label" htmlFor="name">
          Nombre
        </label>
        <input id="name" name="name" required className="input" defaultValue={defaults?.name} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="type">
            Tipo
          </label>
          <select id="type" name="type" required className="input" defaultValue={defaults?.type ?? ASSET_TYPES[0]}>
            {ASSET_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="criticality">
            Criticidad
          </label>
          <select
            id="criticality"
            name="criticality"
            required
            className="input"
            defaultValue={defaults?.criticality ?? "Medio"}
          >
            {CRITICALITY_LEVELS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="owner">
          Responsable
        </label>
        <input id="owner" name="owner" required className="input" defaultValue={defaults?.owner} />
      </div>

      <div>
        <label className="label" htmlFor="description">
          Descripción
        </label>
        <textarea id="description" name="description" rows={3} className="input" defaultValue={defaults?.description ?? ""} />
      </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
