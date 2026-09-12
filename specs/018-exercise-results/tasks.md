# Tasks ejecutadas - Issue #18: Resultados de ejercicios

## Preparación

- [x] Consultar la Issue #18 y sus criterios de aceptación.
- [x] Leer la Spec 016 y confirmar el esquema `exercise_results` con `wodsql`.
- [x] Revisar `Exercise`, `MeasurementType` y el patrón `WodResult`.
- [x] Resolver el alcance de la mejor marca por `recordType`.
- [x] Mantener fuera de alcance `METERS` y tipos de medición sin contrato.

## Persistencia

- [x] Crear entidad `ExerciseResult`.
- [x] Crear enums de unidad y tipo de marca.
- [x] Añadir converter JPA para `record_type`.
- [x] Mapear relaciones lazy e identidad del esquema existente.
- [x] Crear `ExerciseResultRepository`.
- [x] Añadir consulta de colección filtrada por usuario y ejercicio.
- [x] Añadir consultas de mejor marca ascendente y descendente.
- [x] No modificar SQL, tablas, columnas, índices ni foreign keys.

## DTO y API

- [x] Crear `ExerciseResultRequest` con validación declarativa.
- [x] Crear `ExerciseResultResponse` sin `userId`.
- [x] Implementar `POST /api/exercises/{exerciseId}/results`.
- [x] Implementar `GET /api/exercises/{exerciseId}/results`.
- [x] Implementar `GET /api/exercises/{exerciseId}/results/best`.
- [x] Rechazar propiedades JSON desconocidas.
- [x] Mantener `201` en creación y `200` en consultas.

## Identidad y reglas de negocio

- [x] Resolver el usuario exclusivamente desde `Authentication` y
  `UserRepository`.
- [x] Resolver el ejercicio desde el path y `ExerciseRepository`.
- [x] Validar la matriz `measurementType`/`recordType`/`unit`.
- [x] Validar `value` positivo, escala máxima y enteros para `REPS`.
- [x] Asignar fecha mediante `Clock` cuando falte.
- [x] Rechazar fechas futuras.
- [x] Seleccionar mejor valor según unidad y mantener separado cada
  `recordType`.

## Errores

- [x] Añadir excepción para marca inválida.
- [x] Añadir excepción para mejor marca inexistente.
- [x] Integrar errores `400` y `404` en `GlobalExceptionHandler`.
- [x] Mantener `401` para usuario JWT no resoluble.

## Testing

- [x] Crear tests unitarios de `ExerciseResultService`.
- [x] Cubrir creación válida por `WEIGHT`, `REPS` y `TIME`.
- [x] Cubrir incompatibilidades de medición, unidad y record type.
- [x] Cubrir escala, positividad, enteros y fecha futura.
- [x] Cubrir colección filtrada por usuario y ejercicio.
- [x] Cubrir mejor valor máximo, mínimo, empates y record types separados.
- [x] Crear tests HTTP del controller.
- [x] Cubrir `userId`/`exerciseId` desconocidos y estados HTTP.
- [x] Ampliar tests HTTP de seguridad.
- [x] Crear test de repositorio contra MySQL configurado.

## Verificación final

- [x] Ejecutar `./mvnw validate`.
- [x] Ejecutar `./mvnw test`.
- [x] Ejecutar `./mvnw package`.
- [x] Revisar diff y confirmar que no se modificó el esquema ni frontend.
- [x] Actualizar esta documentación con el resultado real.
