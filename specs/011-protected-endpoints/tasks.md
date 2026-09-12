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

- [ ] Añadir `spring-boot-starter-security`.
- [ ] Revisar dependencias existentes.
- [ ] Evitar duplicados.
- [ ] Compilar.

---

## T7 — Crear JwtAuthenticationFilter

- [ ] Extender `OncePerRequestFilter`.
- [ ] Leer `Authorization`.
- [ ] Detectar prefijo `Bearer `.
- [ ] Extraer JWT.
- [ ] No registrar token.

---

## T8 — Gestionar ausencia de Bearer

- [ ] Continuar filter chain cuando no exista token.
- [ ] No autenticar.
- [ ] Permitir que Spring Security determine acceso final.

---

## T9 — Validar JWT

- [ ] Utilizar `JwtService`.
- [ ] No duplicar parsing.
- [ ] Rechazar expirados.
- [ ] Rechazar manipulados.
- [ ] Rechazar malformados.

---

## T10 — Extraer subject

- [ ] Extraer email/subject del JWT.
- [ ] No aceptar subject inválido.
- [ ] No almacenar datos sensibles.

---

## T11 — Crear Authentication

- [ ] Crear autenticación para JWT válido.
- [ ] Utilizar subject como principal.
- [ ] Authorities vacías.
- [ ] No incluir password.
- [ ] No incluir hash.

---

## T12 — Establecer SecurityContext

- [ ] Establecer Authentication.
- [ ] Solo para JWT válido.
- [ ] No sobrescribir autenticación existente innecesariamente.

---

## T13 — Crear SecurityConfig

- [ ] Crear configuración.
- [ ] Exponer `SecurityFilterChain`.
- [ ] Utilizar API moderna de Spring Security.

---

## T14 — Configurar stateless

- [ ] Configurar `SessionCreationPolicy.STATELESS`.
- [ ] No utilizar sesiones para autenticación.

---

## T15 — Configurar CSRF

- [ ] Desactivar CSRF para la API stateless.
- [ ] Documentar decisión si es necesario.

---

## T16 — Configurar endpoints públicos

Permitir sin autenticación:

- [ ] `POST /api/users`.
- [ ] `POST /api/auth/login`.

---

## T17 — Proteger API

- [ ] Requerir autenticación para el resto de `/api/**`.
- [ ] No proteger accidentalmente registro.
- [ ] No proteger accidentalmente login.

---

## T18 — Registrar filtro JWT

- [ ] Añadir filtro antes de `UsernamePasswordAuthenticationFilter`.
- [ ] Confirmar orden correcto.

---

## T19 — Mantener CORS

- [ ] Revisar configuración CORS existente.
- [ ] Integrarla con Spring Security.
- [ ] Evitar duplicados.
- [ ] No ampliar orígenes sin necesidad.

---

## T20 — Configurar 401

- [ ] Implementar/configurar `AuthenticationEntryPoint`.
- [ ] Devolver `401 Unauthorized`.
- [ ] Respuesta REST/JSON.
- [ ] No exponer detalles internos.

---

## T21 — Configurar 403

- [ ] Mantener semántica `403 Forbidden`.
- [ ] Implementar `AccessDeniedHandler` si es necesario.
- [ ] Respuesta REST consistente.

---

## T22 — Test filtro sin Authorization

- [ ] No autenticar.
- [ ] Continuar filter chain.
- [ ] SecurityContext permanece sin autenticación.

---

## T23 — Test Authorization incorrecta

- [ ] Header sin `Bearer`.
- [ ] No autenticar.
- [ ] No producir errores internos.

---

## T24 — Test JWT válido

- [ ] Validar token.
- [ ] Extraer subject.
- [ ] Crear Authentication.
- [ ] Establecer SecurityContext.
- [ ] Continuar filter chain.

---

## T25 — Test JWT expirado

- [ ] Rechazar autenticación.
- [ ] Resultado HTTP final 401 para endpoint protegido.

---

## T26 — Test JWT manipulado

- [ ] Rechazar autenticación.
- [ ] Resultado HTTP final 401 para endpoint protegido.

---

## T27 — Test JWT malformado

