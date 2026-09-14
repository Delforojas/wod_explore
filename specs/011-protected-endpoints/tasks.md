# Tasks — Spec 011 Protected Endpoints with JWT

## T1 — Revisar documentación

- [x] Leer `AGENTS.md`.
- [x] Leer `backend/AGENTS.md`.
- [x] Leer `spec.md`.
- [x] Leer `plan.md`.
- [x] Leer `tasks.md`.
- [x] Confirmar alcance.

---

## T2 — Revisar Issue #11

- [x] Consultar Issue #11 mediante `delfohub`.
- [x] Comparar Issue con Spec 011.
- [x] Detectar contradicciones.
- [x] Detenerse ante bloqueos reales.

---

## T3 — Auditar seguridad existente

- [x] Revisar `pom.xml`.
- [x] Revisar `JwtService`.
- [x] Revisar `JwtConfiguration`.
- [x] Revisar `JwtProperties`.
- [x] Revisar `AuthController`.
- [x] Revisar `UserController`.
- [x] Revisar `CorsConfig`.
- [x] Revisar `PasswordEncoderConfig`.
- [x] Revisar `GlobalExceptionHandler`.

---

## T4 — Inventariar endpoints

- [x] Identificar endpoints bajo `/api/**`.
- [x] Confirmar rutas públicas.
- [x] Confirmar rutas protegidas.
- [x] No abrir rutas adicionales innecesariamente.

---

## T5 — Decidir validación de usuario

- [x] Evaluar si debe consultarse `UserRepository`.
- [x] Evitar complejidad innecesaria.
- [x] No implementar roles.
- [x] No implementar `UserDetailsService` salvo necesidad real.

---

## T6 — Añadir Spring Security

- [x] Añadir `spring-boot-starter-security`.
- [x] Revisar dependencias existentes.
- [x] Evitar duplicados.
- [x] Compilar.

---

## T7 — Crear JwtAuthenticationFilter

- [x] Extender `OncePerRequestFilter`.
- [x] Leer `Authorization`.
- [x] Detectar prefijo `Bearer `.
- [x] Extraer JWT.
- [x] No registrar token.

---

## T8 — Gestionar ausencia de Bearer

- [x] Continuar filter chain cuando no exista token.
- [x] No autenticar.
- [x] Permitir que Spring Security determine acceso final.

---

## T9 — Validar JWT

- [x] Utilizar `JwtService`.
- [x] No duplicar parsing.
- [x] Rechazar expirados.
- [x] Rechazar manipulados.
- [x] Rechazar malformados.

---

## T10 — Extraer subject

- [x] Extraer email/subject del JWT.
- [x] No aceptar subject inválido.
- [x] No almacenar datos sensibles.

---

## T11 — Crear Authentication

- [x] Crear autenticación para JWT válido.
- [x] Utilizar subject como principal.
- [x] Authorities vacías.
- [x] No incluir password.
- [x] No incluir hash.

---

## T12 — Establecer SecurityContext

- [x] Establecer Authentication.
- [x] Solo para JWT válido.
- [x] No sobrescribir autenticación existente innecesariamente.

---

## T13 — Crear SecurityConfig

- [x] Crear configuración.
- [x] Exponer `SecurityFilterChain`.
- [x] Utilizar API moderna de Spring Security.

---

## T14 — Configurar stateless

- [x] Configurar `SessionCreationPolicy.STATELESS`.
- [x] No utilizar sesiones para autenticación.

---

## T15 — Configurar CSRF

- [x] Desactivar CSRF para la API stateless.
- [x] Documentar decisión si es necesario.

---

## T16 — Configurar endpoints públicos

Permitir sin autenticación:

- [x] `POST /api/users`.
- [x] `POST /api/auth/login`.

---

## T17 — Proteger API

- [x] Requerir autenticación para el resto de `/api/**`.
- [x] No proteger accidentalmente registro.
- [x] No proteger accidentalmente login.

---

## T18 — Registrar filtro JWT

- [x] Añadir filtro antes de `UsernamePasswordAuthenticationFilter`.
- [x] Confirmar orden correcto.

---

## T19 — Mantener CORS

- [x] Revisar configuración CORS existente.
- [x] Integrarla con Spring Security.
- [x] Evitar duplicados.
- [x] No ampliar orígenes sin necesidad.

---

## T20 — Configurar 401

- [x] Implementar/configurar `AuthenticationEntryPoint`.
- [x] Devolver `401 Unauthorized`.
- [x] Respuesta REST/JSON.
- [x] No exponer detalles internos.

---

## T21 — Configurar 403

- [x] Mantener semántica `403 Forbidden`.
- [x] Implementar `AccessDeniedHandler` si es necesario.
- [x] Respuesta REST consistente.

---

## T22 — Test filtro sin Authorization

- [x] No autenticar.
- [x] Continuar filter chain.
- [x] SecurityContext permanece sin autenticación.

