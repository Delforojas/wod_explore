# SDD - Issue #84: Redisenar Estadisticas como interfaz de analisis de rendimiento

## Estado

Spec de implementacion frontend para convertir Estadisticas en una superficie de
analisis deportivo clara y escaneable. La rama de trabajo es
`feat/084-redisenar-estadisticas-rendimiento`, derivada de `main`.

## Contexto

`StatisticsPage` ya consulta en paralelo `getStatistics` y `getEvolution` con el
JWT de la sesion. La respuesta contiene contadores de actividad, una marca
personal por WOD o ejercicio y todos los intentos de evolucion. La pagina ya
conserva estados de privacidad, carga, error, red y vacio, enlaces hash, bandas
decorativas y listas textuales.

La composicion actual trata el resumen, las marcas personales y la evolucion con
una intensidad visual similar. Ademas, varias filas presentan primero el nombre
o la fecha y dejan el resultado deportivo en un segundo plano. La Issue #84 pide
que la pantalla funcione como una herramienta de analisis, no como un dashboard
generico ni como una composicion editorial.

## Objetivo

Permitir que una persona autenticada entienda rapidamente su estado de
rendimiento: primero el resumen de actividad, despues sus marcas personales y
finalmente la secuencia completa de intentos. Los valores existentes deben ser
los protagonistas y permanecer asociados a su unidad, contexto, estado y
periodo.

## Alcance

### Incluido

- Reorganizar `StatisticsPage` en tres niveles de lectura: resumen de actividad,
  marcas personales y evolucion.
- Dar prioridad visual y semantica a tiempos, pesos, repeticiones, rondas y
  demas valores recibidos por la API.
- Mantener separados valor, unidad o formato, WOD o ejercicio, nivel o tipo de
  registro y fecha.
- Diferenciar las marcas personales WOD y de ejercicios mediante secciones y
  filas tecnicas, sin convertirlas en cards repetitivas.
- Mantener la banda de evolucion como apoyo decorativo y la lista textual
  completa como fuente accesible.
- Conservar nombres accesibles y enlaces `#/wods/:id` y `#/exercises/:id`.
- Mantener los estados privado, carga, vacio, error y error de red actuales.
- Ajustar estilos locales de Estadisticas con los tokens de `DESIGN.md`, cifras
  tabulares, superficies, divisores, foco y responsive mobile-first.
- Ampliar tests de comportamiento para jerarquia observable, valores, unidades,
  estados, enlaces y estructura textual de evolucion.

### Principio de datos

Las marcas personales ya son el resultado de los endpoints de estadisticas; no
se inferiran nuevos PRs, comparaciones, tendencias ni periodos. La interfaz
puede destacar visualmente la seccion y sus valores, pero no inventara estados
que el contrato no entregue.

## Fuera de alcance

No se implementara:

- nuevos endpoints, cambios de API, schemas, payloads, calculos o reglas de
  negocio;
- cambios en backend, MySQL, Docker, autenticacion, persistencia o router;
- nuevas metricas, rankings, objetivos, comparaciones entre unidades, filtros o
  graficas cuantitativas;
- rediseño de Historial, catalogos, detalles, perfil, Home o shell;
- sustitucion de la lista textual por la banda de evolucion;
- nuevas dependencias, fuentes externas, iconos, imagenes, gradientes o sombras;
- cambios en `StateMessage` o en los contratos de `getStatistics` y
  `getEvolution`.

## Requisitos funcionales

### RF-1 - Jerarquia de actividad

La primera lectura de la pagina debe distinguir el titulo Estadisticas y los
tres valores existentes: marcas personales, resultados WOD y marcas de
ejercicios. El total de marcas personales funcionara como indicador principal;
los otros dos contadores conservaran su significado y quedaran como contexto de
actividad.

### RF-2 - Marcas personales

La seccion de marcas personales debe mantener dos grupos independientes: marcas
WOD y marcas de ejercicios. Cada fila debe mostrar resultado y unidad o formato,
nombre del recurso, tipo de contenido, nivel o tipo de registro y fecha. Cada
fila completa debe continuar enlazando al detalle correspondiente.

