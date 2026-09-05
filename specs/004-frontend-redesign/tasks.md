# Tareas — Spec 004

- [ ] T1. Auditoría visual inicial con Impeccable.
  (RF: todos los requisitos visuales de la spec)
  Hecho cuando:
  - se revisa el frontend actual antes de modificarlo;
  - se identifican problemas de jerarquía, spacing, tipografía, consistencia, navegación, responsive y accesibilidad;
  - se identifican patrones visuales genéricos o de baja calidad detectados por `impeccable`;
  - se documentan los principales hallazgos y prioridades de rediseño;
  - no se modifica funcionalidad;
  - no se modifica código todavía.

- [ ] T2. Definir y aplicar el sistema visual base.
  (RF: consistencia global)
  Hecho cuando:
  - existe una jerarquía tipográfica coherente;
  - existe un sistema consistente de spacing;
  - botones, inputs, cards y estados interactivos comparten lenguaje visual;
  - colores, bordes, radios y sombras son consistentes;
  - se utilizan patrones Tailwind reutilizables;
  - no se modifica lógica funcional;
  - `impeccable` no detecta problemas graves en el sistema visual base.

- [x] T3. Rediseñar layout global y navegación principal.
  (RF-1)
  Hecho cuando:
  - la navegación principal tiene una jerarquía clara;
  - indica correctamente la sección activa;
  - funciona en móvil y escritorio;
  - mantiene las rutas existentes;
  - funciona mediante teclado;
  - tiene focus visible;
  - no provoca recargas completas;
  - el layout global mantiene ancho y spacing consistentes.

- [x] T4. Rediseñar la página de inicio.
  (RF-2)
  Hecho cuando:
  - el propósito de WOD Explorer se entiende rápidamente;
  - existe una jerarquía clara entre título, descripción y acciones;
  - se facilita el acceso a WODs e historial;
  - el diseño evita apariencia de dashboard genérico;
  - funciona correctamente en móvil, tablet y escritorio;
  - no se añaden funcionalidades nuevas.

- [x] T5. Rediseñar catálogo, WodCard, búsqueda y filtros.
  (RF-3, RF-4, RF-5)
  Hecho cuando:
  - el catálogo es fácil de escanear;
  - `WodCard` presenta claramente nombre, tipo, nivel, estructura y acciones;
  - búsqueda y filtros forman un grupo visual coherente;
  - el estado activo de los filtros es claro;
  - favoritos mantienen sus estados activo/inactivo;
  - el grid responde correctamente a distintos tamaños;
  - búsqueda, filtros y favoritos mantienen exactamente su comportamiento actual;
  - no existe overflow horizontal.

- [x] T6. Rediseñar la página de detalle del WOD.
  (RF-6)
  Hecho cuando:
  - el WOD es el elemento visual protagonista;
  - nombre, tipo, nivel, estructura, ejercicios y descripción tienen jerarquía clara;
  - favorito y registro de entrenamiento se presentan como acciones claras;
  - `WorkoutLogForm` mantiene su lógica actual;
  - la página funciona correctamente en móvil y escritorio;
  - no se modifica la lógica de negocio.

- [x] T7. Rediseñar el catálogo de ejercicios.
  (RF-7)
  Hecho cuando:
  - cada ejercicio muestra claramente nombre, categoría y descripción;
  - las categorías se reconocen sin depender únicamente del color;
  - el catálogo mantiene una composición consistente con el catálogo de WODs;
  - el grid es responsive;
  - no se modifica la estructura de `exercises.json`.

- [x] T8. Rediseñar historial y formulario de entrenamiento.
  (RF-8)
  Hecho cuando:
  - el historial prioriza lectura cronológica;
  - WOD, fecha, tipo, resultado y notas son fáciles de identificar;
  - la acción de eliminación se percibe como secundaria;
  - registros asociados a WODs inexistentes siguen siendo comprensibles;
  - `WorkoutLogForm` tiene labels, spacing, inputs y errores visualmente consistentes;
  - historial y formulario funcionan correctamente en móvil y escritorio;
  - no se modifica la lógica de historial.

- [x] T9. Unificar estados vacíos y estados de error.
  (RF-9)
  Hecho cuando:
  - todos los estados vacíos utilizan un lenguaje visual consistente;
  - búsqueda sin resultados, favoritos vacíos e historial vacío se distinguen correctamente;
  - los estados de error son comprensibles;
  - no se depende únicamente del color;
  - se reutilizan componentes existentes cuando sea razonable;
  - no se añaden funcionalidades nuevas.

- [x] T10. Revisión global responsive.
  (RF-10 y requisitos no funcionales)
  Hecho cuando:
  - se revisan al menos móvil pequeño, móvil, tablet y escritorio;
  - navegación funciona en todos los tamaños;
  - grids se adaptan correctamente;
  - formularios son utilizables;
  - no existe overflow horizontal accidental;
  - controles y textos no se cortan;
  - las áreas interactivas tienen tamaño adecuado;
  - los layouts conservan jerarquía en pantallas pequeñas.

- [x] T11. Revisión global de accesibilidad.
  (RF-10 y requisitos no funcionales)
  Hecho cuando:
  - headings mantienen una estructura lógica;
  - controles principales son utilizables mediante teclado;
  - focus es visible;
  - labels están correctamente asociados;
  - botones tienen nombres accesibles;
  - contraste es suficiente;
  - los estados no dependen únicamente del color;
  - el rediseño no introduce regresiones de accesibilidad.

- [x] T12. Auditoría final con Impeccable.
  (Todos)
  Hecho cuando:
  - se revisa el frontend completo usando `impeccable`;
  - se revisan jerarquía, spacing, tipografía, composición, navegación, responsive y accesibilidad;
  - se identifican posibles patrones genéricos o visualmente débiles;
  - se corrigen los hallazgos relevantes dentro del alcance de la spec;
  - no se introducen funcionalidades nuevas;
  - `DESIGN.md` sigue siendo respetado.

- [ ] T13. Regresión funcional y validación técnica.
  (RF-10)
  Hecho cuando:
  - catálogo de WODs funciona;
  - filtros funcionan;
  - búsqueda funciona;
  - favoritos funcionan;
  - persistencia de favoritos funciona;
  - detalle de WOD funciona;
  - catálogo de ejercicios funciona;
  - registro de entrenamientos funciona;
  - historial funciona;
  - eliminación funciona;
  - registros de WOD inexistente siguen funcionando;
  - `npm test` pasa;
  - `npm run lint` pasa;
  - `npm run build` pasa;
  - TypeScript no presenta errores.

- [ ] T14. Validación final de la Spec 004 y actualización del README.
  (Todos)
  Hecho cuando:
  - todos los requisitos de rediseño están satisfechos;
  - el diseño respeta `DESIGN.md`;
  - `impeccable` se ha utilizado como referencia principal;
  - todas las funcionalidades existentes siguen funcionando;
  - móvil, tablet y escritorio han sido revisados;
  - accesibilidad ha sido revisada;
  - no se han modificado los JSON de datos;
  - no se ha añadido backend ni base de datos;
  - no se han añadido funcionalidades fuera de alcance;
  - `npm test` pasa;
  - `npm run lint` pasa;
  - `npm run build` pasa;
  - el README refleja la nueva dirección visual cuando corresponda.
