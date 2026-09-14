# AGENTS.md — Backend

## Ámbito

Este archivo aplica a todo el contenido dentro de `backend/`.

Las reglas globales definidas en el `AGENTS.md` raíz siguen siendo obligatorias.

Si existe conflicto entre este archivo y el `AGENTS.md` raíz, prevalecen las reglas globales salvo que una spec autorice explícitamente una excepción.

---

## Stack

El backend utiliza:

- Java 21
- Spring Boot 3.5.x
- Maven Wrapper
- Spring Web
- Spring Data JPA
- Jakarta Validation
- MySQL 8.4
- JUnit 5
- Mockito

La persistencia principal es MySQL.

---

## Arquitectura

Mantener la separación:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

### Controller

Responsabilidades:

- Recibir requests HTTP.
- Validar entrada mediante DTOs.
- Delegar en servicios.
- Devolver respuestas HTTP.

No debe contener lógica de negocio.

### Service

Responsabilidades:

- Lógica de negocio.
- Coordinación entre repositories.
- Transformaciones necesarias.
- Gestión de transacciones cuando corresponda.

La lógica reutilizable debe permanecer fuera de los controllers.

### Repository

Responsabilidades:

- Acceso a persistencia.
- Consultas JPA.
- Consultas específicas cuando sean necesarias.

No debe contener lógica de negocio.

### Entity

Las entidades representan el modelo de persistencia.

No utilizar entidades JPA directamente como contratos públicos de la API cuando exista riesgo de acoplamiento o exposición de campos internos.

### DTO

Usar DTOs específicos para requests y responses.

Preferir `record` cuando el DTO sea inmutable y no exista una razón técnica para utilizar una clase convencional.

---

## Java

Utilizar características compatibles con Java 21.

Priorizar:

- Código legible.
- Nombres descriptivos.
- Métodos pequeños.
- Responsabilidad única.
- Inmutabilidad cuando sea posible.
- Tipado claro.

Evitar:

- Métodos excesivamente largos.
- Clases con múltiples responsabilidades.
- Duplicación innecesaria.
- Abstracciones prematuras.
- Reflection salvo necesidad justificada.

---

## Spring Boot

Seguir las convenciones estándar de Spring Boot.

Preferir inyección por constructor.

Correcto:

```java
public ExerciseService(ExerciseRepository exerciseRepository) {
    this.exerciseRepository = exerciseRepository;
}
```

Evitar field injection:

```java
@Autowired
private ExerciseRepository exerciseRepository;
```

No añadir dependencias nuevas salvo que:

1. Sean necesarias para cumplir la spec activa.
2. Exista una justificación técnica clara.
3. No exista ya una solución disponible en el stack actual.

---

## JPA / Hibernate

Hibernate no debe gestionar automáticamente cambios de esquema.

Mantener:

```properties
spring.jpa.hibernate.ddl-auto=none
```

Las entidades deben respetar el esquema MySQL existente.

Antes de asumir columnas, tipos, índices o relaciones, utilizar el MCP `wodsql` cuando sea relevante.

No modificar el esquema desde JPA para adaptar la base de datos al código.

---

## MySQL

La base de datos es una fuente real de información del proyecto.

Cuando una tarea dependa del esquema o de datos existentes:

- Consultar mediante `wodsql`.
- No asumir el estado de la BD únicamente por entidades o scripts SQL.
- Comprobar constraints y foreign keys cuando sean relevantes.

No utilizar el usuario `root` desde el backend.

No incluir credenciales reales en código ni archivos versionados.

---

## Seguridad

Nunca:

- Almacenar contraseñas en texto plano.
- Devolver hashes de contraseña.
- Registrar secretos.
- Incluir tokens o credenciales en logs.
- Exponer stack traces al cliente.

Para contraseñas utilizar algoritmos específicamente diseñados para hashing de passwords según la spec activa.

No introducir autenticación, JWT, roles o autorización salvo que estén incluidos explícitamente en una spec.

---

## API REST

Utilizar rutas consistentes bajo:

```text
/api/**
```

Utilizar códigos HTTP apropiados.

Ejemplos:

```text
200 OK
201 Created
204 No Content
400 Bad Request
404 Not Found
409 Conflict
```

No devolver `200 OK` indiscriminadamente para todos los casos.

Los errores expuestos al usuario deberán mantener una estructura consistente.

---

## Validación

Utilizar Jakarta Validation para validaciones de request cuando corresponda.

Ejemplos:

```java
@NotBlank
@Email
@Size
```

No duplicar en controllers validaciones que puedan expresarse declarativamente mediante DTOs.

Las reglas de negocio deben permanecer en servicios.

---

## Gestión de errores

Centralizar errores HTTP cuando sea posible mediante:

```text
@RestControllerAdvice
```

No añadir `try/catch` repetitivos en cada controller.

No devolver detalles internos innecesarios.

---

## Testing

Toda funcionalidad nueva deberá incluir tests proporcionales a su impacto.

Priorizar:

- Tests unitarios para servicios.
- `@WebMvcTest` para controllers.
- Tests de repository cuando exista lógica de consulta relevante.
- Tests de integración únicamente cuando aporten valor real.

Utilizar JUnit 5 y Mockito.

Los tests unitarios no deberán depender de MySQL real salvo que la spec lo requiera explícitamente.

---

## Maven

Utilizar siempre el wrapper del proyecto:

```bash
./mvnw
```

No asumir que Maven global está instalado.

Antes de considerar una tarea backend completada ejecutar, cuando corresponda:

```bash
./mvnw validate
./mvnw test
./mvnw package
```

Todos los comandos deben ejecutarse desde `backend/`.

---

## Skills

Cuando sean relevantes, utilizar las skills disponibles relacionadas con:

- Java.
- Spring Boot.
- JPA.
- Spring Security.
- JUnit.
- Mockito.

Las skills proporcionan patrones y conocimiento técnico.

No pueden contradecir:

1. La spec activa.
2. Este `AGENTS.md`.
3. El `AGENTS.md` raíz.

---

## MCP

### `wodsql`

Utilizar para:

- Inspeccionar tablas.
- Comprobar columnas.
- Revisar foreign keys.
- Consultar índices.
- Validar datos existentes.
- Comprobar resultados cuando la tarea lo necesite.

No utilizarlo para modificaciones destructivas salvo autorización explícita.

### `delfohub`

Utilizar para:

- Consultar Issues.
- Comprobar requisitos.
- Revisar Pull Requests.
- Consultar ramas y estado remoto.
- Verificar que una implementación cubre una Issue.

No cerrar Issues, realizar merge ni ejecutar acciones destructivas salvo instrucción explícita.

---

## Specs

La spec activa define el alcance.

No implementar funcionalidad fuera de la spec aunque:

- Parezca necesaria.
- Exista una Issue relacionada.
- Facilite una implementación futura.

Si se detecta una contradicción entre la spec y otra fuente de requisitos, detener la implementación y documentarla.

---

## Verificación final

Antes de completar una tarea:

1. Revisar los cambios realizados.
2. Ejecutar los tests relevantes.
3. Ejecutar el build cuando corresponda.
4. Comprobar que no existen secretos versionados.
5. Comprobar que no se ha ampliado el alcance.
6. Verificar el cumplimiento de la spec activa.
