/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ControlSeed = {
  code: string;
  title: string;
  family: string;
  anexoACategoria?: string;
  principio29100?: string;
  clausula?: string;
  proceso27031?: string;
  practica27032?: string;
  appliesTo27017?: boolean;
  appliesTo27018?: boolean;
  appliesTo27701?: boolean;
  isPractice?: boolean;
};

// ---------------------------------------------------------------------------
// 1) ISO/IEC 27002:2022 — Anexo A: 93 controles
//    37 organizacionales (5.x) + 8 de personas (6.x) + 14 físicos (7.x)
//    + 34 tecnológicos (8.x)
// ---------------------------------------------------------------------------
const ORGANIZATIONAL: [string, string][] = [
  ["5.1", "Políticas de seguridad de la información"],
  ["5.2", "Roles y responsabilidades de seguridad de la información"],
  ["5.3", "Segregación de funciones"],
  ["5.4", "Responsabilidades de la dirección"],
  ["5.5", "Contacto con autoridades"],
  ["5.6", "Contacto con grupos de interés especial"],
  ["5.7", "Inteligencia de amenazas"],
  ["5.8", "Seguridad de la información en la gestión de proyectos"],
  ["5.9", "Inventario de información y otros activos asociados"],
  ["5.10", "Uso aceptable de la información y otros activos asociados"],
  ["5.11", "Devolución de activos"],
  ["5.12", "Clasificación de la información"],
  ["5.13", "Etiquetado de la información"],
  ["5.14", "Transferencia de información"],
  ["5.15", "Control de acceso"],
  ["5.16", "Gestión de identidad"],
  ["5.17", "Información de autenticación"],
  ["5.18", "Derechos de acceso"],
  ["5.19", "Seguridad de la información en las relaciones con proveedores"],
  ["5.20", "Tratamiento de la seguridad de la información en acuerdos con proveedores"],
  ["5.21", "Gestión de la seguridad de la información en la cadena de suministro TIC"],
  ["5.22", "Monitoreo, revisión y gestión de cambios de servicios de proveedores"],
  ["5.23", "Seguridad de la información para el uso de servicios en la nube"],
  ["5.24", "Planificación y preparación de la gestión de incidentes de seguridad"],
  ["5.25", "Evaluación y decisión sobre eventos de seguridad de la información"],
  ["5.26", "Respuesta a incidentes de seguridad de la información"],
  ["5.27", "Aprendizaje de los incidentes de seguridad de la información"],
  ["5.28", "Recolección de evidencia"],
  ["5.29", "Seguridad de la información durante la interrupción"],
  ["5.30", "Preparación TIC para la continuidad del negocio"],
  ["5.31", "Requisitos legales, estatutarios, reglamentarios y contractuales"],
  ["5.32", "Derechos de propiedad intelectual"],
  ["5.33", "Protección de registros"],
  ["5.34", "Privacidad y protección de datos personales (PII)"],
  ["5.35", "Revisión independiente de la seguridad de la información"],
  ["5.36", "Cumplimiento de políticas, reglas y normas de seguridad de la información"],
  ["5.37", "Procedimientos operativos documentados"],
];

const PEOPLE: [string, string][] = [
  ["6.1", "Selección (screening)"],
  ["6.2", "Términos y condiciones del empleo"],
  ["6.3", "Concienciación, educación y capacitación en seguridad de la información"],
  ["6.4", "Proceso disciplinario"],
  ["6.5", "Responsabilidades tras la finalización o cambio de empleo"],
  ["6.6", "Acuerdos de confidencialidad o no divulgación"],
  ["6.7", "Trabajo remoto"],
  ["6.8", "Reporte de eventos de seguridad de la información"],
];

const PHYSICAL: [string, string][] = [
  ["7.1", "Perímetros de seguridad física"],
  ["7.2", "Entrada física"],
  ["7.3", "Seguridad de oficinas, despachos e instalaciones"],
  ["7.4", "Monitoreo de seguridad física"],
  ["7.5", "Protección contra amenazas físicas y ambientales"],
  ["7.6", "Trabajo en áreas seguras"],
  ["7.7", "Escritorio y pantalla limpios"],
  ["7.8", "Emplazamiento y protección de equipos"],
  ["7.9", "Seguridad de los activos fuera de las instalaciones"],
  ["7.10", "Medios de almacenamiento"],
  ["7.11", "Servicios de suministro"],
  ["7.12", "Seguridad del cableado"],
  ["7.13", "Mantenimiento de equipos"],
  ["7.14", "Disposición segura o reutilización de equipos"],
];

