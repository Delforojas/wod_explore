# Spec 028 - Paginación y límites de catálogos e historial

## Estado

Spec validada para implementar la Issue #28 sobre la rama
`feat/028-catalog-pagination-history`, derivada de
`feat/027-admin-catalog-authorization`, que contiene las dependencias de las
Issues #21 y #22 además del estado de desarrollo más reciente.

## Contexto

Los endpoints de WODs, ejercicios e historial devuelven actualmente colecciones
completas. Los repositorios usan `List` sin `Pageable`, el cliente espera arrays
sin metadatos y las pantallas no pueden conocer ni navegar el resto de resultados.
El historial autenticado contiene dos colecciones con ordenaciones temporales
independientes.

## Objetivo

Limitar las consultas de catálogo e historial y ofrecer un contrato estable que
permita navegar páginas sin cargar volúmenes ilimitados ni perder los filtros,
la ordenación o el ownership del usuario.

## Alcance

Se paginan estas colecciones:

- `GET /api/wods`.
- `GET /api/exercises`.
- `GET /api/users/me/history`, manteniendo separadas sus colecciones de WOD y
  ejercicios.

Los filtros existentes de WOD se conservan. La búsqueda de ejercicios se mueve
al backend para que siga siendo completa cuando el catálogo esté paginado.
El frontend adapta cliente, schemas, páginas y controles de navegación.

No se paginan en esta Issue los endpoints de resultados por WOD o ejercicio,
`/api/users/me/evolution` ni `/api/users/me/statistics`. Las estadísticas
necesitan procesar todos los resultados para conservar sus reglas de cálculo y
no se alterará ese contrato.

## Contrato de paginación

Los endpoints paginados aceptan:

```text
page=0
size=20
```

`page` es un índice base cero. `size` tiene valor por defecto `20` y admite de
`1` a `100`. `page` debe ser mayor o igual que cero. Un parámetro inválido,
negativo o fuera de rango devuelve `400 Bad Request` usando el formato de error
global existente. No se corrigen silenciosamente los valores inválidos.

La respuesta de cada colección usa un envoltorio explícito y no expone la
serialización directa de `Page` de Spring:

```json
{
  "items": [],
  "page": 0,
  "size": 20,
  "totalElements": 0,
  "totalPages": 0,
  "hasNext": false
}
```

`totalElements` y `totalPages` representan la consulta completa después de
aplicar sus filtros, no solo la página devuelta. Una página válida sin
resultados devuelve `200` con `items: []`; una página posterior a la última
también es válida y mantiene los metadatos calculados.

En `GET /api/users/me/history`, la respuesta mantiene dos envoltorios
independientes:

```json
{
  "wodResults": { "items": [], "page": 0, "size": 20, "totalElements": 0, "totalPages": 0, "hasNext": false },
  "exerciseResults": { "items": [], "page": 0, "size": 20, "totalElements": 0, "totalPages": 0, "hasNext": false }
}
```

La misma pareja `page`/`size` se aplica de forma independiente a ambas
colecciones. Por tanto, los totales y `hasNext` pueden diferir. El historial
continúa limitado al usuario resuelto desde el JWT; no acepta `userId`.

## Filtros y ordenación

- WODs conserva `name`, `type` y `level`, combinados con AND. El nombre mantiene
  coincidencia parcial e insensible a mayúsculas.
- Ejercicios acepta `name` para búsqueda parcial e insensible a mayúsculas. Sin
  nombre devuelve el catálogo completo paginado.
- WODs y ejercicios usan orden determinista `id ASC`.
- Resultados WOD del historial usan `completedAt DESC, id DESC`.
- Resultados de ejercicios del historial usan `performedAt DESC, id DESC`.

Los cambios de filtro en frontend reinician la página a cero. Mientras se carga
una nueva página se conserva el contrato visual existente de carga, error y
vacío. Los controles anterior/siguiente son botones accesibles, se deshabilitan
cuando no existe página previa o siguiente y funcionan en móvil, tablet y
escritorio.

## Arquitectura y persistencia

El flujo mantiene:

```text
Controller -> Service -> Repository -> MySQL
```

Los repositorios utilizan `Pageable` y `Page` o una estrategia equivalente para
obtener contenido y conteo. Los servicios convierten las páginas a DTOs de
respuesta sin exponer entidades JPA ni la implementación de Spring Data.
Las lecturas del historial permanecen en una transacción `readOnly` y filtran
por el usuario autenticado antes de paginar.

Las consultas de detalle de WOD y ejercicio no se convierten en consultas
masivas adicionales. No se introducen relaciones `EAGER` ni N+1 evitable.
Antes de cambiar índices se inspeccionarán las tablas e índices reales mediante
`wodsql` y se ejecutará `EXPLAIN` sobre las consultas representativas. No se
añadirán índices si la evidencia no lo justifica; cualquier índice necesario
deberá quedar versionado y justificado sin modificar datos manualmente.
La evidencia inicial muestra `Using filesort` en ambas consultas de historial,
por lo que se versionan los índices compuestos
`(user_id, completed_at, id)` y `(user_id, performed_at, id)`. Son cambios
aditivos, no alteran datos ni relaciones, y deben aplicarse a bases existentes
mediante `Docker/mysql/migrations/V028__add_history_pagination_indexes.sql`.

## Frontend

`client.ts` y `schemas.ts` validan el envoltorio y sus metadatos mediante Zod.
Las páginas de WODs, ejercicios e historial mantienen el estado local de la
página y tamaño, envían los filtros al endpoint correspondiente y muestran
controles de anterior/siguiente. No se guardan resultados, catálogos ni estado
de paginación en `localStorage`.

Los contratos existentes de detalle, registro de resultados, evolución y
estadísticas permanecen sin cambios.

## Criterios de aceptación

- Ninguno de los tres endpoints incluidos devuelve colecciones sin límite.
- Cada respuesta paginada permite conocer `page`, `size`, totales y `hasNext`.
- Los filtros y ordenaciones producen páginas estables y deterministas.
- El historial solo devuelve resultados del usuario autenticado.
- La búsqueda de ejercicios sigue siendo completa con el catálogo paginado.
- El frontend mantiene carga, error, vacío y navegación usable y accesible.
- Los parámetros inválidos devuelven `400`; los límites están documentados y
  cubiertos por tests.
- Las consultas no introducen N+1 evitable.
- Las consultas relevantes se miden con `EXPLAIN`; los índices añadidos, si los
  hubiera, quedan justificados por esa evidencia.
- No se modifica el esquema sin una migración versionada y una justificación
  técnica explícita.
- `./mvnw validate`, `./mvnw test`, `./mvnw package`, `npm test`, `npm run lint`
  y `npm run build` pasan cuando corresponda.

## Fuera de alcance

- Paginación de resultados por recurso, evolución o estadísticas.
- Cambios en reglas de cálculo de marcas personales.
- Cambio del ownership o de la autenticación JWT.
- CRUD nuevo, favoritos, caché global o infraestructura externa.
- Búsqueda full-text o rediseño completo de las pantallas.
- Cambios de esquema, índices o datos sin evidencia y versionado apropiados.