---

## T23 — Test Authorization incorrecta

- [x] Header sin `Bearer`.
- [x] No autenticar.
- [x] No producir errores internos.

---

## T24 — Test JWT válido

- [x] Validar token.
- [x] Extraer subject.
- [x] Crear Authentication.
- [x] Establecer SecurityContext.
- [x] Continuar filter chain.

---

## T25 — Test JWT expirado

- [x] Rechazar autenticación.
- [x] Resultado HTTP final 401 para endpoint protegido.

---

## T26 — Test JWT manipulado

- [x] Rechazar autenticación.
- [x] Resultado HTTP final 401 para endpoint protegido.

---

## T27 — Test JWT malformado

- [x] Rechazar autenticación.
- [x] Resultado HTTP final 401 para endpoint protegido.

---

## T28 — Test endpoint público de registro

- [x] `POST /api/users` sin JWT.
- [x] Confirmar que Spring Security no devuelve 401.
- [x] Confirmar comportamiento funcional existente.

---

## T29 — Test endpoint público de login

- [x] `POST /api/auth/login` sin JWT.
- [x] Confirmar que Spring Security no devuelve 401.
- [x] Confirmar login existente.

---

## T30 — Test endpoint protegido sin JWT

- [x] Utilizar endpoint real protegido.
- [x] Confirmar `401 Unauthorized`.

---

## T31 — Test endpoint protegido con JWT

- [x] Generar/utilizar JWT válido.
- [x] Añadir `Authorization: Bearer`.
- [x] Confirmar acceso permitido.

---

## T32 — Verificar seguridad

Confirmar que no se registran:

- [x] JWT completos;
- [x] `JWT_SECRET`;
- [x] passwords;
- [x] hashes;
- [x] Authorization completo.

---

## T33 — Maven validate

Ejecutar:

```bash
./mvnw validate
```

- [x] Confirmar éxito.

---

## T34 — Maven test

Ejecutar:

```bash
./mvnw test
```

- [x] Confirmar 0 fallos.

---

## T35 — Maven package

Ejecutar:

```bash
./mvnw package
```

- [x] Confirmar `BUILD SUCCESS`.

---

## T36 — Reconstruir backend Docker

Si procede:

```bash
docker compose up -d --build backend
```

- [x] Confirmar contenedor activo.
- [x] Confirmar Spring Boot arrancado.
- [x] Confirmar conexión MySQL.

---

## T37 — Obtener JWT mediante login

Desde Postman:

```http
POST /api/auth/login
```

- [x] Sin Authorization.
- [x] Confirmar `200 OK`.
- [x] Obtener JWT.
- [x] No persistir token en repositorio.

---

## T38 — Postman sin token

Ejecutar:

```http
GET /api/exercises
```

Sin Authorization.

- [x] Confirmar `401 Unauthorized`.

---

## T39 — Postman con token válido

Configurar:

```text
Authorization
→ Bearer Token
```

- [x] Pegar JWT temporal.
- [x] Ejecutar `GET /api/exercises`.
- [x] Confirmar acceso.
- [x] Confirmar respuesta funcional del endpoint.

---

## T40 — Postman con token inválido

- [x] Manipular token temporal.
- [x] Ejecutar endpoint protegido.
- [x] Confirmar `401 Unauthorized`.

---

## T41 — Verificar endpoints públicos después de Security

- [x] Registro sigue accesible sin JWT.
- [x] Login sigue accesible sin JWT.
- [x] No existen regresiones.

---

## T42 — Revisar alcance

Confirmar que NO se implementó:

- [x] roles;
- [x] autorización por roles;
- [x] refresh tokens;
- [x] logout;
- [x] blacklist;
- [x] OAuth;
- [x] frontend;
- [x] sesiones;
- [x] cookies de autenticación;
- [x] cambios de esquema MySQL.

---

## T43 — Verificar Issue #11

- [x] Utilizar `delfohub`.
- [x] Comparar implementación con Issue #11.
- [x] Confirmar cumplimiento.
- [x] No cerrar automáticamente.
- [x] No hacer merge.

---

## Criterio de finalización

- [x] Spring Security integrado.
- [x] `JwtAuthenticationFilter` implementado.
- [x] `SecurityFilterChain` implementado.
- [x] API stateless.
- [x] Registro público.
- [x] Login público.
- [x] API protegida.
- [x] Sin token → 401.
- [x] Token inválido → 401.
- [x] Token válido → acceso.
- [x] SecurityContext correctamente establecido.
- [x] Tests pasan.
- [x] Build pasa.
- [x] Verificaciones manuales HTTP equivalentes a Postman.
- [x] Issue #11 verificada.
- [x] Sin funcionalidad fuera de alcance.

> Las verificaciones manuales de esta spec se ejecutaron mediante `curl` contra el backend Dockerizado; no se utilizó la interfaz de Postman.
