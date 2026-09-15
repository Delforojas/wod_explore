# SDD - Issue #83: Redisenar Historial orientado a evolucion del rendimiento

## Estado

Spec de implementacion frontend para convertir Historial en una superficie de
consulta rapida de resultados deportivos. La rama de trabajo es
`feat/083-redisenar-historial-rendimiento`, derivada de `main`.

## Contexto

`HistoryPage` ya consulta `getHistory` con autenticacion y paginacion, muestra
resultados WOD y marcas de ejercicios, conserva los enlaces a sus detalles y
resuelve los estados de privacidad, carga, error, red y vacio. La composicion
actual presenta las colecciones en columnas con una jerarquia demasiado plana:
el nombre y el tipo compiten con el valor, y una persona debe recorrer bloques
separados para construir una lectura cronologica.

La Issue #83 solicita redisenar esta superficie para que el resultado deportivo
sea el primer dato reconocible y para que el historial permita escanear una
secuencia de sesiones sin perder el contexto del WOD, ejercicio, fecha o tipo de
registro.

## Objetivo

Hacer que una persona autenticada pueda revisar que entreno y que resultado
obtuvo con una lectura cronologica, densa y accesible. Cada registro debe
comunicar primero su valor y unidad o formato, despues el recurso relacionado y
finalmente su contexto deportivo y fecha.

## Alcance

### Incluido

- Reorganizar `HistoryPage` en un archivo cronologico unico que combine los
  resultados WOD y las marcas de ejercicios de la pagina recibida.
- Mantener una distincion textual y visual inequivoca entre resultado WOD y
  marca de ejercicio.
- Dar prioridad visual a tiempos, rondas y repeticiones, pesos, repeticiones,
  segundos o metros usando un formato consistente con los datos actuales.
- Mostrar nombre o fallback tecnico, nivel o tipo de registro, fecha y enlace al
  detalle correspondiente en cada item.
- Mantener el resumen de totales de resultados WOD y marcas de ejercicios,
  haciendolo secundario frente a los registros deportivos.
- Mantener estados privado, carga, vacio, error y error de red mediante los
  componentes compartidos actuales.
- Mantener la paginacion, sus parametros, `hasNext`, botones y limites actuales.
- Ajustar estilos locales de historial con los tokens, superficies, divisores,
  foco y responsive definidos por `DESIGN.md`.
- Cubrir con tests la jerarquia observable, el orden cronologico, los valores,
  las etiquetas de tipo, los enlaces, los fallbacks y los estados existentes.

## Fuera de alcance

No se implementara:

- nuevos endpoints, cambios de API, schemas, payloads, calculos o reglas de
  negocio;
- cambios en backend, MySQL, Docker, autenticacion, persistencia o router;
- nuevas metricas, rankings, comparaciones entre unidades, graficas o filtros;
- edicion, borrado o cambios en la paginacion del historial;
- redisenos de Estadisticas, catalogos, detalles, perfil, Home o shell;
- nuevas dependencias, iconos, fuentes externas, imagenes, gradientes o sombras;
- cambios en `StateMessage` o `PaginationControls` salvo que una regresion
  observable y estrictamente local lo exigiera.

## Requisitos funcionales

### RF-1 - Resumen de actividad

La pagina debe identificar `Historial`, explicar brevemente su proposito y
mostrar los totales de resultados WOD y marcas de ejercicios sin competir
visualmente con las metricas de cada registro.

### RF-2 - Lectura cronologica

Los items recibidos en la pagina actual deben aparecer en un listado comun
ordenado de mas reciente a mas antiguo por su fecha efectiva: `completedAt` para
WOD y `performedAt` para ejercicios. Si dos fechas coinciden, se conservara un
orden estable que no dependa de una comparacion de unidades o valores.

### RF-3 - Resultado dominante

Cada item debe presentar como dato de mayor jerarquia su resultado:

- un tiempo en segundos cuando `timeSeconds` existe;
- rondas y repeticiones cuando el resultado WOD no tiene tiempo;
- el valor y la unidad traducida cuando es una marca de ejercicio.