- [ ] Rechazar autenticación.
- [ ] Resultado HTTP final 401 para endpoint protegido.

---

## T28 — Test endpoint público de registro

- [ ] `POST /api/users` sin JWT.
- [ ] Confirmar que Spring Security no devuelve 401.
- [ ] Confirmar comportamiento funcional existente.

---

## T29 — Test endpoint público de login

- [ ] `POST /api/auth/login` sin JWT.
- [ ] Confirmar que Spring Security no devuelve 401.
- [ ] Confirmar login existente.

---

## T30 — Test endpoint protegido sin JWT

- [ ] Utilizar endpoint real protegido.
- [ ] Confirmar `401 Unauthorized`.

---

## T31 — Test endpoint protegido con JWT

- [ ] Generar/utilizar JWT válido.
- [ ] Añadir `Authorization: Bearer`.
- [ ] Confirmar acceso permitido.

---

## T32 — Verificar seguridad

Confirmar que no se registran:

- [ ] JWT completos;
- [ ] `JWT_SECRET`;
- [ ] passwords;
- [ ] hashes;
- [ ] Authorization completo.

---

## T33 — Maven validate

Ejecutar:

```bash
./mvnw validate
```

- [ ] Confirmar éxito.

---

## T34 — Maven test

Ejecutar:

```bash
./mvnw test
```

- [ ] Confirmar 0 fallos.

---

## T35 — Maven package

Ejecutar:

```bash
./mvnw package
```

- [ ] Confirmar `BUILD SUCCESS`.

---

## T36 — Reconstruir backend Docker

Si procede:

```bash
docker compose up -d --build backend
```

- [ ] Confirmar contenedor activo.
- [ ] Confirmar Spring Boot arrancado.
- [ ] Confirmar conexión MySQL.

---

## T37 — Obtener JWT mediante login

Desde Postman:

```http
POST /api/auth/login
```

- [ ] Sin Authorization.
- [ ] Confirmar `200 OK`.
- [ ] Obtener JWT.
- [ ] No persistir token en repositorio.

---

## T38 — Postman sin token

Ejecutar:

```http
GET /api/exercises
```

Sin Authorization.

- [ ] Confirmar `401 Unauthorized`.

---

## T39 — Postman con token válido

Configurar:

```text
Authorization
→ Bearer Token
```

- [ ] Pegar JWT temporal.
- [ ] Ejecutar `GET /api/exercises`.
- [ ] Confirmar acceso.
- [ ] Confirmar respuesta funcional del endpoint.

---

## T40 — Postman con token inválido

- [ ] Manipular token temporal.
- [ ] Ejecutar endpoint protegido.
- [ ] Confirmar `401 Unauthorized`.

---

## T41 — Verificar endpoints públicos después de Security

- [ ] Registro sigue accesible sin JWT.
- [ ] Login sigue accesible sin JWT.
- [ ] No existen regresiones.

---

## T42 — Revisar alcance

Confirmar que NO se implementó:

- [ ] roles;
- [ ] autorización por roles;
- [ ] refresh tokens;
- [ ] logout;
- [ ] blacklist;
- [ ] OAuth;
- [ ] frontend;
- [ ] sesiones;
- [ ] cookies de autenticación;
- [ ] cambios de esquema MySQL.

---

## T43 — Verificar Issue #11

- [ ] Utilizar `delfohub`.
- [ ] Comparar implementación con Issue #11.
- [ ] Confirmar cumplimiento.
- [ ] No cerrar automáticamente.
- [ ] No hacer merge.

---

## Criterio de finalización

- [ ] Spring Security integrado.
- [ ] `JwtAuthenticationFilter` implementado.
- [ ] `SecurityFilterChain` implementado.
- [ ] API stateless.
- [ ] Registro público.
- [ ] Login público.
- [ ] API protegida.
- [ ] Sin token → 401.
- [ ] Token inválido → 401.
- [ ] Token válido → acceso.
- [ ] SecurityContext correctamente establecido.
- [ ] Tests pasan.
- [ ] Build pasa.
- [ ] Postman verificado.
- [ ] Issue #11 verificada.
- [ ] Sin funcionalidad fuera de alcance.
