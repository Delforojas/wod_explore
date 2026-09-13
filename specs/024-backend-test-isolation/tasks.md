# Tasks - Issue #24: Aislar los tests backend

## Preparación

- [x] Obtener la Issue #24 mediante GitHub MCP y extraer alcance, criterios,
  restricciones y referencias técnicas.
- [x] Revisar AGENTS, constitución, producto, arquitectura, specs relacionadas,
  entidades, tests JPA, scripts SQL y skills aplicables.
- [x] Crear `test/024-backend-test-isolation` desde el estado de desarrollo que
  contiene las dependencias necesarias de las Issues #21 y #23.
- [x] Crear y validar `spec.md`, `plan.md` y `tasks.md`.

## Aislamiento de tests

- [x] Añadir `org.testcontainers:mysql` y `org.testcontainers:junit-jupiter` en
  scope `test`, sin dependencias de producción.
- [x] Crear la infraestructura común de `MySQLContainer` con imagen `mysql:8.4`
  y propiedades JDBC dinámicas para Spring.
- [x] Crear el esquema de test sin fixtures de desarrollo y compatible con las
  entidades, enums, índices y foreign keys reales.
- [x] Activar `ddl-auto=validate` en tests y proporcionar solo las propiedades
  de test necesarias, sin leer `.env`.
- [x] Migrar los tests JPA y el contexto Spring Boot a la infraestructura aislada.
- [x] Confirmar rollback por test y destrucción del contenedor al terminar.

## CI y documentación

- [x] Añadir workflow GitHub Actions con Java 21, Maven Wrapper y validate/test/package.
- [x] Configurar artifacts de Surefire/Failsafe únicamente en caso de fallo.
- [x] Documentar ejecución local aislada, separación de fixtures y datos de
  desarrollo/producción.

## Verificación y entrega

- [x] Ejecutar las verificaciones aplicables y documentar sus resultados.
- [x] Confirmar que no se modifica `mysql_data`, la base local ni scripts de
  inicialización.
- [x] Revisar `git diff`, `git status`, secretos y alcance del cambio.
- [x] Crear el commit específico de la Issue #24 y conservar su hash (`ad1dd3c`).
- [x] Documentar la Issue #24 con rama, commit, verificaciones y estado abierto
  pendiente de validación manual.

## Resultados de verificación

- `./mvnw validate`: correcto.
- `./mvnw test`: correcto, 125 tests, 0 fallos, 0 errores y 0 omitidos.
- `./mvnw package`: correcto.
- Los tests se ejecutaron con las variables `DB_*`, `MYSQL_*` y `JWT_*`
  desactivadas y arrancaron contenedores `mysql:8.4` efímeros.
- La base local mantuvo los conteos registrados: `users=9`, `wods=22`,
  `exercises=182`, `wod_exercises=88`, `wod_results=11` y
  `exercise_results=12`.
- `git diff --check`: correcto.
- El workflow YAML fue validado sintácticamente.
