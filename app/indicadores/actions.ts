"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { nextIndicatorCode } from "@/lib/codes";
import {
  INDICATOR_TYPES,
  INDICATOR_DIRECTIONS,
  INDICATOR_FREQUENCIES,
  assertOneOf,
  parseOptionalString,
  parseOptionalFloat,
  parseOptionalDate,
} from "@/lib/enums";

function readIndicatorForm(formData: FormData) {
  const tipo = assertOneOf(String(formData.get("tipo") ?? ""), INDICATOR_TYPES, "tipo");
  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) throw new Error("El nombre del indicador es obligatorio");

  const descripcion = parseOptionalString(formData.get("descripcion"));
  const unidad = parseOptionalString(formData.get("unidad"));
  const direccion = assertOneOf(String(formData.get("direccion") ?? ""), INDICATOR_DIRECTIONS, "dirección");

  const meta = parseOptionalFloat(formData.get("meta"));
  const umbralAlerta = parseOptionalFloat(formData.get("umbralAlerta"));
  const umbralCritico = parseOptionalFloat(formData.get("umbralCritico"));
  if (meta === null) throw new Error("La meta es obligatoria");
  if (umbralAlerta === null) throw new Error("El umbral de alerta es obligatorio");
  if (umbralCritico === null) throw new Error("El umbral crítico es obligatorio");

  const frecuencia = assertOneOf(String(formData.get("frecuencia") ?? ""), INDICATOR_FREQUENCIES, "frecuencia");
  const responsable = parseOptionalString(formData.get("responsable"));
  const riskId = parseOptionalString(formData.get("riskId"));

  return { tipo, nombre, descripcion, unidad, direccion, meta, umbralAlerta, umbralCritico, frecuencia, responsable, riskId };
}

export async function createIndicator(formData: FormData) {
  const { riskId, ...data } = readIndicatorForm(formData);
  const code = await nextIndicatorCode();
  await prisma.indicator.create({
    data: { ...data, code, risk: riskId ? { connect: { id: riskId } } : undefined },
  });
  revalidatePath("/indicadores");
  revalidatePath("/dashboard");
  redirect("/indicadores");
}

export async function updateIndicator(id: string, formData: FormData) {
  const { riskId, ...data } = readIndicatorForm(formData);
  await prisma.indicator.update({
    where: { id },
    data: { ...data, risk: riskId ? { connect: { id: riskId } } : { disconnect: true } },
  });
  revalidatePath("/indicadores");
  revalidatePath("/dashboard");
  redirect(`/indicadores/${id}`);
}

export async function deleteIndicator(id: string, formData: FormData) {
  await prisma.indicator.delete({ where: { id } });
  revalidatePath("/indicadores");
  revalidatePath("/dashboard");
  redirect("/indicadores");
}

export async function addMeasurement(indicatorId: string, formData: FormData) {
  const fecha = parseOptionalDate(formData.get("fecha")) ?? new Date();
  const valor = parseOptionalFloat(formData.get("valor"));
  if (valor === null) throw new Error("El valor de la medición es obligatorio");
  const nota = parseOptionalString(formData.get("nota"));

  await prisma.measurement.create({ data: { indicatorId, fecha, valor, nota } });
  revalidatePath(`/indicadores/${indicatorId}`);
  revalidatePath("/indicadores");
  revalidatePath("/dashboard");
  redirect(`/indicadores/${indicatorId}`);
}

export async function deleteMeasurement(indicatorId: string, measurementId: string, formData: FormData) {
  await prisma.measurement.delete({ where: { id: measurementId } });
  revalidatePath(`/indicadores/${indicatorId}`);
  revalidatePath("/indicadores");
  revalidatePath("/dashboard");
  redirect(`/indicadores/${indicatorId}`);
}
