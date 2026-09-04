# WOD Explorer

WOD Explorer es una aplicación web estática para consultar WODs y ejercicios de
CrossFit. El MVP utiliza exclusivamente datos locales en JSON y no requiere
backend, autenticación, base de datos ni APIs externas.

## Stack

- React 19
- TypeScript en modo estricto
- Vite
- Tailwind CSS
- React Router
- Zod
- Vitest y Testing Library

## Instalación

Requiere Node.js y npm.

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Vite mostrará la URL local para abrir la aplicación en el navegador.

## Tests

```bash
npm test
```

La suite cubre validación de datos, filtros, búsqueda de WODs, favoritos,
persistencia local, estados vacíos y de error, catálogos, detalle y navegación.

## Build

```bash
npm run build
```

También está disponible `npm run lint` para revisar el código. El tipado
TypeScript se comprueba durante el build.

## Funcionalidades del MVP

- Consulta de WODs desde `src/data/wods.json`.
- Búsqueda por nombre con coincidencias parciales, exactas y sin distinguir mayúsculas.
- Combinación de búsqueda con los filtros `All`, `For Time`, `AMRAP` y `EMOM`.
- Marcado y desmarcado de favoritos desde las tarjetas y el detalle de cada WOD.
- Filtro `Solo favoritos`, compatible con búsqueda y filtros de tipo.
- Vista de detalle de cada WOD con acceso desde los favoritos.
- Catálogo de ejercicios por categoría.
- Navegación interna entre Inicio, WODs y Ejercicios.
- Estados vacíos diferenciados y errores controlados.
- Interfaz responsive y accesible mediante teclado.

## Favoritos locales

Los favoritos se guardan en el navegador mediante `localStorage`, usando la
clave estable `wod-explorer:favorites`. Solo se almacenan los identificadores
de los WODs, nunca los objetos completos.

Al recuperar los datos, la aplicación valida el contenido, elimina IDs
duplicados y descarta IDs que ya no existan en el catálogo. Si el almacenamiento
está vacío, corrupto o tiene una estructura inválida, la aplicación continúa
funcionando y utiliza una lista vacía.

## Rutas

- `/`: Inicio y catalogo de WODs.
- `/wods`: catalogo de WODs.
- `/wods/:id`: detalle de un WOD.
- `/exercises`: catalogo de ejercicios.

## Estructura basica

```text
src/
  components/   Componentes de interfaz reutilizables
  data/         Datos locales JSON
  hooks/        Estado reutilizable de React
  lib/          Carga, validación y utilidades
  pages/        Páginas y vistas de rutas
  schemas/      Schemas de validación Zod
  types/        Tipos TypeScript
tests/          Tests de lógica, datos y componentes
```
