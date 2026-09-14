# Spec 042 - Aplicar sistema visual a estadisticas

## Estado

Validada para implementar la Issue #42 sobre la rama
`feat/042-estilo-estadisticas`, derivada de `docs/038-sistema-diseno-oficial`.

## Contexto

`StatisticsPage` ya consulta los endpoints autenticados de estadisticas y
evolucion, traduce los enums existentes y mantiene una lista textual accesible
junto a la banda decorativa de evolucion. La jerarquia funcional de la Issue
#35 esta presente, pero resumen, marcas y evolucion necesitan una separacion
visual mas clara y una lectura mas consistente de valores, unidades, fechas y
enlaces.

## Objetivo

Aplicar el sistema visual oficial a las estadisticas para que el usuario pueda
leer primero el resumen de actividad, despues sus marcas personales y finalmente
la secuencia completa de evolucion, sin convertir datos heterogeneos en una
grafica comparativa.

## Alcance

Esta spec incluye:

- reforzar el bloque navy de resumen de actividad y sus tres contadores;
- diferenciar marcas personales y evolucion como secciones editoriales
  independientes;
- mejorar la jerarquia de tipo, nombre, valor, unidad o formato, nivel, fecha y
  enlaces a detalle;
- mantener la banda de evolucion como apoyo decorativo y la lista textual como
  fuente completa y accesible;
- permitir wrapping de nombres, metadatos y valores largos en movil, tablet y
  escritorio;
- conservar los estados de privacidad, carga, vacio, error y red existentes.

## Fuera de alcance

No se implementara:

- cambios en endpoints, schemas, payloads, autenticacion, router, persistencia o
  calculos;
- nuevas metricas, rankings, objetivos, comparaciones entre unidades o graficas
  cuantitativas;
- cambios en historial, catalogos, detalles, perfil, Home u otras superficies;
- cambios en la primitive compartida de estados;
- nuevas dependencias, fuentes externas, iconos o migracion a Tailwind;
- ocultar la lista textual de evolucion o sustituirla por la banda visual.

## Requisitos funcionales

### RF-1 - Resumen de actividad

La pagina debe presentar de forma distinguible el total de marcas personales, el
total de resultados WOD y el total de marcas de ejercicios, usando exclusivamente
los valores recibidos por `getStatistics`.

### RF-2 - Marcas personales

Las marcas WOD y las marcas de ejercicios deben permanecer en columnas
independientes, con encabezado, total, tipo, nombre, valor con unidad o formato,
metadatos y fecha. Cada registro debe conservar su enlace contextual al detalle.

### RF-3 - Evolucion textual

La evolucion debe conservar sus dos grupos, la banda temporal decorativa y la
lista textual completa. Cada fila debe exponer fecha, nombre, metadatos, valor,
unidad o formato y enlace correspondiente sin depender solo del color o de la
posicion de la banda.

### RF-4 - Estados e integridad

Se conservaran autenticacion, llamadas paralelas, errores, estados vacios,
enlaces hash y todos los contratos actuales de la API.

## Requisitos no funcionales

### RNF-1 - Accesibilidad

La estructura usara secciones y headings jerarquicos, listas, enlaces reales y
elementos `time`. La banda mantendra `aria-hidden="true"`; la lista sera
completa, navegable por teclado y con nombres accesibles contextuales. Todos los
enlaces conservaran foco visible y targets tactiles suficientes.

### RNF-2 - Responsive

La pagina funcionara desde 320 px sin overflow horizontal ni contenido cortado.
Las columnas se apilaran en movil, y las filas usaran tracks flexibles,
`min-width: 0` y wrapping para nombres, metadatos y valores largos.

### RNF-3 - Consistencia visual

Se reutilizaran los tokens existentes de `frontend/src/index.css`: papel, tinta,
navy, naranja, blanco calido y reglas finas. La superficie sera editorial y
contigua, sin sombras o radios decorativos ni una cuadricula de cards repetidas.

### RNF-4 - Calidad

No se anadiran dependencias. Deben pasar `npm test`, `npm run lint` y
`npm run build`.

## Criterios de aceptacion

1. Las estadisticas aplican de forma reconocible las reglas de `DESIGN.md`.
2. El usuario distingue resumen de actividad, marcas personales y evolucion.
3. Cada registro conserva contexto, valor, unidad o formato, fecha y enlace.
4. La evolucion mantiene un fallback textual completo independiente de la banda.
5. Los estados existentes siguen siendo comprensibles y accesibles.
6. La pagina funciona desde 320 px sin overflow horizontal ni contenido cortado.
7. Los tests existentes se mantienen y cubren la estructura observable relevante.
8. `npm test`, `npm run lint` y `npm run build` pasan.
9. La revision manual cubre movil, tablet, escritorio, zoom, teclado y textos
   largos.

## Archivos previstos

- `frontend/src/pages/StatisticsPage.tsx`
- `frontend/src/pages/StatisticsPage.test.tsx`
- `frontend/src/index.css`
- `specs/042-estilo-estadisticas/spec.md`
- `specs/042-estilo-estadisticas/plan.md`
- `specs/042-estilo-estadisticas/tasks.md`

## Decisiones resueltas

- Se conserva la separacion de #35 y se refuerza mediante superficies, reglas y
  escala, sin transformar las secciones en cards uniformes.
- Los valores se mostraran separados de sus unidades cuando el contrato lo
  permita; los resultados WOD de rondas y repeticiones conservaran su formato
  compuesto porque no son una magnitud comparable unica.
- La banda de evolucion continuara siendo decorativa y la lista textual seguira
  conteniendo toda la informacion y los enlaces.
- No se anaden nombres, calculos, etiquetas de negocio ni datos que no entregue
  la API actual.
