# Frontend de WOD Explorer

El frontend es una aplicación React con TypeScript estricto y Vite. Consume la
API REST del backend para autenticación, catálogos, resultados, historial y
estadísticas. No utiliza datos JSON locales ni `localStorage` como fuentes activas
de esas funcionalidades.

## Stack real

- React 19.2.8.
- TypeScript 6.0.2 en modo estricto.
- Vite 8.2.2.
- Zod 4.6.4 para validar respuestas de la API.
- Vitest 5.0.0 para tests.
- ESLint 10 para lint.
- CSS propio en `src/index.css`.

El proyecto no declara React Router, Tailwind CSS ni Testing Library como
dependencias. La navegación se implementa con un router hash local y los tests
actuales usan Vitest directamente.

## Requisitos

- Node.js y npm.
- Backend disponible en `http://localhost:8080` o una URL compatible.
- Una sesión válida para las rutas protegidas de la API.

## Instalación y desarrollo

Desde `frontend/`:

```bash
npm install
npm run dev
```

Vite mostrará la URL local, normalmente `http://localhost:5173`.

## Configuración de API

El origen se configura mediante `VITE_API_URL`. Si no se define, el cliente usa:

```text
http://localhost:8080/api
```

Ejemplo para iniciar Vite contra otro backend:

```bash
VITE_API_URL=http://localhost:8080/api npm run dev
```

El JWT se guarda durante la sesión del navegador en `sessionStorage` con la clave
`wod-explorer.jwt`. No se guarda en `localStorage` ni se muestra en la interfaz.

## Rutas

El router de `src/app/router.ts` usa `window.location.hash`:

- `#/`: inicio.
- `#/login`: inicio de sesión.
- `#/register`: registro.
- `#/wods`: catálogo de WODs.
- `#/wods/:id`: detalle de WOD.
- `#/exercises`: catálogo de ejercicios.
- `#/exercises/:id`: detalle de ejercicio.
- `#/history`: historial autenticado.
- `#/statistics`: estadísticas y evolución.

## Organización

- `src/api/`: cliente HTTP, contratos Zod y tipos derivados.
- `src/auth/`: contexto, sesión y operaciones de autenticación.
- `src/app/`: router hash local.
- `src/pages/`: vistas de inicio, auth, catálogos, resultados, historial y
  estadísticas.
- `src/components/`: layout y estados de carga, error y vacío.
- `src/index.css`: estilos responsive y dirección visual del producto.

## API consumida

El cliente centralizado en `src/api/client.ts` consume:

- `POST /api/users` y `POST /api/auth/login`.
- `GET /api/users/me`, `/history`, `/statistics` y `/evolution`.
- `GET /api/wods` y `GET /api/wods/{id}`.
- `GET /api/exercises` y `GET /api/exercises/{id}`.
- Operaciones de resultados WOD en `/api/wods/{wodId}/results`.
- Operaciones de resultados de ejercicios en
  `/api/exercises/{exerciseId}/results` y `/best`.

Las respuestas se validan con Zod antes de llegar a las páginas. Las rutas
protegidas envían `Authorization: Bearer <token>` y muestran estados de carga,
error, respuesta vacía o sesión expirada según corresponda.

Favoritos no están disponibles en el frontend actual. La especificación histórica
de favoritos locales se conserva en `specs/002-search-favorites/` y no debe
interpretarse como una funcionalidad API implementada.

## Comandos

```bash
npm test
npm run lint
npm run build
```

`npm run build` ejecuta la comprobación TypeScript y genera el bundle Vite.
