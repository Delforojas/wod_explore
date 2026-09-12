# SDD - Issue #18: Registrar y consultar resultados de ejercicios

## Estado

Issue #18 implementada y validada sobre la rama `feat/018-exercise-results`.

Esta spec concreta la implementación de la Issue #18 sobre el contrato definido
en la Spec 016. El esquema MySQL existente es suficiente y no se modificará.

## Objetivo

Permitir que un usuario autenticado:

- registre una marca de un ejercicio existente;
- consulte únicamente sus marcas del ejercicio solicitado;
- consulte su mejor marca para un `recordType` concreto cuando el tipo de
  medición del ejercicio lo permita;
- no pueda elegir ni manipular el usuario propietario mediante el request.

## Dependencias y alcance

- Issue #15: catálogo de ejercicios.
- Issue #16: contrato de resultados de usuario.
- Issue #17: patrón implementado para resultados de WOD.

Se implementan únicamente creación, consulta de colección y consulta de mejor
marca. Quedan fuera edición, eliminación, rankings, estadísticas globales,
frontend, migración de `localStorage` y cambios de autenticación.

## Reglas funcionales

### Identidad

Todas las rutas requieren un JWT válido. El controller obtiene el subject de
`Authentication`; el servicio lo normaliza y resuelve mediante
`UserRepository`. El body y la URL no aceptan `userId`.

Un subject válido cuyo usuario no exista produce `401 Unauthorized`. Todas las
consultas filtran por el `id` de ese usuario.

### Compatibilidad con `measurement_type`

La unidad y el tipo de marca se validan en el servicio contra el
`Exercise.measurementType` cargado desde persistencia:

| `measurementType` | `recordType` permitido | `unit` |
| --- | --- | --- |
| `WEIGHT` | `1RM`, `3RM`, `5RM`, `10RM` | `KG` |
| `REPS` | `MAX_REPS` | `REPS` |
| `TIME` | `BEST_TIME` | `SECONDS` |
| `DISTANCE` | ninguno en el contrato actual | ninguno |
| `WEIGHT_DISTANCE` | ninguno en el contrato actual | ninguno |
| `OTHER` | ninguno en el contrato actual | ninguno |

Aunque `METERS` existe en MySQL, la Spec 016 reserva esa unidad porque no hay
un `recordType` compatible. Los tipos sin combinación definida se rechazan con
`400 Bad Request`; no se amplía el contrato para inventar semántica.

`value` debe ser positivo, tener como máximo dos decimales y caber en
`DECIMAL(8,2)`. Para `REPS` debe ser entero positivo. `performedAt` es
opcional, usa el `Clock` configurado cuando falta y no puede ser futuro.

## API

### Registrar una marca

```http
POST /api/exercises/{exerciseId}/results
```

Request:

```json
{
  "value": 100.00,
  "unit": "KG",
  "recordType": "1RM",
  "performedAt": "2026-09-12T18:30:00"
}
```

Una petición válida responde `201 Created` con un `ExerciseResultResponse` sin
`userId`.

### Consultar marcas propias

```http
GET /api/exercises/{exerciseId}/results
```

Devuelve `200 OK` con la lista del usuario autenticado para el ejercicio del
path, ordenada por `performedAt DESC, id DESC`. Sin marcas devuelve `[]`.

### Consultar mejor marca

```http
GET /api/exercises/{exerciseId}/results/best?recordType=1RM
```

`recordType` es obligatorio y usa los valores del contrato (`1RM`, `3RM`,
`5RM`, `10RM`, `MAX_REPS`, `BEST_TIME`). La consulta se limita al usuario y al
ejercicio autenticados:

- `KG` y `REPS`: mayor `value` es mejor;
- `SECONDS`: menor `value` es mejor;
- en empate, se prefiere `performedAt DESC` y después `id DESC`.

La respuesta es el mismo `ExerciseResultResponse` y responde `200 OK`. Si el
ejercicio o la marca solicitada no existe, responde `404`. Un `recordType`
inválido o incompatible responde `400`. Los distintos `recordType` no se
comparan entre sí.

## Errores

- `400 Bad Request`: JSON inválido, enum inválido, campos desconocidos,
  `value` inválido, unidad/tipo incompatibles, medición incompatible o fecha
  futura.
- `401 Unauthorized`: JWT ausente, inválido, expirado o usuario no resoluble.
- `404 Not Found`: ejercicio inexistente o mejor marca inexistente.
- `201 Created`: creación correcta.
- `200 OK`: consultas correctas.

Se reutiliza la estructura de `GlobalExceptionHandler`. No se usa `409` para
marcas repetidas: un usuario puede registrar varias marcas del mismo ejercicio
y `recordType`.

## Persistencia

La entidad `ExerciseResult` se mapea a `exercise_results` existente:

| Propiedad Java | Columna MySQL | Tipo Java |
| --- | --- | --- |
| `id` | `id` | `Integer` |
| `user` | `user_id` | `User` lazy |
| `exercise` | `exercise_id` | `Exercise` lazy |
| `value` | `value` | `BigDecimal` |
| `unit` | `unit` | enum/string |
| `recordType` | `record_type` | enum con conversión a valores `1RM`, etc. |
| `performedAt` | `performed_at` | `LocalDateTime` |

El ID usa `GenerationType.IDENTITY`, no se añaden cascadas JPA de escritura y
se mantiene `ddl-auto=none`. El repositorio filtra por usuario, ejercicio y
tipo de marca en todas las consultas de mejor marca.

## Criterios de aceptación

- [x] Un usuario autenticado puede crear una marca válida.
- [x] La marca queda asociada al usuario autenticado y al ejercicio existente.
- [x] Un usuario solo consulta sus propias marcas.
- [x] El body no acepta `userId` ni `exerciseId`.
- [x] Se respeta `measurement_type` y la matriz de compatibilidad.
- [x] `value`, fechas y enums se validan con errores `400` consistentes.
- [x] Se puede obtener la mejor marca por `recordType` compatible.
- [x] Ejercicios y mejores marcas inexistentes responden `404`.
- [x] El esquema MySQL no cambia.
- [x] Se cubren servicio, controller, seguridad y repositorio.
