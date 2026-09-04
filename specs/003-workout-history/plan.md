# Plan técnico — Spec 003

## Objetivo técnico

Ampliar WOD Explorer con la capacidad de registrar WODs realizados y consultar
un historial personal de entrenamientos persistido en `localStorage`.

La implementación debe reutilizar la arquitectura existente de las Specs 001 y 002,
manteniendo la aplicación completamente frontend.

No se añadirá backend, base de datos, autenticación ni servicios externos.

---

## Estructura de módulos

- `src/schemas/workoutHistory.schema.ts`
  → schema Zod para validar entradas del historial.

- `src/types/workoutHistory.ts`
  → tipos derivados del schema del historial.

- `src/lib/workoutHistoryStorage.ts`
  → lectura, validación y escritura del historial en `localStorage`.

- `src/lib/workoutHistory.ts`
  → lógica pura para crear, ordenar, eliminar y consultar registros.

- `src/hooks/useWorkoutHistory.ts`
  → estado React y operaciones reutilizables sobre el historial.

- `src/components/WorkoutLogForm.tsx`
  → formulario para registrar un WOD realizado.

- `src/components/WorkoutHistoryItem.tsx`
  → representación reutilizable de una entrada del historial.

- `src/components/DeleteWorkoutButton.tsx`
  → control accesible para eliminar un registro.

- `src/pages/WodDetailPage.tsx`
  → integrar la acción para registrar el WOD actual.

- `src/pages/HistoryPage.tsx`
  → mostrar el historial completo.

- `src/components/Header.tsx`
  → añadir navegación hacia Historial si es necesario.

- `tests/`
  → tests de schemas, almacenamiento, lógica, hook, formulario e historial.

---

## Modelo de datos

Cada entrada representa una realización concreta de un WOD.

Modelo conceptual:

```json
{
  "id": "workout-123",
  "wodId": "fran",
  "date": "2026-09-04",
  "result": "05:42",
  "notes": "Thrusters sin cortar."
}
```

Campos:

- `id`
  - string;
  - obligatorio;
  - único por registro.

- `wodId`
  - string;
  - obligatorio;
  - referencia al ID de un WOD existente.

- `date`
  - string;
  - formato ISO `YYYY-MM-DD`.

- `result`
  - string opcional;
  - permite diferentes formatos de resultado.

- `notes`
  - string opcional;
  - comentarios libres del usuario.

No se almacenará dentro del historial la información completa del WOD.

---

## Identificación de registros

Cada registro tendrá un ID independiente del `wodId`.

Esto permite que un mismo WOD se registre varias veces.

Ejemplo:

```json
[
  {
    "id": "history-001",
    "wodId": "fran",
    "date": "2026-09-01"
  },
  {
    "id": "history-002",
    "wodId": "fran",
    "date": "2026-09-04"
  }
]
```

No se utilizará el `wodId` como identificador del registro.

---

## Generación de IDs

Los IDs deberán ser únicos dentro del historial.

Se priorizará una solución nativa del navegador.

Por ejemplo:

```ts
crypto.randomUUID()
```

No se añadirá una dependencia externa únicamente para generar IDs.

---

## Clave de localStorage

Se utilizará una única clave estable:

```text
wod-explorer:workout-history
```

El valor almacenado será un array JSON.

Ejemplo:

```json
[
  {
    "id": "history-001",
    "wodId": "fran",
    "date": "2026-09-04",
    "result": "05:42",
    "notes": "Buenas sensaciones."
  }
]
```

---

## Validación con Zod

Todos los datos recuperados de `localStorage` deberán validarse antes de ser
utilizados.

Se creará un schema para una entrada individual y otro para el array completo.

Ejemplo conceptual:

```ts
WorkoutHistoryEntrySchema

WorkoutHistorySchema
```

La validación comprobará como mínimo:

- `id` string no vacío;
- `wodId` string no vacío;
- `date` con formato válido;
- `result` opcional;
- `notes` opcionales.

Los tipos TypeScript se derivarán del schema cuando sea posible.

