// lib/enums.ts
// SQLite (via Prisma) no soporta enums nativos: todo campo categórico se
// almacena como String. Este módulo centraliza los valores válidos, sus
// etiquetas de UI y funciones de validación, para no duplicar "magic
// strings" por toda la aplicación.

// ---------- Activos ----------
export const CRITICALITY_LEVELS = ["Bajo", "Medio", "Alto", "Crítico"] as const;
export type Criticality = (typeof CRITICALITY_LEVELS)[number];

// Factor de ponderación aplicado al nivel de riesgo (probabilidad × impacto)
// según la criticidad del activo relacionado. Un riesgo sobre un activo
// Crítico pesa más que el mismo riesgo sobre un activo Bajo, aunque su
// probabilidad e impacto brutos sean idénticos.
export const CRITICALITY_WEIGHT_FACTORS: Record<Criticality, number> = {
  Bajo: 0.75,
  Medio: 1.0,
  Alto: 1.25,
  Crítico: 1.5,
};

export const ASSET_TYPES = [
  "Información",
  "Software",
  "Hardware",
  "Servicio",
  "Personas",
  "Instalaciones",
  "Proveedor/Tercero",
] as const;

// ---------- Riesgos (ISO 27005) ----------
export const RISK_CATEGORIES = [
  "Tecnológico",
  "Operacional",
  "Cumplimiento",
  "Privacidad",
  "Continuidad",
  "Ciberseguridad",
  "Reputacional",
  "Financiero",
] as const;
export type RiskCategory = (typeof RISK_CATEGORIES)[number];

export const RISK_TREATMENTS = ["Mitigar", "Aceptar", "Transferir", "Evitar"] as const;

export const RISK_STATES = ["Abierto", "En tratamiento", "Monitoreo", "Cerrado"] as const;

export const SCALE_1_5 = [1, 2, 3, 4, 5] as const;

// Umbrales de nivel de riesgo (probabilidad x impacto, rango 1-25)
export const RISK_LEVEL_THRESHOLDS = {
  Bajo: { min: 1, max: 3 },
  Medio: { min: 4, max: 7 },
  Alto: { min: 8, max: 14 },
  Crítico: { min: 15, max: 25 },
} as const;

export type RiskLevelLabel = "Bajo" | "Medio" | "Alto" | "Crítico";

export function riskLevelFromScore(score: number | null | undefined): RiskLevelLabel | null {
  if (score === null || score === undefined || Number.isNaN(score)) return null;
  if (score < 4) return "Bajo";
  if (score <= 7) return "Medio";
  if (score <= 14) return "Alto";
  return "Crítico";
}

export const RISK_LEVEL_COLORS: Record<RiskLevelLabel, string> = {
  Bajo: "bg-emerald-100 text-emerald-800 border-emerald-300",
  Medio: "bg-amber-100 text-amber-800 border-amber-300",
  Alto: "bg-orange-100 text-orange-800 border-orange-300",
  Crítico: "bg-red-100 text-red-800 border-red-300",
};

// ---------- Apetito y tolerancia ----------
export type AppetiteSemaphore = "Dentro del apetito" | "Dentro de tolerancia" | "Excede tolerancia";

export function appetiteSemaphore(
  level: number,
  appetiteThreshold: number,
  toleranceThreshold: number
): AppetiteSemaphore {
  if (level <= appetiteThreshold) return "Dentro del apetito";
  if (level <= toleranceThreshold) return "Dentro de tolerancia";
  return "Excede tolerancia";
}

export const APPETITE_SEMAPHORE_COLORS: Record<AppetiteSemaphore, string> = {
  "Dentro del apetito": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "Dentro de tolerancia": "bg-amber-100 text-amber-800 border-amber-300",
  "Excede tolerancia": "bg-red-100 text-red-800 border-red-300",
};

// ---------- Controles / SoA ----------
export const CONTROL_FAMILIES = [
  "27001-ANEXO_A",
  "27017-CLD",
  "27018-ANEXO_A",
  "27701-ANEXO_A",
  "27701-ANEXO_B",
  "27031-PRACTICA",
  "27032-PRACTICA",
] as const;
export type ControlFamily = (typeof CONTROL_FAMILIES)[number];

