# SDD - Issue #44: Modelo de datos para WODs personalizados

## Estado

Spec de implementacion para la capa de persistencia de WODs personalizados.
La Issue cubre MySQL, entidades JPA, enums, converters necesarios,
repositories y tests. No implementa endpoints REST, autorizacion de recursos,
DTOs publicos ni frontend.

La rama de trabajo sera `feat/044-modelo-datos-wods-personalizados`, derivada de
`main`, que ya contiene el contrato de la Issue #43.

## Objetivo

Preparar el modelo de dominio y persistencia para que los WODs creados por
usuarios puedan almacenarse con ownership, ejercicios ordenados y
prescripciones normalizadas, sin romper la lectura del catalogo global ni
mantener dos fuentes de verdad para los nuevos datos.

## Alcance

### Incluido

- Migracion SQL versionada `V029__add_custom_wod_persistence.sql` compatible con
  MySQL 8.4.
- `wods.owner_id` nullable con FK a `users` y categoria opcional `METCON`.
- Constraints de propietario, categoria, posiciones y prescripciones.
- Tabla `wod_exercise_prescriptions` relacionada con `wod_exercises`.
- Transformacion de `wod_exercises.reps` no nulo a prescripciones `REPS`.
- Entidades JPA para propietario, categoria, prescripciones y relaciones
  ordenadas.
- Repositories para consultas por propietario y carga determinista de ejercicios
  y prescripciones.
- Enums persistidos por nombre, sin ordinales ni cambios a la semantica de las
  unidades de resultados existentes.
- Esquema MySQL efimero de tests y tests de repositorio/migracion.

### Excluido

- Controllers, services de CRUD de WODs personalizados y DTOs REST.
- Nuevas rutas, autenticacion, autorizacion o cambios de ownership en resultados.
- Pantallas, cliente API o componentes frontend.
- Eliminacion de `wod_exercises.reps` en esta migracion.
- Fabricacion de peso, distancia o tiempo para datos legacy sin magnitud.

## Modelo de persistencia

### WOD y propietario

- `wods.owner_id IS NULL` identifica un WOD global del catalogo.
- `wods.owner_id IS NOT NULL` identifica un WOD personalizado.
- `owner_id` referencia `users.id` con `ON DELETE CASCADE` para impedir que un
  WOD personalizado se convierta en global al eliminar su propietario.
- `Wod` tendra una relacion `ManyToOne` lazy y opcional hacia `User`.
- La categoria se modelara como `WodCategory` nullable con el unico valor
  `METCON`; `WodType` seguira limitado a `FOR_TIME`, `AMRAP` y `EMOM`.

### Ejercicios y prescripciones

- `wod_exercises` conserva `exercise_id`, `position` y `reps` legacy.
- `position` sera positiva y unica dentro de cada WOD mediante `CHECK` y
  `UNIQUE (wod_id, position)`.
- `wod_exercise_prescriptions` tendra:
  - `id INT AUTO_INCREMENT PRIMARY KEY`;
  - `wod_exercise_id INT NOT NULL` con `ON DELETE CASCADE`;
  - `value DECIMAL(8,2) NOT NULL` y positiva;
  - `unit VARCHAR(20) NOT NULL` limitada a `REPS`, `METERS`, `KG`, `SECONDS` y
    `OTHER`;
  - `unit_label VARCHAR(100)` obligatoria y no vacia solo para `OTHER`;
  - unicidad de `(wod_exercise_id, unit)` e indice por `wod_exercise_id`.
- `REPS` y `SECONDS` exigiran valores enteros en la base de datos. La
  compatibilidad de la unidad con `Exercise.measurementType` y la cardinalidad
  exacta de cada matriz se validaran en el service de una Issue posterior,
  porque MySQL no puede expresar esa regla con un `CHECK` entre tablas.
- La relacion JPA de `Wod` a `WodExercise` y de `WodExercise` a prescripciones
  sera lazy, con cascade de escritura y orphan removal solo hacia hijos del WOD.
  Ninguna relacion aplicara cascade hacia `Exercise`.
