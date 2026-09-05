import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteIncident } from "./actions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";
import Badge from "@/components/Badge";
import { INCIDENT_SEVERITY_COLORS, formatDate } from "@/lib/enums";

export const dynamic = "force-dynamic";

export default async function IncidentesPage() {
  const incidents = await prisma.incident.findMany({
    orderBy: { code: "asc" },
    include: { activos: true },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Incidentes (ISO/IEC 27035)</h1>
          <p className="text-sm text-gray-500">Gestión de incidentes de seguridad de la información, con enfoque de ciberseguridad (27032).</p>
        </div>
        <Link href="/incidentes/nuevo" className="btn-primary">
          + Nuevo incidente
        </Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Código</th>
              <th>Título</th>
              <th>Categoría</th>
              <th>Severidad</th>
              <th>Estado</th>
              <th>Detección</th>
              <th>Activos</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {incidents.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-gray-400">
                  No hay incidentes registrados todavía.
                </td>
              </tr>
            )}
            {incidents.map((i: any) => (
              <tr key={i.id}>
                <td className="font-mono text-xs">{i.code}</td>
                <td className="font-medium text-gray-900">{i.title}</td>
                <td>{i.categoria}</td>
                <td>
                  <Badge text={i.severidad} className={INCIDENT_SEVERITY_COLORS[i.severidad]} />
                </td>
                <td>{i.estado}</td>
                <td>{formatDate(i.fechaDeteccion)}</td>
                <td>{i.activos.map((a: any) => a.name).join(", ") || "—"}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <Link href={`/incidentes/${i.id}`} className="btn-secondary">
                      Editar
                    </Link>
                    <ConfirmDeleteForm action={deleteIncident.bind(null, i.id)} />
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
