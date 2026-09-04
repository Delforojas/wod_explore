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
historial de entrenamientos, persistencia local, estados vacíos y de error,
catálogos, detalle y navegación.

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
- Registro de WODs realizados desde su vista de detalle.
- Fecha local actual o anterior, con rechazo de fechas futuras e inválidas.
- Resultado y notas opcionales para cada entrenamiento.
- Historial ordenado de los entrenamientos más recientes a los más antiguos.
- Eliminación individual de registros sin modificar el WOD ni sus favoritos.
- Catálogo de ejercicios por categoría.
- Navegación interna entre Inicio, WODs, Ejercicios e Historial.
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

## Historial de entrenamientos

Desde el detalle de un WOD se puede registrar un entrenamiento realizado indicando
su fecha, un resultado opcional y notas opcionales. La fecha propuesta es la fecha
local actual; también se permiten fechas anteriores, pero no fechas futuras ni
fechas inválidas. Los campos de texto se recortan y los valores vacíos no se
guardan.

El historial está disponible en `/history`. Sus entradas muestran el nombre y tipo
del WOD, la fecha, el resultado y las notas cuando existen. Cada registro es
independiente, por lo que el mismo WOD puede registrarse varias veces, incluso el
mismo día. Las entradas se ordenan desde la más reciente a la más antigua y pueden
eliminarse individualmente.

El historial se guarda en el navegador mediante `localStorage`, usando la clave
estable `wod-explorer:workout-history`. Solo se almacena el `wodId` junto con los
datos del registro, no una copia completa del WOD. Al cargar la aplicación, los
datos se validan con Zod; si el JSON está corrupto, tiene una estructura inválida,
IDs duplicados o fechas no válidas, se recupera un historial vacío sin romper la
aplicación. Si un WOD ya no existe en el catálogo, su registro se conserva y se
indica que no está disponible, sin crear un enlace inexistente.

## Rutas

- `/`: Inicio y catalogo de WODs.
- `/wods`: catalogo de WODs.
- `/wods/:id`: detalle de un WOD.
- `/exercises`: catalogo de ejercicios.
- `/history`: historial local de entrenamientos.

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
