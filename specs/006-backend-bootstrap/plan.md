# Plan — Spec 006 Backend Bootstrap

## Objetivo técnico

Crear un backend mínimo con Java 21 + Spring Boot 3.x + Maven dentro de `backend/`, preparado para conectarse a MySQL 8.4 y servir como base de futuras specs.

La implementación debe evitar introducir arquitectura de dominio antes de que exista una necesidad funcional.

## Decisiones técnicas

### 1. Ubicación

El backend residirá en:

```text
backend/
```

El frontend actual permanecerá separado.

### 2. Lenguaje

- Java 21.
- El `pom.xml` deberá fijar Java 21.
- No se utilizarán características posteriores.

### 3. Framework

- Spring Boot 3.x compatible con Java 21.

No se fijará en este documento un patch concreto de Spring Boot si el proyecto todavía no lo ha seleccionado. Al crear el proyecto se utilizará una versión estable 3.x compatible con Java 21 y se dejará registrada en `pom.xml`.

### 4. Build tool

Se utilizará Maven.

Se priorizará Maven Wrapper si forma parte de la generación estándar del proyecto.

Comandos de verificación preferentes si existe wrapper:

```bash
./mvnw test
./mvnw package
```

Si no existe wrapper, se utilizarán únicamente los comandos Maven realmente disponibles.

### 5. Dependencias iniciales

Dependencias previstas:

- Spring Web
- Spring Data JPA
- Validation
- MySQL Connector/J
- Spring Boot Test

No se añadirá Spring Security ni infraestructura adicional.

### 6. Paquete base

Se utilizará un paquete base único y coherente para todo el backend.

Propuesta:

```text
com.wodexplorer
```

La clase principal de Spring Boot deberá vivir en el paquete raíz para permitir el component scanning convencional.

### 7. Endpoint de salud

Se implementará:

```http
GET /api/health
```

Respuesta mínima:

```json
{
  "status": "UP"
}
```

Se implementará directamente en un controller pequeño.

No se creará service, repository ni DTO específico para este endpoint salvo que aparezca una necesidad técnica real.

### 8. Configuración

Se utilizará `application.yml` o `application.properties`.

Preferencia:

```text
application.yml
```

La configuración sensible deberá obtenerse desde variables de entorno.

Variables propuestas:

```text
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
```

La URL JDBC podrá construirse a partir de estas variables.

No se introducirán credenciales reales en archivos versionados.

### 9. MySQL

El backend se conectará a MySQL 8.4 mediante MySQL Connector/J.

La configuración JPA/Hibernate deberá impedir modificaciones automáticas del esquema.

Preferencia:

```text
spring.jpa.hibernate.ddl-auto=validate
```

Si `validate` resulta incompatible con el estado actual porque todavía no existen entidades JPA, se utilizará una configuración equivalente que mantenga la garantía principal: Hibernate no debe crear ni modificar el esquema.

Cualquier cambio de esquema queda fuera de esta spec.

### 10. Tests

Se crearán tests mínimos y útiles.

#### Web test

Verificará:

- `GET /api/health`;
- HTTP `200`;
- JSON `status = "UP"`.

El test no deberá requerir MySQL real si no es necesario.

#### Context test

Se mantendrá o creará un test de arranque del contexto únicamente si puede ejecutarse de forma determinista en el entorno de test.

Si la configuración JPA obliga a una base de datos real para cargar el contexto, se deberá configurar el entorno de test de forma explícita en lugar de ocultar el problema mediante credenciales hardcodeadas.

### 11. Persistencia

Esta spec prepara JPA pero no crea:

- entidades;
- repositories de dominio;
- services de negocio;
- migraciones;
- scripts SQL nuevos.

### 12. Seguridad

No se utilizará `root`.

La configuración deberá ser compatible con el usuario de aplicación definido para MySQL.

No se mostrarán datos de conexión en el endpoint de salud.

## Estructura prevista

```text
backend/
├── AGENTS.md
├── pom.xml
├── mvnw
├── mvnw.cmd
├── .mvn/
│   └── wrapper/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── wodexplorer/
│   │   │           ├── WodExplorerApplication.java
│   │   │           └── health/
│   │   │               └── HealthController.java
│   │   └── resources/
│   │       └── application.yml
│   └── test/
│       └── java/
│           └── com/
│               └── wodexplorer/
│                   └── health/
│                       └── HealthControllerTest.java
```

La estructura exacta podrá variar ligeramente si la herramienta de bootstrap genera archivos estándar adicionales.

## Flujo de implementación

1. Inspeccionar el repositorio y documentación obligatoria.
2. Confirmar que `backend/` no contiene una implementación previa incompatible.
3. Crear el proyecto Spring Boot mínimo.
4. Configurar Java 21 y Maven.
5. Añadir únicamente las dependencias permitidas.
6. Configurar propiedades externas para MySQL.
7. Desactivar cualquier modificación automática del esquema.
8. Implementar `GET /api/health`.
9. Añadir tests del endpoint.
10. Ejecutar tests.
11. Ejecutar compilación/package.
12. Arrancar el backend cuando la tarea lo requiera.
13. Verificar la conexión MySQL si el entorno local dispone de la base de datos y credenciales de aplicación.
14. Reportar archivos modificados y resultados.

## Verificaciones

### Verificaciones obligatorias

Ejecutar los comandos realmente disponibles.

Objetivo equivalente a:

```bash
./mvnw test
./mvnw package
```

Además:

- comprobar Java 21;
- comprobar que el endpoint responde correctamente;
- comprobar que no hay credenciales reales versionadas.

### Verificación MySQL

Cuando MySQL esté disponible:

- levantar o comprobar el servicio según `Docker/mysql/AGENTS.md`;
- proporcionar las variables de entorno requeridas;
- arrancar el backend;
- verificar que la infraestructura JPA puede inicializarse sin alterar el esquema.

No modificar el esquema para hacer pasar esta spec.

## Skills aplicables

Usar únicamente las skills necesarias.

### Java

- `java-21`
- `121-java-object-oriented-design` si aparece una decisión OO relevante
- `122-java-type-design` si aparece modelado de tipos
- `131-java-testing-unit-testing`
- `110-java-maven-best-practices`

No se prevé necesidad inicial de:

- `128-java-generics`
- `123-java-design-patterns`

salvo que aparezca una necesidad concreta durante la implementación.

### Spring Boot

- `spring-boot-3`
- `java-springboot`

## Riesgos

### Sobrearquitectura

Riesgo: crear controller/service/repository/DTO para un endpoint trivial.

Mitigación: mantener `HealthController` como implementación mínima.

### Dependencia innecesaria de MySQL en tests

Riesgo: que todos los tests fallen si Docker no está levantado.

Mitigación: separar tests web que no necesitan persistencia de verificaciones de integración reales.

### Modificación automática del esquema

Riesgo: Hibernate alterando MySQL.

Mitigación: configuración explícita de `ddl-auto` que no cree ni actualice tablas.

### Credenciales

Riesgo: versionar secretos durante la configuración inicial.

Mitigación: variables de entorno y valores de ejemplo no sensibles.

## Resultado esperado

Al finalizar esta spec existirá una base backend pequeña, compilable y verificable, lista para que futuras specs implementen ejercicios, WODs, resultados y usuarios sin tener que volver a decidir la infraestructura fundamental.
