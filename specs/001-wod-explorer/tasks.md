# Tareas — Spec 001

- [x] T1. Esqueleto del proyecto: React + TypeScript + Tailwind, estructura `src/`, `tests/` y scripts básicos configurados.  

  (RF: —)  

  Hecho cuando: `npm run build` y `npm run lint` se ejecutan sin errores.

- [x] T2. Datos locales: crear `wods.json` y `exercises.json` con datos de ejemplo válidos.

  (RF-14, RF-15)  

  Hecho cuando: ambos archivos existen, contienen datos coherentes y pueden importarse desde la aplicación.

- [x] T3. Schemas y validación con Zod para WODs y ejercicios.

  (RF-16, RF-17)  

  Hecho cuando: los datos válidos pasan la validación y los datos inválidos producen un error controlado.

- [x] T4. Catálogo de WODs: mostrar todos los WODs mediante componentes reutilizables.

  (RF-1, RF-2, RF-3)  

  Hecho cuando: se muestran los WODs disponibles y existe estado vacío si no hay datos.

- [x] T5. Filtros de WODs: `All`, `For Time`, `AMRAP` y `EMOM`.

  (RF-4, RF-5, RF-6, RF-7)  

  Hecho cuando: cada filtro muestra únicamente los WODs correspondientes y el estado sin resultados funciona.

- [x] T6. Detalle de WOD: implementar navegación y vista `/wods/:id`.

  (RF-8, RF-9, RF-10)  

  Hecho cuando: un WOD existente muestra toda su información y un ID inexistente muestra un estado de error controlado.

- [x] T7. Catálogo de ejercicios: mostrar ejercicios y sus categorías.

  (RF-11, RF-12, RF-13)  

  Hecho cuando: se muestran nombre, categoría y descripción de cada ejercicio.

- [x] T8. Navegación principal: Inicio, WODs y Ejercicios.

  (RF-18, RF-19)  

  Hecho cuando: el usuario puede navegar entre las páginas sin peticiones a backend ni recargas innecesarias.

- [x] T9. Responsive, UI y accesibilidad.

  (RNF-2, RNF-4, RNF-5)  

  Hecho cuando: la interfaz funciona correctamente en móvil y escritorio, utiliza HTML semántico y los controles principales son accesibles mediante teclado.

- [x] T10. Tests de lógica, datos y componentes principales.

  (RF-1..RF-19)  

  Hecho cuando: existen tests para validación de JSON, filtros, búsqueda de WOD, estados vacíos y componentes principales.

- [x] T11. Validación final de la Spec 001 + README breve.

  (Todos)  

  Hecho cuando:

  - cada requisito funcional está implementado;

  - los tests pasan;

  - `npm run lint` pasa;

  - `npm run build` pasa;

  - no hay errores de TypeScript;

  - la demo manual funciona en móvil y escritorio.
