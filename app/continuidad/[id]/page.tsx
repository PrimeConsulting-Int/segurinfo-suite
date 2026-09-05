import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PlanForm from "../PlanForm";
import { updatePlan, deletePlan } from "../actions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";

export const dynamic = "force-dynamic";

export default async function EditarPlanPage({ params }: { params: { id: string } }) {
  const plan = await prisma.continuityPlan.findUnique({ where: { id: params.id } });
  if (!plan) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Editar plan de continuidad</h1>
        <ConfirmDeleteForm action={deletePlan.bind(null, plan.id)} />
      </div>
      <PlanForm action={updatePlan.bind(null, plan.id)} defaults={plan} submitLabel="Guardar cambios" />
    </div>
  );
}
