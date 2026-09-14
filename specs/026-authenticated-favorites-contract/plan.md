# Plan - Issue #26: Contrato de favoritos autenticados

## Enfoque

Resolver la ambigüedad histórica de la Spec 002 mediante un contrato único y
agnóstico de implementación. La documentación se basará en el esquema real,
los endpoints de usuario existentes y la arquitectura frontend actual. No se
modificará código, esquema SQL, datos, scripts ni dependencias.

## Fases

1. Auditar la Issue #26, la Spec 002, la migración de la Issue #21, la
   documentación de la Issue #22 y las superficies WOD actuales.
2. Confirmar mediante `wodsql` los tipos y claves de `users` y `wods`, y verificar
   que no existe una relación de favoritos.
3. Comparar persistencia relacional, JSON y `localStorage`, documentando
   ownership, integridad, sincronización y trade-offs.
4. Definir `wod_favorites` como tabla N:M con PK compuesta `(user_id, wod_id)`,
   timestamps, índices mínimos y FKs con `ON DELETE CASCADE`.
5. Definir `GET`, `PUT` y `DELETE` bajo `/api/users/me/favorites`, incluyendo
   DTO, orden, respuestas vacías, idempotencia, WOD inexistente y errores.
6. Definir la sincronización futura del frontend con un estado compartido en
   memoria, sin `localStorage` y sin modificar el catálogo existente.
7. Decidir explícitamente que no habrá migración automática de la clave legacy
   de la Spec 002.
8. Validar que el SDD permite abrir una Issue posterior de implementación sin
   decisiones funcionales pendientes.

## Decisiones técnicas

- Se mantiene el ownership implícito del JWT: no hay `userId` cliente.
- `PUT` es preferible a `POST` porque añadir el mismo favorito varias veces no
  debe producir `409` ni duplicados.
- `DELETE` es idempotente cuando el WOD existe, incluso si la relación ya no
  está presente.
- El listado devuelve IDs y timestamps, no copias completas de WOD, para evitar
  duplicar el catálogo y permitir que la UI mantenga una sola fuente descriptiva.
- La PK compuesta refleja directamente la unicidad del dominio y permite
  consultas eficientes por `user_id`; el índice separado de `wod_id` satisface la
  FK y deja abierta la consulta inversa.
- La creación de la tabla y cualquier backfill quedan expresamente reservados a
  la Issue de implementación.

## Issue posterior de implementación

La siguiente Issue deberá cubrir, como mínimo:

- migración SQL reproducible;
- entidad y repositorio con filtro por usuario;
- servicio que resuelva ownership desde JWT;
- controller y DTOs con el contrato de esta spec;
- tests de aislamiento, idempotencia, errores y cascadas;
- schemas y cliente API frontend;
- estado compartido, botón, filtro y detalle WOD;
- estados de carga, error, vacío y `401`;
- actualización de documentación y verificaciones frontend/backend.

## Verificación documental

- Comprobar que los tres archivos SDD tienen contenido y slug válido.
- Revisar que ninguna task implique implementar la tabla o endpoints en esta
  Issue.
- Confirmar que no se modifican `Docker/mysql/init/`, backend, frontend,
  `localStorage` ni la Spec 002 histórica.
- Ejecutar revisión de `git diff`, `git status` y búsqueda de secretos antes del
  commit.
