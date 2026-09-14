# Tasks ejecutadas - Issue #19: Perfil e historial autenticado

## Preparación

- [x] Consultar la Issue #19 y sus criterios de aceptación.
- [x] Confirmar dependencias de las Issues #17 y #18.
- [x] Auditar las tablas `users`, `wod_results` y `exercise_results` con
  `wodsql`.
- [x] Revisar `UserResponse`, los DTOs de resultados y la seguridad existente.
- [x] Definir `GET /api/users/me/history` como historial agregado con dos listas.

## DTO y servicios

- [x] Crear `UserHistoryResponse`.
- [x] Añadir consulta de perfil autenticado a `UserService`.
- [x] Crear `UserHistoryService`.
- [x] Resolver el usuario exclusivamente desde el subject JWT.
- [x] Convertir WODs y ejercicios a DTOs públicos sin campos sensibles.
- [x] Aplicar `@Transactional(readOnly = true)` a las lecturas.

## Persistencia

- [x] Añadir consulta de resultados WOD por usuario y orden descendente.
- [x] Añadir consulta de resultados de ejercicio por usuario y orden descendente.
- [x] Verificar aislamiento por `user_id`.
- [x] Mantener relaciones y esquema existentes sin cambios.

## API y seguridad

- [x] Implementar `GET /api/users/me`.
- [x] Implementar `GET /api/users/me/history`.
- [x] Confirmar protección JWT de ambos endpoints.
- [x] Confirmar que no se aceptan ni usan `userId` de cliente.
- [x] Mantener `401` para usuario JWT no resoluble.

## Testing

- [x] Ampliar tests unitarios de `UserService`.
- [x] Crear tests unitarios de `UserHistoryService`.
- [x] Crear tests HTTP del perfil y del historial.
- [x] Verificar ausencia de `passwordHash`, `password_hash` y contraseña.
- [x] Verificar listas vacías y orden de ambas colecciones.
- [x] Ampliar tests HTTP de seguridad para JWT ausente y válido.
- [x] Añadir tests de repositorio para filtrado y orden.

## Verificación final

- [x] Ejecutar `./mvnw validate`.
- [x] Ejecutar `./mvnw test`.
- [x] Ejecutar `./mvnw package`.
- [x] Revisar diff y confirmar que no se modificó SQL ni frontend.
- [x] Actualizar el SDD con el resultado real.
- [x] Crear el commit de la Issue y documentarlo en GitHub.
