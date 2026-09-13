# Plan ejecutado - Issue #19: Perfil e historial autenticado

## Enfoque

Implementar las consultas bajo el flujo existente:

```text
Controller -> Service -> Repository -> MySQL
```

Se ampliará `UserController` para el perfil y el historial, manteniendo
`UserService` para la lectura del usuario y creando un `UserHistoryService` para
coordinar las dos fuentes de resultados. No se modificarán JWT ni
`SecurityConfig`, porque `/api/**` ya requiere autenticación.

## DTOs y servicios

1. Añadir `UserHistoryResponse` con `wodResults` y `exerciseResults`.
2. Añadir `UserService.findCurrentUser(String authenticatedEmail)`.
3. Añadir `UserHistoryService.findOwnHistory(String authenticatedEmail)`.
4. Normalizar el email y resolver el usuario desde `UserRepository` en ambos
   flujos.
5. Convertir resultados existentes a `WodResultResponse` y
   `ExerciseResultResponse`, sin exponer entidades ni hashes.

## Repositories

1. Añadir `findByUser_IdOrderByCompletedAtDescIdDesc` a
   `WodResultRepository`.
2. Añadir `findByUser_IdOrderByPerformedAtDescIdDesc` a
   `ExerciseResultRepository`.
3. Mantener filtros explícitos por usuario y orden estable por fecha e ID.

## Controller y errores

1. Implementar `GET /api/users/me` con `Authentication`.
2. Implementar `GET /api/users/me/history` con `Authentication`.
3. Reutilizar `AuthenticatedUserNotFoundException` y
   `GlobalExceptionHandler`.
4. No aceptar parámetros de usuario ni modificar la configuración de seguridad.

## Verificación ejecutada

- Tests unitarios de `UserService` para normalización, respuesta segura y usuario
  no resoluble.
- Tests unitarios de `UserHistoryService` para filtrado por usuario,
  transformación y listas vacías.
- `@WebMvcTest` para perfil, historial, autenticación del controller y ausencia
  de campos sensibles.
- Tests de seguridad para JWT ausente y JWT válido usando el subject.
- Tests `@DataJpaTest` para los nuevos métodos de orden y aislamiento por usuario.
- Ejecutados desde `backend/`: `./mvnw validate`, `./mvnw test` y
  `./mvnw package`.
- Resultado: 113 tests correctos; `validate` y `package` correctos.
- Las pruebas de repositorio confirmaron filtros por usuario y orden temporal
  contra MySQL 8.4.11.
- No se modificaron scripts SQL ni el esquema.
