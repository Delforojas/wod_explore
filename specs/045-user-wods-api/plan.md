# Plan - Issue #45: API para WODs personalizados de usuario

## Estrategia

Aplicar el cambio minimo sobre el backend existente. Se añadira un feature API
pequeño junto a los paquetes actuales por capa, reutilizando las entidades y
relaciones de #44, la autenticacion JWT existente, `PageResponse` y el
`GlobalExceptionHandler`. No se modificara el esquema ni se expondran entidades
JPA.

## Orden de implementacion

1. Crear DTOs records de request y response, con validaciones de forma y
   `@Valid` anidado para ejercicios y prescripciones.
2. Añadir excepciones de reglas de WOD personalizado y recurso no disponible,
   mapeandolas en `GlobalExceptionHandler` sin filtrar informacion de ownership.
3. Ajustar `WodRepository` para soportar el listado paginado y detalle por
   propietario, y reutilizar la carga ordenada de `WodExerciseRepository`.
4. Crear `UserWodService` con transacciones de lectura/escritura, resolucion del
   usuario autenticado, validacion de reglas, carga de ejercicios, construccion
   de entidades, persistencia y mapeo a DTOs.
5. Crear `UserWodController` bajo `/api/user-wods` con POST, GET de listado y GET
   de detalle; el controller solo recibira DTOs, `Authentication` y delegara.
6. Añadir tests unitarios Mockito para identidad, ownership, estructuras,
   posiciones, ejercicios, prescripciones y creacion.
7. Añadir tests `@WebMvcTest` para respuestas, validacion, propiedades
   desconocidas, errores y codigos HTTP; ampliar las pruebas de seguridad para
   verificar que las tres rutas requieren JWT y que `/api/wods` no cambia.
8. Ejecutar verificaciones Maven desde `backend/`, revisar el diff y confirmar
   que no se modifican migraciones, frontend, dependencias ni secretos.

## Decisiones de API

- La respuesta de listado sera `PageResponse<UserWodSummaryResponse>` y usara
  orden `createdAt DESC, id DESC`.
- POST y detalle usaran `UserWodDetailResponse`, incluyendo prescripciones
  normalizadas y campos de ejercicio del catalogo necesarios para el cliente.
- El propietario se resolvera una sola vez al comienzo de cada operacion del
  service mediante `UserRepository.findByEmail`.
- El detalle consultara el WOD por `(id, ownerId)` antes de cargar hijos. La
  consulta de ejercicios ya existente filtra por WOD y ordena por posicion.
- La validacion de la matriz de prescripciones se realizara por
  `MeasurementType`, con comparacion exacta de unidades y normalizacion de
  `unitLabel`.
- `UserWodNotFoundException` tendra un mensaje generico comun para WOD ausente
  y WOD ajeno.

## Verificacion

- `./mvnw validate` desde `backend/`.
- `./mvnw test` desde `backend/`, incluyendo unitarios, `@WebMvcTest` y
  regresion de seguridad.
- `./mvnw package` desde `backend/`.
- `git diff --check` y revision de `git status`/`git diff`.
- Confirmar con `wodsql` que no se han ejecutado escrituras ni cambiado el
  esquema; la comprobacion funcional de endpoints autenticados queda pendiente
  de validacion manual del usuario.
