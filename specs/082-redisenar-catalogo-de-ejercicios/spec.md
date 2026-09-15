# SDD - Issue #82: Redisenar catalogo de Ejercicios

## Estado

Spec de implementacion frontend para convertir el catalogo de Ejercicios en una
superficie deportiva rapida de consultar, comparar y explorar. La rama de
trabajo es `feat/082-redisenar-catalogo-ejercicios`, derivada de `main` tras la
integracion de la Issue #81.

## Contexto

`ExercisesPage` ya consulta ejercicios paginados mediante `getExercises`, filtra
por nombre al enviar un formulario, muestra estados globales y navega a
`#/exercises/:id`. Cada resultado ya dispone de nombre, categoria y tipo de
medicion en `exercisePageSchema`. La pagina conserva una composicion heredada
que necesita una jerarquia mas operativa y una lectura mas densa.

La Issue #82 solicita aplicar `DESIGN.md` a esta superficie sin crear una
identidad visual independiente ni cambiar el contrato funcional.

## Objetivo

Hacer que una persona localice y compare movimientos con rapidez: el encabezado
debe orientar, la busqueda debe ser evidente, y cada fila debe comunicar nombre,
categoria y medicion como datos tecnicos distinguibles en movil, tablet y
escritorio.

## Alcance

### Incluido

- Reorganizar `ExercisesPage` como indice deportivo con encabezado, busqueda,
  contexto de resultados, listado y paginacion.
- Mostrar nombre, identificador, categoria y tipo de medicion con jerarquia
  escaneable y etiquetas textuales.
- Mantener la busqueda por nombre submit-driven, su consulta aplicada y la
  paginacion existente.
- Mantener estados privado, carga, vacio, error, error de red y reintento.
- Mantener enlaces reales a `#/exercises/:id` y los nombres accesibles.
- Ajustar estilos especificos del catalogo en `frontend/src/index.css` usando
  tokens y patrones de `DESIGN.md`.
- Cubrir con tests los estados, busqueda, paginacion y datos visibles cuando el
  cambio de composicion los afecte.

### Excluido

- Nuevos ejercicios, categorias, filtros, ordenaciones, metricas o busquedas.
- Cambios en API, schemas, payloads, endpoints, backend, base de datos,
  autenticacion, persistencia, router o dependencias.
- Redisenar el detalle de ejercicio, otros catalogos, shell u otras paginas,
  salvo reglas CSS locales estrictamente necesarias.
- Migrar a Tailwind, crear componentes globales nuevos o introducir iconos,
  imagenes, fuentes externas, sombras, gradientes o una direccion visual paralela.

## Requisitos funcionales

### RF-1 - Contexto y busqueda

La pagina identifica claramente el catalogo de ejercicios, muestra la cantidad
de movimientos cuando la respuesta existe y conserva un formulario con label
asociado, input de busqueda y submit explicito. La consulta aplicada se
distingue del texto que el usuario aun esta editando.

### RF-2 - Resultados comparables

Cada ejercicio muestra nombre, identificador, categoria y tipo de medicion de
forma distinguible. Cada fila completa sigue siendo un enlace real al detalle y
el contenido puede leerse sin depender unicamente del color.

### RF-3 - Estados y paginacion

Se conservan los estados privado, carga, vacio, error y error de red mediante
los componentes globales actuales. El reintento vuelve a solicitar los datos y
la paginacion mantiene pagina, `hasNext`, `totalPages`, botones, disabled durante
carga y callbacks existentes.

### RF-4 - Integridad del contrato

La pagina sigue llamando a `getExercises(token, { name: appliedQuery }, { page,
size })`, sin modificar tipos Zod ni valores recibidos de la API.

## Requisitos no funcionales

### RNF-1 - Responsive

Desde 320 px no existe overflow horizontal evitable. La busqueda se apila en
movil y las filas reorganizan sus metadatos en una secuencia logica; tablet y
escritorio aprovechan el ancho disponible sin cortar nombres largos.

### RNF-2 - Accesibilidad

Se mantienen HTML semantico, label asociado, enlaces reales, foco visible,
`aria-live` en resultados dinamicos, contraste suficiente, targets de al menos
44 px y navegacion completa mediante teclado.

### RNF-3 - Consistencia visual

Se reutilizan superficies oscuras, bordes, divisores, sans-serif, naranja
funcional y tokens de `DESIGN.md`. Las filas continuas prevalecen sobre cards
ornamentales y la densidad favorece la consulta deportiva.

### RNF-4 - Calidad

Deben pasar `npm test`, `npm run lint`, `npm run build` y `git diff --check`.

## Criterios de aceptacion

- Los ejercicios pueden localizarse y compararse rapidamente.
- Categoria y tipo de medicion se reconocen con claridad.
- Busqueda y controles existentes siguen funcionando.
- La densidad visual es adecuada para un catalogo deportivo.
- La pantalla sigue `DESIGN.md`.
- No existe overflow horizontal evitable desde 320 px.
- Teclado y foco funcionan correctamente.
- No existen regresiones funcionales.
- Tests, lint y build pasan.

## Referencias

- Issue #82: Redisenar catalogo de Ejercicios para consulta deportiva.
- `docs/constitution.md`.
- `PRODUCT.md`.
- `AGENTS.md`.
- `frontend/AGENTS.md`.
- `DESIGN.md`.
- `frontend/src/pages/ExercisesPage.tsx`.
- `frontend/src/pages/ExercisesPage.test.tsx`.
- `frontend/src/api/client.ts`.
- `frontend/src/api/schemas.ts`.
- `frontend/src/components/PaginationControls.tsx`.
- `frontend/src/components/StateMessage.tsx`.
- `specs/032-mejorar-descubrimiento-catalogos/spec.md`.
- `specs/039-estilo-catalogo-ejercicios/spec.md`.
- `specs/076-redefinir-sistema-visual-global-shell-layout/spec.md`.
