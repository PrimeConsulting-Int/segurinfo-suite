import { prisma } from "@/lib/prisma";
import IncidentForm from "../IncidentForm";
import { createIncident } from "../actions";

export const dynamic = "force-dynamic";

export default async function NuevoIncidentePage() {
  const [risks, assets] = await Promise.all([
    prisma.risk.findMany({ orderBy: { code: "asc" }, select: { id: true, code: true, title: true } }),
    prisma.asset.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-xl font-bold">Nuevo incidente</h1>
      <IncidentForm action={createIncident} risks={risks} assets={assets} submitLabel="Crear incidente" />
    </div>
  );
}