export const CONTROL_FAMILY_LABELS: Record<ControlFamily, string> = {
  "27001-ANEXO_A": "ISO/IEC 27001/27002 — Anexo A (93 controles)",
  "27017-CLD": "ISO/IEC 27017 — Controles extendidos de nube (CLD.x)",
  "27018-ANEXO_A": "ISO/IEC 27018 — Anexo A (PII en nube pública)",
  "27701-ANEXO_A": "ISO/IEC 27701 — Anexo A (Responsable del tratamiento)",
  "27701-ANEXO_B": "ISO/IEC 27701 — Anexo B (Encargado del tratamiento)",
  "27031-PRACTICA": "ISO/IEC 27031 — Prácticas de continuidad TIC (guía, no Anexo A)",
  "27032-PRACTICA": "ISO/IEC 27032 — Prácticas de ciberseguridad (guía, no Anexo A)",
};

// Familias que SÍ cuentan para el % de cumplimiento SoA certificable
export const SOA_CERTIFIABLE_FAMILIES: ControlFamily[] = [
  "27001-ANEXO_A",
  "27017-CLD",
  "27018-ANEXO_A",
  "27701-ANEXO_A",
  "27701-ANEXO_B",
];

// Familias de "práctica" (lineamiento, no auditable como Anexo A)
export const SOA_PRACTICE_FAMILIES: ControlFamily[] = ["27031-PRACTICA", "27032-PRACTICA"];

export const ANEXO_A_CATEGORIES = ["Organizacional", "Personas", "Físico", "Tecnológico"] as const;

export const CONTROL_STATES = ["No iniciado", "En progreso", "Implementado", "No aplica"] as const;

export const MATURITY_LEVELS = [1, 2, 3, 4, 5] as const;

// Evaluación de efectividad operativa del control (1-5): distinta de la
// madurez (qué tan implementado está) — mide si el control realmente está
// funcionando/mitigando el riesgo en la práctica.
export const EFFECTIVENESS_LEVELS = [1, 2, 3, 4, 5] as const;

export type EffectivenessBand = "Alta" | "Media" | "Baja" | "Sin evaluar";

export const EFFECTIVENESS_BAND_COLORS: Record<EffectivenessBand, string> = {
  Alta: "bg-emerald-100 text-emerald-800 border-emerald-300",
  Media: "bg-amber-100 text-amber-800 border-amber-300",
  Baja: "bg-red-100 text-red-800 border-red-300",
  "Sin evaluar": "bg-gray-100 text-gray-500 border-gray-300",
};

// Banda combinada madurez x efectividad para colorear el mapa de controles:
// el control vale lo que valga su dimensión más débil (mínimo de las dos).
export function effectivenessBand(madurez: number | null, efectividad: number | null): EffectivenessBand {
  if (madurez === null || efectividad === null) return "Sin evaluar";
  const min = Math.min(madurez, efectividad);
  if (min >= 4) return "Alta";
  if (min >= 3) return "Media";
  return "Baja";
}

// Los 11 principios de privacidad de ISO/IEC 29100, usados para organizar
// los controles de Anexo A de 27018
export const PRIVACY_PRINCIPLES_29100 = [
  "Consentimiento y elección",
  "Legitimidad y especificación del propósito",
  "Limitación de la recolección",
  "Minimización de datos",
  "Limitación del uso, retención y divulgación",
  "Exactitud y calidad",
  "Apertura, transparencia y aviso",
  "Participación y acceso del titular",
  "Responsabilidad (accountability)",
  "Seguridad de la información",
  "Cumplimiento de la privacidad",
] as const;

// Fases del ciclo PDCA de continuidad TIC (ISO/IEC 27031), usadas para
// agrupar las prácticas de esa norma
export const CONTINUITY_27031_PHASES = [
  "Comprensión de la organización (BIA)",
  "Estrategias de continuidad",
  "Desarrollo e implementación de la respuesta",
  "Ejercicios, mantenimiento y revisión",
  "Cultura de continuidad",
] as const;

