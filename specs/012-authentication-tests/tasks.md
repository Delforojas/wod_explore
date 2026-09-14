### `tasks.md`

```md
# Tasks — Spec 012 Authentication Tests

## T1 — Auditar tests existentes

- [x] Leer los tests actuales del backend relacionados con autenticación.
- [x] Identificar cobertura existente de registro.
- [x] Identificar cobertura existente de login.
- [x] Identificar cobertura existente de JWT.
- [x] Identificar cobertura existente de endpoints protegidos.
- [x] Documentar qué escenarios faltan.
- [x] Evitar duplicar cobertura existente.

---

## T2 — Tests de registro correcto

- [x] Verificar `POST /api/users`.
- [x] Comprobar `201 Created`.
- [x] Comprobar campos públicos de respuesta.
- [x] Comprobar que no aparece `password`.
- [x] Comprobar que no aparece `passwordHash`.

---

## T3 — Tests de registro inválido

- [x] Probar email inválido.
- [x] Probar password inválido.
- [x] Probar campos obligatorios ausentes.
- [x] Verificar código HTTP esperado.
- [x] Verificar formato de error actual.

---

## T4 — Test de email duplicado

- [x] Crear usuario inicial.
- [x] Repetir registro con mismo email.
- [x] Verificar `409 Conflict`.
- [x] Verificar error de email ya existente.
- [x] Comprobar normalización si corresponde.

---

## T5 — Test de login correcto

- [x] Preparar usuario con password BCrypt válido.
- [x] Ejecutar `POST /api/auth/login`.
- [x] Verificar `200 OK`.
- [x] Verificar campo `token`.
- [x] Verificar que el token no está vacío.

---

## T6 — Tests de credenciales incorrectas

- [x] Login con email inexistente.
- [x] Verificar `401 Unauthorized`.
- [x] Login con password incorrecto.
- [x] Verificar `401 Unauthorized`.
- [x] Verificar que ambas respuestas son funcionalmente equivalentes.
- [x] Confirmar que no se revela existencia del usuario.

---

## T7 — Test de endpoint protegido sin JWT

- [x] Ejecutar `GET /api/exercises`.
- [x] No enviar `Authorization`.
- [x] Verificar `401 Unauthorized`.
- [x] Verificar `error = UNAUTHORIZED`.
- [x] Verificar mensaje REST esperado.

---

## T8 — Test de endpoint protegido con JWT válido

- [x] Obtener JWT mediante login.
- [x] Ejecutar `GET /api/exercises`.
- [x] Enviar `Authorization: Bearer <token>`.
- [x] Verificar acceso correcto.
- [x] Verificar `200 OK`.

---

## T9 — Test de JWT manipulado

- [x] Obtener JWT válido.
- [x] Alterar el token sin regenerar la firma.
- [x] Usarlo contra `/api/exercises`.
- [x] Verificar `401 Unauthorized`.

---

## T10 — Test de token malformado

- [x] Enviar un valor Bearer que no sea un JWT válido.
- [x] Verificar `401 Unauthorized`.
- [x] Confirmar que no se exponen detalles internos de JJWT.

---

## T11 — Test de JWT expirado

- [x] Generar un JWT expirado de forma determinista.
- [x] Enviarlo a `/api/exercises`.
- [x] Verificar `401 Unauthorized`.
- [x] Evitar esperas largas o tests dependientes del tiempo real.

---

## T12 — Tests del header Authorization

- [x] Verificar ausencia de header.
- [x] Verificar esquema distinto de Bearer.
- [x] Verificar Bearer inválido.
- [x] Confirmar que ninguno autentica la petición.

---

## T13 — Verificar endpoints públicos

- [x] Confirmar que `POST /api/users` funciona sin JWT.
- [x] Confirmar que `POST /api/auth/login` funciona sin JWT.
- [x] Confirmar que Spring Security no exige autenticación para esos endpoints.

---

## T14 — Revisar aislamiento de tests

- [x] Confirmar que los tests no dependen de datos manuales de MySQL.
- [x] Confirmar que los tests pueden repetirse.
- [x] Confirmar que no dependen del orden.
- [x] Confirmar que no imprimen secretos.
- [x] Confirmar que no modifican el esquema.

---

## T15 — Ejecutar suite Maven

Desde `backend/`:

- [x] Ejecutar `./mvnw validate`.
- [x] Ejecutar `./mvnw test`.
- [x] Confirmar 0 fallos.
- [x] Ejecutar `./mvnw package`.
- [x] Confirmar build correcto.

---

## T16 — Revisión final

- [x] Revisar `git diff`.
- [x] Confirmar que los cambios corresponden únicamente a tests o correcciones imprescindibles.
- [x] Confirmar que no se añadieron funcionalidades fuera de alcance.
- [x] Confirmar que no hubo cambios MySQL.
- [x] Actualizar este `tasks.md`.
- [x] Preparar resumen final para Issue #12.
```