---

## Normalización de campos opcionales

Los campos `result` y `notes` deberán normalizarse antes de guardar.

Ejemplo:

```ts
value.trim()
```

Si el resultado después de `trim()` es vacío:

```text
"   "
```

se almacenará como ausencia de valor y no como una cadena vacía innecesaria.

Comportamiento equivalente para `notes`.

---

## Validación de fecha

La fecha se tratará como una fecha local de calendario.

Formato esperado:

```text
YYYY-MM-DD
```

Reglas:

1. debe existir;
2. debe representar una fecha válida;
3. puede ser hoy;
4. puede ser anterior a hoy;
5. no puede ser posterior a hoy.

La comparación deberá evitar errores derivados de conversiones innecesarias a UTC.

La fecha actual deberá poder inyectarse en la lógica cuando sea útil para los tests.

Ejemplo conceptual:

```ts
validateWorkoutDate(date, today)
```

---

## Fecha por defecto

El formulario propondrá automáticamente la fecha local actual.

Ejemplo:

```text
2026-09-04
```

El usuario podrá modificarla por una fecha anterior.

No se persistirá ningún entrenamiento hasta que el usuario confirme el formulario.

---

## Creación de un registro

La lógica de creación deberá mantenerse separada de la presentación.

Interfaz conceptual:

```ts
createWorkoutHistoryEntry({
  wodId,
  date,
  result,
  notes,
  today,
})
```

Flujo:

```text
datos del formulario
       ↓
normalizar
       ↓
validar fecha
       ↓
crear ID
       ↓
crear registro
       ↓
persistir historial
       ↓
actualizar interfaz
```

---

## Múltiples registros del mismo WOD

No existirán restricciones por `wodId`.

Se permitirá:

```text
Fran - 01/09/2026
Fran - 03/09/2026
Fran - 04/09/2026
```

También se permitirá registrar el mismo WOD más de una vez el mismo día.

Cada realización seguirá siendo una entrada independiente.

---

## Persistencia del historial

`workoutHistoryStorage.ts` encapsulará completamente el acceso a `localStorage`.

Responsabilidades:

- cargar historial;
- validar historial;
- limpiar datos inválidos cuando corresponda;
- guardar historial;
- recuperarse ante errores.

Los componentes visuales no deberán acceder directamente a `localStorage`.

---

## Lectura del historial

Flujo de carga:

1. Leer `wod-explorer:workout-history`.
2. Si no existe, devolver array vacío.
3. Parsear JSON.
4. Validar con Zod.
5. Gestionar registros duplicados o inválidos según las reglas del plan.
6. Devolver datos seguros a la aplicación.

Si el JSON está corrupto:

```text
[]
```

La aplicación deberá seguir funcionando.

---

## Referencias a WODs inexistentes

Puede ocurrir que un registro haga referencia a:

```json
{
  "wodId": "old-wod"
}
```

y que dicho WOD ya no exista en `wods.json`.

El registro no debe provocar errores.

La aplicación podrá:

- conservar el registro;
- indicar visualmente que el WOD ya no está disponible;
- impedir la navegación al detalle inexistente.

No se eliminará silenciosamente el historial del usuario únicamente porque el
WOD haya desaparecido del dataset.

---

## Lógica del historial

La lógica reutilizable deberá permitir como mínimo:

```ts
addWorkoutEntry(...)
deleteWorkoutEntry(...)
sortWorkoutHistory(...)
```

Estas funciones deberán ser puras siempre que sea razonable.

No deberán depender de React.

---

## Orden del historial

El historial deberá mostrarse desde el entrenamiento más reciente al más antiguo.

Ejemplo:

```text
04/09/2026
03/09/2026
28/08/2026
```

Cuando existan varias entradas con la misma fecha, deberá mantenerse un orden
estable y predecible.

La función de orden no modificará el array original.

---

## Eliminación de registros

Cada entrada podrá eliminarse mediante su propio `id`.

Interfaz conceptual:

```ts
deleteWorkoutEntry(entries, entryId)
```

