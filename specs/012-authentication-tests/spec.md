# Spec 012 — Authentication Tests

## Contexto

El backend de WOD Explorer ya dispone de un sistema de autenticación basado en JWT.

Actualmente están implementados:

- Registro de usuarios mediante `POST /api/users`.

- Login mediante `POST /api/auth/login`.

- Hash de contraseñas mediante BCrypt.

- Generación y validación de JWT.

- Autenticación mediante `Authorization: Bearer <token>`.

- Protección de endpoints `/api/**`.

- Endpoints públicos de registro y login.

- Respuestas REST JSON para errores `401 Unauthorized` y `403 Forbidden`.

- Configuración stateless mediante Spring Security.

La Issue #12 requiere consolidar este sistema mediante tests automatizados específicos de autenticación.

Parte de estos comportamientos ya puede estar cubierta por tests creados durante las Specs 008, 009, 010 y 011.

Esta spec no pretende duplicar tests existentes, sino auditar la cobertura actual y completar únicamente los escenarios que falten.

---

## Objetivo

Garantizar mediante tests automatizados que el flujo completo de autenticación funciona correctamente.

La cobertura debe incluir:

- Registro correcto.

- Registro inválido.

- Email duplicado.

- Login correcto.

- Login con credenciales incorrectas.

- Obtención de JWT.

- Acceso a endpoints protegidos sin JWT.

- Acceso con JWT válido.

- Rechazo de JWT manipulado.

- Rechazo de JWT malformado.

- Rechazo de JWT expirado.

- Comportamiento del header `Authorization`.

- Acceso público a registro y login.

No se añadirá nueva funcionalidad al sistema de autenticación.

---

## Requisitos funcionales

### RF-1 — Registro correcto

Cuando se realiza `POST /api/users` con datos válidos, el sistema debe:

- Crear el usuario.

- Responder `201 Created`.

- Devolver únicamente información pública del usuario.

- No devolver la contraseña.

- No devolver `passwordHash`.

### RF-2 — Registro con email duplicado

Cuando se intenta registrar un email que ya existe, el sistema debe responder:

`409 Conflict`

La comprobación debe respetar la normalización de email existente en la aplicación.

### RF-3 — Registro inválido

El sistema debe rechazar peticiones de registro que incumplan las validaciones actuales.

Se deben comprobar al menos:

- Email inválido.

- Password inválido.

- Campos obligatorios ausentes o vacíos.

### RF-4 — Login correcto

Dado un usuario existente y unas credenciales válidas, cuando se realiza `POST /api/auth/login`, el sistema debe responder:

`200 OK`

La respuesta debe contener un JWT válido.

El token debe:

- Existir.

- No estar vacío.

- Contener como subject el email normalizado del usuario.

- Ser aceptado posteriormente por el sistema de seguridad.

### RF-5 — Login con usuario inexistente

Cuando se intenta iniciar sesión con un email que no existe, el sistema debe responder:

`401 Unauthorized`

El sistema no debe revelar si el email existe o no.

### RF-6 — Login con password incorrecto

Cuando el email existe pero la contraseña es incorrecta, el sistema debe responder:

`401 Unauthorized`

La respuesta debe ser funcionalmente equivalente a la utilizada para un usuario inexistente.

### RF-7 — Endpoint protegido sin JWT

Cuando se realiza `GET /api/exercises` sin autenticación, el sistema debe responder:

`401 Unauthorized`

con el contrato REST de seguridad existente.

### RF-8 — Endpoint protegido con JWT válido

Dado un JWT válido obtenido mediante login, cuando se realiza `GET /api/exercises` con:

`Authorization: Bearer <token>`

la petición debe superar correctamente la capa de autenticación.

El endpoint debe responder:

`200 OK`

### RF-9 — JWT manipulado

Cuando se modifica un JWT válido sin regenerar correctamente su firma, el sistema debe considerarlo inválido.

Una petición a un endpoint protegido utilizando dicho token debe responder:

`401 Unauthorized`

### RF-10 — JWT malformado

Cuando el valor enviado como Bearer Token no representa un JWT válido, el sistema debe responder:

`401 Unauthorized`

La respuesta no debe exponer:

- Excepciones internas.

- Detalles de JJWT.

- Información criptográfica.

