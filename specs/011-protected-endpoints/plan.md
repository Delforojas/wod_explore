# Plan — Spec 011 Protected Endpoints with JWT

## Objetivo técnico

Integrar la infraestructura JWT existente con Spring Security para autenticar peticiones HTTP.

---

## Fase 1 — Revisar documentación

Leer:

```text
AGENTS.md
backend/AGENTS.md
specs/011-protected-endpoints/spec.md
specs/011-protected-endpoints/plan.md
specs/011-protected-endpoints/tasks.md
```

Confirmar alcance.

---

## Fase 2 — Revisar Issue #11

Utilizar:

```text
delfohub
```

Consultar:

```text
Issue #11
```

Comparar Issue, spec y reglas del proyecto.

Detenerse ante contradicciones reales.

---

## Fase 3 — Revisar seguridad existente

Inspeccionar:

```text
pom.xml
JwtService
JwtConfiguration
JwtProperties
AuthController
AuthService
UserController
CorsConfig
PasswordEncoderConfig
GlobalExceptionHandler
application.properties
```

Confirmar que Specs 008, 009 y 010 están integradas.

---

## Fase 4 — Revisar endpoints existentes

Identificar todos los endpoints actuales bajo:

```text
/api/**
```

Confirmar cuáles deben permanecer públicos.

Por defecto:

```text
POST /api/users
POST /api/auth/login
```

El resto deberá estar protegido.

---

## Fase 5 — Decidir validación del usuario

Determinar durante Plan si:

```text
JWT válido + subject válido
```

es suficiente para esta arquitectura o si además debe comprobarse que el usuario continúa existiendo en `users`.

Preferir la solución más simple que mantenga las garantías definidas por la spec.

No introducir `UserDetailsService` si no aporta una necesidad real.

---

## Fase 6 — Añadir Spring Security

Añadir:

```text
spring-boot-starter-security
```

Comprobar compatibilidad con Spring Boot actual.

No introducir dependencias redundantes.

---

## Fase 7 — Crear JwtAuthenticationFilter

Crear filtro basado en:

```text
OncePerRequestFilter
```

Leer:

```text
Authorization
```

Aceptar exclusivamente:

```text
Bearer <token>
```

---

## Fase 8 — Validar JWT

Delegar completamente en:

```text
JwtService
```

No duplicar lógica criptográfica dentro del filtro.

---

## Fase 9 — Crear Authentication

Para JWT válido:

```text
subject/email
      ↓
Authentication
      ↓
SecurityContext
```

No almacenar password ni hash.

No implementar roles.

---

## Fase 10 — Configurar SecurityFilterChain

Crear:

```text
SecurityConfig
```

Configurar:

```text
CSRF disabled
STATELESS
public endpoints
protected /api/**
JWT filter
401 handling
403 handling
```

---

## Fase 11 — Mantener CORS

Integrar la configuración existente sin romperla.

No introducir configuraciones CORS duplicadas o contradictorias.

---

## Fase 12 — Configurar 401

Crear o configurar un:

```text
AuthenticationEntryPoint
```

para devolver JSON controlado.

Esperado:

```text
401 Unauthorized
```

---

## Fase 13 — Configurar 403

Configurar:

```text
AccessDeniedHandler
```

si es necesario para mantener respuesta REST consistente.

Esperado:

```text
403 Forbidden
```

---

## Fase 14 — Tests del filtro

Cubrir:

```text
sin Authorization
Authorization incorrecta
Bearer válido
Bearer inválido
token expirado
token manipulado
token malformado
SecurityContext
```

---

## Fase 15 — Tests de seguridad HTTP

Comprobar:

```text
POST /api/users → público
POST /api/auth/login → público
endpoint protegido sin JWT → 401
endpoint protegido con JWT → permitido
```

---

## Fase 16 — Verificar stateless

Confirmar:

```text
SessionCreationPolicy.STATELESS
```

No depender de sesión entre peticiones.

---

## Fase 17 — Revisar seguridad

Confirmar que no se registran:

```text
Authorization
JWT completo
JWT_SECRET
password
password_hash
```

---

## Fase 18 — Maven validate

Ejecutar desde:

```text
backend/
```

```bash
./mvnw validate
```

---

## Fase 19 — Maven test

Ejecutar:

```bash
./mvnw test
```

Confirmar:

```text
0 fallos
```

---

## Fase 20 — Maven package

Ejecutar:

```bash
./mvnw package
```

Confirmar:

```text
BUILD SUCCESS
```

---

## Fase 21 — Reconstruir Docker

Si el backend se ejecuta mediante Docker Compose:

```bash
docker compose up -d --build backend
```

Confirmar arranque correcto.

---

## Fase 22 — Obtener JWT real

Utilizar:

```http
POST /api/auth/login
```

con usuario local de prueba.

Confirmar:

```text
200 OK
```

Guardar JWT únicamente para la prueba.

---

## Fase 23 — Probar sin JWT

Ejecutar:

```http
GET /api/exercises
```

sin Authorization.

Esperado:

```text
401 Unauthorized
```

---

## Fase 24 — Probar JWT válido

Postman:

```text
Authorization
→ Bearer Token
→ JWT
```

Ejecutar:

```http
GET /api/exercises
```

Esperado:

```text
200 OK
```

---

## Fase 25 — Probar JWT inválido

Manipular token.

Esperado:

```text
401 Unauthorized
```

---

## Fase 26 — Verificar endpoints públicos

Volver a comprobar:

```text
POST /api/users
POST /api/auth/login
```

sin JWT.

Ambos deberán seguir accesibles.

---

## Fase 27 — Verificar Issue #11

Utilizar:

```text
delfohub
```

Comparar implementación con Issue #11.

No cerrar automáticamente.

No hacer merge.

---

## Resultado esperado

```text
                    PUBLIC
POST /api/users ────────────────▶ Controller

POST /api/auth/login ───────────▶ Controller
                                       │
                                       ▼
                                      JWT


                    PROTECTED

GET /api/exercises
        │
        ▼
Authorization: Bearer JWT
        │
        ▼
JwtAuthenticationFilter
        │
        ▼
JwtService
        │
        ▼
SecurityContext
        │
        ▼
ExerciseController
```