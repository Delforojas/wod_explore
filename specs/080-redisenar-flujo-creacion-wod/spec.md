# SDD - Issue #80: Redisenar flujo de creacion de WOD

## Estado

Spec de implementacion frontend para mejorar la experiencia visual y de
interaccion del formulario existente de creacion de WODs. La rama de trabajo es
`feat/080-redisenar-flujo-creacion-wod`, derivada de `main`, que ya contiene las
dependencias funcionales de las Issues #46, #72 y #79.

La implementacion se limita a la superficie compartida
`frontend/src/components/UserWodForm.tsx` en modo creacion y a sus estilos y
tests. El modo edicion reutiliza el mismo componente, por lo que debe conservar
su comportamiento sin crear una segunda implementacion.

## Objetivo

Convertir la creacion de un WOD en un flujo operativo claro: primero se define la
sesion, despues se construye una secuencia visible de movimientos y finalmente
se revisa y guarda una configuracion valida. La interfaz debe comunicar que
esta ocurriendo, que falta y cual es la siguiente accion sin depender de
decoracion.

## Contexto tecnico

`CreateWodPage` delega la pantalla a `UserWodForm mode="create"`. El formulario
mantiene estado local para nombre, tipo, nivel, limite, rondas, ejercicios,
prescripciones, errores y guardado. El selector usa el `<dialog>` nativo y
consulta `getExercises`; el guardado usa `createUserWod`. El mismo componente
se utiliza en `EditWodPage` con `updateUserWod` y un WOD precargado.

El contrato vigente esta definido por `userWodCreateRequestSchema`,
`userWodUpdateRequestSchema` y los tipos derivados de `schemas.ts`. La matriz de
prescripciones de #72 es normativa: `WEIGHT` usa `REPS + KG`,
`WEIGHT_DISTANCE` usa `KG + METERS`, y las demas mediciones conservan sus
unidades actuales.

## Alcance

### Incluido

- Reorganizar visualmente la cabecera, el bloque de datos generales, la lista de
  movimientos y la revision lateral o inferior.
- Hacer evidente el paso actual y la jerarquia entre estructura del WOD,
  ejercicios, prescripciones y guardado.
- Mejorar la lectura de las filas de ejercicios, sus posiciones, acciones y
  unidades sin cambiar sus datos.
- Mantener y hacer mas claro el selector nativo de ejercicios, su busqueda,
  paginacion, carga, vacio, error y reintento.
- Mantener acciones reales para anadir, subir, bajar, eliminar, cerrar y guardar.
- Mantener errores junto al campo, `aria-invalid`, `aria-describedby` y foco en
  el primer error.
- Mantener borrador en memoria ante errores recuperables, guardado pendiente y
  respuesta de API.
- Mantener responsive desde 320 px, targets de al menos 44 px, focus visible,
  labels y orden de lectura por teclado.
- Ajustar tests de comportamiento para cubrir la nueva jerarquia observable y
  los estados relevantes sin acoplarlos a detalles de CSS.

### Excluido

- Cambiar `POST` o `PUT /api/user-wods`, sus payloads, schemas, unidades o reglas
  de validacion.
- Cambiar `getExercises`, `createUserWod`, `updateUserWod`, autenticacion,
  persistencia, backend, base de datos, router o dependencias.
- Anadir capacidades de negocio, drag and drop, persistencia de borradores o
  nuevas prescripciones.
- Redisenar `MyWodsPage`, `MyWodDetailPage`, el catalogo global u otras paginas.
- Alterar `DESIGN.md`; se reutilizaran sus tokens y patrones actuales.
- Introducir Tailwind, una libreria de componentes, una libreria de dialogos o
  un sistema global de estado.

## Requisitos funcionales

### RF-1 - Flujo operativo

La pantalla muestra una secuencia comprensible de trabajo: identidad del WOD,
configuracion general, movimientos, revision y accion principal. El nombre de la
sesion y la accion de guardado tienen prioridad sobre copy secundario.

