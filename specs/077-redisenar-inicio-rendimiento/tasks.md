# Tasks 077 - Redisenar Inicio con enfoque en entrenamiento

## SDD y preflight

- [x] Obtener y comprender la Issue #77.
- [x] Confirmar la rama de dependencia #76 y crear la rama especifica de #77.
- [x] Revisar Constitucion, PRODUCT.md, AGENTS.md, frontend/AGENTS.md,
      DESIGN.md, specs relacionadas, arquitectura y skills relevantes.
- [x] Validar que spec.md, plan.md y tasks.md tienen contenido y no dejan
      decisiones funcionales importantes sin resolver.

## Implementacion

- [x] Reemplazar la estructura editorial de `HomePage` por el tablero operativo
      definido en la spec.
- [x] Mantener los cuatro enlaces hash y sus nombres accesibles.
- [x] Sustituir los estilos especificos de Home usando tokens globales y sin
      datos, metricas o decoracion inventados.
- [x] Resolver responsive desde 320 px, wrapping, foco y reduced motion.
- [x] Actualizar tests de comportamiento solo donde cambie el contenido
      observable.

## Verificacion y entrega

- [x] Ejecutar `npm test`.
- [x] Ejecutar `npm run lint`.
- [x] Ejecutar `npm run build`.
- [x] Ejecutar `git diff --check` y revisar el diff propio.
- [x] Realizar revision estatica responsive, accesibilidad y alcance; documentar
      si no es posible una inspeccion visual interactiva.
- [x] Crear commit propio de #77 y verificar `git status` posterior.
- [x] Documentar la Issue #77 con el commit, verificaciones y validaciones
      manuales pendientes sin cerrarla ni hacer push.

## Evidencia adicional

- `impeccable detect --json` sobre los targets modificados: `[]`.
- La inspeccion visual interactiva en navegador no esta disponible en este
  entorno; queda como validacion manual pendiente.
