# Plan ejecutado - Issue #18: Resultados de ejercicios

## Enfoque

Implementar el flujo existente del backend:

```text
Controller -> Service -> Repository -> MySQL
```

La implementación sigue el patrón de `WodResult`, pero mantiene DTOs, entidad,
validación y repositorio específicos para ejercicios. No se hizo un refactor
transversal porque no era necesario para esta issue.

## Persistencia

1. Se creó `ExerciseResult` con relaciones lazy a `User` y `Exercise`.
2. Se crearon los enums `ExerciseResultUnit` y `ExerciseRecordType`.
3. Los valores públicos del record type se serializan como `1RM`, `3RM`, `5RM`,
   `10RM`, `MAX_REPS` y `BEST_TIME`.
4. Se añadió un converter JPA para traducir los nombres Java a los valores del
   enum MySQL de `record_type`.
5. Se creó `ExerciseResultRepository` con consulta de colección y consultas de
   mejor valor ascendente/descendente.

## Servicio y API

1. Se crearon request/response DTOs con Jakarta Validation y formato temporal
   `yyyy-MM-dd'T'HH:mm:ss`.
2. Se implementaron `POST` y `GET` sobre
   `/api/exercises/{exerciseId}/results`.
3. Se implementó `GET .../results/best?recordType=...`.
4. El servicio resuelve usuario y ejercicio antes de crear o consultar.
5. Se valida compatibilidad con `Exercise.measurementType`, incluyendo el
   rechazo explícito de combinaciones no definidas por la Spec 016.
6. `performedAt` se resuelve con `Clock` y se rechazan fechas futuras.
7. Se añadieron errores específicos para marca inválida y marca no encontrada.

## Verificación ejecutada

- Tests unitarios del servicio para identidad, validación, fechas, creación,
  colección y mejor marca.
- `@WebMvcTest` para payloads, estados HTTP, response y query parameter.
- Tests de seguridad para ausencia de JWT y usuario autenticado.
- `@DataJpaTest` para filtros, orden y selección de mejor valor en MySQL.
- Ejecutados desde `backend/`: `./mvnw validate`, `./mvnw test` y
  `./mvnw package`.
- Resultado: 103 tests correctos; `validate` y `package` correctos.
- No se modificó SQL ni el esquema.
