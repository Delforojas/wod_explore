# SDD - Issue #59: Asegurar ownership de resultados en WODs personalizados

## Estado

Spec de implementacion backend para aplicar el ownership de WODs personalizados
al registro y consulta de resultados. La rama de trabajo es
`fix/059-ownership-wod-results`, derivada de `main` despues de integrar la
Issue #49.

## Objetivo

Evitar que una persona autenticada pueda registrar o consultar resultados sobre
un WOD personalizado de otra cuenta, manteniendo el contrato existente de
`/api/wods/{wodId}/results`.

## Contexto y evidencia

`WodResultService` resuelve actualmente el WOD con `WodRepository.findById`,
sin comprobar si tiene propietario ni si ese propietario coincide con la cuenta
autenticada. `Wod` distingue el origen mediante `owner`:

- `owner == null`: WOD global del catalogo.
- `owner != null`: WOD personalizado de una cuenta.

La Spec 043 define que los WODs globales admiten resultados propios de cualquier
usuario, mientras que un WOD personalizado solo admite resultados del
propietario. Un WOD personalizado ajeno debe comportarse como inexistente para
no revelar ownership.

## Alcance

### Incluido

- Resolver el usuario autenticado antes de autorizar el WOD.
- Autorizar WODs globales para crear y consultar resultados del usuario actual.
- Autorizar WODs personalizados unicamente cuando su propietario sea el usuario
  autenticado.
- Rechazar WODs personalizados ajenos con `WodNotFoundException` y respuesta
  `404` segura.
- Mantener las rutas, DTOs, validaciones metricas y formato de respuesta actuales.
- Cubrir service, controller, seguridad y persistencia con tests proporcionales.

### Fuera de alcance

- Crear endpoints, tablas, migraciones o constraints nuevas.
- Cambiar `wod_results`, sus foreign keys o la politica de borrado de #49.
- Cambiar las reglas de `FOR_TIME`, `AMRAP` o `EMOM`.
- Implementar la interfaz de resultados en `MyWodDetailPage`, que corresponde a
  la Issue #60.
- Introducir roles, permisos administrativos o nuevos mecanismos de autenticacion.

## Contrato HTTP

Las rutas permanecen:

```text
POST /api/wods/{wodId}/results
GET  /api/wods/{wodId}/results
```

Ambas requieren un JWT valido. El usuario se obtiene desde
`Authentication.getName()` y se resuelve mediante `UserRepository`.

Respuestas relevantes:

- `201 Created`: resultado creado para un WOD global o propio.
- `200 OK`: resultados propios del WOD global o propio.
- `401 Unauthorized`: JWT ausente, invalido, expirado o usuario no resoluble.
- `404 Not Found`: WOD inexistente o WOD personalizado perteneciente a otra
  cuenta, sin distinguir ambos casos.
- `400 Bad Request`: request invalido segun las validaciones existentes.

El body no contiene `userId`, `ownerId` ni ningun selector de propietario.

## Reglas de dominio

1. El servicio resuelve el usuario autenticado antes de cargar el WOD.
2. Si el WOD no existe, se lanza `WodNotFoundException`.
3. Si el WOD es global, la operacion continua para el usuario autenticado.
4. Si el WOD tiene propietario y el ID del propietario no coincide con el usuario
   autenticado, se lanza `WodNotFoundException` con el mismo formato.
5. Solo despues de superar la autorizacion se validan metricas y se persiste o
   consulta el resultado.
6. Una operacion rechazada por ownership no escribe ni consulta resultados.
7. Los resultados creados siempre quedan asociados al usuario autenticado,
   nunca a un valor enviado por el cliente.

## Persistencia

No se modifica el esquema MySQL. La autorizacion se realiza sobre la entidad
`Wod` ya cargada y su relacion `owner`. Las consultas existentes de resultados
continuan filtrando por `(user_id, wod_id)` en las lecturas.

## Seguridad y errores

La cadena Spring Security sigue protegiendo `/api/wods/{wodId}/results`. La
distincion entre WOD global y personalizado ajeno se mantiene en el service para
que no dependa de datos controlados por el cliente. No se deben exponer nombres,
propietarios, resultados ni detalles internos de un WOD ajeno.

## Criterios de aceptacion

- Un usuario puede crear y consultar sus resultados de WODs globales.
- El propietario de un WOD personalizado puede crear y consultar sus resultados.
- Otro usuario recibe `404` al crear o consultar resultados de un WOD personalizado
  ajeno.
- Un usuario de JWT valido se resuelve exclusivamente desde el contexto de
  seguridad.
- Una operacion rechazada por ownership no persiste ni consulta resultados.
- Las validaciones metricas existentes siguen funcionando para los tres tipos de
  WOD.
- Los DTOs no exponen `userId` ni datos sensibles.
- Existen tests unitarios, HTTP e integracion que cubren ownership y no regresion.
- `./mvnw validate`, `./mvnw test` y `./mvnw package` pasan desde `backend/`.

## Referencias

- GitHub Issue #59.
- `specs/043-diseno-wods-personalizados/spec.md`.
- `specs/016-definir-contrato-resultados-usuario/spec.md`.
- `specs/017-wod-results/spec.md`.
- `backend/src/main/java/com/wodexplorer/entity/Wod.java`.
- `backend/src/main/java/com/wodexplorer/service/WodResultService.java`.
- `backend/src/main/java/com/wodexplorer/repository/WodRepository.java`.
- `backend/src/main/java/com/wodexplorer/controller/WodResultController.java`.