El valor no se convertira ni se comparara con items de otra unidad. La unidad o
formato permanecera asociada visualmente y tambien formara parte del nombre
accesible del enlace.

### RF-4 - Contexto del registro

Cada item debe distinguir mediante texto si es `Resultado WOD` o `Marca de
ejercicio`, mostrar el nombre disponible o `WOD #id` / `Ejercicio #id`, y
conservar nivel, tipo de registro y fecha. Los textos largos deben envolver sin
cortarse.

### RF-5 - Navegacion

Los resultados WOD conservaran enlaces `#/wods/:id` y las marcas de ejercicios
enlaces `#/exercises/:id`. Cada fila completa sera un enlace real con un
`aria-label` que incluya el recurso, el resultado y el destino.

### RF-6 - Estados y paginacion

Se conservaran las ramas actuales de privacidad, carga, error, red y vacio. La
paginacion seguira usando la respuesta de `getHistory`, mantendra el tamano de
pagina y avanzara mientras alguno de los dos grupos indique `hasNext`.

## Requisitos no funcionales

### RNF-1 - Responsive

La interfaz funcionara desde 320 px sin overflow horizontal evitable. En movil
cada fila apilara contexto y resultado en un orden logico; en tablet y escritorio
usara el ancho disponible para mostrar una lectura cronologica continua sin
convertirse en una cuadricula rigida de tarjetas.

### RNF-2 - Accesibilidad

Se conservaran `section`, headings, `ol`, `li`, links, `data` y `time` cuando
corresponda. Los enlaces tendran foco visible, un target tactil suficiente y
nombres accesibles contextualizados. La diferencia entre tipos no dependera
solo del color.

### RNF-3 - Consistencia visual

Se reutilizaran las superficies oscuras, papel, tinta, navy, naranja, reglas
finas, tipografia sans y radios existentes de `DESIGN.md`. El naranja se
reservara para acentos funcionales; no se anadiran cards flotantes, decoracion o
un lenguaje visual paralelo.

### RNF-4 - Integridad y calidad

No cambiaran contratos, llamadas, parametros, rutas, autenticacion, estados ni
dependencias. Deben pasar `npm test`, `npm run lint`, `npm run build` y
`git diff --check`.

## Criterios de aceptacion

1. Historial presenta una lectura cronologica unica de los resultados de la
   pagina actual.
2. El valor deportivo y su unidad o formato se reconocen antes que el nombre y
   la descripcion.
3. Cada item distingue resultado WOD y marca de ejercicio, conserva nombre o
   fallback, contexto, fecha y enlace correcto.
4. Los nombres accesibles de los enlaces comunican resultado, recurso y destino.
5. Los totales, estados, autenticacion, paginacion y parametros existentes no
   cambian.
6. La pagina funciona desde 320 px, con textos largos y navegacion por teclado,
   sin overflow horizontal evitable.
7. No se introducen nuevas metricas, comparaciones, endpoints, dependencias ni
   cambios fuera del frontend local de Historial.
8. `npm test`, `npm run lint`, `npm run build` y `git diff --check` pasan.

## Archivos previstos

- `frontend/src/pages/HistoryPage.tsx`
- `frontend/src/pages/HistoryPage.test.tsx`
- `frontend/src/index.css`
- `specs/083-redisenar-historial-rendimiento/spec.md`
- `specs/083-redisenar-historial-rendimiento/plan.md`
- `specs/083-redisenar-historial-rendimiento/tasks.md`

## Decisiones resueltas

- La cronologia se construira solo con los items de la pagina actual, sin
  solicitar un endpoint nuevo ni alterar la paginacion del contrato existente.
- El orden se basara exclusivamente en la fecha efectiva de cada tipo de
  resultado y tendra un desempate estable por posicion original.
- Los resultados WOD que no tienen tiempo conservaran el formato de rondas y
  repeticiones; no se creara una escala comun para tiempos, pesos y repeticiones.
- Las filas continuaran siendo enlaces completos y no tendran acciones separadas
  ni iconos decorativos.
- Los estilos quedaran limitados a selectores de `.history-page` y sus elementos
  descendientes en `frontend/src/index.css`.
