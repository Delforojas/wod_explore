# Plan — Spec 009 JWT Authentication Infrastructure

## Objetivo técnico

Construir la infraestructura JWT que utilizarán posteriormente el login y la protección de endpoints.

---

## Fase 1 — Revisar documentación

Leer:

```text
AGENTS.md
backend/AGENTS.md
specs/009-jwt-authentication/spec.md
specs/009-jwt-authentication/plan.md
specs/009-jwt-authentication/tasks.md
```

Confirmar el alcance antes de modificar código.

---

## Fase 2 — Revisar Issue #7

Utilizar:

```text
delfohub
```

Confirmar que la Issue solicita autenticación JWT y que no existen requisitos adicionales que pertenezcan a login o protección de endpoints.

Detenerse si hay una contradicción real.

---

## Fase 3 — Revisar estado actual del backend

Comprobar:

- dependencias actuales;
- configuración de seguridad;
- `PasswordEncoderConfig`;
- `User`;
- `UserRepository`;
- `UserService`;
- `UserController`;
- tests existentes.

Confirmar que Spec 008 permanece funcional.

---

## Fase 4 — Seleccionar librería JWT

Utilizar JJWT salvo incompatibilidad técnica.

Añadir una versión coherente de:

```text
jjwt-api
jjwt-impl
jjwt-jackson
```

No introducir librerías JWT adicionales.

---

## Fase 5 — Añadir configuración

Añadir propiedades:

```text
jwt.secret
jwt.expiration
```

Mapearlas desde:

```text
JWT_SECRET
JWT_EXPIRATION
```

No incluir secretos reales.

---

## Fase 6 — Configurar entorno de desarrollo

Añadir las variables documentales necesarias a:

```text
.env.example
```

si existe.

Nunca modificar `.env` con secretos generados automáticamente salvo que la tarea lo requiera expresamente.

No mostrar secretos en logs ni respuestas.

---

## Fase 7 — Crear JwtService

Crear un servicio responsable de:

```text
generateToken
extractSubject
isTokenValid
```

Añadir helpers privados únicamente cuando simplifiquen la implementación.

---

## Fase 8 — Generar SigningKey

Derivar la clave de firma desde `JWT_SECRET`.

Validar que la clave tenga longitud suficiente para el algoritmo elegido.

No utilizar strings hardcodeados.

---

## Fase 9 — Generar tokens

Generar JWT con:

```text
sub
iat
exp
```

Firmar el token.

No añadir claims innecesarios.

---

## Fase 10 — Parsear tokens

Crear lógica interna para parsear claims.

Centralizar el parsing para evitar duplicación.

---

## Fase 11 — Extraer subject

Implementar extracción del email desde:

```text
sub
```

---

## Fase 12 — Validar token

La validación deberá cubrir:

```text
firma
expiración
estructura
```

No propagar directamente excepciones internas de la librería JWT cuando se utilice la operación booleana de validación.

---

## Fase 13 — Tests unitarios

Crear tests aislados de `JwtService`.

No utilizar MySQL.

Cubrir:

```text
token válido
subject
expiración
firma alterada
token malformado
```

---

## Fase 14 — Verificar registro existente

Confirmar que:

```text
POST /api/users
```

continúa disponible.

No introducir seguridad global que bloquee el registro.

---

## Fase 15 — Validar configuración de secretos

Comprobar:

```text
JWT_SECRET no versionada
.env ignorado
sin secretos en application.properties
```

---

## Fase 16 — Maven validate

Desde:

```text
backend/
```

ejecutar:

```bash
./mvnw validate
```

---

## Fase 17 — Maven test

Ejecutar:

```bash
./mvnw test
```

Todos los tests deberán pasar.

---

## Fase 18 — Maven package

Ejecutar:

```bash
./mvnw package
```

Esperar:

```text
BUILD SUCCESS
```

---

## Fase 19 — Verificación funcional

Ejecutar los tests JWT y comprobar que:

- se genera token;
- puede recuperarse el email;
- el token es válido;
- tokens inválidos son rechazados.

No crear todavía ningún endpoint específico para emitir tokens.

---

## Fase 20 — Verificar Issue #7

Usar:

```text
delfohub
```

Comparar la implementación contra la Issue #7.

No cerrar automáticamente.

No hacer merge.

---

## Resultado esperado

```text
JWT_SECRET
JWT_EXPIRATION
      ↓
  JwtService
   ├── generateToken(email)
   ├── extractSubject(token)
   └── isTokenValid(token)
```

Esta infraestructura será utilizada posteriormente por:

```text
Spec 010 — Login
Spec 011 — Protected Endpoints
```