const TECHNOLOGICAL: [string, string][] = [
  ["8.1", "Dispositivos de punto final de usuario"],
  ["8.2", "Derechos de acceso privilegiado"],
  ["8.3", "Restricción de acceso a la información"],
  ["8.4", "Acceso al código fuente"],
  ["8.5", "Autenticación segura"],
  ["8.6", "Gestión de capacidad"],
  ["8.7", "Protección contra malware"],
  ["8.8", "Gestión de vulnerabilidades técnicas"],
  ["8.9", "Gestión de configuración"],
  ["8.10", "Eliminación de información"],
  ["8.11", "Enmascaramiento de datos"],
  ["8.12", "Prevención de fuga de datos"],
  ["8.13", "Copias de respaldo de la información"],
  ["8.14", "Redundancia de instalaciones de procesamiento de información"],
  ["8.15", "Registro de eventos (logging)"],
  ["8.16", "Actividades de monitoreo"],
  ["8.17", "Sincronización de relojes"],
  ["8.18", "Uso de programas utilitarios privilegiados"],
  ["8.19", "Instalación de software en sistemas operativos"],
  ["8.20", "Seguridad de redes"],
  ["8.21", "Seguridad de los servicios de red"],
  ["8.22", "Segregación de redes"],
  ["8.23", "Filtrado web"],
  ["8.24", "Uso de criptografía"],
  ["8.25", "Ciclo de vida de desarrollo seguro"],
  ["8.26", "Requisitos de seguridad de las aplicaciones"],
  ["8.27", "Arquitectura de sistemas segura y principios de ingeniería"],
  ["8.28", "Codificación segura"],
  ["8.29", "Pruebas de seguridad en desarrollo y aceptación"],
  ["8.30", "Desarrollo externalizado"],
  ["8.31", "Separación de entornos de desarrollo, prueba y producción"],
  ["8.32", "Gestión de cambios"],
  ["8.33", "Información de prueba"],
  ["8.34", "Protección de los sistemas de información durante las pruebas de auditoría"],
];

// Códigos que, como mapeo de partida razonable, se marcan aplicables a
// servicios en la nube (27017), a PII en nube pública (27018) y/o al PIMS
// (27701). Es un punto de partida ajustable desde la propia interfaz.
const CLOUD_RELEVANT = new Set([
  "5.9", "5.10", "5.14", "5.15", "5.16", "5.17", "5.18", "5.19", "5.20", "5.21",
  "5.22", "5.23", "8.1", "8.2", "8.3", "8.5", "8.9", "8.13", "8.14", "8.15",
  "8.16", "8.20", "8.21", "8.22", "8.24",
]);
const PRIVACY_CLOUD_RELEVANT = new Set([
  "5.9", "5.10", "5.12", "5.14", "5.15", "5.18", "5.19", "5.34", "8.3", "8.10",
  "8.11", "8.12", "8.24",
]);
const PIMS_RELEVANT = new Set([
  "5.10", "5.12", "5.14", "5.31", "5.33", "5.34", "5.36", "8.3", "8.10", "8.11",
  "8.12", "8.24",
]);

function annexA(list: [string, string][], categoria: string): ControlSeed[] {
  return list.map(([code, title]) => ({
    code,
    title,
    family: "27001-ANEXO_A",
    anexoACategoria: categoria,
    appliesTo27017: CLOUD_RELEVANT.has(code),
    appliesTo27018: PRIVACY_CLOUD_RELEVANT.has(code),
    appliesTo27701: PIMS_RELEVANT.has(code),
    isPractice: false,
  }));
}

// ---------------------------------------------------------------------------
// 2) ISO/IEC 27017 — 7 controles extendidos de nube (serie CLD.x)
// ---------------------------------------------------------------------------
const CLD_CONTROLS: ControlSeed[] = [
  {
    code: "CLD.6.3.1",
    title: "Roles y responsabilidades compartidos dentro de un entorno de computación en la nube",
    family: "27017-CLD",
  },
  {
    code: "CLD.8.1.5",
    title: "Eliminación/devolución de los activos del cliente del servicio en la nube",
    family: "27017-CLD",
  },
  {
    code: "CLD.9.5.1",
    title: "Segregación en entornos de computación virtual",
    family: "27017-CLD",
  },
  {
    code: "CLD.9.5.2",
    title: "Hardening de máquinas virtuales",
    family: "27017-CLD",
  },
  {
    code: "CLD.12.1.5",
    title: "Seguridad operacional del administrador del servicio en la nube",
    family: "27017-CLD",
  },
  {
    code: "CLD.12.4.5",
    title: "Monitoreo de los servicios en la nube",
    family: "27017-CLD",
  },
  {
    code: "CLD.13.1.4",
    title: "Alineación de la gestión de seguridad para redes virtuales y físicas",
    family: "27017-CLD",
  },
];

// ---------------------------------------------------------------------------
// 3) ISO/IEC 27018 — controles Anexo A de protección de PII en nube pública,
//    organizados por los 11 principios de privacidad de ISO/IEC 29100.
//    (Representación de trabajo orientada a la gestión del SGSI; validar
//    contra el texto oficial de la norma antes de una auditoría formal.)
// ---------------------------------------------------------------------------
const P29100 = {
  consentimiento: "Consentimiento y elección",
  legitimidad: "Legitimidad y especificación del propósito",
  limitacionRecoleccion: "Limitación de la recolección",
  minimizacion: "Minimización de datos",
  limitacionUso: "Limitación del uso, retención y divulgación",
  exactitud: "Exactitud y calidad",
  apertura: "Apertura, transparencia y aviso",
  participacion: "Participación y acceso del titular",
  responsabilidad: "Responsabilidad (accountability)",
  seguridad: "Seguridad de la información",
  cumplimiento: "Cumplimiento de la privacidad",
};

