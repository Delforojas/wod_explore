# Spec 035 - Dar mas claridad visual al historial y la evolucion

## Estado

Implementada en la rama `feat/035-claridad-historial-evolucion`.

## Contexto

Las paginas de historial y estadisticas ya consultan los contratos de usuario
existentes y conservan los enlaces a WODs y ejercicios. Sin embargo, los
resultados, las marcas personales y los intentos de evolucion se presentan con
una densidad y una jerarquia muy parecidas, por lo que cuesta distinguir que es
un resumen, que es una marca destacada y que es un registro individual.

La Issue #35 solicita mejorar la lectura de estas superficies sin modificar
datos, reglas de negocio, endpoints, autenticacion ni paginacion. La solucion
debe continuar el lenguaje editorial de WOD Explorer y hacer visible la
evolucion sin depender exclusivamente de una grafica o del color.

## Objetivo

Convertir historial y estadisticas en un archivo de rendimiento mas escaneable:
primero el resumen, despues los registros o marcas relevantes y finalmente la
secuencia temporal de intentos. Cada item debe conservar suficiente contexto
para entenderlo y llegar a su detalle.

## Alcance

Esta spec incluye:

- jerarquia visual y semantica entre resumen, resultados, marcas personales e
  intentos de evolucion;
- etiquetas visibles comprensibles para niveles, tipos de registro, unidades y
  fechas, sin cambiar los valores enviados o recibidos por la API;
- enlaces de historial, marcas y evolucion a los detalles correspondientes,
  con nombres accesibles que mantengan el contexto del item;
- una visualizacion ligera de la secuencia temporal de evolucion mediante bandas
  CSS, acompanada siempre por una lista textual completa y accesible;
- estados vacios orientados al siguiente paso y conservacion de los estados de
  carga, error, red y privacidad definidos en la Issue #34;
- composicion mobile-first para 320 px, tablet y escritorio, sin overflow;
- pruebas de comportamiento para jerarquia observable, enlaces, etiquetas,
  fallback textual y estados vacios.

## Fuera de alcance

No se implementara:

- nuevos endpoints, cambios de API, schemas, payloads o reglas de negocio;
- cambios en backend, MySQL, Docker, autenticacion, persistencia o router;
- calculos nuevos de marcas personales, rankings o comparaciones entre unidades;
- una grafica cuantitativa que mezcle segundos, rondas, repeticiones, peso,
  tiempo o distancia en una misma escala sin respaldo del contrato;
- edicion, borrado, filtrado o nueva paginacion de resultados;
- dependencias nuevas, icon libraries, fuentes externas o navegadores E2E;
- rediseño de catalogos, detalles, perfil, Home o la primitive de estados salvo
  los ajustes estrictamente necesarios para estas pantallas.

## Requisitos funcionales

### RF-1 - Resumen distinguible

Historial debe comunicar de forma clara el total de resultados WOD y marcas de
ejercicios. Estadisticas debe separar el resumen de actividad de las marcas
personales y mostrar estas ultimas como la informacion prioritaria de la
superficie.

### RF-2 - Registros con contexto

Cada fila de historial y cada marca personal debe distinguir tipo de contenido,
identificador o nombre disponible, valor, unidad o formato, nivel o tipo de
registro y fecha. Los nombres y metadatos largos deben envolver sin cortarse.

### RF-3 - Navegacion contextual

Los resultados de WOD deben conservar enlaces `#/wods/:id` y los resultados de
ejercicio enlaces `#/exercises/:id`. Las marcas y los puntos de evolucion deben
mantener sus enlaces y los nombres accesibles deben indicar el destino sin
depender solo del texto visual.

### RF-4 - Evolucion legible

Cada grupo de evolucion debe mostrar una banda temporal ligera para facilitar la
lectura de la secuencia de intentos y una lista textual completa con fecha,
nombre y valor. La banda sera decorativa para tecnologia asistiva; la lista
textual sera la fuente accesible y conservara los enlaces a detalle.

La representacion no interpretara ni comparara automaticamente magnitudes de
unidades diferentes. La informacion mostrada sera la recibida de la API.

### RF-5 - Estados y recuperacion

Se conservaran los estados de carga, vacio, error, error de red y privacidad de
la Issue #34. Los estados vacios de historial y de cada grupo de estadisticas
deben explicar que falta y ofrecer una accion de exploracion cuando sea util.

### RF-6 - Integridad

Se conservaran llamadas, parametros, payloads, rutas hash, autenticacion,
paginacion, manejo de errores y contratos de `frontend/src/api/schemas.ts`.

## Requisitos no funcionales

### RNF-1 - Accesibilidad

La estructura usara headings, sections, lists, links y `time` semanticos. Todos
los enlaces y controles conservaran foco visible, targets tactiles y nombres
accesibles. La evolucion no dependera unicamente del color, posicion o banda
visual para comunicar datos.

### RNF-2 - Responsive

La interfaz funcionara desde 320 px sin scroll horizontal. En movil se apilaran
las secciones en orden de lectura, los valores tendran espacio suficiente y los
metadatos podran envolver. En tablet y escritorio se mantendra la composicion
editorial de columnas sin convertirla en una cuadricula rigida de tarjetas.

### RNF-3 - Consistencia visual

Se reutilizaran papel, tinta, navy, naranja, reglas finas, tipografia editorial
y tokens existentes de `frontend/src/index.css`. Las bandas de evolucion seran
un recurso de apoyo, no un segundo lenguaje visual ni un dashboard de graficas.

### RNF-4 - Calidad

No se anadiran dependencias. Deben pasar `npm test`, `npm run lint` y
`npm run build`.

## Criterios de aceptacion

1. Historial diferencia visualmente resumen, resultados WOD y marcas de ejercicios.
2. Estadisticas diferencia resumen de actividad, marcas personales y evolucion.
3. Cada item conserva valor, unidad o formato, fecha y contexto legible sin
   overflow en movil, tablet o escritorio.
4. Historial, marcas y evolucion conservan enlaces semanticos a sus detalles con
   nombres accesibles y contexto suficiente.
5. Evolucion ofrece bandas visuales ligeras y un fallback textual completo que no
   depende de color o posicion.
6. Los estados vacios siguen siendo explicativos y ofrecen el siguiente paso
   cuando existe una accion util.
7. No cambian endpoints, schemas, payloads, autenticacion, rutas ni paginacion.
8. No se anaden dependencias ni una escala comparativa nueva entre unidades.
9. `npm test`, `npm run lint` y `npm run build` pasan.

## Archivos previstos

- `frontend/src/pages/HistoryPage.tsx`
- `frontend/src/pages/HistoryPage.test.tsx`
- `frontend/src/pages/StatisticsPage.tsx`
- `frontend/src/pages/StatisticsPage.test.tsx`
- `frontend/src/index.css`

## Decisiones resueltas

- Se mantendra el layout editorial existente y se reforzara la jerarquia con
  secciones semanticas, encabezados y filas tecnicas; no se introducira un grid
  de cards uniforme.
- Las etiquetas visibles traduciran enums y unidades existentes, mientras que
  los valores de API permaneceran intactos.
- La evolucion usara bandas temporales CSS y no una grafica cuantitativa, porque
  los puntos pueden mezclar metricas y unidades no comparables. La lista textual
  seguira siendo completa y accesible.
- Se mantendran enlaces hash reales en todos los elementos navegables y no se
  anadira un sistema global de notificaciones ni una nueva abstraccion de estado.
