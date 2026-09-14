# SDD - Issue #26: Contrato de favoritos autenticados

## Estado

Planificación contractual para la rama `docs/026-authenticated-favorites-contract`,
derivada del estado de desarrollo que contiene las dependencias de las Issues
#21, #22 y #25. Esta Issue no implementa la funcionalidad.

## Objetivo

Definir una única estrategia de persistencia y un contrato verificable para que
los favoritos de WOD pertenezcan a usuarios autenticados y puedan implementarse
posteriormente sin recuperar la fuente local histórica.

## Evidencia auditada

- MySQL actual: 8.4.
- `users.id`: `INT AUTO_INCREMENT PRIMARY KEY`.
- `wods.id`: `INT AUTO_INCREMENT PRIMARY KEY`.
- No existe actualmente una tabla ni una relación de favoritos.
- El backend protege las rutas `/api/**` mediante JWT y resuelve el usuario
  actual desde el subject autenticado.
- La Spec 002 define favoritos históricos en `localStorage`, pero la Spec 021 y
  PRODUCT.md establecen que la API/MySQL son la autoridad para datos migrados.

## Decisión de autoridad y ownership

- Los favoritos pertenecen exclusivamente al usuario autenticado.
- La autoridad será una relación persistida en MySQL y expuesta mediante la API
  REST. El frontend mantendrá únicamente una copia en memoria para renderizar y
  filtrar.
- El usuario se resolverá desde el subject del JWT. No se aceptará `userId` en
  URL, query string ni body.
- Un usuario solo podrá listar, crear y eliminar sus propias relaciones.
- Logout o cambio de token vaciará el estado de favoritos en memoria; no se
  conservarán favoritos en `localStorage`.

## Persistencia decidida

Se añadirá en una Issue posterior una tabla `wod_favorites`:

```sql
CREATE TABLE wod_favorites (
    user_id INT NOT NULL,
    wod_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, wod_id),
    KEY wod_favorites_wod_idx (wod_id),
    CONSTRAINT wod_favorites_user_fk FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT wod_favorites_wod_fk FOREIGN KEY (wod_id)
        REFERENCES wods (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

La clave primaria compuesta evita duplicados por usuario/WOD sin añadir un
identificador artificial que no usa el dominio. El índice por `wod_id` permite
que InnoDB mantenga la FK y facilita futuras consultas inversas. La relación usa
los tipos `INT` actuales. `ON DELETE CASCADE` evita favoritos huérfanos cuando se
elimina un usuario o un WOD.

No se elegirá una columna JSON, una tabla global de IDs ni `localStorage`: esas
alternativas no garantizan ownership, integridad referencial o sincronización
entre dispositivos. Tampoco se cambiarán las tablas existentes en esta Issue.

## Contrato REST propuesto

Todas las rutas requieren `Authorization: Bearer <token>` y viven bajo el
controlador de usuario actual.

### Listar favoritos

```http
GET /api/users/me/favorites
```

Respuesta `200 OK`:

```json
[
  {
    "wodId": 22,
    "favoritedAt": "2026-09-13T10:30:00"
  }
]
```

La respuesta será `[]` cuando el usuario no tenga favoritos y se ordenará por
`favoritedAt DESC, wodId DESC`. El endpoint devuelve solo el identificador del
WOD y la fecha de relación; el catálogo seguirá siendo la fuente de los datos
descriptivos del WOD.

### Añadir favorito

```http
PUT /api/users/me/favorites/{wodId}
```

No tendrá body. Devuelve `204 No Content` tanto si crea la relación como si ya
existía, haciendo la operación idempotente. Si el WOD no existe devuelve `404`
con el error `WOD_NOT_FOUND`. Un ID con formato inválido devuelve `400` según el
manejo de errores existente.

### Eliminar favorito

```http
DELETE /api/users/me/favorites/{wodId}
```

Devuelve `204 No Content` si elimina la relación o si ya no existía. Si el WOD no
existe devuelve `404` con `WOD_NOT_FOUND`; no se aceptará eliminar por un
identificador de usuario distinto al sujeto autenticado.

### Errores comunes

- `401 Unauthorized`: JWT ausente, inválido, expirado o usuario no resoluble.
- `404 Not Found` + `WOD_NOT_FOUND`: el WOD indicado no existe.
- `400 Bad Request`: `wodId` no es un entero válido.
- `500 Internal Server Error`: fallo inesperado, usando el formato global seguro.

No se usará `409` para duplicados porque `PUT` ya expresa una operación
idempotente. Las respuestas de error reutilizarán `{ error, message, status,
details }` sin exponer SQL, stack traces ni datos de otros usuarios.

## Contratos de datos

El backend añadirá posteriormente un DTO público equivalente a:

```text
FavoriteWodResponse
- wodId: Integer
- favoritedAt: LocalDateTime
```

No incluirá `userId`, password hash, token ni la entidad JPA completa. El
frontend añadirá un schema Zod derivado para `wodId` entero y `favoritedAt` no
vacío. Los contratos existentes de `WodSummaryResponse` y `WodDetailResponse`
no cambiarán en esta decisión.

## Sincronización del frontend

- `WodsPage` iniciará en paralelo la carga de WODs y `GET /me/favorites`,
  manteniendo un `Set<number>` en memoria para el filtro de favoritos.
- El detalle de WOD reutilizará el mismo estado compartido, no una copia local
  independiente.
- Como catálogo y favoritos son respuestas independientes, un WOD se mostrará
  como favorito solo si su ID está en el conjunto recibido y también existe en
  el catálogo actual.
- Las operaciones de `PUT` y `DELETE` actualizarán el conjunto compartido solo
  después de una respuesta exitosa. Un error mantendrá el estado anterior y
  mostrará recuperación en español.
- Un `401` reutilizará el evento `wod-explorer:session-expired` existente. El
  contexto de autenticación limpiará el token y conducirá a `#/login`.
