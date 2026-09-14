# Spec 002 — Búsqueda y favoritos locales

## Contexto y objetivo

WOD Explorer ya permite consultar WODs y ejercicios desde datos locales.

La siguiente evolución del proyecto permitirá encontrar entrenamientos más

rápidamente y guardar WODs favoritos en el navegador, manteniendo la aplicación

completamente frontend y sin backend.

El objetivo es mejorar la usabilidad del catálogo sin introducir cuentas,

base de datos ni servicios externos.

## Usuarios

Los mismos usuarios definidos en la Spec 001: personas interesadas en CrossFit

que consultan WODs y ejercicios desde una aplicación web pública.

No habrá registro ni autenticación.

## Historias de usuario

- H1: Como usuario quiero buscar WODs por nombre para encontrar rápidamente

  un entrenamiento concreto.

- H2: Como usuario quiero combinar búsqueda y filtro por tipo para reducir

  los resultados del catálogo.

- H3: Como usuario quiero marcar WODs como favoritos para poder encontrarlos

  fácilmente más adelante.

- H4: Como usuario quiero consultar únicamente mis WODs favoritos.

- H5: Como usuario quiero que mis favoritos se mantengan al cerrar y volver

  a abrir el navegador.

## Requisitos funcionales

### Búsqueda de WODs (H1)

- RF-1: CUANDO el usuario introduzca texto en el campo de búsqueda,

  EL SISTEMA mostrará únicamente los WODs cuyo nombre coincida parcial o

  totalmente con la búsqueda.

- RF-2: LA búsqueda ignorará diferencias entre mayúsculas y minúsculas.

- RF-3: CUANDO el campo de búsqueda esté vacío,

  EL SISTEMA mostrará nuevamente todos los WODs compatibles con los demás

  filtros activos.

- RF-4: SI ningún WOD coincide con la búsqueda,

  ENTONCES EL SISTEMA mostrará el estado vacío correspondiente.

### Búsqueda combinada con filtros (H2)

- RF-5: CUANDO exista simultáneamente un texto de búsqueda y un filtro de tipo,

  EL SISTEMA aplicará ambas condiciones.

- RF-6: EL filtro `All` no limitará los resultados por tipo.

- RF-7: AL cambiar el filtro de tipo, EL SISTEMA conservará el texto de

  búsqueda actual.

### Favoritos (H3)

- RF-8: CADA WOD permitirá marcarse como favorito.

- RF-9: CUANDO un WOD no favorito sea marcado,

  EL SISTEMA lo añadirá a favoritos.

- RF-10: CUANDO un WOD favorito sea desmarcado,

  EL SISTEMA lo eliminará de favoritos.

- RF-11: EL estado visual de favorito deberá indicar claramente si el WOD

  está marcado o no.

- RF-12: MARCAR o desmarcar un favorito no deberá modificar los archivos JSON

  del proyecto.

### Vista de favoritos (H4)

- RF-13: EL SISTEMA proporcionará una forma de consultar únicamente los WODs

  marcados como favoritos.

- RF-14: SI no existen favoritos,

  ENTONCES EL SISTEMA mostrará un estado vacío específico.

- RF-15: LOS favoritos continuarán permitiendo acceder al detalle del WOD.

### Persistencia local (H5)

- RF-16: LOS identificadores de los WODs favoritos se almacenarán en

  `localStorage`.

- RF-17: CUANDO la aplicación se cargue,

  EL SISTEMA recuperará los favoritos almacenados previamente.

- RF-18: SI los datos almacenados en `localStorage` son inválidos,

  EL SISTEMA deberá recuperarse sin romper la aplicación.

- RF-19: SOLO podrán considerarse favoritos identificadores correspondientes

  a WODs existentes.

## Requisitos no funcionales

- RNF-1: La aplicación continuará siendo completamente frontend.

- RNF-2: No se añadirá backend, base de datos ni autenticación.

- RNF-3: TypeScript continuará en modo estricto.

- RNF-4: No se utilizará `any` salvo justificación explícita.

- RNF-5: La lógica de búsqueda y favoritos deberá mantenerse separada de los

  componentes visuales cuando sea razonable.

- RNF-6: Los controles de búsqueda y favoritos deberán ser accesibles mediante

  teclado.

- RNF-7: Los estados de favorito deberán tener etiquetas accesibles.

- RNF-8: La interfaz continuará siendo responsive y mobile-first.

- RNF-9: `npm test`, `npm run lint` y `npm run build` deberán finalizar sin

  errores.

## Casos límite

- Búsqueda vacía.

- Búsqueda compuesta únicamente por espacios.

- Búsqueda sin resultados.

- Búsqueda con mayúsculas/minúsculas diferentes.

- Filtro y búsqueda sin resultados combinados.

- Ningún WOD marcado como favorito.

- WOD eliminado posteriormente de los datos pero todavía presente en

  `localStorage`.

- `localStorage` vacío.

- `localStorage` con datos corruptos o formato incorrecto.

- Marcar varias veces el mismo WOD como favorito.

## Fuera de alcance

La Spec 002 NO incluye:

- cuentas de usuario

- sincronización entre dispositivos

- backend

- base de datos

- API externa

- creación de WODs

- edición de WODs

- historial de entrenamientos

- marcas personales

- rankings

- estadísticas

- recomendaciones

- inteligencia artificial

## Criterios de finalización

La Spec 002 se considerará completada cuando:

1. Se puedan buscar WODs por nombre.

2. La búsqueda pueda combinarse con los filtros existentes.

3. Los WODs puedan marcarse y desmarcarse como favoritos.

4. Exista una vista o filtro para consultar favoritos.

5. Los favoritos persistan mediante `localStorage`.

6. Los datos inválidos de `localStorage` no rompan la aplicación.

7. Los controles sean accesibles mediante teclado.

8. Existan tests para búsqueda, favoritos y persistencia.

9. `npm test` pase.

10. `npm run lint` pase.

11. `npm run build` pase.

## Nota de transición arquitectónica

Esta Spec describe la etapa histórica de búsqueda y favoritos locales, sin cuentas
ni backend. Sus requisitos funcionales y su modelo de `localStorage` se conservan
como registro de diseño original y no se reescriben aquí.

La arquitectura operativa posterior usa autenticación JWT, API REST y MySQL para
las funcionalidades migradas. Los favoritos de esta Spec no están disponibles en
el frontend actual hasta que se defina e implemente su contrato autenticado en una
Issue posterior.
