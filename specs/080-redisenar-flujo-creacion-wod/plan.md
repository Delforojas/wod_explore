# Plan - Issue #80: Redisenar flujo de creacion de WOD

## Estrategia

Mejorar la superficie existente sin cambiar su contrato funcional. La
composicion seguira en `UserWodForm`, porque crea y edita con la misma lista de
ejercicios, matriz de prescripciones, validacion y estados. Se conservara CSS
local en `frontend/src/index.css`, ya que el proyecto no declara Tailwind y #80
no autoriza una migracion de estilos.

## Secuencia

1. Crear una especificacion de superficie que traduzca los criterios de #80 a
   estados, jerarquia, interacciones, responsive y accesibilidad verificables.
2. Inspeccionar el formulario actual, sus contratos, estados y tests para
   identificar cambios visuales sin alterar el payload ni las reglas de dominio.
3. Reorganizar el markup de `UserWodForm` en bloques semanticos: cabecera de
   tarea, configuracion del WOD, secuencia de movimientos, revision y acciones.
4. Mejorar la exposicion de labels, campos condicionales, posiciones,
   prescripciones, acciones por fila y accion principal manteniendo los mismos
   handlers y estado local.
5. Mantener el `<dialog>` nativo del selector y pulir sus estados, cierre,
   busqueda, paginacion y feedback sin cambiar las llamadas API.
6. Reescribir unicamente los estilos especificos de creacion en
   `frontend/src/index.css`, con una experiencia mobile-first desde 320 px,
   tablet y escritorio, focus visible, targets de 44 px y reduced motion.
7. Actualizar `CreateWodPage.test.tsx` y, si es necesario, los tests compartidos
   del formulario para cubrir jerarquia observable, errores, orden, estados,
   selector y conservacion del borrador; evitar assertions de CSS.
8. Ejecutar tests, lint, build, TypeScript, `git diff --check`, detector
   mecanico de Impeccable una sola vez sobre los targets finales y revision
   estatica de responsive/accesibilidad.
9. Revisar el diff contra `main`, marcar tasks solo cuando esten verificadas,
   crear un commit selectivo de #80 y documentar la Issue sin cerrarla ni hacer
   push.

## Decisiones

- No se crea un wizard con estado adicional: la secuencia se comunica mediante
  estructura visual y el estado local existente.
- No se anade drag and drop: ordenar continuara usando los botones de teclado y
  click existentes, que son mas accesibles y no cambian el modelo.
- No se guarda un borrador fuera de memoria: el producto no tiene un mecanismo
  establecido de persistencia de borradores.
- No se cambian las reglas de AMRAP, EMOM, FOR_TIME ni la matriz de unidades de
  #72; los textos de opcional/obligatorio solo hacen visibles esas reglas.
- No se modifica el modo edicion fuera de la apariencia compartida; su carga y
  `PUT` deben continuar pasando los mismos tests.

## Riesgos y controles

- **Regresion de edicion:** conservar `mode` e `initialWod`, ejecutar los tests de
  `EditWodPage` y comprobar que el formulario sigue precargando valores.
- **Perdida de prescripciones:** no reconstruir el estado desde DOM; mantener
  `selectedExercises` y sus handlers actuales.
- **Errores poco visibles:** conservar ids y relaciones ARIA, y probar validacion
  y foco sobre el primer campo invalido.
- **Overflow en filas:** usar grid/flex con `min-width: 0`, wrapping y reglas de
  colapso especificas para 320 px.
- **Dialogo inaccesible:** conservar elemento nativo, titulo, cierre por Escape,
  botones reales y estados live.

## Verificacion de alcance

El diff esperado queda limitado a:

- `frontend/src/components/UserWodForm.tsx`.
- `frontend/src/pages/CreateWodPage.test.tsx`.
- `frontend/src/index.css`.
- `specs/080-redisenar-flujo-creacion-wod/spec.md`.
- `specs/080-redisenar-flujo-creacion-wod/plan.md`.
- `specs/080-redisenar-flujo-creacion-wod/tasks.md`.

No se esperan cambios en API, schemas, router, backend, base de datos,
dependencias ni archivos untracked existentes.
