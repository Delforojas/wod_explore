# Tasks — Spec 009 JWT Authentication Infrastructure

## T1 — Revisar documentación

- [x] Leer `AGENTS.md`.
- [x] Leer `backend/AGENTS.md`.
- [x] Leer `spec.md`.
- [x] Leer `plan.md`.
- [x] Leer `tasks.md`.
- [x] Confirmar alcance.

---

## T2 — Revisar Issue #7

- [x] Utilizar `delfohub`.
- [x] Consultar Issue #7.
- [x] Confirmar requisitos.
- [x] Detectar posibles contradicciones.
- [x] Detenerse si existe un bloqueo real.

---

## T3 — Revisar backend actual

- [x] Revisar `pom.xml`.
- [x] Revisar configuración existente.
- [x] Revisar `PasswordEncoderConfig`.
- [x] Revisar `User`.
- [x] Revisar `UserRepository`.
- [x] Revisar `UserService`.
- [x] Revisar tests existentes.

---

## T4 — Añadir JJWT

- [x] Añadir `jjwt-api`.
- [x] Añadir `jjwt-impl`.
- [x] Añadir `jjwt-jackson`.
- [x] Utilizar versiones compatibles entre sí.
- [x] No añadir otra librería JWT.

---

## T5 — Validar Maven

Ejecutar:

```bash
./mvnw validate
```

- [x] Confirmar éxito.

---

## T6 — Añadir propiedades JWT

- [x] Añadir `jwt.secret`.
- [x] Referenciar `JWT_SECRET`.
- [x] Añadir `jwt.expiration`.
- [x] Referenciar `JWT_EXPIRATION`.
- [x] Permitir valor de desarrollo no sensible para expiración.
- [x] No hardcodear ningún secreto.

---

## T7 — Documentar variables

Si existe `.env.example`:

- [x] Añadir `JWT_SECRET` (no aplica: no existe `.env.example`).
- [x] Añadir `JWT_EXPIRATION` (no aplica: no existe `.env.example`).
- [x] No añadir valores reales (no aplica: no existe `.env.example`).
- [x] Confirmar que `.env` continúa ignorado.

---

## T8 — Crear JwtService

- [x] Crear clase `JwtService`.
- [x] Marcar como servicio Spring.
- [x] Inyectar configuración.
- [x] No incluir lógica HTTP.

---

## T9 — Crear signing key

- [x] Derivar la clave desde `JWT_SECRET`.
- [x] Validar longitud apropiada.
- [x] Utilizar algoritmo HMAC seguro.
- [x] No mostrar la clave en logs.

---

## T10 — Implementar generación de token

- [x] Crear `generateToken`.
- [x] Utilizar email como subject.
- [x] Añadir `iat`.
- [x] Añadir `exp`.
- [x] Firmar el token.

---

## T11 — Implementar parsing

- [x] Centralizar parsing de claims.
- [x] Validar firma durante parsing.
- [x] No duplicar lógica innecesariamente.

---

## T12 — Implementar extractSubject

- [x] Extraer `sub`.
- [x] Devolver el email.
- [x] No extraer información sensible.

---

## T13 — Implementar validación

- [x] Crear operación de validación.
- [x] Validar firma.
- [x] Validar expiración.
- [x] Validar estructura.

---

## T14 — Gestionar token expirado

- [x] Considerar inválido un token expirado.
- [x] Evitar error no controlado en `isTokenValid`.

---

## T15 — Gestionar token manipulado

- [x] Considerar inválido un token con firma incorrecta.
- [x] No aceptar claims de tokens manipulados.

---

## T16 — Gestionar token malformado

- [x] Considerar inválido un token no parseable.
- [x] Evitar error no controlado en `isTokenValid`.

---

## T17 — Tests de generación

- [x] Generar token.
- [x] Confirmar token no vacío.
- [x] Confirmar formato JWT.

---

## T18 — Tests del subject

- [x] Generar token para un email.
- [x] Extraer subject.
- [x] Confirmar igualdad.

---

## T19 — Test token válido

- [x] Generar token válido.
- [x] Confirmar `isTokenValid == true`.

---

## T20 — Test token expirado

- [x] Crear configuración con expiración controlada.
- [x] Generar o construir token expirado.
- [x] Confirmar invalidez.

---

## T21 — Test token manipulado

- [x] Alterar token firmado.
- [x] Confirmar invalidez.

---

## T22 — Test token malformado

- [x] Utilizar string inválido.
- [x] Confirmar invalidez.

---

## T23 — Revisar seguridad

- [x] Confirmar que JWT no contiene password.
- [x] Confirmar que JWT no contiene password hash.
- [x] Confirmar que secreto no está hardcodeado.
- [x] Confirmar que secreto no aparece en logs.

---

## T24 — Verificar registro existente

- [x] Confirmar que `POST /api/users` sigue funcionando.
- [x] Confirmar que no requiere JWT.
- [x] Confirmar que devuelve `201` con datos válidos.

---

## T25 — Maven validate

Ejecutar:

```bash
./mvnw validate
```

- [x] Confirmar éxito.

---

## T26 — Maven test

Ejecutar:

```bash
./mvnw test
```

- [x] Confirmar 0 fallos.

---

## T27 — Maven package

Ejecutar:

```bash
./mvnw package
```

- [x] Confirmar `BUILD SUCCESS`.

---

## T28 — Revisar alcance

Confirmar que NO se ha implementado:

- [x] login;
- [x] `AuthController`;
- [x] `AuthenticationManager`;
- [x] filtro JWT;
- [x] endpoints protegidos;
- [x] roles;
- [x] refresh token;
- [x] logout;
- [x] frontend.

---

## T29 — Verificar Issue #7

- [x] Utilizar `delfohub`.
- [x] Comparar Issue #7 con la implementación.
- [x] Confirmar cumplimiento.
- [x] No cerrar automáticamente.
- [x] No hacer merge.

---

## Criterio de finalización

- [x] `JwtService` implementado.
- [x] JWT generado correctamente.
- [x] Subject correcto.
- [x] Expiración configurada.
- [x] Firma válida.
- [x] Tokens inválidos rechazados.
- [x] Tests pasan.
- [x] Build pasa.
- [x] Registro sigue funcionando.
- [x] Issue #7 verificada.
- [x] Sin funcionalidad fuera de alcance.