- La búsqueda y los filtros por tipo se aplicarán después sobre la lista de WODs;
  `favoritesOnly` no cambiará el endpoint de catálogo.
- Si no hay favoritos, se mostrará un estado vacío específico distinto de “sin
  coincidencias”.

Para compartir el conjunto entre catálogo y detalle se justifica un proveedor
de sesión de favoritos o una capa equivalente bajo `AuthProvider` en la Issue
de implementación. No se añadirá persistencia local ni sincronización manual
entre páginas.

## Migración de favoritos legacy

No se migrarán los valores de `wod-explorer:favorites` de la Spec 002. Esos IDs
no tienen ownership, pueden pertenecer a una versión distinta del catálogo y no
representan una intención confirmada del usuario autenticado. La primera carga
de la nueva funcionalidad comenzará con la colección persistida del usuario, que
será `[]` si aún no existe.

Si en el futuro se requiere una importación explícita, deberá ser una Issue
separada con consentimiento, validación de IDs y estrategia de rollback.

## Alcance y fuera de alcance

Esta Issue solo define el contrato. No crea la tabla, migración, entidad,
repositorio, servicios, controladores, DTOs, schemas, botones, filtros,
contextos ni tests de implementación.

Quedan fuera favoritos compartidos, rankings, recomendaciones, favoritos de
ejercicios, edición del perfil, roles y cambios en la autenticación.

## Criterios de aceptación

- [x] Existe una decisión explícita de persistencia relacional y autoridad
  backend/MySQL.
- [x] El contrato no depende de `localStorage` ni crea una fuente paralela.
- [x] Ownership, autenticación, respuestas vacías, duplicados y eliminación
  están definidos.
- [x] Se documentan tabla, tipos, FKs, índices y acciones `ON DELETE` futuras.
- [x] Se especifican endpoints, DTO, códigos HTTP y errores.
- [x] Se describe la sincronización de catálogo, detalle y filtro frontend.
- [x] Se decide no migrar favoritos legacy y se documenta el motivo.
- [x] La decisión permite una Issue posterior de implementación independiente y
  verificable.
