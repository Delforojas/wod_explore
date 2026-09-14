# Spec 009 — JWT Authentication Infrastructure

## Estado

Autorizada para implementar la infraestructura base de autenticación JWT en el backend de WOD Explorer.

Esta spec cubre la Issue #7:

```text
Implementar autenticación JWT
```

Parte del trabajo ya completado en:

```text
Spec 007 — User Entity
Spec 008 — User Registration
```

Actualmente existen:

- entidad `User`;
- `UserRepository`;
- registro de usuarios;
- contraseñas almacenadas con BCrypt;
- validación de duplicados;
- endpoint `POST /api/users`.

Esta spec NO implementa todavía login ni protección de endpoints.

---

## Contexto

WOD Explorer necesita autenticación basada en JWT para permitir posteriormente:

- login de usuarios;
- identificación del usuario autenticado;
- protección de endpoints;
- autorización futura.

Esta spec únicamente prepara la infraestructura JWT necesaria para esas funcionalidades.

---

## Objetivo

Implementar un servicio JWT capaz de:

1. generar tokens JWT;
2. incluir el email del usuario como `subject`;
3. incluir fecha de emisión;
4. incluir fecha de expiración;
5. firmar tokens mediante una clave secreta externa;
6. validar firma y expiración;
7. extraer el `subject`;
8. rechazar tokens inválidos o expirados.

---

## Requisitos funcionales

### RF-1 — JwtService

Crear:

```text
JwtService
```

Responsabilidades:

- generar tokens;
- validar tokens;
- extraer claims;
- extraer subject;
- gestionar expiración.

El servicio no deberá contener lógica HTTP.

---

### RF-2 — Subject

El `subject` del JWT deberá ser el email normalizado del usuario.

Ejemplo:

```text
sub = delfin@example.com
```

No utilizar el password ni el password hash como claim.

---

### RF-3 — Fecha de emisión

El token deberá incluir:

```text
iat
```

con la fecha y hora de generación.

---

### RF-4 — Fecha de expiración

El token deberá incluir:

```text
exp
```

La duración deberá ser configurable mediante variable de entorno o propiedad de configuración.

Valor recomendado inicial:

```text
3600000 ms
```

equivalente a una hora.

---

### RF-5 — Clave secreta

La clave JWT deberá obtenerse desde configuración externa.

Ejemplo:

```text
JWT_SECRET
```

No se permitirá incluir una clave real directamente en:

```text
application.properties
application.yml
código Java
Git
```

---

### RF-6 — Configuración de expiración

La expiración deberá obtenerse desde configuración externa.

Ejemplo:

```text
JWT_EXPIRATION
```

Podrá existir un valor por defecto únicamente para desarrollo si no contiene información sensible.

---

### RF-7 — Firma

Los tokens deberán estar firmados.

Utilizar un algoritmo HMAC seguro compatible con la librería JWT seleccionada.

Preferencia:

```text
HS256
```

si la longitud de clave cumple los requisitos de seguridad de la librería.

---

### RF-8 — Generación de token

`JwtService` deberá ofrecer una operación equivalente a:

```java
String generateToken(String email)
```

El resultado deberá ser un JWT firmado y válido.

---

### RF-9 — Extracción del subject

`JwtService` deberá permitir obtener el email almacenado en:

```text
sub
```

desde un token válido.

---

### RF-10 — Validación

`JwtService` deberá permitir determinar si un token es válido.

Como mínimo deberá verificar:

- firma;
- estructura;
- expiración.

---

### RF-11 — Token expirado

Un token expirado deberá considerarse inválido.

No deberá provocar errores no controlados hacia capas superiores.

---

### RF-12 — Token manipulado

Un JWT cuya firma haya sido alterada deberá considerarse inválido.

---

### RF-13 — Token malformado

Un valor que no represente un JWT válido deberá considerarse inválido.

---

## Configuración

Añadir configuración equivalente a:

```properties
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION:3600000}
```

La nomenclatura podrá adaptarse a la estructura actual del proyecto.

---

## Dependencia JWT

Añadir una librería mantenida y compatible con Java 21 y Spring Boot 3.5.

Preferencia:

```text
JJWT
```

Si se utiliza JJWT, mantener una versión coherente de:

```text
jjwt-api
jjwt-impl
jjwt-jackson
```

---

## Arquitectura

La infraestructura esperada será:

```text
config
  └── JWT configuration

service
  └── JwtService
```

No crear todavía:

```text
AuthController
AuthService
JwtAuthenticationFilter
UserDetailsService
SecurityFilterChain de endpoints protegidos
```

salvo configuración mínima imprescindible para que la aplicación continúe funcionando.

---

## Seguridad

La clave JWT:

- no deberá versionarse;
- deberá cargarse mediante variable de entorno;
- deberá tener longitud suficiente;
- nunca deberá imprimirse en logs.

No incluir dentro del token:

```text
password
passwordHash
JWT secret
información sensible
```

---

## Integración con Spring Security

Esta spec podrá añadir la dependencia mínima de Spring Security si es necesaria para preparar infraestructura.

No deberá:

- exigir autenticación para endpoints;
- bloquear `/api/users`;
- implementar login;
- instalar todavía un filtro JWT sobre requests.

El comportamiento actual del registro deberá continuar funcionando.

---

## Testing

Crear tests unitarios para `JwtService`.

Cubrir como mínimo:

- generación de token;
- token no vacío;
- extracción correcta del subject;
- token válido;
- token expirado;
- token manipulado;
- token malformado.

Los tests no deberán depender de MySQL.

---

## Verificación de seguridad

Comprobar que:

- `JWT_SECRET` no está hardcodeada;
- `.env` continúa ignorado por Git;
- el token no contiene password;
- el token no contiene password hash.

---

## Integración con GitHub

Esta spec está asociada a:

```text
Issue #7 — Implementar autenticación JWT
```

Repositorio:

```text
Delforojas/wod_explore
```

Utilizar `delfohub` para:

- consultar la Issue;
- verificar requisitos;
- comprobar cumplimiento final.

No cerrar automáticamente la Issue.

---

## Fuera de alcance

Esta spec NO incluye:

- endpoint de login;
- comprobación de credenciales;
- `AuthenticationManager`;
- `UserDetailsService`;
- filtro JWT;
- protección de endpoints;
- roles;
- autorización;
- refresh tokens;
- logout;
- frontend;
- almacenamiento de JWT en base de datos.

---

## Criterios de aceptación

La spec estará completada cuando:

1. exista `JwtService`;
2. pueda generarse un JWT firmado;
3. el subject sea el email;
4. exista `iat`;
5. exista `exp`;
6. la expiración sea configurable;
7. la clave provenga de configuración externa;
8. pueda extraerse el subject;
9. pueda validarse un token;
10. un token expirado sea inválido;
11. un token manipulado sea inválido;
12. un token malformado sea inválido;
13. existan tests unitarios;
14. `./mvnw validate` pase;
15. `./mvnw test` pase;
16. `./mvnw package` pase;
17. el registro de usuarios siga funcionando;
18. Issue #7 quede verificada;
19. no se implemente funcionalidad fuera de alcance.
