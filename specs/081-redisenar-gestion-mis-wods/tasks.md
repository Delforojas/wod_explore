# Tasks - Issue #81: Redisenar gestion de Mis WODs

## Preparacion

- [x] Obtener la Issue #81 mediante `delfohub` y extraer titulo, objetivo,
      alcance, restricciones y criterios de aceptacion.
- [x] Confirmar rama, `git status`, cambios locales y ausencia de una rama
      correspondiente antes de editar.
- [x] Crear y verificar la rama `feat/081-redisenar-gestion-mis-wods` desde
      `main` con las dependencias previas integradas.
- [x] Leer constitucion, producto, AGENTS aplicables, DESIGN.md, specs
      relacionadas y skills frontend relevantes.
- [x] Crear `spec.md`, `plan.md` y `tasks.md` con contenido valido.

## Implementacion

- [x] Reorganizar el archivo personal de `MyWodsPage` con jerarquia de datos y
      acciones explicitas de consulta, edicion y eliminacion.
- [x] Mantener los estados privado, carga, vacio, error, red, exito y paginacion
      sin cambiar el contrato de `getUserWods`/`getUserWod`.
- [x] Reorganizar `MyWodDetailPage` para separar consulta, resultados, edicion y
      eliminacion con confirmacion segura.
- [x] Mantener orden, prescripciones, feedback de borrado, error 409 y rutas
      existentes.
- [x] Ajustar estilos locales para superficies, divisores, acciones y metricas
      desde 320 px sin overflow ni perdida de foco.
- [x] Actualizar tests de listado y detalle para cubrir gestion y no regresion.

## Revision feedback: eliminar desde el listado

- [x] Añadir `Eliminar` a cada fila de `MyWodsPage` usando `deleteUserWod` y sin
      crear un contrato nuevo.
- [x] Reutilizar confirmacion, foco, Escape, estados de carga/error y bloqueo de
      dobles envios; cancelar no debe llamar a la API.
- [x] Recargar automaticamente el listado tras un borrado correcto y conservar
      la fila si la eliminacion falla.
- [x] Cubrir confirmacion, cancelacion, borrado correcto, error, ver y editar en
      los tests del listado.
- [x] Ajustar la zona de acciones para tres controles utilizables desde 320 px.

## Verificacion

- [x] Ejecutar `npm test` desde `frontend/` y resolver fallos de #81.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`, incluyendo TypeScript estricto.
- [x] Ejecutar `git diff --check` y revisar el diff contra `main`.
- [x] Ejecutar una vez el detector mecanico de Impeccable sobre los targets
      finales y resolver hallazgos mecanicos si aparecen.
- [x] Realizar revision estatica responsive, accesibilidad y alcance.

## Verificacion de revision

- [x] Ejecutar `npm test`, `npm run lint`, `npm run build` y `git diff --check`.
- [x] Ejecutar una vez el detector mecanico de Impeccable sobre los targets
      finales.

## Entrega

- [x] Revisar staging y crear un commit propio de #81 sin incluir untracked
      ajenos.
- [x] Ejecutar `git log -1 --oneline` y `git status` despues del commit.
- [x] Documentar la Issue #81 con archivos, verificaciones, hash, mensaje y
      rama; mantenerla abierta y sin push.

## Validaciones manuales pendientes

- [ ] Abrir `#/my-wods` autenticado y confirmar que el archivo, el contador y la
      accion `Crear WOD` se entienden en la primera vista.
- [ ] Confirmar que cada fila permite distinguir y usar `Ver WOD`, `Editar` y
      `Eliminar`.
- [ ] Abrir un detalle y confirmar que identidad, metricas, ejercicios y
      resultados se leen antes de las acciones de gestion.
- [ ] Abrir `Eliminar WOD`, comprobar nombre, foco inicial, `Cancelar` y cierre
      con Escape sin modificar datos.
- [ ] Confirmar que la accion destructiva se distingue visualmente y que el
      borrado solo ocurre despues de confirmar.
- [ ] Probar un error `409` por resultados historicos y confirmar que el dialogo
      permanece abierto con un mensaje comprensible.
- [ ] Probar estados privado, carga, vacio, error y feedback tras eliminar sin
      mostrar datos de otra cuenta.
- [ ] Verificar 320 px, movil, tablet y escritorio sin overflow horizontal y con
      acciones accesibles mediante teclado y foco visible.
- [ ] Confirmar que la edicion y el registro de resultados siguen navegando y
      funcionando desde el detalle.
- [ ] En el listado, pulsar `Eliminar`, cancelar y confirmar que no se llama a la
      API ni desaparece el WOD.
- [ ] Confirmar un borrado correcto y verificar que la fila desaparece sin
      recargar manualmente la pagina.
- [ ] Simular un error de eliminacion y confirmar que el WOD permanece visible
      con un mensaje comprensible y sin permitir dobles envios.

El siguiente paso, despues de aprobar manualmente estas comprobaciones, es
`/finish-issue 81`.
