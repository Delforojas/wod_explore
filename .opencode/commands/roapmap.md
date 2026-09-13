---
description: Analiza el estado actual del proyecto y crea las siguientes Issues necesarias
---

# /roadmap

Analiza el estado actual de WOD Explorer y determina cuáles deben ser las siguientes GitHub Issues del proyecto.

El objetivo de este comando es decidir **qué hacer después**, no realizar una auditoría completa del repositorio.

## Objetivo

Mantener un roadmap corto, práctico y orientado al siguiente trabajo necesario.

Debes:

1. Revisar las Issues abiertas en GitHub.
2. Revisar Issues cerradas recientes cuando sea necesario para entender dependencias.
3. Consultar únicamente el código, specs o documentación necesarios para entender el estado actual.
4. Detectar los siguientes pasos funcionales, de integración o bloqueantes.
5. Crear únicamente las Issues que tenga sentido abordar próximamente.

No implementes ninguna Issue.

---

## GitHub

Usa el GitHub MCP para consultar:

- Issues abiertas.
- Issues cerradas recientes relevantes.
- Dependencias entre Issues.
- Estado general del roadmap existente.

No recorras todo el historial de GitHub salvo que sea necesario para resolver una dependencia concreta.

---

## Repositorio

No audites todo el repositorio.

Consulta únicamente los archivos necesarios para determinar el siguiente trabajo.

Prioriza, cuando sea relevante:

- `PRODUCT.md`
- `README.md`
- `AGENTS.md`
- specs recientes
- código relacionado con las Issues actuales
- configuración necesaria para entender una dependencia

No revises sistemáticamente cada archivo del backend, frontend, Docker o SQL.

---

## Base de datos

No consultes MySQL por defecto.

Usa el MCP de base de datos únicamente cuando una decisión concreta del roadmap dependa del esquema o del estado real de la base de datos.

No hagas una auditoría completa de tablas, datos o relaciones.

---

## Selección de Issues

Prioriza trabajo que:

1. Desbloquee funcionalidad.
2. Complete integraciones pendientes.
3. Resuelva inconsistencias reales entre frontend, backend y base de datos.
4. Complete funcionalidades ya iniciadas.
5. Sea necesario antes de continuar con nuevas funcionalidades.

Evita crear Issues únicamente por:

- refactors opcionales;
- mejoras cosméticas;
- optimizaciones prematuras;
- cambios especulativos;
- trabajo preventivo sin un problema actual;
- tareas que no aporten valor claro al siguiente estado del producto.

---

## Cantidad

Crea como máximo **3–5 Issues por ejecución**.

No intentes planificar todo el proyecto hasta producción en una sola ejecución.

El roadmap debe avanzar por iteraciones.

---

## Creación de Issues

Para cada Issue seleccionada, crea la Issue mediante GitHub MCP.

Cada Issue debe contener como mínimo:

### Objetivo

Qué problema resuelve o qué funcionalidad añade.

### Alcance

Qué debe incluir.

### Criterios de aceptación

Condiciones verificables para considerar la Issue terminada.

### Dependencias

Indica otras Issues de las que dependa, cuando existan.

No generes todavía:

- `spec.md`
- `plan.md`
- `tasks.md`

Eso corresponde a `/issue`.

---

## Prioridad

Clasifica las Issues cuando tenga sentido:

- **P0** — bloqueante o necesario inmediatamente.
- **P1** — siguiente trabajo importante.
- **P2** — mejora posterior.

No crees una Issue únicamente para llenar una prioridad.

---

## Restricciones

Durante `/roadmap`:

- NO modificar código.
- NO crear ramas.
- NO crear commits.
- NO hacer push.
- NO cerrar Issues.
- NO generar SDD.
- NO ejecutar suites completas de tests salvo que sean imprescindibles para decidir el roadmap.
- NO realizar una auditoría completa del proyecto.

Este comando solo analiza, decide y crea Issues.

---

## Salida final

Al terminar muestra un resumen corto:

### Estado actual

Resumen de dónde está el proyecto.

### Issues creadas

Número, título y prioridad.

### Orden recomendado

Orden sugerido de implementación.

### Siguiente paso

Indica cuál debería ejecutarse ahora:

`/issue <numero>`

No continúes automáticamente con `/issue`.
