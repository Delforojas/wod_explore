# Tareas — Spec 002

- [x] T1. Ampliar la lógica de filtrado para soportar búsqueda por nombre.
  (RF-1, RF-2, RF-3, RF-4)
  Hecho cuando:
  - la búsqueda ignora mayúsculas/minúsculas;
  - una búsqueda vacía o con espacios no limita resultados;
  - las coincidencias parciales funcionan;
  - una búsqueda sin resultados devuelve una lista vacía;
  - existen tests para todos estos casos.

- [x] T2. Combinar búsqueda con los filtros de tipo existentes.
  (RF-5, RF-6, RF-7)
  Hecho cuando:
  - búsqueda y filtro de tipo pueden aplicarse simultáneamente;
  - `All` mantiene el comportamiento esperado;
  - cambiar el tipo no elimina el texto de búsqueda;
  - existen tests de combinaciones entre búsqueda y filtros.

- [x] T3. Crear el componente `WodSearch` e integrarlo en el catálogo.
  (RF-1, RF-3, RF-4)
  Hecho cuando:
  - existe un campo de búsqueda visible;
  - el valor está controlado por React;
  - escribir actualiza los resultados del catálogo;
  - el estado vacío existente se muestra cuando no hay coincidencias;
  - el control tiene etiqueta accesible;
  - existen tests del comportamiento principal.

- [x] T4. Implementar persistencia de favoritos en `localStorage`.
  (RF-16, RF-17, RF-18, RF-19)
  Hecho cuando:
  - existe una única clave `wod-explorer:favorites`;
  - los favoritos se almacenan como IDs de WOD;
  - los datos recuperados se validan;
  - JSON corrupto o estructura inválida no rompe la aplicación;
  - se eliminan IDs duplicados;
  - se eliminan IDs que no corresponden a WODs existentes;
  - existen tests de almacenamiento válido, vacío, corrupto e inválido.

- [ ] T5. Crear la lógica reutilizable de favoritos.
  (RF-8, RF-9, RF-10, RF-12)
  Hecho cuando:
  - se puede comprobar si un WOD es favorito;
  - se puede añadir un favorito;
  - se puede eliminar un favorito;
  - no se generan duplicados;
  - cada cambio se persiste en `localStorage`;
  - la lógica no depende de componentes visuales;
  - existen tests para añadir, eliminar y consultar favoritos.

- [ ] T6. Crear `FavoriteButton` e integrarlo en las tarjetas de WOD.
  (RF-8, RF-9, RF-10, RF-11)
  Hecho cuando:
  - cada WOD puede marcarse y desmarcarse como favorito;
  - el botón refleja visualmente su estado;
  - utiliza un elemento `<button>`;
  - tiene un `aria-label` descriptivo;
  - puede utilizarse mediante teclado;
  - no accede directamente a `localStorage`;
  - existen tests para ambos estados.

- [ ] T7. Añadir vista o filtro de favoritos al catálogo.
  (RF-13, RF-14, RF-15)
  Hecho cuando:
  - el usuario puede mostrar únicamente sus WODs favoritos;
  - la búsqueda sigue funcionando dentro de favoritos;
  - los filtros de tipo siguen siendo compatibles con favoritos;
  - si no hay favoritos se muestra un estado vacío específico;
  - los WODs favoritos mantienen acceso a su detalle;
  - existen tests del filtro y del estado vacío.

- [ ] T8. Compartir el estado de favoritos con el detalle de WOD si la arquitectura actual lo permite sin duplicación.
  (RF-8, RF-10, RF-15)
  Hecho cuando:
  - el detalle refleja el mismo estado de favorito que el catálogo;
  - marcar o desmarcar desde el detalle actualiza el catálogo;
  - no existe un segundo estado independiente de favoritos;
  - no se añade Context global salvo necesidad técnica justificada;
  - existen tests si se modifica el comportamiento del detalle.

- [ ] T9. Revisión responsive y de accesibilidad de búsqueda y favoritos.
  (RNF-6, RNF-7, RNF-8)
  Hecho cuando:
  - búsqueda, filtros y favoritos funcionan correctamente en móvil y escritorio;
  - todos los controles principales son utilizables mediante teclado;
  - los estados de foco son visibles;
  - los botones de favorito tienen nombre accesible;
  - la UI mantiene la jerarquía visual de la Spec 001;
  - no se introducen nuevas funcionalidades.

- [ ] T10. Completar la cobertura de tests de la Spec 002.
  (RF-1..RF-19)
  Hecho cuando:
  - existen tests para búsqueda;
  - existen tests para búsqueda + filtros;
  - existen tests para favoritos;
  - existen tests para `localStorage`;
  - existen tests para estados vacíos;
  - existen tests para los componentes principales nuevos;
  - no se testean detalles internos innecesarios;
  - todos los tests pasan.

- [x] T11. Validación final de la Spec 002 y actualización del README.
  (Todos)
  Hecho cuando:
  - todos los RF están implementados;
  - todos los RNF están satisfechos;
  - la búsqueda funciona sola y combinada con filtros;
  - los favoritos pueden añadirse y eliminarse;
  - los favoritos persisten tras recargar;
  - `localStorage` inválido no rompe la aplicación;
  - `npm test` pasa;
  - `npm run lint` pasa;
  - `npm run build` pasa;
  - TypeScript no presenta errores;
  - el README documenta búsqueda y favoritos;
  - la demo manual funciona correctamente.