- `reps` seguira mapeado como `insertable=false, updatable=false` durante la
  transicion para no romper el catalogo actual. Las nuevas prescripciones seran
  la fuente de verdad de los WODs personalizados; la retirada del campo legacy
  queda fuera de #44.

### Migracion de datos

1. Anadir `owner_id` y categoria nullable, sin asignar propietario a ningun WOD
   existente.
2. Crear la tabla de prescripciones y sus constraints.
3. Copiar cada `reps` no nulo como prescripcion `REPS` con valor decimal.
4. No crear filas para `reps` nulo ni reinterpretar valores legacy como peso,
   distancia o tiempo.
5. Mantener `reps` solo para compatibilidad de lectura hasta una migracion
   posterior que confirme que sus consumidores han migrado.

## Repositories

- `WodRepository.findByOwner_Id(Integer, Pageable)` devolvera solo WODs del
  propietario indicado y admitira el orden `createdAt DESC, id DESC` mediante
  `Pageable`.
- `WodRepository.findByIdAndOwner_Id(Integer, Integer)` resolvera un WOD propio
  sin mezclar globales ni recursos de otra cuenta.
- `WodExerciseRepository` cargara ejercicio y prescripciones con `JOIN FETCH`
  intencional, ordenando por `position ASC` y evitando N+1 en el detalle futuro.
- Las consultas de catalogo global existentes conservaran su comportamiento y
  no exigiran `owner`.

## Compatibilidad y seguridad

- Hibernate continuara con `spring.jpa.hibernate.ddl-auto=none` en produccion.
- Los tests usaran `ddl-auto=validate` sobre MySQL 8.4 de Testcontainers.
- No se expondran entidades como contratos REST en esta Issue.
- No se añadiran autenticacion, autorizacion ni credenciales.
- `Exercise` seguira siendo catalogo compartido y no sera eliminado por
  cascadas de WOD.

## Criterios de aceptacion

- [x] La migracion versionada añade propietario y categoria sin perder los WODs
  globales existentes.
- [x] La migracion crea prescripciones normalizadas y copia `reps` legacy sin
  fabricar magnitudes ni mantener escritura dual.
- [x] Las tablas tienen PK, FK, nulabilidad, positividad, unicidad y `ON DELETE`
  coherentes.
- [x] Un WOD global sigue siendo persistible y consultable por el catalogo
  actual.
- [x] Un WOD personalizado puede persistirse con propietario, campos actuales,
  categoria y relaciones ordenadas.
- [x] Las prescripciones soportan las cinco unidades y `OTHER` con etiqueta.
- [x] Las posiciones duplicadas o no positivas son rechazadas por MySQL.
- [x] Las relaciones JPA son explicitas, lazy y no eliminan ejercicios del
  catalogo.
- [x] Los enums se persisten por nombres estables, nunca por ordinales.
- [x] Las consultas por propietario no devuelven WODs globales o ajenos.
- [x] Los tests cubren migracion, constraints, FKs, conversiones, cascadas y
  ordenacion.
- [x] `./mvnw validate`, `./mvnw test` y `./mvnw package` pasan.
- [x] No se modifican endpoints, DTOs publicos, autorizacion ni frontend.

## Referencias

- `specs/043-diseno-wods-personalizados/spec.md`
- `backend/src/main/java/com/wodexplorer/entity/Wod.java`
- `backend/src/main/java/com/wodexplorer/entity/WodExercise.java`
- `backend/src/main/java/com/wodexplorer/entity/Exercise.java`
- `backend/src/main/java/com/wodexplorer/entity/User.java`
- `backend/src/main/java/com/wodexplorer/repository/WodRepository.java`
- `backend/src/main/java/com/wodexplorer/repository/WodExerciseRepository.java`
- `Docker/mysql/init/wod_explorer_wods.sql`
- `Docker/mysql/init/wod_explorer_wod_exercises.sql`
- `backend/src/test/resources/db/test-schema.sql`
