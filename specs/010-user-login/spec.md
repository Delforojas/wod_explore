# Spec 010 — User Login

## Estado

Autorizada para implementar el login de usuarios en el backend de WOD Explorer.

Esta spec cubre la Issue #10:

```text
Implementar login de usuarios
```

Parte del trabajo ya completado en:

```text
Spec 007 — User Entity
Spec 008 — User Registration
Spec 009 — JWT Authentication Infrastructure
```

Actualmente existen:

- entidad `User`;
- `UserRepository`;
- registro de usuarios;
- contraseñas almacenadas con BCrypt;
- `JwtService`;
- generación y validación de JWT;
- configuración de `JWT_SECRET`;
- configuración de `JWT_EXPIRATION`.

Esta spec implementa únicamente el proceso de login.

---

## Contexto

WOD Explorer ya permite registrar usuarios y dispone de infraestructura JWT.

Falta permitir que un usuario existente:

1. envíe email y contraseña;
2. sea validado contra la base de datos;
3. reciba un JWT si las credenciales son correctas.

---

## Objetivo

Implementar:

```text
POST /api/auth/login
```

El flujo deberá ser:

```text
email + password
      ↓
normalización email
      ↓
UserRepository
      ↓
BCrypt matches()
      ↓
JwtService.generateToken()
      ↓
JWT
```

---

## Endpoint

### POST `/api/auth/login`

Autentica un usuario existente.

### Request

```json
{
  "email": "delfin@example.com",
  "password": "Password123!"
}
```

### Response — `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

La respuesta podrá incluir metadatos adicionales si son estrictamente necesarios, pero no deberá exponer información sensible.

---

## Requisitos funcionales

### RF-1 — Login

Una petición válida a:

```text
POST /api/auth/login
```

deberá autenticar al usuario.

Respuesta:

```text
200 OK
```

---

### RF-2 — DTO de entrada

Crear:

```text
LoginRequest
```

Campos:

```text
email
password
```

Utilizar Jakarta Validation.

---

### RF-3 — Email obligatorio

`email` deberá:

- ser obligatorio;
- no estar vacío;
- tener formato válido;
- tener máximo 150 caracteres;
- normalizarse con `trim`;
- normalizarse a lowercase.

---

### RF-4 — Password obligatorio

`password` deberá:

- ser obligatorio;
- no estar vacío.

No registrar ni devolver el password.

---

### RF-5 — Buscar usuario

Buscar usuario mediante email normalizado.

`UserRepository` deberá disponer de una operación equivalente a:

```java
Optional<User> findByEmail(String email);
```

---

### RF-6 — Usuario inexistente

Si no existe un usuario con ese email, la autenticación deberá fallar.

Respuesta:

```text
401 Unauthorized
```

No revelar si el email existe o no.

---

### RF-7 — Verificación BCrypt

La contraseña recibida deberá compararse contra:

```text
password_hash
```

utilizando:

```java
PasswordEncoder.matches(...)
```

Nunca comparar hashes manualmente.

---

### RF-8 — Password incorrecto

Si la contraseña no coincide:

```text
401 Unauthorized
```

Utilizar el mismo contrato de error que para usuario inexistente.

---

### RF-9 — JWT

Cuando las credenciales sean válidas:

```text
JwtService.generateToken(email)
```

deberá generar el token.

El subject deberá ser el email normalizado.

---

### RF-10 — DTO de salida

Crear:

```text
LoginResponse
```

Campos mínimos:

```text
token
```

No incluir:

```text
password
passwordHash
JWT_SECRET
```

---

### RF-11 — AuthService

Crear:

```text
AuthService
```

Responsabilidades:

- normalizar email;
- buscar usuario;
- verificar password;
- generar JWT;
- devolver `LoginResponse`.

---

### RF-12 — AuthController

Crear:

```text
AuthController
```

Responsabilidades:

- recibir HTTP;
- aplicar validación;
- delegar en `AuthService`;
- devolver `200 OK`.

No incluir lógica de autenticación directamente en el controller.

---

