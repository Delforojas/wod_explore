# Tasks 037 - Extender el lenguaje visual al resto del frontend

## Preparacion y SDD

- [x] Confirmar la rama `feat/037-lenguaje-visual-frontend` como rama actual y
  preservar los cambios ajenos del worktree.
- [x] Crear y validar `spec.md`, `plan.md` y `tasks.md` con alcance, decisiones y
  tareas ejecutables.

## Shell y superficies

- [x] Mantener la shell, destinos y acciones de sesion, y marcar visual y
  semanticamente el catalogo padre al visitar un detalle.
- [x] Armonizar en `index.css` topbar, navegacion, contenido, superficies,
  tipografia, reglas, botones, foco y estados con el lenguaje de Home.
- [x] Reforzar la composicion de catalogos, detalles, historial, estadisticas,
  perfil y auth sin convertir sus estructuras en tarjetas uniformes ni cambiar
  datos o comportamiento.

## Responsive y accesibilidad

- [x] Mantener visibles y escaneables nombre, categoria/tipo, nivel o medicion en
  filas tecnicas desde 320 px, con wrapping seguro.
- [x] Resolver el ancho minimo de autenticacion, valores largos, targets tactiles,
  safe areas y espacio de la navegacion inferior sin overflow horizontal.
- [x] Conservar HTML semantico, labels, links, botones, `aria-current`, foco
  visible, contraste, estados no dependientes solo del color y reduced motion.

## Verificacion y entrega

- [x] Ejecutar `npm test` desde `frontend/` y corregir cualquier fallo relacionado.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/` para comprobar TypeScript y build.
- [x] Ejecutar `git diff --check` y el detector mecanico de Impeccable.
- [x] Revisar manualmente de forma estatica 320 px, tablet, escritorio, zoom, teclado, estados,
  rutas, textos largos y ausencia de overflow.
- [x] Revisar diff y status, crear un commit exclusivo de la Issue #37 y
  documentarlo en GitHub sin cerrar la Issue ni hacer push.
