# Plan 079 - Redisenar detalle de WOD orientado a ejecucion y rendimiento

## Base y restricciones

La rama `feat/079-redisenar-detalle-wod-rendimiento` parte de `main`, que ya
contiene el sistema visual global y las paginas #77 y #78. El worktree conserva
untracked ajenos (`archify-*` y `wod_explorer_schema.sql`) que no se modificaran
ni se incluiran.

El cambio se limita a `WodDetailPage`, su prueba y estilos locales en
`frontend/src/index.css`. No se cambian API, schemas, router, backend,
persistencia, dependencias, `WodResultsPanel` como logica ni otras paginas.

## Estrategia de implementacion

1. Mantener la carga de `getWod`, la autenticacion y las ramas de estado actuales.
2. Reorganizar el encabezado para que nombre, contexto, favorito y retorno sean
   reconocibles sin competir con las metricas.
3. Sustituir la ficha generica por un manifiesto de metricas reales: tipo, nivel,
   limite, rondas y cantidad de ejercicios, formateando nulos honestamente.
4. Convertir los ejercicios en una lista semantica de ejecucion: posicion, nombre,
   repeticiones y medicion. No agregar peso o distancia cuando el contrato no los
   proporciona.
5. Mantener `WodResultsPanel` como aside funcional, con sus formularios, intentos
   y estados, ajustando solo su encaje visual desde las reglas del detalle.
6. Reescribir las reglas CSS especificas de `detail-page--wod`, evitando afectar
   `MyWodDetailPage` o `ExerciseDetailPage`, con responsive desde 320 px.
7. Actualizar `WodDetailPage.test.tsx` para comprobar metricas, orden, labels,
   favorito, resultados, estados y ausencia de cambios de contrato.

## Riesgos y mitigaciones

### Confundir datos de prescripcion

El contrato estandar solo contiene `reps` y `measurementType` por ejercicio.
Mostrar esos campos y comunicar la medicion cuando reps es nulo evita inventar
pesos, distancias o unidades.

### Romper acciones existentes

Mantener `WodFavoriteButton`, `WodResultsPanel`, enlaces hash y `StateMessage`
sin alterar sus props ni las llamadas de API.

### Overflow en movil

Usar grids con `minmax(0, 1fr)`, `min-width: 0`, wrapping y colapso del aside.
Comprobar 320 px, 390 px, tablet y escritorio.

### Regresiones de estados

Conservar las salidas de privado, carga, error, red y WOD vacio; ampliar asserts
de comportamiento sin acoplarlos a posiciones CSS.

## Verificaciones

Desde `frontend/`:

```bash
npm test
npm run lint
npm run build
```

Ademas:

```bash
git diff --check
```

La revision final comprobara que el detalle se entiende en una ventana, que las
acciones siguen separadas, que no hay overflow evitable y que solo se modifican
los archivos de #79.
