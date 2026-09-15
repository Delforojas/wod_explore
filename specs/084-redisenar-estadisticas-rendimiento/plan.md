# Plan - Issue #84: Redisenar Estadisticas como interfaz de analisis de rendimiento

## Estrategia

Refinar solo `StatisticsPage`, sus tests y sus estilos locales. Se conservaran
las dos llamadas autenticadas en paralelo, los componentes compartidos de estado,
la banda decorativa, las listas textuales, las rutas hash y todos los datos
actuales.

La estructura resultante sera una herramienta de operacion: un resumen compacto
con una metrica dominante, un archivo de marcas personales con filas tecnicas y
una seccion de evolucion que mantenga la banda como apoyo y la lista como fuente
principal. No se anadiran cards uniformes ni una grafica que mezcle unidades.

## Secuencia

1. Crear y validar este SDD con la Issue #84, `DESIGN.md`, el contrato de
   `statisticsSchema` y `evolutionSchema` y las specs relacionadas.
2. Reorganizar el bloque de resumen para que las marcas personales sean el
   indicador principal y resultados WOD y ejercicios queden como contexto.
3. Ajustar `RecordColumn` y sus items para que valor y unidad precedan al nombre,
   manteniendo grupo, metadata, fecha, enlace y `aria-label`.
4. Ajustar `EvolutionColumn` para la misma jerarquia de valor, sin eliminar la
   banda decorativa ni la lista textual accesible.
5. Sustituir los overrides especificos antiguos de Estadisticas en
   `frontend/src/index.css` por reglas locales de superficie, divisores,
   jerarquia, wrapping, foco y responsive desde 320 px.
6. Actualizar los tests para estados, llamadas paralelas, contadores, marcas,
   valores, unidades, fechas, enlaces, bandas y accesibilidad observable.
7. Ejecutar `npm test`, `npm run lint`, `npm run build` y `git diff --check`.
8. Revisar el diff completo, confirmar que solo contiene cambios de #84, crear
   un commit selectivo con `(#84)` y documentar la Issue sin push; cerrarla
   despues de la aprobacion manual.

## Decisiones de implementacion

- `StatValue` recibira una variante local de presentacion para diferenciar el
  contador principal sin cambiar el valor ni el label.
- Los items de records y evolution seguiran siendo objetos de presentacion
  locales; no se modificaran schemas ni se duplicaran tipos de API.
- La unidad se mantendra junto al valor y el contexto deportivo quedara separado
  mediante etiquetas y divisores, no mediante color exclusivo.
- Los nombres accesibles existentes se conservaran o se ampliaran solo para
  incluir la metrica y destino que ya se muestran visualmente.
- Las reglas de responsive seran estructurales: grid de una columna en movil,
  wrapping con `min-width: 0` y targets de `var(--touch-target)`.

## Riesgos y controles

- **Jerarquia aun plana:** tests sobre clases y orden DOM del valor principal,
  ademas de revision manual de la primera ventana.
- **Perdida de datos:** tests sobre ambos grupos, tipos, unidades, fechas, nombres
  accesibles y enlaces hash.
- **Banda convertida en grafica:** conservar `aria-hidden`, segmentos decorativos
  y lista textual completa sin calculos nuevos.
- **Regresion de estados:** mantener ramas explicitas y tests de privado, carga,
  vacio y error.
- **Overflow movil:** `min-width: 0`, `overflow-wrap: anywhere`, tracks flexibles
  y media queries de 760 px y 420 px.
- **Contradiccion visual:** reutilizar tokens existentes y no tocar `DESIGN.md`,
  otras paginas o primitives compartidas.

## Verificacion de alcance

Los cambios esperados quedan limitados a:

- `frontend/src/pages/StatisticsPage.tsx`.
- `frontend/src/pages/StatisticsPage.test.tsx`.
- `frontend/src/index.css`.
- `specs/084-redisenar-estadisticas-rendimiento/spec.md`.
- `specs/084-redisenar-estadisticas-rendimiento/plan.md`.
- `specs/084-redisenar-estadisticas-rendimiento/tasks.md`.

No se esperan cambios en backend, base de datos, API, schemas, router,
dependencias, `DESIGN.md` ni en los archivos untracked ajenos.
