# Spec 014 — WOD Catalog and Detail

## Contexto

WOD Explorer ya dispone de un backend Spring Boot conectado a MySQL y protegido mediante autenticación JWT.

Actualmente están implementados:

- Entidad `User`.
- Entidad `Exercise`.
- `ExerciseRepository`.
- `ExerciseService`.
- `ExerciseController`.
- CRUD de ejercicios.
- Registro y login de usuarios.
- Autenticación JWT.
- Protección de endpoints mediante Spring Security.
- Tests automatizados de autenticación.

La base de datos MySQL ya contiene las tablas:

- `wods`
- `wod_exercises`
- `exercises`

Actualmente existen WODs almacenados en MySQL, pero el backend todavía no dispone de una representación de dominio ni de endpoints REST para consultarlos.

La Issue #14 requiere implementar el catálogo y detalle de WODs.

---

## Objetivo

Implementar la capa backend necesaria para consultar WODs almacenados en MySQL mediante una API REST.

La implementación debe incorporar:

- Entidad JPA `Wod`.
- Enums necesarios.
- `WodRepository`.
- `WodService`.
- DTOs.
- `WodController`.
- Endpoint de catálogo.
- Endpoint de detalle.
- Filtros por propiedades del WOD.
- Validaciones y manejo de errores.
- Tests.

Esta spec se centra exclusivamente en la información propia de la tabla `wods`.

La relación completa `WOD ↔ Exercises` pertenece a la Issue #15 / Spec 015 y queda fuera del alcance de esta spec.

---

## Esquema MySQL existente

La implementación debe adaptarse al esquema real existente.

La tabla `wods` contiene actualmente:

- `id`
- `name`
- `type`
- `time_limit`
- `rounds`
- `level`
- `created_at`

Los tipos actuales incluyen:

### type

- `FOR_TIME`
- `AMRAP`
- `EMOM`

### level

- `BEGINNER`
- `INTERMEDIATE`
- `RX`

Antes de implementar la entidad se debe verificar el esquema real mediante MySQL.

No se debe modificar el esquema para adaptarlo al código.

El código debe adaptarse al esquema existente.

---

## RF-1 — Entidad Wod

Debe existir una entidad JPA:

`Wod`

que represente la tabla:

`wods`

Debe mapear correctamente:

- id.
- name.
- type.
- timeLimit.
- rounds.
- level.
- createdAt.

Los nombres Java deben seguir las convenciones del proyecto.

Los nombres SQL deben mapearse explícitamente cuando sea necesario.

---

## RF-2 — Identificador

`Wod.id` debe representar la primary key autoincremental existente en MySQL.

La generación del identificador debe ser compatible con:

`AUTO_INCREMENT`

---

## RF-3 — Tipo de WOD

El campo `type` debe representarse mediante un enum Java.

Debe mapear los valores existentes en MySQL:

- `FOR_TIME`
- `AMRAP`
- `EMOM`

Debe utilizarse persistencia mediante nombre del enum y no mediante posición ordinal.

---

## RF-4 — Nivel del WOD

El campo `level` debe representarse mediante un enum Java.

Debe soportar:

- `BEGINNER`
- `INTERMEDIATE`
- `RX`

Debe persistirse mediante nombre y no mediante ordinal.

---

## RF-5 — Campos opcionales

La entidad debe respetar la nulabilidad real del esquema.

En particular:

- `timeLimit` puede ser null cuando el tipo de WOD no lo necesite.
- `rounds` puede ser null cuando el tipo de WOD no lo necesite.

No se deben inventar valores por defecto para sustituir valores null existentes.

---

## RF-6 — Fecha de creación

`createdAt` debe mapear la columna `created_at`.

La implementación debe respetar que MySQL genera actualmente el valor mediante `CURRENT_TIMESTAMP`.

La API no debe permitir al cliente establecer manualmente este valor.

---

## RF-7 — WodRepository

Debe existir:

`WodRepository`

utilizando Spring Data JPA.

Debe proporcionar como mínimo las operaciones necesarias para:

- listar WODs.
- buscar WOD por id.
- soportar los filtros definidos en esta spec.

No deben añadirse queries innecesarias.

---

## RF-8 — Catálogo de WODs

Debe implementarse:

`GET /api/wods`

El endpoint debe devolver el catálogo de WODs almacenado en MySQL.

La respuesta debe utilizar DTOs.

No se deben exponer directamente entidades JPA.

---

## RF-9 — Detalle de WOD

Debe implementarse:

`GET /api/wods/{id}`

Cuando el WOD existe debe responder:

`200 OK`

con su información.

Cuando el WOD no existe debe devolver un error HTTP consistente con el manejo global de errores del proyecto.

El comportamiento esperado es:

`404 Not Found`

---

## RF-10 — Filtro por nombre

`GET /api/wods` debe permitir filtrar por nombre.

Ejemplo conceptual:

`GET /api/wods?name=Fran`

La búsqueda debe seguir una estrategia consistente y documentada.

Preferentemente debe permitir coincidencia parcial y case-insensitive si puede implementarse limpiamente con Spring Data JPA.

---

## RF-11 — Filtro por tipo

Debe permitirse filtrar por tipo.

Ejemplo:

`GET /api/wods?type=FOR_TIME`

Los valores deben corresponder al enum definido por el backend.

Un valor no válido debe producir una respuesta HTTP consistente con las reglas actuales de validación.

---

## RF-12 — Filtro por nivel

Debe permitirse filtrar por nivel.

