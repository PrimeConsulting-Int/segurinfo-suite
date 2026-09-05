"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CONTROL_STATES, assertOneOf, assertIntInRange, parseOptionalString, parseOptionalDate, parseCheckbox } from "@/lib/enums";

export async function updateControlImplementation(id: string, formData: FormData) {
  const aplicable = parseCheckbox(formData.get("aplicable"));
  const estado = assertOneOf(String(formData.get("estado") ?? ""), CONTROL_STATES, "estado");
  const madurezRaw = parseOptionalString(formData.get("madurez"));
  const madurez = madurezRaw !== null ? assertIntInRange(Number(madurezRaw), 1, 5, "madurez") : null;
  const efectividadRaw = parseOptionalString(formData.get("efectividad"));
  const efectividad = efectividadRaw !== null ? assertIntInRange(Number(efectividadRaw), 1, 5, "efectividad") : null;
  const responsable = parseOptionalString(formData.get("responsable"));
  const justificacion = parseOptionalString(formData.get("justificacion"));
  const evidencia = parseOptionalString(formData.get("evidencia"));
  const fechaRevision = parseOptionalDate(formData.get("fechaRevision"));

  const appliesTo27017 = parseCheckbox(formData.get("appliesTo27017"));
  const appliesTo27018 = parseCheckbox(formData.get("appliesTo27018"));
  const appliesTo27701 = parseCheckbox(formData.get("appliesTo27701"));

  await prisma.control.update({
    where: { id },
    data: {
      aplicable,
      estado,
      madurez,
      efectividad,
      responsable,
      justificacion,
      evidencia,
      fechaRevision,
      appliesTo27017,
      appliesTo27018,
      appliesTo27701,
    },
  });

  revalidatePath("/controles");
  revalidatePath("/dashboard");
  redirect("/controles");
}
