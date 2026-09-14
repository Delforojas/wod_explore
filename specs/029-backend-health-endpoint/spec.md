# Spec 029 - Endpoint de salud del backend

## Estado

Completada en la rama `feat/029-backend-health-endpoint`.

## Contexto

El backend de WOD Explorer ya utiliza Spring Boot, Spring Security, JWT,
persistencia JPA y MySQL. Todas las rutas bajo `/api/**` requieren autenticacion
salvo las excepciones configuradas explicitamente.

Actualmente no existe un endpoint HTTP pequeno que permita comprobar si el
proceso del backend esta disponible. La Issue #29 solicita incorporarlo sin
convertirlo en un sistema de observabilidad ni acoplarlo a la logica de negocio.

## Objetivo

Exponer `GET /api/health` como un contrato HTTP estable y seguro para comprobar
la disponibilidad del proceso del backend desde desarrollo, Docker y CI.

## Alcance

Esta spec incluye:

- endpoint `GET /api/health`;
- respuesta JSON pequena y estable;
- endpoint publico, sin JWT, para permitir comprobaciones externas del proceso;
- tests HTTP del contrato y de la politica de autenticacion;
- documentacion de uso local, Docker y CI;
- proteccion del endpoint frente a la exposicion de informacion sensible.

## Fuera de alcance

No se implementara:

- comprobacion de MySQL u otras dependencias externas;
- Spring Boot Actuator;
- metricas, tracing, dashboards o alertas;
- cambios de esquema o datos MySQL;
- nuevos endpoints de negocio;
- cambios en autenticacion, JWT o roles existentes;
- integracion del frontend con el endpoint;
- un formato de error nuevo para rutas no relacionadas.

## Requisitos funcionales

### RF-1 - Endpoint de salud

Cuando un cliente realice una peticion `GET /api/health`, el backend debera
responder con HTTP `200 OK` y `Content-Type: application/json`.

El payload minimo y estable sera:

```json
{
  "status": "UP"
}
```

### RF-2 - Disponibilidad publica

La peticion `GET /api/health` debera funcionar sin cabecera `Authorization`.
La configuracion de Spring Security debera declarar esta excepcion de forma
explicita antes de la regla general autenticada para `/api/**`.

La ausencia de JWT sera suficiente para esta comprobacion. No se exigira una
autenticacion valida ni se usara la identidad de un usuario.

### RF-3 - Health del proceso

El estado `UP` representara que la aplicacion Spring Boot esta atendiendo la
peticion HTTP. Este endpoint no comprobara MySQL ni otras dependencias, por lo
que no debera afirmar la disponibilidad de servicios que no inspecciona.

### RF-4 - Seguridad de la respuesta

La respuesta no debera incluir:

- URL JDBC;
- nombres de usuario o contrasenas;
- secretos JWT o tokens;
- stack traces;
- nombres de tablas, consultas o detalles internos de infraestructura.

## Requisitos no funcionales

### RNF-1 - Simplicidad

El endpoint se implementara con un controller pequeno. No se crearan service,
repository, DTO ni interfaces adicionales sin una necesidad tecnica concreta.

### RNF-2 - Compatibilidad

Todo el codigo debera ser compatible con Java 21 y Spring Boot 3.5.x, usando
unicamente dependencias ya presentes en el proyecto.

### RNF-3 - Separacion

La funcionalidad residira bajo `backend/` y no modificara el frontend ni la
persistencia.

### RNF-4 - Documentacion

El README debera explicar como consultar el endpoint con el backend local y
con Docker Compose, y debera dejar claro que el endpoint no valida MySQL.

## Criterios de aceptacion

1. `GET /api/health` responde `200 OK` sin JWT.
2. La respuesta es JSON y contiene exactamente el contrato minimo `status=UP`.
3. La ruta esta permitida explicitamente en Spring Security.
4. Existen tests HTTP para el contrato y la ausencia de autenticacion.
5. No se exponen secretos ni detalles internos.
6. El endpoint no accede a repositories, servicios de negocio ni MySQL.
7. El README documenta las comprobaciones local, Docker y CI.
8. `./mvnw validate`, `./mvnw test` y `./mvnw package` pasan desde `backend/`.

## Archivos previstos

- `backend/src/main/java/com/wodexplorer/controller/HealthController.java`
- `backend/src/main/java/com/wodexplorer/config/SecurityConfig.java`
- `backend/src/test/java/com/wodexplorer/security/SecurityHttpTest.java`
- `README.md`

## Dependencias y decisiones

- Se reutilizara Spring MVC para el controller.
- Se reutilizara la cadena de seguridad existente.
- No se anadiran dependencias.
- La Issue #23 ya dejo configurado el healthcheck de MySQL en Docker; esta Issue
  implementa el contrato HTTP del backend y no sustituye ese healthcheck.

## Verificaciones

Las verificaciones obligatorias son:

```bash
./mvnw validate
./mvnw test
./mvnw package
```

Tambien se revisara el diff para confirmar que no hay cambios en el esquema,
secretos versionados ni funcionalidad fuera de alcance.