### RF-13 — Credenciales inválidas

Usuario inexistente y password incorrecto deberán devolver el mismo error.

Respuesta:

```text
401 Unauthorized
```

Formato esperado:

```json
{
  "error": "INVALID_CREDENTIALS",
  "message": "Credenciales inválidas"
}
```

No devolver mensajes como:

```text
Usuario no encontrado
Email no existe
Password incorrecto
```

---

### RF-14 — Validación

Datos inválidos deberán devolver:

```text
400 Bad Request
```

---

## Arquitectura

La arquitectura esperada será:

```text
AuthController
      ↓
AuthService
   ├── UserRepository
   ├── PasswordEncoder
   └── JwtService
```

---

## Seguridad

No registrar:

```text
password
password_hash
JWT_SECRET
token completo
```

No incluir información sensible en respuestas.

Usuario inexistente y password incorrecto deberán ser indistinguibles para el cliente.

---

## Spring Security

No es necesario implementar todavía:

```text
AuthenticationManager
UserDetailsService
SecurityFilterChain
JwtAuthenticationFilter
```

salvo que exista una necesidad técnica explícita.

El login podrá implementarse directamente mediante:

```text
UserRepository + PasswordEncoder + JwtService
```

---

## Persistencia

Esta spec NO modifica:

```text
tabla users
esquema MySQL
migraciones
```

Mantener:

```properties
spring.jpa.hibernate.ddl-auto=none
```

---

## Testing

Cubrir como mínimo:

- login correcto;
- token generado;
- subject correcto;
- email normalizado;
- usuario inexistente;
- password incorrecto;
- `401 Unauthorized`;
- email vacío;
- email inválido;
- password vacío;
- `400 Bad Request`;
- respuesta sin password;
- respuesta sin passwordHash.

Los tests unitarios no deberán depender de MySQL real.

Utilizar:

```text
JUnit 5
Mockito
MockMvc / @WebMvcTest
```

cuando corresponda.

---

## Prueba manual

Al finalizar deberá poder probarse mediante Postman.

### Request

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "delfin.postman@example.com",
  "password": "Admin123"
}
```

### Resultado esperado

```text
200 OK
```

```json
{
  "token": "..."
}
```

---

## Verificación JWT

El token devuelto deberá:

- ser un JWT válido;
- contener el email como subject;
- contener `iat`;
- contener `exp`;
- estar firmado correctamente.

No es necesario utilizar todavía el token para acceder a endpoints protegidos.

---

## Integración con GitHub

Esta spec está asociada a:

```text
Issue #10 — Implementar login de usuarios
```

Repositorio:

```text
Delforojas/wod_explore
```

Utilizar `delfohub` para:

- consultar la Issue;
- comprobar requisitos;
- verificar cumplimiento.

No cerrar automáticamente la Issue.

---

## Fuera de alcance

Esta spec NO incluye:

- protección de endpoints;
- `JwtAuthenticationFilter`;
- roles;
- autorización;
- refresh tokens;
- logout;
- frontend;
- almacenamiento de tokens;
- blacklist de tokens;
- OAuth;
- recuperación de contraseña;
- modificación del esquema MySQL.

---

## Criterios de aceptación

La spec estará completada cuando:

1. exista `POST /api/auth/login`;
2. exista `LoginRequest`;
3. exista `LoginResponse`;
4. exista `AuthService`;
5. exista `AuthController`;
6. el email se normalice;
7. usuario inexistente devuelva `401`;
8. password incorrecto devuelva `401`;
9. ambos casos utilicen `INVALID_CREDENTIALS`;
10. password correcto sea validado con BCrypt;
11. se genere JWT mediante `JwtService`;
12. el token tenga email como subject;
13. datos inválidos devuelvan `400`;
14. no se expongan datos sensibles;
15. existan tests;
16. `./mvnw validate` pase;
17. `./mvnw test` pase;
18. `./mvnw package` pase;
19. el login funcione desde Postman;
20. Issue #10 quede verificada;
21. no se implemente funcionalidad fuera de alcance.
