# Plan 040 - Aplicar sistema visual al catalogo de WODs

## Base tecnica

La rama parte de `docs/038-sistema-diseno-oficial`, que contiene el sistema
visual oficial de #38 y excluye los cambios especificos del catalogo de
ejercicios de #39. La implementacion se limitara a `WodsPage`, sus pruebas y
los estilos especificos necesarios en `frontend/src/index.css`.

## Estrategia

1. Mantener `getWods`, filtros, paginacion, estados locales y contratos sin
   cambios de comportamiento.
2. Convertir el encabezado en un contexto editorial claro con total de resultados
   y una distincion explicita entre filtros editados y filtros aplicados.
3. Presentar el formulario como una superficie tecnica contigua, con labels
   visibles y agrupacion clara para nombre, tipo, nivel y accion.
4. Renderizar resultados como una lista semantica de enlaces completos, haciendo
   visibles nombre, tipo, nivel, identificador y destino.
5. Reforzar `index.css` con una variante visual propia del catalogo de WODs,
   wrapping seguro, hover/focus y apilado responsive sin tarjetas flotantes.
6. Ajustar solo las aserciones observables necesarias para proteger contexto,
   filas, hrefs, filtros y paginacion.

## Decisiones tecnicas

### Estructura semantica

- Usar `header` para el encabezado de pagina.
- Mantener el formulario como `form` con `aria-label`, labels asociados y submit
  explicito.
- Renderizar resultados en `ul`/`li`, con cada enlace como unidad interactiva
  completa.
- Mantener `StateMessage` y `PaginationControls` como componentes existentes.

### Contexto de filtros

- Mostrar el total cuando la respuesta existe.
- Mostrar los filtros aplicados solo cuando existan y no modificar la consulta
  aplicada al escribir en los controles.
- Mantener el reinicio de pagina a cero y las peticiones submit-driven.

### Responsive y accesibilidad

- Mantener una columna en movil y una rejilla de metadatos en superficies amplias.
- Usar `min-width: 0`, `overflow-wrap: anywhere` y alturas intrinsecas.
- Mantener outline global de foco y `touch-action: manipulation`.
- No ocultar nombre, tipo ni nivel en anchos pequenos; se reorganizaran.

## Flujo de implementacion

1. Crear y validar este SDD contra Issue #40.
2. Ajustar la estructura JSX de `WodsPage` sin cambiar el acceso a datos.
3. Ajustar los estilos especificos del catalogo y sus media queries.
4. Proteger con tests la fila, el enlace, el contexto y las llamadas de filtros y
   paginacion.
5. Ejecutar `npm test`, `npm run lint`, `npm run build` y `git diff --check`.
6. Revisar el diff para excluir cambios ajenos y completar la checklist manual.

## Riesgos y mitigaciones

### Cambio visual que rompe tests

Conservar textos y roles funcionales; añadir solo estructura semantica o contexto
derivado de datos ya presentes.

### Overflow de nombres o filtros largos

Usar wrapping, `min-width: 0` y un layout de dos niveles en movil sin truncar el
nombre principal ni los metadatos.

### Estados incompletos

No modificar las condiciones existentes de token, carga, error, vacio o
paginacion; revisar cada rama en la suite.

### Duplicacion visual

Extender tokens y patrones de catalogo existentes; no crear una biblioteca de
tarjetas ni estilos paralelos.

## Verificaciones

Desde `frontend/` y usando los scripts existentes:

```bash
npm test
npm run lint
npm run build
```

Ademas:

```bash
git diff --check
```

La revision manual comprobara 320 px, tablet, escritorio, zoom, teclado,
filtros aplicados, resultado vacio, error, privacidad, nombres largos y ausencia
de overflow horizontal.
