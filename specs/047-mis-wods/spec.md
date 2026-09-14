# SDD - Issue #47: Crear seccion Mis WODs

## Estado

Spec de implementacion frontend para consultar los WODs personalizados del
usuario autenticado. La rama de trabajo es `feat/047-mis-wods`, derivada de
`main` despues de integrar las Issues #45 y #46.

La implementacion consumira unicamente la API existente de `/api/user-wods` y
no modificara backend, esquema, autenticacion ni persistencia.

## Objetivo

Permitir que un usuario autenticado consulte sus WODs personalizados, abra el
detalle de cualquiera de ellos y revise ejercicios y prescripciones en el orden
que devuelve la API, sin exponer recursos de otras cuentas.

## Alcance

### Incluido

- Nueva ruta hash `#/my-wods` para el listado autenticado.
- Nueva ruta hash `#/my-wods/:id` para el detalle autenticado.
- Acceso persistente a "Mis WODs" desde la navegacion desktop y movil.
- Listado paginado con nombre, tipo, nivel, rondas o duracion y cantidad de
  ejercicios.
- Detalle con metadatos, ejercicios ordenados y prescripciones con unidades.
- CTA para crear el primer WOD desde el estado vacio.
- Estados de privacidad, carga, vacio, error y reintento.
- Schemas Zod, cliente API y tests de comportamiento.

### Excluido

- Crear, editar o eliminar WODs; crear corresponde a #46 y editar/eliminar a
  Issues posteriores.
- Cambios en endpoints, DTOs backend, esquema MySQL o autenticacion.
- Filtros adicionales, resultados, estadisticas o calculos nuevos.
- Nuevas dependencias o persistencia local.

## Contrato API

- `GET /api/user-wods?page=0&size=20` devuelve `PageResponse<UserWodSummaryResponse>`.
- `GET /api/user-wods/{id}` devuelve `UserWodDetailResponse` con ejercicios y
  prescripciones.
- Ambas rutas requieren JWT y el backend filtra por el propietario del token.
- El resumen actual no incluye `exerciseCount`. Para cumplir el requisito de
  mostrar la cantidad sin inventar campos ni modificar backend, la pagina
  consultara en paralelo el detalle de cada resumen recibido y derivara el
  conteo de `exercises.length`. Un error de esos detalles se presenta como error
  de carga del listado, sin revelar informacion adicional.

## Decisiones de experiencia

- La etiqueta visible sera "Mis WODs" y la ruta tecnica sera `my-wods`.
- El listado usara filas editoriales enlazadas, no botones con navegacion
  manual, para conservar teclado, apertura en nueva pestana y foco nativo.
- El detalle reutilizara la composicion de detalle existente, pero tendra una
  lista propia de prescripciones porque el detalle global no contiene ese
  contrato.
- Los valores se formatearan con `Intl.NumberFormat("es-ES")`; las fechas con
  `Intl.DateTimeFormat("es-ES")`.
- El detalle mostrara el orden del array recibido por la API y no reordenara
  datos en el cliente.

## Estados y accesibilidad

- Sin token: superficie privada con enlace a iniciar sesion y sin peticiones.
- Carga: mensaje explicito para listado y detalle.
- Vacio: mensaje accionable con enlace `#/create-wod`.
- Error: mensaje seguro con reintento, sin exponer ownership ni datos ajenos.
- Listas semanticas, headings jerarquicos, enlaces reales, `time`, `data`, foco
  visible, `aria-live` para estados y targets tactiles de al menos 44px.
- Layout mobile-first desde 320px, con wrapping de nombres, metadatos y
  prescripciones, sin overflow horizontal evitable.

## Criterios de aceptacion

- [ ] El usuario autenticado puede acceder a "Mis WODs" desde la navegacion.
- [ ] El listado muestra solo los WODs devueltos para el usuario autenticado.
- [ ] Cada fila muestra nombre, tipo, rondas o duracion cuando corresponde y
  numero de ejercicios.
- [ ] Cada fila permite abrir el detalle del WOD.
- [ ] El detalle conserva el orden de ejercicios recibido por la API.
- [ ] El detalle muestra valores y unidades de todas las prescripciones.
- [ ] El estado vacio ofrece una accion clara para crear el primer WOD.
- [ ] Listado y detalle muestran carga comprensible.
- [ ] Los errores se muestran con el patron existente sin pantalla rota ni
  informacion de otras cuentas.
- [ ] Un WOD ajeno o inexistente no aparece ni puede abrirse mediante el flujo.
- [ ] Las rutas funcionan en movil y escritorio sin overflow evitable.
- [ ] Las rutas funcionan con teclado y tecnologias de asistencia basicas.
- [ ] Los tests cubren datos, vacio, navegacion, orden, prescripciones, carga,
  errores y aislamiento por usuario.

## Referencias

- Issue #47: Crear seccion Mis WODs.
- Issue #45: API para WODs personalizados de usuario.
- Issue #46: Crear interfaz para WODs personalizados.
- `DESIGN.md`.
- `frontend/src/pages/HistoryPage.tsx`.
- `frontend/src/pages/WodDetailPage.tsx`.
- `frontend/src/api/client.ts`.
- `frontend/src/api/schemas.ts`.
