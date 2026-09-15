# Tasks - Issue #82: Redisenar catalogo de Ejercicios

## Preparacion

- [x] Obtener la Issue #82 y extraer titulo, objetivo, criterios, alcance,
      restricciones y referencias tecnicas.
- [x] Leer constitucion, producto, AGENTS aplicables, DESIGN.md, specs
      relacionadas y skills frontend relevantes.
- [x] Confirmar que `main` contiene las dependencias y crear la rama
      `feat/082-redisenar-catalogo-ejercicios` desde `main`.
- [x] Confirmar que no existe otra rama local correspondiente a #82 y preservar
      los archivos untracked ajenos.

## SDD

- [x] Crear `spec.md`, `plan.md` y `tasks.md` en la carpeta con slug valido.
- [x] Verificar que los tres documentos no estan vacios y cubren requisitos,
      plan implementable y tareas ejecutables.
- [x] Confirmar que no quedan decisiones funcionales o arquitectonicas sin
      resolver dentro del alcance de #82.

## Implementacion

- [x] Reorganizar `ExercisesPage` como indice deportivo sin cambiar sus
      llamadas API, rutas, estados ni contratos.
- [x] Mantener busqueda submit-driven, consulta aplicada y paginacion existente.
- [x] Presentar nombre, identificador, categoria y tipo de medicion con jerarquia
      clara y texto comprensible.
- [x] Ajustar estilos locales para filas densas, superficies, bordes, foco y
      responsive desde 320 px sin overflow.
- [x] Actualizar tests de comportamiento para proteger los cambios observables
      y las regresiones del catalogo.

## Verificacion

- [x] Ejecutar `npm test` desde `frontend/`.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`, incluyendo TypeScript estricto.
- [x] Ejecutar `git diff --check`.
- [x] Ejecutar una vez el detector mecanico de Impeccable sobre los targets
      finales y resolver hallazgos mecanicos si aparecen.
- [x] Revisar responsive, accesibilidad, estados, contratos y alcance.

## Entrega

- [x] Revisar `git diff` y `git status`, separando archivos de #82 de cambios
      ajenos.
- [x] Crear un commit selectivo de #82 con mensaje que incluya `(#82)`.
- [x] Ejecutar `git log -1 --oneline` y `git status` despues del commit.
- [x] Documentar la Issue #82 con archivos, verificaciones, hash, mensaje y
      rama; mantenerla abierta y sin push.

## Validaciones manuales pendientes

- [ ] Abrir `#/exercises` autenticado y confirmar que el encabezado, contador,
      busqueda y contexto de resultados se entienden en la primera vista.
- [ ] Confirmar que cada fila permite comparar nombre, categoria y tipo de
      medicion, y que navega al detalle correcto.
- [ ] Enviar una busqueda por nombre y verificar que solo se solicita al pulsar
      `Buscar`, reinicia la pagina y muestra la consulta aplicada.
- [ ] Usar `Anterior` y `Siguiente` y confirmar que respetan los limites de
      paginacion y anuncian la pagina actual.
- [ ] Probar estado privado sin autenticacion, carga, resultados vacios, error y
      reintento sin exponer datos de otra cuenta.
- [ ] Verificar 320 px, movil, tablet y escritorio sin overflow horizontal,
      nombres largos cortados ni perdida de foco con teclado.
- [ ] Confirmar que el detalle de ejercicio sigue abriendose mediante el enlace
      real y que no se modificaron otras rutas.

El siguiente paso, despues de aprobar estas comprobaciones, es
`/finish-issue 82`.
