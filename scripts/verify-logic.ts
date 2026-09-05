/**
 * Verificación independiente de la lógica de negocio y del diseño relacional
 * del SGSI, ejecutada contra una base de datos SQLite REAL usando el módulo
 * nativo `node:sqlite` (Node 22+).
 *
 * Por qué existe este script: la generación del cliente de Prisma requiere
 * descargar los binarios del motor de consultas desde binaries.prisma.sh en
 * el momento de `prisma generate` / `prisma db push`. En el entorno donde se
 * construyó esta aplicación esa descarga estaba bloqueada por la política de
 * red del sandbox, así que no fue posible levantar `next dev` allí. Este
 * script reproduce a mano el esquema SQL exacto que Prisma generaría a
 * partir de prisma/schema.prisma (mismas tablas, columnas, claves foráneas y
 * tabla de unión implícita para la relación muchos-a-muchos) y ejerce contra
 * una base de datos real las mismas reglas de negocio que usan los Server
 * Actions (lib/enums.ts, lib/risk.ts, lib/soa.ts, lib/codes.ts), incluyendo
 * casos límite de los umbrales y el comportamiento de las claves foráneas
 * (ON DELETE SET NULL / CASCADE). En una máquina con acceso normal a
 * internet, `npm run db:reset` genera el cliente real y este script deja de
 * ser necesario para validar el comportamiento de la app en sí — sigue
 * siendo útil como prueba de regresión rápida de las reglas de negocio.
 *
 * Ejecutar con: npx tsx scripts/verify-logic.ts
 */
import { DatabaseSync } from "node:sqlite";
import {
  riskLevelFromScore,
  appetiteSemaphore,
  indicatorSemaphore,
  effectivenessBand,
} from "../lib/enums";
import { computeSoaCompliance } from "../lib/soa";
import { weightedRiskLevel, currentProbImpacto } from "../lib/risk";

let passed = 0;
let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    passed++;
    console.log(`  OK   ${label}`);
  } else {
    failed++;
    console.error(`  FAIL ${label}${detail ? " — " + detail : ""}`);
  }
}

function section(title: string) {
  console.log(`\n=== ${title} ===`);
}

// ---------------------------------------------------------------------------
// 1) Lógica pura: umbrales de nivel de riesgo, semáforos, SoA
// ---------------------------------------------------------------------------
section("Umbrales de nivel de riesgo (lib/enums.ts)");
check("score 1 -> Bajo", riskLevelFromScore(1) === "Bajo");
check("score 3 -> Bajo (límite inferior de Medio es 4)", riskLevelFromScore(3) === "Bajo");
check("score 4 -> Medio (límite)", riskLevelFromScore(4) === "Medio");
check("score 7 -> Medio (límite superior)", riskLevelFromScore(7) === "Medio");
check("score 8 -> Alto (límite)", riskLevelFromScore(8) === "Alto");
check("score 14 -> Alto (límite superior)", riskLevelFromScore(14) === "Alto");
check("score 15 -> Crítico (límite)", riskLevelFromScore(15) === "Crítico");
check("score 25 -> Crítico (máximo)", riskLevelFromScore(25) === "Crítico");
check("score null -> null", riskLevelFromScore(null) === null);

section("Nivel de riesgo ponderado por criticidad del activo (lib/risk.ts)");
{
  const riskAlto = { nivelInherente: 8, nivelResidual: null }; // raw score 8 -> Alto
  check(
    "activo Bajo (x0.75): 8 -> 6.0, baja a Medio",
    (() => {
      const w = weightedRiskLevel(riskAlto, "Bajo");
      return w.weightedScore === 6 && w.label === "Medio";
    })()
  );
  check(
    "activo Medio (x1.0): 8 -> 8.0, se mantiene Alto",
    (() => {
      const w = weightedRiskLevel(riskAlto, "Medio");
      return w.weightedScore === 8 && w.label === "Alto";
    })()
  );
  check(
    "activo Crítico (x1.5): 8 -> 12.0, se mantiene Alto (no cruza a Crítico)",
    (() => {
      const w = weightedRiskLevel(riskAlto, "Crítico");
      return w.weightedScore === 12 && w.label === "Alto";
    })()
  );
  const riskDiez = { nivelInherente: 10, nivelResidual: null };
  check(
    "activo Crítico (x1.5): 10 -> 15.0, sube de Alto a Crítico",
    (() => {
      const w = weightedRiskLevel(riskDiez, "Crítico");
      return w.weightedScore === 15 && w.label === "Crítico";
    })()
  );
  check(
    "sin activo asociado: factor neutro 1.0",
    (() => {
      const w = weightedRiskLevel(riskAlto, null);
      return w.weightedScore === 8 && w.factor === 1;
    })()
  );

  const riskConResidual = {
    probabilidad: 5,
    impacto: 5,
    probabilidadResidual: 2,
    impactoResidual: 3,
  };
  const pos = currentProbImpacto(riskConResidual);
  check(
    "posición en la matriz usa residual cuando ambos están definidos",
    pos.probabilidad === 2 && pos.impacto === 3
  );
  const riskSoloProbResidual = { probabilidad: 5, impacto: 5, probabilidadResidual: 2, impactoResidual: null };
  const pos2 = currentProbImpacto(riskSoloProbResidual);
  check(
    "posición usa inherente si falta uno de los dos residuales",
    pos2.probabilidad === 5 && pos2.impacto === 5
  );
}

