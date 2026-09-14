# Tasks 036 - Redisenar el dashboard principal

## SDD y alcance

- [x] Validar spec, plan y tareas contra la Issue #36 y la base de #35.
- [x] Confirmar que solo se incluyen cambios de UI, pruebas y este SDD.

## Dashboard y shell

- [x] Redisenar la estructura semantica de `HomePage` con una jerarquia
  asimetrica propia de WOD Explorer.
- [x] Mantener los enlaces existentes de WODs, ejercicios, historial y
  estadisticas en los paneles del dashboard.
- [x] Ajustar `Layout` para reforzar marca, shell, navegacion activa y lectura sin
  cambiar rutas ni acciones de sesion.

## Metricas y estilos

- [x] Mejorar la presentacion visual de las metricas, marcas y evolucion actuales
  sin cambiar contratos, llamadas, valores, unidades o estados.
- [x] Aplicar en `index.css` las superficies, reglas, ritmo, tipografia y acentos
  definidos por `DESIGN.md` y la referencia adaptada.
- [x] Resolver responsive desde 320 px, tablet y escritorio con wrapping,
  safe-area y sin overflow horizontal.
- [x] Verificar foco visible, targets tactiles, headings, landmarks y reduced
  motion.

## Pruebas y verificacion

- [x] Verificar `App.test.tsx` y `Layout.test.tsx` para el comportamiento
  observable de dashboard y navegacion.
- [x] Verificar `StatisticsPage.test.tsx` para conservar headings, metricas,
  enlaces, estados y datos existentes.
- [x] Ejecutar `npm test` desde `frontend/`.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check`.
- [x] Ejecutar el detector mecanico de Impeccable sobre los targets modificados.
- [x] Preparar la checklist de validacion manual para movil, tablet, escritorio,
  zoom, teclado, textos largos, estados y ausencia de overflow.
- [x] Confirmar que no cambian API, schemas, payloads, autenticacion, rutas ni
  persistencia.