const CONTROLS_27018: ControlSeed[] = [
  { code: "27018-A.1.1", title: "Acuerdo sobre el uso de PII para fines de marketing y publicidad", family: "27018-ANEXO_A", principio29100: P29100.consentimiento },
  { code: "27018-A.1.2", title: "Cooperación con el cliente respecto de los derechos del titular de la PII", family: "27018-ANEXO_A", principio29100: P29100.consentimiento },
  { code: "27018-A.2.1", title: "Fines contractuales explícitos para el tratamiento de PII", family: "27018-ANEXO_A", principio29100: P29100.legitimidad },
  { code: "27018-A.2.2", title: "PII utilizada solo para los fines instruidos por el cliente", family: "27018-ANEXO_A", principio29100: P29100.legitimidad },
  { code: "27018-A.3.1", title: "Restricción de la recolección de PII a lo instruido por el cliente", family: "27018-ANEXO_A", principio29100: P29100.limitacionRecoleccion },
  { code: "27018-A.4.1", title: "Minimización de datos personales tratados en el servicio en la nube", family: "27018-ANEXO_A", principio29100: P29100.minimizacion },
  { code: "27018-A.5.1", title: "Devolución, transferencia y disposición segura de PII al finalizar el servicio", family: "27018-ANEXO_A", principio29100: P29100.limitacionUso },
  { code: "27018-A.5.2", title: "Notificación al cliente sobre subcontratación de tratamiento de PII", family: "27018-ANEXO_A", principio29100: P29100.limitacionUso },
  { code: "27018-A.5.3", title: "Registro y control de la divulgación de PII a terceros", family: "27018-ANEXO_A", principio29100: P29100.limitacionUso },
  { code: "27018-A.6.1", title: "Mecanismos para mantener la exactitud y calidad de la PII", family: "27018-ANEXO_A", principio29100: P29100.exactitud },
  { code: "27018-A.7.1", title: "Divulgación de la ubicación geográfica del tratamiento de PII", family: "27018-ANEXO_A", principio29100: P29100.apertura },
  { code: "27018-A.7.2", title: "Política de privacidad transparente y accesible al cliente", family: "27018-ANEXO_A", principio29100: P29100.apertura },
  { code: "27018-A.8.1", title: "Mecanismo para que el titular acceda, corrija o elimine su PII", family: "27018-ANEXO_A", principio29100: P29100.participacion },
  { code: "27018-A.9.1", title: "Designación de un punto de contacto para asuntos de privacidad", family: "27018-ANEXO_A", principio29100: P29100.responsabilidad },
  { code: "27018-A.9.2", title: "Revisiones y auditorías periódicas de cumplimiento de privacidad", family: "27018-ANEXO_A", principio29100: P29100.responsabilidad },
  { code: "27018-A.10.1", title: "Confidencialidad del personal con acceso a PII", family: "27018-ANEXO_A", principio29100: P29100.seguridad },
  { code: "27018-A.10.2", title: "Restricción de la creación de copias de PII a lo necesario", family: "27018-ANEXO_A", principio29100: P29100.seguridad },
  { code: "27018-A.10.3", title: "Eliminación segura de PII de medios temporales tras su uso", family: "27018-ANEXO_A", principio29100: P29100.seguridad },
  { code: "27018-A.10.4", title: "Controles de cifrado para la transmisión de PII", family: "27018-ANEXO_A", principio29100: P29100.seguridad },
  { code: "27018-A.10.5", title: "Notificación de brechas de PII al cliente sin demora indebida", family: "27018-ANEXO_A", principio29100: P29100.seguridad },
  { code: "27018-A.11.1", title: "Cumplimiento demostrable con la legislación de protección de datos aplicable", family: "27018-ANEXO_A", principio29100: P29100.cumplimiento },
];

