# Spec 011 — Protected Endpoints with JWT

## Estado

Autorizada para implementar protección de endpoints mediante JWT en el backend de WOD Explorer.

Esta spec cubre la Issue #11:

```text

Proteger endpoints mediante JWT

```

Parte del trabajo completado en:

```text

Spec 007 — User Entity

Spec 008 — User Registration

Spec 009 — JWT Authentication Infrastructure

Spec 010 — User Login

```

Actualmente existen:

- entidad `User`;

- `UserRepository`;

- registro de usuarios;

- BCrypt;

- `JwtService`;

- generación y validación de JWT;

- `POST /api/auth/login`;

- login mediante email y password;

- JWT válido devuelto tras login.

Esta spec utilizará ese JWT para autenticar peticiones HTTP.

---

## Contexto

Actualmente cualquier cliente puede acceder a los endpoints existentes sin autenticación.

El backend ya puede generar y validar JWT, pero Spring Security todavía no utiliza esos tokens para autenticar peticiones.

Es necesario implementar:

```text

Authorization: Bearer <JWT>

```

y establecer la autenticación correspondiente dentro del `SecurityContext`.

---

## Objetivo

Implementar autenticación stateless mediante JWT.

Flujo esperado:

```text

HTTP Request

      ↓

Authorization: Bearer <JWT>

      ↓

JwtAuthenticationFilter

      ↓

JwtService

      ↓

validar token

      ↓

extraer subject/email

      ↓

SecurityContext

      ↓

Spring Security

      ↓

Controller

```

---

## Requisitos funcionales

### RF-1 — Spring Security

Añadir:

```text

spring-boot-starter-security

```

Utilizar Spring Security para controlar el acceso HTTP.

No implementar autenticación mediante sesión.

---

### RF-2 — Endpoints públicos

Deben permanecer accesibles sin JWT:

```text

POST /api/users

POST /api/auth/login

```

El registro y login existentes no deberán romperse.

---

### RF-3 — Endpoints protegidos

El resto de endpoints bajo:

```text

/api/**

```

deberán requerir autenticación.

Una petición sin autenticación deberá ser rechazada.

---

### RF-4 — Bearer Token

El JWT deberá recibirse mediante:

```http

Authorization: Bearer <token>

```

No aceptar JWT mediante:

```text

query parameters

cookies

body

```

en esta spec.

---

### RF-5 — JwtAuthenticationFilter

Crear:

```text

JwtAuthenticationFilter

```

Preferir:

```text

OncePerRequestFilter

```

Responsabilidades:

- leer `Authorization`;

- comprobar prefijo `Bearer `;

- extraer token;

- validar JWT mediante `JwtService`;

- extraer subject;

- establecer autenticación en `SecurityContext`;

- continuar la cadena de filtros.

---

### RF-6 — Petición sin Authorization

Si un endpoint protegido no contiene:

```text

Authorization

```

deberá responder:

```text

401 Unauthorized

```

---

### RF-7 — Token inválido

Un JWT inválido deberá responder:

```text

401 Unauthorized

```

Incluye:

- token malformado;

- firma inválida;

- token manipulado;

- token expirado.

No exponer detalles internos del JWT.

---

### RF-8 — Token válido

Un JWT válido deberá autenticar la petición.

El principal deberá representar como mínimo el subject del JWT:

```text

email

```

---

### RF-9 — SecurityContext

Cuando el token sea válido deberá establecerse una autenticación en:

```java

SecurityContextHolder.getContext()

```

No establecer autenticación si:

- falta token;

- token inválido;

- token expirado;

- token malformado.

---

### RF-10 — SecurityFilterChain

Crear configuración explícita mediante:

```text

SecurityFilterChain

```

No utilizar configuración deprecated.

---

### RF-11 — Stateless

Configurar:

```text

SessionCreationPolicy.STATELESS

```

El backend no deberá crear ni utilizar sesiones HTTP para autenticación.

---

### RF-12 — CSRF

Desactivar CSRF para esta API REST stateless.

La decisión aplica al backend API actual basado en JWT Bearer.

---

### RF-13 — Autenticación por JWT

El filtro JWT deberá ejecutarse antes del filtro de autenticación estándar apropiado de Spring Security.

Ejemplo esperado:

```java

addFilterBefore(

    jwtAuthenticationFilter,

    UsernamePasswordAuthenticationFilter.class

)

```

---

### RF-14 — Usuario de JWT

El JWT generado por la Spec 010 contiene el email como subject.

La autenticación deberá utilizar ese subject.

No es necesario implementar roles en esta spec.

Authorities:

```text

vacías

```

son aceptables mientras no exista autorización basada en roles.

---

### RF-15 — Usuario existente

La autenticación JWT no deberá confiar únicamente en datos controlados por el cliente fuera del token firmado.

Si la arquitectura actual requiere comprobar que el usuario asociado al subject sigue existiendo, podrá utilizarse `UserRepository`.

La decisión concreta deberá validarse durante Plan antes de implementar.

No cargar password hashes en el `SecurityContext`.

---

### RF-16 — AuthenticationEntryPoint

Las peticiones no autenticadas contra endpoints protegidos deberán producir una respuesta controlada:

```text

401 Unauthorized

```

Evitar respuestas HTML o comportamiento por defecto orientado a formularios.

