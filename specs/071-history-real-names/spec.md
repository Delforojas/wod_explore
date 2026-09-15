# SDD - Issue #71: Mostrar nombres reales de WODs y ejercicios en Historial

## Estado

Planificacion para la rama `feat/071-history-real-names`. La Issue amplia el
contrato del historial autenticado sin cambiar la persistencia ni los contratos
de resultados individuales.

## Objetivo

Mostrar el nombre real del WOD y del ejercicio asociado a cada registro del
historial autenticado. Los identificadores continuaran disponibles para
construir los enlaces de detalle, pero no seran la etiqueta principal.

## Contexto

`HistoryPage` recibe actualmente resultados con `wodId` y `exerciseId` y crea
etiquetas como `WOD #18` y `Ejercicio #82`. El backend ya carga las relaciones
`WodResult.wod` y `ExerciseResult.exercise` mediante `@EntityGraph`, por lo que
puede exponer los nombres reales desde `UserHistoryService` sin consultas por
resultado ni mappings hardcodeados en frontend.

Los WODs personalizados y los WODs legacy usan la misma relación `Wod`; su
nombre debe salir del recurso asociado. El fallback por ID solo se mostrara si
el backend no entrega un nombre resoluble.

## Alcance

- Crear DTOs específicos del historial con `wodName` y `exerciseName` nullable.
- Mapear los nombres desde las entidades relacionadas en `UserHistoryService`.
- Mantener separados los contratos de resultados individuales para no ampliar
  innecesariamente otros endpoints.
- Validar los nuevos campos en el schema Zod del historial.
- Mostrar nombres reales en `HistoryPage` y usar el ID solo en los enlaces y en
  el fallback excepcional.
- Mantener resultado, unidad, tipo de marca, nivel, fecha, paginación,
  navegación, estados y accesibilidad actuales.

## Fuera de alcance

- Cambios de tablas, migraciones, índices o datos MySQL.
- Nuevos endpoints o consultas HTTP por cada resultado.
- Mappings estáticos de nombres en frontend.
- Cambios en estadísticas, evolución, detalle o registro de resultados fuera de
  los contratos compartidos que requiera el historial.
- Rediseño visual o cambio de navegación.

## Contrato

El endpoint existente continúa siendo:

```http
GET /api/users/me/history?page=0&size=20
```

Cada elemento WOD añadira `wodName` y cada elemento de ejercicio añadira
`exerciseName`. Los campos podran ser `null` para permitir el fallback de una
referencia histórica no resoluble:

```json
{
  "wodResults": {
    "items": [{
      "id": 42,
      "wodId": 20,
      "wodName": "Fran",
      "timeSeconds": 342,
      "rounds": null,
      "reps": null,
      "level": "RX",
      "completedAt": "2026-09-12T18:30:00"
    }]
  },
  "exerciseResults": {
    "items": [{
      "id": 7,
      "exerciseId": 125,
      "exerciseName": "Back Squat",
      "value": 100.00,
      "unit": "KG",
      "recordType": "1RM",
      "performedAt": "2026-09-12T17:30:00"
    }]
  }
}
```

## Criterios de aceptacion

- [ ] El historial muestra `wodName` cuando el WOD asociado existe.
- [ ] El historial muestra `exerciseName` cuando el ejercicio asociado existe.
- [ ] El endpoint obtiene los nombres desde las relaciones del backend y no
  desde mappings hardcodeados.
- [ ] Los IDs siguen construyendo correctamente los enlaces `#/wods/:id` y
  `#/exercises/:id`.
- [ ] El fallback `WOD #<id>` o `Ejercicio #<id>` solo aparece cuando falta el
  nombre resoluble.
- [ ] Los resultados WOD conservan valor, nivel, fecha y datos de rendimiento.
- [ ] Las marcas de ejercicio conservan valor, unidad, tipo y fecha.
- [ ] Los WODs legacy y personalizados conservan el nombre entregado por su
  relación `Wod` cuando existe.
- [ ] Los estados de carga, error, vacío y paginación continúan funcionando.
- [ ] Los enlaces y nombres siguen siendo usables con teclado, lector de
  pantalla, móvil y escritorio.
- [ ] Los tests backend y frontend cubren nombres, fallback y enlaces.
- [ ] `npm test`, `npm run lint`, `npm run build`, `./mvnw validate`,
  `./mvnw test` y `./mvnw package` pasan.

## Decisiones

- Se usan DTOs exclusivos del historial para evitar cambiar
  `WodResultResponse` y `ExerciseResultResponse` de los endpoints de resultados.
- `@EntityGraph(attributePaths = "wod")` y `@EntityGraph(attributePaths =
  "exercise")` ya evitan el N+1 en las páginas consultadas; no se añadiran
  llamadas frontend por fila.
- La nullable del nombre representa una frontera defensiva del contrato. El
  esquema actual mantiene los IDs como obligatorios para preservar los enlaces.
