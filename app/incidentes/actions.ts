"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { nextIncidentCode } from "@/lib/codes";
import { INCIDENT_CATEGORIES, INCIDENT_SEVERITIES, INCIDENT_STATES, assertOneOf, parseOptionalString, parseOptionalDate } from "@/lib/enums";

function readIncidentForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("El título del incidente es obligatorio");

  const description = parseOptionalString(formData.get("description"));
  const categoria = assertOneOf(String(formData.get("categoria") ?? ""), INCIDENT_CATEGORIES, "categoría");
  const severidad = assertOneOf(String(formData.get("severidad") ?? ""), INCIDENT_SEVERITIES, "severidad");
  const estado = assertOneOf(String(formData.get("estado") ?? ""), INCIDENT_STATES, "estado");

  const fechaDeteccion = parseOptionalDate(formData.get("fechaDeteccion"));
  if (!fechaDeteccion) throw new Error("La fecha de detección es obligatoria");
  const fechaResolucion = parseOptionalDate(formData.get("fechaResolucion"));

  const causaRaiz = parseOptionalString(formData.get("causaRaiz"));
  const leccionesAprendidas = parseOptionalString(formData.get("leccionesAprendidas"));
  const riskId = parseOptionalString(formData.get("riskId"));
  const assetIds = formData.getAll("assetIds").map(String).filter(Boolean);

  return {
    title,
    description,
    categoria,
    severidad,
    estado,
    fechaDeteccion,
    fechaResolucion,
    causaRaiz,
    leccionesAprendidas,
    riskId,
    assetIds,
  };
}

export async function createIncident(formData: FormData) {
  const { riskId, assetIds, ...data } = readIncidentForm(formData);
  const code = await nextIncidentCode();

  await prisma.incident.create({
    data: {
      ...data,
      code,
      risk: riskId ? { connect: { id: riskId } } : undefined,
      activos: assetIds.length > 0 ? { connect: assetIds.map((id) => ({ id })) } : undefined,
    },
  });

  revalidatePath("/incidentes");
  revalidatePath("/dashboard");
  redirect("/incidentes");
}

export async function updateIncident(id: string, formData: FormData) {
  const { riskId, assetIds, ...data } = readIncidentForm(formData);

  await prisma.incident.update({
    where: { id },
    data: {
      ...data,
      risk: riskId ? { connect: { id: riskId } } : { disconnect: true },
      activos: { set: assetIds.map((aid) => ({ id: aid })) },
    },
  });

  revalidatePath("/incidentes");
  revalidatePath("/dashboard");
  redirect("/incidentes");
}

export async function deleteIncident(id: string, formData: FormData) {
  await prisma.incident.delete({ where: { id } });
  revalidatePath("/incidentes");
  revalidatePath("/dashboard");
  redirect("/incidentes");
}
