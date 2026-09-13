# Tasks - Issue #26: Contrato de favoritos autenticados

## Preparación

- [x] Obtener la Issue #26 mediante GitHub MCP y extraer objetivo, alcance,
  criterios, restricciones y dependencias.
- [x] Revisar constitución, PRODUCT.md, AGENTS aplicables, Specs 002, 021 y 022,
  arquitectura frontend y contratos backend.
- [x] Auditar `users`, `wods`, claves y ausencia de relación de favoritos con
  `wodsql`.
- [x] Crear `docs/026-authenticated-favorites-contract` desde el estado válido
  más reciente que contiene las dependencias de #21, #22 y #25.
- [x] Crear `spec.md`, `plan.md` y `tasks.md` con contenido válido.

## Decisión de persistencia

- [x] Comparar explícitamente tabla relacional, JSON y `localStorage`.
- [x] Documentar `wod_favorites`, PK compuesta, tipos, índices, FKs y
  `ON DELETE`.
- [x] Definir backend/MySQL como autoridad y ownership por JWT.
- [x] Decidir la no migración automática de favoritos legacy.

## Contrato API

- [x] Definir `GET /api/users/me/favorites` y la respuesta vacía `[]`.
- [x] Definir `PUT` idempotente para añadir y `DELETE` idempotente para eliminar.
- [x] Definir DTO público, orden, autenticación, duplicados, WOD inexistente,
  códigos HTTP y formato de errores.

## Sincronización frontend y límites

- [x] Definir sincronización de catálogo, detalle y filtro sin `localStorage` ni
  segunda fuente de verdad.
- [x] Definir estados de sesión expirada, error, carga y favoritos vacíos.
- [x] Confirmar explícitamente que no se implementan tabla, migración, endpoints,
  DTOs, UI ni tests de funcionalidad en esta Issue.
- [x] Verificar que el contrato permite una Issue posterior independiente.

## Revisión y entrega

- [x] Validar tamaños y contenido de `spec.md`, `plan.md` y `tasks.md`.
- [x] Revisar `git diff`, `git status`, secretos y exclusión de archivos ajenos.
- [x] Marcar todas las tasks documentales completadas y registrar la auditoría.
- [ ] Crear el commit específico de la Issue #26 y conservar su hash.
- [ ] Documentar la Issue #26 con rama, commit, verificaciones y estado abierto
  pendiente de validación manual.

## Resultados de auditoría

- `wodsql_describe_table('wod_explorer', 'users')`: `id INT` como PK y
  `email` único.
- `wodsql_describe_table('wod_explorer', 'wods')`: `id INT` como PK y catálogo
  sin relación de favoritos.
- `wodsql_describe_table('wod_explorer', 'wod_exercises')`: confirma el patrón
  actual de relaciones mediante FKs e índices.
- `EXPLAIN` del catálogo actual revisado; no se modificaron consultas, tablas,
  datos ni scripts.
- La especificación histórica 002 se conserva sin cambios y queda explícitamente
  superada para favoritos por la autoridad API/MySQL de esta spec.
