"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { nextRiskCode } from "@/lib/codes";
import {
  RISK_CATEGORIES,
  RISK_TREATMENTS,
  RISK_STATES,
  assertOneOf,
  assertIntInRange,
  parseOptionalString,
  parseOptionalInt,
} from "@/lib/enums";

function readRiskForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("El título del riesgo es obligatorio");

  const category = assertOneOf(String(formData.get("category") ?? ""), RISK_CATEGORIES, "categoría");
  const assetId = parseOptionalString(formData.get("assetId"));

  const causa = parseOptionalString(formData.get("causa"));
  const vulnerabilidad = parseOptionalString(formData.get("vulnerabilidad"));
  const amenaza = parseOptionalString(formData.get("amenaza"));

  const probabilidad = assertIntInRange(Number(formData.get("probabilidad")), 1, 5, "probabilidad");
  const impacto = assertIntInRange(Number(formData.get("impacto")), 1, 5, "impacto");
  const nivelInherente = probabilidad * impacto;

  const tratamiento = assertOneOf(String(formData.get("tratamiento") ?? ""), RISK_TREATMENTS, "tratamiento");

  const probabilidadResidualRaw = parseOptionalInt(formData.get("probabilidadResidual"));
  const impactoResidualRaw = parseOptionalInt(formData.get("impactoResidual"));
  const probabilidadResidual =
    probabilidadResidualRaw !== null ? assertIntInRange(probabilidadResidualRaw, 1, 5, "probabilidad residual") : null;
  const impactoResidual =
    impactoResidualRaw !== null ? assertIntInRange(impactoResidualRaw, 1, 5, "impacto residual") : null;
  const nivelResidual =
    probabilidadResidual !== null && impactoResidual !== null ? probabilidadResidual * impactoResidual : null;

  const estado = assertOneOf(String(formData.get("estado") ?? ""), RISK_STATES, "estado");
  const responsable = parseOptionalString(formData.get("responsable"));

  const controlIds = formData.getAll("controlIds").map(String).filter(Boolean);

  return {
    title,
    category,
    assetId,
    causa,
    vulnerabilidad,
    amenaza,
    probabilidad,
    impacto,
    nivelInherente,
    tratamiento,
    probabilidadResidual,
    impactoResidual,
    nivelResidual,
    estado,
    responsable,
    controlIds,
  };
}

export async function createRisk(formData: FormData) {
  const { controlIds, assetId, ...data } = readRiskForm(formData);
  const code = await nextRiskCode();

  await prisma.risk.create({
    data: {
      ...data,
      code,
      asset: assetId ? { connect: { id: assetId } } : undefined,
      controles: controlIds.length > 0 ? { connect: controlIds.map((id) => ({ id })) } : undefined,
    },
  });

  revalidatePath("/riesgos");
  revalidatePath("/dashboard");
  revalidatePath("/apetito");
  redirect("/riesgos");
}

export async function updateRisk(id: string, formData: FormData) {
  const { controlIds, assetId, ...data } = readRiskForm(formData);

  await prisma.risk.update({
    where: { id },
    data: {
      ...data,
      asset: assetId ? { connect: { id: assetId } } : { disconnect: true },
      controles: { set: controlIds.map((cid) => ({ id: cid })) },
    },
  });

  revalidatePath("/riesgos");
  revalidatePath("/dashboard");
  revalidatePath("/apetito");
  redirect("/riesgos");
}

export async function deleteRisk(id: string, formData: FormData) {
  await prisma.risk.delete({ where: { id } });
  revalidatePath("/riesgos");
  revalidatePath("/dashboard");
  revalidatePath("/apetito");
  redirect("/riesgos");
}
