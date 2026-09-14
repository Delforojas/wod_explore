# Spec 039 - Aplicar sistema visual al catalogo de ejercicios

## Estado

Implementada localmente en la rama `feat/039-estilo-catalogo-ejercicios`;
pendiente de commit y validacion manual.

## Contexto

El catalogo de ejercicios ya permite buscar movimientos, consultar resultados
paginados y navegar a su detalle. La Issue #39 solicita aplicar de forma mas
intencional el sistema visual oficial definido en `DESIGN.md`, sin reabrir la
funcionalidad de descubrimiento resuelta en la Issue #32.

La pagina debe continuar siendo una superficie tecnica y escaneable: el usuario
debe reconocer el contexto de busqueda, distinguir nombre, categoria y medida,
y acceder al detalle sin perder los estados de carga, vacio, error o privacidad.

## Objetivo

Reforzar la jerarquia visual y semantica de `ExercisesPage` para que el catalogo
de ejercicios se integre con el lenguaje editorial deportivo de WOD Explorer en
movil, tablet y escritorio, manteniendo intactos sus contratos y flujos.

## Alcance

Esta spec incluye:

- jerarquia visual de encabezado, busqueda, contexto, resultados y paginacion;
- presentacion escaneable de nombre, categoria y tipo de medicion;
- estructura semantica del listado y enlaces completos a `#/exercises/:id`;
- superficies, reglas, tipografia, navy, naranja, papel e ink de `DESIGN.md`;
- wrapping seguro para nombres y metadatos largos;
- estados privado, carga, vacio, error y error de red ya existentes;
- responsive mobile-first desde 320 px, tablet y escritorio;
- foco visible, teclado, labels, contraste y targets tactiles;
- pruebas de comportamiento sobre resultados, navegacion y busqueda cuando sean
  necesarias para proteger el contenido observable.

## Fuera de alcance

No se implementara:

- nuevos endpoints, parametros, schemas, payloads o reglas de negocio;
- cambios en backend, base de datos, autenticacion, persistencia o router;
- nuevos filtros, ordenaciones, metricas, datos o funcionalidades;
- rediseño del catalogo de WODs, detalles, historial, estadisticas o shell salvo
  estilos compartidos estrictamente necesarios;
- nuevas dependencias, fuentes externas, iconos o migracion a Tailwind;
- copia de textos, branding, imagenes o contenido de la referencia Figma.

## Requisitos funcionales

### RF-1 - Contexto del catalogo

La pagina debe mostrar un encabezado claro para ejercicios, una accion de
busqueda con label asociado y una indicacion comprensible del resultado actual.
La consulta aplicada debe distinguirse de la consulta que el usuario aun esta
editando.

### RF-2 - Resultados escaneables

Cada ejercicio debe mostrar de forma distinguible su nombre, categoria y tipo de
medicion disponible. Cada fila debe seguir siendo un enlace completo hacia
`#/exercises/:id` y conservar su identificador visible.

### RF-3 - Estados y paginacion

Se deben conservar los estados privado, carga, vacio, error y error de red, con
sus mensajes y acciones actuales. La paginacion debe conservar la pagina,
`hasNext`, `totalPages`, botones, disabled durante carga y callbacks existentes.

### RF-4 - Integridad de datos

La pagina debe seguir llamando a `getExercises` con el token, el nombre aplicado
y `{ page, size }` actuales. No se modificaran los tipos Zod ni los valores
recibidos de la API.

## Requisitos no funcionales

### RNF-1 - Responsive

La superficie debe funcionar desde 320 px sin overflow horizontal. En movil la
busqueda y las filas se reorganizaran en una sola columna; en tablet y escritorio
se aprovechara el espacio sin forzar anchos que corten nombres.

### RNF-2 - Accesibilidad

Se mantendran HTML semantico, label asociado, enlaces reales, foco visible,
`aria-live` en resultados dinamicos, contraste suficiente y targets de al menos
44 px. El nombre, categoria y medida no dependeran solo del color.

### RNF-3 - Consistencia visual

Se reutilizaran tokens y patrones existentes de `index.css`, incluyendo papel,
tinta, navy, naranja, serif editorial, reglas finas y superficies contiguas.
No se creara una segunda direccion visual ni una abstraccion generica prematura.

### RNF-4 - Calidad

Deben pasar `npm test`, `npm run lint`, `npm run build` y `git diff --check`.

## Criterios de aceptacion

1. El catalogo de ejercicios aplica de forma reconocible las reglas de
   `DESIGN.md`.
2. La busqueda, paginacion, enlaces y estados conservan su comportamiento.
3. Las filas permiten identificar movimiento, categoria o nivel disponible y
   medida, con destino navegable y sin depender solo del color.
4. La pagina funciona desde 320 px sin overflow horizontal ni texto cortado.
5. Los controles mantienen labels, foco visible, teclado y targets tactiles.
6. Los tests existentes se mantienen o se ajustan para proteger cambios
   observables.
7. `npm test`, `npm run lint` y `npm run build` pasan.
8. La revision manual confirma movil, tablet, escritorio, zoom, teclado y textos
   largos.
9. No cambian API, schemas, payloads, autenticacion, persistencia ni router.

## Archivos previstos

- `frontend/src/pages/ExercisesPage.tsx`
- `frontend/src/pages/ExercisesPage.test.tsx`
- `frontend/src/index.css`
- `specs/039-estilo-catalogo-ejercicios/spec.md`
- `specs/039-estilo-catalogo-ejercicios/plan.md`
- `specs/039-estilo-catalogo-ejercicios/tasks.md`

## Referencias

- `DESIGN.md`
- `PRODUCT.md`
- `frontend/src/pages/ExercisesPage.tsx`
- `frontend/src/components/PaginationControls.tsx`
- `frontend/src/components/StateMessage.tsx`
- `frontend/src/api/client.ts`
- `frontend/src/api/schemas.ts`
- `specs/032-mejorar-descubrimiento-catalogos/spec.md`
- `specs/038-sistema-diseno-oficial/spec.md`
