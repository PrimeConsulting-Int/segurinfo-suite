// Generación de códigos secuenciales autoincrementales tipo R-001, INC-001, IND-001
import { prisma } from "./prisma";

async function nextCode(
  prefix: string,
  findLatest: () => Promise<{ code: string } | null>
): Promise<string> {
  const latest = await findLatest();
  let next = 1;
  if (latest) {
    const match = latest.code.match(/(\d+)$/);
    if (match) next = parseInt(match[1], 10) + 1;
  }
  return `${prefix}-${String(next).padStart(3, "0")}`;
}

export async function nextRiskCode(): Promise<string> {
  return nextCode("R", () =>
    prisma.risk.findFirst({ orderBy: { createdAt: "desc" }, select: { code: true } })
  );
}

export async function nextIncidentCode(): Promise<string> {
  return nextCode("INC", () =>
    prisma.incident.findFirst({ orderBy: { createdAt: "desc" }, select: { code: true } })
  );
}

export async function nextIndicatorCode(): Promise<string> {
  return nextCode("IND", () =>
    prisma.indicator.findFirst({ orderBy: { createdAt: "desc" }, select: { code: true } })
  );
}