// ---------------------------------------------------------------------------
// 4) ISO/IEC 27701 — PIMS: Anexo A (responsable, 7.2-7.5) y Anexo B
//    (encargado, 8.2-8.5). Representación de trabajo basada en la estructura
//    de cláusulas de la norma; validar contra el texto oficial antes de una
//    auditoría formal.
// ---------------------------------------------------------------------------
const CONTROLS_27701_A: ControlSeed[] = [
  { code: "27701-A.7.2.1", title: "Identificar y documentar el propósito del tratamiento de PII", family: "27701-ANEXO_A", clausula: "7.2 Condiciones para la recolección y el tratamiento" },
  { code: "27701-A.7.2.2", title: "Identificar la base legal del tratamiento", family: "27701-ANEXO_A", clausula: "7.2 Condiciones para la recolección y el tratamiento" },
  { code: "27701-A.7.2.3", title: "Determinar cuándo y cómo se debe obtener el consentimiento", family: "27701-ANEXO_A", clausula: "7.2 Condiciones para la recolección y el tratamiento" },
  { code: "27701-A.7.2.4", title: "Obtener y registrar el consentimiento", family: "27701-ANEXO_A", clausula: "7.2 Condiciones para la recolección y el tratamiento" },
  { code: "27701-A.7.2.5", title: "Evaluación de impacto en la privacidad (PIA)", family: "27701-ANEXO_A", clausula: "7.2 Condiciones para la recolección y el tratamiento" },
  { code: "27701-A.7.2.6", title: "Contratos con encargados del tratamiento de PII", family: "27701-ANEXO_A", clausula: "7.2 Condiciones para la recolección y el tratamiento" },
  { code: "27701-A.7.2.7", title: "Corresponsables del tratamiento (joint controllers)", family: "27701-ANEXO_A", clausula: "7.2 Condiciones para la recolección y el tratamiento" },
  { code: "27701-A.7.2.8", title: "Registros de las actividades de tratamiento de PII", family: "27701-ANEXO_A", clausula: "7.2 Condiciones para la recolección y el tratamiento" },
  { code: "27701-A.7.3.1", title: "Determinar y cumplir las obligaciones hacia los titulares de PII", family: "27701-ANEXO_A", clausula: "7.3 Obligaciones hacia los titulares de PII" },
  { code: "27701-A.7.3.2", title: "Determinar la información a proveer a los titulares de PII", family: "27701-ANEXO_A", clausula: "7.3 Obligaciones hacia los titulares de PII" },
  { code: "27701-A.7.3.3", title: "Proveer información a los titulares de PII", family: "27701-ANEXO_A", clausula: "7.3 Obligaciones hacia los titulares de PII" },
  { code: "27701-A.7.3.4", title: "Mecanismo para modificar o retirar el consentimiento", family: "27701-ANEXO_A", clausula: "7.3 Obligaciones hacia los titulares de PII" },
  { code: "27701-A.7.3.5", title: "Mecanismo para objetar al tratamiento de PII", family: "27701-ANEXO_A", clausula: "7.3 Obligaciones hacia los titulares de PII" },
  { code: "27701-A.7.3.6", title: "Acceso, corrección y/o eliminación de PII a solicitud del titular", family: "27701-ANEXO_A", clausula: "7.3 Obligaciones hacia los titulares de PII" },
  { code: "27701-A.7.3.9", title: "Manejo de solicitudes de titulares de PII", family: "27701-ANEXO_A", clausula: "7.3 Obligaciones hacia los titulares de PII" },
  { code: "27701-A.7.3.10", title: "Toma de decisiones automatizada sobre PII", family: "27701-ANEXO_A", clausula: "7.3 Obligaciones hacia los titulares de PII" },
  { code: "27701-A.7.4.1", title: "Limitar la recolección de PII a lo adecuado y pertinente", family: "27701-ANEXO_A", clausula: "7.4 Privacidad desde el diseño y por defecto" },
  { code: "27701-A.7.4.3", title: "Exactitud y calidad de la PII tratada", family: "27701-ANEXO_A", clausula: "7.4 Privacidad desde el diseño y por defecto" },
  { code: "27701-A.7.4.4", title: "Objetivos de minimización de PII", family: "27701-ANEXO_A", clausula: "7.4 Privacidad desde el diseño y por defecto" },
  { code: "27701-A.7.4.7", title: "Definición y cumplimiento de períodos de retención de PII", family: "27701-ANEXO_A", clausula: "7.4 Privacidad desde el diseño y por defecto" },
  { code: "27701-A.7.4.8", title: "Disposición segura de la PII al finalizar la retención", family: "27701-ANEXO_A", clausula: "7.4 Privacidad desde el diseño y por defecto" },
  { code: "27701-A.7.4.9", title: "Controles para la transmisión segura de PII", family: "27701-ANEXO_A", clausula: "7.4 Privacidad desde el diseño y por defecto" },
  { code: "27701-A.7.5.1", title: "Identificar la base para la transferencia de PII entre jurisdicciones", family: "27701-ANEXO_A", clausula: "7.5 Compartición, transferencia y divulgación de PII" },
  { code: "27701-A.7.5.2", title: "Países y organizaciones internacionales a los que se puede transferir PII", family: "27701-ANEXO_A", clausula: "7.5 Compartición, transferencia y divulgación de PII" },
  { code: "27701-A.7.5.3", title: "Registros de transferencias de PII", family: "27701-ANEXO_A", clausula: "7.5 Compartición, transferencia y divulgación de PII" },
  { code: "27701-A.7.5.4", title: "Registros de divulgación de PII a terceros", family: "27701-ANEXO_A", clausula: "7.5 Compartición, transferencia y divulgación de PII" },
];

