# Plan - Issue #61: Implementar favoritos autenticados en backend

## Estrategia

Aplicar el cambio minimo siguiendo la arquitectura existente:
`Controller -> Service -> Repository -> Database`. La relacion no tendra ID
artificial; la PK compuesta garantizara la unicidad y el servicio resolvera el
usuario a partir del email del JWT antes de cualquier operacion.

## Fases

1. Anadir una migracion SQL versionada posterior a V029 con `wod_favorites`, PK,
   indices, FKs, `ON DELETE CASCADE` y fecha de creacion.
2. Actualizar `backend/src/test/resources/db/test-schema.sql` y, si aplica a la
   reconstruccion limpia, los scripts de inicializacion sin tocar datos legacy.
3. Crear `WodFavorite` como entidad con `@EmbeddedId` compuesto por referencias
   a usuario y WOD, y `FavoriteWodResponse` como DTO publico.
4. Crear `WodFavoriteRepository` con consulta de favoritos por usuario ordenada,
   existencia por usuario/WOD y eliminacion por esa misma clave.
5. Crear `WodFavoriteService` transaccional para resolver el usuario, verificar
   WOD global o propio, guardar de forma idempotente, borrar de forma idempotente
   y mapear la respuesta sin exponer la entidad.
6. Integrar los tres endpoints en `UserController` con `Authentication`, sin
   request body y con respuestas HTTP explicitas.
7. Anadir tests unitarios del servicio, `@WebMvcTest` del controller y tests
   Testcontainers/JPA para esquema, orden, ownership, duplicados, cascadas y
   aislamiento entre usuarios.
8. Ejecutar las verificaciones Maven, inspeccionar la base local sin alterar su
   volumen, revisar el diff y crear un commit exclusivo de la Issue.

## Decisiones tecnicas

- Se usara `LocalDateTime` para `created_at`, igual que el resto del dominio.
- Se mantendran relaciones `ManyToOne(fetch = LAZY)` y no se expondran entidades.
- La consulta de lectura filtrara por `user_id` en la base de datos, no en memoria.
- La insercion idempotente se protegera con la PK compuesta y una comprobacion
  previa dentro de la transaccion; una carrera de unicidad se tratara sin
  convertir un `PUT` repetido en un error funcional.
- No se anadira Flyway ni otra dependencia: el repositorio ya utiliza migraciones
  SQL versionadas y esquemas de test administrados por el proyecto.
- La politica de WOD global/propio se implementara mediante una consulta del
  `WodRepository` que no permita acceder a WODs personalizados ajenos.

## Verificacion

- `./mvnw validate` desde `backend/`.
- `./mvnw test` desde `backend/`, incluyendo MySQL 8.4 en Testcontainers.
- `./mvnw package` desde `backend/`.
- `git diff --check`, `git diff` y `git status`.
- En MySQL local, solo consultas de comprobacion: `SHOW TABLES`, `DESCRIBE`,
  FKs, indices y una consulta funcional; no se modificara el volumen existente
  durante las pruebas del workflow.
