# SDD - Issue #48: Permitir editar WODs personalizados

## Estado

Spec de implementacion full-stack para actualizar WODs personalizados propios.
La rama de trabajo sera `feat/048-edit-custom-wods`, derivada de `main` despues
de integrar las Issues #44, #45, #46 y #47.

La API usara `PUT /api/user-wods/{id}` y recibira la configuracion completa del
WOD. El propietario se resolvera exclusivamente desde `Authentication`; el
request no tendra campos de ownership.

## Objetivo

Permitir que una persona autenticada cargue, modifique y guarde un WOD
personalizado propio, sustituyendo atomicamente su configuracion anterior y sin
permitir acceso a WODs de otras cuentas ni a WODs globales.

## Alcance

### Incluido

- Endpoint autenticado `PUT /api/user-wods/{id}`.
- DTO especifico de actualizacion, sin `id`, `userId` ni `ownerId` en el body.
- Ownership por el subject del JWT y respuesta generica `404` para WOD inexistente,
  global o de otra cuenta.
- Reutilizacion de las reglas de validacion de creacion para nombre, tipo,
  categoria, nivel, rondas, time limit, posiciones y prescripciones.
- Validacion de existencia de todos los ejercicios seleccionados.
- Reemplazo transaccional de ejercicios y prescripciones mediante las relaciones
  JPA existentes con cascade y orphan removal.
- Respuesta completa `UserWodDetailResponse` con ejercicios en orden.
- Cliente API, schema Zod, ruta hash de edicion y accion `Editar` en el detalle.
- Formulario de edicion reutilizando la composicion y logica de `CreateWodPage`.
- Estados de carga, guardado, error, sesion privada y confirmacion.
- Tests unitarios del service, tests HTTP del controller/seguridad y tests de
  comportamiento del formulario y navegacion.

### Excluido

- Nueva migracion, cambio de tablas, columnas, indices o constraints MySQL.
- Edicion de WODs globales, eliminacion de WODs o edicion de resultados.
- Nuevos mecanismos de autenticacion, roles o permisos.
- Soporte de repeticiones variables por ronda, porque el modelo vigente no lo
  contempla y anadirlo ampliaria el esquema fuera de esta Issue.
- Persistencia de borradores o guardas globales de formulario, porque no existe
  actualmente un mecanismo establecido para ello.
- Nuevas dependencias o refactorizaciones fuera del formulario compartido.

## Contrato HTTP

### `PUT /api/user-wods/{id}`

Requiere un JWT valido. El controller obtiene `Authentication.getName()` y el
service normaliza el email y busca el WOD con `findByIdAndOwner_Id`. El body usa
la misma forma completa que la creacion:

```json
{
  "name": "Fran personal",
  "type": "FOR_TIME",
  "category": "METCON",
  "level": "RX",
  "timeLimit": 600,
  "rounds": null,
  "exercises": [
    {
      "exerciseId": 1,
      "position": 1,
      "prescriptions": [{ "value": 21, "unit": "REPS", "unitLabel": null }]
    }
  ]
}
```

La respuesta sera `200 OK` con `UserWodDetailResponse`. El request rechaza
propiedades desconocidas mediante la configuracion Jackson existente, por lo
que no acepta `userId`, `ownerId` ni equivalentes.

## Reglas de negocio

- El usuario autenticado es el unico propietario considerado.
- Un WOD no encontrado por `(id, owner_id)` produce `UserWodNotFoundException` y
  `404`, sin distinguir entre inexistente, global o ajeno.
- Se aplican las reglas existentes de `UserWodService` para estructura del WOD,
  posiciones consecutivas y matriz compatible con `measurementType`.
- Los ejercicios se consultan por sus ids y cada id debe existir.
- La configuracion previa se elimina mediante `orphanRemoval`; las nuevas filas
  se insertan en la misma transaccion y conservan las posiciones recibidas.
- Se ejecutara un flush despues de limpiar los hijos y antes de insertar los
  nuevos para respetar la unicidad `(wod_id, position)` durante el reemplazo.
- Una excepcion de validacion o persistencia revierte la operacion completa.
- Las entidades no se exponen directamente; se devuelve el DTO de detalle.

## Diseno frontend

- La ruta sera `#/my-wods/:id/edit` y se anadira a la union del router.
- `MyWodDetailPage` mostrara `Editar` solo dentro del detalle autenticado y
  ownership ya filtrado por la API.
- `EditWodPage` cargara el detalle con `getUserWod`, mostrara loading/error y
  entregara los valores al formulario compartido.
- `UserWodForm` compartira con crear la seleccion de ejercicios, reordenacion,
  eliminacion, prescripciones, validacion y estados de guardado.
- En modo edicion se precargaran nombre, tipo, nivel, time limit, rondas,
  ejercicios, medidas, etiquetas y orden.
- El guardado llamara a `updateUserWod` y mostrara un enlace al detalle
  actualizado. El modo crear conservara su comportamiento actual.
- Se mantendran textos en espanol, HTML semantico, foco visible, targets de
  44px y layout mobile-first desde 320px.

## Compatibilidad

- `POST /api/user-wods`, `GET /api/user-wods` y `GET /api/user-wods/{id}` no
  cambiaran su contrato ni comportamiento.
- El catalogo global continuara excluyendo WODs con propietario.
- No se modifica el esquema real inspeccionado mediante `wodsql`.
- No se anadiran dependencias.

## Criterios de aceptacion

- [ ] Un usuario autenticado puede editar un WOD personalizado propio.
- [ ] El propietario se obtiene del contexto de seguridad y el request no acepta
  `userId` ni `ownerId`.
- [ ] Otro usuario no puede editar un WOD ajeno y un WOD global no es editable.
- [ ] Los datos existentes se precargan correctamente en el formulario.
- [ ] Se pueden cambiar nombre, tipo, rondas, time limit, ejercicios, cantidades,
  unidades y orden cuando corresponda.
- [ ] La edicion aplica las mismas validaciones funcionales que la creacion.
- [ ] La API valida ejercicios existentes y prescripciones compatibles.
- [ ] El reemplazo no deja relaciones huerfanas ni ejercicios duplicados.
- [ ] El orden de ejercicios se conserva despues de guardar.
- [ ] Los cambios se persisten en MySQL dentro de una transaccion.
- [ ] El listado y detalle reflejan los datos actualizados.
- [ ] Los errores de validacion, autenticacion, ownership y backend usan los
  mecanismos existentes.
- [ ] Creacion, listado y detalle existentes continuan funcionando.
- [ ] El formulario comunica carga, guardado y evita envios duplicados.
- [ ] La interfaz mantiene responsive, accesibilidad y coherencia visual.
- [ ] Tests unitarios, HTTP, comportamiento, lint y build pasan correctamente.

## Referencias

- Issue #44: modelo de datos para WODs personalizados.
- Issue #45: API para WODs personalizados de usuario.
- Issue #46: interfaz para crear WODs personalizados.
- Issue #47: seccion Mis WODs.
- `backend/src/main/java/com/wodexplorer/service/UserWodService.java`.
- `backend/src/main/java/com/wodexplorer/controller/UserWodController.java`.
- `backend/src/main/java/com/wodexplorer/entity/Wod.java`.
- `backend/src/main/java/com/wodexplorer/entity/WodExercise.java`.
- `frontend/src/pages/CreateWodPage.tsx`.
- `frontend/src/pages/MyWodDetailPage.tsx`.
- `DESIGN.md`.