Comportamiento:

1. localizar el registro;
2. eliminar únicamente esa entrada;
3. conservar todas las demás;
4. persistir el nuevo historial;
5. actualizar inmediatamente la interfaz.

Eliminar una entrada no afectará:

- al WOD original;
- a favoritos;
- a otros registros del mismo WOD.

---

## Hook useWorkoutHistory

Se podrá encapsular la coordinación entre React y la capa de almacenamiento en:

```text
useWorkoutHistory()
```

Responsabilidades:

- cargar estado inicial;
- añadir registro;
- eliminar registro;
- exponer historial ordenado;
- persistir cambios.

Interfaz conceptual:

```ts
{
  entries,
  addWorkout,
  deleteWorkout
}
```

No deberá contener lógica visual.

---

## Formulario de registro

`WorkoutLogForm` deberá incluir como mínimo:

- fecha;
- resultado opcional;
- notas opcionales;
- botón para guardar.

El `wodId` se obtendrá del contexto de la página de detalle y no será editable por
el usuario.

---

## Accesibilidad del formulario

Cada campo deberá tener una etiqueta asociada.

Ejemplo:

```html
<label for="workout-date">Fecha</label>
<input id="workout-date" type="date">
```

Los errores deberán:

- ser visibles;
- ser comprensibles;
- estar relacionados con el campo correspondiente cuando sea posible.

El formulario deberá poder utilizarse completamente mediante teclado.

---

## Validación del formulario

La validación deberá impedir el guardado cuando:

- falte la fecha;
- la fecha sea inválida;
- la fecha sea futura.

Los errores deberán mostrarse antes de persistir el registro.

Resultado y notas seguirán siendo opcionales.

---

## Integración con WodDetailPage

La página de detalle será el punto principal para registrar un entrenamiento.

Flujo:

```text
/wods/fran
     ↓
detalle WOD
     ↓
Registrar entrenamiento
     ↓
formulario
     ↓
guardar
```

La funcionalidad existente del detalle no deberá romperse.

El botón de favoritos continuará funcionando de forma independiente.

---

## Página de historial

Se añadirá una ruta:

```text
/history
```

La página mostrará todas las entradas ordenadas.

Cada entrada mostrará como mínimo:

- nombre del WOD;
- fecha;
- tipo;
- resultado si existe;
- notas si existen.

---

## Resolución de información del WOD

Como el historial almacena únicamente `wodId`, la interfaz deberá resolver la
información actual del WOD utilizando los datos locales existentes.

Flujo:

```text
historyEntry.wodId
       ↓
buscar WOD
       ↓
nombre + tipo
```

La lógica de resolución deberá reutilizar las utilidades existentes cuando sea
posible.

---

## Estado vacío

Si no existen registros:

```text
Todavía no has registrado ningún entrenamiento.
```

El estado vacío deberá ser diferente de errores de carga o WOD inexistente.

Se reutilizará `EmptyState` si su API actual permite hacerlo limpiamente.

---

## Navegación

La navegación principal se ampliará con:

```text
Inicio
WODs
Ejercicios
Historial
```

La navegación seguirá siendo frontend.

No se realizarán peticiones de red.

---

## Estado React

Se evitará duplicar el historial entre diferentes páginas.

Si el catálogo, detalle e historial necesitan compartir el mismo estado durante
la misma sesión, se utilizará la solución más simple compatible con la arquitectura
actual.

No se introducirá una librería global de estado.

Context solo se utilizará si resulta necesario y está justificado.

---

## Decisiones técnicas

- `localStorage` seguirá siendo la única persistencia.
- Zod validará los datos persistidos.
- Los registros almacenarán `wodId`, no objetos WOD completos.
- Se utilizará `crypto.randomUUID()` para IDs cuando esté disponible.
- No utilizar `any`.
- No introducir librerías de fechas salvo necesidad técnica real.
- Priorizar APIs nativas del navegador.
- Mantener lógica pura fuera de React.
- Reutilizar componentes existentes.
- No modificar los JSON originales al registrar entrenamientos.
- Mantener compatibilidad con búsqueda y favoritos.
- No introducir backend ni base de datos.