Contrato recomendado:

```json

{

  "error": "UNAUTHORIZED",

  "message": "Autenticación requerida"

}

```

---

### RF-17 — AccessDenied

Si Spring Security produce una denegación para un usuario autenticado sin permisos, deberá utilizar:

```text

403 Forbidden

```

Aunque esta spec no implementa roles, la configuración deberá mantener la semántica HTTP correcta.

---

## Arquitectura

Arquitectura esperada:

```text

                    ┌─────────────────────┐

Request ───────────▶│ Spring Security     │

                    └──────────┬──────────┘

                               │

                               ▼

                    JwtAuthenticationFilter

                               │

                        Authorization

                               │

                         Bearer <JWT>

                               │

                               ▼

                          JwtService

                               │

                     valid + subject

                               │

                               ▼

                        SecurityContext

                               │

                               ▼

                          Controller

```

---

## SecurityConfig

Crear o adaptar una configuración equivalente a:

```text

SecurityConfig

```

Responsabilidades:

- configurar `SecurityFilterChain`;

- desactivar CSRF;

- establecer stateless;

- permitir registro;

- permitir login;

- proteger `/api/**`;

- configurar respuestas 401/403;

- registrar `JwtAuthenticationFilter`.

---

## Rutas

### Públicas

```text

POST /api/users

POST /api/auth/login

```

### Protegidas

```text

/api/**

```

exceptuando explícitamente las rutas públicas anteriores.

No abrir rutas adicionales sin justificación.

---

## Compatibilidad con CORS

Mantener la configuración CORS existente.

No romper comunicación futura con el frontend.

No ampliar orígenes arbitrariamente.

---

## Seguridad

No registrar:

```text

JWT completo

JWT_SECRET

password

password_hash

Authorization header completo

```

No devolver excepciones internas de JJWT al cliente.

No incluir información sobre la firma o secreto en errores.

---

## Persistencia

Esta spec NO modifica:

```text

users

exercises

wods

wod_exercises

exercise_results

wod_results

```

No modificar esquema MySQL.

Mantener:

```properties

spring.jpa.hibernate.ddl-auto=none

```

---

## Testing

Cubrir como mínimo:

### Endpoints públicos

```text

POST /api/users sin token → permitido

POST /api/auth/login sin token → permitido

```

### Endpoint protegido

```text

sin token → 401

token válido → permitido

token expirado → 401

token manipulado → 401

token malformado → 401

```

### Filtro

Verificar:

```text

Bearer válido

Authorization ausente

Authorization sin Bearer

token inválido

SecurityContext

filterChain

```

### Configuración

Verificar:

```text

stateless

CSRF

rutas públicas

rutas protegidas

```

---

## Prueba manual con Postman

### 1. Login

```http

POST /api/auth/login

```

Sin Authorization.

Obtener:

```json

{

  "token": "..."

}

```

---

### 2. Endpoint protegido sin token

Ejemplo:

```http

GET /api/exercises

```

Sin Authorization.

Esperado:

```text

401 Unauthorized

```

---

### 3. Endpoint protegido con token

Postman:

```text

Authorization

→ Bearer Token

→ <JWT>

```

Petición:

```http

GET /api/exercises

```

Esperado:

```text

200 OK

```

si el endpoint existe y la petición es válida.

---

### 4. Token manipulado

Modificar uno o varios caracteres del JWT.

Esperado:

```text

401 Unauthorized

```

---

### 5. Token expirado

Utilizar un JWT expirado.

Esperado:

```text

401 Unauthorized

```

---

## Integración con GitHub

Esta spec está asociada a:

```text

Issue #11 — Proteger endpoints mediante JWT

```

Repositorio:

```text

Delforojas/wod_explore

```

Utilizar `delfohub` para:

- consultar la Issue;

- comprobar requisitos;

- verificar cumplimiento.

No cerrar automáticamente la Issue.

No hacer merge.

---

## Fuera de alcance

Esta spec NO incluye:

- roles;

- autorización basada en roles;

- refresh tokens;

- logout;

- blacklist de JWT;

- OAuth;

- Google login;

- recuperación de contraseña;

- frontend;

- almacenamiento del JWT en frontend;

- modificación del esquema MySQL;

- sesiones HTTP;

- cookies de autenticación.

---

## Criterios de aceptación

La spec estará completada cuando:

1. Spring Security esté configurado;

2. exista `JwtAuthenticationFilter`;

3. exista `SecurityFilterChain`;

4. la API sea stateless;

5. CSRF esté desactivado para la API;

6. `POST /api/users` sea público;

7. `POST /api/auth/login` sea público;

8. el resto de `/api/**` requiera autenticación;

9. ausencia de token produzca 401;

10. token inválido produzca 401;

11. token expirado produzca 401;

12. token manipulado produzca 401;

13. token válido establezca autenticación;

14. token válido permita acceder al endpoint protegido;

15. el principal corresponda al subject/email;

16. no se expongan secretos;

17. existan tests;

18. `./mvnw validate` pase;

19. `./mvnw test` pase;

20. `./mvnw package` pase;

21. Postman confirme 401 sin token;

22. Postman confirme acceso con token válido;

23. registro continúe funcionando;

24. login continúe funcionando;

25. Issue #11 quede verificada;

26. no se implemente funcionalidad fuera de alcance.