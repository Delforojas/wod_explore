# AGENTS.md — wod-explorer

## Proyecto
Aplicación web estática desarrollada con React + TypeScript para explorar WODs
y ejercicios de CrossFit.

Los datos se almacenan localmente en archivos JSON.

No hay backend, autenticación ni base de datos en esta primera versión.

## Stack
- React
- TypeScript
- Tailwind CSS
- JSON local
- Zod para validación de datos

## Comandos
- Desarrollo: `npm run dev`
- Build: `npm run build`
- Tests: `npm test`
- Lint: `npm run lint`

Usa únicamente comandos disponibles realmente en `package.json`.
No inventes scripts que no existan.

## Estructura
Mantén una separación clara entre:

- componentes de interfaz
- páginas
- datos
- tipos
- esquemas de validación
- utilidades

Evita colocar lógica compleja directamente dentro de los componentes visuales.

## Estilo
- TypeScript en modo estricto.
- Evita `any` salvo que esté estrictamente justificado.
- Componentes y tipos con nombres descriptivos en inglés.
- Textos visibles para el usuario en español.
- Componentes pequeños y reutilizables cuando tenga sentido.
- Prioriza HTML semántico.
- Diseño responsive y mobile-first.
- Usa Tailwind CSS para los estilos.

## Datos
Los datos de WODs y ejercicios deben almacenarse en archivos JSON locales.

Valida los datos externos/locales con Zod antes de utilizarlos en la aplicación.

No cambies la estructura de los JSON sin actualizar previamente la spec correspondiente.

## Skills

Cuando trabajes con React:
- sigue `vercel-react-best-practices`
- sigue `vercel-composition-patterns`

Cuando trabajes con TypeScript:
- sigue `typescript-advanced-types`

Cuando trabajes con Tailwind:
- sigue `tailwind-css-patterns`

Cuando revises diseño, responsive, UX o accesibilidad:
- sigue `web-design-guidelines`

Cuando trabajes con datos JSON:
- sigue `zod-schema-validation`

Usa `find-skills` únicamente cuando una tarea requiera conocimientos que no estén cubiertos por las skills actuales.

## Reglas
- Lee `docs/constitution.md` antes de modificar código.
- Lee la spec activa dentro de `specs/` antes de implementar una funcionalidad.
- La spec activa es la fuente de verdad funcional.
- No implementes funcionalidades fuera del alcance de la spec.
- No modifiques archivos dentro de `specs/` salvo petición explícita.
- No añadas dependencias sin una necesidad clara.
- No añadas backend, API externa, autenticación ni base de datos salvo que una spec futura lo solicite.
- No realices refactors grandes que no sean necesarios para la tarea actual.
- No hagas commits ni push automáticamente.

## Al terminar cualquier tarea
- Ejecuta los tests disponibles.
- Ejecuta el lint.
- Ejecuta `npm run build`.
- Comprueba que no existen errores de TypeScript.
- Indica claramente qué archivos has modificado.
- Indica qué verificaciones has ejecutado y su resultado.
- Si algún requisito de la spec no se ha podido cumplir, indícalo explícitamente.