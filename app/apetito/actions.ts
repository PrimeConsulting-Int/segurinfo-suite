"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RISK_CATEGORIES, assertOneOf, assertIntInRange, parseOptionalString, parseOptionalDate } from "@/lib/enums";

function readAppetiteForm(formData: FormData) {
  const category = assertOneOf(String(formData.get("category") ?? ""), RISK_CATEGORIES, "categoría");
  const statement = String(formData.get("statement") ?? "").trim();
  if (!statement) throw new Error("La declaración de apetito es obligatoria");

  const appetiteThreshold = assertIntInRange(Number(formData.get("appetiteThreshold")), 1, 25, "umbral de apetito");
  const toleranceThreshold = assertIntInRange(Number(formData.get("toleranceThreshold")), 1, 25, "umbral de tolerancia");
  if (toleranceThreshold < appetiteThreshold) {
    throw new Error("El umbral de tolerancia debe ser mayor o igual al umbral de apetito");
  }

  const responsable = parseOptionalString(formData.get("responsable"));
  const approvedDate = parseOptionalDate(formData.get("approvedDate"));

  return { category, statement, appetiteThreshold, toleranceThreshold, responsable, approvedDate };
}

export async function createAppetite(formData: FormData) {
  const data = readAppetiteForm(formData);
  await prisma.riskAppetite.create({ data });
  revalidatePath("/apetito");
  revalidatePath("/dashboard");
  redirect("/apetito");
}

export async function updateAppetite(id: string, formData: FormData) {
  const data = readAppetiteForm(formData);
  await prisma.riskAppetite.update({ where: { id }, data });
  revalidatePath("/apetito");
  revalidatePath("/dashboard");
  redirect("/apetito");
}

export async function deleteAppetite(id: string, formData: FormData) {
  await prisma.riskAppetite.delete({ where: { id } });
  revalidatePath("/apetito");
  revalidatePath("/dashboard");
  redirect("/apetito");
}
