# SDD - Issue #62: Integrar favoritos autenticados en catalogo y detalle

## Estado

Planificacion inicial para la rama `feat/062-favoritos-catalogo-detalle`,
derivada de `main` despues de integrar la Issue #61. La Issue es exclusivamente
frontend y consume el contrato de favoritos autenticados definido en la Spec 026
y servido por el backend de la Issue #61.

## Objetivo

Permitir que una persona autenticada liste, marque, desmarque y filtre sus WODs
favoritos desde el catalogo, manteniendo exactamente el mismo estado al abrir el
detalle de un WOD.

## Alcance

- Añadir al cliente API y a los schemas Zod el contrato de favoritos de #26.
- Cargar los favoritos autenticados en memoria junto con el catalogo de WODs.
- Compartir una unica coleccion de IDs entre `WodsPage` y `WodDetailPage`.
- Añadir un boton accesible para marcar y desmarcar cada WOD.
- Añadir un filtro local de favoritos compatible con los filtros de nombre, tipo y
  nivel existentes, sin cambiar la peticion del catalogo.
- Gestionar carga, error, reintento, coleccion vacia y sesion caducada en español.
- Mantener la navegacion hash, el acceso al detalle y la responsive actual.
- Cubrir API, contexto, interacciones, estados y accesibilidad con tests.

## Fuera de alcance

- Cambios en backend, migraciones, base de datos o endpoints.
- Migracion o lectura de favoritos desde `localStorage` o `sessionStorage`.
- Favoritos compartidos, recomendaciones, rankings o notificaciones.
- React Router o una libreria global de estado.
- Cambios en la navegacion, el contrato de WODs o los filtros existentes fuera de
  la combinacion necesaria con favoritos.

## Contrato consumido

Todas las operaciones requieren el token de la sesion actual:

- `GET /api/users/me/favorites` devuelve una lista de `{ wodId, favoritedAt }`.
- `PUT /api/users/me/favorites/{wodId}` no tiene body y devuelve `204`.
- `DELETE /api/users/me/favorites/{wodId}` no tiene body y devuelve `204`.

Las respuestas se validaran en `frontend/src/api/schemas.ts`. El cliente existente
seguira gestionando `401` mediante `wod-explorer:session-expired`, y el contexto de
autenticacion limpiara el token y navegara a `#/login` como hasta ahora.

## Decisiones de estado

- `AuthContext` sera la unica fuente de estado en memoria para los IDs favoritos,
  porque ya persiste el token, conoce el ciclo de login/logout y permanece montado
  al cambiar entre catalogo y detalle.
- El contexto expondra la coleccion, el estado de carga/error, reintento y una
  accion de mutacion. No se añadira persistencia local ni un store externo.
- Al recibir un nuevo token se solicitara la coleccion actual; al cerrar sesion,
  caducar la sesion o cambiar de usuario se vaciara inmediatamente.
- Las operaciones PUT y DELETE no seran optimistas: el `Set` solo cambiara despues
  de una respuesta exitosa. Un error conservara el estado anterior y mostrara una
  recuperacion en español.
- Un fallo al cargar favoritos no impedira consultar WODs, pero deshabilitara los
  controles de favorito y el filtro hasta poder reintentar correctamente.
- El filtro `favoritesOnly` se aplicara sobre `catalog.items` despues de la
  respuesta de `getWods`; no añadira parametros ni endpoints nuevos.

## Decisiones de interfaz y accesibilidad

- `WodFavoriteButton` sera un `<button type="button">` real, con `aria-pressed`,
  nombre accesible que indique marcar o quitar y estado disabled/loading durante
  la mutacion.
- El enlace al detalle y el boton de favorito no se anidaran como elementos
  interactivos. Ambos tendran foco visible y targets de al menos 44 px.
- El estado vacio de una coleccion sin favoritos se diferenciara del estado sin
  coincidencias por filtros. Los errores tendran accion de reintento cuando sea
  posible.
- Los textos visibles permaneceran en español y reutilizaran el lenguaje visual,
  tokens, tipografia y reglas de `frontend/src/index.css`.
- El layout conservara el orden mobile-first, wrapping de nombres largos y
  navegacion hash existente en movil, tablet y escritorio.

## Criterios de aceptacion

- [ ] Un usuario autenticado puede listar sus favoritos desde el catalogo.
- [ ] Marcar y desmarcar actualiza la API y el estado visible sin duplicados.
- [ ] El filtro de favoritos se combina con busqueda y filtros de tipo/nivel.
- [ ] El estado vacio de favoritos se distingue del estado sin coincidencias.
- [ ] El detalle de WOD refleja el mismo estado que el catalogo.
- [ ] Un error de API conserva el estado anterior y ofrece recuperacion en español.
- [ ] Un `401` reutiliza la expiracion de sesion existente.
- [ ] No se leen ni escriben favoritos en `localStorage` o `sessionStorage`.
- [ ] Los controles son botones reales, accesibles, enfocables y operables desde
  teclado y movil.
- [ ] `npm test`, `npm run lint` y `npm run build` pasan.
