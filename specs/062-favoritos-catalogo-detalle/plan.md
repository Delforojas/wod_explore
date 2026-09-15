# Plan - Issue #62: Integrar favoritos autenticados en catalogo y detalle

## Estrategia

Aplicar el cambio minimo sobre la arquitectura actual:
`API client + schemas -> AuthContext -> paginas/componentes`. El backend de #61
ya expone el contrato requerido y no se modificara. El contexto de autenticacion
mantendra la unica copia en memoria para evitar desincronizacion entre rutas hash.

## Fases

1. Añadir `favoriteWodSchema`, su tipo derivado y funciones de cliente para listar,
   añadir y eliminar favoritos con token, body vacio y respuestas `204`.
2. Extender `AuthContextValue`, `AuthProvider` y los utilitarios de test con el
   estado de favoritos, carga inicial por token, limpieza de sesion, reintento y
   mutaciones confirmadas por API.
3. Crear `WodFavoriteButton` como control semantico compartido, con labels
   accesibles, `aria-pressed`, estados disabled/loading y feedback de error.
4. Integrar el boton, el filtro `favoritesOnly`, sus estados vacios y la
   recuperacion en `WodsPage`, manteniendo los filtros y la paginacion existentes.
5. Integrar el mismo boton y los estados de favoritos en `WodDetailPage` sin
   duplicar la coleccion ni alterar el hash router.
6. Ajustar CSS del catalogo y detalle para la nueva accion sin anidar enlaces y
   botones, respetando 44 px, foco, wrapping y los breakpoints existentes.
7. Añadir tests de schemas/client, AuthContext, boton, catalogo y detalle para
   respuestas exitosas, duplicados, errores, 401, filtros, estados vacios y
   sincronizacion entre superficies.
8. Ejecutar `npm test`, `npm run lint` y `npm run build`, revisar el diff y
   comprobar manualmente responsive y accesibilidad antes del commit.

## Decisiones tecnicas

- Se usara `Set<number>` para membership O(1), siempre reemplazando la instancia
  al modificarla para que React detecte el cambio.
- El contexto cargara favoritos en un efecto dependiente del token y usara un
  contador de reintento para repetir solo la lectura fallida.
- Las mutaciones serializaran el estado por WOD mediante un conjunto de IDs
  pendientes para impedir submits duplicados sin bloquear otros WODs.
- Los errores de red usaran `getErrorStateKind`; los `401` seguiran el evento
  global existente y no añadiran una segunda redireccion.
- Los schemas Zod seran la fuente del tipo `FavoriteWod`; no se usara `any` ni se
  añadiran dependencias.
- El filtro sera local sobre los elementos de la pagina ya recibida, porque la
  Issue prohibe cambiar el endpoint de catalogo y la API no ofrece un filtro de
  favoritos. La UI comunicara el resultado visible sin inventar totales globales.

## Verificacion

- `npm test` desde `frontend/`.
- `npm run lint` desde `frontend/`.
- `npm run build` desde `frontend/`, incluyendo TypeScript estricto.
- `git diff --check` y `git status`.
- Revisar manualmente 320 px, tablet y escritorio, teclado, foco visible,
  labels, `aria-pressed`, errores y expiracion de sesion.
- Confirmar con busqueda en el codigo que favoritos no usan `localStorage` ni
  `sessionStorage`.
