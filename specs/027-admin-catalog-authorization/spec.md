# Spec 027 — Autorización administrativa del catálogo

## Estado

Autorizada para implementar la protección de las operaciones mutables del
catálogo de ejercicios mediante una autorización administrativa resuelta por
el servidor.

Esta spec cubre la Issue #27 — `Proteger las operaciones mutables del catálogo
con autorización administrativa`.

## Contexto

Spring Security ya autentica mediante JWT todas las rutas `/api/**` salvo el
registro y el login. Sin embargo, cualquier usuario autenticado puede invocar
`POST`, `PUT` y `DELETE /api/exercises`, aunque el catálogo sea compartido. La
tabla `users` actual no contiene una columna de rol y el repositorio no dispone
de migraciones ejecutables por la aplicación.

## Objetivo

Permitir únicamente a administradores configurados por el servidor crear,
actualizar y eliminar ejercicios, manteniendo sin cambios las lecturas del
catálogo, los flujos personales, el registro y el login.

## Decisión de autorización

La fuente de permisos será una allowlist externa configurada mediante:

```text
ADMIN_EMAILS=email-admin@example.com,otro-admin@example.com
```

El backend normalizará los emails con `trim()` y minúsculas. El subject del JWT
se comparará con esa allowlist y, solo entonces, se añadirá
`ROLE_ADMIN` a la autenticación de Spring Security.

Esta decisión:

- no acepta roles desde body, query parameters ni path variables;
- no incluye authorities confiables dentro de un JWT controlado por el cliente;
- no expone la allowlist ni secretos en la API;
- no requiere modificar `users` ni crear una migración de esquema;
- permite habilitar un administrador para una cuenta ya registrada sin guardar
  credenciales en el repositorio.

La persistencia de roles por usuario queda fuera de esta Issue y requerirá una
decisión y migración independientes si la allowlist deja de ser suficiente.

## Requisitos funcionales

### RF-1 — Operaciones administrativas

Las siguientes rutas requieren `ROLE_ADMIN` además de autenticación:

- `POST /api/exercises`;
- `PUT /api/exercises/{id}`;
- `DELETE /api/exercises/{id}`.

Un administrador autenticado puede ejecutar las operaciones si el request es
válido. Se conservan los DTOs, validaciones y códigos HTTP actuales.

### RF-2 — Usuario normal

Un usuario autenticado cuyo email no esté en `ADMIN_EMAILS` recibe `403` con el
contrato JSON existente al invocar cualquier operación mutable del catálogo.
El servicio de ejercicios no debe ejecutarse en ese caso.

### RF-3 — Usuario no autenticado

Un request sin JWT válido recibe `401` con el contrato JSON existente. El filtro
no debe asignar authorities administrativas sin un subject JWT válido.

### RF-4 — Lecturas y flujos existentes

Se mantienen sin autorización administrativa adicional:

- `GET /api/exercises` y `GET /api/exercises/{id}`, que siguen requiriendo JWT;
- `POST /api/users`;
- `POST /api/auth/login`;
- endpoints personales y de resultados existentes.

### RF-5 — Futuras mutaciones WOD

La política deja documentado que futuras operaciones mutables de WOD deberán
reutilizar el mismo permiso administrativo, pero no se implementan en esta
Issue.

## Configuración y operación

La propiedad Spring será `security.admin-emails` y se alimentará de la variable
de entorno `ADMIN_EMAILS`. El valor por defecto es una lista vacía, por lo que
ningún usuario es administrador si no se configura explícitamente.

Para habilitar un administrador, un operador debe registrar primero la cuenta
por el flujo normal y después incluir su email en `ADMIN_EMAILS` del entorno del
backend. No se añaden passwords, tokens ni valores reales a archivos
versionados.

## Errores

Se mantienen los handlers existentes:

```json
{
  "error": "UNAUTHORIZED",
  "message": "Autenticación requerida"
}
```

para `401`, y:

```json
{
  "error": "FORBIDDEN",
  "message": "Acceso denegado"
}
```

para `403`.

## Persistencia

No se modifica el esquema MySQL, las tablas, datos, claves, índices ni scripts
de inicialización. La entidad `User` permanece compatible con `users` sin
columna de rol. La fuente de autorización es configuración externa del
servidor, no una modificación manual de datos.

## Testing

La cobertura debe demostrar mediante MockMvc y la configuración JWT existente:

- usuario normal autenticado recibe `403` en POST, PUT y DELETE;
- administrador autenticado puede alcanzar POST, PUT y DELETE;
- los servicios mutables no se invocan para el usuario normal;
- requests sin JWT reciben `401` en esas rutas;
- lecturas autenticadas continúan permitidas;
- registro y login continúan públicos;
- el email se normaliza al resolver `ADMIN_EMAILS`;
- no se acepta ninguna authority proveniente del request.

Los tests deben usar emails y valores ficticios, no depender de un MySQL real
para las comprobaciones HTTP y mantener el aislamiento existente de la suite.

## Fuera de alcance

- Panel administrativo frontend.
- CRUD de WODs o asociaciones WOD–ejercicio.
- Gestión de usuarios, recovery, refresh tokens o rate limiting.
- Persistencia de roles en MySQL.
- Migraciones o cambios de datos.
- Cambios de autorización para lecturas no relacionados con el catálogo.

## Criterios de aceptación

1. Un usuario autenticado sin permiso recibe `403` en POST, PUT y DELETE de
   ejercicios.
2. Un administrador autenticado puede crear, actualizar y eliminar ejercicios
   válidos.
3. Lecturas, resultados personales, registro y login conservan su comportamiento.
4. No se acepta un rol desde body ni parámetros del cliente.
5. El permiso se resuelve desde `ADMIN_EMAILS`, una fuente controlada del
   servidor, y queda cubierto por tests.
6. Los errores `401` y `403` conservan el JSON existente.
7. No se modifica el esquema MySQL ni se realizan cambios manuales de datos.
8. La política queda preparada documentalmente para futuras mutaciones de WOD.
9. `./mvnw validate`, `./mvnw test` y `./mvnw package` pasan.
