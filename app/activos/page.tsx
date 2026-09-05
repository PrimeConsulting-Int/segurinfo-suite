import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteAsset } from "./actions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";
import Badge from "@/components/Badge";

export const dynamic = "force-dynamic";

const CRITICALITY_COLORS: Record<string, string> = {
  Bajo: "bg-emerald-100 text-emerald-800 border-emerald-300",
  Medio: "bg-amber-100 text-amber-800 border-amber-300",
  Alto: "bg-orange-100 text-orange-800 border-orange-300",
  Crítico: "bg-red-100 text-red-800 border-red-300",
};

export default async function ActivosPage() {
  const assets = await prisma.asset.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { risks: true, incidentesAfectados: true } } },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Activos</h1>
          <p className="text-sm text-gray-500">Inventario base de activos de información, referenciado por riesgos e incidentes.</p>
        </div>
        <Link href="/activos/nuevo" className="btn-primary">
          + Nuevo activo
        </Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Responsable</th>
              <th>Criticidad</th>
              <th>Riesgos</th>
              <th>Incidentes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-gray-400">
                  No hay activos registrados todavía.
                </td>
              </tr>
            )}
            {assets.map((a: any) => (
              <tr key={a.id}>
                <td className="font-medium text-gray-900">{a.name}</td>
                <td>{a.type}</td>
                <td>{a.owner}</td>
                <td>
                  <Badge text={a.criticality} className={CRITICALITY_COLORS[a.criticality]} />
                </td>
                <td>{a._count.risks}</td>
                <td>{a._count.incidentesAfectados}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <Link href={`/activos/${a.id}`} className="btn-secondary">
                      Editar
                    </Link>
                    <ConfirmDeleteForm action={deleteAsset.bind(null, a.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
