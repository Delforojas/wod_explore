# Plan — Spec 007 User Entity

## Objetivo técnico

Implementar la representación JPA de la tabla `users` existente en MySQL y añadir el repository asociado.

La implementación se limitará a persistencia.

No se implementará registro, seguridad ni API REST.

---

## Estado inicial

Antes de comenzar:

- Spring Boot 3.5.x.
- Java 21.
- Maven Wrapper.
- Spring Data JPA.
- MySQL 8.4.
- Hibernate con `ddl-auto=none`.
- Tabla `users` ya existente.
- No existe entidad `User`.
- No existe `UserRepository`.

---

## Fase 1 — Revisar reglas y alcance

Leer:

```text
AGENTS.md
backend/AGENTS.md
specs/007-user-entity/spec.md
```

Confirmar que ninguna regla del proyecto contradice esta implementación.

No modificar código durante esta fase.

---

## Fase 2 — Consultar Issue #2

Usar `delfohub` para consultar la Issue #2.

Confirmar:

- título;
- descripción;
- requisitos;
- ausencia de requisitos adicionales no cubiertos por la spec.

Si existe una contradicción relevante, detener la implementación.

---

## Fase 3 — Verificar el esquema real

Usar `wodsql` para inspeccionar:

```text
users
```

Confirmar:

- `id`;
- `name`;
- `last_name`;
- `email`;
- `password_hash`;
- `created_at`;
- tipos;
- nullability;
- PK;
- autoincremento;
- UNIQUE de email;
- foreign keys relacionadas.

No modificar datos ni esquema.

---

## Fase 4 — Revisar convenciones existentes

Examinar las entidades existentes del backend, por ejemplo:

```text
Exercise
Wod
```

cuando existan.

Identificar convenciones actuales sobre:

- package;
- anotaciones JPA;
- constructores;
- getters/setters;
- naming;
- uso o no de Lombok;
- tipos para timestamps.

La nueva entidad deberá respetar el estilo existente.

No introducir una convención nueva sin necesidad.

---

## Fase 5 — Crear User

Crear la entidad:

```text
User
```

en el package correspondiente.

Mapear:

```text
@Entity
@Table(name = "users")
```

Añadir los campos definidos en la spec.

---

## Fase 6 — Configurar id

Mapear:

```text
id
```

como clave primaria.

Utilizar una estrategia compatible con el `AUTO_INCREMENT` existente.

Preferencia esperada:

```text
GenerationType.IDENTITY
```

si coincide con las convenciones y el esquema real.

---

## Fase 7 — Mapear columnas

Mapear explícitamente cuando sea necesario:

```text
lastName      → last_name
passwordHash  → password_hash
createdAt     → created_at
```

Para los nombres coincidentes puede utilizarse el comportamiento estándar si resulta claro.

Respetar longitudes y nullability cuando sea razonable reflejarlas en JPA.

---

## Fase 8 — Configurar createdAt

Elegir un tipo Java compatible con el tipo MySQL real.

El valor deberá considerarse generado por la base de datos.

Configurar el campo de manera que Hibernate no intente insertar un valor innecesario si el esquema genera el timestamp automáticamente.

La decisión exacta deberá basarse en la inspección real del esquema.

---

## Fase 9 — Evitar relaciones innecesarias

No añadir:

```text
@OneToMany
exerciseResults
wodResults
```

en esta spec.

Las foreign keys existentes funcionan independientemente del mapeo inverso.

---

## Fase 10 — Crear UserRepository

Crear:

```text
UserRepository
```

en el package de repositories.

Extender el repository estándar utilizado en el proyecto, previsiblemente:

```java
JpaRepository<User, Integer>
```

o el tipo de ID real correspondiente.

No añadir todavía:

```text
findByEmail
existsByEmail
```

salvo que la Issue #2 o el código existente los requieran.

Esas operaciones pertenecen principalmente al registro de usuarios.

---

## Fase 11 — Verificar compilación

Ejecutar desde `backend/`:

```bash
./mvnw validate
```

y después:

```bash
./mvnw test
```

Corregir únicamente problemas relacionados con el alcance de esta spec.

---

## Fase 12 — Añadir tests si aportan valor

Evaluar el sistema de tests existente.

Añadir tests únicamente si permiten comprobar de forma útil:

- carga de la entidad;
- carga de `UserRepository`;
- mapeo de persistencia.

Evitar introducir una configuración de integración compleja únicamente para comprobar que una clase existe.

---

## Fase 13 — Ejecutar package

Ejecutar:

```bash
./mvnw package
```

El build deberá finalizar correctamente.

---

## Fase 14 — Verificar esquema después de la implementación

Usar `wodsql` de nuevo.

Confirmar que:

- `users` mantiene las mismas columnas;
- las constraints no han cambiado;
- las foreign keys siguen intactas;
- Hibernate no ha alterado el esquema.

---

## Fase 15 — Verificar Issue

Usar `delfohub` para consultar nuevamente la Issue #2.

Comparar:

```text
requisitos de Issue #2
vs.
implementación realizada
```

Confirmar que su alcance está cubierto.

No cerrar automáticamente la Issue.

---

## Decisiones técnicas

### Sin relaciones inversas

No se mapearán en `User` porque:

- no son necesarias para esta Issue;
- aumentan el acoplamiento;
- pueden añadirse cuando una funcionalidad real las requiera.

---

### Sin DTOs

Esta spec afecta únicamente a persistencia.

No existe todavía API de usuarios.

---

### Sin lógica de negocio

No crear `UserService`.

La entidad y repository constituyen el alcance completo de esta fase.

---

### Sin hashing

`passwordHash` se mapeará como campo persistente.

La generación del hash se implementará en la spec de registro.

---

### Esquema como fuente de verdad

Debido a:

```properties
spring.jpa.hibernate.ddl-auto=none
```

la entidad deberá adaptarse al esquema MySQL real y no al contrario.

---

## Riesgos

### Tipo de created_at

Debe comprobarse el tipo exacto en MySQL antes de elegir:

```text
Instant
LocalDateTime
OffsetDateTime
```

No asumirlo sin inspeccionar el esquema.

---

### Alteración accidental del esquema

No modificar:

```text
ddl-auto
```

ni activar generación automática.

---

### Expansión de alcance

No añadir funcionalidades de la futura Spec 008 durante esta implementación.

Especialmente:

- `existsByEmail`;
- hashing;
- service;
- controller;
- DTOs;
- endpoint POST.

---

## Resultado esperado

Al finalizar:

```text
Spring Boot
    │
    ▼
User Entity
    │
    ▼
UserRepository
    │
    ▼
users (MySQL)
```

sin cambios en el esquema ni funcionalidades de usuario adicionales.
