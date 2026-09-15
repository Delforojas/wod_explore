# Plan - Issue #81: Redisenar gestion de Mis WODs

## Estrategia

Mejorar las superficies existentes sin cambiar su contrato funcional. El
listado seguira siendo una lista paginada que deriva el conteo de ejercicios
desde los detalles disponibles, y el detalle seguira concentrando resultados,
edicion y eliminacion. Se reutilizaran `StateMessage`, `PaginationControls`,
`WodResultsPanel`, el cliente API y los tokens CSS ya integrados por #76.

## Secuencia

1. Crear esta especificacion con alcance, estados, interacciones y criterios de
   aceptacion verificables.
2. Inspeccionar las composiciones actuales, contratos, tests, estados globales y
   estilos de #47, #48, #49, #76, #78 y #79.
3. Reorganizar `MyWodsPage` en una cabecera de archivo, una lista continua y
   acciones explicitas de ver y editar, sin trasladar el borrado al listado.
4. Reorganizar `MyWodDetailPage` para separar identidad, datos deportivos,
   ejercicios, resultados y acciones de gestion, conservando toda la logica
   existente de API, confirmacion y navegacion.
5. Ajustar los estilos especificos de Mis WODs en `frontend/src/index.css` para
   reforzar superficies, divisores, jerarquia de metricas, accion destructiva,
   responsive desde 320 px y foco visible.
6. Actualizar los tests de ambas paginas para cubrir los nuevos destinos de
   gestion, estados privados/vacios/errores, orden de datos, confirmacion y
   ausencia de regresiones en eliminar.
7. Ejecutar `npm test`, `npm run lint`, `npm run build`, `git diff --check` y el
   detector mecanico de Impeccable una vez sobre los targets finales.
8. Revisar el diff contra `main`, completar las tasks verificadas, crear un
   commit selectivo de #81 y documentar la Issue sin cerrarla ni hacer push.

## Decisiones

- No se crea una nueva capa ni un componente generico: las dos paginas ya
  representan superficies distintas y la reutilizacion existente es suficiente.
- El nombre sigue siendo el enlace de consulta; `Editar` es un enlace secundario
  visible y `Eliminar WOD` permanece solo en el detalle para reducir borrados
  accidentales.
- No se anaden filtros ni ordenaciones del lado cliente, porque no estan en el
  contrato ni en el alcance de #81.
- Se conservan los textos y patrones de estado globales; los cambios de copy se
  limitaran a mejorar la orientacion de esta superficie.
- Se usara CSS existente porque el frontend no declara Tailwind como dependencia
  y las specs anteriores establecen `index.css` como mecanismo local.

## Riesgos y controles

- **Regresion de contratos:** no cambiar imports API, argumentos, schemas,
  router ni payloads; mantener tests existentes de llamadas y navegacion.
- **Borrado accidental:** conservar el boton solo en detalle, el dialogo nativo,
  foco inicial, Escape, disabled durante la peticion y error 409.
- **Perdida de estados:** preservar las ramas de privado, carga, vacio, error,
  red, resultados, exito y reintento.
- **Overflow en movil:** usar `min-width: 0`, wrapping, grid responsive y
  acciones apilables desde 320 px.
- **Jerarquia visual confusa:** reservar naranja para orientacion/acciones y
  rojo para la accion destructiva, siempre con texto y affordance explicitos.

## Verificacion de alcance

El diff esperado queda limitado a:

- `frontend/src/pages/MyWodsPage.tsx`.
- `frontend/src/pages/MyWodDetailPage.tsx`.
- `frontend/src/pages/MyWodsPage.test.tsx`.
- `frontend/src/pages/MyWodDetailPage.test.tsx`.
- `frontend/src/index.css`.
- `specs/081-redisenar-gestion-mis-wods/spec.md`.
- `specs/081-redisenar-gestion-mis-wods/plan.md`.
- `specs/081-redisenar-gestion-mis-wods/tasks.md`.

No se esperan cambios en backend, base de datos, API, schemas, router,
dependencias ni archivos untracked existentes.
