# Tasks - Issue #61: Implementar favoritos autenticados en backend

- [x] Confirmar el contrato de la Issue #61 y el SDD frente a la Spec 026.
- [x] Crear la migracion versionada para `wod_favorites`.
- [x] Actualizar el esquema aislado de tests y las definiciones limpias si corresponde.
- [x] Crear la entidad y el ID compuesto de favoritos.
- [x] Crear `FavoriteWodResponse` sin `userId` ni entidad JPA.
- [x] Crear repository con consultas de ownership y orden determinista.
- [x] Crear service con autenticacion, accesibilidad del WOD e idempotencia.
- [x] Exponer GET, PUT y DELETE desde `UserController`.
- [x] Cubrir el service con tests unitarios.
- [x] Cubrir el contrato HTTP con tests de controller.
- [x] Cubrir MySQL, FKs, duplicados, orden y aislamiento con Testcontainers.
- [x] Ejecutar `./mvnw validate` y corregir errores relacionados con la Issue.
- [x] Ejecutar `./mvnw test` y corregir fallos relacionados con la Issue.
- [x] Ejecutar `./mvnw package` y corregir fallos relacionados con la Issue.
- [x] Revisar alcance, diff, status y ausencia de secretos.
- [x] Crear el commit exclusivo de la Issue #61.
- [x] Documentar commit, verificaciones y rama en la Issue sin cerrarla.