---

## Uso de Skills

### React

Usar:

- `vercel-react-best-practices`
- `vercel-composition-patterns`

Especialmente para:

- colocación del estado;
- formularios;
- hooks;
- evitar efectos innecesarios;
- evitar estado duplicado.

### TypeScript

Usar:

- `typescript-advanced-types`

Especialmente para:

- contratos del historial;
- funciones puras;
- tipos derivados;
- estados válidos del formulario.

### Validación

Usar:

- `zod-schema-validation`

Especialmente para:

- schema del historial;
- datos recuperados de `localStorage`;
- límites entre datos persistidos y aplicación.

### Diseño y accesibilidad

Usar:

- `web-design-guidelines`
- `tailwind-css-patterns`

Especialmente para:

- formulario;
- errores;
- historial;
- acciones de eliminación;
- responsive;
- navegación mediante teclado.

---

## Estrategia de tests

### Schema

Tests para:

- registro válido;
- falta de `id`;
- falta de `wodId`;
- fecha inválida;
- resultado opcional;
- notas opcionales;
- estructura completa del historial inválida.

---

### Fechas

Tests para:

- fecha de hoy;
- fecha anterior;
- fecha futura;
- fecha inválida;
- fecha vacía.

---

### Creación

Tests para:

- crear un registro;
- generar ID independiente;
- mismo WOD varias veces;
- mismo WOD el mismo día;
- normalización de resultado;
- normalización de notas.

---

### Orden

Tests para:

- historial vacío;
- un registro;
- varios registros desordenados;
- orden más reciente → más antiguo;
- varias entradas con la misma fecha;
- no mutar el array original.

---

### Eliminación

Tests para:

- eliminar una entrada existente;
- conservar otros registros;
- conservar otros registros del mismo WOD;
- ID inexistente;
- historial vacío.

---

### localStorage

Tests para:

- almacenamiento inexistente;
- JSON válido;
- JSON corrupto;
- estructura inválida;
- persistencia después de añadir;
- persistencia después de eliminar;
- recuperación tras recargar.

---

### WOD inexistente

Tests para:

- entrada con WOD existente;
- entrada con `wodId` inexistente;
- historial sigue renderizando;
- no se intenta navegar a un detalle inexistente.

---

### Formulario

Tests para:

- fecha por defecto;
- guardar registro válido;
- impedir fecha futura;
- resultado opcional;
- notas opcionales;
- errores accesibles.

---

### Historial

Tests para:

- estado vacío;
- mostrar nombre y fecha;
- mostrar resultado;
- mostrar notas;
- orden cronológico;
- eliminar entrada;
- acceder al detalle de WOD existente.

---

### Regresión

Antes de cerrar la Spec 003 se mantendrán verdes los tests existentes de:

- catálogo;
- filtros;
- búsqueda;
- favoritos;
- detalle de WOD.

---

## Verificación final

Antes de considerar completada la Spec 003:

1. Ejecutar `npm test`.
2. Ejecutar `npm run lint`.
3. Ejecutar `npm run build`.
4. Confirmar que TypeScript no presenta errores.
5. Registrar un WOD con fecha de hoy.
6. Registrar un WOD con fecha anterior.
7. Intentar registrar una fecha futura.
8. Registrar un WOD sin resultado ni notas.
9. Registrar el mismo WOD varias veces.
10. Consultar `/history`.
11. Verificar el orden más reciente → más antiguo.
12. Eliminar una entrada.
13. Confirmar que otros registros permanecen.
14. Recargar la aplicación y confirmar persistencia.
15. Probar `localStorage` corrupto.
16. Probar un registro cuyo `wodId` no exista.
17. Comprobar navegación mediante teclado.
18. Comprobar móvil y escritorio.
19. Confirmar que búsqueda y favoritos siguen funcionando.
20. Confirmar que no existen backend, base de datos ni peticiones de red.