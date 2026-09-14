# SDD - Issue #45: API para WODs personalizados de usuario

## Estado

Spec de implementacion para la API REST autenticada de creacion, listado y
detalle de WODs personalizados. La rama de trabajo es
`feat/045-user-wods-api`, derivada de `main`, que contiene las dependencias de
las Issues #43 y #44.

La Issue cubre DTOs, controller, service, repositories necesarios, validacion,
ownership, errores y tests. No cubre frontend, migraciones, edicion,
eliminacion ni cambios adicionales de persistencia.

## Objetivo

Permitir que un usuario autenticado cree y consulte sus WODs personalizados
mediante `/api/user-wods`, resolviendo siempre el propietario desde el subject
del JWT y sin mezclar recursos globales o pertenecientes a otra cuenta.

## Alcance

### Incluido

- `POST /api/user-wods` con respuesta `201 Created`.
- `GET /api/user-wods?page=0&size=20` paginado con `PageResponse`.
- `GET /api/user-wods/{id}` con ejercicios y prescripciones ordenados.
- DTOs de request y response especificos, sin entidades JPA ni datos internos.
- Resolucion del usuario mediante email normalizado de `Authentication`.
- Validacion declarativa de forma y validacion de negocio en el service.
- Validacion de WodType, WodLevel, categoria, rondas, time limit, posiciones,
  ejercicios y matriz de prescripciones por `measurement_type`.
- Repositories filtrados por propietario y consulta de detalle existente.
- Errores centralizados en `GlobalExceptionHandler`.
- Tests unitarios del service y tests HTTP del controller y seguridad.

### Excluido

- Frontend, rutas de cliente y schemas Zod.
- Migraciones o cambios de esquema MySQL.
- Edicion y eliminacion de WODs.
- Cambios en `/api/wods` o en endpoints de resultados, salvo regresion de
  acceso al catalogo global.
- Nuevos mecanismos de autenticacion, roles o permisos.
- Aceptar `userId`, `ownerId` o cualquier selector de propietario del cliente.

## Contrato HTTP

Todas las rutas requieren un JWT valido. El controller obtiene el subject con
`Authentication.getName()` y el service busca `User` por email normalizado con
`trim()` y `Locale.ROOT`.

### Request de creacion

El body contiene `name`, `type`, `category` opcional, `level`, `timeLimit`,
`rounds` y `exercises`. Cada ejercicio contiene `exerciseId`, `position` y
`prescriptions`; cada prescripcion contiene `value`, `unit` y `unitLabel`.
No contiene `id`, `userId` ni `ownerId`. Jackson mantiene el rechazo global de
propiedades desconocidas.

### Reglas del WOD

- `name` se recorta en los extremos, es obligatorio y tiene entre 1 y 100
  caracteres.
- `type` solo puede ser `FOR_TIME`, `AMRAP` o `EMOM`.
- `category` es opcional y, cuando existe, solo puede ser `METCON`.
- `level` es obligatorio y solo puede ser `BEGINNER`, `INTERMEDIATE` o `RX`.
- Debe existir al menos un ejercicio.
- `timeLimit`, cuando existe, es un entero positivo en segundos.
- `rounds`, cuando existe, es un entero positivo.
- `AMRAP` exige `timeLimit` y rechaza `rounds`.
- `EMOM` exige `timeLimit`; `rounds` es opcional.
- `FOR_TIME` permite `timeLimit` y `rounds` opcionales.
- Las posiciones son positivas, unicas y consecutivas desde 1.
- Los `exerciseId` deben existir; un mismo ejercicio puede repetirse en
  posiciones distintas.

### Reglas de prescripciones

Cada ejercicio debe contener exactamente la matriz siguiente, segun su
`measurementType`:

| measurementType | Prescripciones |
| --- | --- |
| `REPS` | Una `REPS` con valor entero positivo |
| `DISTANCE` | Una `METERS` con valor positivo |
| `WEIGHT` | Una `KG` con valor positivo |
| `TIME` | Una `SECONDS` con valor entero positivo |
| `WEIGHT_DISTANCE` | Una `KG` y una `METERS`, ambas positivas |
| `OTHER` | Una `OTHER` positiva y `unitLabel` no vacio |

Los valores usan `BigDecimal`, son positivos y admiten como maximo dos
decimales. `REPS` y `SECONDS` deben ser enteros. Las unidades no compatibles,
duplicadas, ausentes o sobrantes son errores `400 Bad Request`.

## Ownership y errores

- El listado usa `findByOwner_Id` y nunca incluye WODs globales.
- El detalle usa `findByIdAndOwner_Id`; un WOD ajeno y uno inexistente producen
  el mismo `UserWodNotFoundException` y `404 Not Found`.
- Un JWT valido cuyo usuario no existe produce `401 Unauthorized` mediante
  `AuthenticatedUserNotFoundException`.
- Un ejercicio inexistente produce `404 Not Found`.
- Requests invalidos, enums desconocidos y propiedades como `userId`/`ownerId`
  producen `400 Bad Request` mediante `GlobalExceptionHandler`.
- Las respuestas no contienen passwordHash, credenciales, tokens ni ownerId.

Se añadira un error generico de WOD personalizado no encontrado para no revelar
si un identificador pertenece a otra cuenta. El formato reutiliza
`{ error, message, status, details }` en los errores gestionados por la API.

## Respuestas

- La creacion devuelve un detalle completo del WOD creado.
- El listado devuelve `PageResponse` con resumentes propios ordenados por
  `createdAt DESC, id DESC`.
- El detalle devuelve los ejercicios en `position ASC` y sus prescripciones en
  un orden determinista.

## Compatibilidad

- `/api/wods` y `/api/wods/{id}` conservan exclusivamente el catalogo global.
- `spring.jpa.hibernate.ddl-auto=none` no cambia.
- Se reutiliza el esquema y modelo JPA de #44 sin migraciones nuevas.
- La autenticacion JWT existente se reutiliza sin introducir roles nuevos.

## Criterios de aceptacion

- [x] Un usuario autenticado puede crear un WOD personalizado mediante POST.
- [x] El propietario sale del contexto de seguridad y no del request.
- [x] El listado devuelve solo WODs del usuario autenticado.
- [x] El detalle devuelve ejercicios y prescripciones ordenados.
- [x] Un usuario no puede consultar WODs de otra cuenta.
- [x] Se validan estructuras, categoria, rondas y time limit.
- [x] Se validan ejercicios y prescripciones segun measurement type.
- [x] Se rechazan valores no positivos, posiciones invalidas y configuraciones
  incompletas.
- [x] Las respuestas usan DTOs especificos y no exponen datos sensibles.
- [x] Los errores usan GlobalExceptionHandler y codigos HTTP coherentes.
- [x] Los endpoints globales continuan sin exponer WODs personalizados.
- [x] Existen tests unitarios del service y tests HTTP del controller y
  seguridad.
- [x] No se implementan frontend, edicion, eliminacion ni migraciones.

## Referencias

- Issue #45: Crear API para WODs personalizados de usuario.
- `specs/043-diseno-wods-personalizados/spec.md`.
- `specs/044-modelo-datos-wods-personalizados/spec.md`.
- `backend/src/main/java/com/wodexplorer/controller/WodController.java`.
- `backend/src/main/java/com/wodexplorer/service/WodService.java`.
- `backend/src/main/java/com/wodexplorer/repository/WodRepository.java`.
- `backend/src/main/java/com/wodexplorer/security/JwtAuthenticationFilter.java`.
- `backend/src/main/java/com/wodexplorer/exception/GlobalExceptionHandler.java`.
