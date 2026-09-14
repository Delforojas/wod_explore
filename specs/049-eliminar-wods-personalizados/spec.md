# SDD - Issue #49: Permitir eliminar WODs personalizados

## Estado

Spec de implementacion full-stack para eliminar WODs personalizados propios.
La rama de trabajo es `feat/049-delete-custom-wods`, derivada de `main` despues
de integrar las Issues #44, #45, #46, #47 y #48.

La eliminacion usara `DELETE /api/user-wods/{id}`. El propietario se resolvera
exclusivamente desde `Authentication` y no se modificara el esquema MySQL.

## Objetivo

Permitir que una persona autenticada elimine un WOD personalizado propio sin
afectar WODs globales, WODs de otras cuentas, ejercicios del catalogo ni
resultados historicos.

## Evidencia y politica de resultados

Se inspeccionaron las entidades `Wod`, `WodExercise`,
`WodExercisePrescription` y `WodResult`, los repositories y servicios de
resultados, las migraciones y el esquema real de `wod_explorer` mediante
consultas read-only de `wodsql`.

El esquema vigente contiene:

- `wods.owner_id` nullable: `NULL` identifica catalogo global y un valor
  identifica un WOD personalizado.
- `wod_exercises.wod_id ON DELETE CASCADE`.
- `wod_exercise_prescriptions.wod_exercise_id ON DELETE CASCADE`.
- `wod_exercises.exercise_id ON DELETE RESTRICT`, por lo que borrar un WOD no
  borra ejercicios del catalogo.
- `wod_results.wod_id ON DELETE CASCADE`.
- Actualmente existen 3 WODs personalizados y ninguno tiene resultados.

La politica elegida es **bloquear el borrado cuando existe cualquier resultado
historico asociado al WOD**, devolviendo `409 Conflict`. No se usara soft delete
ni snapshot historico porque no existen columnas, migracion ni contrato para
ello, y permitir el borrado provocaria la eliminacion implicita de resultados
por la FK `ON DELETE CASCADE`. Se comprueba la existencia de resultados sin
eliminarlos ni depender de que pertenezcan al usuario autenticado; cualquier
historial asociado protege el WOD.

## Alcance

### Incluido

- Endpoint autenticado `DELETE /api/user-wods/{id}`.
- Resolucion del propietario desde el subject JWT.
- Consulta por `(id, owner_id)` para ocultar WODs inexistentes, globales o ajenos.
- Bloqueo `409` cuando el WOD tiene resultados historicos.
- Eliminacion transaccional de WODs sin resultados.
- Limpieza de ejercicios del WOD y prescripciones mediante las cascadas
  existentes, sin borrar filas de `exercises`.
- Error centralizado para WOD no disponible y eliminacion bloqueada.
- Accion de eliminacion en el detalle de WOD personal.
- Dialogo nativo de confirmacion que identifica el nombre del WOD.
- Estados de confirmacion, carga, error y exito, con navegacion a "Mis WODs".
- Feedback de exito despues de navegar al listado.
- Tests unitarios, HTTP, integracion MySQL y comportamiento frontend.

### Excluido

- Cambios de tablas, columnas, indices, constraints o migraciones.
- Soft delete, snapshots historicos o migracion de resultados.
- Eliminacion de WODs globales o de otras cuentas.
- Eliminacion o modificacion de ejercicios del catalogo.
- Cambios en la politica de ownership de resultados o nuevos permisos.
- Nuevas dependencias, estado global o persistencia de feedback.
- Cambios en la creacion, listado o detalle mas alla de la accion y feedback
  necesarios para el borrado.

## Contrato HTTP

### `DELETE /api/user-wods/{id}`

Requiere un JWT valido. El controller obtiene `Authentication.getName()` y el
service normaliza el email, resuelve el usuario y busca el WOD mediante
`findByIdAndOwner_Id`.

Respuestas:

- `204 No Content` cuando se elimina correctamente.
- `401 Unauthorized` sin JWT, JWT invalido o usuario no resoluble.
- `404 Not Found` para WOD inexistente, global o perteneciente a otra cuenta,
  usando `USER_WOD_NOT_FOUND` sin revelar ownership.
- `409 Conflict` si el WOD tiene resultados historicos, usando un error estable
  como `USER_WOD_HAS_RESULTS` y un mensaje comprensible.

El request no tiene body y no acepta `userId`, `ownerId` ni ningun selector de
propietario.

## Reglas de dominio y persistencia

- Solo se considera eliminable un WOD encontrado por su id y el usuario
  autenticado.