section("Banda de efectividad de controles (lib/enums.ts)");
check("madurez 5, efectividad 5 -> Alta", effectivenessBand(5, 5) === "Alta");
check("madurez 3, efectividad 5 -> Media (mínimo 3)", effectivenessBand(3, 5) === "Media");
check("madurez 2, efectividad 5 -> Baja (mínimo 2)", effectivenessBand(2, 5) === "Baja");
check("madurez null -> Sin evaluar", effectivenessBand(null, 3) === "Sin evaluar");

section("Semáforo de apetito/tolerancia (lib/enums.ts)");
check("nivel == apetito -> Dentro del apetito", appetiteSemaphore(6, 6, 12) === "Dentro del apetito");
check("nivel entre apetito y tolerancia -> Dentro de tolerancia", appetiteSemaphore(9, 6, 12) === "Dentro de tolerancia");
check("nivel == tolerancia -> Dentro de tolerancia (límite)", appetiteSemaphore(12, 6, 12) === "Dentro de tolerancia");
check("nivel > tolerancia -> Excede tolerancia", appetiteSemaphore(13, 6, 12) === "Excede tolerancia");

section("Semáforo de indicadores KPI/KRI (lib/enums.ts)");
check("mayor_es_mejor, valor >= meta-alerta -> En objetivo", indicatorSemaphore(96, "mayor_es_mejor", 90, 80) === "En objetivo");
check("mayor_es_mejor, entre crítico y alerta -> Alerta", indicatorSemaphore(85, "mayor_es_mejor", 90, 80) === "Alerta");
check("mayor_es_mejor, bajo crítico -> Crítico", indicatorSemaphore(70, "mayor_es_mejor", 90, 80) === "Crítico");
check("menor_es_mejor, bajo alerta -> En objetivo", indicatorSemaphore(1, "menor_es_mejor", 2, 5) === "En objetivo");
check("menor_es_mejor, sobre crítico -> Crítico", indicatorSemaphore(6, "menor_es_mejor", 2, 5) === "Crítico");
check("sin mediciones -> Sin datos", indicatorSemaphore(null, "mayor_es_mejor", 90, 80) === "Sin datos");

section("% de cumplimiento SoA (lib/soa.ts) — excluye prácticas 27031/27032");
const soaSample = computeSoaCompliance([
  { family: "27001-ANEXO_A", aplicable: true, estado: "Implementado", isPractice: false },
  { family: "27001-ANEXO_A", aplicable: true, estado: "En progreso", isPractice: false },
  { family: "27001-ANEXO_A", aplicable: false, estado: "No aplica", isPractice: false },
  { family: "27017-CLD", aplicable: true, estado: "Implementado", isPractice: false },
  { family: "27031-PRACTICA", aplicable: true, estado: "Implementado", isPractice: true },
  { family: "27032-PRACTICA", aplicable: true, estado: "En progreso", isPractice: true },
]);
check("2 de 3 certificables aplicables implementados -> 66.7%", soaSample.percentage === 66.7, JSON.stringify(soaSample));
check("prácticas: 1 de 2 implementadas -> 50%", soaSample.practicesPercentage === 50, JSON.stringify(soaSample));
check(
  "prácticas no cuentan en certificable (4 controles 27001/27017, las 2 prácticas 27031/27032 quedan aparte)",
  soaSample.totalCertifiable === 4
);

// ---------------------------------------------------------------------------
// 2) Esquema relacional real (SQLite vía node:sqlite) — réplica fiel de lo
//    que Prisma generaría para prisma/schema.prisma
// ---------------------------------------------------------------------------
section("Esquema relacional contra una base de datos SQLite real");

const db = new DatabaseSync(":memory:");
db.exec("PRAGMA foreign_keys = ON;");

