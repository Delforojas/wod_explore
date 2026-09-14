# Spec 015 — WOD ↔ Exercises

## Contexto

WOD Explorer dispone actualmente de:

- Backend Spring Boot.
- Persistencia MySQL.
- Autenticación JWT.
- CRUD de ejercicios.
- Catálogo y detalle de WODs implementado en Spec 014.
- Entidad `Wod`.
- Entidad `Exercise`.
- `WodRepository`.
- `WodService`.
- `WodController`.
- DTOs para catálogo y detalle de WODs.

La base de datos ya contiene la tabla intermedia:

`wod_exercises`

que representa los ejercicios asociados a cada WOD.

Actualmente el backend todavía no modela esta relación y:

`GET /api/wods/{id}`

devuelve únicamente los datos propios del WOD.

La Issue #15 requiere modelar correctamente esta asociación y exponer los ejercicios asociados dentro del detalle de cada WOD.

---

## Objetivo

Implementar la relación:

`Wod ↔ Exercise`

utilizando la tabla existente:

`wod_exercises`

La asociación debe conservar los atributos propios de dicha tabla:

- `wod_id`.
- `exercise_id`.
- `reps`.
- `position`.

El detalle de un WOD debe incluir sus ejercicios asociados, ordenados mediante `position`.

La implementación debe adaptarse al esquema MySQL existente y no modificarlo.

---

## Esquema MySQL existente

La tabla `wod_exercises` contiene:

- `id` INT AUTO_INCREMENT PRIMARY KEY.
- `wod_id` INT NOT NULL.
- `exercise_id` INT NOT NULL.
- `reps` INT NULL.
- `position` INT NOT NULL.

Relaciones existentes:

`wod_exercises.wod_id → wods.id`

con:

`ON DELETE CASCADE`

y:

`wod_exercises.exercise_id → exercises.id`

con la política referencial existente en MySQL, actualmente esperada como:

`ON DELETE RESTRICT`

Antes de implementar debe verificarse el esquema real mediante wodsql.

El código debe adaptarse al esquema real.

No se debe modificar MySQL para adaptarlo al código.

---

## RF-1 — Modelar wod_exercises

La tabla `wod_exercises` debe tener una representación explícita dentro del modelo JPA.

No debe modelarse como un `@ManyToMany` simple porque la relación contiene atributos propios:

- `reps`.
- `position`.

Debe utilizarse una entidad de asociación.

El nombre debe seguir las convenciones existentes del proyecto.

Nombre recomendado:

`WodExercise`

---

## RF-2 — Identificador

La entidad de asociación debe mapear el identificador existente:

`wod_exercises.id`

Debe respetar el `AUTO_INCREMENT` existente.

No debe introducirse una primary key compuesta si MySQL utiliza actualmente `id` como primary key.

---

## RF-3 — Relación con Wod

`WodExercise` debe representar correctamente:

`wod_id → wods.id`

La asociación JPA debe permitir conocer el WOD al que pertenece cada relación.

Debe evitarse introducir cascadas JPA que modifiquen el comportamiento de persistencia sin una necesidad funcional.

---

## RF-4 — Relación con Exercise

`WodExercise` debe representar correctamente:

`exercise_id → exercises.id`

La asociación JPA debe permitir obtener la información del ejercicio asociado.

No debe modificarse la entidad `Exercise` con relaciones inversas salvo que exista una necesidad técnica real y justificada.

---

## RF-5 — Repeticiones

Debe mapearse:

`reps`

El campo puede ser null según el esquema existente.

La API debe conservar `null` cuando el WOD no tenga una cantidad de repeticiones definida para ese ejercicio.

No deben inventarse valores por defecto.

---

## RF-6 — Posición

Debe mapearse:

`position`

Este campo define el orden del ejercicio dentro del WOD.

La API debe devolver los ejercicios asociados ordenados ascendentemente por:

`position`

El orden no debe depender del id del ejercicio ni del id de la relación.

---

## RF-7 — Repository

Debe existir acceso de persistencia para consultar las asociaciones de un WOD.

La implementación debe permitir recuperar todos los `WodExercise` correspondientes a un `wod_id` ordenados por `position`.

Debe evitarse introducir queries innecesarias.

---

## RF-8 — Detalle de WOD

Debe ampliarse:

`GET /api/wods/{id}`

para incluir los ejercicios asociados.

El endpoint existente no debe ser sustituido por otro endpoint.

---

## RF-9 — Contrato de ejercicios asociados

Cada ejercicio incluido en el detalle del WOD debe contener como mínimo:

- id del ejercicio.
- name.
- category.
- measurementType.
- reps.
- position.

El contrato REST debe utilizar DTOs.

No deben exponerse directamente:

- `WodExercise`.
- `Exercise`.
- `Wod`.

---

## RF-10 — Orden

La colección de ejercicios dentro de:

`GET /api/wods/{id}`

debe aparecer ordenada por `position` ascendente.

Ejemplo conceptual:

- position 1.
- position 2.
- position 3.

La posición almacenada en MySQL es la fuente de verdad.

---

## RF-11 — WOD sin ejercicios

Si un WOD existe pero no tiene asociaciones en `wod_exercises`, el endpoint debe responder:

`200 OK`

y devolver:

`exercises: []`

No debe producir:

- 404.
- null para la colección.
- error de persistencia.

---

## RF-12 — WOD inexistente

Si el WOD solicitado no existe:

`GET /api/wods/{id}`

debe mantener el comportamiento implementado en Spec 014:

