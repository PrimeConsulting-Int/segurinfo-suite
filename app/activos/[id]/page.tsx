import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AssetForm from "../AssetForm";
import { updateAsset, deleteAsset } from "../actions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";

export const dynamic = "force-dynamic";

export default async function EditarActivoPage({ params }: { params: { id: string } }) {
  const asset = await prisma.asset.findUnique({ where: { id: params.id } });
  if (!asset) notFound();

  const updateWithId = updateAsset.bind(null, asset.id);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Editar activo</h1>
        <ConfirmDeleteForm action={deleteAsset.bind(null, asset.id)} />
      </div>
      <AssetForm action={updateWithId} defaults={asset} submitLabel="Guardar cambios" />
    </div>
  );
}