const CONTROLS_27701_B: ControlSeed[] = [
  { code: "27701-B.8.2.1", title: "Acuerdo con el cliente (responsable del tratamiento)", family: "27701-ANEXO_B", clausula: "8.2 Condiciones para la recolección y el tratamiento" },
  { code: "27701-B.8.2.2", title: "Fines de la organización para el tratamiento de PII", family: "27701-ANEXO_B", clausula: "8.2 Condiciones para la recolección y el tratamiento" },
  { code: "27701-B.8.2.3", title: "Uso de PII para marketing y publicidad solo con autorización", family: "27701-ANEXO_B", clausula: "8.2 Condiciones para la recolección y el tratamiento" },
  { code: "27701-B.8.2.4", title: "No actuar sobre instrucciones que infrinjan la normativa aplicable", family: "27701-ANEXO_B", clausula: "8.2 Condiciones para la recolección y el tratamiento" },
  { code: "27701-B.8.2.5", title: "Obligaciones del cliente frente al encargado del tratamiento", family: "27701-ANEXO_B", clausula: "8.2 Condiciones para la recolección y el tratamiento" },
  { code: "27701-B.8.2.6", title: "Registros de las actividades de tratamiento de PII realizadas", family: "27701-ANEXO_B", clausula: "8.2 Condiciones para la recolección y el tratamiento" },
  { code: "27701-B.8.3.1", title: "Apoyo al cliente en el cumplimiento de obligaciones hacia titulares de PII", family: "27701-ANEXO_B", clausula: "8.3 Obligaciones hacia los titulares de PII" },
  { code: "27701-B.8.4.1", title: "Eliminación segura de archivos temporales que contengan PII", family: "27701-ANEXO_B", clausula: "8.4 Privacidad desde el diseño y por defecto" },
  { code: "27701-B.8.4.2", title: "Devolución, transferencia o disposición de PII al finalizar el servicio", family: "27701-ANEXO_B", clausula: "8.4 Privacidad desde el diseño y por defecto" },
  { code: "27701-B.8.4.3", title: "Controles para la transmisión segura de PII", family: "27701-ANEXO_B", clausula: "8.4 Privacidad desde el diseño y por defecto" },
  { code: "27701-B.8.5.1", title: "Identificar la base para la transferencia de PII entre jurisdicciones", family: "27701-ANEXO_B", clausula: "8.5 Compartición, transferencia y divulgación de PII" },
  { code: "27701-B.8.5.2", title: "Países y organizaciones internacionales a los que se puede transferir PII", family: "27701-ANEXO_B", clausula: "8.5 Compartición, transferencia y divulgación de PII" },
  { code: "27701-B.8.5.3", title: "Registros de divulgación de PII a terceros", family: "27701-ANEXO_B", clausula: "8.5 Compartición, transferencia y divulgación de PII" },
];

// ---------------------------------------------------------------------------
// 5) ISO/IEC 27031 — prácticas de continuidad TIC (NO es Anexo A; se
//    etiqueta explícitamente como "práctica, no Anexo A")
// ---------------------------------------------------------------------------
const PRACTICES_27031: ControlSeed[] = [
  { code: "27031-P.1.1", title: "Análisis de impacto al negocio (BIA) enfocado en TIC", family: "27031-PRACTICA", proceso27031: "Comprensión de la organización (BIA)", isPractice: true },
  { code: "27031-P.1.2", title: "Evaluación de riesgos de continuidad TIC", family: "27031-PRACTICA", proceso27031: "Comprensión de la organización (BIA)", isPractice: true },
  { code: "27031-P.1.3", title: "Identificación de actividades críticas y dependencias TIC", family: "27031-PRACTICA", proceso27031: "Comprensión de la organización (BIA)", isPractice: true },
  { code: "27031-P.2.1", title: "Definición de estrategias de recuperación TIC (RTO/RPO)", family: "27031-PRACTICA", proceso27031: "Estrategias de continuidad", isPractice: true },
  { code: "27031-P.2.2", title: "Selección de sitio alterno / arquitectura de recuperación", family: "27031-PRACTICA", proceso27031: "Estrategias de continuidad", isPractice: true },
  { code: "27031-P.2.3", title: "Estrategias de redundancia y respaldo de infraestructura TIC", family: "27031-PRACTICA", proceso27031: "Estrategias de continuidad", isPractice: true },
  { code: "27031-P.3.1", title: "Desarrollo de planes de respuesta y recuperación TIC", family: "27031-PRACTICA", proceso27031: "Desarrollo e implementación de la respuesta", isPractice: true },
  { code: "27031-P.3.2", title: "Procedimientos de activación y escalamiento", family: "27031-PRACTICA", proceso27031: "Desarrollo e implementación de la respuesta", isPractice: true },
  { code: "27031-P.3.3", title: "Documentación operativa de procedimientos de recuperación", family: "27031-PRACTICA", proceso27031: "Desarrollo e implementación de la respuesta", isPractice: true },
  { code: "27031-P.4.1", title: "Programa de pruebas y ejercicios de continuidad TIC", family: "27031-PRACTICA", proceso27031: "Ejercicios, mantenimiento y revisión", isPractice: true },
  { code: "27031-P.4.2", title: "Revisión post-ejercicio y actualización de planes", family: "27031-PRACTICA", proceso27031: "Ejercicios, mantenimiento y revisión", isPractice: true },
  { code: "27031-P.4.3", title: "Auditoría interna de la preparación TIC para continuidad", family: "27031-PRACTICA", proceso27031: "Ejercicios, mantenimiento y revisión", isPractice: true },
  { code: "27031-P.5.1", title: "Programa de concienciación en continuidad del negocio", family: "27031-PRACTICA", proceso27031: "Cultura de continuidad", isPractice: true },
  { code: "27031-P.5.2", title: "Comunicación y gobierno de la continuidad TIC", family: "27031-PRACTICA", proceso27031: "Cultura de continuidad", isPractice: true },
  { code: "27031-P.5.3", title: "Integración de la continuidad en la gestión del cambio", family: "27031-PRACTICA", proceso27031: "Cultura de continuidad", isPractice: true },
];

