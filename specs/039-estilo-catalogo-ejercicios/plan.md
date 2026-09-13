# Plan 039 - Aplicar sistema visual al catalogo de ejercicios

## Base tecnica

La rama parte de `docs/038-sistema-diseno-oficial`, que contiene el sistema
visual oficial de #38. La implementacion se limitara a `ExercisesPage`, su
prueba de comportamiento y los estilos necesarios en `frontend/src/index.css`.
No se tocaran contratos API, backend, persistencia ni dependencias.

## Estrategia

1. Mantener `getExercises`, sus filtros, paginacion y estados locales sin cambios
   de contrato.
2. Convertir el encabezado actual en un contexto de catalogo mas claro, separando
   la consulta en edicion de la consulta aplicada y del total recibido.
3. Presentar el resultado como un listado semantico de filas tecnicas, haciendo
   visibles nombre, categoria, tipo de medicion, identificador y destino.
4. Reutilizar `PaginationControls`, `StateMessage`, labels, `aria-live` y hrefs
   existentes sin crear una nueva capa de componentes.
5. Ajustar `index.css` para reforzar la superficie de ejercicios, la jerarquia,
   las reglas, el hover/focus, el wrapping y el apilado responsive.
6. Ampliar solo las aserciones observables necesarias: datos de fila, enlace,
   contexto de busqueda y preservacion de llamadas API.

## Decisiones tecnicas

### Estructura semantica

- Usar `header` para el encabezado de pagina.
- Mantener el formulario como `form` con `label`, `input type="search"` y submit
  explicito.
- Renderizar los resultados en `ul`/`li` con cada enlace como la unidad
  interactiva completa.
- Mantener `StateMessage` y la navegacion como elementos semanticos existentes.

### Contexto de busqueda

- Mostrar el total cuando la respuesta existe.
- Mostrar la consulta aplicada solo cuando no esta vacia.
- No sincronizar filtros con URL ni disparar peticiones por cada pulsacion; la
  busqueda continuara siendo submit-driven como define #32.

### Responsive y accesibilidad

- Conservar el layout de una columna en movil y la rejilla de metadatos en
  superficies amplias.
- Usar `min-width: 0`, `overflow-wrap: anywhere` y tamaños intrinsecos.
- Mantener el outline global de foco y `touch-action: manipulation`.
- No ocultar nombre, categoria ni medida en anchos pequenos; se reorganizaran.

## Flujo de implementacion

1. Crear este SDD y validar su contenido contra Issue #39.
2. Ajustar la estructura JSX de `ExercisesPage` sin cambiar acceso a datos.
3. Ajustar los estilos especificos del catalogo y sus media queries.
4. Proteger con tests la fila, el enlace, el contexto y la llamada de busqueda.
5. Ejecutar `npm test`, `npm run lint`, `npm run build` y `git diff --check`.
6. Revisar el diff para excluir cambios ajenos y comprobar la checklist manual.

## Riesgos y mitigaciones

### Cambio visual que rompe tests

Conservar los textos y roles funcionales; añadir solo estructura semantica o
contexto derivado de datos ya presentes y actualizar aserciones observables.

### Overflow de nombres largos

Usar wrapping, `min-width: 0` y un layout de dos niveles en movil sin truncar el
nombre principal ni la medida.

### Estados incompletos

No modificar las condiciones existentes de token, carga, error, vacio o
paginacion; revisar cada rama durante los tests.

### Duplicacion visual

Extender las clases de catalogo y tokens existentes en `index.css`; no añadir
una biblioteca de tarjetas ni estilos paralelos.

## Verificaciones

Desde `frontend/` y usando los scripts existentes:

```bash
npm test
npm run lint
npm run build
```

Ademas:

```bash
git diff --check
```

La revision manual comprobara 320 px, tablet, escritorio, zoom, teclado,
busqueda aplicada, resultado vacio, error, privacidad, nombres largos y ausencia
de overflow horizontal.
