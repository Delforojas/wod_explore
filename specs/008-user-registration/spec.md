# Spec 008 — User Registration

## Estado

Autorizada para implementar el registro de usuarios en el backend de WOD Explorer.

Esta spec cubre la Issue #3:

```text
Implementar registro de usuarios
```

Parte de la implementación completada en la Spec 007:

- entidad `User`;
- `UserRepository`;
- tabla `users` existente y compatible.

No incluye login, JWT, roles ni autorización.

---

## Contexto

WOD Explorer dispone actualmente de:

- Backend Spring Boot 3.5.x.
- Java 21.
- Spring Data JPA.
- Jakarta Validation.
- MySQL 8.4.
- Hibernate con `ddl-auto=none`.
- Entidad `User`.
- `UserRepository`.
- Tabla `users` existente.

La tabla `users` contiene:

```text
id
name
last_name
email
password_hash
created_at
```

El email dispone de restricción `UNIQUE`.

Actualmente no existe:

- endpoint de registro;
- DTO de registro;
- servicio de usuarios;
- hashing de contraseña;
- tratamiento específico de email duplicado.

---

## Objetivo

Permitir crear usuarios mediante una API REST segura.

El backend deberá:

1. recibir los datos de registro;
2. validarlos;
3. normalizar el email;
4. impedir emails duplicados;
5. codificar la contraseña con BCrypt;
6. persistir el usuario mediante `UserRepository`;
7. devolver una respuesta segura sin contraseña ni hash.

---

## Endpoint

### POST `/api/users`

Crea un nuevo usuario.

### Request

```json
{
  "name": "Delfin",
  "lastName": "Rojas",
  "email": "delfin@example.com",
  "password": "ExamplePassword123"
}
```

### Response — `201 Created`

```json
{
  "id": 1,
  "name": "Delfin",
  "lastName": "Rojas",
  "email": "delfin@example.com",
  "createdAt": "2026-09-12T16:00:00"
}
```

Nunca deberán devolverse:

```text
password
passwordHash
password_hash
```

---

## Requisitos funcionales

### RF-1 — Registro

Una petición válida a:

```text
POST /api/users
```

deberá crear un usuario.

Respuesta:

```text
201 Created
```

---

### RF-2 — Nombre

`name` deberá:

- ser obligatorio;
- no estar vacío;
- tener máximo 100 caracteres.

---

### RF-3 — Apellidos

`lastName` deberá:

- ser obligatorio;
- no estar vacío;
- tener máximo 150 caracteres.

---

### RF-4 — Email

`email` deberá:

- ser obligatorio;
- no estar vacío;
- tener formato válido;
- normalizarse antes de comprobar duplicados y persistir.

Normalización mínima:

```text
trim
lowercase
```

---

### RF-5 — Email único

Si el email normalizado ya existe, el sistema deberá rechazar la petición.

Respuesta:

```text
409 Conflict
```

La restricción `UNIQUE` de MySQL seguirá siendo la garantía final de unicidad.

---

### RF-6 — Contraseña

`password` deberá:

- ser obligatoria;
- no estar vacía.

La contraseña nunca deberá persistirse en texto plano.

---

### RF-7 — BCrypt

La contraseña deberá codificarse mediante BCrypt antes de persistir.

El valor almacenado en:

```text
password_hash
```

deberá ser distinto de la contraseña original.

---

### RF-8 — DTO de entrada

Crear:

```text
UserRegistrationRequest
```

Campos:

```text
name
lastName
email
password
```

Utilizar Jakarta Validation.

---

### RF-9 — DTO de salida

Crear:

```text
UserResponse
```

Campos:

```text
id
name
lastName
email
createdAt
```

No incluir campos sensibles.

---

### RF-10 — UserService

Crear:

```text
UserService
```

Responsabilidades:

- normalización;
- comprobación de duplicados;
- hashing;
- persistencia;
- transformación a response.

---

### RF-11 — UserController

Crear:

```text
UserController
```

Responsabilidades:

- recibir HTTP;
- activar validación;
- delegar en `UserService`;
- devolver `201 Created`.

No incluir lógica de negocio.

---

### RF-12 — Errores de validación

Las peticiones inválidas deberán devolver:

```text
400 Bad Request
```

---

### RF-13 — Email duplicado

Los emails duplicados deberán devolver:

```text
409 Conflict
```

Esto deberá cubrir tanto:

- detección previa mediante repository;
- violación final de la restricción `UNIQUE`.

---

## Contrato de errores

### 400 Bad Request

Formato esperado:

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Datos inválidos",
  "details": {
    "email": "Debe ser un email válido"
  }
}
```

`details` podrá contener los campos inválidos.

---

### 409 Conflict

Formato esperado:

```json
{
  "error": "EMAIL_ALREADY_EXISTS",
  "message": "El email ya está registrado"
}
```

---

## Arquitectura

Mantener:

```text
UserController
      ↓
UserService
      ↓
UserRepository
      ↓
MySQL
```

No introducir lógica de negocio en controller.

---

## Seguridad

Utilizar BCrypt mediante un `PasswordEncoder`.

Configuración recomendada:

```text
BCryptPasswordEncoder(12)
```

No implementar todavía Spring Security completo.

No implementar:

- login;
- JWT;
- filtros;
- roles;
- autorización.

No registrar:

- passwords;
- hashes;
- tokens.

---

## Persistencia

Utilizar la entidad `User` creada en la Spec 007.

No modificar la tabla `users`.

Mantener:

```properties
spring.jpa.hibernate.ddl-auto=none
```

---

## Testing

Cubrir como mínimo:

- registro correcto;
- `201 Created`;
- email normalizado;
- contraseña codificada;
- hash distinto de password;
- response sin password;
- nombre vacío;
- apellidos vacíos;
- email vacío;
- email inválido;
- email duplicado;
- `400 Bad Request`;
- `409 Conflict`.

Utilizar:

- JUnit 5;
- Mockito;
- `@WebMvcTest` cuando corresponda.

Los tests unitarios no dependerán de MySQL real.

---

## Verificación con MySQL

Al finalizar podrá utilizarse `wodsql` para comprobar un registro controlado.

Verificar:

- usuario insertado;
- email normalizado;
- `password_hash` presente;
- contraseña original no almacenada;
- esquema sin modificaciones.

---

## Integración con GitHub

Esta spec está asociada a la Issue #3 de:

```text
Delforojas/wod_explore
```

`delfohub` podrá utilizarse para:

- consultar requisitos;
- verificar cumplimiento;
- actualizar la Issue al finalizar.

No cerrar automáticamente la Issue durante la implementación.

---

## Fuera de alcance

Esta spec NO incluye:

- login;
- JWT;
- refresh tokens;
- logout;
- roles;
- autorización;
- recuperación de contraseña;
- OAuth;
- frontend;
- formulario de registro;
- modificación del esquema MySQL.

---

## Criterios de aceptación

La spec estará completada cuando:

1. exista `POST /api/users`;
2. una petición válida devuelva `201 Created`;
3. los datos estén validados;
4. el email se normalice;
5. los duplicados devuelvan `409`;
6. la contraseña se almacene con BCrypt;
7. nunca se almacene password en claro;
8. la respuesta no exponga información sensible;
9. exista `UserService`;
10. exista `UserController`;
11. existan los DTOs necesarios;
12. los tests pasen;
13. `./mvnw validate` pase;
14. `./mvnw test` pase;
15. `./mvnw package` pase;
16. `wodsql` confirme persistencia segura;
17. `delfohub` confirme que la Issue #3 está cubierta;
18. no se implemente funcionalidad fuera de alcance.