Ejemplo:

`GET /api/wods?level=RX`

Los valores deben corresponder al enum del backend.

---

## RF-13 — Combinación de filtros

Los filtros deben poder combinarse.

Ejemplo:

`GET /api/wods?type=FOR_TIME&level=RX`

Cuando se proporcionan varios filtros deben aplicarse conjuntamente.

No deben requerirse múltiples endpoints para cada combinación.

---

## RF-14 — Sin filtros

Cuando no se proporciona ningún filtro:

`GET /api/wods`

debe devolver el catálogo completo disponible para el usuario.

---

## RF-15 — DTO de catálogo

La respuesta del catálogo debe utilizar un DTO específico o una representación DTO apropiada.

Debe contener únicamente información necesaria para mostrar un WOD en un catálogo.

Como mínimo:

- id.
- name.
- type.
- level.

Se pueden incluir `timeLimit` y `rounds` si resultan útiles para el contrato actual.

No debe exponerse información interna de persistencia.

---

## RF-16 — DTO de detalle

El detalle debe utilizar un DTO.

Debe representar como mínimo:

- id.
- name.
- type.
- timeLimit.
- rounds.
- level.
- createdAt.

Los ejercicios asociados al WOD no forman parte todavía de esta spec.

La relación se añadirá en Spec 015.

---

## RF-17 — WodService

Debe existir una capa:

`WodService`

responsable de:

- consultar catálogo.
- aplicar filtros.
- obtener detalle.
- convertir entidades a DTO cuando corresponda.
- gestionar la ausencia de un WOD.

El controller no debe contener lógica de persistencia.

---

## RF-18 — WodController

Debe existir:

`WodController`

responsable exclusivamente del contrato HTTP.

Debe delegar la lógica funcional en `WodService`.

---

## RF-19 — Seguridad

Los nuevos endpoints deben respetar la configuración Spring Security existente.

Esta spec no debe modificar las reglas globales de autenticación.

Por tanto, mientras la configuración actual proteja `/api/**`, los endpoints:

- `GET /api/wods`
- `GET /api/wods/{id}`

también estarán protegidos mediante JWT.

La decisión de hacer público el catálogo se abordará únicamente en una spec futura si se considera necesario.

---

## RF-20 — Manejo de errores

Los errores deben utilizar el sistema global existente.

Debe cubrirse como mínimo:

- WOD inexistente.
- id inválido.
- enum `type` inválido.
- enum `level` inválido.
- parámetros inválidos cuando corresponda.

No deben devolverse stack traces ni información interna.

---

## RF-21 — Tests

Debe existir cobertura automatizada para:

- Repository cuando aporte valor.
- Service.
- Controller.
- Catálogo sin filtros.
- Filtro por nombre.
- Filtro por tipo.
- Filtro por nivel.
- Combinación de filtros.
- Detalle existente.
- WOD inexistente.
- Seguridad HTTP de los endpoints cuando no esté suficientemente cubierta por tests existentes.

Se debe evitar duplicar cobertura existente.

---

## Requisitos técnicos

La implementación debe seguir:

- Java 21.
- Spring Boot 3.
- Spring Data JPA.
- Spring Security existente.
- MySQL 8.4.
- JUnit 5.
- Mockito.
- MockMvc.

Debe respetar:

- `AGENTS.md`.
- `backend/AGENTS.md`.
- skills relevantes instaladas para Spring Boot/JPA/testing.
- arquitectura existente del backend.

---

## Arquitectura esperada

La implementación debe mantener la separación:

`Controller → Service → Repository → MySQL`

Los DTOs deben separar el contrato REST de las entidades JPA.

No debe accederse directamente al repository desde el controller.

---

## Base de datos

No se debe modificar el esquema MySQL.

No crear:

- tablas.
- columnas.
- índices.
- foreign keys.
- migraciones.

La implementación debe utilizar la tabla `wods` existente.

---

## Fuera de alcance

Esta spec no incluye:

- Crear WODs mediante API.
- Editar WODs.
- Eliminar WODs.
- CRUD completo de WODs.
- Relación completa WOD ↔ Exercises.
- Modificar `wod_exercises`.
- Resultados de WOD.
- `wod_results`.
- Resultados de ejercicios.
- Historial.
- Estadísticas.
- Roles.
- Cambios JWT.
- Cambios en autenticación.
- Cambios frontend.
- Cambios de esquema MySQL.

---

## Criterios de aceptación

La Spec 014 se considera completada cuando:

1. Existe entidad `Wod`.
2. El mapping corresponde al esquema MySQL real.
3. Existen enums para `type` y `level`.
4. Existe `WodRepository`.
5. Existe `WodService`.
6. Existe `WodController`.
7. Existen DTOs REST.
8. `GET /api/wods` funciona.
9. `GET /api/wods/{id}` funciona.
10. El catálogo puede filtrarse por nombre.
11. Puede filtrarse por tipo.
12. Puede filtrarse por nivel.
13. Los filtros pueden combinarse.
14. WOD inexistente produce `404`.
15. Los endpoints respetan Spring Security existente.
16. No se exponen entidades JPA directamente.
17. No se modifica el esquema MySQL.
18. No se implementa todavía WOD ↔ Exercises.
19. Los tests automatizados pasan.
20. `./mvnw validate` termina correctamente.
21. `./mvnw test` termina con 0 failures y 0 errors.
22. `./mvnw package` termina correctamente.
23. La Issue #14 queda completamente cubierta.
