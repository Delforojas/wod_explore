# Tasks - Issue #44: Modelo de datos para WODs personalizados

- [x] Crear la migracion versionada V029 para owner, categoria y prescripciones.
- [x] Anadir constraints, indices, FKs y acciones `ON DELETE` del nuevo modelo.
- [x] Migrar `wod_exercises.reps` no nulo a prescripciones `REPS`.
- [x] Actualizar el esquema de test y las definiciones de inicializacion limpias.
- [x] Crear enums de categoria y unidad con persistencia por nombre.
- [x] Mapear owner y categoria en `Wod` sin romper WODs globales.
- [x] Mapear relaciones ordenadas de WOD a ejercicios y prescripciones.
- [x] Mantener `reps` legacy como columna JPA de solo lectura.
- [x] Crear consultas de WOD por propietario y detalle ordenado sin N+1 evitable.
- [x] Anadir tests de migracion, constraints, foreign keys y conversiones.
- [x] Anadir tests JPA de ownership, orden, prescripciones y cascadas seguras.
- [x] Ejecutar `./mvnw validate` y corregir cualquier error de compilacion.
- [x] Ejecutar `./mvnw test` y corregir cualquier fallo.
- [x] Ejecutar `./mvnw package` y corregir cualquier fallo.
- [x] Revisar diff, status, alcance y ausencia de secretos.
- [x] Crear el commit exclusivo de la Issue #44.
- [x] Documentar el commit, verificaciones y rama en la Issue sin cerrarla.