// Tipos de práctica de ciberseguridad (ISO/IEC 27032)
export const CYBERSECURITY_27032_PRACTICES = [
  "Controles a nivel de aplicación",
  "Protección de servidores",
  "Controles de usuario final",
  "Controles contra ingeniería social",
  "Preparación ante ciberataques",
  "Intercambio de información y coordinación",
] as const;

// ---------- Indicadores KPI/KRI ----------
export const INDICATOR_TYPES = ["KPI", "KRI"] as const;
export const INDICATOR_DIRECTIONS = ["mayor_es_mejor", "menor_es_mejor"] as const;
export const INDICATOR_DIRECTION_LABELS: Record<string, string> = {
  mayor_es_mejor: "Mayor es mejor",
  menor_es_mejor: "Menor es mejor",
};
export const INDICATOR_FREQUENCIES = ["Diaria", "Semanal", "Mensual", "Trimestral", "Anual"] as const;

export type IndicatorSemaphore = "En objetivo" | "Alerta" | "Crítico" | "Sin datos";

export const INDICATOR_SEMAPHORE_COLORS: Record<IndicatorSemaphore, string> = {
  "En objetivo": "bg-emerald-100 text-emerald-800 border-emerald-300",
  Alerta: "bg-amber-100 text-amber-800 border-amber-300",
  Crítico: "bg-red-100 text-red-800 border-red-300",
  "Sin datos": "bg-gray-100 text-gray-600 border-gray-300",
};

export function indicatorSemaphore(
  lastValue: number | null | undefined,
  direction: string,
  umbralAlerta: number,
  umbralCritico: number
): IndicatorSemaphore {
  if (lastValue === null || lastValue === undefined) return "Sin datos";
  if (direction === "mayor_es_mejor") {
    if (lastValue < umbralCritico) return "Crítico";
    if (lastValue < umbralAlerta) return "Alerta";
    return "En objetivo";
  }
  // menor_es_mejor
  if (lastValue > umbralCritico) return "Crítico";
  if (lastValue > umbralAlerta) return "Alerta";
  return "En objetivo";
}

// ---------- Incidentes (ISO 27035 / enfoque 27032) ----------
export const INCIDENT_CATEGORIES = [
  "Malware",
  "Phishing",
  "Fuga de datos",
  "Denegación de servicio",
  "Acceso no autorizado",
  "Físico",
  "Otro",
] as const;

export const INCIDENT_SEVERITIES = ["Baja", "Media", "Alta", "Crítica"] as const;

export const INCIDENT_STATES = [
  "Abierto",
  "En investigación",
  "Contenido",
  "Resuelto",
  "Cerrado",
] as const;

export const INCIDENT_SEVERITY_COLORS: Record<string, string> = {
  Baja: "bg-emerald-100 text-emerald-800 border-emerald-300",
  Media: "bg-amber-100 text-amber-800 border-amber-300",
  Alta: "bg-orange-100 text-orange-800 border-orange-300",
  Crítica: "bg-red-100 text-red-800 border-red-300",
};

// ---------- Continuidad (ISO 27031) ----------
export const CONTINUITY_PLAN_STATES = ["Borrador", "Aprobado", "Probado", "Desactualizado"] as const;

// ---------- Marco normativo (para el grid del dashboard) ----------
export interface NormaRef {
  code: string;
  name: string;
  nature: "Requisitos del SGSI" | "Catálogo de controles" | "Gestión de riesgo" | "Lineamiento / guía" | "Gestión de incidentes";
  description: string;
  href: string;
}

