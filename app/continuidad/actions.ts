"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CONTINUITY_PLAN_STATES, assertOneOf, parseOptionalString, parseOptionalDate } from "@/lib/enums";

function readPlanForm(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) throw new Error("El nombre del plan es obligatorio");

  const alcance = parseOptionalString(formData.get("alcance"));
  const rto = parseOptionalString(formData.get("rto"));
  const rpo = parseOptionalString(formData.get("rpo"));
  const estrategia = parseOptionalString(formData.get("estrategia"));
  const estado = assertOneOf(String(formData.get("estado") ?? ""), CONTINUITY_PLAN_STATES, "estado");
  const fechaUltimaPrueba = parseOptionalDate(formData.get("fechaUltimaPrueba"));
  const fechaProximaPrueba = parseOptionalDate(formData.get("fechaProximaPrueba"));
  const responsable = parseOptionalString(formData.get("responsable"));

  return { nombre, alcance, rto, rpo, estrategia, estado, fechaUltimaPrueba, fechaProximaPrueba, responsable };
}

export async function createPlan(formData: FormData) {
  const data = readPlanForm(formData);
  await prisma.continuityPlan.create({ data });
  revalidatePath("/continuidad");
  revalidatePath("/dashboard");
  redirect("/continuidad");
}

export async function updatePlan(id: string, formData: FormData) {
  const data = readPlanForm(formData);
  await prisma.continuityPlan.update({ where: { id }, data });
  revalidatePath("/continuidad");
  revalidatePath("/dashboard");
  redirect("/continuidad");
}

export async function deletePlan(id: string, formData: FormData) {
  await prisma.continuityPlan.delete({ where: { id } });
  revalidatePath("/continuidad");
  revalidatePath("/dashboard");
  redirect("/continuidad");
}
