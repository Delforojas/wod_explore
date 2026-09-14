# SDD - Issue #24: Aislar los tests backend y reproducir MySQL

## Estado

Planificación inicial para la rama `test/024-backend-test-isolation`, derivada
del estado de desarrollo que contiene las Issues #21 y #23 y la corrección de
seguridad previa de `.env.example`.

## Objetivo

Permitir que la suite backend se ejecute contra una instancia MySQL 8.4
controlada y efímera, sin depender del `.env`, de la base local del desarrollador
ni de datos persistentes compartidos.

## Alcance

- Añadir Testcontainers como dependencia de test para levantar MySQL 8.4.
- Crear una infraestructura común de integración que publique las propiedades
  JDBC dinámicas del contenedor a Spring.
- Proporcionar un esquema de test sin datos de desarrollo y compatible con las
  entidades y los scripts SQL reales.
- Ejecutar los tests JPA y el contexto Spring Boot sobre el contenedor aislado.
- Mantener rollback transaccional en tests JPA y destruir el contenedor al
  terminar cada clase de test.
- Añadir un workflow GitHub Actions que ejecute `./mvnw validate`, `./mvnw test`
  y `./mvnw package` en Java 21, subiendo reportes Surefire cuando falle.
- Documentar la ejecución local aislada y la separación entre datos de test,
  desarrollo y producción.

## Criterios de aceptación

- La suite backend pasa en una máquina limpia con Docker disponible sin requerir
  `.env` ni un MySQL previamente iniciado.
- Los tests JPA usan MySQL 8.4 mediante Testcontainers o una estrategia
  equivalente explícita.
- El esquema efímero contiene las tablas, columnas, tipos y claves necesarias
  para las entidades actuales, sin cargar fixtures de desarrollo.
- Los tests JPA conservan rollback por test y el contenedor se elimina al
  terminar la suite, sin escribir en `mysql_data`.
- CI ejecuta `./mvnw validate`, `./mvnw test` y `./mvnw package` con Java 21 y
  conserva los logs/reportes de Surefire en caso de fallo.
- La ejecución local no requiere credenciales del `.env` ni contamina la base
  compartida del desarrollador.
- La documentación diferencia fixtures de test, datos de desarrollo y datos de
  producción.
- No se modifican tablas, datos ni scripts de inicialización de la base local.

## Restricciones

- Mantener Java 21, Spring Boot 3.5.x, Maven Wrapper y MySQL 8.4.
- No modificar el esquema de desarrollo ni ejecutar operaciones destructivas
  sobre `mysql_data`.
- No cargar los dumps de desarrollo como fixtures de test.
- No cambiar contratos REST, dominio funcional ni lógica de negocio.
- No añadir dependencias de producción; Testcontainers será solo de test.
- No introducir una base embebida distinta de MySQL para ocultar incompatibilidades.
- No versionar credenciales ni depender de valores del `.env`.

## Referencias técnicas

- `backend/pom.xml` define Spring Boot, Maven Wrapper, JPA y MySQL Connector/J.
- `WodResultRepositoryTest` y `ExerciseResultRepositoryTest` usan
  `@DataJpaTest` con `Replace.NONE` y actualmente dependen de MySQL externo.
- `WodExplorerApplicationTests` carga el contexto completo y también requiere
  datasource.
- `backend/src/main/java/com/wodexplorer/entity/` contiene las entidades cuyo
  mapeo debe validar Hibernate.
- `Docker/mysql/init/` contiene el esquema y los datos de desarrollo que sirven
  como referencia, pero no deben ejecutarse como fixtures de test.
- `.env` y el volumen `mysql_data` pertenecen únicamente al entorno local.

## Decisiones resueltas

- Se usará `org.testcontainers:mysql` y `org.testcontainers:junit-jupiter` en
  scope `test`, con la versión gestionada por Spring Boot.
- Se usará la imagen exacta `mysql:8.4`.
- Cada clase de integración heredará una infraestructura común con un
  contenedor estático y propiedades JDBC dinámicas; Testcontainers lo destruirá
  al terminar la clase.
- El esquema de test será un script dedicado sin inserts de desarrollo. Las
  tablas, enums, relaciones y restricciones se mantendrán alineadas con los
  scripts existentes y `ddl-auto=validate` comprobará el mapeo JPA.
- Los tests JPA mantendrán `@DataJpaTest`, cuyo rollback por test evita retener
  registros dentro del contenedor.
- CI dependerá del Docker disponible en el runner, sin servicio MySQL
  persistente ni credenciales manuales.
