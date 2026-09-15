# Spec 078 - Redisenar catalogo de WODs para exploracion rapida

## Estado

Planificada para `feat/078-redisenar-catalogo-wods`.

## Fuente de verdad

La Issue #78 define el alcance funcional. `DESIGN.md` y la base visual integrada
por #76 definen la identidad: **El rendimiento es la interfaz**. La API actual
`GET /api/wods` y `wodSummarySchema` son la unica fuente valida para los datos del
catalogo.

## Contexto

`WodsPage` ya consume WODs paginados, aplica filtros por nombre, tipo y nivel,
permite filtrar favoritos en cliente, muestra estados globales y navega al
detalle. La presentacion actual usa filas, pero solo hace visibles el nombre,
tipo y nivel; duracion y rondas existen en el contrato y deben ganar prioridad
para facilitar la seleccion rapida.

## Objetivo

Convertir el catalogo en una superficie de exploracion operativa donde se puedan
comparar rapidamente multiples WODs, reconocer sus datos deportivos principales
y aplicar filtros sin perder contexto ni acciones existentes.

## Alcance

- Redisenar la composicion de `frontend/src/pages/WodsPage.tsx`.
- Mostrar por WOD nombre, tipo, duracion, rondas y nivel con jerarquia clara.
- Reorganizar filtros, favoritos, contador, filtros activos y paginacion dentro
  de un panel de catalogo coherente con `DESIGN.md`.
- Mantener `getWods`, sus parametros, el tamano de pagina y la navegacion al
  detalle sin cambios de contrato.
- Mantener loading, privado, error, network-error, empty y errores de favoritos
  mediante `StateMessage`.
- Mantener el boton de favoritos, el filtrado solo favoritos y sus estados.
- Reescribir unicamente los estilos especificos del catalogo de WODs en
  `frontend/src/index.css`.
- Mantener responsive desde 320 px, navegacion por teclado y foco visible.

## Fuera de alcance

- Redisenar `WodDetailPage` u otras paginas.
- Cambiar API, schemas, router, backend, base de datos, persistencia o datos.
- Crear metricas, estados, categorias o favoritos nuevos.
- Cambiar la semantica de filtros, paginacion o acciones existentes.
- Introducir dependencias, icon libraries, Tailwind o un sistema visual paralelo.
- Convertir el catalogo en una cuadricula de cards SaaS o en una tabla con
  overflow horizontal obligatorio.

## Requisitos funcionales

### RF-1 - Exploracion y comparacion

Cada WOD debe presentar el nombre como destino principal y, en una estructura
continua de filas, sus valores reales de tipo, duracion, rondas y nivel. La
duracion se expresa a partir de `timeLimit` en segundos; los valores nulos se
comunican honestamente como "Sin limite" o "Variable".

### RF-2 - Filtros y controles

Los filtros de nombre, tipo y nivel mantienen sus labels, valores enviados al
backend, submit explicito y reinicio de pagina. Favoritos, filtros activos,
contador y paginacion siguen funcionando y permanecen identificables.

### RF-3 - Estados y acceso

Los estados sin autenticacion, carga, error, error de red, catalogo vacio y
favoritos mantienen el componente global `StateMessage`, sus acciones de
recuperacion y sus roles accesibles. Los enlaces de detalle y botones de favorito
conservan nombres accesibles y targets utilizables.

### RF-4 - Responsive y sistema visual

La superficie usa los tokens de `DESIGN.md`, bordes y superficies contenidas,
sin sombras, gradientes ni decoracion funcionalmente vacia. Las columnas de
datos se reorganizan en movil desde 320 px sin overflow horizontal evitable y
mantienen una secuencia de lectura logica.

## Criterios de aceptacion

1. Los WODs pueden localizarse y compararse rapidamente en una lista densa.
2. Nombre, tipo, duracion, rondas y nivel son visibles y tienen jerarquia
   deportiva sobre metadata secundaria.
3. Filtros y controles utilizan patrones coherentes con `DESIGN.md`.
4. Favoritos, detalle, paginacion y acciones existentes siguen funcionando.
5. Loading, empty, error, error de red y privado usan los patrones globales.
6. No existe overflow horizontal evitable desde 320 px.
7. La navegacion mediante teclado, foco y labels siguen funcionando.
8. No se modifican API, backend, persistencia, router, dependencias ni detalle.
9. `npm test`, `npm run lint` y `npm run build` pasan.

## Direction contract

**THESIS:** el catalogo es un indice de trabajo, no una galeria de cards; pone
la siguiente sesion y sus datos deportivos a la vista.

**OWN-WORLD:** filas continuas, divisores de 1 px, superficies oscuras, sans
serif, cifras tabulares y naranja solo para accion, foco y orientacion.

**STORY:** la persona filtra, escanea una fila por sus datos reales y abre el WOD
que mejor encaja sin abandonar el contexto del catalogo.

**FIRST VIEWPORT:** encabezado compacto, filtros agrupados y una lista densa con
nombre dominante y columnas de tipo, duracion, rondas, nivel, favorito y acceso.

**FORM:** indice operativo responsive; columnas que colapsan a metadatos por fila
en movil, no tarjetas homogeneas ni tabla con scroll obligatorio.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Referencias

- `docs/constitution.md`
- `PRODUCT.md`
- `AGENTS.md`
- `frontend/AGENTS.md`
- `DESIGN.md`
- `frontend/src/pages/WodsPage.tsx`
- `frontend/src/pages/WodsPage.test.tsx`
- `frontend/src/api/client.ts`
- `frontend/src/api/schemas.ts`
- `frontend/src/components/StateMessage.tsx`
- `frontend/src/components/PaginationControls.tsx`
- `frontend/src/components/WodFavoriteButton.tsx`
- `specs/076-redefinir-sistema-visual-global-shell-layout/spec.md`
- `specs/077-redisenar-inicio-rendimiento/spec.md`