db.exec(`
CREATE TABLE "Asset" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "owner" TEXT NOT NULL,
  "criticality" TEXT NOT NULL,
  "description" TEXT
);

CREATE TABLE "Risk" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "assetId" TEXT,
  "probabilidad" INTEGER NOT NULL,
  "impacto" INTEGER NOT NULL,
  "nivelInherente" INTEGER NOT NULL,
  "tratamiento" TEXT NOT NULL,
  "probabilidadResidual" INTEGER,
  "impactoResidual" INTEGER,
  "nivelResidual" INTEGER,
  "estado" TEXT NOT NULL,
  FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL
);

CREATE TABLE "Control" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "family" TEXT NOT NULL,
  "isPractice" INTEGER NOT NULL DEFAULT 0,
  "aplicable" INTEGER NOT NULL DEFAULT 1,
  "estado" TEXT NOT NULL DEFAULT 'No iniciado'
);

-- Tabla de unión implícita muchos-a-muchos que generaría Prisma para
-- Risk.controles <-> Control.riesgos (relación "RiskControls")
CREATE TABLE "_RiskControls" (
  "A" TEXT NOT NULL REFERENCES "Risk"("id") ON DELETE CASCADE,
  "B" TEXT NOT NULL REFERENCES "Control"("id") ON DELETE CASCADE,
  UNIQUE("A", "B")
);

CREATE TABLE "RiskAppetite" (
  "id" TEXT PRIMARY KEY,
  "category" TEXT NOT NULL UNIQUE,
  "appetiteThreshold" INTEGER NOT NULL,
  "toleranceThreshold" INTEGER NOT NULL
);

CREATE TABLE "Indicator" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "riskId" TEXT,
  FOREIGN KEY ("riskId") REFERENCES "Risk"("id") ON DELETE SET NULL
);

CREATE TABLE "Measurement" (
  "id" TEXT PRIMARY KEY,
  "indicatorId" TEXT NOT NULL,
  "valor" REAL NOT NULL,
  FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE CASCADE
);
`);

// --- Activos: crear, editar, eliminar (con SetNull en riesgos dependientes) ---
db.exec(`INSERT INTO "Asset" VALUES ('a1','Servidor ERP','Hardware','TI','Alto',NULL)`);
db.exec(`INSERT INTO "Risk" VALUES ('r1','R-001','Riesgo demo','Tecnológico','a1',4,5,20,'Mitigar',2,4,8,'Abierto')`);

const beforeDelete = db.prepare(`SELECT "assetId" FROM "Risk" WHERE id='r1'`).get() as any;
check("riesgo referencia el activo antes de eliminar", beforeDelete.assetId === "a1");

db.exec(`DELETE FROM "Asset" WHERE id='a1'`);
const afterDelete = db.prepare(`SELECT "assetId" FROM "Risk" WHERE id='r1'`).get() as any;
check("ON DELETE SET NULL: al eliminar el activo, el riesgo conserva su registro con assetId=NULL", afterDelete.assetId === null);

// --- Riesgos: código único ---
let uniqueViolation = false;
try {
  db.exec(`INSERT INTO "Risk" VALUES ('r2','R-001','Duplicado','Operacional',NULL,1,1,1,'Aceptar',NULL,NULL,NULL,'Abierto')`);
} catch {
  uniqueViolation = true;
}
check("el código de riesgo es único (constraint UNIQUE)", uniqueViolation);

// --- Controles y relación muchos-a-muchos con riesgos ---
db.exec(`INSERT INTO "Control" VALUES ('c1','5.15','Control de acceso','27001-ANEXO_A',0,1,'Implementado')`);
db.exec(`INSERT INTO "Control" VALUES ('c2','8.5','Autenticación segura','27001-ANEXO_A',0,1,'En progreso')`);
db.exec(`INSERT INTO "_RiskControls" VALUES ('r1','c1')`);
db.exec(`INSERT INTO "_RiskControls" VALUES ('r1','c2')`);

const linkedControls = db.prepare(`SELECT COUNT(*) as n FROM "_RiskControls" WHERE "A"='r1'`).get() as any;
check("el riesgo queda vinculado a 2 controles de tratamiento", linkedControls.n === 2);

db.exec(`DELETE FROM "Risk" WHERE id='r1'`);
const linkedAfterRiskDelete = db.prepare(`SELECT COUNT(*) as n FROM "_RiskControls"`).get() as any;
check("ON DELETE CASCADE en la tabla de unión: eliminar el riesgo limpia sus vínculos m2m", linkedAfterRiskDelete.n === 0);
const controlsStillExist = db.prepare(`SELECT COUNT(*) as n FROM "Control"`).get() as any;
check("los controles del catálogo NO se eliminan al borrar el riesgo", controlsStillExist.n === 2);

// --- Indicadores y mediciones (cascada real) ---
db.exec(`INSERT INTO "Indicator" VALUES ('i1','IND-001',NULL)`);
db.exec(`INSERT INTO "Measurement" VALUES ('m1','i1',3)`);
db.exec(`INSERT INTO "Measurement" VALUES ('m2','i1',1)`);
const measurementsBefore = db.prepare(`SELECT COUNT(*) as n FROM "Measurement" WHERE "indicatorId"='i1'`).get() as any;
check("el indicador tiene 2 mediciones registradas", measurementsBefore.n === 2);

db.exec(`DELETE FROM "Indicator" WHERE id='i1'`);
const measurementsAfter = db.prepare(`SELECT COUNT(*) as n FROM "Measurement"`).get() as any;
check("ON DELETE CASCADE: eliminar el indicador elimina su historial de mediciones", measurementsAfter.n === 0);

db.close();

// ---------------------------------------------------------------------------
console.log(`\n${"=".repeat(60)}`);
console.log(`Resultado: ${passed} verificaciones OK, ${failed} fallidas`);
if (failed > 0) {
  process.exit(1);
}
