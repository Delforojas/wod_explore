# Plan - Issue #72: Multiples prescripciones por ejercicio

## Secuencia

1. Crear la rama de trabajo desde `main` y registrar este SDD.
2. Actualizar `unitsForMeasurement` para que `WEIGHT` genere los campos `REPS`
   y `KG`, sin alterar las demas matrices.
3. Actualizar `UserWodService.expectedUnits` con la misma matriz y conservar la
   validacion de duplicados, valores y `unitLabel`.
4. Ampliar los tests unitarios del service para verificar creacion con dos
   prescripciones, respuesta completa y rechazo de combinaciones invalidas.
5. Ampliar los tests de integracion para comprobar dos filas persistidas,
   recuperacion y reemplazo durante edicion.
6. Ampliar los tests frontend de crear y editar para verificar campos, envio de
   ambas unidades y precarga/actualizacion.
7. Ejecutar las verificaciones requeridas de backend y frontend, revisar el
   diff y confirmar que no se incluyen cambios locales ajenos.

## Decisiones

- Se reutiliza la lista `prescriptions` ya definida en los requests y responses.
- `WEIGHT` requiere exactamente `REPS + KG`, porque es el caso funcional de la
  Issue y evita aceptar combinaciones ambiguas.
- La UI no ofrece un selector libre de unidades: genera las unidades validas a
  partir de `measurementType`, por lo que no permite duplicados por
  construccion.
- El backend permanece como autoridad y rechaza payloads manuales con unidades
  incompatibles o repetidas.
- No se cambia el esquema MySQL ni se anaden dependencias.
