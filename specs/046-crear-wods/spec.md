# SDD - Issue #46: Crear interfaz para WODs personalizados

## Estado

Spec de implementacion frontend para la pantalla autenticada de creacion de
WODs personalizados. La rama de trabajo es `feat/046-create-user-wods`,
derivada de `main` despues de integrar la Issue #45.

La implementacion se limita al frontend. Consumira la API existente de
`/api/user-wods` y el catalogo de ejercicios de `/api/exercises`; no modifica
backend, esquema, autenticacion ni persistencia local.

## Objetivo

Permitir que una persona autenticada disene y guarde un WOD propio desde una
pantalla clara, responsive y accesible, conservando el orden de ejercicios y
enviando las prescripciones compatibles con el `measurementType` del catalogo.

## Alcance

### Incluido

- Nueva ruta hash `#/create-wod` y pantalla identificable como "Crear WOD".
- Acceso desde un CTA en WODs y desde la navegacion principal de escritorio y
  movil.
- Formulario con nombre, tipo y nivel, usando los enums del backend.
- Campos de `timeLimit` y `rounds` condicionados por `WodType` segun #45.
- Selector de ejercicios mediante dialogo nativo con busqueda en el catalogo.
- Multiples ejercicios, repeticion del mismo ejercicio, reordenacion y
  eliminacion antes de guardar.
- Prescripciones dinamicas para `REPS`, `DISTANCE`, `WEIGHT`, `TIME`,
  `WEIGHT_DISTANCE` y `OTHER`, con unidades visibles.
- Validacion local comprensible antes del POST.
- Cliente API y schemas Zod para la request y la respuesta de creacion.
- Estados de carga, error de API/red, sesion no autenticada y confirmacion de
  guardado sin perder los datos introducidos ante un error.
- Tests de comportamiento de formulario, selector, validacion, request y
  estados.

### Excluido

- Listado o detalle de "Mis WODs"; corresponde a la Issue #47.
- Edicion o eliminacion; corresponden a Issues posteriores.
- Cambios backend, migraciones, roles o nuevos mecanismos de autenticacion.
- Nuevas dependencias; se reutilizan React, Vitest, Testing Library y Zod.
- Persistencia del borrador en localStorage o sessionStorage.

## Decisiones de experiencia

- El acceso sera doble: CTA visible en la cabecera de WODs y enlace persistente
  "Crear WOD" en rail de escritorio y navegacion movil.
- El selector de ejercicios sera un `<dialog>` nativo, con titulo, cierre,
  buscador, resultados paginados, foco gestionado por el navegador y botones
  claros para anadir. No se usara un contenedor con handlers como modal falso.
- `AMRAP` muestra `timeLimit` obligatorio y no muestra rondas. `EMOM` muestra
  `timeLimit` obligatorio y permite rondas. `FOR_TIME` muestra ambos campos
  opcionales.
- Tras guardar correctamente se muestra una confirmacion visible con el nombre
  creado y el identificador devuelto. El formulario sigue disponible para crear
  otro WOD, sin enlazar al catalogo global porque #45 lo mantiene separado.

## Contrato frontend-backend

La request a `POST /api/user-wods` tiene esta forma:

```json
{
  "name": "Fran personal",
  "type": "FOR_TIME",
  "level": "RX",
  "timeLimit": 600,
  "rounds": null,
  "exercises": [
    {
      "exerciseId": 1,
      "position": 1,
      "prescriptions": [{ "value": 21, "unit": "REPS" }]
    }
  ]
}
```

La respuesta es `UserWodDetailResponse` de #45 y se valida con Zod. Los
ejercicios del selector proceden de `GET /api/exercises?page=0&size=20&name=`
y se almacenan solo en estado local hasta guardar.

La matriz visual de prescripciones es:

| measurementType | Campos y unidad enviada |
| --- | --- |
| `REPS` | valor entero, `REPS` |
| `DISTANCE` | valor decimal, `METERS` |
| `WEIGHT` | valor decimal, `KG` |
| `TIME` | valor entero, `SECONDS` |
| `WEIGHT_DISTANCE` | peso `KG` y distancia `METERS` |
| `OTHER` | valor positivo, `OTHER` y etiqueta de unidad obligatoria |

## Estados y accesibilidad

- Sin token: mensaje de superficie privada con enlace a iniciar sesion y sin
  peticiones de catalogo ni de guardado.
- Carga del catalogo: estado explicito dentro del dialogo.
- Catalogo vacio: mensaje que invita a cambiar la busqueda.
- Error de catalogo: mensaje con reintento y conservacion del formulario.
- Validacion: errores junto al campo afectado, vinculados mediante
  `aria-describedby`, con foco en el primer error al enviar.
- Guardado: boton deshabilitado, texto de carga y ausencia de submits duplicados.
- Error API o red: mensaje comprensible sin borrar nombre, ejercicios ni
  prescripciones.
- Exito: `role=status` y mensaje visible con accion para crear otro WOD.
- Controles reales, labels asociados, dialogo con `aria-labelledby`, foco
  visible, targets tactiles de al menos 44px y soporte desde 320px.

## Criterios de aceptacion

- [ ] El usuario puede abrir una pantalla "Crear WOD" dentro de WOD Explorer.
- [ ] El formulario permite introducir el nombre y seleccionar el tipo de WOD.
- [ ] Los campos de rondas y duracion/time cap aparecen unicamente cuando
  corresponden al tipo seleccionado.
- [ ] El usuario puede buscar o seleccionar ejercicios y anadir varios.
- [ ] Cada ejercicio muestra prescripciones segun `measurementType` y unidades.
- [ ] El usuario puede ordenar y eliminar ejercicios antes de guardar.
- [ ] El request conserva el orden visible y los valores introducidos.
- [ ] El formulario bloquea datos incompletos o invalidos con mensajes utiles.
- [ ] El guardado muestra carga y evita envios duplicados.
- [ ] Los errores de API se muestran sin perder los datos del formulario.
- [ ] Un guardado correcto muestra confirmacion visible del WOD creado.
- [ ] La pantalla funciona en viewport movil y escritorio sin overflow evitable.
- [ ] La pantalla funciona con teclado y tecnologias de asistencia basicas.
- [ ] Los tests cubren los flujos principales indicados por la Issue.

## Referencias

- Issue #45: API autenticada de WODs personalizados.
- `specs/043-diseno-wods-personalizados/spec.md`.
- `specs/045-user-wods-api/spec.md`.
- `DESIGN.md`.
- `frontend/src/api/client.ts`.
- `frontend/src/api/schemas.ts`.
- `frontend/src/app/router.ts`.
- `frontend/src/components/Layout.tsx`.
