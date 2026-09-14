# Plan — Spec 010 User Login

## Objetivo técnico

Implementar autenticación de usuarios mediante email y password utilizando:

```text
UserRepository
PasswordEncoder
JwtService
```

y exponer:

```text
POST /api/auth/login
```

---

## Fase 1 — Revisar documentación

Leer:

```text
AGENTS.md
backend/AGENTS.md
specs/010-user-login/spec.md
specs/010-user-login/plan.md
specs/010-user-login/tasks.md
```

Confirmar alcance antes de modificar código.

---

## Fase 2 — Revisar Issue #10

Utilizar:

```text
delfohub
```

Confirmar que la Issue solicita login de usuarios.

Detectar requisitos que pertenezcan a protección de endpoints o roles.

Mantenerlos fuera de esta spec.

---

## Fase 3 — Revisar backend actual

Revisar:

```text
User
UserRepository
PasswordEncoderConfig
UserService
JwtService
GlobalExceptionHandler
```

Confirmar que las Specs 008 y 009 están disponibles.

---

## Fase 4 — Revisar usuario de prueba

Utilizar `wodsql` si es necesario.

Confirmar que existe al menos un usuario válido para la prueba manual.

No crear datos si no es necesario durante esta fase.

---

## Fase 5 — Extender UserRepository

Añadir:

```java
Optional<User> findByEmail(String email);
```

No añadir consultas innecesarias.

---

## Fase 6 — Crear LoginRequest

Crear DTO de entrada.

Preferir:

```java
record
```

Campos:

```text
email
password
```

Añadir Jakarta Validation.

---

## Fase 7 — Crear LoginResponse

Crear DTO de salida.

Campos:

```text
token
```

No incluir información sensible.

---

## Fase 8 — Crear InvalidCredentialsException

Crear excepción específica para:

```text
INVALID_CREDENTIALS
```

No diferenciar:

```text
email inexistente
password incorrecto
```

---

## Fase 9 — Crear AuthService

Inyectar:

```text
UserRepository
PasswordEncoder
JwtService
```

Implementar:

```text
login(LoginRequest)
```

---

## Fase 10 — Normalizar email

Aplicar:

```text
trim
lowercase
```

antes de buscar usuario.

---

## Fase 11 — Buscar usuario

Utilizar:

```text
findByEmail
```

Si no existe:

```text
InvalidCredentialsException
```

---

## Fase 12 — Verificar password

Utilizar:

```java
passwordEncoder.matches(rawPassword, passwordHash)
```

No recalcular hashes manualmente.

Si no coincide:

```text
InvalidCredentialsException
```

---

## Fase 13 — Generar JWT

Si las credenciales son correctas:

```java
jwtService.generateToken(user.getEmail())
```

---

## Fase 14 — Crear AuthController

Crear:

```text
POST /api/auth/login
```

Aplicar:

```text
@Valid
```

Delegar completamente en `AuthService`.

Responder:

```text
200 OK
```

---

## Fase 15 — Gestionar credenciales inválidas

Ampliar `GlobalExceptionHandler`.

Mapear:

```text
InvalidCredentialsException
```

a:

```text
401 Unauthorized
```

Respuesta:

```json
{
  "error": "INVALID_CREDENTIALS",
  "message": "Credenciales inválidas"
}
```

---

## Fase 16 — Tests de AuthService

Cubrir:

```text
login correcto
email normalizado
usuario inexistente
password incorrecto
PasswordEncoder.matches
JwtService.generateToken
```

---

## Fase 17 — Tests de AuthController

Cubrir:

```text
200 OK
token presente
400 validación
401 credenciales inválidas
```

---

## Fase 18 — Revisar seguridad

Confirmar:

```text
sin passwords en logs
sin hashes en response
sin JWT secret en response
sin diferencias entre usuario inexistente y password incorrecto
```

---

## Fase 19 — Maven validate

Desde:

```text
backend/
```

ejecutar:

```bash
./mvnw validate
```

---

## Fase 20 — Maven test

Ejecutar:

```bash
./mvnw test
```

Esperar:

```text
0 fallos
```

---

## Fase 21 — Maven package

Ejecutar:

```bash
./mvnw package
```

Esperar:

```text
BUILD SUCCESS
```

---

## Fase 22 — Prueba manual

Arrancar backend actualizado.

Desde Postman:

```http
POST /api/auth/login
```

Utilizar un usuario registrado previamente.

Confirmar:

```text
200 OK
```

y JWT en response.

---

## Fase 23 — Probar password incorrecto

Enviar mismo email con password incorrecto.

Confirmar:

```text
401 Unauthorized
```

---

## Fase 24 — Probar usuario inexistente

Enviar email no registrado.

Confirmar:

```text
401 Unauthorized
```

y mismo contrato que password incorrecto.

---

## Fase 25 — Verificar token

Comprobar mediante `JwtService` o tests que:

```text
subject = email
iat existe
exp existe
firma válida
```

---

## Fase 26 — Verificar Issue #10

Utilizar:

```text
delfohub
```

Confirmar cumplimiento.

No cerrar automáticamente.

No hacer merge.

---

## Resultado esperado

```text
POST /api/auth/login
        ↓
   AuthController
        ↓
     AuthService
    /     |      \
UserRepo BCrypt JwtService
        ↓
       JWT
```
