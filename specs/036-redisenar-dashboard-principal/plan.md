# Plan 036 - Redisenar el dashboard principal

## Base tecnica

La rama parte de `feat/035-claridad-historial-evolucion`, que contiene la
jerarquia y los estados actuales de historial y estadisticas. La implementacion
se limitara a React/TypeScript y al CSS existente en
`frontend/src/index.css`. No se anadiran dependencias ni se modificaran API,
schemas, router o backend.

## Superficies afectadas

- `HomePage`: transformar la portada en una composicion de dashboard asimetrica
  con un bloque de entrada dominante y paneles de acceso escaneables.
- `Layout`: reforzar la jerarquia de marca, shell y navegacion sin cambiar sus
  rutas ni acciones.
- `StatisticsPage`: conservar su estructura y aplicar la nueva jerarquia mediante
  los estilos existentes, sin tocar el acceso a datos.
- `index.css`: definir la composicion, superficies, ritmo, estados responsive,
  foco y reduced motion usando los tokens existentes.
- Tests actuales: proteger el comportamiento observable, no detalles CSS
  incidentales.

## Estrategia

1. Mantener el router hash, los enlaces reales, la sesion y los contratos de
   `frontend/src/api/schemas.ts`.
2. Traducir la referencia de Figma a principios de composicion: bloque dominante,
   apoyos secundarios, acento concentrado y separacion clara de contexto y
   valores.
3. Conservar la identidad editorial de papel, tinta, reglas finas y naranja de
   WOD Explorer en lugar de copiar el tema oscuro, assets o contenido del mockup.
4. Usar grid y flexbox CSS con tamaños intrinsecos, `minmax(0, 1fr)` y
   `min-width: 0`; no usar posiciones absolutas para fijar contenido.
5. Mantener la lista textual de estadisticas y evolucion como fuente de datos
   accesible; cualquier acento visual sera complementario.
6. Mantener los componentes pequenos y evitar nuevas abstracciones o props
   booleanas sin repeticion real que las justifique.

## Flujo de implementacion

1. Confirmar rama, estado del working tree y limites del diff.
2. Ajustar la estructura semantica de `HomePage` y sus enlaces actuales.
3. Ajustar `Layout` solo para jerarquia, navegacion activa y composicion visual.
4. Reorganizar las clases necesarias de `StatisticsPage` sin tocar el acceso a
   datos ni el formato de los contratos.
5. Implementar la direccion visual y responsive en `index.css`, incluyendo
   overflow seguro, targets, focus-visible y reduced motion.
6. Verificar los tests de App, Layout y StatisticsPage para headings, enlaces,
   estados activos y metricas existentes, ampliando solo la cobertura necesaria.
7. Ejecutar tests, lint, build, `git diff --check` y el detector mecanico de
   Impeccable sobre los targets modificados.
8. Revisar manualmente 320 px, tablet, escritorio, zoom, teclado, textos largos
   y estados relevantes.

## Riesgos y mitigaciones

### Confundir inspiracion con copia

La referencia se usara como guia de escala, ritmo y contraste. No se copiaran
assets, textos, branding, valores, coordenadas ni funcionalidades.

### Ampliar el dashboard con datos inventados

No se agregaran llamadas ni calculos. Las metricas y estadisticas seran las que
ya entregan los contratos y las pantallas actuales.

### Regresiones de navegacion

Se conservaran `href` hash, `aria-current`, acciones de sesion y las dos variantes
de navegacion. Los tests distinguiran los landmarks de escritorio y movil.

### Desbordamiento responsive

Se usaran layouts fluidos, wrapping, `min-width: 0` y espacio para safe areas.
Se revisaran nombres largos, zoom y el contenido enfocable en 320 px.

## Verificaciones

Desde `frontend/` y usando solo scripts existentes:

```bash
npm test
npm run lint
npm run build
```

Ademas se ejecutaran `git diff --check` y:

```bash
/Users/delfinrojas/.claude/skills/impeccable/scripts/impeccable detect --json frontend/src/pages/HomePage.tsx frontend/src/pages/StatisticsPage.tsx frontend/src/components/Layout.tsx frontend/src/index.css
```

La revision manual comprobara la composicion en movil, tablet y escritorio,
navegacion por teclado, foco visible, contraste, zoom, textos largos, ausencia de
overflow y preservacion de rutas y datos.
