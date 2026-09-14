# Plan 038 - Actualizar el sistema de diseno oficial

## Base tecnica y documental

La rama parte de `feat/037-lenguaje-visual-frontend`, que contiene la direccion
visual vigente y su correccion mas reciente. La fuente normativa de tokens es
`frontend/src/index.css`; la estructura y copy de `HomePage` prueban la
composicion actual. El trabajo de esta issue es documental y no requiere cambiar
el frontend.

## Estrategia

1. Contrastar Issue #38, Constitucion, PRODUCT.md, Specs 035/036 y la referencia
   Figma para separar invariantes del producto de detalles de una plantilla.
2. Extraer un conjunto compacto de colores, tipografias, radios, espaciados y
   variantes de componentes que ya existan en CSS.
3. Reorganizar `DESIGN.md` con frontmatter de tokens y las ocho secciones
   canonicas: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes,
   Components y Do's and Don'ts.
4. Convertir la implementacion de Home en reglas reutilizables de composicion,
   sin convertir su layout puntual en requisito para todas las pantallas.
5. Documentar patrones operativos de navegacion, formularios, listados, filtros,
   estados y accesibilidad basados en el frontend actual.
6. Revisar el diff para garantizar que no se mezclan los cambios locales ajenos a
   la issue.

## Decisiones

### Tokens

- Mantener los nombres semanticos de las variables CSS existentes.
- No inventar una nueva escala de color ni cambiar el formato de los valores.
- Incluir en frontmatter solo tokens con uso real y explicar su funcion en prose.

### Composicion

- Usar navy continuo, naranja concentrado, asimetria y paneles contiguos como
  direccion visual, no como una receta de coordenadas.
- Preferir reglas y contraste de superficie frente a radios grandes y sombras.
- Mantener una jerarquia clara entre contexto, contenido, accion, apoyo y estado.

### Referencia externa

- Adaptar solo composicion, escala, densidad, ritmo y contraste de la referencia
  Figma.
- Rechazar contenido, branding, assets, metricas y funcionalidad de la plantilla.

### Alcance

- No crear `.impeccable/design.json`: la issue limita el cambio documental a
  `DESIGN.md` y sus artefactos SDD, y no necesita snippets adicionales.
- No ejecutar el detector mecanico sobre UI porque no se modifica UI.
- No ejecutar tests, lint o build de frontend porque no se modifica codigo,
  configuracion ni dependencias.

## Flujo de trabajo

1. Confirmar rama y estado del worktree antes de editar.
2. Crear spec, plan y tasks de #38.
3. Actualizar `DESIGN.md` sin tocar los archivos locales preexistentes ajenos.
4. Revisar cobertura de requisitos y consistencia de tokens con `index.css`.
5. Validar formato, diff y enlaces propios.
6. Dejar sin commit ni push automatico hasta una instruccion explicita.

## Riesgos y mitigaciones

### Convertir una pantalla en una plantilla global

Describir la asimetria y el bloque dominante como principios de jerarquia. No
prescribir las clases, coordenadas o dimensiones especificas de `HomePage`.

### Inventar tokens o componentes

Comparar cada token con `frontend/src/index.css` y omitir escalas o componentes
que no tengan evidencia en el codigo.

### Copiar Figma

Mantener una regla explicita de no copiar contenido y diferenciar lo observado en
la referencia de las decisiones propias de WOD Explorer.

### Mezclar cambios locales

Usar `git diff -- DESIGN.md` y revisar `git status --short`; no modificar
`.env.example`, `specs/033-redisenar-detalles-resultados/spec.md`,
`.opencode/commands/issue-create.md` ni `docs/figma/` como parte de esta issue.

## Verificaciones

Aplicables a esta tarea documental:

```bash
git diff --check
git diff -- DESIGN.md specs/038-sistema-diseno-oficial
```

Ademas, revisar manualmente:

- que las ocho secciones canonicas esten presentes y ordenadas;
- que todos los colores de frontmatter existan como tokens CSS o valores de
  estado realmente usados;
- que las referencias locales citadas existan;
- que no haya cambios propios en codigo, backend, base de datos o dependencias.
