import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RiskForm from "../RiskForm";
import { updateRisk, deleteRisk } from "../actions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";

export const dynamic = "force-dynamic";

export default async function EditarRiesgoPage({ params }: { params: { id: string } }) {
  const [risk, assets, controls] = await Promise.all([
    prisma.risk.findUnique({ where: { id: params.id }, include: { controles: { select: { id: true } } } }),
    prisma.asset.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.control.findMany({ orderBy: [{ family: "asc" }, { code: "asc" }], select: { id: true, code: true, title: true, family: true } }),
  ]);

  if (!risk) notFound();

  const defaults = {
    ...risk,
    controlIds: risk.controles.map((c: { id: string }) => c.id),
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Editar riesgo {risk.code}</h1>
        </div>
        <ConfirmDeleteForm action={deleteRisk.bind(null, risk.id)} />
      </div>
      <RiskForm
        action={updateRisk.bind(null, risk.id)}
        assets={assets}
        controls={controls}
        defaults={defaults}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
