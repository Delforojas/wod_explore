# Tasks - Issue #59: Asegurar ownership de resultados en WODs personalizados

- [x] Confirmar rama, estado Git, Issue #59 y dependencias documentales.
- [x] Crear `spec.md`, `plan.md` y `tasks.md` con alcance y decisiones validas.
- [x] Implementar una resolucion de WOD accesible para el usuario autenticado.
- [x] Aplicar la autorizacion en la creacion de resultados.
- [x] Aplicar la autorizacion en la consulta de resultados propios.
- [x] Mantener el acceso a WODs globales y al WOD personalizado propio.
- [x] Devolver `WodNotFoundException` para WOD ajeno sin revelar ownership.
- [x] Verificar que la autorizacion ocurre antes de persistir o consultar resultados.
- [x] Cubrir el service con tests de WOD global, propio, ajeno e inexistente.
- [x] Cubrir el controller con respuestas `404` para create y consulta rechazados.
- [x] Cubrir integracion MySQL y confirmar que un intento ajeno no modifica datos.
- [x] Ejecutar `./mvnw validate` desde `backend/`.
- [x] Ejecutar `./mvnw test` desde `backend/`.
- [x] Ejecutar `./mvnw package` desde `backend/`.
- [x] Revisar diff, secretos, esquema y cambios ajenos.
- [ ] Crear el commit exclusivo de la Issue #59.
- [ ] Documentar la Issue abierta con commit y validaciones manuales pendientes.