### RF-2 - Datos generales

Nombre, estructura, nivel, limite y rondas conservan sus labels, tipos, valores,
campos condicionales y mensajes de validacion. La interfaz debe explicar cuando
un campo es opcional u obligatorio sin modificar las reglas existentes.

### RF-3 - Movimientos y prescripciones

Los ejercicios seleccionados se presentan como una secuencia ordenada y densa.
Cada fila mantiene nombre, categoria, tipo de medicion, posicion, prescripciones
compatibles y acciones de subir, bajar y eliminar. Las unidades deben permanecer
adyacentes a sus valores y los errores deben localizarse en su campo.

### RF-4 - Selector de ejercicios

El selector continua siendo un `<dialog>` nativo con titulo accesible, cierre,
busqueda, resultados paginados, estados de carga/vacio/error y botones de anadir.
Cerrar el selector no altera el formulario ni sus valores.

### RF-5 - Estados de formulario

El formulario comunica estado privado, validacion, guardado, error de API/red y
exito mediante los componentes globales existentes. Mientras se guarda, se evita
el envio duplicado y se conserva el contenido visible. Un error recuperable no
borra nombre, ejercicios ni prescripciones.

### RF-6 - Responsive y accesibilidad

Desde 320 px el flujo mantiene orden logico, no produce overflow horizontal y
permite completar todas las acciones. Los controles tienen focus visible,
targets utilizables, labels asociados y navegacion completa por teclado. El
dialogo y la navegacion movil no deben tapar el control enfocado.

## Criterios de aceptacion

- [ ] El flujo de creacion se comprende rapidamente sin depender de decoracion.
- [ ] Los datos generales, ejercicios, prescripciones y guardado tienen
  jerarquia visual diferenciada.
- [ ] Anadir, eliminar y ordenar ejercicios son acciones faciles de localizar.
- [ ] Las unidades y prescripciones son faciles de interpretar y conservan la
  matriz vigente del contrato.
- [ ] Las validaciones aparecen junto al campo y el foco llega al primer error.
- [ ] Los estados de carga, error, exito y selector son visibles y comprensibles.
- [ ] El formulario conserva los datos ante errores recuperables y bloquea
  envios duplicados durante el guardado.
- [ ] La accion principal tiene prioridad adecuada frente a acciones secundarias.
- [ ] La pantalla funciona sin overflow evitable desde 320 px, en tablet y en
  escritorio.
- [ ] Todos los controles pueden utilizarse con teclado y tienen nombres
  accesibles.
- [ ] La creacion y la edicion siguen usando el mismo componente sin regresiones.
- [ ] No cambian contratos, endpoints, datos, persistencia, router ni
  dependencias.
- [ ] Tests, lint y build pasan.

## Referencias

- Issue #80: Redisenar flujo de creacion de WOD.
- `docs/constitution.md`.
- `PRODUCT.md`.
- `AGENTS.md`.
- `frontend/AGENTS.md`.
- `DESIGN.md`.
- `frontend/src/components/UserWodForm.tsx`.
- `frontend/src/pages/CreateWodPage.tsx`.
- `frontend/src/pages/EditWodPage.tsx`.
- `frontend/src/pages/CreateWodPage.test.tsx`.
- `frontend/src/pages/EditWodPage.test.tsx`.
- `frontend/src/api/client.ts`.
- `frontend/src/api/schemas.ts`.
- `specs/043-diseno-wods-personalizados/spec.md`.
- `specs/046-crear-wods/spec.md`.
- `specs/048-editar-wods-personalizados/spec.md`.
- `specs/072-multiple-exercise-prescriptions/spec.md`.
- `specs/076-redefinir-sistema-visual-global-shell-layout/spec.md`.
- `specs/078-redisenar-catalogo-wods/spec.md`.
- `specs/079-redisenar-detalle-wod-rendimiento/spec.md`.