// ---------------------------------------------------------------------------
// 6) ISO/IEC 27032 — prácticas de ciberseguridad (NO es Anexo A; se etiqueta
//    explícitamente como "práctica, no Anexo A")
// ---------------------------------------------------------------------------
const PRACTICES_27032: ControlSeed[] = [
  { code: "27032-P.1.1", title: "Seguridad en el ciclo de vida de aplicaciones", family: "27032-PRACTICA", practica27032: "Controles a nivel de aplicación", isPractice: true },
  { code: "27032-P.1.2", title: "Gestión de vulnerabilidades de aplicaciones web", family: "27032-PRACTICA", practica27032: "Controles a nivel de aplicación", isPractice: true },
  { code: "27032-P.2.1", title: "Hardening de servidores", family: "27032-PRACTICA", practica27032: "Protección de servidores", isPractice: true },
  { code: "27032-P.2.2", title: "Gestión de parches de servidores", family: "27032-PRACTICA", practica27032: "Protección de servidores", isPractice: true },
  { code: "27032-P.3.1", title: "Protección de endpoints de usuario final", family: "27032-PRACTICA", practica27032: "Controles de usuario final", isPractice: true },
  { code: "27032-P.3.2", title: "Gestión de dispositivos personales (BYOD)", family: "27032-PRACTICA", practica27032: "Controles de usuario final", isPractice: true },
  { code: "27032-P.4.1", title: "Simulacros de phishing", family: "27032-PRACTICA", practica27032: "Controles contra ingeniería social", isPractice: true },
  { code: "27032-P.4.2", title: "Capacitación contra ingeniería social", family: "27032-PRACTICA", practica27032: "Controles contra ingeniería social", isPractice: true },
  { code: "27032-P.5.1", title: "Plan de respuesta ante ciberataques", family: "27032-PRACTICA", practica27032: "Preparación ante ciberataques", isPractice: true },
  { code: "27032-P.5.2", title: "Threat hunting y detección temprana", family: "27032-PRACTICA", practica27032: "Preparación ante ciberataques", isPractice: true },
  { code: "27032-P.6.1", title: "Participación en comunidades de intercambio de amenazas (ISAC)", family: "27032-PRACTICA", practica27032: "Intercambio de información y coordinación", isPractice: true },
  { code: "27032-P.6.2", title: "Coordinación con CERT/CSIRT nacional o sectorial", family: "27032-PRACTICA", practica27032: "Intercambio de información y coordinación", isPractice: true },
];

const ALL_CONTROLS: ControlSeed[] = [
  ...annexA(ORGANIZATIONAL, "Organizacional"),
  ...annexA(PEOPLE, "Personas"),
  ...annexA(PHYSICAL, "Físico"),
  ...annexA(TECHNOLOGICAL, "Tecnológico"),
  ...CLD_CONTROLS,
  ...CONTROLS_27018,
  ...CONTROLS_27701_A,
  ...CONTROLS_27701_B,
  ...PRACTICES_27031,
  ...PRACTICES_27032,
];

async function seedControls() {
  console.log(`Sembrando catálogo de controles (${ALL_CONTROLS.length} registros)...`);
  for (const c of ALL_CONTROLS) {
    await prisma.control.upsert({
      where: { code: c.code },
      update: {}, // no pisar ediciones de implementación ya hechas por el usuario
      create: {
        code: c.code,
        title: c.title,
        family: c.family,
        anexoACategoria: c.anexoACategoria ?? null,
        principio29100: c.principio29100 ?? null,
        clausula: c.clausula ?? null,
        proceso27031: c.proceso27031 ?? null,
        practica27032: c.practica27032 ?? null,
        appliesTo27017: c.appliesTo27017 ?? false,
        appliesTo27018: c.appliesTo27018 ?? false,
        appliesTo27701: c.appliesTo27701 ?? false,
        isPractice: c.isPractice ?? false,
      },
    });
  }

  const orgCount = ORGANIZATIONAL.length;
  const peopleCount = PEOPLE.length;
  const physCount = PHYSICAL.length;
  const techCount = TECHNOLOGICAL.length;
  const totalAnexoA = orgCount + peopleCount + physCount + techCount;
  console.log(
    `Anexo A base: ${totalAnexoA} (org ${orgCount}, personas ${peopleCount}, físico ${physCount}, tecnológico ${techCount})`
  );
  console.log(`CLD.x: ${CLD_CONTROLS.length} | 27018 Anexo A: ${CONTROLS_27018.length}`);
  console.log(`27701 Anexo A: ${CONTROLS_27701_A.length} | 27701 Anexo B: ${CONTROLS_27701_B.length}`);
  console.log(`27031 prácticas: ${PRACTICES_27031.length} | 27032 prácticas: ${PRACTICES_27032.length}`);
}

