# Tasks - Spec 016

## T1 - Auditoría documental

- [x] Leer `AGENTS.md`.
- [x] Leer `backend/AGENTS.md`.
- [x] Leer `Docker/mysql/AGENTS.md`.
- [x] Consultar Issue #16.
- [x] Revisar Spec 003 y su modelo de historial local.
- [x] Revisar Spec 005 y el alcance del esquema.
- [x] Revisar Spec 007 y la identidad de usuario.
- [x] Revisar Spec 011 y la protección de `/api/**`.
- [x] Revisar las plantillas posteriores de resultados.
- [x] Revisar entidades y seguridad actuales del backend.

## T2 - Auditoría MySQL read-only

- [x] Inspeccionar `wod_results` con `wodsql`.
- [x] Inspeccionar `exercise_results` con `wodsql`.
- [x] Confirmar primary keys.
- [x] Confirmar `AUTO_INCREMENT`.
- [x] Confirmar columnas y tipos.
- [x] Confirmar nulabilidad.
- [x] Confirmar índices.
- [x] Confirmar foreign keys.
- [x] Confirmar `ON DELETE`.
- [x] Confirmar conteo de resultados actual.
- [x] Confirmar que no existen datos que requieran migración.
- [x] No ejecutar operaciones de escritura.

## T3 - Contrato de identidad

- [x] Definir que el usuario procede del JWT.
- [x] Definir que el subject es el email normalizado.
- [x] Definir resolución mediante `UserRepository`.
- [x] Prohibir `userId` en requests.
- [x] Definir usuario inexistente como `401 Unauthorized` en resultados.
- [x] Mantener la protección existente de `/api/**`.

## T4 - Contrato de WOD results

- [x] Definir recurso y rutas futuras.
- [x] Definir request.
- [x] Definir response.
- [x] Definir `timeSeconds`.
- [x] Definir `rounds`.
- [x] Definir `reps`.
- [x] Definir `level` obligatorio.
- [x] Definir `completedAt`.
- [x] Definir reglas para `FOR_TIME`.
- [x] Definir reglas para `AMRAP`.
- [x] Definir reglas para `EMOM`.
- [x] Definir orden de colecciones.

## T5 - Contrato de Exercise results

- [x] Definir recurso y rutas futuras.
- [x] Definir request.
- [x] Definir response.
- [x] Definir `value` y precisión.
- [x] Definir `unit`.
- [x] Definir `recordType`.
- [x] Definir compatibilidad entre `unit` y `recordType`.
- [x] Resolver explícitamente el enum `METERS`.
- [x] Definir `performedAt`.
- [x] Definir orden de colecciones.

## T6 - Validación y errores

- [x] Definir formato temporal.
- [x] Prohibir fechas futuras.
- [x] Definir errores `400`.
- [x] Definir errores `401`.
- [x] Definir errores `404`.
- [x] Definir respuesta `201` para futuras escrituras.
- [x] Permitir múltiples resultados del mismo WOD o Exercise.

## T7 - Decisión de esquema

- [x] Determinar que el esquema actual es suficiente.
- [x] Documentar que no se requieren migraciones.
- [x] Documentar reglas que debe validar la aplicación.
- [x] Documentar `ON DELETE CASCADE`.
- [x] Documentar condiciones que requerirían una spec de esquema futura.

## T8 - Compatibilidad con historial legacy

- [x] Identificar `result` textual de Spec 003.
- [x] Identificar `notes` de Spec 003.
- [x] Decidir que no se traducen automáticamente a resultados backend.
- [x] Reservar una futura spec para migración o notas.

## T9 - Documentación y revisión

- [x] Documentar `spec.md`.
- [x] Documentar `plan.md`.
- [x] Actualizar `tasks.md` con comprobaciones reales.
- [x] Confirmar que no se modificó código.
- [x] Confirmar que no se modificó el esquema.
- [x] Confirmar que no se implementaron endpoints.
- [x] Revisar el diff final.
- [x] Mantener abiertas las issues posteriores de resultados.
