# Plan - Issue #71: Mostrar nombres reales de WODs y ejercicios en Historial

## Estrategia

Extender únicamente la respuesta agregada de `GET /api/users/me/history` y
consumir los nombres en `HistoryPage`:

```text
JPA EntityGraph -> UserHistoryService -> history DTOs -> Zod -> HistoryPage
```

No se modificaran tablas ni se haran peticiones adicionales por cada fila.

## Backend

1. Crear `HistoryWodResultResponse` con los campos actuales y `wodName`.
2. Crear `HistoryExerciseResultResponse` con los campos actuales y
   `exerciseName`.
3. Cambiar `UserHistoryResponse` para usar los DTOs específicos del historial.
4. Mapear `result.getWod().getName()` y `result.getExercise().getName()` en
   `UserHistoryService`, conservando todos los campos actuales.
5. Mantener la transacción read-only y los `@EntityGraph` de los repositorios
   para resolver relaciones sin N+1.
6. Añadir aserciones de nombres al test de servicio y al test MVC del historial.

## Frontend

1. Crear schemas derivados para los elementos del historial con nombre nullable.
2. Mantener `wodResultSchema` y `exerciseResultSchema` sin cambios para no
   modificar los endpoints individuales.
3. Cambiar `HistoryPage` para usar el nombre recibido y generar el fallback
   solo cuando el nombre sea nulo o vacío.
4. Mantener IDs en `href` y en el nombre accesible de cada enlace para conservar
   navegación y contexto.
5. Actualizar fixtures y tests para nombres reales, fallback, unidades, fechas y
   URLs de detalle.

## Compatibilidad y casos límite

- Un WOD global, un WOD personalizado y un registro legacy usan el mismo campo
  `Wod.name`; no se distingue su origen en la UI.
- Si `wodName` o `exerciseName` llega como `null` o cadena vacía, la interfaz
  usara la etiqueta técnica existente como fallback.
- Una página vacía no renderiza filas y conserva el estado vacío actual.
- Los errores de API continúan usando `ApiError` y `StateMessage` sin cambios de
  autenticación.

## Verificación

- Desde `backend/`: `./mvnw validate`, `./mvnw test` y `./mvnw package`.
- Desde `frontend/`: `npm test`, `npm run lint` y `npm run build`.
- `git diff --check` y revisión de archivos staged.
- Revisión manual de historial con nombres, fallback, enlaces, teclado,
  responsive y datos legacy/personalizados cuando estén disponibles.
