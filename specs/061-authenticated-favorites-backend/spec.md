# SDD - Issue #61: Implementar favoritos autenticados en backend

## Estado

Planificacion validada para la rama `feat/061-authenticated-favorites`, derivada
de `main` y compatible con las dependencias ya integradas de las Issues #26,
#44 y #59.

## Objetivo

Persistir los favoritos de WOD por usuario autenticado en MySQL y exponer un
contrato REST idempotente para listarlos, anadirlos y eliminarlos.

## Alcance

- Crear la migracion versionada de `wod_favorites`.
- Crear entidad JPA, DTO de respuesta, repository, service y endpoints REST.
- Resolver el usuario exclusivamente desde el subject del JWT.
- Permitir listar favoritos propios, anadir un favorito y eliminarlo.
- Mantener `PUT` y `DELETE` idempotentes con respuesta `204 No Content`.
- Reutilizar el formato de errores existente, incluyendo `WOD_NOT_FOUND`.
- Cubrir ownership, duplicados, orden, autenticacion, FKs y aislamiento con tests
  proporcionales.

Quedan fuera los cambios de frontend, la migracion de `localStorage`, favoritos
compartidos, favoritos de ejercicios, rankings, recomendaciones y cambios de
autenticacion o permisos administrativos.

## Politica de WODs

El favorito solo puede crearse o eliminarse para un WOD accesible al usuario:

- cualquier WOD global (`owner_id IS NULL`);
- un WOD personalizado cuyo `owner_id` coincida con el usuario autenticado.

Un WOD personalizado de otro usuario se trata como no accesible y no se revela
con una respuesta diferente. Esta decision sigue la separacion ya existente
entre catalogo global y WODs propios, sin crear una nueva regla de permisos.

## Modelo persistido

Se crea `wod_favorites` con:

- `user_id INT NOT NULL` y FK a `users(id)` con `ON DELETE CASCADE`;
- `wod_id INT NOT NULL` y FK a `wods(id)` con `ON DELETE CASCADE`;
- `created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP`;
- PK compuesta `(user_id, wod_id)`;
- indice secundario por `wod_id` para la FK y futuras consultas inversas;
- indice de consulta `(user_id, created_at, wod_id)` para la lista ordenada.

La tabla es aditiva, usa InnoDB y `utf8mb4`; no modifica datos legacy ni depende
de `ddl-auto`.

## API

Todas las rutas requieren `Authorization: Bearer <token>`.

### Listar favoritos

`GET /api/users/me/favorites`

Devuelve `200 OK` y una lista ordenada por `favoritedAt DESC, wodId DESC`:

```json
[
  {
    "wodId": 22,
    "favoritedAt": "2026-09-13T10:30:00"
  }
]
```

Sin favoritos devuelve `[]`. El DTO publico es `FavoriteWodResponse` y no
incluye `userId`, credenciales, token ni entidades JPA.

### Anadir favorito

`PUT /api/users/me/favorites/{wodId}`

No acepta body. Si el WOD es accesible, crea la relacion si falta y devuelve
`204 No Content` en ambos casos. Un WOD inexistente o no accesible devuelve
`404` con `error: WOD_NOT_FOUND`.

### Eliminar favorito

`DELETE /api/users/me/favorites/{wodId}`

No acepta body. Elimina la relacion propia si existe y devuelve `204 No Content`
si ya estaba ausente. Un WOD inexistente o no accesible devuelve
`404` con `error: WOD_NOT_FOUND`.

Un `wodId` no entero produce `400` con el formato global de validacion. JWT
ausente, invalido, expirado o no resoluble produce `401`.

## Criterios de aceptacion

- [ ] Un usuario autenticado lista solo sus favoritos y recibe `[]` si no tiene.
- [ ] `PUT` crea la relacion y repetirlo no genera duplicados ni cambia su
  semantica idempotente.
- [ ] `DELETE` elimina la relacion propia y repetirlo sigue devolviendo `204`.
- [ ] No se acepta `userId` ni `ownerId` por body, query o path.
- [ ] WOD inexistente o personalizado de otro usuario devuelve `404 WOD_NOT_FOUND`.
- [ ] Los favoritos se ordenan por fecha descendente e ID descendente.
- [ ] Las FKs eliminan relaciones al borrar el usuario o el WOD.
- [ ] La migracion es reproducible, versionada y compatible con `ddl-auto=none`.
- [ ] No se migran favoritos legacy de `localStorage`.
- [ ] Existen tests unitarios, HTTP e integracion MySQL para los escenarios
  relevantes.
- [ ] `./mvnw validate`, `./mvnw test` y `./mvnw package` pasan.
