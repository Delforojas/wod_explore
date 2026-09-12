# Tasks — Spec 015 WOD ↔ Exercises

## T1 — Auditar estado actual

- [x] Leer `AGENTS.md`.
- [x] Leer `backend/AGENTS.md`.
- [x] Leer Spec 015.
- [x] Leer Plan 015.
- [x] Consultar Issue #15 mediante delfohub.
- [x] Revisar implementación de Spec 014.
- [x] Revisar `Wod`.
- [x] Revisar `Exercise`.
- [x] Revisar repositories existentes.
- [x] Revisar services existentes.
- [x] Revisar DTOs existentes.
- [x] Revisar tests actuales.

---

## T2 — Verificar wod_exercises en MySQL

Usando wodsql en modo lectura:

- [x] Verificar columnas.
- [x] Verificar tipos.
- [x] Verificar nulabilidad.
- [x] Verificar primary key.
- [x] Verificar AUTO_INCREMENT.
- [x] Verificar FK `wod_id`.
- [x] Verificar FK `exercise_id`.
- [x] Verificar ON DELETE de Wod.
- [x] Verificar ON DELETE de Exercise.
- [x] Verificar índices.
- [x] Consultar asociaciones reales.
- [x] Verificar orden mediante `position`.
- [x] Confirmar que no existen discrepancias bloqueantes.

---

## T3 — Diseñar estrategia JPA

- [x] Confirmar que no se utilizará `@ManyToMany` simple.
- [x] Diseñar entidad de asociación.
- [x] Evaluar relaciones unidireccionales.
- [x] Evitar relaciones inversas innecesarias.
- [x] Evitar cascadas de escritura innecesarias.
- [x] Definir estrategia de carga.
- [x] Evaluar riesgo N+1.

---

## T4 — Crear WodExercise

- [x] Crear `WodExercise`.
- [x] Mapear tabla `wod_exercises`.
- [x] Mapear `id`.
- [x] Mapear `wod_id`.
- [x] Mapear `exercise_id`.
- [x] Mapear `reps`.
- [x] Mapear `position`.
- [x] Respetar nulabilidad.
- [x] Respetar AUTO_INCREMENT.
- [x] No modificar esquema.

---

## T5 — Crear WodExerciseRepository

- [x] Crear repository.
- [x] Implementar consulta por WOD.
- [x] Ordenar por `position ASC`.
- [x] Evitar queries redundantes.
- [x] Evitar N+1 cuando corresponda.
- [x] No implementar operaciones funcionales de escritura.

---

## T6 — Crear DTO WodExerciseResponse

- [x] Crear DTO específico.
- [x] Incluir exercise id.
- [x] Incluir name.
- [x] Incluir category.
- [x] Incluir measurementType.
- [x] Incluir reps.
- [x] Incluir position.
- [x] No exponer entidades JPA.

---

## T7 — Ampliar WodDetailResponse

- [x] Añadir `exercises`.
- [x] Utilizar colección de `WodExerciseResponse`.
- [x] Garantizar array vacío para WOD sin ejercicios.
- [x] Evitar `null`.
- [x] Mantener campos existentes de Spec 014.

---

## T8 — Integrar asociaciones en WodService

- [x] Mantener búsqueda existente del WOD.
- [x] Consultar asociaciones.
- [x] Transformar asociaciones a DTO.
- [x] Mantener orden por position.
- [x] Incluir reps.
- [x] Incluir información de Exercise.
- [x] Construir detalle completo.
- [x] No introducir lógica HTTP.

---

## T9 — Mantener comportamiento de WodController

- [x] Verificar `GET /api/wods/{id}`.
- [x] Mantener ruta existente.
- [x] Mantener delegación al service.
- [x] No añadir endpoint innecesario.
- [x] Modificar Controller solo si es técnicamente necesario.

---

## T10 — WOD sin ejercicios

- [x] Verificar comportamiento cuando no existen asociaciones.
- [x] Devolver `200 OK`.
- [x] Devolver `exercises: []`.
- [x] No devolver `null`.
- [x] No lanzar 404.

---

## T11 — WOD inexistente

- [x] Mantener `WodNotFoundException`.
- [x] Mantener `404 Not Found`.
- [x] Evitar consultas innecesarias de asociaciones.
- [x] Mantener formato global de errores.

---

## T12 — Verificar catálogo

- [x] Confirmar `GET /api/wods`.
- [x] Confirmar filtros por name.
- [x] Confirmar filtros por type.
- [x] Confirmar filtros por level.
- [x] Confirmar filtros combinados.
- [x] Confirmar que catálogo no incluye innecesariamente asociaciones completas.

---

## T13 — Verificar Exercise API

