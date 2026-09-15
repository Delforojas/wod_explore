# Plan - Issue #83: Redisenar Historial orientado a evolucion del rendimiento

## Estrategia

Refinar solo la composicion de `HistoryPage` y sus estilos locales. La pagina
seguira usando `getHistory`, `StateMessage`, `LoadingMessage` y
`PaginationControls`; la unica transformacion nueva sera combinar en memoria los
dos grupos ya recibidos para presentarlos en orden cronologico estable.

La superficie usara una lista continua con divisores y una jerarquia de metricas,
no un grid uniforme de cards. Cada fila mantendra un enlace completo y separara
visualmente el resultado principal, su unidad o formato y el contexto del
recurso.

## Secuencia

1. Crear y validar este SDD con el contrato real de historial, las decisiones de
   `DESIGN.md` y el alcance de la Issue #83.
2. Extraer en `HistoryPage` una representacion interna comun para resultados WOD
   y ejercicios, conservando sus fechas, etiquetas, valores, unidades, rutas y
   nombres accesibles.
3. Combinar y ordenar los items de la pagina actual por fecha descendente con un
   desempate estable, sin alterar `history` ni los parametros de API.
4. Reorganizar el markup en un resumen secundario, una lista cronologica semantica
   y estados vacios por grupo solo cuando el contrato actual los requiera.
5. Ajustar los selectores `.history-page` de `frontend/src/index.css` para dar
   prioridad al resultado, asegurar wrapping, foco visible, targets tactiles y
   layouts de 320 px, tablet y escritorio.
6. Actualizar los tests para cubrir orden, jerarquia observable, tipos, unidades,
   enlaces, fallback y no regresion de estados, carga y privacidad.
7. Ejecutar `npm test`, `npm run lint`, `npm run build` y `git diff --check` desde
   `frontend/` o la raiz segun corresponda.
8. Revisar diff y status, comprobar que solo se incluyen archivos de #83, crear
   un commit selectivo con `(#83)` y documentar la Issue sin push ni cierre.

## Decisiones de implementacion

- La funcion de normalizacion recibira un item ya validado y devolvera un tipo
  comun de presentacion; no modificara schemas ni datos originales.
- La fecha se conservara como ISO en `time dateTime` y se formateara solo para
  lectura humana con el formatter existente.
- `sort` usara `dateTime` descendente y el indice original como desempate para
  que las fechas invalidas o iguales no produzcan un orden inestable.
- La metrica se marcara con `data` y una clase especifica de valor para que la
  jerarquia sea observable sin depender de color.
- El resumen seguira siendo un `dl` y la actividad un `ol`; no se anadiran
  componentes globales ni una nueva primitive de estados.
- Las reglas CSS de historial se mantendran agrupadas en los bloques especificos
  existentes, evitando tocar estilos compartidos de catalogos o estadisticas.

## Riesgos y controles

- **Orden incorrecto:** tests con fechas cruzadas entre WOD y ejercicio y con
  fechas iguales.
- **Regresion de contrato:** conservar una sola llamada a `getHistory` con
  `{ page, size: DEFAULT_PAGE_SIZE }` y no modificar schemas ni rutas.
- **Perdida de contexto:** tests sobre tipo, nombre, nivel o record type, fecha,
  unidad y `aria-label`.
- **Overflow movil:** `min-width: 0`, `overflow-wrap: anywhere`, grid flexible y
  media query para apilar el valor.
- **Jerarquia plana:** test observable del orden de texto y clases especificas
  para la metrica principal.
- **Direccion visual inconsistente:** reutilizar variables existentes y no
  introducir color, fuente, radio o sombra nuevos.

## Verificacion de alcance

Los cambios esperados quedan limitados a:

- `frontend/src/pages/HistoryPage.tsx`.
- `frontend/src/pages/HistoryPage.test.tsx`.
- `frontend/src/index.css`.
- `specs/083-redisenar-historial-rendimiento/spec.md`.
- `specs/083-redisenar-historial-rendimiento/plan.md`.
- `specs/083-redisenar-historial-rendimiento/tasks.md`.

No se esperan cambios en backend, base de datos, API, schemas, router,
dependencias ni en los archivos untracked ajenos ya presentes.
