# SDD - Issue #17: Registrar y consultar resultados de WODs

## Estado

Issue #17 implementada y validada en la rama `feat/017-wod-results`.

Este documento reconstruye el comportamiento realmente implementado a partir de:

- la Issue #17 de GitHub;
- las decisiones contractuales de la Issue #16;
- el código actual del backend;
- los tests actuales relacionados con `WodResult`.

No define funcionalidad futura que no exista en el código.

## Objetivo

Permitir que un usuario autenticado:

- registre un resultado de un WOD existente;
- consulte sus propios resultados para un WOD;
- no pueda elegir ni manipular el usuario propietario mediante el request.

## Dependencias

- Issue #14: catálogo y detalle de WODs.
- Issue #16: contrato de resultados del usuario.

## Alcance implementado

La implementación cubre únicamente resultados de WOD persistidos en
`wod_results`:

- creación de un resultado;
- consulta de resultados propios asociados a un WOD;
- asociación con un `User` autenticado;
- asociación con un `Wod` existente;
- validación según `WodType`;
- errores HTTP para autenticación, validación y WOD inexistente.

No se implementaron resultados de ejercicios, rankings, estadísticas, marcas
personales, edición, eliminación, consulta por ID de resultado, paginación ni
cambios de frontend.

## Modelo persistido

La entidad `WodResult` se mapea a `wod_results` sin modificar el esquema existente.

| Propiedad Java | Columna MySQL | Tipo Java | Obligatoria |
| --- | --- | --- | --- |
| `id` | `id` | `Integer` | generada |
| `user` | `user_id` | `User` lazy | sí |
| `wod` | `wod_id` | `Wod` lazy | sí |
| `timeSeconds` | `time_seconds` | `Integer` | según tipo |
| `rounds` | `rounds` | `Integer` | según tipo |
| `reps` | `reps` | `Integer` | según tipo |
| `level` | `level` | `WodLevel` | sí |
| `completedAt` | `completed_at` | `LocalDateTime` | sí |

El ID utiliza `GenerationType.IDENTITY`. Las relaciones `User` y `Wod` son
`ManyToOne` con carga `LAZY`. Los enums se persisten como texto.

El esquema actual contiene las foreign keys y los índices de `user_id` y
`wod_id`; no se añadió SQL, tabla, columna ni constraint.

## Identidad y seguridad

Todas las rutas `/api/**` requieren autenticación según `SecurityConfig`.

El controller recibe `Authentication` y pasa su nombre al servicio. El servicio:

1. recorta y normaliza el email a minúsculas con `Locale.ROOT`;
2. busca el usuario mediante `UserRepository.findByEmail`;
3. utiliza el `User` resuelto al crear o consultar resultados.

El request no contiene `userId`, y el `userId` no se obtiene de ninguna entrada
del cliente. Un usuario no existente para un JWT válido produce
`401 Unauthorized` con `error: UNAUTHORIZED`.

La autenticación sin JWT, con JWT expirado o con JWT inválido es rechazada por la
cadena de seguridad antes de invocar al controller.

## API implementada

### Registrar resultado

```http
POST /api/wods/{wodId}/results
```

Requiere un Bearer JWT válido.

#### Request

```json
{
  "timeSeconds": 342,
  "rounds": null,
  "reps": null,
  "level": "RX",
  "completedAt": "2026-09-12T18:30:00"
}
```

El DTO `WodResultRequest` es un `record` con estos campos:

- `timeSeconds`: `Integer`; debe ser positivo cuando se utilice.
- `rounds`: `Integer`; debe ser cero o positivo cuando se utilice.
- `reps`: `Integer`; debe ser cero o positivo cuando se utilice.
- `level`: obligatorio; valores `BEGINNER`, `INTERMEDIATE` o `RX`.
- `completedAt`: opcional; formato `yyyy-MM-dd'T'HH:mm:ss`.

No se aceptan propiedades JSON desconocidas. La configuración
`spring.jackson.deserialization.fail-on-unknown-properties=true` hace que un
campo como `userId` produzca `400 Bad Request`.

#### Validación por tipo de WOD

El servicio carga el `Wod` del path y valida su tipo:

