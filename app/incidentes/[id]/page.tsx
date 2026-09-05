import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import IncidentForm from "../IncidentForm";
import { updateIncident, deleteIncident } from "../actions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";

export const dynamic = "force-dynamic";

export default async function EditarIncidentePage({ params }: { params: { id: string } }) {
  const [incident, risks, assets] = await Promise.all([
    prisma.incident.findUnique({ where: { id: params.id }, include: { activos: { select: { id: true } } } }),
    prisma.risk.findMany({ orderBy: { code: "asc" }, select: { id: true, code: true, title: true } }),
    prisma.asset.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!incident) notFound();

  const defaults = { ...incident, assetIds: incident.activos.map((a: { id: string }) => a.id) };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Editar incidente {incident.code}</h1>
        <ConfirmDeleteForm action={deleteIncident.bind(null, incident.id)} />
      </div>
      <IncidentForm
        action={updateIncident.bind(null, incident.id)}
        risks={risks}
        assets={assets}
        defaults={defaults}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