export const NORMAS: NormaRef[] = [
  {
    code: "ISO/IEC 27001:2022",
    name: "Requisitos del SGSI",
    nature: "Requisitos del SGSI",
    description: "Marco de gestión del SGSI; sus controles se auditan vía el Anexo A (27002).",
    href: "/controles?familia=27001-ANEXO_A",
  },
  {
    code: "ISO/IEC 27002:2022",
    name: "Anexo A — 93 controles",
    nature: "Catálogo de controles",
    description: "37 organizacionales, 8 de personas, 14 físicos, 34 tecnológicos.",
    href: "/controles?familia=27001-ANEXO_A",
  },
  {
    code: "ISO/IEC 27005",
    name: "Gestión de riesgo",
    nature: "Gestión de riesgo",
    description: "Metodología de identificación, análisis y tratamiento de riesgos.",
    href: "/riesgos",
  },
  {
    code: "ISO/IEC 27017",
    name: "Controles de nube (CLD.x)",
    nature: "Catálogo de controles",
    description: "7 controles extendidos de nube + marcado de controles base aplicables.",
    href: "/controles?familia=27017-CLD",
  },
  {
    code: "ISO/IEC 27018",
    name: "PII en nube pública",
    nature: "Catálogo de controles",
    description: "Controles organizados por los 11 principios de privacidad de ISO/IEC 29100.",
    href: "/controles?familia=27018-ANEXO_A",
  },
  {
    code: "ISO/IEC 27701",
    name: "PIMS — Anexo A/B",
    nature: "Catálogo de controles",
    description: "Anexo A (responsable, 7.2-7.5) y Anexo B (encargado, 8.2-8.5).",
    href: "/controles?familia=27701-ANEXO_A",
  },
  {
    code: "ISO/IEC 27031",
    name: "Continuidad TIC",
    nature: "Lineamiento / guía",
    description: "Guía de preparación TIC para continuidad del negocio (prácticas, no Anexo A).",
    href: "/continuidad",
  },
  {
    code: "ISO/IEC 27032",
    name: "Ciberseguridad",
    nature: "Lineamiento / guía",
    description: "Prácticas de ciberseguridad: aplicación, servidores, usuario final, ingeniería social.",
    href: "/controles?familia=27032-PRACTICA",
  },
  {
    code: "ISO/IEC 27035",
    name: "Gestión de incidentes",
    nature: "Gestión de incidentes",
    description: "Gestión de incidentes de seguridad de la información.",
    href: "/incidentes",
  },
];

// ---------- Utilidades genéricas de validación ----------
export function assertOneOf<T extends readonly string[]>(
  value: string,
  allowed: T,
  fieldName: string
): T[number] {
  if (!allowed.includes(value as T[number])) {
    throw new Error(`Valor inválido para ${fieldName}: "${value}". Debe ser uno de: ${allowed.join(", ")}`);
  }
  return value as T[number];
}

export function assertIntInRange(value: number, min: number, max: number, fieldName: string): number {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${fieldName} debe ser un entero entre ${min} y ${max}`);
  }
  return value;
}

export function parseOptionalString(v: FormDataEntryValue | null): string | null {
  if (v === null) return null;
  const s = String(v).trim();
  return s.length === 0 ? null : s;
}

export function parseOptionalInt(v: FormDataEntryValue | null): number | null {
  const s = parseOptionalString(v);
  if (s === null) return null;
  const n = Number(s);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

export function parseOptionalFloat(v: FormDataEntryValue | null): number | null {
  const s = parseOptionalString(v);
  if (s === null) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export function parseOptionalDate(v: FormDataEntryValue | null): Date | null {
  const s = parseOptionalString(v);
  if (s === null) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

// Los campos de fecha (sin hora) llegan de <input type="date"> como "AAAA-MM-DD",
// que JS interpreta como medianoche UTC (parseOptionalDate). Si se formatean con
// toLocaleDateString() sin fijar el huso horario, el resultado usa la zona horaria
// LOCAL del proceso de Node: si el servidor corre en un huso detrás de UTC, la fecha
// se muestra un día antes del valor ingresado. Esta función fuerza timeZone: "UTC"
// para que la fecha mostrada sea siempre la misma que se guardó, sin importar en
// qué huso horario corra el servidor.
export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-CO", { timeZone: "UTC" });
}

// Checkbox helper: la ausencia del campo en FormData se trata como false
// directamente (evita el truco frágil de un input hidden duplicado, que
// antepone "false" siempre y rompe la lectura real del checkbox).
export function parseCheckbox(v: FormDataEntryValue | null): boolean {
  return v === "on" || v === "true" || v === "1";
}
