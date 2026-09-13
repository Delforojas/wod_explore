# SDD - Issue #20: Estadísticas y evolución personal

## Estado

Implementación completada y validada en la rama `feat/020-personal-statistics`.
La Issue permanece abierta hasta la validación manual y `/finish-issue 20`.
Commit de implementación: `eb21909063cb09238f3f24e0ad0025e5a248fea9`.

La funcionalidad depende de los resultados autenticados implementados en las
Issues #17 y #18 y del patrón de identidad de la Issue #19.

## Objetivo

Permitir que un usuario autenticado consulte estadísticas derivadas de sus
propios resultados sin duplicar ni persistir datos calculados.

## Alcance

Se implementan dos endpoints de solo lectura:

- `GET /api/users/me/statistics`: resumen de actividad y marcas personales.
- `GET /api/users/me/evolution`: evolución temporal de todos los intentos.

Ambos endpoints resuelven el usuario exclusivamente desde el subject del JWT.
No aceptan `userId`, filtros de otro usuario ni parámetros de identidad.

Quedan fuera de alcance la modificación de resultados, rankings, estadísticas
globales, paginación, filtros temporales, cambios de autenticación, frontend,
nuevas tablas, migraciones e índices de base de datos.

## Estadísticas y marcas personales

Una respuesta correcta de `/statistics` devuelve:

```json
{
  "wodResultsCount": 0,
  "exerciseResultsCount": 0,
  "wodPersonalRecords": [],
  "exercisePersonalRecords": []
}
```

`wodResultsCount` y `exerciseResultsCount` cuentan todos los resultados propios.
Las listas vacías y los contadores a cero representan la ausencia de resultados.

### Marcas de WOD

Se calcula una marca por combinación de `wodId` y `level` del resultado. El
`WodPersonalRecordResponse` incluye `resultId`, `wodId`, `wodName`, `wodType`,
`level`, las métricas (`timeSeconds`, `rounds`, `reps`) y `completedAt`.

La comparación depende de `wodType`:

- `FOR_TIME`: menor `timeSeconds`.
- `AMRAP`: mayor `rounds`; en empate, mayor `reps`.
- `EMOM`: mayor `reps`.

Los empates restantes se resuelven con `completedAt` más reciente y después
`id` mayor. Las marcas se ordenan de forma estable por `wodId` y `level`.

### Marcas de ejercicios

Se calcula una marca por combinación de `exerciseId` y `recordType`. El
`ExercisePersonalRecordResponse` incluye `resultId`, `exerciseId`,
`exerciseName`, `measurementType`, `recordType`, `value`, `unit` y
`performedAt`.

Para `SECONDS`, un valor menor es mejor. Para `KG` y `REPS`, un valor mayor es
mejor. Los empates se resuelven con `performedAt` más reciente y después `id`
mayor, manteniendo separados los distintos `recordType`.

## Evolución temporal

Una respuesta correcta de `/evolution` devuelve:

```json
{
  "wodResults": [],
  "exerciseResults": []
}
```

`wodResults` contiene puntos `WodEvolutionPoint` con los mismos datos
descriptivos y métricas del resultado WOD. `exerciseResults` contiene puntos
`ExerciseEvolutionPoint` con los datos descriptivos y la marca del resultado de
ejercicio.

Ambas listas contienen todos los resultados propios, no solo la mejor marca, y
se ordenan cronológicamente de forma ascendente por fecha y después por `id`:

- WOD: `completedAt ASC, id ASC`.
- Ejercicio: `performedAt ASC, id ASC`.

La zona temporal es la del `LocalDateTime` persistido; no se realizan
conversiones ni agrupaciones por periodo.

## Identidad, seguridad y errores

Las rutas están bajo `/api/**` y requieren un JWT válido mediante la seguridad
existente. El servicio normaliza el subject como email y resuelve el `User`
mediante `UserRepository`.

- JWT ausente, inválido o expirado: `401 Unauthorized` con el formato existente.
- Usuario del JWT no resoluble: `401 Unauthorized` con el formato existente.
- Consulta válida sin resultados: `200 OK` con listas vacías y contadores cero.

Las respuestas no incluyen `passwordHash`, contraseñas ni entidades JPA.

## Persistencia y arquitectura

El flujo será:

```text
UserStatisticsController -> UserStatisticsService
                         -> repositories existentes -> MySQL
```

El servicio reutiliza las tablas y consultas de `wod_results` y
`exercise_results`, cargando únicamente resultados filtrados por el usuario
autenticado. Las relaciones con WOD y ejercicio se cargarán de forma
intencionada para evitar consultas por resultado durante la transformación.
Las lecturas serán transacciones `readOnly`.

No se modifican entidades, columnas, constraints, índices, scripts SQL ni el
esquema existente. Los cálculos se realizan en memoria a partir de cada
resultado consultado y no se crean dos fuentes de verdad.

## Criterios de aceptación

- [x] Un usuario autenticado puede consultar sus estadísticas y marcas de WOD.
- [x] Un usuario autenticado puede consultar sus marcas de ejercicios.
- [x] La evolución devuelve todos sus intentos en orden temporal estable.
- [x] Ninguna consulta usa un `userId` proporcionado por el cliente.
- [x] Las reglas de cálculo son deterministas y están cubiertas por tests.
- [x] Los resultados de otro usuario no aparecen en ninguna respuesta.
- [x] La ausencia de resultados usa listas vacías y contadores cero.
- [x] Las respuestas no contienen datos sensibles.
- [x] El acceso sin JWT devuelve `401`.
- [x] `./mvnw test`, `./mvnw validate` y `./mvnw package` pasan.
- [x] El esquema MySQL permanece sin cambios.
