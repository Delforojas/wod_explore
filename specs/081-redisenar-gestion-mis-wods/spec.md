# SDD - Issue #81: Redisenar gestion de Mis WODs

## Estado

Spec de implementacion frontend para convertir Mis WODs en una superficie de
gestion clara para los WODs personalizados del usuario autenticado. La rama de
trabajo es `feat/081-redisenar-gestion-mis-wods`, derivada de `main`, que ya
contiene las capacidades de listado, edicion y eliminacion de las Issues #47,
#48 y #49.

La implementacion se limita a las composiciones existentes de
`MyWodsPage` y `MyWodDetailPage`, sus tests de comportamiento y los estilos
locales de `frontend/src/index.css`.

## Objetivo

Hacer que una persona identifique, compare y gestione sus WODs personalizados
sin ambiguedad: el listado debe funcionar como archivo operativo y el detalle
debe presentar las acciones de consulta, edicion y eliminacion con una
jerarquia segura.

## Contexto tecnico

`MyWodsPage` consulta `getUserWods` y, para mostrar el numero real de ejercicios,
consulta en paralelo `getUserWod` para cada resumen. `MyWodDetailPage` consulta
`getUserWod`, reutiliza `WodResultsPanel`, navega a edicion y ejecuta
`deleteUserWod` despues de una confirmacion nativa. `StateMessage` concentra los
estados privado, carga, vacio, error, red y exito.

Los contratos vigentes son `userWodPageSchema` y `userWodDetailSchema` en
`frontend/src/api/schemas.ts`. No se anadiran campos, endpoints ni operaciones.

## Alcance

### Incluido

- Reorganizar el encabezado de Mis WODs para identificar el archivo personal,
  su cantidad y la accion de crear.
- Convertir cada WOD en una fila de gestion escaneable con nombre, formato,
  nivel, ejercicios, fecha y destinos explicitos de ver, editar y eliminar.
- Mantener la navegacion por fila/enlace real, paginacion, carga paralela de
  detalles, aislamiento autenticado y todos los estados existentes.
- Reorganizar el detalle personal en una cabecera de gestion, un manifiesto de
  sesion, la secuencia de ejercicios y el panel de resultados.
- Diferenciar visualmente la consulta, la edicion y la eliminacion; la accion
  destructiva estara disponible en la zona de acciones de cada fila y requerira
  confirmacion.
- Mantener el dialogo nativo, foco, Escape, estados de borrado, error 409,
  feedback de exito y navegacion existentes.
- Ajustar estilos locales con los tokens de `DESIGN.md`, sin sombras,
  gradientes, tarjetas decorativas ni nuevos colores.
- Mantener responsive desde 320 px, wrapping, foco visible, targets adecuados,
  headings semanticos, enlaces reales y navegacion por teclado.
- Ampliar tests de comportamiento para cubrir las acciones de gestion, los
  estados y la preservacion de contratos.

### Excluido

- Cambiar API, schemas, endpoints, ownership, autorizacion o persistencia.
- Anadir operaciones CRUD, filtros, ordenaciones o metricas nuevas.
- Modificar backend, base de datos, router, autenticacion o dependencias.
- Redisenar Crear WOD, el catalogo global, resultados u otras paginas.
- Eliminar la confirmacion o cambiar la politica de WODs con resultados
  historicos.
- Crear un sistema global de componentes o migrar a Tailwind.

## Requisitos funcionales

### RF-1 - Archivo personal

La pantalla identifica "Mis WODs" como un archivo personal y permite reconocer
rapidamente cada WOD mediante sus datos reales: nombre, tipo, nivel, limite o
rondas, cantidad de ejercicios y fecha. El estado vacio conserva una accion
clara para crear el primer WOD.

### RF-2 - Gestion de filas

Cada WOD tiene un destino principal para consultar el detalle, una accion
secundaria para editarlo y una accion destructiva para eliminarlo. Los enlaces
son reales, tienen nombres accesibles y el borrado solo se ejecuta despues de
confirmar.

### RF-3 - Detalle gestionable

El detalle muestra la identidad y los datos deportivos antes de los metadatos,
mantiene ejercicios y prescripciones en el orden de la API y presenta Editar
y Eliminar WOD como acciones diferenciadas. El borrado conserva confirmacion,
estado de carga, bloqueo de duplicados, errores y feedback posterior.

### RF-4 - Estados y privacidad

Sin JWT no se realizan peticiones y se muestra la superficie privada. Carga,
vacio, error de API, error de red, WOD no disponible, resultados y eliminacion
usan los componentes y mensajes globales existentes sin revelar datos de otra
cuenta.

### RF-5 - Responsive y accesibilidad

Desde 320 px las filas y el detalle se reorganizan sin overflow horizontal
evitable. La lectura sigue un orden logico, los controles mantienen foco visible
y targets de al menos 44 px, y las acciones se pueden completar con teclado.

## Criterios de aceptacion

- [ ] Los WODs propios se identifican y gestionan facilmente.
- [ ] Las acciones de ver, editar y eliminar tienen una jerarquia clara.
- [ ] Cada fila de WOD personal muestra `Ver WOD`, `Editar` y `Eliminar` en su
  zona de acciones.
- [ ] La accion destructiva se distingue y no compite con la consulta habitual.
- [ ] Empty, loading, error y confirmaciones siguen el sistema global.
- [ ] La interfaz sigue `DESIGN.md`.
- [ ] Funciona correctamente desde 320 px, tablet y escritorio.
- [ ] Teclado y foco siguen funcionando.
- [ ] No existen regresiones funcionales en listado, detalle, edicion, resultados
  o eliminacion.
- [ ] El borrado del listado pide confirmacion, evita dobles envios, actualiza el
  archivo sin recarga manual y conserva la fila cuando la API falla.
- [ ] Tests, lint y build pasan.

## Referencias

- Issue #81: Redisenar gestion de Mis WODs.
- `docs/constitution.md`.
- `PRODUCT.md`.
- `AGENTS.md`.
- `frontend/AGENTS.md`.
- `DESIGN.md`.
- `frontend/src/pages/MyWodsPage.tsx`.
- `frontend/src/pages/MyWodDetailPage.tsx`.
- `frontend/src/pages/MyWodsPage.test.tsx`.
- `frontend/src/pages/MyWodDetailPage.test.tsx`.
- `frontend/src/components/StateMessage.tsx`.
- `frontend/src/api/client.ts`.
- `frontend/src/api/schemas.ts`.
- `specs/047-mis-wods/spec.md`.
- `specs/048-editar-wods-personalizados/spec.md`.
- `specs/049-eliminar-wods-personalizados/spec.md`.
- `specs/076-redefinir-sistema-visual-global-shell-layout/spec.md`.
- `specs/079-redisenar-detalle-wod-rendimiento/spec.md`.
