# Tareas - Spec 031 Shell visual y navegación responsive

## T1 - Preparar rama y SDD

### Trabajo

- Trabajar en `feat/031-redisenar-shell-navegacion-responsive`.
- Crear `spec.md`, `plan.md` y `tasks.md` válidos.
- Partir del estado actual que contiene la implementación de la Issue #30.
- Preservar los cambios ajenos existentes en `.opencode/`.

### Hecho cuando

- La rama específica existe, es la rama actual y su nombre corresponde a la Issue
  #31.
- Los tres archivos SDD contienen objetivo, alcance, plan y tareas ejecutables.
- No se han incluido cambios ajenos en el trabajo de la Issue.

Estado: completada.

## T2 - Mejorar landmarks y navegación activa

### Trabajo

- Revisar `Layout.tsx` sin cambiar sus rutas ni enlaces.
- Añadir acceso al contenido principal y landmarks claros.
- Aplicar `aria-current="page"` a la navegación lateral e inferior cuando
  corresponda.
- Mantener nombres accesibles y enlaces reales.

### Hecho cuando

- La sección actual se identifica visual y semánticamente en escritorio y móvil.
- La navegación se puede operar con teclado y mantiene el comportamiento hash.
- El contenido principal tiene un destino claro para salto de navegación.

Estado: completada.

## T3 - Consolidar el lenguaje visual de la shell

### Trabajo

- Revisar tokens y reglas compartidas de `frontend/src/index.css`.
- Mejorar topbar, rail, contenido principal, límites de lectura y espaciado.
- Reforzar hover, focus y active sin depender solo del color.
- Mantener la estética editorial deportiva de `DESIGN.md`.

### Hecho cuando

- La shell muestra una jerarquía consistente en todas las páginas existentes.
- Los cambios son visibles sin convertir la interfaz en un dashboard genérico.
- No se introducen dependencias ni estilos inline innecesarios.

Estado: completada.

## T4 - Resolver responsive, touch y movimiento

### Trabajo

- Ajustar breakpoints para móvil, tablet y escritorio.
- Incorporar safe-area insets y espacio para la navegación inferior fija.
- Garantizar targets táctiles, foco visible y ausencia de overflow horizontal.
- Respetar `prefers-reduced-motion` en transiciones de la shell.

### Hecho cuando

- La barra móvil no cubre contenido ni controles.
- La composición funciona desde 320px sin texto o controles cortados.
- La navegación es usable con touch, teclado y movimiento reducido.

Estado: completada.

## T5 - Proteger el comportamiento observable

### Trabajo

- Añadir o adaptar tests de Layout/App para enlaces, estado activo y navegación
  observable cuando sea necesario.
- No probar clases CSS o estructura incidental sin valor funcional.

### Hecho cuando

- Las rutas hash y destinos principales siguen cubiertos.
- Los tests distinguen correctamente navegación desktop y móvil.
- No se rompe la suite existente.

Estado: completada.

## T6 - Verificar y cerrar la implementación

### Trabajo

Desde `frontend/`, ejecutar:

```bash
npm test
npm run lint
npm run build
```

- Revisar manualmente móvil, tablet, escritorio y navegación por teclado.
- Revisar `git diff`, `git status` y el alcance de los archivos.
- Marcar las tareas completadas solo con evidencia.

### Hecho cuando

- Todas las verificaciones pasan.
- La revisión manual confirma responsive, foco y navegación activa.
- No hay cambios de backend, base de datos, API ni archivos ajenos.

Estado: completada.

## T7 - Commit y documentación

### Trabajo

- Añadir al staging únicamente archivos de la Issue #31.
- Crear el commit correspondiente.
- Verificar el hash, el estado limpio y la rama actual.
- Documentar implementación y verificaciones en la Issue #31 mediante GitHub MCP.
- Mantener la Issue abierta y no hacer push.

### Hecho cuando

- Existe un commit de la Issue #31.
- No quedan cambios de la Issue sin commit.
- La Issue contiene el resumen, archivos, verificaciones, hash y rama.

Estado: pendiente.

## Orden de ejecución

```text
T1
 ↓
T2
 ↓
T3
 ↓
T4
 ↓
T5
 ↓
T6
 ↓
T7
```