- [x] Ejecutar tests existentes de Exercise.
- [ ] Confirmar que CRUD existente sigue funcionando.
- [x] Confirmar que contrato REST no cambia.
- [x] Confirmar que no se introdujeron ciclos de serialización.

---

## T14 — Tests de WodService

- [x] Test detalle con ejercicios.
- [x] Test múltiples ejercicios.
- [x] Test orden por position.
- [x] Test reps con valor.
- [x] Test reps null.
- [x] Test WOD sin ejercicios.
- [x] Test WOD inexistente.
- [x] Test transformación a DTO.
- [x] Test ausencia de duplicados cuando corresponda.
- [x] Evitar duplicar cobertura de Spec 014.

---

## T15 — Tests HTTP

- [x] Test detalle contiene `exercises`.
- [x] Test estructura de ejercicio.
- [x] Test `id`.
- [x] Test `name`.
- [x] Test `category`.
- [x] Test `measurementType`.
- [x] Test `reps`.
- [x] Test `position`.
- [x] Test orden.
- [x] Test array vacío.
- [x] Test WOD inexistente → 404.
- [x] Reutilizar cobertura JWT existente.

---

## T16 — Evaluar test de persistencia

- [x] Revisar complejidad de query.
- [x] Determinar si un test de repository aporta valor.
- [x] Si aporta valor, probar orden real.
- [x] Si se usa fetch join, verificar resultado.
- [x] No añadir infraestructura innecesaria.

---

## T17 — Verificar seguridad

- [x] Confirmar que detalle continúa protegido.
- [x] Confirmar sin JWT → 401 mediante cobertura existente o nueva.
- [x] Confirmar JWT válido → acceso.
- [x] No modificar `SecurityConfig`.

---

## T18 — Ejecutar Maven

Desde `backend/`:

- [x] Ejecutar `./mvnw validate`.
- [x] Confirmar BUILD SUCCESS.
- [x] Ejecutar `./mvnw test`.
- [x] Confirmar 0 failures.
- [x] Confirmar 0 errors.
- [x] Ejecutar `./mvnw package`.
- [x] Confirmar BUILD SUCCESS.

---

## T19 — Verificación HTTP real

Con MySQL y backend activos:

- [x] Obtener JWT válido.
- [x] Seleccionar WOD real con varias asociaciones.
- [x] Ejecutar `GET /api/wods/{id}`.
- [x] Confirmar `200`.
- [x] Confirmar ejercicios.
- [x] Confirmar nombres.
- [x] Confirmar reps.
- [x] Confirmar position.
- [x] Confirmar orden.
- [x] Verificar WOD sin ejercicios si existe.
- [x] Confirmar WOD inexistente → 404.

---

## T20 — Verificar MySQL intacto

Usando wodsql:

- [x] Confirmar `wod_exercises`.
- [x] Confirmar columnas.
- [x] Confirmar PK.
- [x] Confirmar FKs.
- [x] Confirmar ON DELETE.
- [x] Confirmar asociaciones existentes.
- [x] Confirmar que no se alteraron datos.
- [x] Confirmar que no hubo cambios de esquema.

---

## T21 — Revisar alcance

Confirmar que NO se implementó:

- [x] POST de asociaciones.
- [x] PUT de asociaciones.
- [x] DELETE de asociaciones.
- [x] POST de WOD.
- [x] PUT de WOD.
- [x] DELETE de WOD.
- [x] Resultados.
- [x] Historial.
- [x] Estadísticas.
- [x] Frontend.
- [x] Roles.
- [x] Cambios JWT.
- [x] Cambios de autenticación.
- [x] Cambios de esquema MySQL.

---

## T22 — Revisión Git

- [x] Ejecutar `git status`.
- [x] Ejecutar `git diff`.
- [x] Confirmar que los cambios pertenecen a Spec 015.
- [x] Confirmar que `.env` no está incluido.
- [x] Confirmar que no hay secretos.
- [x] Confirmar que no hay tokens.
- [x] Confirmar que no se incluyeron specs futuras.
- [x] No utilizar `git add .`.

---

## T23 — Finalización

- [x] Actualizar `tasks.md`.
- [x] Marcar únicamente tareas realmente verificadas.
- [x] Documentar archivos creados.
- [x] Documentar archivos modificados.
- [x] Documentar estrategia JPA.
- [x] Documentar estrategia de carga.
- [x] Documentar DTO final.
- [x] Documentar tests añadidos/modificados.
- [x] Documentar número total de tests.
- [x] Confirmar validate/test/package.
- [x] Confirmar pruebas HTTP.
- [x] Confirmar MySQL intacto.
- [x] Preparar resumen para Issue #15.
- [x] Mantener Issue #15 abierta hasta revisión final.
- [x] No hacer commit.
- [x] No hacer push.
- [x] No hacer merge.
