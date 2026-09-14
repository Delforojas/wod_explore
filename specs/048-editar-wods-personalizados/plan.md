# Plan - Issue #48: Editar WODs personalizados

## Secuencia

1. Anadir `UserWodUpdateRequest` con la misma forma y validacion declarativa que
   el payload completo de creacion, sin campos de ownership.
2. Extraer en `UserWodService` la validacion y construccion comun, y anadir
   `update` con ownership filtrado, reemplazo de hijos, flush intermedio y
   respuesta completa dentro de `@Transactional`.
3. Anadir `PUT` en `UserWodController` y ampliar los tests unitarios, HTTP y de
   seguridad para exito, autenticacion, ownership, globales, desconocidos,
   validaciones y reemplazo.
4. Inspeccionar el esquema MySQL existente y verificar que no requiere cambios;
   probar la sustitucion con la infraestructura MySQL de tests si el entorno lo
   permite.
5. Extraer el formulario de `CreateWodPage` a un componente compartido sin
   cambiar el flujo de creacion.
6. Anadir schema y cliente `updateUserWod`, ruta `my-wods/:id/edit`, pagina de
   carga y accion `Editar` desde el detalle personal.
7. Precargar todos los campos y mantener validacion, reordenacion, prescripciones,
   estados de guardado y enlace al detalle actualizado.
8. Anadir tests de formulario, API, router, navegacion y pagina de edicion.
9. Ejecutar las verificaciones aplicables de backend, frontend, MySQL y detector
   visual; corregir cualquier fallo antes de marcar tasks.

## Decisiones

- Se usa `PUT` porque el request reemplaza la configuracion completa.
- Se reutiliza `findByIdAndOwner_Id` para que inexistentes, globales y ajenos sean
  indistinguibles.
- Se limpia y hace flush de la coleccion administrada antes de anadir nuevos
  hijos para evitar la constraint unica de posiciones.
- No se crea migracion SQL: las columnas, FKs, cascadas, prescripciones e indices
  existentes cubren la actualizacion.
- No se anade una guarda de cambios no guardados porque el proyecto no tiene un
  mecanismo establecido de borradores o bloqueo de navegacion.
