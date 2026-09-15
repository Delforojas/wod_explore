# Tasks - Issue #84: Redisenar Estadisticas como interfaz de analisis de rendimiento

## Preparacion

- [x] Obtener la Issue #84 y extraer titulo, objetivo, criterios, alcance,
      restricciones y referencias tecnicas.
- [x] Leer constitucion, producto, AGENTS aplicables, DESIGN.md, specs
      relacionadas y skills frontend relevantes.
- [x] Confirmar que `main` contiene las dependencias y crear la rama
      `feat/084-redisenar-estadisticas-rendimiento` desde `main`.
- [x] Confirmar que no existe otra rama local correspondiente a #84 y preservar
      los archivos untracked ajenos.

## SDD

- [x] Crear `spec.md`, `plan.md` y `tasks.md` en la carpeta con slug valido.
- [x] Verificar que los tres documentos no estan vacios y cubren requisitos,
      plan implementable y tareas ejecutables.
- [x] Confirmar que no quedan decisiones funcionales o arquitectonicas sin
      resolver dentro del alcance de #84.

## Implementacion

- [x] Reorganizar el resumen para priorizar marcas personales y mantener los
      contadores existentes sin crear metricas nuevas.
- [x] Reforzar filas de marcas personales con valor, unidad o formato, contexto,
      estado, fecha y enlace en orden de lectura claro.
- [x] Reforzar evolucion manteniendo sus dos grupos, banda decorativa y lista
      textual completa con sus enlaces y metadatos.
- [x] Mantener llamadas paralelas, autenticacion, estados, contratos y rutas sin
      cambios.
- [x] Ajustar estilos locales para jerarquia, superficies, foco, wrapping y
      responsive desde 320 px sin overflow.
- [x] Actualizar tests de comportamiento para resumen, registros, evolucion,
      estados, enlaces, datos visibles y accesibilidad observable.

## Verificacion

- [x] Ejecutar `npm test` desde `frontend/`.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`, incluyendo TypeScript estricto.
- [x] Ejecutar `git diff --check`.
- [x] Revisar responsive, accesibilidad, estados, llamadas paralelas, contrato y
      alcance.

## Entrega

- [x] Revisar `git diff` y `git status`, separando archivos de #84 de cambios
      ajenos.
- [x] Crear un commit selectivo de #84 con mensaje que incluya `(#84)`.
- [x] Ejecutar `git log -1 --oneline` y `git status` despues del commit.
- [ ] Documentar la Issue #84 con archivos, verificaciones, hash, mensaje y
      rama; mantenerla abierta y sin push.

## Validaciones manuales pendientes

- [ ] Abrir `#/statistics` autenticado y confirmar que la primera lectura
      distingue la metrica principal y los dos contadores de actividad.
- [ ] Confirmar que cada marca personal muestra primero el valor y unidad o
      formato, seguido de recurso, estado deportivo, fecha y enlace correcto.
- [ ] Verificar que la evolucion conserva las bandas decorativas y que la lista
      textual contiene fecha, nombre, metadatos, valor y unidad.
- [ ] Probar estado privado sin autenticacion, carga, vacio, error y reintento.
- [ ] Confirmar que WOD y ejercicios mantienen sus enlaces hash y nombres
      accesibles.
- [ ] Verificar 320 px, movil, tablet y escritorio sin overflow, con nombres
      largos, zoom y navegacion por teclado.

El siguiente paso, despues de aprobar estas comprobaciones, es
`/finish-issue 84`.