- Stack traces.

### RF-11 — JWT expirado

Cuando se utiliza un JWT cuya fecha de expiración ya ha pasado, el sistema debe responder:

`401 Unauthorized`

El test debe controlar la expiración de manera determinista y evitar esperas reales prolongadas.

### RF-12 — Header Authorization

Debe verificarse el comportamiento de un endpoint protegido cuando:

- Falta `Authorization`.

- El esquema no es `Bearer`.

- El Bearer Token es inválido.

- El JWT está manipulado.

- El JWT está expirado.

Ninguno de estos casos debe autenticar la petición.

### RF-13 — Endpoints públicos

Los endpoints:

- `POST /api/users`

- `POST /api/auth/login`

deben permanecer accesibles sin JWT.

---

## Requisitos técnicos

Los tests deben utilizar las herramientas actuales del proyecto:

- JUnit 5.

- Spring Boot Test.

- MockMvc.

- Mockito cuando sea apropiado.

Se debe favorecer testing HTTP mediante MockMvc para verificar los flujos completos de autenticación.

Los tests unitarios existentes deben mantenerse cuando sean adecuados para comprobar componentes aislados.

---

## Estrategia de testing

Antes de crear nuevos tests se debe auditar la cobertura existente.

En particular deben revisarse los tests creados para:

- Registro de usuarios.

- Login.

- `JwtService`.

- `JwtAuthenticationFilter`.

- Configuración de Spring Security.

- Endpoints protegidos.

Si un requisito ya está correctamente cubierto por un test existente, no debe crearse otro test equivalente únicamente para cumplir esta spec.

La prioridad es completar huecos reales de cobertura.

---

## Aislamiento

Los tests deben ser:

- Deterministas.

- Repetibles.

- Independientes.

- Independientes del orden de ejecución.

Ningún test debe depender de usuarios creados manualmente mediante:

- Postman.

- MySQL CLI.

- Ejecuciones anteriores.

- Datos existentes en el volumen Docker.

Cada test debe preparar los datos que necesite.

---

## Seguridad

Los tests no deben imprimir ni almacenar innecesariamente:

- Passwords.

- Hashes BCrypt.

- JWT completos.

- `JWT_SECRET`.

- Headers `Authorization` completos.

Los secretos utilizados durante testing deben ser ficticios y específicos del entorno de test.

---

## Base de datos

Esta spec no requiere modificaciones del esquema MySQL.

No se deben añadir:

- Tablas.

- Columnas.

- Índices.

- Foreign keys.

- Migraciones.

---

## Fuera de alcance

Esta spec no incluye:

- Nuevos endpoints.

- Cambios funcionales en registro.

- Cambios funcionales en login.

- Cambios en el formato JWT.

- Refresh tokens.

- Logout.

- Blacklist o revocación de tokens.

- Roles.

- Autorización basada en roles.

- OAuth.

- Google Login.

- Sesiones.

- Cookies de autenticación.

- Cambios frontend.

- Cambios en el esquema MySQL.

Si durante los tests se descubre un bug real en la implementación existente, debe documentarse antes de realizar cambios funcionales significativos.

---

## Criterios de aceptación

La Spec 012 se considera completada cuando:

1. Se ha auditado la cobertura existente de autenticación.

2. Existe cobertura para registro correcto.

3. Existe cobertura para registro inválido.

4. Existe cobertura para email duplicado.

5. Existe cobertura para login correcto.

6. Existe cobertura para usuario inexistente.

7. Existe cobertura para password incorrecto.

8. Existe cobertura para acceso a endpoint protegido sin JWT.

9. Existe cobertura para acceso con JWT válido.

10. Existe cobertura para JWT manipulado.

11. Existe cobertura para JWT malformado.

12. Existe cobertura para JWT expirado.

13. Se verifica el comportamiento del header Authorization.

14. Registro y login permanecen públicos.

15. Los tests no dependen de datos manuales de MySQL.

16. No se introducen nuevas funcionalidades fuera del alcance.

17. No se modifica el esquema MySQL.

18. `./mvnw validate` finaliza correctamente.

19. `./mvnw test` finaliza con 0 fallos.

20. `./mvnw package` finaliza correctamente.

21. La Issue #12 queda completamente cubierta.
