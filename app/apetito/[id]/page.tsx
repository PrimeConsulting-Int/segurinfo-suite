import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppetiteForm from "../AppetiteForm";
import { updateAppetite, deleteAppetite } from "../actions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";
import { RISK_CATEGORIES } from "@/lib/enums";

export const dynamic = "force-dynamic";

export default async function EditarAppetitePage({ params }: { params: { id: string } }) {
  const appetite = await prisma.riskAppetite.findUnique({ where: { id: params.id } });
  if (!appetite) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Editar apetito — {appetite.category}</h1>
        <ConfirmDeleteForm action={deleteAppetite.bind(null, appetite.id)} />
      </div>
      <AppetiteForm
        action={updateAppetite.bind(null, appetite.id)}
        categoryOptions={RISK_CATEGORIES}
        defaults={appetite}
        lockCategory
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
