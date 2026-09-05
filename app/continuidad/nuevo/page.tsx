import PlanForm from "../PlanForm";
import { createPlan } from "../actions";

export default function NuevoPlanPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-bold">Nuevo plan de continuidad</h1>
      <PlanForm action={createPlan} submitLabel="Crear plan" />
    </div>
  );
}
