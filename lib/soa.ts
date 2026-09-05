import { SOA_CERTIFIABLE_FAMILIES, SOA_PRACTICE_FAMILIES } from "./enums";

export type ControlForSoa = {
  family: string;
  aplicable: boolean;
  estado: string;
  isPractice: boolean;
};

export function computeSoaCompliance(controls: ControlForSoa[]) {
  const certifiable = controls.filter((c) => SOA_CERTIFIABLE_FAMILIES.includes(c.family as any) && !c.isPractice);
  const applicable = certifiable.filter((c) => c.aplicable);
  const implemented = applicable.filter((c) => c.estado === "Implementado");

  const percentage = applicable.length > 0 ? Math.round((implemented.length / applicable.length) * 1000) / 10 : 0;

  const practices = controls.filter((c) => SOA_PRACTICE_FAMILIES.includes(c.family as any) || c.isPractice);
  const practicesApplicable = practices.filter((c) => c.aplicable);
  const practicesImplemented = practicesApplicable.filter((c) => c.estado === "Implementado");
  const practicesPercentage =
    practicesApplicable.length > 0 ? Math.round((practicesImplemented.length / practicesApplicable.length) * 1000) / 10 : 0;

  return {
    totalCertifiable: certifiable.length,
    applicableCertifiable: applicable.length,
    implementedCertifiable: implemented.length,
    percentage,
    totalPractices: practices.length,
    applicablePractices: practicesApplicable.length,
    implementedPractices: practicesImplemented.length,
    practicesPercentage,
  };
}