- `FOR_TIME`: `timeSeconds` es obligatorio; `rounds` y `reps` deben ser nulos.
- `AMRAP`: `rounds` y `reps` son obligatorios; `timeSeconds` debe ser nulo.
- `EMOM`: `reps` es obligatorio; `timeSeconds` y `rounds` deben ser nulos.

Las constraints Jakarta Validation se aplican antes de la lógica de servicio:

- `@Positive` para `timeSeconds`;
- `@PositiveOrZero` para `rounds` y `reps`;
- `@NotNull` para `level`.

Las reglas que dependen del tipo del WOD se aplican en `WodResultService`.

#### Fecha

Si `completedAt` se omite, el servicio utiliza `LocalDateTime.now(clock)` con
el bean `Clock` configurado en UTC y truncado a segundos.

Si se proporciona, no puede ser posterior al instante actual del reloj. Las fechas
futuras se rechazan.

#### Response

Una creación válida devuelve `201 Created` con `WodResultResponse`:

```json
{
  "id": 42,
  "wodId": 20,
  "timeSeconds": 342,
  "rounds": null,
  "reps": null,
  "level": "RX",
  "completedAt": "2026-09-12T18:30:00"
}
```

La respuesta no contiene `userId`.

### Consultar resultados propios

```http
GET /api/wods/{wodId}/results
```

Requiere un Bearer JWT válido. Devuelve una lista JSON de
`WodResultResponse` perteneciente al usuario autenticado y al WOD del path.

Ejemplo:

```json
[
  {
    "id": 42,
    "wodId": 20,
    "timeSeconds": 342,
    "rounds": null,
    "reps": null,
    "level": "RX",
    "completedAt": "2026-09-12T18:30:00"
  }
]
```

La consulta JPA utilizada es:

```text
findByUser_IdAndWod_IdOrderByCompletedAtDescIdDesc(userId, wodId)
```

Por tanto, los resultados se filtran por ambos propietarios de la relación y se
ordenan por `completedAt DESC` y después por `id DESC`.

Una consulta sin resultados devuelve `200 OK` con `[]`.

## Errores implementados

### `401 Unauthorized`

Sin autenticación válida, la entrada de seguridad responde:

```json
{
  "error": "UNAUTHORIZED",
  "message": "Autenticación requerida"
}
```

Si el JWT es válido pero el email no corresponde a un usuario persistido, el
servicio responde mediante el manejador global:

```json
{
  "error": "UNAUTHORIZED",
  "message": "El usuario autenticado no existe"
}
```

### `400 Bad Request`

Los errores de Bean Validation, JSON ilegible, enums/formato inválidos y campos
desconocidos usan:

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Datos inválidos",
  "details": {}
}
```

Las reglas de negocio inválidas incluyen sus detalles bajo `details.result`.

### `404 Not Found`

Si el `wodId` no existe, el servicio lanza `WodNotFoundException` y la respuesta
es:

```json
{
  "status": 404,
  "message": "WOD no encontrado con id: 999"
}
```

## Persistencia y transacciones

- `WodResultService.create` es `@Transactional`.
- `WodResultService.findOwnResults` es `@Transactional(readOnly = true)`.
- La creación usa `WodResultRepository.save`.
- La consulta usa un método derivado de Spring Data JPA con filtros de usuario y
  WOD.
- Se permiten múltiples resultados para el mismo usuario y WOD; no existe una
  constraint de unicidad para impedirlos.
- Las foreign keys existentes mantienen la integridad referencial.
- No se modificó `ddl-auto=none` ni el esquema MySQL.

## Relación con el historial frontend legacy

El contrato implementado no utiliza los campos textuales `result` ni `notes` del
historial local descrito en la Spec 003. Esos datos no se convierten ni se
persisten automáticamente en `wod_results`.

## Criterios de aceptación

- [x] Un usuario autenticado puede registrar un resultado válido.
- [x] El resultado queda asociado al usuario autenticado correcto.
- [x] Un usuario consulta únicamente sus resultados para el WOD solicitado.
- [x] Un `userId` del request no puede modificar el propietario.
- [x] Un WOD inexistente devuelve `404`.
- [x] Los datos inválidos devuelven `400` con estructura consistente.
- [x] La implementación respeta `wod_results` sin cambios de esquema.
- [x] `./mvnw test` pasa.
- [x] `./mvnw package` pasa.
