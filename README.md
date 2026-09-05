# SGSI — Sistema de Gestión de Seguridad de la Información

Herramienta web funcional para identificar, evaluar, tratar y monitorear
riesgos de seguridad de la información, ciberseguridad y privacidad, alineada
con ISO/IEC 27001:2022, 27002:2022, 27005, 27017, 27018, 27701, 27031, 27032
y 27035.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Prisma ORM 5.x (clásico, sin driver adapters) + SQLite (`prisma/dev.db`)
- Todo el CRUD vía Server Actions de Next.js (sin API routes, sin fetch del
  lado del cliente)

## Puesta en marcha

```bash
npm install          # instala dependencias y genera el cliente de Prisma
npx prisma db push   # crea prisma/dev.db con el esquema
npm run seed         # siembra el catálogo de controles (93 + CLD + 27018 + 27701 + prácticas) y datos de ejemplo
npm run dev          # http://localhost:3000
```

O en un solo paso: `npm run setup && npm run dev`.

Para reiniciar la base de datos desde cero: `npm run db:reset`.

## Módulos

1. **Activos** (`/activos`) — inventario base referenciado por riesgos e incidentes.
2. **Riesgos** (`/riesgos`, ISO/IEC 27005) — código autogenerado (R-001…), niveles
   inherente/residual calculados automáticamente (probabilidad × impacto,
   umbrales: <4 Bajo, 4-7 Medio, 8-14 Alto, ≥15 Crítico), controles de
   tratamiento asociados (relación muchos-a-muchos con el catálogo).
3. **Apetito y tolerancia** (`/apetito`) — una declaración por categoría de
   riesgo, comparada en vivo contra el nivel actual de los riesgos activos con
   semáforo (Dentro del apetito / Dentro de tolerancia / Excede tolerancia).
4. **Controles y SoA** (`/controles`) — catálogo de referencia sembrado (93
   controles del Anexo A de 27002, 7 CLD.x de 27017, Anexo A de 27018 por
   principio de privacidad ISO/IEC 29100, Anexo A/B de 27701, prácticas de
   27031/27032 explícitamente marcadas como "práctica, no Anexo A"). El texto
   base no es editable; sí lo es la implementación (aplicable, estado,
   madurez, responsable, justificación, evidencia, fecha de revisión) y las
   banderas de aplicabilidad a 27017/27018/27701. El % de cumplimiento SoA
   excluye las prácticas de guía.
5. **Indicadores KPI/KRI** (`/indicadores`) — historial de mediciones y
   semáforo automático (En objetivo / Alerta / Crítico / Sin datos) según
   dirección declarada (mayor-es-mejor / menor-es-mejor).
6. **Incidentes** (`/incidentes`, ISO/IEC 27035, enfoque 27032) — código
   autogenerado (INC-001…), activos afectados, riesgo relacionado opcional.
7. **Continuidad** (`/continuidad`, ISO/IEC 27031) — planes con RTO/RPO,
   estrategia, estado y fechas de prueba.
8. **Dashboard** (`/dashboard`) — vista integrada: % SoA, riesgos por nivel,
   riesgos que exceden tolerancia, indicadores por semáforo, incidentes
   abiertos/críticos, estado de continuidad y grilla de las 9 normas.

## Nota sobre el entorno donde se construyó esta aplicación

Este proyecto se construyó en un sandbox en la nube con una política de red
restringida. `npx prisma generate` / `npx prisma db push` necesitan descargar
los binarios del motor de Prisma desde `binaries.prisma.sh`, y ese dominio
estaba bloqueado en ese sandbox (no es un problema del código ni del
esquema). Por eso no fue posible levantar `next dev` allí para hacer clic a
través de la interfaz.

Para compensarlo, antes de entregar el proyecto se verificó:

- `npx tsc --noEmit` — compila sin errores.
- `npx next build` — compila y empaqueta correctamente (el único paso que no
  se pudo completar en el sandbox fue la inicialización del cliente de
  Prisma, por la misma razón de red).
- `npm run verify:logic` (`scripts/verify-logic.ts`) — ejercita, contra una
  base de datos SQLite real (vía el módulo nativo `node:sqlite`), la misma
  lógica de negocio que usan los Server Actions: los umbrales de nivel de
  riesgo, los semáforos de apetito/tolerancia e indicadores, el cálculo de %
  de cumplimiento SoA, y el comportamiento relacional del esquema (código
  único, `ON DELETE SET NULL` al borrar un activo referenciado, `ON DELETE
  CASCADE` en la tabla de unión muchos-a-muchos y en el historial de
  mediciones). Las 30 verificaciones pasan.

En una máquina con acceso normal a internet (la situación esperada para
cualquier desarrollador), `npm install` y `npx prisma db push` funcionan sin
pasos adicionales — es el flujo estándar de Prisma. Aun así, se recomienda
hacer una pasada de clic a través de cada módulo (crear/editar/eliminar) tras
la primera instalación, como control final antes de un uso productivo.

## Consideraciones técnicas ya resueltas en este código

- Todo campo categórico es `String` en SQLite (Prisma no soporta enums
  nativos ahí), validado en `lib/enums.ts`.
- El CRUD usa páginas dedicadas de creación/edición en vez de filas
  expandibles con `<details>`, precisamente para evitar el problema de que un
  `<details>` colapsado no recibe interacción hasta abrir su `<summary>`.
- Los checkboxes (aplicable, banderas de norma) se leen como `false` cuando
  el campo está ausente en el FormData — sin el truco frágil de un input
  oculto duplicado con el mismo `name`.
- Eliminar y editar en la misma fila son `<form>` hermanos dentro de un
  `<div>`, nunca anidados.
