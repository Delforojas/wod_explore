# Tasks — Spec 008 User Registration

## T1 — Revisar documentación

- [x] Leer `AGENTS.md`.
- [x] Leer `backend/AGENTS.md`.
- [x] Leer `spec.md`.
- [x] Leer `plan.md`.
- [x] Confirmar alcance.

---

## T2 — Revisar Issue #3

- [x] Utilizar `delfohub`.
- [x] Consultar Issue #3.
- [x] Confirmar requisitos.
- [x] Detenerse si existe contradicción.

---

## T3 — Verificar MySQL

- [x] Utilizar `wodsql`.
- [x] Verificar `users`.
- [x] Confirmar UNIQUE de email.
- [x] Confirmar `password_hash`.
- [x] Confirmar `created_at`.
- [x] Confirmar que no se requiere migración.

---

## T4 — Revisar Spec 007

- [x] Revisar `User`.
- [x] Revisar `UserRepository`.
- [x] Confirmar compatibilidad con esta spec.

---

## T5 — Añadir dependencia de BCrypt

- [x] Añadir dependencia mínima necesaria.
- [x] No activar Spring Security completo.
- [x] Ejecutar `./mvnw validate`.

---

## T6 — Configurar PasswordEncoder

- [x] Crear configuración necesaria.
- [x] Exponer `PasswordEncoder`.
- [x] Utilizar BCrypt.
- [x] Configurar cost factor 12.

---

## T7 — Extender UserRepository

- [x] Añadir `existsByEmail`.
- [x] No añadir consultas innecesarias.

---

## T8 — Crear UserRegistrationRequest

- [x] Crear DTO.
- [x] Preferir `record`.
- [x] Añadir `name`.
- [x] Añadir `lastName`.
- [x] Añadir `email`.
- [x] Añadir `password`.
- [x] Añadir Jakarta Validation.

---

## T9 — Crear UserResponse

- [x] Crear DTO.
- [x] Añadir `id`.
- [x] Añadir `name`.
- [x] Añadir `lastName`.
- [x] Añadir `email`.
- [x] Añadir `createdAt`.
- [x] No incluir password/hash.

---

## T10 — Crear EmailAlreadyExistsException

- [x] Crear excepción específica.
- [x] No exponer información sensible.

---

## T11 — Crear UserService

- [x] Crear servicio.
- [x] Inyectar `UserRepository`.
- [x] Inyectar `PasswordEncoder`.
- [x] Implementar registro.

---

## T12 — Normalizar email

- [x] Aplicar `trim`.
- [x] Aplicar lowercase.
- [x] Utilizar el email normalizado para duplicate check.
- [x] Persistir el email normalizado.

---

## T13 — Comprobar duplicados

- [x] Utilizar `existsByEmail`.
- [x] Lanzar `EmailAlreadyExistsException`.
- [x] No persistir si ya existe.

---

## T14 — Implementar hashing

- [x] Codificar password con BCrypt.
- [x] Asignar únicamente el hash a `passwordHash`.
- [x] No conservar password en la entidad.
- [x] No imprimir password/hash en logs.

---

## T15 — Persistir usuario

- [x] Crear `User`.
- [x] Guardar mediante `UserRepository`.
- [x] Convertir a `UserResponse`.

---

## T16 — Gestionar constraint UNIQUE

- [x] Gestionar violación concurrente de email único.
- [x] Traducirla a `409 Conflict`.
- [x] Evitar `500` para duplicados conocidos.

---

## T17 — Crear UserController

- [x] Crear controller.
- [x] Crear `POST /api/users`.
- [x] Aplicar `@Valid`.
- [x] Delegar en `UserService`.
- [x] Devolver `201 Created`.

---

## T18 — Gestionar errores de validación

- [x] Ampliar `GlobalExceptionHandler`.
- [x] Gestionar `MethodArgumentNotValidException`.
- [x] Devolver `400`.
- [x] Mantener formato definido en spec.

---

## T19 — Gestionar email duplicado

- [x] Gestionar `EmailAlreadyExistsException`.
- [x] Devolver `409`.
- [x] Utilizar código `EMAIL_ALREADY_EXISTS`.

---

## T20 — Tests de UserService

- [x] Registro válido.
- [x] Normalización email.
- [x] PasswordEncoder utilizado.
- [x] Hash persistido.
- [x] Response correcta.
- [x] Email duplicado.

---

## T21 — Tests de UserController

- [x] `201 Created`.
- [x] JSON de respuesta correcto.
- [x] Sin password.
- [x] Sin passwordHash.
- [x] `400` con datos inválidos.
- [x] Email inválido.
- [x] Campos vacíos.
- [x] `409` por duplicado.

---

## T22 — Validate

Desde `backend/`:

```bash
./mvnw validate
```

- [x] Confirmar éxito.

---

## T23 — Tests

Desde `backend/`:

```bash
./mvnw test
```

- [x] Confirmar 0 fallos.

---

## T24 — Package

Desde `backend/`:

```bash
./mvnw package
```

- [x] Confirmar `BUILD SUCCESS`.

---

## T25 — Prueba manual con Postman

- [x] Arrancar backend.
- [x] Ejecutar `POST /api/users`.
- [x] Utilizar un email de prueba.
- [x] Confirmar `201`.
- [x] Confirmar response sin datos sensibles.

---

## T26 — Verificar persistencia con wodsql

- [x] Consultar usuario creado.
- [x] Confirmar email normalizado.
- [x] Confirmar `password_hash`.
- [x] Confirmar que password original no está almacenado.
- [x] Confirmar esquema intacto.

---

## T27 — Verificar duplicado

- [x] Repetir petición con mismo email.
- [x] Confirmar `409 Conflict`.
- [x] Confirmar que no se crea un segundo usuario.

---

## T28 — Revisar alcance

- [x] No login.
- [x] No JWT.
- [x] No roles.
- [x] No autorización.
- [x] No frontend.
- [x] No cambios de esquema.

---

## T29 — Verificar Issue #3

- [x] Utilizar `delfohub`.
- [x] Comparar Issue #3 con implementación.
- [x] Confirmar cumplimiento completo.
- [x] No cerrar automáticamente.
- [x] No hacer merge.

---

## Criterio de finalización

- [x] Endpoint funciona.
- [x] Validación funciona.
- [x] BCrypt funciona.
- [x] Email duplicado devuelve 409.
- [x] Tests pasan.
- [x] Build pasa.
- [x] MySQL verificado.
- [x] Issue #3 verificada.
- [x] No existe funcionalidad fuera de alcance.
