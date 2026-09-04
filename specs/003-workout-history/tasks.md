# Tareas — Spec 003

- [x] T1. Crear schema Zod y tipos TypeScript para el historial.

  (RF-4, RF-5, RF-10, RF-12, RF-26, RNF-3, RNF-4, RNF-5)

  Hecho cuando:

  - existe un schema para una entrada individual;

  - existe un schema para el array completo del historial;

  - los tipos TypeScript se derivan del schema cuando sea razonable;

  - se validan `id`, `wodId`, `date`, `result` y `notes`;

  - existen tests para registros válidos e inválidos;

  - no se utiliza `any`.

- [x] T2. Implementar validación y normalización de fechas, resultado y notas.

  (RF-5, RF-6, RF-7, RF-8, RF-9, RF-10, RF-11, RF-12, RF-13)

  Hecho cuando:

  - se acepta la fecha de hoy;

  - se aceptan fechas anteriores;

  - se rechazan fechas futuras;

  - se rechazan fechas inválidas;

  - la fecha actual puede inyectarse para tests;

  - `result` y `notes` se normalizan con `trim()`;

  - valores vacíos o solo con espacios se convierten en ausencia de valor;

  - existen tests para todos estos casos.

- [x] T3. Implementar la lógica pura para crear registros de entrenamiento.

  (RF-1, RF-2, RF-3, RF-4)

  Hecho cuando:

  - se puede crear una entrada para un WOD existente;

  - cada entrada obtiene un ID independiente del `wodId`;

  - se usa `crypto.randomUUID()` o una alternativa nativa equivalente;

  - el mismo WOD puede registrarse varias veces;

  - el mismo WOD puede registrarse varias veces el mismo día;

  - la lógica no depende de React;

  - existen tests de creación e IDs.

- [ ] T4. Implementar almacenamiento del historial en `localStorage`.

  (RF-23, RF-24, RF-25, RF-26, RF-27, RF-28)

  Hecho cuando:

  - existe una única clave `wod-explorer:workout-history`;

  - almacenamiento inexistente devuelve un array vacío;

  - JSON válido se recupera correctamente;

  - JSON corrupto no rompe la aplicación;

  - estructuras inválidas no rompen la aplicación;

  - los datos recuperados se validan con Zod;

  - registros con `wodId` inexistente se conservan sin provocar errores;

  - los componentes visuales no acceden directamente a `localStorage`;

  - existen tests de persistencia y recuperación.

- [ ] T5. Implementar orden y eliminación del historial.

  (RF-16, RF-19, RF-20, RF-21, RF-22)

  Hecho cuando:

  - el historial se ordena de más reciente a más antiguo;

  - el orden no muta el array original;

  - varias entradas con la misma fecha mantienen un orden estable;

  - se puede eliminar una entrada por su `id`;

  - eliminar una entrada no elimina el WOD;

  - eliminar una entrada no afecta a otros registros del mismo WOD;

  - eliminar un ID inexistente no rompe la aplicación;

  - existen tests para orden y eliminación.

- [ ] T6. Crear la lógica reutilizable de historial para React.

  (RF-2, RF-19, RF-22, RF-23, RF-25)

  Hecho cuando:

  - existe una API reutilizable para cargar el historial;

  - se puede añadir una entrada;

  - se puede eliminar una entrada;

  - los cambios se persisten;

  - se expone el historial ordenado;

  - no se duplica la lógica de `localStorage`;

  - no existe lógica visual dentro de esta capa;

  - existen tests cuando corresponda.

- [ ] T7. Crear `WorkoutLogForm` e integrarlo en el detalle de WOD.

  (RF-1, RF-5, RF-6, RF-7, RF-8, RF-9, RF-10, RF-12)

  Hecho cuando:

  - desde un WOD existente se puede abrir o utilizar el formulario;

  - la fecha por defecto es la fecha local actual;

  - el usuario puede seleccionar una fecha anterior;

  - una fecha futura muestra error y no guarda;

  - resultado y notas son opcionales;

  - los campos tienen etiquetas accesibles;

  - el formulario funciona mediante teclado;

  - guardar un registro válido actualiza el historial;

  - existen tests del formulario.

- [ ] T8. Crear la página de historial y añadir navegación.

  (RF-14, RF-15, RF-16, RF-17, RF-18)

  Hecho cuando:

  - existe la ruta `/history`;

  - la navegación principal permite acceder a Historial;

  - se muestran todas las entradas ordenadas;

  - cada entrada muestra nombre del WOD, fecha y tipo;

  - se muestra resultado cuando existe;

  - se muestran notas cuando existen;

  - si no hay entradas aparece un estado vacío específico;

  - los WODs existentes permiten navegar a su detalle;

  - no se realizan peticiones de red.

- [ ] T9. Integrar eliminación de registros en la interfaz.

  (RF-19, RF-20, RF-21, RF-22)

  Hecho cuando:

  - cada entrada puede eliminarse individualmente;

  - la interfaz se actualiza inmediatamente;

  - el cambio se persiste en `localStorage`;

  - otros registros permanecen intactos;

  - los favoritos no se modifican;

  - el WOD original no se modifica;

  - el control de eliminación es accesible mediante teclado;

  - existen tests del comportamiento.

- [ ] T10. Gestionar registros asociados a WODs inexistentes.

  (RF-18, RF-28)

  Hecho cuando:

  - un registro con `wodId` inexistente no rompe el historial;

  - el registro puede seguir mostrándose;

  - la UI indica que el WOD ya no está disponible;

  - no se genera un enlace a un detalle inexistente;

  - el registro no se elimina silenciosamente;

  - existen tests para este escenario.

- [ ] T11. Revisión responsive y de accesibilidad del historial.

  (RNF-7, RNF-8, RNF-9)

  Hecho cuando:

  - formulario e historial funcionan correctamente en móvil y escritorio;

  - todos los controles principales funcionan mediante teclado;

  - los estados de foco son visibles;

  - los errores son comprensibles;

  - la jerarquía visual es coherente con las Specs 001 y 002;

  - no se añaden funcionalidades nuevas.

- [ ] T12. Completar la cobertura de tests y regresión.

  (RF-1..RF-28, RNF-10, RNF-11)

  Hecho cuando:

  - existen tests para schema;

  - existen tests para fechas;

  - existen tests para creación;

  - existen tests para orden;

  - existen tests para eliminación;

  - existen tests para `localStorage`;

  - existen tests para el formulario;

  - existen tests para el historial;

  - existen tests para WODs inexistentes;

  - los tests existentes de catálogo, búsqueda y favoritos siguen pasando;

  - no se testean detalles internos innecesarios.

- [ ] T13. Validación final de la Spec 003 y actualización del README.

  (Todos)

  Hecho cuando:

  - todos los RF están implementados;

  - todos los RNF están satisfechos;

  - se puede registrar un WOD;

  - se puede registrar el mismo WOD varias veces;

  - las fechas futuras se rechazan;

  - resultado y notas opcionales funcionan;

  - existe historial ordenado;

  - se pueden eliminar registros;

  - el historial persiste tras recargar;

  - `localStorage` inválido no rompe la aplicación;

  - los WODs inexistentes se gestionan correctamente;

  - búsqueda y favoritos siguen funcionando;

  - `npm test` pasa;

  - `npm run lint` pasa;

  - `npm run build` pasa;

  - TypeScript no presenta errores;

  - el README documenta el historial de entrenamientos;

  - la demo manual funciona en móvil y escritorio.
