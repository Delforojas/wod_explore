# Plan 042 - Aplicar sistema visual a estadisticas

## Base tecnica

La rama parte de `docs/038-sistema-diseno-oficial`, que contiene el sistema
visual oficial y las dependencias visuales de #35 y #37. `StatisticsPage` usa
`getStatistics` y `getEvolution` con `Promise.all`; sus datos se validan por los
schemas actuales de `frontend/src/api/schemas.ts`.

## Estrategia

1. Mantener intactos la carga paralela, la autenticacion, los estados y los
   contratos de API.
2. Reforzar el resumen navy para que los tres contadores tengan una jerarquia
   clara y contraste suficiente.
3. Presentar las marcas personales como dos columnas editoriales contiguas, con
   separacion por reglas y una lectura explicita de sus valores.
4. Presentar evolucion como una seccion posterior, conservando la banda CSS
   decorativa y mejorando la lista textual de cada intento.
5. Separar visualmente valores y unidades en marcas y evolucion sin introducir
   conversiones ni comparaciones entre metricas distintas.
6. Ajustar los breakpoints existentes para apilar y envolver contenido desde
   320 px.
7. Ampliar las pruebas de comportamiento solo para semantica, unidades, fechas,
   enlaces y fallback textual observables.

## Implementacion prevista

### `StatisticsPage.tsx`

- Mantener las llamadas y el mapeo de enums existentes.
- Usar una estructura presentacional explicita para valor, unidad, metadatos y
  fecha en `RecordColumn` y `EvolutionColumn`.
- Conservar `section`, headings, `ol`, `li`, `a`, `time` y la banda con
  `aria-hidden`.

### `index.css`

- Afinar las superficies de resumen, marcas y evolucion usando los tokens
  oficiales.
- Crear separacion editorial entre columnas sin sombras ni radios nuevos.
- Mejorar valores tabulares, metadatos, wrapping, hover/focus y targets tactiles.
- Añadir reglas mobile-first para eliminar separadores laterales al apilar.

### Tests

- Mantener las pruebas de privacidad, carga, vacio, error, marcas, evolucion y
  banda decorativa.
- Comprobar que las fechas siguen siendo `time`, que las unidades son visibles y
  que los enlaces mantienen sus rutas y nombres contextuales.

## Riesgos y mitigaciones

### Comparacion accidental de unidades

No se calcularan proporciones, tendencias ni escalas nuevas. La banda solo
representa presencia y secuencia, no magnitud.

### Perdida del fallback textual

La lista `ol` permanecera siempre en el DOM cuando existan puntos y la banda
seguira oculta de tecnologia asistiva.

### Overflow responsive

Las filas usaran `minmax(0, 1fr)`, `min-width: 0` y `overflow-wrap: anywhere`.
Las columnas se apilaran en el breakpoint movil existente.

### Regresion funcional

No se tocara el efecto que resuelve las dos promesas ni el shape de las
respuestas. Los tests comprobaran estados y navegacion.

## Verificaciones

```bash
npm test
npm run lint
npm run build
git diff --check
```

Se ejecutara una pasada del detector mecanico de Impeccable sobre los archivos
de UI modificados. La revision manual debe cubrir 320 px, tablet, escritorio,
zoom, teclado, foco visible, estados, evolucion textual y textos largos.

## Limites de entrega

- No modificar backend, base de datos, Docker, contratos, router o dependencias.
- La Issue permanecera abierta y la rama sin publicar hasta la validacion manual
  y `/finish-issue 42`.
