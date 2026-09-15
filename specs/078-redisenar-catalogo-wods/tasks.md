# Tasks 078 - Redisenar catalogo de WODs para exploracion rapida

## SDD y preflight

- [x] Obtener y comprender la Issue #78 y sus restricciones.
- [x] Confirmar la rama existente `feat/078-redisenar-catalogo-wods`.
- [x] Revisar Constitucion, PRODUCT.md, AGENTS.md, frontend/AGENTS.md,
      DESIGN.md, specs 076/077, arquitectura y skills relevantes.
- [x] Validar que spec.md, plan.md y tasks.md tienen contenido y decisiones
      implementables.

## Implementacion

- [x] Redisenar la estructura de `WodsPage` manteniendo datos, rutas y acciones.
- [x] Hacer visibles y comparables nombre, tipo, duracion, rondas y nivel.
- [x] Integrar filtros, contador, favoritos, filtros activos y paginacion en la
      nueva jerarquia de catalogo.
- [x] Conservar loading, privado, error, network-error, empty y estados de
      favoritos mediante los componentes globales.
- [x] Reescribir los estilos especificos de WOD con tokens, foco visible,
      wrapping y responsive desde 320 px.
- [x] Actualizar tests de comportamiento para los datos deportivos y controles
      observables.

## Verificacion y entrega

- [x] Ejecutar `npm test`.
- [x] Ejecutar `npm run lint`.
- [x] Ejecutar `npm run build`.
- [x] Ejecutar `git diff --check` y revisar el diff propio.
- [x] Ejecutar el detector mecanico de Impeccable una sola vez sobre los targets
      finales y resolver hallazgos mecanicos si aparecen.
- [x] Realizar revision estatica responsive, accesibilidad y alcance; indicar
      honestamente cualquier inspeccion visual manual no disponible.
- [x] Crear commit propio de #78 (`6a1056d`) y verificar `git status` posterior.
- [x] Documentar la Issue #78 con commit, rama, verificaciones y validaciones
      manuales pendientes, sin hacer push ni cerrar la Issue.

Comentario de entrega: https://github.com/Delforojas/wod_explore/issues/78#issuecomment-5679915154

## Handoff manual

Las validaciones manuales especificas se transfieren al usuario al finalizar el
workflow; no se marcan como completadas automaticamente.
