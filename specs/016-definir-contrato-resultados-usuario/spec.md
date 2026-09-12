# Spec 016 - Contrato de resultados de usuario

## Estado y alcance

Esta spec define el contrato funcional y técnico para resultados de WODs y
ejercicios antes de implementar sus endpoints.

Esta issue es de diseño. No implementa entidades, endpoints, DTOs, migraciones ni
operaciones de escritura.

El contrato definido aquí será la referencia para las siguientes issues de
resultados, especialmente #17 y #18.

## Contexto

El backend utiliza Spring Boot, Spring Data JPA, MySQL 8.4 y autenticación JWT.
Las tablas `wod_results` y `exercise_results` ya existen.

La Spec 003 describe un historial frontend almacenado en `localStorage`, sin
backend ni usuarios, y permite un resultado textual y notas. Ese modelo no es el
contrato de resultados persistidos del backend. La API backend utilizará métricas
estructuradas y el usuario autenticado.

## Auditoría MySQL

La inspección read-only de la base `wod_explorer` confirmó:

- `wod_results` tiene 0 registros.
- `exercise_results` tiene 0 registros.
- Ambas tablas usan `id INT AUTO_INCREMENT PRIMARY KEY`.
- Ambas tablas tienen índices independientes para `user_id` y la entidad
  relacionada.
- Las relaciones `user_id` usan `ON DELETE CASCADE`.
- La relación de `wod_results.wod_id` usa `ON DELETE CASCADE`.
- La relación de `exercise_results.exercise_id` usa `ON DELETE CASCADE`.
- No existen datos actuales que requieran migración.

### Tabla `wod_results`

| Columna | Tipo | Nulabilidad | Semántica |
| --- | --- | --- | --- |
| `id` | `INT` | `NOT NULL` | Identificador del resultado |
| `user_id` | `INT` | `NOT NULL` | Usuario propietario |
| `wod_id` | `INT` | `NOT NULL` | WOD realizado |
| `time_seconds` | `INT` | `NULL` | Tiempo empleado |
| `rounds` | `INT` | `NULL` | Rondas completadas |
| `reps` | `INT` | `NULL` | Repeticiones adicionales o puntuación |
| `level` | `ENUM` | `NOT NULL` | Nivel realizado |
| `completed_at` | `DATETIME` | `NOT NULL` | Fecha y hora de realización |

### Tabla `exercise_results`

| Columna | Tipo | Nulabilidad | Semántica |
| --- | --- | --- | --- |
| `id` | `INT` | `NOT NULL` | Identificador de la marca |
| `user_id` | `INT` | `NOT NULL` | Usuario propietario |
| `exercise_id` | `INT` | `NOT NULL` | Ejercicio medido |
| `value` | `DECIMAL(8,2)` | `NOT NULL` | Valor de la marca |
| `unit` | `ENUM` | `NOT NULL` | Unidad del valor |
| `record_type` | `ENUM` | `NOT NULL` | Tipo de marca |
| `performed_at` | `DATETIME` | `NOT NULL` | Fecha y hora de realización |

## Decisiones de contrato

### Identidad del usuario

El cliente nunca enviará `userId` en la URL ni en el body.

El usuario se obtendrá del `SecurityContext`:

1. Spring Security valida el JWT.
2. El subject del JWT se interpreta como el email normalizado del usuario.
3. El servicio resuelve ese email mediante `UserRepository`.
4. El `id` resuelto se utiliza para persistir y consultar resultados.

Un JWT válido cuyo usuario ya no exista no permite crear ni consultar resultados
y debe producir `401 Unauthorized` en el flujo de resultados. No se confiará en
identificadores enviados por el cliente.

### Fechas

`completedAt` y `performedAt` se representan en JSON como:

```text
YYYY-MM-DDTHH:mm:ss
```

El backend los tratará como `LocalDateTime`, siguiendo la convención actual del
proyecto y el tipo `DATETIME` de MySQL.

En requests son opcionales. Si se omiten, el servicio utilizará la fecha y hora
actuales mediante un reloj inyectable para permitir tests deterministas.

No se aceptarán fechas futuras. Las fechas inválidas o con formato incorrecto
producirán `400 Bad Request`.

### Errores HTTP

- `400 Bad Request`: JSON inválido, enum inválido, métrica ausente, métrica
  incompatible o fecha inválida/futura.
- `401 Unauthorized`: JWT ausente, inválido, expirado o sin usuario resoluble.
- `404 Not Found`: WOD o Exercise del path inexistente.
- `200 OK`: lecturas correctas.
- `201 Created`: creación correcta en las futuras issues de implementación.

No se utilizará `409 Conflict` para resultados repetidos. Un usuario puede
registrar varias realizaciones del mismo WOD o varias marcas del mismo ejercicio.

## Contrato de resultados de WOD

### Recurso

El recurso futuro será:

```text
/api/wods/{wodId}/results
```

El `wodId` se obtiene exclusivamente del path. El tipo del WOD se obtiene desde
la entidad `Wod`, no desde el body.

### Request

El contrato conceptual es:

```json
{
  "timeSeconds": 342,
  "rounds": null,
  "reps": null,
  "level": "RX",
  "completedAt": "2026-09-12T18:30:00"
}
```

Campos:

- `timeSeconds`: entero positivo cuando el tipo de WOD sea `FOR_TIME`.
- `rounds`: entero no negativo cuando el tipo de WOD sea `AMRAP`.
- `reps`: entero no negativo cuando el tipo de WOD sea `AMRAP` o `EMOM`, según
  las reglas específicas del tipo.
