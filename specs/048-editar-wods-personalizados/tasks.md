# Tasks - Issue #48: Editar WODs personalizados

- [x] Crear DTO `UserWodUpdateRequest` sin campos de ownership.
- [x] Extraer y reutilizar la validacion comun de WOD y prescripciones.
- [x] Implementar `UserWodService.update` con ownership desde JWT.
- [x] Reemplazar ejercicios y prescripciones de forma transaccional y segura.
- [x] Anadir `PUT /api/user-wods/{id}` al controller.
- [x] Cubrir service con tests de exito, validacion, ejercicio inexistente,
  ownership y rollback/reemplazo.
- [x] Cubrir controller y seguridad con tests HTTP para PUT, JWT y campos
  desconocidos de ownership.
- [x] Verificar el esquema MySQL y la persistencia del reemplazo sin migracion.
- [x] Extraer `UserWodForm` reutilizable desde el formulario de creacion.
- [x] Mantener el flujo de creacion funcionando con el formulario compartido.
- [x] Anadir schema y cliente frontend para la actualizacion PUT.
- [x] Anadir ruta de edicion y accion `Editar` en el detalle personal.
- [x] Cargar y precargar todos los datos del WOD en el formulario.
- [x] Mostrar estados privados, carga, error, guardado, exito y evitar submits
  duplicados en edicion.
- [x] Cubrir API, router, navegacion y edicion frontend con tests.
- [x] Ejecutar `./mvnw validate` desde `backend/`.
- [x] Ejecutar `./mvnw test` desde `backend/`.
- [x] Ejecutar `./mvnw package` desde `backend/`.
- [x] Ejecutar `npm test` desde `frontend/`.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar detector Impeccable sobre las superficies frontend modificadas.
- [x] Revisar diff, alcance, secretos, estado Git y ausencia de cambios ajenos.
- [ ] Crear el commit exclusivo de la Issue #48.
- [ ] Documentar la Issue abierta con commit y validaciones manuales pendientes.
