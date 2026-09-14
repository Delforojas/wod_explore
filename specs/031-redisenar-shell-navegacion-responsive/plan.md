# Plan - Spec 031 Shell visual y navegación responsive

## Objetivo técnico

Evolucionar la shell existente con cambios acotados en `Layout` y
`frontend/src/index.css`, conservando la estructura de páginas y el router hash.
La implementación priorizará jerarquía visual, semántica, estados activos y
composición responsive antes que nuevas abstracciones o dependencias.

## Superficies afectadas

- `frontend/src/components/Layout.tsx`: landmarks, skip link y estado activo de
  ambas navegaciones.
- `frontend/src/index.css`: tokens, shell, navegación, foco, touch targets,
  safe areas, responsive y reducción de movimiento.
- `frontend/src/App.test.tsx` y/o `frontend/src/components/Layout.test.tsx`:
  comportamiento observable que necesite protección.

No se modificarán páginas, cliente API, schemas ni backend salvo que una prueba
demuestre una regresión directamente causada por la shell.

## Decisiones técnicas

### 1. Composición de la shell

Se mantendrá el `topbar`, el `app-frame` con rail lateral en escritorio y la
navegación inferior en móvil. Se mejorará la relación entre landmarks, el ancho
de lectura, el espaciado y el espacio inferior reservado para la barra fija.

### 2. Navegación activa

La lógica existente que recibe `currentPage` se reutilizará para calcular una
señal activa en cada enlace. Se añadirá `aria-current="page"` al enlace activo y
se mantendrán `href` hash reales para conservar la navegación nativa.

### 3. Accesibilidad e interacción

Se conservará el foco visible global y se reforzarán los estados hover/focus/active
sin depender solo del color. Se añadirá un enlace de salto al contenido y un `id`
estable en `<main>`. Los targets de navegación tendrán un área cómoda en móvil.

### 4. Responsive y movimiento

Se usarán CSS media queries y propiedades de layout existentes, sin mediciones JS.
La barra móvil incorporará `env(safe-area-inset-bottom)` y el contenido reservará
espacio equivalente. Las transiciones solo animarán propiedades concretas y se
desactivarán o reducirán con `prefers-reduced-motion`.

### 5. Control de alcance

No se añadirá una librería de diseño ni se cambiará la información mostrada. Las
mejoras de cards, detalle, estados e historial se dejarán para sus Issues
específicas y solo se tocará la shell compartida cuando sea necesario.

## Flujo de implementación

1. Confirmar la rama, SDD y estado limpio respecto de los cambios ajenos.
2. Ajustar `Layout` para landmarks, skip link y navegación activa accesible.
3. Consolidar tokens y estilos de shell en `index.css`.
4. Ajustar breakpoints, safe areas, touch targets y foco/movimiento reducido.
5. Añadir o adaptar tests de comportamiento sin acoplarlos a clases CSS
   incidentales.
6. Ejecutar tests, lint y build.
7. Revisar manualmente móvil, tablet, escritorio y teclado.
8. Revisar diff y staging, completar tasks y crear el commit de la Issue #31.

## Riesgos y mitigaciones

### Navegación duplicada

La aplicación renderiza navegación lateral y móvil. Las pruebas deben distinguir
ambas landmarks sin asumir que existe un único enlace por destino.

### Barra fija móvil

Un cambio de padding puede ocultar el final de formularios o estados. Se mitigará
reservando espacio inferior y revisando páginas largas y controles enfocables.

### Cambios visuales regresivos

Se limitarán las modificaciones a shell y tokens compartidos; los tests existentes
y una revisión manual por viewport protegerán rutas y contenido.

## Verificaciones

Desde `frontend/` y usando solo scripts existentes:

```bash
npm test
npm run lint
npm run build
```

La revisión final comprobará `git diff`, `git status`, ausencia de cambios de
backend/API y navegación accesible en los tres rangos de viewport.
