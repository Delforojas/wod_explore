# WOD Explorer

WOD Explorer es una aplicacion web estatica para consultar WODs y ejercicios de
CrossFit. El MVP utiliza exclusivamente datos locales en JSON y no requiere
backend, autenticacion, base de datos ni APIs externas.

## Stack

- React 19
- TypeScript en modo estricto
- Vite
- Tailwind CSS
- React Router
- Zod
- Vitest y Testing Library

## Instalacion

Requiere Node.js y npm.

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Vite mostrara la URL local para abrir la aplicacion en el navegador.

## Tests

```bash
npm test
```

La suite cubre validacion de datos, filtros, busqueda de WODs, estados vacios y
de error, catalogos, detalle y navegacion.

## Build

```bash
npm run build
```

Tambien estan disponibles `npm run lint` para revisar el codigo y el tipado
TypeScript se comprueba durante el build.

## Funcionalidades del MVP

- Consulta de WODs desde `src/data/wods.json`.
- Filtros por `All`, `For Time`, `AMRAP` y `EMOM`.
- Vista de detalle de cada WOD.
- Catalogo de ejercicios por categoria.
- Navegacion interna entre Inicio, WODs y Ejercicios.
- Estados vacios y errores controlados.
- Interfaz responsive y accesible mediante teclado.

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
  lib/          Carga, validacion y utilidades
  pages/        Paginas y vistas de rutas
  schemas/      Schemas de validacion Zod
  types/        Tipos TypeScript
tests/          Tests de logica, datos y componentes
```
