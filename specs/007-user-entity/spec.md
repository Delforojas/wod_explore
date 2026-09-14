# Spec 007 — User Entity

## Estado

Autorizada para implementar el modelo de persistencia de usuarios en el backend de WOD Explorer.

Esta spec cubre la Issue #2:

```text
Crear entidad User en Spring Boot
```

No incluye registro de usuarios, login, JWT, roles ni autorización.

---

## Contexto

WOD Explorer dispone actualmente de:

- Backend Spring Boot.
- Java 21.
- Spring Data JPA.
- MySQL 8.4.
- Hibernate con `ddl-auto=none`.
- Arquitectura basada en `controller → service → repository`.

La base de datos ya contiene una tabla `users`.

Según la inspección realizada sobre MySQL, la tabla contiene:

- `id` — PK autoincremental.
- `name` — obligatorio, máximo 100 caracteres.
- `last_name` — obligatorio, máximo 150 caracteres.
- `email` — obligatorio y único.
- `password_hash` — obligatorio, máximo 255 caracteres.
- `created_at` — fecha generada automáticamente.

Existen además relaciones desde:

```text
exercise_results.user_id → users.id
wod_results.user_id      → users.id
```

Actualmente no existe una entidad JPA `User` ni un repository asociado en el backend.

---

## Objetivo

Crear el modelo de persistencia necesario para representar usuarios desde Spring Boot.

La implementación deberá:

1. Crear la entidad JPA `User`.
2. Mapearla correctamente contra la tabla `users`.
3. Crear `UserRepository`.
4. Verificar que el mapeo coincide con el esquema MySQL real.
5. Añadir tests suficientes para validar el modelo y repository cuando sea necesario.

---

## Requisitos funcionales

### RF-1 — Entidad User

El backend deberá disponer de una entidad JPA:

```text
User
```

La entidad deberá mapear la tabla:

```text
users
```

---

### RF-2 — Identificador

El campo:

```text
id
```

deberá mapear la clave primaria de `users`.

La generación deberá respetar el autoincremento existente en MySQL.

---

### RF-3 — Nombre

El campo Java:

```text
name
```

deberá mapear:

```text
users.name
```

---

### RF-4 — Apellidos

El campo Java:

```text
lastName
```

deberá mapear:

```text
users.last_name
```

---

### RF-5 — Email

El campo Java:

```text
email
```

deberá mapear:

```text
users.email
```

La entidad deberá reflejar la obligatoriedad y unicidad definida por el esquema existente cuando corresponda.

La base de datos seguirá siendo la garantía final de unicidad.

---

### RF-6 — Password hash

El campo Java:

```text
passwordHash
```

deberá mapear:

```text
users.password_hash
```

Esta spec no define todavía cómo se genera dicho hash.

No se implementará BCrypt ni ningún mecanismo de registro.

---

### RF-7 — Fecha de creación

El campo Java:

```text
createdAt
```

deberá mapear:

```text
users.created_at
```

La implementación deberá respetar que el valor es generado por la base de datos.

No se deberá sobrescribir innecesariamente desde la aplicación.

---

### RF-8 — UserRepository

Crear:

```text
UserRepository
```

utilizando Spring Data JPA.

El repository deberá permitir las operaciones básicas de persistencia.

No se añadirán consultas específicas que no sean necesarias para esta spec.

---

## Mapeo esperado

```text
Java             MySQL
--------------------------------
id               id
name             name
lastName         last_name
email            email
passwordHash     password_hash
createdAt        created_at
```

---

## Relaciones

No será necesario mapear todavía las relaciones inversas:

```text
User → exerciseResults
User → wodResults
```

Las foreign keys existentes permanecerán intactas.

El hecho de no mapear la relación inversa no deberá modificar el esquema.

---

## Arquitectura

Esta spec afecta únicamente a la capa de persistencia.

Resultado esperado:

```text
User
  ↓
UserRepository
  ↓
users
```

No deberán crearse en esta spec:

```text
UserController
UserService
UserRegistrationRequest
UserResponse
```

---

## JPA / Hibernate

Hibernate deberá continuar configurado con:

```properties
spring.jpa.hibernate.ddl-auto=none
```

La implementación Java deberá adaptarse al esquema existente.

No deberá modificarse el esquema MySQL para adaptarlo a la entidad salvo que se detecte un bloqueo real.

Si el esquema y la entidad resultan incompatibles, la implementación deberá detenerse antes de modificar la base de datos.

---

## Base de datos

El MCP `wodsql` deberá utilizarse para verificar, cuando sea necesario:

- existencia de `users`;
- columnas;
- tipos;
- PK;
- autoincremento;
- restricciones;
- índice UNIQUE de email;
- foreign keys relacionadas.

No realizar modificaciones destructivas mediante el MCP.

---

## Integración con GitHub

La implementación está asociada a la Issue #2 del repositorio:

```text
Delforojas/wod_explore
```

El MCP `delfohub` podrá utilizarse para:

- consultar la Issue;
- comprobar requisitos;
- verificar al final que la implementación cubre su alcance.

No cerrar automáticamente la Issue.

No realizar merge automático.

---

## Testing

La implementación deberá incluir las verificaciones necesarias para garantizar:

- que la entidad compila;
- que el mapeo JPA es válido;
- que `UserRepository` puede cargarse correctamente en el contexto Spring cuando corresponda;
- que no se modifica el esquema existente.

No añadir una infraestructura de tests compleja si no aporta valor a este alcance.

---

## Seguridad

Aunque esta spec no implementa autenticación:

- `passwordHash` deberá considerarse información sensible;
- no deberá exponerse accidentalmente mediante logs;
- no deberá añadirse `toString()` que incluya el hash;
- no deberá implementarse ningún endpoint que exponga la entidad.

---

## Fuera de alcance

Esta spec NO incluye:

- registro de usuarios;
- validación de formularios de registro;
- BCrypt;
- `PasswordEncoder`;
- login;
- JWT;
- refresh tokens;
- roles;
- autorización;
- controllers de usuario;
- services de usuario;
- DTOs de usuario;
- frontend;
- modificación del esquema MySQL;
- mapeo de relaciones inversas con resultados.

Estas funcionalidades deberán abordarse mediante specs posteriores.

---

## Compatibilidad

La implementación no deberá romper:

- endpoints existentes;
- entidades existentes;
- repositories existentes;
- configuración de MySQL;
- configuración Docker;
- relaciones existentes en la base de datos.

---

## Criterios de aceptación

La spec se considerará completada cuando:

1. Exista una entidad JPA `User`.
2. `User` esté mapeada contra `users`.
3. Todos los campos definidos en esta spec estén correctamente mapeados.
4. El `id` respete el autoincremento.
5. `createdAt` respete la generación de la base de datos.
6. Exista `UserRepository`.
7. No se hayan añadido capas o funcionalidades fuera de alcance.
8. Hibernate continúe usando `ddl-auto=none`.
9. El proyecto compile correctamente.
10. Los tests relevantes pasen.
11. `wodsql` confirme que el esquema no ha sido alterado.
12. `delfohub` confirme que el alcance de la Issue #2 está cubierto.
13. La implementación respete `AGENTS.md` y `backend/AGENTS.md`.
