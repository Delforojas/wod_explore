# Plan — Spec 008 User Registration

## Objetivo técnico

Implementar el endpoint de registro de usuarios sobre la entidad y repository creados en la Spec 007.

---

## Fase 1 — Revisar documentación

Leer:

```text
AGENTS.md
backend/AGENTS.md
specs/008-user-registration/spec.md
specs/008-user-registration/plan.md
specs/008-user-registration/tasks.md
```

No modificar código hasta confirmar el alcance.

---

## Fase 2 — Revisar Issue #3

Utilizar `delfohub`.

Confirmar que la Issue #3 solicita:

- endpoint REST;
- validación;
- almacenamiento seguro de contraseña.

Detenerse si aparecen requisitos incompatibles con la spec.

---

## Fase 3 — Verificar estado de persistencia

Utilizar `wodsql`.

Confirmar:

- tabla `users`;
- UNIQUE de email;
- `password_hash`;
- `created_at`;
- ausencia de necesidad de modificar esquema.

---

## Fase 4 — Revisar User y UserRepository

Comprobar la implementación de Spec 007.

Confirmar que:

- `User` mapea correctamente `users`;
- `UserRepository` compila;
- no existen métodos adicionales innecesarios.

---

## Fase 5 — Añadir BCrypt

Añadir la dependencia mínima necesaria para disponer de:

```text
PasswordEncoder
BCryptPasswordEncoder
```

Configurar:

```text
BCryptPasswordEncoder(12)
```

No configurar autenticación completa.

---

## Fase 6 — Extender UserRepository

Añadir únicamente el método necesario para comprobar duplicados.

Preferencia:

```java
boolean existsByEmail(String email);
```

---

## Fase 7 — Crear UserRegistrationRequest

Crear un DTO de entrada.

Preferir `record`.

Campos:

```text
name
lastName
email
password
```

Aplicar Jakarta Validation.

---

## Fase 8 — Crear UserResponse

Crear DTO de salida.

Campos:

```text
id
name
lastName
email
createdAt
```

No incluir información sensible.

---

## Fase 9 — Crear excepción de email duplicado

Crear una excepción específica para representar:

```text
EMAIL_ALREADY_EXISTS
```

No mezclar la excepción con detalles HTTP si puede evitarse.

---

## Fase 10 — Crear UserService

Implementar método de registro.

Flujo:

```text
request
   ↓
normalizar email
   ↓
existsByEmail
   ↓
BCrypt
   ↓
crear User
   ↓
save
   ↓
UserResponse
```

Marcar como transaccional cuando corresponda.

---

## Fase 11 — Gestionar carrera de UNIQUE

La comprobación `existsByEmail` no garantiza unicidad concurrente.

Capturar la violación de constraint apropiada y transformarla en el mismo resultado funcional:

```text
409 Conflict
```

---

## Fase 12 — Crear UserController

Crear:

```text
POST /api/users
```

Aplicar:

```text
@Valid
```

Delegar completamente en `UserService`.

Devolver:

```text
201 Created
```

---

## Fase 13 — Ampliar GlobalExceptionHandler

Añadir tratamiento para:

```text
MethodArgumentNotValidException
EmailAlreadyExistsException
DataIntegrityViolationException
```

cuando corresponda.

Mantener el contrato de errores definido por la spec.

---

## Fase 14 — Tests de UserService

Utilizar JUnit 5 y Mockito.

Cubrir:

- registro correcto;
- normalización;
- duplicate check;
- encoder;
- save;
- response;
- email duplicado.

---

## Fase 15 — Tests del controller

Utilizar `@WebMvcTest` o estrategia equivalente.

Cubrir:

- 201;
- JSON correcto;
- 400;
- email inválido;
- campos vacíos;
- 409;
- ausencia de password/hash.

---

## Fase 16 — Verificación Maven

Desde `backend/`:

```bash
./mvnw validate
./mvnw test
./mvnw package
```

Todos deberán pasar.

---

## Fase 17 — Prueba manual

Arrancar backend.

Enviar mediante Postman:

```http
POST /api/users
```

con datos válidos.

Esperar:

```text
201 Created
```

---

## Fase 18 — Verificar MySQL

Utilizar `wodsql`.

Confirmar:

- usuario insertado;
- email normalizado;
- `password_hash` no vacío;
- hash diferente del password;
- esquema intacto.

---

## Fase 19 — Verificar duplicado

Repetir el mismo registro.

Esperar:

```text
409 Conflict
```

---

## Fase 20 — Verificar Issue #3

Utilizar `delfohub`.

Confirmar que:

- endpoint existe;
- validación existe;
- contraseña se almacena de forma segura.

No cerrar automáticamente la Issue.

---

## Resultado esperado

```text
POST /api/users
      ↓
UserController
      ↓
UserService
      ├── normalize email
      ├── duplicate check
      └── BCrypt
      ↓
UserRepository
      ↓
users
```
