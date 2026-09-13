# SDD - Issue #21: Integrar frontend con la API backend

## Estado

Planificación validada. La implementación se realizará en la rama
`feat/021-frontend-api-integration`, derivada de la rama publicada de Issue #20.

La Issue cubre la migración del frontend actual, que todavía es un scaffold con
un único catálogo de ejercicios, hacia los contratos REST ya implementados en el
backend. No se modificará el backend ni el esquema MySQL.

## Objetivo

Permitir que el usuario explore WODs y ejercicios, cree una cuenta, inicie
sesión, registre resultados y consulte su perfil, historial y estadísticas usando
la API REST real.

## Alcance

Se implementan estas superficies en el frontend:

- Inicio con navegación hacia las áreas principales.
- Registro y login contra `/api/users` y `/api/auth/login`.
- Gestión del JWT en `sessionStorage`; el token nunca se escribe en JSON,
  `localStorage` ni se incluye en la UI.
- Catálogo de ejercicios mediante `GET /api/exercises` y detalle mediante
  `GET /api/exercises/{id}`.
- Catálogo de WODs mediante `GET /api/wods` con filtros de nombre, tipo y nivel,
  y detalle mediante `GET /api/wods/{id}`.
- Registro y consulta de resultados WOD mediante
  `/api/wods/{wodId}/results`.
- Registro, consulta y mejor marca de ejercicios mediante
  `/api/exercises/{exerciseId}/results` y `/best`.
- Perfil e historial mediante `/api/users/me` y `/api/users/me/history`.
- Estadísticas y evolución mediante `/api/users/me/statistics` y
  `/api/users/me/evolution`.
- Estados de carga, error, vacío, sesión iniciada y sesión cerrada en móvil y
  escritorio.

La navegación será un router hash pequeño y local (`#/`, `#/wods`,
`#/wods/:id`, `#/exercises`, `#/exercises/:id`, `#/history`, `#/statistics`,
`#/login` y `#/register`) para evitar introducir una dependencia de routing en
este scaffold.

## Contratos y validación

Las respuestas externas se validarán en el cliente API con Zod y se convertirán
a tipos TypeScript derivados de los schemas. El cliente centralizará:

- URL configurable mediante `VITE_API_URL`, con `http://localhost:8080/api`
  como fallback de desarrollo.
- cabecera `Authorization: Bearer <token>` para rutas protegidas.
- interpretación de errores JSON del backend y mensajes de recuperación en
  español.
- redirección lógica a login cuando una petición protegida devuelve `401`.

Los DTOs respetarán exactamente los nombres camelCase del backend, incluyendo
los enums `FOR_TIME`, `AMRAP`, `EMOM`, `BEGINNER`, `INTERMEDIATE`, `RX`, las
unidades y los tipos de marca definidos por las APIs existentes.

## Identidad y persistencia

El registro y login no requieren JWT. El resto de operaciones protegidas usan el
token de la sesión actual. Cerrar sesión elimina el token de `sessionStorage` y
restablece la vista pública. No se mantendrán datos de catálogo, historial,
resultados o estadísticas en `localStorage`; la API es la única fuente de verdad
para esas funcionalidades.

## Criterios de aceptación

- [ ] El frontend consume ejercicios, WODs y detalles desde la API real.
- [ ] Registro y login funcionan desde la interfaz y muestran errores del API.
- [ ] Las peticiones protegidas incluyen el JWT de la sesión.
- [ ] El frontend permite registrar y consultar resultados WOD y de ejercicios.
- [ ] Perfil, historial, estadísticas y evolución usan sus endpoints reales.
- [ ] No quedan catálogos, historial ni resultados activos provenientes de JSON o
  `localStorage`.
- [ ] Las respuestas se validan y sus contratos TypeScript coinciden con el
  backend.
- [ ] Cada pantalla conserva estados de carga, error y vacío.
- [ ] La interfaz mantiene navegación por teclado, labels, foco visible y
  composición responsive.
- [ ] `npm test`, `npm run lint` y `npm run build` pasan; las verificaciones
  backend no requieren cambios porque el backend no se modifica.

## Fuera de alcance

- Cambios en controladores, servicios, entidades, esquema o datos MySQL.
- Refresh tokens, roles, recuperación de contraseña u OAuth.
- Persistencia offline, sincronización en segundo plano o caché global.
- Rankings, edición o eliminación de resultados.
- Nueva lógica de negocio para calcular marcas; se consume la respuesta de
  estadísticas del backend.
