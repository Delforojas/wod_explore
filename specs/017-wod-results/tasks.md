# Tasks ejecutadas - Issue #17

## Preparación y auditoría

- [x] Consultar la Issue #17 y sus criterios de aceptación.
- [x] Leer las decisiones contractuales de la Issue #16.
- [x] Confirmar el esquema existente de `wod_results`.
- [x] Confirmar las relaciones con `users` y `wods`.
- [x] Confirmar los enums `WodType` y `WodLevel` existentes.
- [x] Revisar la autenticación JWT y la protección de `/api/**`.
- [x] Revisar los controllers, services, repositories y DTOs existentes.
- [x] Mantener el alcance limitado a resultados de WOD.

## Persistencia

- [x] Crear la entidad JPA `WodResult`.
- [x] Mapear `wod_results.id` con `GenerationType.IDENTITY`.
- [x] Mapear la relación obligatoria con `User`.
- [x] Mapear la relación obligatoria con `Wod`.
- [x] Mapear `time_seconds`, `rounds`, `reps`, `level` y `completed_at`.
- [x] Mantener relaciones lazy.
- [x] No añadir cascadas JPA de escritura.
- [x] Crear `WodResultRepository`.
- [x] Añadir consulta filtrada por usuario y WOD.
- [x] Añadir orden `completedAt DESC, id DESC`.
- [x] No modificar tablas, columnas, índices ni foreign keys.

## DTO y API

- [x] Crear `WodResultRequest` como DTO de request.
- [x] Crear `WodResultResponse` como DTO de response.
- [x] Definir `POST /api/wods/{wodId}/results`.
- [x] Definir `GET /api/wods/{wodId}/results`.
- [x] Devolver `201 Created` en creación.
- [x] Devolver `200 OK` en consulta.
- [x] No exponer `userId` en request ni response.
- [x] Rechazar propiedades JSON desconocidas.
- [x] Devolver lista vacía cuando no haya resultados propios.

## Identidad y seguridad

- [x] Obtener el principal desde `Authentication` del request.
- [x] Normalizar el email del subject JWT.
- [x] Resolver el usuario mediante `UserRepository`.
- [x] Asociar la creación al usuario resuelto, no a datos del cliente.
- [x] Filtrar la consulta por el usuario autenticado.
- [x] Responder `401` si el usuario del JWT no existe.
- [x] Mantener la protección global existente de `/api/**`.
- [x] Verificar acceso sin JWT.
- [x] Verificar acceso con JWT válido.

## Reglas de negocio

- [x] Validar `timeSeconds` como positivo cuando se envía.
- [x] Validar `rounds` como no negativo cuando se envía.
- [x] Validar `reps` como no negativo cuando se envía.
- [x] Validar `level` como obligatorio.
- [x] Validar `FOR_TIME` con `timeSeconds` obligatorio.
- [x] Rechazar `rounds` y `reps` para `FOR_TIME`.
- [x] Validar `AMRAP` con `rounds` y `reps` obligatorios.
- [x] Rechazar `timeSeconds` para `AMRAP`.
- [x] Validar `EMOM` con `reps` obligatorio.
- [x] Rechazar `timeSeconds` y `rounds` para `EMOM`.
- [x] Asignar la fecha actual si falta `completedAt`.
- [x] Rechazar `completedAt` futuro.
- [x] Permitir múltiples resultados del mismo usuario y WOD.

## Errores

- [x] Mantener el error JSON de autenticación existente.
- [x] Añadir error JSON para usuario autenticado no resoluble.
- [x] Añadir error JSON para reglas de resultado inválidas.
- [x] Reutilizar `WodNotFoundException` para WOD inexistente.
- [x] Mantener `400` para Bean Validation.
- [x] Mantener `400` para JSON ilegible, enums, fechas y campos desconocidos.
- [x] Mantener una estructura global mediante `GlobalExceptionHandler`.

## Testing

- [x] Crear tests unitarios de `WodResultService`.
- [x] Cubrir creación `FOR_TIME`.
- [x] Cubrir creación `AMRAP`.
- [x] Cubrir creación `EMOM`.
- [x] Cubrir métricas inválidas.
- [x] Cubrir fecha futura.
- [x] Cubrir usuario autenticado inexistente.
- [x] Cubrir consulta filtrada por usuario y WOD.
- [x] Crear tests HTTP de `WodResultController`.
- [x] Cubrir respuesta de creación.
- [x] Cubrir payload con `userId`.
- [x] Cubrir nivel ausente.
- [x] Cubrir WOD inexistente.
- [x] Ampliar tests HTTP de seguridad.
- [x] Crear test de persistencia del repositorio contra MySQL.
- [x] Verificar rollback del test de persistencia.
- [x] Hacer autocontenido el test de contexto con propiedades JWT de prueba.

## Verificación final

- [x] Ejecutar `./mvnw test`.
- [x] Ejecutar `./mvnw validate`.
- [x] Ejecutar `./mvnw package`.
- [x] Confirmar 83 tests correctos.
- [x] Confirmar que no se modificó el esquema MySQL.
- [x] Confirmar que no se modificó el frontend.
- [x] Confirmar que no se implementó funcionalidad fuera de la Issue #17.
