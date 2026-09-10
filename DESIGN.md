# DESIGN.md — WOD Explorer

`DESIGN.md` define la dirección visual y de experiencia de usuario.

No define comportamiento funcional ni reglas de negocio.

## Objetivo visual

Crear un archivo editorial de entrenamiento para una aplicación de CrossFit.

El diseño debe transmitir:
- energía;
- rendimiento;
- claridad;
- sensación de producto moderno;
- buena legibilidad.

## Dirección visual

- Estética de publicación deportiva: papel, tinta, naranja de señal y reglas finas.
- Evitar apariencia genérica de dashboard empresarial y tarjetas uniformes.
- Jerarquía editorial con titulares de gran escala y filas técnicas escaneables.
- La interfaz debe sentirse como un archivo de sesiones, no como un panel de métricas.
- Espaciado consistente dentro de una composición asimétrica.
- Diseño mobile-first.

## Layout

La aplicación utiliza una arquitectura de archivo:

- rail de navegación lateral fijo en escritorio;
- navegación inferior fija en móvil;
- superficies full-width sin contenedor centrado convencional;
- Home como doble bloque asimétrico con un panel WOD dominante;
- catálogos como filas editoriales, no como grids uniformes de cards;
- filtros y búsqueda integrados en una franja de control;
- páginas de detalle e historial como documentos de lectura con reglas y columnas.

## Navegación

La navegación debe incluir las secciones existentes:

- Inicio
- WODs
- Ejercicios
- Historial
- Estadísticas cuando una spec futura lo defina

Debe funcionar correctamente en móvil y escritorio.

## Componentes

Mantener consistencia visual entre las piezas editoriales:

- WodCard y ExerciseCard presentados como filas técnicas.
- FavoriteButton
- WodSearch
- filtros
- formularios
- historial
- estados vacíos
- estados de error

## Responsive

Enfoque mobile-first.

Comprobar como mínimo:

- móvil;
- tablet;
- escritorio.

En móvil, el rail se convierte en una barra inferior y las columnas se apilan en
orden de lectura. Evitar overflow horizontal, texto cortado, controles pequeños y
grids rígidos.

## Accesibilidad

- HTML semántico.
- Contraste suficiente.
- Focus visible.
- Navegación mediante teclado.
- Labels asociados a formularios.
- Botones con nombres accesibles.
- No depender únicamente del color para comunicar estado.

## Tailwind CSS

Usar Tailwind CSS como sistema principal de estilos.

Priorizar:
- clases consistentes;
- responsive utilities;
- estados hover/focus;
- componentes reutilizables.

Evitar:
- estilos inline innecesarios;
- valores arbitrarios repetidos;
- duplicación de patrones.

## Restricciones

El rediseño no debe:

- romper funcionalidades existentes;
- modificar la lógica de negocio sin necesidad;
- cambiar los datos JSON;
- modificar la persistencia en localStorage;
- añadir backend;
- añadir base de datos;
- añadir APIs externas.

## Libertad de diseño

Se permite redefinir:

- layout;
- tipografía;
- spacing;
- cards;
- navegación;
- iconografía;
- jerarquía visual;
- presentación de filtros;
- presentación del historial;
- presentación de estadísticas.

Siempre respetando PRODUCT.md, AGENTS.md y las specs activas.

## Prioridad de criterios de diseño

Para cualquier trabajo relacionado con UI, layout, responsive, jerarquía visual,

composición, spacing, tipografía o accesibilidad:

1. Utiliza `impeccable` como skill principal de referencia.

2. Usa `web-design-guidelines` como apoyo para UX, accesibilidad y revisión general.

3. Usa `tailwind-css-patterns` para implementar los estilos de forma consistente.

4. Usa `vercel-react-best-practices` y `vercel-composition-patterns` para mantener

   una buena estructura de componentes React.

Cuando existan varias soluciones visuales válidas, prioriza la recomendación de

`impeccable`, siempre que no contradiga:

- `PRODUCT.md`;

- `AGENTS.md`;

- `docs/constitution.md`;

- la spec activa;

- las restricciones definidas en este `DESIGN.md`.

## Uso principal de Impeccable

`impeccable` es la skill principal para definir, revisar y refinar la interfaz

visual de WOD Explorer.

Antes de realizar cambios significativos de frontend:

- consulta `impeccable`;

- utiliza sus principios para evaluar la interfaz actual;

- aplica sus criterios de jerarquía, composición, spacing, tipografía y calidad visual;

- evita patrones que la skill identifique como diseño genérico o de baja calidad.

Después de realizar cambios importantes de UI:

- vuelve a revisar el resultado siguiendo `impeccable`;

- corrige los problemas relevantes detectados;

- no amplíes el alcance funcional de la tarea para resolver cuestiones puramente visuales.
## Límites de las recomendaciones de diseño

Las recomendaciones de `impeccable` deben aplicarse con criterio.

No se debe:

- cambiar comportamiento funcional únicamente por una preferencia visual;

- modificar lógica de negocio para satisfacer una recomendación estética;

- introducir nuevas dependencias sin necesidad;

- ampliar el alcance de la spec activa;

- sacrificar accesibilidad o claridad por impacto visual.

Si una recomendación de diseño entra en conflicto con la funcionalidad, la accesibilidad,

la spec activa o las restricciones del producto, se priorizan estas última
