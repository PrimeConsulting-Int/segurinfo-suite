import { prisma } from "@/lib/prisma";
import IndicatorForm from "../IndicatorForm";
import { createIndicator } from "../actions";

export const dynamic = "force-dynamic";

export default async function NuevoIndicadorPage() {
  const risks = await prisma.risk.findMany({ orderBy: { code: "asc" }, select: { id: true, code: true, title: true } });

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-bold">Nuevo indicador</h1>
      <IndicatorForm action={createIndicator} risks={risks} submitLabel="Crear indicador" />
    </div>
  );
}
