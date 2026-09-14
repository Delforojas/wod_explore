# Spec 041 - Aplicar sistema visual al historial

## Estado

Validada para implementar la Issue #41 sobre la rama
`feat/041-estilo-historial`, derivada de `docs/038-sistema-diseno-oficial`.

## Contexto

`HistoryPage` ya conserva la autenticacion, la paginacion, los estados de
contenido y los enlaces a los detalles. La jerarquia funcional definida en la
Issue #35 tambien esta presente, pero el resumen y las dos colecciones se leen
con una intensidad demasiado parecida. Ademas, parte del texto del resumen no
tiene suficiente contraste sobre la superficie navy.

## Objetivo

Aplicar el sistema visual oficial a la superficie de historial para que se
perciba como un archivo editorial de rendimiento: resumen dominante, resultados
separados por tipo y filas tecnicas faciles de escanear en cualquier viewport.

## Alcance

Esta spec incluye:

- reforzar el encabezado navy y el resumen de resultados WOD y ejercicios;
- diferenciar visualmente las dos columnas mediante reglas y superficies
  contiguas, sin crear una cuadricula uniforme de tarjetas;
- mejorar la jerarquia de tipo, nombre, valor, unidad o formato, nivel o tipo de
  registro y fecha;
- conservar enlaces hash reales, nombres accesibles y elementos `time`;
- permitir que nombres y metadatos largos envuelvan en movil, tablet y
  escritorio;
- mantener los estados de privacidad, carga, vacio, error y red existentes;
- mantener la paginacion y sus controles accesibles.

## Fuera de alcance

No se implementara:

- cambios en endpoints, schemas, payloads, autenticacion, router, persistencia o
  calculos;
- nuevas metricas, comparaciones, filtros, edicion, borrado o graficas;
- cambios en estadisticas, catalogos, detalles, Home u otras superficies;
- nuevas dependencias, fuentes externas, iconos o migracion a Tailwind;
- cambios en la primitive compartida de estados salvo los estrictamente
  necesarios para esta pagina.

## Requisitos funcionales

### RF-1 - Resumen distinguible

El encabezado debe presentar `Historial` y los totales de resultados WOD y marcas
de ejercicios como un bloque reconocible y con contraste suficiente.

### RF-2 - Colecciones diferenciadas

Los resultados WOD y las marcas de ejercicios deben permanecer en secciones
independientes, con encabezado, descripcion y total propios. En escritorio se
leeran como columnas contiguas; en movil se apilaran en orden de lectura.

### RF-3 - Registro contextual

Cada fila conservara tipo, identificador o nombre disponible, valor con su unidad
o formato, nivel o tipo de registro y fecha. No se alteraran los datos recibidos
ni se introduciran nombres no disponibles en el contrato.

### RF-4 - Navegacion y estados

Cada registro continuara siendo un enlace al detalle correspondiente. Se
conservaran los estados actuales, la paginacion y sus parametros.

## Requisitos no funcionales

### RNF-1 - Accesibilidad

La estructura usara `section`, headings, listas, enlaces y `time` semanticos.
Todos los enlaces conservaran foco visible, target tactil suficiente y un nombre
accesible con contexto. El contraste no dependera solo del color.

### RNF-2 - Responsive

La pagina funcionara desde 320 px sin overflow horizontal ni contenido cortado.
Las filas usaran columnas flexibles, `min-width: 0` y wrapping para nombres,
metadatos y valores largos.

### RNF-3 - Consistencia visual

Se reutilizaran los tokens de `frontend/src/index.css`: papel, tinta, navy,
naranja, blanco calido y reglas finas. No se anadiran radios grandes, sombras
decorativas ni superficies flotantes repetidas.

### RNF-4 - Integridad y calidad

No cambiaran llamadas, contratos, rutas, ownership, paginacion ni estados. Deben
pasar `npm test`, `npm run lint` y `npm run build`.

## Criterios de aceptacion

1. El historial aplica de forma reconocible las reglas de `DESIGN.md`.
2. El usuario distingue el resumen, los resultados WOD y las marcas de ejercicios.
3. Cada registro conserva contexto, valor, unidad o formato, fecha y enlace.
4. Los estados existentes siguen siendo comprensibles y accesibles.
5. La pagina funciona desde 320 px sin overflow horizontal ni contenido cortado.
6. Los tests existentes se mantienen y cubren la estructura observable relevante.
7. `npm test`, `npm run lint` y `npm run build` pasan.
8. La revision manual cubre movil, tablet, escritorio, zoom, teclado y textos
   largos.

## Archivos previstos

- `frontend/src/pages/HistoryPage.tsx`
- `frontend/src/pages/HistoryPage.test.tsx`
- `frontend/src/index.css`
- `specs/041-estilo-historial/spec.md`
- `specs/041-estilo-historial/plan.md`
- `specs/041-estilo-historial/tasks.md`

## Decisiones resueltas

- Se conserva la composicion editorial existente y se refuerza con contraste,
  reglas y escala; no se convierte cada registro en una card.
- El resumen se mantiene dentro del encabezado navy, con texto claro y acento
  naranja para mejorar la lectura sin crear metricas nuevas.
- Las filas conservan el enlace completo y el `aria-label` contextual; no se
  anaden acciones separadas ni iconos decorativos.
- Los valores permanecen como texto porque un resultado WOD puede ser tiempo o
  rondas y repeticiones; no se crea una escala comparativa entre unidades.
