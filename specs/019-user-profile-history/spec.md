# SDD - Issue #19: Perfil e historial del usuario autenticado

## Estado

Issue #19 implementada y validada sobre la rama `feat/019-user-profile-history`.

Esta spec concreta la consulta del perfil y del historial autenticado usando las
entidades y contratos de resultados definidos en las Specs 016, 017 y 018. No
requiere cambios en el esquema MySQL.

## Objetivo

Permitir que un usuario autenticado:

- consulte su perfil mediante `GET /api/users/me`;
- consulte su historial de resultados de WODs y ejercicios;
- reciba únicamente datos asociados al usuario del JWT;
- no exponga `passwordHash` ni otros campos sensibles.

## Alcance

Se implementan dos lecturas protegidas:

- `GET /api/users/me` para el perfil;
- `GET /api/users/me/history` para el historial agregado.

El historial agregado contiene dos colecciones independientes porque los
resultados de WOD y de ejercicio tienen contratos y campos temporales distintos.
No se implementan actualización de perfil, eliminación, paginación, filtros por
otro usuario, estadísticas, rankings, cambios de autenticación ni frontend.

## Identidad y seguridad

Las rutas están protegidas por la regla existente para `/api/**`. El controller
recibe `Authentication` y transmite únicamente su nombre al servicio.

El servicio recorta y normaliza el subject como email con `Locale.ROOT`, y
resuelve el `User` mediante `UserRepository.findByEmail`. El `userId` utilizado
en ambas consultas procede exclusivamente del usuario resuelto. No se acepta
`userId` en la URL ni en el body.

Un JWT ausente, inválido o expirado es rechazado por Spring Security con
`401 Unauthorized`. Un JWT válido cuyo usuario no exista también produce `401`
mediante `AuthenticatedUserNotFoundException`.

## API

### Perfil actual

```http
GET /api/users/me
```

Devuelve `200 OK` con el `UserResponse` existente:

```json
{
  "id": 4,
  "name": "Delfin",
  "lastName": "Rojas",
  "email": "delfin@example.com",
  "createdAt": "2026-09-12T16:00:00"
}
```

El response no contiene `passwordHash`, `password_hash`, contraseña ni ningún
otro campo persistido que no forme parte de `UserResponse`.

### Historial propio

```http
GET /api/users/me/history
```

Devuelve `200 OK` con `UserHistoryResponse`:

```json
{
  "wodResults": [
    {
      "id": 42,
      "wodId": 20,
      "timeSeconds": 342,
      "rounds": null,
      "reps": null,
      "level": "RX",
      "completedAt": "2026-09-12T18:30:00"
    }
  ],
  "exerciseResults": [
    {
      "id": 7,
      "exerciseId": 125,
      "value": 100.00,
      "unit": "KG",
      "recordType": "1RM",
      "performedAt": "2026-09-12T17:30:00"
    }
  ]
}
```

`wodResults` usa `WodResultResponse` y se ordena por
`completedAt DESC, id DESC`. `exerciseResults` usa `ExerciseResultResponse` y
se ordena por `performedAt DESC, id DESC`. Cada colección se ordena de forma
independiente; no se mezclan resultados con campos temporales distintos en una
única secuencia.

Si no hay resultados, ambas colecciones se devuelven como `[]`.

## Persistencia y arquitectura

El flujo será:

```text
UserController -> UserService / UserHistoryService -> repositories -> MySQL
```

`UserService` añadirá la consulta del usuario actual y reutilizará la conversión
segura a `UserResponse`. `UserHistoryService` coordinará `UserRepository`,
`WodResultRepository` y `ExerciseResultRepository`, transformando entidades a
DTOs sin exponer entidades JPA.

Se añadirán consultas derivadas filtradas por `user_id` y ordenadas en cada
repositorio. Las lecturas serán `@Transactional(readOnly = true)`. Las
relaciones lazy se resolverán dentro de la transacción antes de convertir los
resultados.

No se añaden tablas, columnas, índices, constraints ni migraciones. Se mantiene
`ddl-auto=none` y el esquema existente de `users`, `wod_results` y
`exercise_results`.

## Errores

- `401 Unauthorized`: autenticación ausente, inválida, expirada o usuario no
  resoluble.
- `200 OK`: perfil o historial consultado correctamente.

No existe un `404` para el perfil actual: un usuario no resoluble se considera
un fallo de autenticación. Las respuestas de error reutilizan el formato global
existente.

## Criterios de aceptación

- [x] `GET /api/users/me` devuelve el usuario autenticado.
- [x] El historial solo contiene resultados del usuario autenticado.
- [x] No puede consultarse el historial de otro usuario manipulando parámetros.
- [x] Las respuestas no contienen información sensible.
- [x] Los resultados WOD se ordenan por `completedAt DESC, id DESC`.
- [x] Los resultados de ejercicio se ordenan por `performedAt DESC, id DESC`.
- [x] El acceso sin JWT devuelve `401` con el error JSON existente.
- [x] Se añaden tests HTTP, seguridad, servicio y repositorio cuando aplique.
- [x] `./mvnw test` y `./mvnw package` pasan.
- [x] El esquema MySQL permanece sin cambios.
