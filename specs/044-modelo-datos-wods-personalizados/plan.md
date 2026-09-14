# Plan - Issue #44: Modelo de datos para WODs personalizados

## Estrategia

Aplicar el cambio minimo sobre la persistencia existente. Se reutilizaran las
tablas `wods` y `wod_exercises`, se añadira ownership nullable y se normalizaran
las prescripciones en una tabla hija. La migracion sera aditiva y conservara
los datos globales actuales. Hibernate no generara ni modificara el esquema.

## Fases

1. Crear `V029__add_custom_wod_persistence.sql` con los `ALTER TABLE`, la tabla
   de prescripciones, constraints, FKs, indices y la copia controlada de
   `wod_exercises.reps`.
2. Actualizar las definiciones de inicializacion y el esquema aislado de tests
   para que una base limpia tenga el modelo final esperado por JPA, sin cambiar
   fixtures ni introducir propietarios artificiales.
3. Añadir `WodCategory` y `WodExercisePrescriptionUnit` con persistencia por
   nombre, y ampliar `Wod` con owner, categoria y relaciones de hijos.
4. Ampliar `WodExercise` con prescripciones ordenadas y mapeo legacy de `reps`
   en solo lectura. Crear `WodExercisePrescription` sin cascade hacia
   `Exercise`.
5. Añadir consultas de `WodRepository` por propietario y consulta de detalle de
   `WodExerciseRepository` con ejercicio/prescripciones en orden determinista.
6. Crear tests JPA para ownership, orden, relaciones, cascadas, aislamiento y
   constraints; crear un test Testcontainers que aplique V029 sobre un esquema
   legacy y verifique la conversion de `reps`.
7. Ejecutar las verificaciones backend y de esquema requeridas, revisar el diff
   y confirmar que el cambio local en `.opencode/commands/finish-issue.md` no
   entra en el commit.

## Impacto SQL

- `wods`: dos columnas nullable, un indice de owner y una FK con cascada al
  eliminar un usuario. Los 22 WODs existentes permanecen globales.
- `wod_exercises`: un `CHECK` positivo y una unicidad por posicion. Las 88
  relaciones existentes tienen posiciones validas y no se borran.
- Nueva tabla `wod_exercise_prescriptions`: 67 filas de compatibilidad para las
  67 relaciones con `reps` no nulo observadas; ninguna magnitud se inventa.
- No se eliminan columnas, tablas, WODs, ejercicios ni resultados.

## Decisiones de JPA

- Usar `FetchType.LAZY` en relaciones `ManyToOne` y colecciones.
- Usar `cascade = CascadeType.ALL` y `orphanRemoval = true` únicamente para
  hijos propiedad de `Wod`/`WodExercise`.
- Mantener `Exercise` como referencia sin cascada.
- Utilizar `@OrderBy` y queries con `JOIN FETCH` para orden y carga intencional.
- Mantener enums con `@Enumerated(EnumType.STRING)`.

## Verificacion

- `./mvnw validate` desde `backend/`.
- `./mvnw test` desde `backend/`, incluyendo MySQL 8.4 efimero.
- `./mvnw package` desde `backend/`.
- `git diff --check` y revision de `git diff`/`git status`.
- En la base local, antes de cualquier escritura, confirmar que el esquema
  actual coincide con la evidencia de #43. La migracion se verificara primero
  en Testcontainers; no se alterara el volumen local durante este workflow.
- Comprobar `SHOW TABLES`, `DESCRIBE`, FKs, indices y una consulta funcional en
  la base efimera de pruebas.
