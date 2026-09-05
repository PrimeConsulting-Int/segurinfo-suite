type AppetiteDefaults = {
  category?: string;
  statement?: string;
  appetiteThreshold?: number;
  toleranceThreshold?: number;
  responsable?: string | null;
  approvedDate?: Date | string | null;
};

function toDateInputValue(d?: Date | string | null) {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export default function AppetiteForm({
  action,
  categoryOptions,
  defaults,
  lockCategory,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  categoryOptions: readonly string[];
  defaults?: AppetiteDefaults;
  lockCategory?: boolean;
  submitLabel: string;
}) {
  return (
    <form action={action} className="card space-y-4 p-6">
      <div>
        <label className="label" htmlFor="category">
          Categoría de riesgo
        </label>
        <select
          id="category"
          name={lockCategory ? undefined : "category"}
          required
          disabled={lockCategory}
          className="input disabled:bg-gray-100"
          defaultValue={defaults?.category ?? categoryOptions[0]}
        >
          {(lockCategory && defaults?.category ? [defaults.category] : categoryOptions).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {/* A disabled <select> is excluded from FormData on submit, so when the category is
            locked (editing an existing entry) we mirror its value into a hidden input that
            DOES get submitted, instead of relying on the disabled control's value. */}
        {lockCategory && defaults?.category && <input type="hidden" name="category" value={defaults.category} />}
      </div>

      <div>
        <label className="label" htmlFor="statement">
          Declaración de apetito
        </label>
        <textarea id="statement" name="statement" rows={3} required className="input" defaultValue={defaults?.statement} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="appetiteThreshold">
            Umbral de apetito (1-25)
          </label>
          <input
            id="appetiteThreshold"
            name="appetiteThreshold"
            type="number"
            min={1}
            max={25}
            required
            className="input"
            defaultValue={defaults?.appetiteThreshold}
          />
        </div>
        <div>
          <label className="label" htmlFor="toleranceThreshold">
            Umbral de tolerancia (1-25, ≥ apetito)
          </label>
          <input
            id="toleranceThreshold"
            name="toleranceThreshold"
            type="number"
            min={1}
            max={25}
            required
            className="input"
            defaultValue={defaults?.toleranceThreshold}
          />
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
          <label className="label" htmlFor="approvedDate">
            Fecha de aprobación
          </label>
          <input
            id="approvedDate"
            name="approvedDate"
            type="date"
            className="input"
            defaultValue={toDateInputValue(defaults?.approvedDate)}
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
