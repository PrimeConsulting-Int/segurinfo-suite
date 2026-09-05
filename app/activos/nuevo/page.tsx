import AssetForm from "../AssetForm";
import { createAsset } from "../actions";

export default function NuevoActivoPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-bold">Nuevo activo</h1>
      <AssetForm action={createAsset} submitLabel="Crear activo" />
    </div>
  );
}
