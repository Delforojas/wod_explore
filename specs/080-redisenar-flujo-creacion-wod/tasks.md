# Tasks - Issue #80: Redisenar flujo de creacion de WOD

## Preparacion

- [x] Obtener la Issue #80 mediante `delfohub` y extraer objetivo, alcance,
      restricciones y criterios de aceptacion.
- [x] Confirmar `main`, `git status`, cambios locales y ausencia de rama local
      correspondiente a #80 antes de editar.
- [x] Crear y verificar la rama
      `feat/080-redisenar-flujo-creacion-wod` desde `main`.
- [x] Leer constitucion, producto, AGENTS aplicables, DESIGN.md, specs
      relacionadas y skills frontend relevantes.
- [x] Crear `spec.md`, `plan.md` y `tasks.md` con contenido valido.

## Implementacion

- [x] Reorganizar `UserWodForm` en una secuencia semantica de tarea sin cambiar
      estado, handlers, modos crear/editar ni payloads.
- [x] Hacer mas clara la configuracion general, la accion principal y la
      diferencia entre acciones primarias y secundarias.
- [x] Mejorar la lista de ejercicios, posiciones, prescripciones, unidades y
      acciones de ordenar/eliminar sin cambiar la matriz de #72.
- [x] Mantener y pulir el dialogo nativo de seleccion, sus estados y su
      navegacion por teclado sin cambiar llamadas API.
- [x] Actualizar estilos especificos de creacion para mobile, tablet y
      escritorio desde 320 px, con focus, targets y reduced motion.
- [x] Actualizar tests de comportamiento de creacion y conservar cobertura de
      edicion, validacion, estados, orden, eliminacion y guardado.

## Verificacion

- [x] Ejecutar `npm test` desde `frontend/` y resolver cualquier fallo
      relacionado con #80.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`, incluyendo TypeScript estricto.
- [x] Ejecutar `git diff --check` y revisar el diff contra `main`.
- [x] Ejecutar una vez el detector mecanico de Impeccable sobre los targets
      finales y resolver hallazgos mecanicos si aparecen.
- [x] Realizar revision estatica responsive, accesibilidad y alcance.

## Entrega

- [x] Revisar staging y crear un commit propio de #80 (`e051577`) sin incluir untracked
      ajenos.
- [x] Ejecutar `git log -1 --oneline` y `git status` despues del commit.
- [x] Documentar la Issue #80 con archivos, verificaciones, hash, mensaje y rama;
      mantenerla abierta y sin push.

Comentario de entrega: https://github.com/Delforojas/wod_explore/issues/80#issuecomment-5681266780

## Revision responsive y CTA multiple

- [x] Apilar en movil la barra de ejercicios, el buscador, los resultados y la
      paginacion del selector sin ocultar controles ni cambiar su contrato.
- [x] Exponer una CTA contextual `Anadir otro movimiento` despues de la lista
      para repetir la seleccion y conservar las medidas ya introducidas.
- [x] Cubrir la repeticion de seleccion en los tests de creacion y verificar
      tests, lint, build y `git diff --check`.

## Revision feedback: seleccion multiple

- [x] Permitir marcar varios ejercicios en el dialogo sin mutar el WOD antes de
      confirmar.
- [x] Anadir una accion `Anadir seleccionados` que incorpore todas las marcas y
      conserve el borrador al cerrar sin confirmar.
- [x] Cubrir la confirmacion multiple y ejecutar tests, lint, build y
      `git diff --check`.

## Validaciones manuales pendientes

- [ ] Abrir `#/create-wod` autenticado y confirmar que la secuencia de trabajo se
      entiende en la primera vista.
- [ ] Probar viewport de 320 px, tablet y escritorio: sin overflow horizontal ni
      controles ocultos.
- [ ] Añadir dos ejercicios, cambiar sus prescripciones, subir/bajar y eliminar
      uno; confirmar que la secuencia visible comunica el orden real.
- [ ] Cambiar entre `FOR_TIME`, `AMRAP` y `EMOM`; confirmar que rondas y límite
      muestran exactamente su estado opcional u obligatorio.
- [ ] Abrir el selector, buscar, paginar, cerrar con Escape y reabrir; confirmar
      que el borrador no cambia.
- [ ] Enviar un formulario incompleto y confirmar mensajes junto al campo y foco
      en el primer error.
- [ ] Simular o provocar error de API y confirmar que nombre, movimientos y
      prescripciones permanecen visibles.
- [ ] Navegar todas las acciones mediante teclado y confirmar focus visible,
      nombres accesibles y targets utilizables.
- [ ] Confirmar que la edicion de un WOD existente conserva la misma claridad y
      no altera sus valores precargados.

El siguiente paso, despues de aprobar manualmente estas comprobaciones, es
`/finish-issue 80`.