- `level`: obligatorio; uno de `BEGINNER`, `INTERMEDIATE` o `RX`.
- `completedAt`: opcional; fecha de realización no futura.

No se aceptan `id`, `userId` ni `wodId` dentro del body.

### Validación por tipo de WOD

La validación se realizará después de cargar el WOD:

- `FOR_TIME`: `timeSeconds` obligatorio y positivo; `rounds` y `reps` deben ser
  `null`.
- `AMRAP`: `rounds` y `reps` obligatorios y no negativos; `timeSeconds` debe ser
  `null`.
- `EMOM`: `reps` obligatorio y no negativo; `timeSeconds` y `rounds` deben ser
  `null`. `reps` representa la puntuación total de repeticiones del EMOM.

El `level` describe el nivel realizado y no se rellenará automáticamente con el
nivel prescrito del WOD.

### Response

La respuesta conceptual es:

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

El response no incluye `userId`, porque el recurso está limitado al usuario
autenticado.

Las lecturas de colección se ordenarán por `completedAt DESC, id DESC`.

## Contrato de resultados de Exercise

### Recurso

El recurso futuro será:

```text
/api/exercises/{exerciseId}/results
```

El `exerciseId` se obtiene exclusivamente del path.

### Request

El contrato conceptual es:

```json
{
  "value": 100.00,
  "unit": "KG",
  "recordType": "1RM",
  "performedAt": "2026-09-12T18:30:00"
}
```

Campos:

- `value`: obligatorio, positivo, con como máximo dos decimales y dentro del
  límite de `DECIMAL(8,2)`.
- `unit`: obligatorio.
- `recordType`: obligatorio.
- `performedAt`: opcional; fecha de realización no futura.

No se aceptan `id`, `userId` ni `exerciseId` dentro del body.

### Compatibilidad entre unidad y tipo de marca

La aplicación impondrá las relaciones de dominio que el esquema no expresa:

| `recordType` | `unit` válida | Significado |
| --- | --- | --- |
| `1RM` | `KG` | Mejor repetición máxima |
| `3RM` | `KG` | Mejor marca de tres repeticiones |
| `5RM` | `KG` | Mejor marca de cinco repeticiones |
| `10RM` | `KG` | Mejor marca de diez repeticiones |
| `MAX_REPS` | `REPS` | Máximo de repeticiones |
| `BEST_TIME` | `SECONDS` | Mejor tiempo |

`METERS` existe en el enum MySQL, pero no tiene actualmente un `recordType`
compatible. No se aceptará hasta que una futura spec defina su semántica.

Cuando `unit` sea `REPS`, `value` deberá ser un número entero positivo. Para las
demás unidades se permitirá precisión de hasta dos decimales.

### Response

La respuesta conceptual es:

```json
{
  "id": 7,
  "exerciseId": 125,
  "value": 100.00,
  "unit": "KG",
  "recordType": "1RM",
  "performedAt": "2026-09-12T18:30:00"
}
```

El response no incluye `userId`.

Las lecturas de colección se ordenarán por `performedAt DESC, id DESC`.

## Persistencia y esquema

El esquema actual es suficiente para los contratos estructurados de esta spec.
No se requieren tablas, columnas, índices, constraints ni migraciones nuevas.

La base de datos no puede expresar por sí sola todas las reglas de negocio, por
ejemplo la relación entre tipo de WOD y métricas o entre `recordType` y `unit`.
Esas reglas deberán validarse en el servicio antes de guardar.

Las entidades futuras deberán respetar:

- `Integer` con `GenerationType.IDENTITY` para los IDs actuales.
- `ManyToOne` lazy hacia `User`, `Wod` y `Exercise` según corresponda.
- ausencia de cascadas de escritura no justificadas.
- `LocalDateTime` para las columnas `DATETIME` existentes.
- `ddl-auto=none`.

Las foreign keys con `ON DELETE CASCADE` son la política vigente y no deben
alterarse.

## Relación con la Spec 003

La Spec 003 seguirá siendo válida para el historial frontend local mientras ese
flujo no se migre.

Sus campos textuales `result` y `notes` no se traducen automáticamente a
`wod_results`, porque la tabla no tiene columnas equivalentes y hacerlo perdería
la semántica estructurada del backend.

Una migración del historial local a resultados autenticados requerirá una spec
posterior que defina conversión, notas y cualquier cambio de esquema. Esta Spec
016 no realiza esa migración.

## Fuera de alcance

- Implementar entidades JPA.
- Implementar controllers, services o repositories.
- Implementar POST, PUT o DELETE.
- Crear tablas o modificar el esquema MySQL.
- Migrar `localStorage`.
- Añadir notas o resultados textuales al esquema.
- Rankings, estadísticas, marcas personales o comparaciones.
- Cambiar JWT, autenticación o `SecurityConfig`.
- Cambiar el frontend.

## Criterios de aceptación

1. El contrato de resultados de WOD está definido.
2. El contrato de resultados de Exercise está definido.
3. Las métricas obligatorias por tipo de WOD están definidas.
4. La compatibilidad entre unidad y tipo de marca está definida.
5. La representación temporal está definida.
6. Las validaciones de dominio están definidas.
7. La identidad del usuario se obtiene exclusivamente desde JWT/SecurityContext.
8. Se prohíbe confiar en `userId` enviado por el cliente.
9. Se han resuelto las diferencias con la Spec 003.
10. Se ha confirmado que el esquema actual es suficiente.
11. Se han documentado las condiciones que requerirían una futura migración.
12. No se implementan endpoints ni cambios de esquema en esta issue.
