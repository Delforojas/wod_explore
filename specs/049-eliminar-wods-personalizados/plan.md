# Plan - Issue #49: Eliminar WODs personalizados

## Estrategia

Aplicar el cambio minimo sobre las capas existentes. El backend reutilizara la
resolucion de usuario y ownership de `UserWodService`, anadira una consulta
eficiente de existencia de resultados y eliminara mediante las relaciones JPA y
FK ya existentes. No se creara migracion ni se cambiara la politica de cascada.

El frontend reutilizara el detalle personal, `StateMessage`, el hash router y
los tokens CSS actuales. La confirmacion sera un dialogo nativo y el feedback
de exito viajara en la ruta, no en almacenamiento local.

## Decisiones

- La politica de resultados es bloqueo: si `wod_results` contiene una fila con
  el WOD, se devuelve `409 Conflict` y no se ejecuta ningun delete.
- Se usa `existsByWod_Id` en `WodResultRepository` para no cargar resultados ni
  contar filas innecesariamente.
- El service consulta primero `findByIdAndOwner_Id`; esto mantiene el `404`
  generico para WOD inexistente, global o ajeno.
- `Wod` mantiene `cascade = ALL` y `orphanRemoval` para sus ejercicios, y las
  FKs de MySQL eliminan sus prescripciones. Los ejercicios de catalogo no se
  tocan.
- Se usa `ResponseEntity<Void>` con `204 No Content` en el controller.
- El error de historial se modela como una excepcion especifica mapeada a `409`
  por `GlobalExceptionHandler`.
- El router aceptara el query `deleted=1` unicamente para mostrar el feedback
  de navegacion; la lista seguira siendo consultada desde la API.
- El detalle mantendra estado local para dialogo y eliminacion, sin contexto ni
  dependencia de estado global.

## Orden de implementacion

1. Anadir la excepcion de borrado bloqueado y su respuesta `409` centralizada.
2. Anadir `existsByWod_Id` al repository de resultados.
3. Implementar `UserWodService.delete` con ownership, bloqueo historico,
   eliminacion y flush transaccional.
4. Anadir `DELETE` al controller y ampliar tests HTTP y seguridad.
5. Cubrir el service con escenarios de exito, ownership, historial y orden de
   operaciones; anadir integracion MySQL para cascadas y preservacion del
   resultado/catalogo.
6. Anadir `deleteUserWod` al cliente API y testear metodo, token y `204` vacio.
7. Extender router y listado para transportar y mostrar feedback de exito.
8. Anadir dialogo, estados y accion de eliminacion al detalle personal.
9. Anadir tests de confirmacion, cancelacion, carga, error, exito y navegacion.
10. Revisar accesibilidad/responsive con detector Impeccable y ejecutar todas las
    verificaciones aplicables.

## Verificacion

- `./mvnw validate`, `./mvnw test` y `./mvnw package` desde `backend/`.
- Tests de integracion con MySQL 8.4 que verifiquen cascadas de hijos, no
  eliminacion de ejercicios y bloqueo cuando hay resultados.
- `npm test`, `npm run lint` y `npm run build` desde `frontend/`.
- `git diff --check`, revision de `git status` y diff limitado a la Issue.
- Comprobaciones read-only con `wodsql`; no se ejecutaran escrituras manuales.
- Revision mecanica y manual de focus, Escape, responsive y overflow.
