# Tasks 079 - Redisenar detalle de WOD orientado a ejecucion y rendimiento

## SDD y preflight

- [x] Obtener y comprender la Issue #79 y sus restricciones.
- [x] Confirmar la rama `feat/079-redisenar-detalle-wod-rendimiento` desde `main`.
- [x] Revisar Constitucion, PRODUCT.md, AGENTS.md, frontend/AGENTS.md,
      DESIGN.md, arquitectura, specs 076/077/078 y skills relevantes.
- [x] Validar contenido y decisiones implementables de spec.md, plan.md y tasks.md.

## Implementacion

- [x] Redisenar la estructura de `WodDetailPage` manteniendo carga, estados y rutas.
- [x] Hacer visibles y comparables nombre, tipo, limite, rondas, nivel y ejercicios.
- [x] Presentar la secuencia semantica con posicion, nombre, reps y medicion real.
- [x] Mantener favorito, formulario de resultados, intentos y acciones de retorno.
- [x] Reescribir estilos especificos del detalle con tokens, foco y responsive desde
      320 px sin afectar otras paginas.
- [x] Actualizar tests de comportamiento para metricas, ejercicios, acciones y estados.

## Verificacion y entrega

- [x] Ejecutar `npm test`.
- [x] Ejecutar `npm run lint`.
- [x] Ejecutar `npm run build`.
- [x] Ejecutar `git diff --check` y revisar el diff propio.
- [x] Ejecutar el detector mecanico de Impeccable una sola vez sobre los targets
      finales y resolver hallazgos mecanicos si aparecen.
- [x] Realizar revision estatica responsive, accesibilidad y alcance.
- [x] Crear commit propio de #79 (`8fb2abb`) y verificar `git status` posterior.
- [x] Documentar la Issue #79 con commit, rama, verificaciones y validaciones
      manuales pendientes, sin hacer push ni cerrar la Issue.

Comentario de entrega: https://github.com/Delforojas/wod_explore/issues/79#issuecomment-5680271983

## Handoff manual

Las validaciones manuales especificas se transfieren al usuario al finalizar el
workflow; no se marcan como completadas automaticamente.
