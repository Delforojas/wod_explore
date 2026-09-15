# Plan 078 - Redisenar catalogo de WODs para exploracion rapida

## Base y restricciones

La rama `feat/078-redisenar-catalogo-wods` ya existe y parte de la base de #76;
se reutiliza sin rebase ni cambio automatico de base. El worktree contiene
untracked ajenos (`archify-*` y `wod_explorer_schema.sql`) que no se modificaran
ni se incluiran.

La implementacion se limita al frontend y usa el CSS existente porque el
proyecto no declara Tailwind en `frontend/package.json`. No se cambian API,
schemas, router, autenticacion, backend, persistencia, dependencias ni el detalle
de WOD.

## Estrategia de implementacion

1. Mantener el estado y las llamadas actuales de `WodsPage`; derivar solamente
   formatos de presentacion para `timeLimit`, `rounds`, tipo y nivel.
2. Reorganizar el encabezado para que el contador y `Crear WOD` sigan visibles,
   con un contexto breve y sin contenido inventado.
3. Convertir los filtros en una superficie funcional con labels visibles, submit
   accesible, favoritos y filtros activos agrupados antes de los resultados.
4. Construir una lista de filas comparables. El enlace al detalle envolvera la
   informacion del WOD, mientras que el favorito permanecera como boton hermano
   para no mezclar acciones.
5. Presentar en cada fila el nombre primero y despues los datos deportivos
   reales: tipo, duracion, rondas y nivel. Los valores nulos tendran labels
   honestos y no se sustituiran por ceros o metricas ficticias.
6. Mantener `StateMessage`, `LoadingMessage` y `PaginationControls`, aplicando
   estilos locales de WOD sin tocar sus contratos compartidos.
7. Reescribir reglas `.catalog-page--wods` y reglas de fila especificas para
   superficies, divisores, foco, hover, wrapping, targets de 44 px y responsive
   desde 320 px. No usar overflow horizontal para resolver la densidad.
8. Ampliar `WodsPage.test.tsx` con asserts de datos deportivos, labels, filtros,
   favoritos, paginacion y estados sin acoplar tests a CSS.

## Riesgos y mitigaciones

### Perder datos existentes

Usar solo campos presentes en `WodSummary` y mantener el schema sin cambios.

### Confundir enlace y favorito

Mantener el anchor de detalle y `WodFavoriteButton` como controles hermanos con
labels accesibles y eventos independientes.

### Overflow en movil

Usar grid con `minmax(0, 1fr)`, `min-width: 0`, wrapping y una variante de fila
apilada para anchos pequenos. Verificar 320 px, 390 px, tablet y escritorio.

### Regresiones de estados

Conservar las ramas condicionales actuales y cubrir loading, privado, error,
empty, favoritos y resultado poblado en tests.

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

La revision final debe comprobar que la comparacion de filas es posible, que no
hay overflow evitable, que el foco y los labels se conservan, y que no se han
alterado APIs, datos, router, detalle ni archivos ajenos.
