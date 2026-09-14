# SDD - Issue #22: Actualizar la documentación del producto tras la migración a API

## Estado

Planificación validada. La implementación se realizará en la rama
`docs/022-product-documentation`, derivada de
`feat/021-frontend-api-integration`, porque la documentación debe describir el
estado entregado por la Issue #21.

## Objetivo

Establecer una descripción única y actualizada de WOD Explorer después de la
migración del frontend a la API REST, la incorporación de autenticación JWT y el
uso de MySQL como persistencia principal.

## Alcance

- Actualizar `PRODUCT.md` con el propósito, usuarios, arquitectura y estado
  funcional actuales.
- Actualizar el README raíz con requisitos, arranque, comandos, puertos,
  variables de entorno, rutas y arquitectura vigente.
- Sustituir el README scaffold de `frontend/` por documentación del frontend
  real y sus comandos disponibles.
- Documentar las rutas hash del frontend y los endpoints REST que consume.
- Identificar MySQL como fuente de verdad para catálogo, usuarios, resultados,
  historial, estadísticas y evolución.
- Documentar `sessionStorage` únicamente como almacenamiento de sesión JWT y
  `VITE_API_URL` como configuración del cliente.
- Identificar favoritos como no disponibles en la arquitectura actual.
- Añadir una nota de transición a las Specs 001, 002, 003 y 004 sin cambiar sus
  requisitos funcionales ni reescribir sus decisiones históricas.

## Criterios de aceptación

- Ninguno de los documentos principales afirma que el producto sea únicamente
  local o que funcione sin backend.
- Los comandos documentados existen en `frontend/package.json`, el wrapper
  Maven o Docker Compose, según corresponda.
- Se documentan los puertos `8080` del backend y `3307` de MySQL expuesto en
  local, así como el puerto interno `3306` de MySQL.
- Se documentan las variables necesarias sin incluir valores reales ni secretos:
  `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD`,
  `DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRATION` y
  `VITE_API_URL`.
- Las rutas frontend actuales y los endpoints REST existentes se describen sin
  inventar endpoints ni afirmar que existe `/api/health`.
- Se distingue entre endpoints públicos, endpoints protegidos y operaciones de
  catálogo que no forman parte de los flujos actuales del frontend.
- Se indica claramente que JSON histórico y `localStorage` no son fuentes activas
  de verdad para catálogo, resultados, historial ni estadísticas.
- Favoritos se documenta como pendiente y separado de las funcionalidades
  disponibles.
- Las notas añadidas a las Specs históricas explican la transición sin alterar
  sus requisitos originales.
- La documentación está escrita en español y no contiene secretos.

## Restricciones

- No modificar código frontend ni backend.
- No modificar esquema, datos ni scripts SQL.
- No implementar favoritos, roles, health checks, nuevas APIs ni cambios
  funcionales.
- No añadir dependencias.
- No eliminar ni reescribir requisitos de las Specs históricas.
- No incluir credenciales, tokens, contraseñas ni valores sensibles.
- Mantener el alcance limitado a la documentación solicitada por la Issue #22.

## Referencias técnicas

- `frontend/package.json` define `dev`, `build`, `lint`, `test` y `preview`.
- `frontend/src/app/router.ts` implementa el router hash local.
- `frontend/src/api/client.ts` define la base configurable, errores y llamadas
  REST.
- `frontend/src/api/schemas.ts` define los contratos Zod del frontend.
- `frontend/src/auth/AuthContext.tsx` mantiene el JWT en `sessionStorage` bajo
  `wod-explorer.jwt`.
- `backend/src/main/resources/application.properties` define la configuración
  externa de datasource y JWT.
- `backend/src/main/java/com/wodexplorer/controller/` define las rutas REST
  actuales.
- `docker-compose.yml` define los servicios `mysql` y `backend`, sus puertos,
  variables y dependencia de arranque.
- `DESIGN.md` describe la dirección visual ya aplicada, pero no define
  comportamiento funcional.

## Fuera de alcance

- Cambios en la aplicación o en sus contratos API.
- Migración o eliminación de los JSON históricos.
- Persistencia de favoritos en backend.
- Endpoint de salud o configuración de roles administrativos.
- Actualización de las Specs 005 en adelante salvo la documentación operativa
  estrictamente necesaria para describir el estado actual.
