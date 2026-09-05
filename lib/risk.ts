import { riskLevelFromScore, CRITICALITY_WEIGHT_FACTORS, Criticality, RiskLevelLabel } from "./enums";

export function currentRiskLevel(risk: { nivelResidual: number | null; nivelInherente: number }) {
  const score = risk.nivelResidual ?? risk.nivelInherente;
  return { score, label: riskLevelFromScore(score) };
}

// Par (probabilidad, impacto) "vigente" de un riesgo: el residual si AMBOS
// valores residuales están definidos (igual criterio que se usa para
// calcular nivelResidual), o si no, el inherente. Se usa para ubicar el
// riesgo en la matriz probabilidad × impacto.
export function currentProbImpacto(risk: {
  probabilidad: number;
  impacto: number;
  probabilidadResidual: number | null;
  impactoResidual: number | null;
}) {
  if (risk.probabilidadResidual !== null && risk.impactoResidual !== null) {
    return { probabilidad: risk.probabilidadResidual, impacto: risk.impactoResidual };
  }
  return { probabilidad: risk.probabilidad, impacto: risk.impacto };
}

// Nivel de riesgo ponderado por la criticidad del activo relacionado, según
// la metodología de riesgos: nivel ponderado = (probabilidad × impacto
// vigente) × factor de criticidad del activo. Un riesgo sin activo asociado
// se pondera con factor neutro (1.0).
export function weightedRiskLevel(
  risk: { nivelResidual: number | null; nivelInherente: number },
  assetCriticality: Criticality | string | null | undefined
): { score: number; weightedScore: number; factor: number; label: RiskLevelLabel | null } {
  const { score } = currentRiskLevel(risk);
  const factor =
    assetCriticality && assetCriticality in CRITICALITY_WEIGHT_FACTORS
      ? CRITICALITY_WEIGHT_FACTORS[assetCriticality as Criticality]
      : 1;
  const weightedScore = Math.round(score * factor * 10) / 10;
  return { score, weightedScore, factor, label: riskLevelFromScore(weightedScore) };
}
