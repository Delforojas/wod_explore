# DESIGN.md — WOD Explorer

`DESIGN.md` define la dirección visual y de experiencia de usuario.

No define comportamiento funcional ni reglas de negocio.

## Objetivo visual

Crear una interfaz moderna, limpia y deportiva para una aplicación de CrossFit.

El diseño debe transmitir:
- energía;
- rendimiento;
- claridad;
- sensación de producto moderno;
- buena legibilidad.

## Dirección visual

- Estética deportiva y tecnológica.
- Evitar apariencia genérica de dashboard empresarial.
- Uso claro de jerarquía visual.
- Cards con información fácil de escanear.
- Espaciado consistente.
- Diseño mobile-first.

## Layout

La aplicación debe mantener una estructura clara:

- navegación principal;
- contenido centrado;
- secciones bien diferenciadas;
- grids responsive para WODs y ejercicios;
- páginas de detalle con jerarquía clara.

## Navegación

La navegación debe incluir las secciones existentes:

- Inicio
- WODs
- Ejercicios
- Historial
- Estadísticas cuando exista la Spec 004

Debe funcionar correctamente en móvil y escritorio.

## Componentes

Mantener consistencia visual entre:

- WodCard
- ExerciseCard
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

Evitar:
- overflow horizontal;
- texto cortado;
- controles demasiado pequeños;
- grids rígidos.

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