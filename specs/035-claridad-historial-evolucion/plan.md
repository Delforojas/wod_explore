# Plan 035 - Dar mas claridad visual al historial y la evolucion

## Base tecnica

La rama parte de `feat/034-unificar-estados-ui`, que contiene la primitive
compartida de estados y la cobertura reciente del frontend. La implementacion se
limita a React/TypeScript y al CSS existente en `frontend/src/index.css`.

## Estrategia

1. Revisar los contratos de historial, estadisticas y evolucion y mantener sus
   llamadas y transformaciones de datos sin cambios funcionales.
2. Reorganizar `HistoryPage` con un encabezado-resumen explicito y columnas
   semanticas para resultados WOD y marcas de ejercicios.
3. Reorganizar `StatisticsPage` para separar actividad, marcas personales y
   evolucion; hacer visibles las etiquetas de nivel, tipo, unidad y fecha.
4. Convertir las filas de evolucion en enlaces contextualizados y acompanar cada
   grupo con una banda CSS decorativa basada en el orden temporal de sus puntos.
5. Mantener una lista textual completa para la evolucion, con `time`, valor,
   unidad, nombre y destino; no usar color o banda como unico canal de datos.
6. Ajustar CSS mobile-first, wrapping, espaciado, focus-visible, targets tactiles
   y reduced motion sin alterar el lenguaje editorial.
7. Extender pruebas de comportamiento para los nuevos headings, etiquetas,
   enlaces, bandas/fallback textual y estados vacios.
8. Ejecutar tests, lint, build, `git diff --check` y el detector mecanico de
   Impeccable sobre los targets modificados.

## Decisiones tecnicas

### 1. Presentacion de datos

- Mantener los tipos derivados de Zod y los objetos recibidos de la API.
- Traducir solamente el texto visible mediante mapas exhaustivos de enums ya
  existentes.
- Formatear fechas con `Intl.DateTimeFormat("es-ES")` y conservar el valor ISO en
  `dateTime` cuando se renderice un elemento `time`.
- Reutilizar los enlaces existentes y anadir `aria-label` contextual solo cuando
  el texto visible no sea suficiente.

### 2. Evolucion

- Ordenar visualmente los puntos en el mismo orden recibido por el endpoint, sin
  cambiar la respuesta ni inferir una mejor marca nueva.
- Renderizar una banda por intento para comunicar secuencia y volumen temporal.
- Marcar la banda como `aria-hidden` y dejar todos los datos y enlaces en la lista
  textual adyacente.
- No normalizar valores de WOD y ejercicio en una escala comun.

### 3. Responsive y CSS

- Usar las columnas existentes en escritorio y apilarlas en movil.
- Cambiar las filas de historial y marcas a una composicion que reserve espacio
  para el valor sin permitir que nombres largos desborden.
- Mantener `min-width: 0`, `overflow-wrap: anywhere`, focus visible, safe areas y
  targets de 44 px.
- Usar un estilo inline unicamente para la dimension dinamica de una banda CSS;
  colores, espaciado y estados permaneceran en `index.css`.

## Flujo de implementacion

1. Implementar la nueva estructura semantica y el resumen de `HistoryPage`.
2. Implementar la jerarquia, etiquetas, enlaces y fallback textual de
   `StatisticsPage`.
3. Añadir las bandas de evolucion y estilos responsive compartidos.
4. Ajustar pruebas de historial y estadisticas para el comportamiento observable.
5. Ejecutar las verificaciones obligatorias y revisar el detector visual.
6. Revisar el diff para confirmar que solo cambia el alcance de la Issue #35.

## Riesgos y mitigaciones

- Una fila puede crecer demasiado con nombres largos: usar wrapping y layout de
  dos filas en movil, comprobando 320 px.
- Una banda puede parecer una medicion cuantitativa: etiquetarla como secuencia
  temporal, hacerla decorativa y conservar el listado completo como fuente de
  datos.
- Traducir enums puede romper tests o payloads: transformar solo el render y
  verificar que las llamadas API no cambian.
- Reutilizar una misma clase para resumen y registros puede mantener la ambiguedad:
  usar clases de seccion explicitas sin crear una nueva libreria de componentes.

## Verificaciones

Desde `frontend/` y usando los scripts existentes:

```bash
npm test
npm run lint
npm run build
```

Tambien se comprobara manualmente la lectura con datos vacios y poblados en 320
px, tablet y escritorio, la navegacion por teclado, los nombres largos, los
enlaces de detalle y la ausencia de cambios en API, schemas, payloads o rutas.
