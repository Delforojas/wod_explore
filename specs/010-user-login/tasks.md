# Tasks — Spec 010 User Login

## T1 — Revisar documentación

- [x] Leer `AGENTS.md`.
- [x] Leer `backend/AGENTS.md`.
- [x] Leer `spec.md`.
- [x] Leer `plan.md`.
- [x] Leer `tasks.md`.
- [x] Confirmar alcance.

---

## T2 — Revisar Issue #10

- [x] Utilizar `delfohub`.
- [x] Consultar Issue #10.
- [x] Confirmar requisitos.
- [x] Detectar contradicciones.
- [x] Detenerse si existe un bloqueo real.

---

## T3 — Revisar backend actual

- [x] Revisar `User`.
- [x] Revisar `UserRepository`.
- [x] Revisar `PasswordEncoderConfig`.
- [x] Revisar `JwtService`.
- [x] Revisar `GlobalExceptionHandler`.
- [x] Confirmar compatibilidad.

---

## T4 — Verificar usuario de prueba

- [x] Utilizar `wodsql` si es necesario.
- [x] Confirmar que existe un usuario registrado.
- [x] No modificar esquema.

---

## T5 — Extender UserRepository

- [x] Añadir `findByEmail`.
- [x] Utilizar `Optional<User>`.
- [x] No añadir queries innecesarias.

---

## T6 — Crear LoginRequest

- [x] Crear DTO.
- [x] Preferir `record`.
- [x] Añadir `email`.
- [x] Añadir `password`.
- [x] Añadir validación `@NotBlank`.
- [x] Añadir validación `@Email`.
- [x] Añadir máximo 150 al email.

---

## T7 — Crear LoginResponse

- [x] Crear DTO.
- [x] Añadir únicamente `token`.
- [x] No incluir password.
- [x] No incluir password hash.

---

## T8 — Crear InvalidCredentialsException

- [x] Crear excepción específica.
- [x] No distinguir motivo concreto.
- [x] No incluir datos sensibles.

---

## T9 — Crear AuthService

- [x] Crear servicio.
- [x] Inyectar `UserRepository`.
- [x] Inyectar `PasswordEncoder`.
- [x] Inyectar `JwtService`.
- [x] Implementar método de login.

---

## T10 — Normalizar email

- [x] Aplicar `trim`.
- [x] Aplicar lowercase.
- [x] Utilizar email normalizado para búsqueda.

---

## T11 — Buscar usuario

- [x] Utilizar `findByEmail`.
- [x] Lanzar `InvalidCredentialsException` si no existe.

---

## T12 — Verificar password

- [x] Utilizar `PasswordEncoder.matches`.
- [x] Comparar password recibido contra hash almacenado.
- [x] No generar un hash nuevo para comparar.
- [x] Lanzar `InvalidCredentialsException` si no coincide.

---

## T13 — Generar JWT

- [x] Utilizar `JwtService.generateToken`.
- [x] Usar email normalizado como subject.
- [x] No generar JWT si las credenciales son inválidas.

---

## T14 — Crear AuthController

- [x] Crear controller.
- [x] Crear `POST /api/auth/login`.
- [x] Aplicar `@Valid`.
- [x] Delegar en `AuthService`.
- [x] Devolver `200 OK`.

---

## T15 — Gestionar credenciales inválidas

- [x] Ampliar `GlobalExceptionHandler`.
- [x] Gestionar `InvalidCredentialsException`.
- [x] Devolver `401 Unauthorized`.
- [x] Código `INVALID_CREDENTIALS`.
- [x] Mensaje genérico.

---

## T16 — Tests de login correcto

- [x] Mockear usuario existente.
- [x] Mockear password válido.
- [x] Verificar llamada a `JwtService`.
- [x] Confirmar token retornado.

---

## T17 — Test email normalizado

- [x] Login con espacios.
- [x] Login con mayúsculas.
- [x] Confirmar búsqueda mediante email normalizado.

---

## T18 — Test usuario inexistente

- [x] Repository devuelve vacío.
- [x] Confirmar `InvalidCredentialsException`.
- [x] Confirmar que no se genera JWT.

---

## T19 — Test password incorrecto

- [x] Usuario existe.
- [x] `PasswordEncoder.matches` devuelve false.
- [x] Confirmar `InvalidCredentialsException`.
- [x] Confirmar que no se genera JWT.

---

## T20 — Tests del controller

- [x] `200 OK` con credenciales válidas.
- [x] Response contiene `token`.
- [x] `400` email vacío.
- [x] `400` email inválido.
- [x] `400` password vacío.
- [x] `401` credenciales inválidas.

---

## T21 — Revisar seguridad

- [x] Usuario inexistente y password incorrecto tienen mismo error.
- [x] No se devuelve password.
- [x] No se devuelve password hash.
- [x] No se registra password.
- [x] No se registra JWT secret.

---

## T22 — Maven validate

Ejecutar:

```bash
./mvnw validate
```

- [x] Confirmar éxito.

---

## T23 — Maven test

Ejecutar:

```bash
./mvnw test
```

- [x] Confirmar 0 fallos.

---

## T24 — Maven package

Ejecutar:

```bash
./mvnw package
```

- [x] Confirmar `BUILD SUCCESS`.

---

## T25 — Arrancar backend

- [x] Reconstruir backend si utiliza Docker.
- [x] Confirmar arranque correcto.
- [x] Confirmar conexión con MySQL.

---

## T26 — Probar login correcto con Postman

Enviar:

```http
POST /api/auth/login
```

- [x] Utilizar usuario existente.
- [ ] Utilizar password correcto.
- [ ] Confirmar `200 OK`.
- [ ] Confirmar token presente.

---

## T27 — Probar password incorrecto

- [x] Enviar password incorrecto.
- [x] Confirmar `401 Unauthorized`.
- [x] Confirmar `INVALID_CREDENTIALS`.

---

## T28 — Probar usuario inexistente

- [x] Enviar email inexistente.
- [x] Confirmar `401 Unauthorized`.
- [x] Confirmar mismo contrato de error.

---

## T29 — Verificar JWT

- [x] Confirmar JWT válido.
- [x] Confirmar subject correcto.
- [x] Confirmar `iat`.
- [x] Confirmar `exp`.
- [x] Confirmar firma válida.

---

## T30 — Revisar alcance

Confirmar que NO se ha implementado:

 - [x] filtro JWT;
 - [x] protección de endpoints;
 - [x] roles;
 - [x] autorización;
 - [x] refresh tokens;
 - [x] logout;
 - [x] frontend;
 - [x] cambios de esquema MySQL.

---

## T31 — Verificar Issue #10

- [x] Utilizar `delfohub`.
- [x] Comparar Issue #10 con implementación.
- [x] Confirmar cumplimiento.
- [x] No cerrar automáticamente.
- [x] No hacer merge.

---

## Criterio de finalización

- [ ] Login funciona contra un usuario real con password conocida.
- [x] `POST /api/auth/login` existe.
- [x] BCrypt valida contraseña.
- [x] JWT se genera.
- [x] Credenciales inválidas devuelven 401.
- [x] Validación devuelve 400.
- [x] Tests pasan.
- [x] Build pasa.
- [ ] Postman verificado con credenciales válidas.
- [x] Issue #10 verificada.
- [x] Sin funcionalidad fuera de alcance.