### RF-3 - Evolucion completa

La seccion de evolucion debe mantener los grupos WOD y ejercicios, su banda
decorativa y la lista textual completa. Cada punto debe exponer fecha, nombre,
metadatos, valor, unidad o formato y enlace. La lista no debe depender del color,
la posicion ni la existencia de la banda para comunicar datos.

### RF-4 - Integridad de datos y estados

La pagina continuara llamando una vez a `getStatistics(token)` y una vez a
`getEvolution(token)` en paralelo. Se conservaran los datos recibidos, los
enlaces, la autenticacion y los estados de privacidad, carga, error, red y vacio.

## Requisitos no funcionales

### RNF-1 - Responsive

La interfaz funcionara desde 320 px sin overflow horizontal evitable. En movil
las regiones se apilaran en orden de lectura y las filas reorganizaran valor,
contexto y fecha; en tablet y escritorio se aprovechara el ancho disponible sin
una cuadricula uniforme de tarjetas.

### RNF-2 - Accesibilidad

Se conservaran secciones, headings jerarquicos, listas, enlaces reales, elementos
`data` y `time`. La banda mantendra `aria-hidden="true"`; todos los enlaces
tendran foco visible, targets tactiles suficientes y nombres accesibles con
contexto de resultado y destino.

### RNF-3 - Consistencia visual

Se reutilizaran las superficies oscuras, niveles de superficie, bordes, texto,
naranja funcional, verde de rendimiento cuando corresponda, sans-serif y
tipografia tabular definida en `DESIGN.md`. No se anadiran radios, sombras,
gradientes ni patrones visuales paralelos.

### RNF-4 - Integridad y calidad

No cambiaran endpoints, schemas, parametros, rutas, contratos, dependencias ni
datos. Deben pasar `npm test`, `npm run lint`, `npm run build` y
`git diff --check`.

## Criterios de aceptacion

1. Las metricas principales se reconocen inmediatamente y el resultado tiene mas
   jerarquia que labels y metadata.
2. Se distinguen resumen, marcas personales y evolucion, con grupos WOD y
   ejercicios comprensibles.
3. Los valores existentes conservan unidad o formato, contexto, estado y fecha
   sin alterar su significado.
4. Las marcas y puntos de evolucion conservan enlaces hash y nombres accesibles.
5. La banda de evolucion sigue siendo decorativa y la lista textual sigue
   completa y accesible.
6. Privacidad, carga, vacio, error, red, llamadas paralelas y contratos no
   presentan regresiones.
7. La pagina funciona desde 320 px y con teclado, foco visible y textos largos.
8. No se introducen nuevas metricas, graficas, endpoints, dependencias ni
   cambios fuera de Estadisticas.
9. `npm test`, `npm run lint`, `npm run build` y `git diff --check` pasan.

## Archivos previstos

- `frontend/src/pages/StatisticsPage.tsx`
- `frontend/src/pages/StatisticsPage.test.tsx`
- `frontend/src/index.css`
- `specs/084-redisenar-estadisticas-rendimiento/spec.md`
- `specs/084-redisenar-estadisticas-rendimiento/plan.md`
- `specs/084-redisenar-estadisticas-rendimiento/tasks.md`

## Decisiones resueltas

- El bloque de actividad mantiene los tres contadores actuales, pero el total de
  marcas personales recibe el tratamiento principal sin crear una cuarta metrica.
- Las filas de marcas y evolucion colocan primero el valor y su unidad o formato
  en el orden de lectura y lo mantienen asociado al nombre y metadata.
- La banda se conserva sin interpretarla como grafica: no se calcula altura,
  tendencia, mejora ni comparacion a partir de valores heterogeneos.
- Las etiquetas de enums se traducen localmente con los mapas ya usados por la
  pagina; los valores y fechas de la API permanecen intactos.
- Los cambios CSS se limitaran a selectores de Estadisticas y sus descendientes;
  no se modificara el sistema visual global ni otras paginas.
