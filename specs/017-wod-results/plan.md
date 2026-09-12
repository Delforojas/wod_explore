# Plan ejecutado - Issue #17

## Objetivo técnico

Implementar la escritura y lectura autenticada de resultados de WOD sobre la
tabla existente `wod_results`, manteniendo el flujo:

```text
HTTP Controller -> Service -> Repository -> MySQL
```

La implementación debía seguir el contrato de la Issue #16 y no modificar el
esquema.

## Estrategia aplicada

### 1. Reutilizar el catálogo existente

El resultado recibe `wodId` por path. `WodResultService` carga el `Wod` usando
`WodRepository` antes de validar o persistir. Esto permite:

- confirmar que el WOD existe;
- obtener su `WodType` desde persistencia;
- evitar que el cliente declare el tipo del WOD.

### 2. Modelar la tabla con una entidad específica

Se creó `WodResult` como entidad JPA independiente de los DTOs públicos.

Decisiones aplicadas:

- `@Table(name = "wod_results")`;
- ID `Integer` con `GenerationType.IDENTITY`;
- relaciones `ManyToOne(fetch = FetchType.LAZY)` con `User` y `Wod`;
- columnas snake_case explícitas cuando el nombre Java difiere;
- enums persistidos con `EnumType.STRING`;
- sin cascadas JPA de escritura añadidas.

### 3. Limitar la persistencia al usuario autenticado

El controller obtiene `Authentication` del contexto web y pasa únicamente su
nombre al servicio. El servicio normaliza el email y resuelve el `User` mediante
`UserRepository`.

La consulta del repositorio exige simultáneamente:

```text
user.id = usuario autenticado
wod.id = WOD solicitado
```

No se acepta `userId` en el DTO, y el response tampoco lo expone.

### 4. Separar validación HTTP y validación de dominio

`WodResultRequest` usa Jakarta Validation para restricciones independientes del
tipo del WOD. `WodResultService` mantiene las reglas cruzadas:

- `FOR_TIME` usa únicamente tiempo;
- `AMRAP` usa rondas y repeticiones;
- `EMOM` usa repeticiones totales.

Los errores se centralizan en `GlobalExceptionHandler` junto con los errores de
JSON ilegible y usuario autenticado no resoluble.

### 5. Controlar el tiempo mediante `Clock`

Se añadió `TimeConfiguration` para exponer un `Clock.systemUTC()` como bean.
El servicio usa ese reloj para:

- asignar `completedAt` cuando falta;
- rechazar fechas futuras;
- permitir tests con un reloj fijo.

### 6. Mantener el contrato JSON estricto

Se habilitó:

```properties
spring.jackson.deserialization.fail-on-unknown-properties=true
```

Así, un campo no definido, incluido `userId`, no se ignora silenciosamente y
produce una respuesta de validación `400`.

## Componentes implementados

### Producción

- `entity/WodResult.java`
- `repository/WodResultRepository.java`
- `dto/WodResultRequest.java`
- `dto/WodResultResponse.java`
- `service/WodResultService.java`
- `controller/WodResultController.java`
- `config/TimeConfiguration.java`
- `exception/AuthenticatedUserNotFoundException.java`
- `exception/InvalidWodResultException.java`
- ampliación de `exception/GlobalExceptionHandler.java`
- configuración JSON en `application.properties`

### Tests

- `service/WodResultServiceTest.java`
- `controller/WodResultControllerTest.java`
- `repository/WodResultRepositoryTest.java`
- ampliación de `security/SecurityHttpTest.java`
- propiedades de prueba JWT en `WodExplorerApplicationTests.java`

## Endpoints resultantes

### POST

```text
POST /api/wods/{wodId}/results
```

El controller valida el DTO, delega en el servicio y responde `201 Created`.

### GET

```text
GET /api/wods/{wodId}/results
```

El controller delega en el servicio y responde `200 OK` con la lista de
resultados propios ordenada por fecha e ID descendentes.

No se añadió ningún endpoint adicional.

## Estrategia de errores

- Seguridad existente para JWT ausente, inválido o expirado.
- `AuthenticatedUserNotFoundException` para subject sin usuario.
- `WodNotFoundException` reutilizada para WOD inexistente.
- `InvalidWodResultException` para reglas dependientes del tipo.
- Jakarta Validation para números, nivel obligatorio y body.
- `HttpMessageNotReadableException` para JSON, enum, fecha y campos desconocidos.

Todos se transforman en el formato existente de `GlobalExceptionHandler` sin
try/catch repetidos en el controller.

## Estrategia de pruebas aplicada

### Servicio

Tests unitarios con JUnit 5, Mockito y `Clock` fijo para comprobar:

- creación `FOR_TIME` y asociación de usuario/WOD;
- normalización del email autenticado;
- creación `AMRAP` con ceros válidos;
- creación `EMOM` con repeticiones;
- métricas ausentes o incompatibles;
- fechas futuras;
- usuario autenticado no existente;
- consulta filtrada por usuario y WOD;
- WOD inexistente.

### Controller

`@WebMvcTest` con MockMvc para comprobar:

- creación `201`;
- response sin `userId`;
- rechazo de `userId` en el body;
- nivel ausente;
- consulta de resultados;
- WOD inexistente como `404`.

### Seguridad

`SecurityHttpTest` incluye el nuevo controller para comprobar:

- GET sin JWT como `401`;
- GET con JWT válido usando el subject del token.

### Persistencia

`WodResultRepositoryTest` usa `@DataJpaTest` contra la base MySQL configurada,
con rollback transaccional, para comprobar que el método derivado:

- solo devuelve resultados del usuario indicado;
- solo devuelve resultados del WOD indicado;
- respeta `completedAt DESC, id DESC`.

## Verificación ejecutada

Desde `backend/`:

```bash
./mvnw test
./mvnw validate
./mvnw package
```

Resultado observado:

- 83 tests ejecutados correctamente;
- `validate` correcto;
- `package` correcto;
- el test de persistencia dejó `wod_results` sin filas tras el rollback.

## Fuera de alcance respetado

- No se creó `ExerciseResult`.
- No se modificó SQL ni el esquema MySQL.
- No se cambió `SecurityConfig` ni el mecanismo JWT.
- No se modificó el frontend.
- No se implementaron PUT, DELETE ni endpoints de consulta global.