`404 Not Found`

La incorporación de ejercicios no debe alterar dicho contrato.

---

## RF-13 — Evitar duplicaciones

La respuesta no debe contener asociaciones duplicadas artificialmente por el mapping JPA.

Cada fila válida de `wod_exercises` debe representar exactamente una asociación en la respuesta.

La implementación no debe generar duplicados debido a joins o relaciones bidireccionales.

---

## RF-14 — Estrategia de carga

La asociación debe cargarse de forma controlada.

Debe evitarse introducir relaciones JPA innecesariamente complejas.

No debe utilizarse `EAGER` globalmente únicamente para facilitar la serialización.

Debe evaluarse una estrategia explícita mediante repository/service para recuperar los ejercicios del detalle.

---

## RF-15 — Compatibilidad con Exercise

La implementación no debe romper el comportamiento existente de:

`/api/exercises`

El CRUD y consultas existentes de ejercicios deben seguir funcionando.

No debe cambiarse su contrato REST salvo necesidad técnica demostrable.

---

## RF-16 — Compatibilidad con Wod

Debe mantenerse el comportamiento existente de:

`GET /api/wods`

incluyendo:

- catálogo completo.
- filtro por name.
- filtro por type.
- filtro por level.
- combinación de filtros.

La relación con ejercicios afecta al detalle y no debe degradar el catálogo.

---

## RF-17 — Integridad referencial

La implementación debe respetar las foreign keys existentes en MySQL.

No deben modificarse:

- foreign keys.
- ON DELETE.
- primary keys.
- índices.
- columnas.

La aplicación no debe introducir cascadas JPA que contradigan las reglas reales de MySQL.

---

## RF-18 — Seguridad

Los endpoints deben continuar utilizando Spring Security existente.

No se modificarán las reglas de autenticación.

`GET /api/wods/{id}`

seguirá requiriendo JWT según la configuración actual.

---

## RF-19 — Tests

Debe existir cobertura automatizada suficiente para verificar:

- mapping de `WodExercise` cuando aporte valor.
- consulta de asociaciones por WOD.
- orden por `position`.
- transformación a DTO.
- inclusión de ejercicios en detalle.
- `reps`.
- WOD sin ejercicios.
- WOD inexistente.
- ausencia de duplicados.
- compatibilidad con catálogo de WODs.
- compatibilidad con endpoints de Exercise.
- seguridad existente cuando sea necesario.

Debe evitarse duplicar tests ya cubiertos por Spec 014.

---

## Arquitectura esperada

La implementación debe mantener:

`Controller → Service → Repository → MySQL`

La obtención del detalle puede utilizar:

`WodService → WodRepository + WodExerciseRepository`

si esta estrategia resulta más simple y explícita.

Debe evitarse introducir relaciones bidireccionales complejas únicamente para navegar entre entidades.

---

## Requisitos técnicos

La implementación debe respetar:

- Java 21.
- Spring Boot 3.
- Spring Data JPA.
- Spring Security existente.
- MySQL 8.4.
- JUnit 5.
- Mockito.
- MockMvc.
- arquitectura actual del backend.
- `AGENTS.md`.
- `backend/AGENTS.md`.

Debe utilizar las skills relevantes instaladas cuando corresponda.

---

## Base de datos

No se debe modificar el esquema MySQL.

No crear:

- tablas.
- columnas.
- índices.
- foreign keys.
- migraciones.

No modificar datos existentes salvo que una verificación estrictamente necesaria lo requiera y esté explícitamente autorizada.

wodsql debe utilizarse en modo lectura.

---

## Fuera de alcance

Esta spec no incluye:

- Crear asociaciones mediante API.
- Editar asociaciones mediante API.
- Eliminar asociaciones mediante API.
- Crear WODs.
- Editar WODs.
- Eliminar WODs.
- Modificar Exercise CRUD.
- `wod_results`.
- `exercise_results`.
- resultados.
- historial.
- estadísticas.
- frontend.
- roles.
- cambios JWT.
- cambios de autenticación.
- cambios de esquema MySQL.

---

## Criterios de aceptación

La Spec 015 se considera completada cuando:

1. Existe una representación JPA correcta de `wod_exercises`.
2. Se respeta su primary key real.
3. Se mapea correctamente `wod_id`.
4. Se mapea correctamente `exercise_id`.
5. Se mapea correctamente `reps`.
6. Se mapea correctamente `position`.
7. No se utiliza un `@ManyToMany` simple.
8. Existe acceso de repository para recuperar asociaciones por WOD.
9. Las asociaciones se recuperan ordenadas por `position`.
10. `GET /api/wods/{id}` incluye los ejercicios asociados.
11. Cada ejercicio contiene los datos necesarios del Exercise.
12. Cada asociación incluye `reps`.
13. Cada asociación incluye `position`.
14. Un WOD sin ejercicios devuelve `exercises: []`.
15. Un WOD inexistente sigue devolviendo `404`.
16. No existen duplicaciones artificiales.
17. `GET /api/wods` continúa funcionando.
18. El CRUD/API existente de Exercise continúa funcionando.
19. Spring Security existente continúa funcionando.
20. No se modifica el esquema MySQL.
21. No se implementan operaciones de escritura de asociaciones.
22. Los tests automatizados pasan.
23. `./mvnw validate` termina correctamente.
24. `./mvnw test` termina con 0 failures y 0 errors.
25. `./mvnw package` termina correctamente.
26. La Issue #15 queda funcionalmente cubierta.
