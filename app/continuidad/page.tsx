import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePlan } from "./actions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";
import Badge from "@/components/Badge";
import { formatDate } from "@/lib/enums";

export const dynamic = "force-dynamic";

const STATE_COLORS: Record<string, string> = {
  Borrador: "bg-gray-100 text-gray-600 border-gray-300",
  Aprobado: "bg-sky-100 text-sky-800 border-sky-300",
  Probado: "bg-emerald-100 text-emerald-800 border-emerald-300",
  Desactualizado: "bg-red-100 text-red-800 border-red-300",
};

export default async function ContinuidadPage() {
  const plans = await prisma.continuityPlan.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Continuidad (ISO/IEC 27031)</h1>
          <p className="text-sm text-gray-500">
            Guía de preparación TIC para la continuidad del negocio. Planes de recuperación y sus pruebas.
          </p>
        </div>
        <Link href="/continuidad/nuevo" className="btn-primary">
          + Nuevo plan
        </Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>RTO</th>
              <th>RPO</th>
              <th>Estado</th>
              <th>Última prueba</th>
              <th>Próxima prueba</th>
              <th>Responsable</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {plans.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-gray-400">
                  No hay planes de continuidad registrados todavía.
                </td>
              </tr>
            )}
            {plans.map((p: any) => (
              <tr key={p.id}>
                <td className="font-medium text-gray-900">{p.nombre}</td>
                <td>{p.rto ?? "—"}</td>
                <td>{p.rpo ?? "—"}</td>
                <td>
                  <Badge text={p.estado} className={STATE_COLORS[p.estado]} />
                </td>
                <td>{formatDate(p.fechaUltimaPrueba)}</td>
                <td>{formatDate(p.fechaProximaPrueba)}</td>
                <td>{p.responsable ?? "—"}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <Link href={`/continuidad/${p.id}`} className="btn-secondary">
                      Editar
                    </Link>
                    <ConfirmDeleteForm action={deletePlan.bind(null, p.id)} />
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
