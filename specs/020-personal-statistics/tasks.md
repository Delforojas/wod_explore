# Tasks - Issue #20: Estadísticas y evolución personal

## Preparación y contrato

- [x] Confirmar Issue #20, dependencias y decisiones funcionales.
- [x] Confirmar esquema de `users`, `wods`, `exercises`, `wod_results` y
  `exercise_results` mediante `wodsql`.
- [x] Crear DTOs públicos para estadísticas, marcas y evolución.
- [x] Mantener respuestas vacías consistentes y sin campos sensibles.

## Repositorios

- [x] Añadir consulta de resultados WOD propios en orden temporal ascendente.
- [x] Añadir consulta de resultados de ejercicios propios en orden temporal
  ascendente.
- [x] Cargar las relaciones necesarias de forma intencionada en las consultas.
- [x] Mantener el esquema MySQL y los scripts SQL sin cambios.

## Servicio de estadísticas

- [x] Crear el servicio de estadísticas autenticadas.
- [x] Resolver el usuario exclusivamente desde el subject JWT.
- [x] Calcular contadores de resultados WOD y de ejercicios.
- [x] Calcular marcas WOD por WOD y nivel.
- [x] Aplicar las reglas `FOR_TIME`, `AMRAP` y `EMOM`.
- [x] Aplicar desempate por fecha descendente e ID descendente.
- [x] Calcular marcas de ejercicio por ejercicio y `recordType`.
- [x] Aplicar la dirección correcta según unidad y desempates deterministas.
- [x] Convertir resultados a DTOs sin entidades ni datos sensibles.

## Servicio de evolución

- [x] Crear la consulta de evolución autenticada.
- [x] Convertir resultados WOD a puntos con nombre y tipo.
- [x] Convertir resultados de ejercicios a puntos con nombre y medición.
- [x] Mantener listas independientes ordenadas por fecha e ID ascendente.
- [x] Devolver listas vacías cuando no existan resultados.

## API y seguridad

- [x] Implementar `GET /api/users/me/statistics`.
- [x] Implementar `GET /api/users/me/evolution`.
- [x] Confirmar protección JWT de ambos endpoints.
- [x] Confirmar que no se acepta ni utiliza `userId` del cliente.
- [x] Mantener el formato de error `401` existente.

## Testing

- [x] Crear tests unitarios del cálculo de marcas WOD.
- [x] Crear tests unitarios del cálculo de marcas de ejercicios.
- [x] Cubrir empates, listas vacías, conteos y aislamiento por usuario.
- [x] Crear tests unitarios de transformación y orden de evolución.
- [x] Crear tests HTTP de ambos endpoints y contratos JSON.
- [x] Ampliar tests HTTP de seguridad para JWT ausente y válido.
- [x] Crear tests de repositorio para filtros, orden y relaciones cargadas.

## Verificación final

- [x] Ejecutar `./mvnw validate`.
- [x] Ejecutar `./mvnw test`.
- [x] Ejecutar `./mvnw package`.
- [x] Revisar `git diff` y confirmar alcance limitado a Issue #20.
- [x] Confirmar que no se modificó el esquema MySQL.
- [x] Marcar todos los criterios de aceptación como completados.
- [ ] Crear y documentar el commit de la Issue #20.
