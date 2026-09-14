# Tareas - Issue #43: Diseno de WODs personalizados por usuario

## Estado

Estas tareas pertenecen exclusivamente al trabajo documental de la Issue #43.
La implementacion funcional se ejecutara en las Issues #44-#49.

- [x] Auditar la Issue #43, la constitucion, PRODUCT.md y AGENTS.md aplicables.
- [x] Auditar entidades, repositories, servicios, controllers, DTOs, seguridad y router actuales.
- [x] Auditar las Specs 016-021 y 038 como contratos relacionados.
- [x] Inspeccionar MySQL en modo read-only y registrar el esquema, FKs, indices y datos relevantes.
- [x] Definir ownership mediante `wods.owner_id` nullable y origen derivado.
- [x] Definir `WodType`, categoria `METCON`, nivel, nombre, rondas y time limit.
- [x] Definir posiciones, duplicados de ejercicios y relacion ordenada con `exercises`.
- [x] Definir tabla normalizada de prescripciones, unidades, `unitLabel`, cardinalidad y restricciones.
- [x] Documentar la migracion de `wod_exercises.reps` sin inventar magnitudes ni crear doble escritura.
- [x] Resolver el namespace canonico como `/api/user-wods` y registrar la reconciliacion con la Issue #43 original.
- [x] Definir endpoints, DTOs, paginacion, codigos HTTP, errores y reglas de ownership.
- [x] Definir el ownership de resultados y el limite sobre snapshots historicos.
- [x] Definir el contrato frontend de Mis WODs, formulario, detalle, estados, accesibilidad y responsive.
- [x] Definir estrategia de tests y division ejecutable en las Issues #44-#49.
- [x] Validar trazabilidad, alcance, contradicciones y contenido de los tres artefactos SDD.
- [x] Verificar `git diff --check`, estado Git y que no se modifico codigo de produccion, esquema ni datos.
