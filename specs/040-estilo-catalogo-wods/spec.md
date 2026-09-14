# Spec 040 - Aplicar sistema visual al catalogo de WODs

## Estado

Implementada localmente sobre la rama `feat/040-estilo-catalogo-wods`, con
verificaciones automaticas superadas y pendiente de validacion manual.

## Contexto

El catalogo de WODs ya permite buscar por nombre, filtrar por tipo y nivel,
consultar resultados paginados y navegar al detalle. La Issue #40 solicita que
esta superficie aplique de forma reconocible el sistema visual oficial de
`DESIGN.md`, sin reabrir la funcionalidad resuelta en las Issues #28 y #32.

## Objetivo

Reforzar la jerarquia visual y semantica de `WodsPage` para que el usuario pueda
entender el contexto de los filtros, escanear nombre, tipo y nivel de cada WOD y
avanzar por el catalogo con una experiencia editorial, tecnica y responsive.

## Alcance

Esta spec incluye:

- jerarquia visual de encabezado, filtros, contexto, resultados y paginacion;
- presentacion escaneable de nombre, tipo, nivel e identificador;
- listado semantico de resultados y enlaces completos a `#/wods/:id`;
- superficies, reglas, tipografia, navy, naranja, papel e ink de `DESIGN.md`;
- wrapping seguro para nombres y filtros largos;
- estados privado, carga, vacio, error y error de red existentes;
- responsive mobile-first desde 320 px, tablet y escritorio;
- foco visible, teclado, labels, contraste y targets tactiles;
- pruebas de comportamiento sobre filtros, resultados, navegacion y estados cuando
  sean necesarias para proteger el contenido observable.

## Fuera de alcance

No se implementara:

- nuevos endpoints, parametros, schemas, payloads o reglas de negocio;
- cambios en backend, base de datos, autenticacion, persistencia o router;
- nuevos filtros, ordenaciones, metricas, datos o funcionalidades;
- rediseño del detalle de WOD, catalogo de ejercicios u otras paginas;
- nuevas dependencias, fuentes externas, iconos o migracion a Tailwind;
- copia de textos, branding, imagenes o contenido de la referencia Figma.

## Requisitos funcionales

### RF-1 - Contexto del catalogo

La pagina debe mostrar un encabezado claro para WODs, labels asociados a nombre,
tipo y nivel, y una indicacion comprensible del total y de los filtros aplicados.
Los valores editados no deben confundirse con los filtros ya enviados.

### RF-2 - Resultados escaneables

Cada WOD debe mostrar de forma distinguible su nombre, tipo y nivel disponible.
Cada fila debe seguir siendo un enlace completo hacia `#/wods/:id` y conservar su
identificador visible.

### RF-3 - Estados y paginacion

Se deben conservar los estados privado, carga, vacio, error y error de red, con
sus mensajes y acciones actuales. La paginacion debe conservar pagina, `hasNext`,
`totalPages`, botones, disabled durante carga y callbacks existentes.

### RF-4 - Integridad de datos

La pagina debe seguir llamando a `getWods` con los filtros aplicados, el token y
`{ page, size }` actuales. Los filtros deben continuar aplicandose unicamente al
enviar el formulario y reiniciar la pagina a cero.

## Requisitos no funcionales

### RNF-1 - Responsive

La superficie debe funcionar desde 320 px sin overflow horizontal. En movil los
filtros y las filas se reorganizaran en una columna; en tablet y escritorio se
aprovechara el espacio sin forzar anchos que corten nombres.

### RNF-2 - Accesibilidad

Se mantendran HTML semantico, labels asociados, enlaces reales, foco visible,
contraste suficiente y targets de al menos 44 px. Nombre, tipo y nivel no
dependeran solo del color.

### RNF-3 - Consistencia visual

Se reutilizaran tokens y patrones existentes de `index.css`, incluyendo papel,
navy, tinta, naranja, serif editorial, reglas finas y superficies contiguas.
No se creara una segunda direccion visual ni una abstraccion generica prematura.

### RNF-4 - Calidad

Deben pasar `npm test`, `npm run lint`, `npm run build` y `git diff --check`.

## Criterios de aceptacion

1. El catalogo de WODs aplica de forma reconocible las reglas de `DESIGN.md`.
2. La busqueda, filtros, paginacion, enlaces y estados conservan su comportamiento.
3. Las filas permiten identificar nombre, tipo, nivel y destino sin depender solo
   del color.
4. La pagina funciona desde 320 px sin overflow horizontal ni texto cortado.
5. Los controles mantienen labels, foco visible, teclado y targets tactiles.
6. Los tests existentes se mantienen o se ajustan para proteger cambios
   observables.
7. `npm test`, `npm run lint` y `npm run build` pasan.
8. La revision manual confirma movil, tablet, escritorio, zoom, teclado y textos
   largos.
9. No cambian API, schemas, payloads, autenticacion, persistencia ni router.

## Archivos previstos

- `frontend/src/pages/WodsPage.tsx`
- `frontend/src/pages/WodsPage.test.tsx`
- `frontend/src/index.css`
- `specs/040-estilo-catalogo-wods/spec.md`
- `specs/040-estilo-catalogo-wods/plan.md`
- `specs/040-estilo-catalogo-wods/tasks.md`

## Referencias

- `DESIGN.md`
- `PRODUCT.md`
- `frontend/src/components/PaginationControls.tsx`
- `frontend/src/components/StateMessage.tsx`
- `frontend/src/api/client.ts`
- `frontend/src/api/schemas.ts`
- `specs/028-catalog-pagination-history/spec.md`
- `specs/032-mejorar-descubrimiento-catalogos/spec.md`
- `specs/038-sistema-diseno-oficial/spec.md`
