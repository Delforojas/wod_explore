# SDD - Issue #72: Multiples prescripciones por ejercicio

## Estado

Spec de implementacion full-stack para ampliar las prescripciones compatibles
de WODs personalizados. La rama de trabajo es
`feat/072-multiple-exercise-prescriptions`, derivada de `main`.

El contrato existente ya transporta una lista de prescripciones por ejercicio y
el esquema MySQL ya persiste una fila por unidad. Esta Issue corrige la matriz
de compatibilidad para que los ejercicios de peso admitan repeticiones y peso.

## Objetivo

Permitir configurar, visualizar, enviar y recuperar varias prescripciones
compatibles para un mismo movimiento, especialmente `REPS + KG` para ejercicios
de tipo `WEIGHT`, sin cambiar endpoints ni el esquema de persistencia.

## Alcance

### Incluido

- Cambiar la matriz frontend de `WEIGHT` a `REPS` y `KG`.
- Cambiar la matriz backend de `WEIGHT` a `REPS` y `KG`.
- Mantener las unidades `REPS`, `KG`, `METERS`, `SECONDS` y `OTHER`.
- Mantener `WEIGHT_DISTANCE` como `KG + METERS`.
- Mostrar un campo y etiqueta claros para cada prescripcion.
- Enviar todas las prescripciones en `POST` y `PUT /api/user-wods`.
- Mantener precarga, edicion, ordenacion y eliminacion de movimientos.
- Rechazar unidades incompatibles, unidades repetidas, valores invalidos y
  combinaciones incompletas en el backend.
- Mantener la validacion local, los mensajes de error y la accesibilidad del
  formulario compartido.
- Anadir tests de comportamiento frontend, service backend, controller y
  persistencia cuando sean necesarios.

### Excluido

- Nuevos endpoints, dependencias, tablas, columnas, indices o migraciones SQL.
- Prescripciones arbitrarias fuera de la matriz de `measurementType`.
- Varias prescripciones de la misma unidad.
- Cambios en resultados, catalogo global o autenticacion.
- Persistencia de borradores o refactorizaciones generales del formulario.

## Matriz de compatibilidad

| `measurementType` | Prescripciones exactas |
| --- | --- |
| `REPS` | `REPS` |
| `DISTANCE` | `METERS` |
| `WEIGHT` | `REPS` y `KG` |
| `TIME` | `SECONDS` |
| `WEIGHT_DISTANCE` | `KG` y `METERS` |
| `OTHER` | `OTHER` con `unitLabel` no vacio |

`REPS` y `SECONDS` requieren valores enteros positivos. Las demas unidades
admiten valores positivos con hasta dos decimales. El backend comparara el
conjunto recibido con el conjunto esperado y usara la restriccion existente de
`(wod_exercise_id, unit)` como defensa adicional contra duplicados.

## Contrato y flujo

No cambian las rutas ni la forma de los DTOs. Un ejercicio de peso se envia asi:

```json
{
  "exerciseId": 1,
  "position": 1,
  "prescriptions": [
    { "value": 10, "unit": "REPS", "unitLabel": null },
    { "value": 60, "unit": "KG", "unitLabel": null }
  ]
}
```

El frontend construye ambos campos desde el `measurementType` del catalogo,
valida cada valor y conserva ambas entradas al crear o editar. El backend
valida la matriz antes de modificar la entidad y crea una fila por
prescripcion dentro de la transaccion existente. Las respuestas devuelven la
lista completa de prescripciones.

## Compatibilidad y persistencia

- `POST`, `GET` y `PUT /api/user-wods` conservan sus rutas y contratos.
- Los ejercicios de tipo no ponderado mantienen una unica prescripcion.
- Los WODs existentes con la matriz anterior se pueden cargar para editar; si
  falta una unidad vigente, el formulario muestra el campo vacio y no inventa
  ningun valor. Cualquier actualizacion debe enviar la matriz completa vigente.
- No se modifica MySQL: `wod_exercise_prescriptions` ya soporta varias filas y
  su FK/cascade/unicidad cubren la operacion.
- No se crea una segunda fuente de verdad en JSON.

## Criterios de aceptacion

- [ ] Un ejercicio `WEIGHT` permite `10 REPS + 60 KG`.
- [ ] `REPS`, `DISTANCE`, `TIME`, `WEIGHT_DISTANCE` y `OTHER` mantienen su
  compatibilidad y validaciones.
- [ ] Las dos prescripciones se muestran y se envian en la creacion.
- [ ] Las dos prescripciones se precargan, editan y envian mediante PUT.
- [ ] Las dos prescripciones persisten y se devuelven en el detalle.
- [ ] Las unidades incompatibles o repetidas producen un error comprensible.
- [ ] El orden y la eliminacion de movimientos no se rompen.
- [ ] Los tests relevantes, lint y build pasan.

## Referencias

- Issue #72.
- `specs/043-diseno-wods-personalizados/spec.md`.
- `specs/045-user-wods-api/spec.md`.
- `specs/046-crear-wods/spec.md`.
- `specs/048-editar-wods-personalizados/spec.md`.
- `frontend/src/components/UserWodForm.tsx`.
- `backend/src/main/java/com/wodexplorer/service/UserWodService.java`.
- `backend/src/main/java/com/wodexplorer/entity/WodExercisePrescription.java`.
