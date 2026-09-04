# Plan técnico — Spec 001

## Estructura de módulos

- `src/data/wods.json` → datos locales de WODs.
- `src/data/exercises.json` → datos locales de ejercicios.

- `src/schemas/wod.schema.ts` → validación Zod de WODs.
- `src/schemas/exercise.schema.ts` → validación Zod de ejercicios.

- `src/types/wod.ts` → tipos TypeScript relacionados con WODs.
- `src/types/exercise.ts` → tipos TypeScript relacionados con ejercicios.

- `src/lib/loadWods.ts` → cargar y validar WODs.
- `src/lib/loadExercises.ts` → cargar y validar ejercicios.

- `src/pages/HomePage.tsx` → página de inicio.
- `src/pages/WodsPage.tsx` → catálogo y filtros de WODs.
- `src/pages/WodDetailPage.tsx` → detalle de un WOD.
- `src/pages/ExercisesPage.tsx` → catálogo de ejercicios.

- `src/components/WodCard.tsx` → tarjeta reutilizable de WOD.
- `src/components/WodFilters.tsx` → controles de filtrado.
- `src/components/ExerciseCard.tsx` → tarjeta reutilizable de ejercicio.
- `src/components/Header.tsx` → navegación principal.
- `src/components/EmptyState.tsx` → estados sin resultados.
- `src/components/ErrorState.tsx` → estados de error.

- `src/App.tsx` → composición principal y navegación de la aplicación.

- `tests/` → tests de lógica, validación y componentes según los RF de la spec.

---

## Modelo de datos

### `wods.json`

```json
[
  {
    "id": "fran",
    "name": "Fran",
    "type": "For Time",
    "level": "Intermediate",
    "structure": "21-15-9",
    "description": "Completa todas las repeticiones lo más rápido posible.",
    "exercises": [
      {
        "exerciseId": "thruster",
        "repetitions": "21-15-9"
      },
      {
        "exerciseId": "pull-up",
        "repetitions": "21-15-9"
      }
    ]
  }
]