// ---------------------------------------------------------------------------
// 7) Datos de ejemplo para probar el sistema de punta a punta
// ---------------------------------------------------------------------------
async function seedSampleData() {
  const assetCount = await prisma.asset.count();
  if (assetCount > 0) {
    console.log("Ya existen activos; se omite la siembra de datos de ejemplo.");
    return;
  }

  console.log("Sembrando datos de ejemplo (activos, apetito, riesgos, indicadores, incidentes, continuidad)...");

  const [servidorERP, portalClientes, bdClientes, proveedorNube] = await Promise.all([
    prisma.asset.create({
      data: {
        name: "Servidor ERP corporativo",
        type: "Hardware",
        owner: "Gerencia de TI",
        criticality: "Alto",
        description: "Servidor físico que aloja el ERP financiero y de operaciones.",
      },
    }),
    prisma.asset.create({
      data: {
        name: "Portal web de clientes",
        type: "Software",
        owner: "Producto Digital",
        criticality: "Crítico",
        description: "Aplicación web expuesta a internet para autogestión de clientes.",
      },
    }),
    prisma.asset.create({
      data: {
        name: "Base de datos de clientes (PII)",
        type: "Información",
        owner: "Oficial de Privacidad",
        criticality: "Crítico",
        description: "Contiene datos personales de clientes: identificación, contacto, historial.",
      },
    }),
    prisma.asset.create({
      data: {
        name: "Proveedor de infraestructura en la nube",
        type: "Proveedor/Tercero",
        owner: "Gerencia de TI",
        criticality: "Alto",
        description: "IaaS/PaaS que aloja el portal de clientes y respaldos.",
      },
    }),
  ]);

  const appetiteData: {
    category: string;
    statement: string;
    appetiteThreshold: number;
    toleranceThreshold: number;
    responsable: string;
  }[] = [
    { category: "Tecnológico", statement: "Aceptamos riesgo tecnológico bajo controlado; no toleramos exposición sin plan de mitigación.", appetiteThreshold: 6, toleranceThreshold: 12, responsable: "CTO" },
    { category: "Operacional", statement: "Se acepta riesgo operacional moderado en procesos no críticos.", appetiteThreshold: 7, toleranceThreshold: 13, responsable: "COO" },
    { category: "Cumplimiento", statement: "Tolerancia mínima: cualquier incumplimiento regulatorio material debe escalarse de inmediato.", appetiteThreshold: 4, toleranceThreshold: 8, responsable: "Legal/Cumplimiento" },
    { category: "Privacidad", statement: "Cero tolerancia a fugas de PII sin control compensatorio; apetito bajo por diseño.", appetiteThreshold: 4, toleranceThreshold: 9, responsable: "Oficial de Privacidad (DPO)" },
    { category: "Continuidad", statement: "Se acepta interrupción menor a RTO definido; escalamiento obligatorio si se supera.", appetiteThreshold: 6, toleranceThreshold: 12, responsable: "Gerencia de Continuidad" },
    { category: "Ciberseguridad", statement: "Postura de defensa en profundidad; apetito bajo ante amenazas externas activas.", appetiteThreshold: 6, toleranceThreshold: 11, responsable: "CISO" },
    { category: "Reputacional", statement: "Se acepta bajo impacto reputacional aislado; no eventos recurrentes.", appetiteThreshold: 7, toleranceThreshold: 14, responsable: "Comunicaciones" },
    { category: "Financiero", statement: "Apetito moderado dentro del presupuesto de riesgo aprobado por la Junta.", appetiteThreshold: 8, toleranceThreshold: 15, responsable: "CFO" },
  ];
  for (const a of appetiteData) {
    await prisma.riskAppetite.create({ data: { ...a, approvedDate: new Date() } });
  }

  const risk1 = await prisma.risk.create({
    data: {
      code: "R-001",
      title: "Acceso no autorizado a la base de datos de clientes",
      category: "Privacidad",
      assetId: bdClientes.id,
      causa: "Credenciales compartidas y ausencia de MFA en accesos administrativos.",
      vulnerabilidad: "Cuentas privilegiadas sin autenticación multifactor.",
      amenaza: "Actor malicioso interno o externo con credenciales comprometidas.",
      probabilidad: 4,
      impacto: 5,
      nivelInherente: 20,
      tratamiento: "Mitigar",
      probabilidadResidual: 2,
      impactoResidual: 5,
      nivelResidual: 10,
      estado: "En tratamiento",
      responsable: "Oficial de Privacidad (DPO)",
    },
  });

  const risk2 = await prisma.risk.create({
    data: {
      code: "R-002",
      title: "Indisponibilidad del portal de clientes por ataque DDoS",
      category: "Ciberseguridad",
      assetId: portalClientes.id,
      causa: "Exposición pública sin protección anti-DDoS contratada.",
      vulnerabilidad: "Ausencia de mitigación de tráfico volumétrico.",
      amenaza: "Ataque de denegación de servicio distribuido.",
      probabilidad: 3,
      impacto: 4,
      nivelInherente: 12,
      tratamiento: "Mitigar",
      probabilidadResidual: 2,
      impactoResidual: 4,
      nivelResidual: 8,
      estado: "Monitoreo",
      responsable: "CISO",
    },
  });

  const risk3 = await prisma.risk.create({
    data: {
      code: "R-003",
      title: "Pérdida de continuidad del ERP por falla del proveedor de nube",
      category: "Continuidad",
      assetId: servidorERP.id,
      causa: "Dependencia de un único proveedor sin arquitectura multi-región.",
      vulnerabilidad: "Punto único de falla en la infraestructura del ERP.",
      amenaza: "Interrupción prolongada del servicio del proveedor de nube.",
      probabilidad: 2,
      impacto: 4,
      nivelInherente: 8,
      tratamiento: "Transferir",
      estado: "Abierto",
      responsable: "Gerencia de Continuidad",
    },
  });

  const somePlan = await prisma.continuityPlan.create({
    data: {
      nombre: "Plan de recuperación ante desastres — ERP",
      alcance: "Servidor ERP corporativo y bases de datos asociadas.",
      rto: "8 horas",
      rpo: "1 hora",
      estrategia: "Failover a proveedor de nube secundario con réplica asíncrona.",
      estado: "Aprobado",
      fechaUltimaPrueba: new Date(new Date().setMonth(new Date().getMonth() - 4)),
      fechaProximaPrueba: new Date(new Date().setMonth(new Date().getMonth() + 2)),
      responsable: "Gerencia de Continuidad",
    },
  });
  await prisma.continuityPlan.create({
    data: {
      nombre: "Plan de continuidad — Portal de clientes",
      alcance: "Aplicación web y CDN del portal de autogestión.",
      rto: "2 horas",
      rpo: "15 minutos",
      estrategia: "Arquitectura activo-activo multi-región.",
      estado: "Probado",
      fechaUltimaPrueba: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      fechaProximaPrueba: new Date(new Date().setMonth(new Date().getMonth() + 5)),
      responsable: "Producto Digital",
    },
  });

  const ind1 = await prisma.indicator.create({
    data: {
      code: "IND-001",
      tipo: "KRI",
      nombre: "Cuentas privilegiadas sin MFA",
      descripcion: "Número de cuentas con privilegios administrativos que no tienen MFA habilitado.",
      unidad: "cuentas",
      direccion: "menor_es_mejor",
      meta: 0,
      umbralAlerta: 2,
      umbralCritico: 5,
      frecuencia: "Mensual",
      responsable: "CISO",
      riskId: risk1.id,
    },
  });
  await prisma.measurement.createMany({
    data: [
      { indicatorId: ind1.id, fecha: new Date(new Date().setMonth(new Date().getMonth() - 2)), valor: 6, nota: "Línea base" },
      { indicatorId: ind1.id, fecha: new Date(new Date().setMonth(new Date().getMonth() - 1)), valor: 3, nota: "Tras primera campaña de MFA" },
      { indicatorId: ind1.id, fecha: new Date(), valor: 1, nota: "Casi completado" },
    ],
  });

  const ind2 = await prisma.indicator.create({
    data: {
      code: "IND-002",
      tipo: "KPI",
      nombre: "% de cumplimiento de parches críticos",
      descripcion: "Porcentaje de vulnerabilidades críticas parcheadas dentro del SLA.",
      unidad: "%",
      direccion: "mayor_es_mejor",
      meta: 95,
      umbralAlerta: 90,
      umbralCritico: 80,
      frecuencia: "Mensual",
      responsable: "Gerencia de TI",
    },
  });
  await prisma.measurement.createMany({
    data: [
      { indicatorId: ind2.id, fecha: new Date(new Date().setMonth(new Date().getMonth() - 1)), valor: 88 },
      { indicatorId: ind2.id, fecha: new Date(), valor: 93 },
    ],
  });

  await prisma.indicator.create({
    data: {
      code: "IND-003",
      tipo: "KRI",
      nombre: "Incidentes críticos abiertos",
      descripcion: "Número de incidentes de severidad crítica sin resolver.",
      unidad: "incidentes",
      direccion: "menor_es_mejor",
      meta: 0,
      umbralAlerta: 1,
      umbralCritico: 3,
      frecuencia: "Semanal",
      responsable: "CISO",
    },
    // sin mediciones aún -> demuestra el semáforo "Sin datos"
  });

  await prisma.incident.create({
    data: {
      code: "INC-001",
      title: "Intento de phishing dirigido a Finanzas",
      description: "Correo suplantando a un proveedor solicitando cambio de cuenta bancaria.",
      categoria: "Phishing",
      severidad: "Alta",
      estado: "Resuelto",
      fechaDeteccion: new Date(new Date().setDate(new Date().getDate() - 20)),
      fechaResolucion: new Date(new Date().setDate(new Date().getDate() - 18)),
      causaRaiz: "Falta de verificación de doble canal para cambios bancarios.",
      leccionesAprendidas: "Se implementó verificación telefónica obligatoria para cambios de datos bancarios.",
      riskId: risk1.id,
      activos: { connect: [{ id: bdClientes.id }] },
    },
  });

  await prisma.incident.create({
    data: {
      code: "INC-002",
      title: "Pico de tráfico anómalo en el portal de clientes",
      description: "Tráfico 40x sobre el promedio proveniente de un rango de IPs concentrado.",
      categoria: "Denegación de servicio",
      severidad: "Crítica",
      estado: "Contenido",
      fechaDeteccion: new Date(new Date().setDate(new Date().getDate() - 3)),
      causaRaiz: null,
      leccionesAprendidas: null,
      riskId: risk2.id,
      activos: { connect: [{ id: portalClientes.id }, { id: proveedorNube.id }] },
    },
  });

  console.log("Datos de ejemplo creados. Plan de continuidad de referencia:", somePlan.nombre);
  console.log("Riesgo de referencia:", risk3.code, risk3.title);
}

async function main() {
  await seedControls();
  await seedSampleData();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
