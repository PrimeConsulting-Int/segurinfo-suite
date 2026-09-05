import { prisma } from "@/lib/prisma";
import RiskForm from "../RiskForm";
import { createRisk } from "../actions";

export const dynamic = "force-dynamic";

export default async function NuevoRiesgoPage() {
  const [assets, controls] = await Promise.all([
    prisma.asset.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.control.findMany({ orderBy: [{ family: "asc" }, { code: "asc" }], select: { id: true, code: true, title: true, family: true } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-xl font-bold">Nuevo riesgo</h1>
      <RiskForm action={createRisk} assets={assets} controls={controls} submitLabel="Crear riesgo" />
    </div>
  );
}
