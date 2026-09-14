# Plan 041 - Aplicar sistema visual al historial

## Base tecnica

La rama parte de `docs/038-sistema-diseno-oficial`, que contiene el sistema
visual oficial y la implementacion funcional previa de historial. La fuente de
datos continua siendo `getHistory` y los tipos de `frontend/src/api/schemas.ts`.

## Estrategia

1. Ajustar la presentacion de `HistoryPage` solo donde aporte jerarquia o
   semantica observable.
2. Reforzar el contraste del bloque navy de cabecera y del resumen mediante los
   tokens existentes.
3. Tratar `history-grid` como una composicion de dos columnas editoriales con
   separacion por reglas, no como tarjetas independientes.
4. Mantener cada fila como enlace real con valor destacado, metadatos envueltos,
   fecha semantica y target tactil.
5. Ajustar los breakpoints existentes para que la separacion desktop desaparezca
   correctamente al apilar en movil.
6. Extender las pruebas de comportamiento solo para la semantica y el contexto
   que sean verificables sin acoplarlas a detalles CSS.

## Implementacion prevista

### `HistoryPage.tsx`

- Mantener llamadas API, estados, parametros de paginacion, enlaces y formatos.
- Usar una estructura de datos presentacional explicita para distinguir valor y
  contexto sin transformar los datos de API.
- Mantener headings, `ol`, `li`, `a` y `time` como elementos nativos.

### `index.css`

- Aplicar colores de texto adecuados al resumen sobre navy.
- Reforzar la separacion visual entre columnas y la lectura de encabezados.
- Mejorar espaciado, wrapping, contraste de hover y dimension tactil de filas.
- Mantener media queries mobile-first existentes y no usar overflow para ocultar
  contenido.

### Tests

- Conservar las pruebas de privacidad, carga, vacio, datos/enlaces y error.
- Verificar que el resumen expone sus totales y que las fechas siguen siendo
  elementos `time` cuando hay resultados.

## Riesgos y mitigaciones

### Contraste sobre navy

Los tokens `--ink-soft` y `--ink` no deben usarse como texto principal sobre
navy. Se usaran `--white` y `--orange-soft` en el resumen y se comprobara el
resultado en la revision manual.

### Overflow por valores largos

Las columnas y filas conservaran `min-width: 0`, `minmax(0, 1fr)` y
`overflow-wrap: anywhere`. En movil el valor mantendra una columna propia sin
forzar una anchura fija.

### Regresion funcional

No se tocara el efecto de carga ni el shape del request. Los tests existentes
validaran los estados y enlaces, y el build comprobara los tipos.

## Verificaciones

```bash
npm test
npm run lint
npm run build
```

Tambien se ejecutaran:

```bash
git diff --check
```

La revision manual debe cubrir 320 px, tablet, escritorio, zoom, teclado,
focus-visible, estados y nombres/metadatos largos. Al terminar la UI se ejecutara
una pasada unica del detector mecanico de Impeccable sobre los archivos
modificados.

## Limites de entrega

- No modificar backend, base de datos, Docker, contratos, router ni dependencias.
- No hacer commit ni push automatico sin instruccion explicita del usuario.