- La comprobacion de resultados se ejecuta antes de `delete`.
- Si existe al menos un `wod_results` para el WOD, la operacion no modifica
  ninguna tabla.
- Si no existen resultados, `wodRepository.delete(wod)` elimina el WOD dentro de
  una transaccion y las FKs en cascada eliminan sus `wod_exercises` y
  `wod_exercise_prescriptions`.
- Los ejercicios referenciados en `exercises` permanecen intactos.
- La operacion se fuerza a flush para que los tests y errores de integridad
  observen el resultado antes de terminar la transaccion.
- No se modifica `WodResultService`, aunque la inspeccion confirma que los
  resultados historicos son referencias directas a `wods`; el bloqueo protege
  tambien resultados creados desde otros flujos.

## Diseno frontend

- `MyWodDetailPage` mostrara un boton `Eliminar WOD` junto a `Editar`.
- El primer clic solo abrira un `<dialog>` nativo con el nombre del WOD y las
  acciones `Cancelar` y `Eliminar WOD`.
- El dialogo tendra foco gestionado de forma segura, cierre por Escape y
  controles de al menos 44px.
- Mientras se elimina, el boton de confirmacion queda deshabilitado y comunica
  `Eliminando...`; no se permiten envios duplicados.
- Un error `409` explicara que el WOD conserva resultados y no se puede borrar.
  Los demas errores reutilizaran el mensaje seguro de `ApiError`.
- Tras `204`, se navegara a `#/my-wods?deleted=1`; el router interpretara el
  feedback sin usar `localStorage` ni `sessionStorage`.
- `MyWodsPage` mostrara un estado de exito anunciado con `aria-live` y seguira
  cargando la lista desde la API, por lo que el WOD eliminado no aparecera.
- El listado no tendra una accion de borrado adicional; la accion queda
  disponible unicamente en el detalle autenticado de WODs propios.

## Accesibilidad y responsive

- Usar boton real, dialogo semantico, heading asociado y labels claros.
- Mantener foco visible, orden de teclado y cierre con Escape sin borrar datos.
- Anunciar carga, error y exito mediante los patrones de `StateMessage`.
- Respetar las superficies, tokens, tipografia y controles de `DESIGN.md`.
- Verificar 320px, movil, tablet y escritorio sin overflow horizontal.

## Criterios de aceptacion

- [ ] Un usuario autenticado puede eliminar un WOD personalizado propio con
  `DELETE /api/user-wods/{id}`.
- [ ] El propietario se obtiene exclusivamente del contexto de seguridad.
- [ ] Un usuario no puede eliminar WODs ajenos, globales o inexistentes.
- [ ] Las relaciones dependientes quedan consistentes tras un borrado correcto.
- [ ] Los ejercicios globales del catalogo nunca se eliminan.
- [ ] El borrado correcto responde `204 No Content`.
- [ ] Los errores usan `GlobalExceptionHandler` con `404` o `409` coherentes.
- [ ] La politica de resultados historicos esta documentada antes del borrado.
- [ ] Los resultados historicos nunca se eliminan implicitamente.
- [ ] El WOD eliminado desaparece de "Mis WODs".
- [ ] La accion solo esta disponible en el detalle de un WOD personal autenticado.
- [ ] El primer clic abre una confirmacion que identifica el WOD.
- [ ] Cancelar no modifica datos y el teclado/foco funcionan correctamente.
- [ ] La carga evita acciones duplicadas y los errores dejan la UI consistente.
- [ ] Tras eliminar desde detalle se navega a "Mis WODs" con feedback de exito.
- [ ] Creacion, listado y detalle existentes siguen funcionando.
- [ ] Tests unitarios, HTTP, integracion, comportamiento, lint y build pasan.

## Referencias

- Issue #49: Permitir eliminar WODs personalizados.
- `specs/043-diseno-wods-personalizados/spec.md`.
- `specs/045-user-wods-api/spec.md`.
- `specs/047-mis-wods/spec.md`.
- `specs/048-editar-wods-personalizados/spec.md`.
- `backend/src/main/java/com/wodexplorer/entity/Wod.java`.
- `backend/src/main/java/com/wodexplorer/entity/WodResult.java`.
- `backend/src/main/java/com/wodexplorer/service/UserWodService.java`.
- `backend/src/main/java/com/wodexplorer/service/WodResultService.java`.
- `backend/src/main/java/com/wodexplorer/controller/UserWodController.java`.
- `frontend/src/pages/MyWodDetailPage.tsx`.
- `frontend/src/pages/MyWodsPage.tsx`.
- `Docker/mysql/migrations/V029__add_custom_wod_persistence.sql`.
- `DESIGN.md`.
