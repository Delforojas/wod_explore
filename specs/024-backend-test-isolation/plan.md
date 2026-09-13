# Plan - Issue #24: Aislar los tests backend

## Enfoque

Aplicar el cambio mínimo sobre la infraestructura de tests: Testcontainers
proveerá MySQL 8.4, Spring recibirá las credenciales dinámicas del contenedor y
un script de esquema exclusivo evitará cargar datos del entorno de desarrollo.
La lógica de producción y los scripts Docker locales permanecerán sin cambios.

## Fases

1. Añadir las dependencias Testcontainers de MySQL y JUnit 5 en scope de test,
   aprovechando la versión gestionada por Spring Boot.
2. Crear una clase base de integración con un `MySQLContainer` estático,
   `@DynamicPropertySource` y el script de esquema de test.
3. Crear el esquema MySQL de test con las seis tablas reales, enums, índices y
   claves foráneas necesarias, sin datos de desarrollo.
4. Configurar el perfil de test para validar el esquema mediante
   `spring.jpa.hibernate.ddl-auto=validate` y un secreto JWT de test no sensible.
5. Hacer que los tests JPA y el test de contexto Spring Boot hereden la
   infraestructura aislada, eliminando su dependencia del MySQL local.
6. Añadir un workflow de GitHub Actions con Java 21, Maven Wrapper, los tres
   checks requeridos y artifacts de Surefire al fallar.
7. Documentar en README la ejecución local con Docker, el aislamiento, el
   rollback y la diferencia entre fixtures, desarrollo y producción.
8. Ejecutar Maven, verificar que el esquema no contamina la base local, revisar
   el workflow renderizado y comprobar el diff antes del commit.

## Integración de tests

La clase base publicará `spring.datasource.url`, usuario y contraseña usando los
valores del contenedor. Así ningún test leerá `DB_URL`, `DB_USER`,
`DB_PASSWORD` ni `.env`. El contenedor usará una base y credenciales exclusivas
de test y no se conectará al servicio Compose local.

`@DataJpaTest` conservará su transacción con rollback automático. La destrucción
del contenedor al terminar cada clase proporciona una segunda garantía de
limpieza. El test de contexto completo usará el mismo mecanismo de conexión
efímera, sin fixtures persistentes.

## Esquema

El script dedicado copiará únicamente las definiciones compatibles con los
scripts de `Docker/mysql/init/`: `users`, `wods`, `exercises`, `wod_exercises`,
`wod_results` y `exercise_results`. Se mantendrán los tipos enum, precisiones,
claves foráneas y acciones `ON DELETE` relevantes. Hibernate validará la
compatibilidad al iniciar cada contexto.

## CI

El workflow ejecutará desde `backend/`:

```text
./mvnw validate
./mvnw test
./mvnw package
```

Usará `actions/checkout`, `actions/setup-java` con Java 21 y caché Maven.
`actions/upload-artifact` se ejecutará solo si falla el job para conservar
`target/surefire-reports` y `target/failsafe-reports` cuando existan.

## Verificación

- Ejecutar `./mvnw validate`, `./mvnw test` y `./mvnw package` desde `backend/`.
- Confirmar que la suite no requiere variables de `.env` ni el contenedor
  `wod-explorer-db`.
- Confirmar que el test schema arranca sobre `mysql:8.4` y pasa `ddl-auto=validate`.
- Confirmar que la base Compose y `mysql_data` no se modifican.
- Verificar sintaxis del workflow y que solo sube reportes cuando hay fallo.
- Revisar `git diff --check`, secretos, archivos incluidos y estado Git.
