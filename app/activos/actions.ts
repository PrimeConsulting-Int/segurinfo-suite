"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ASSET_TYPES, CRITICALITY_LEVELS, assertOneOf, parseOptionalString } from "@/lib/enums";

function readAssetForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const type = assertOneOf(String(formData.get("type") ?? ""), ASSET_TYPES, "tipo");
  const owner = String(formData.get("owner") ?? "").trim();
  const criticality = assertOneOf(String(formData.get("criticality") ?? ""), CRITICALITY_LEVELS, "criticidad");
  const description = parseOptionalString(formData.get("description"));

  if (!name) throw new Error("El nombre del activo es obligatorio");
  if (!owner) throw new Error("El responsable del activo es obligatorio");

  return { name, type, owner, criticality, description };
}

export async function createAsset(formData: FormData) {
  const data = readAssetForm(formData);
  await prisma.asset.create({ data });
  revalidatePath("/activos");
  revalidatePath("/dashboard");
  redirect("/activos");
}

export async function updateAsset(id: string, formData: FormData) {
  const data = readAssetForm(formData);
  await prisma.asset.update({ where: { id }, data });
  revalidatePath("/activos");
  revalidatePath("/dashboard");
  redirect("/activos");
}

export async function deleteAsset(id: string, formData: FormData) {
  await prisma.asset.delete({ where: { id } });
  revalidatePath("/activos");
  revalidatePath("/dashboard");
  redirect("/activos");
}
