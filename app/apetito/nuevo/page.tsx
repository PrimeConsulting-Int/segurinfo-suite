import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AppetiteForm from "../AppetiteForm";
import { createAppetite } from "../actions";
import { RISK_CATEGORIES } from "@/lib/enums";

export const dynamic = "force-dynamic";

export default async function NuevaAppetitePage() {
  const existing = await prisma.riskAppetite.findMany({ select: { category: true } });
  const used = new Set(existing.map((e: any) => e.category));
  const available = RISK_CATEGORIES.filter((c) => !used.has(c));

  if (available.length === 0) {
    redirect("/apetito");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-bold">Nueva declaración de apetito</h1>
      <AppetiteForm action={createAppetite} categoryOptions={available} submitLabel="Crear declaración" />
    </div>
  );
}
