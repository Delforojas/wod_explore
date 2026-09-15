# Plan 077 - Redisenar Inicio con enfoque en entrenamiento

## Base tecnica

La rama parte de `feat/076-global-visual-system-shell-v2`, que contiene el
sistema visual global y el shell de #76, porque esa Issue todavia no esta
integrada en `main` y es una dependencia explicita de #77. El worktree conserva
untracked ajenos (`archify-*` y `wod_explorer_schema.sql`) que no se incluiran.

La implementacion se limita a React/TypeScript, CSS existente y tests del
frontend. No se anaden dependencias, no se usa API nueva y no se modifica
`DESIGN.md` porque la identidad visual ya esta definida.

## Archivos propios

- `frontend/src/pages/HomePage.tsx`: nueva estructura semantica de portada y
  enlaces existentes.
- `frontend/src/index.css`: sustitucion de la composicion especifica de Home,
  sus reglas responsive y sus estados de interaccion.
- `frontend/src/App.test.tsx`: actualizar expectativas observables si el nuevo
  heading o los nombres accesibles cambian.
- `specs/077-redisenar-inicio-rendimiento/{spec,plan,tasks}.md`: registro de
  decisiones, tareas y evidencia.

## Estrategia

1. Mantener `Layout`, router hash, acciones de sesion, datos y los cuatro
   destinos de Inicio sin cambios funcionales.
2. Reemplazar el header editorial y la ilustracion CSS por un encabezado
   operativo que explique la tarea y exponga `Explorar WODs` como accion
   primaria.
3. Componer los tres accesos secundarios como rutas de trabajo densas y
   escaneables. Cada acceso conservara un enlace real, copy en espanol y una
   jerarquia de destino/contexto.
4. Implementar el layout con grid/flex, `minmax(0, 1fr)`, `min-width: 0`,
   wrapping y contenido intrinseco. En movil se apilara en el mismo orden de
   lectura y se reservara el espacio ya definido para bottom nav.
5. Usar unicamente tokens existentes (`background`, `surface`,
   `surface-raised`, `surface-hover`, bordes, texto y naranja). No agregar
   gradientes, sombras, radios grandes, graficas, metricas ni assets.
6. Conservar focus-visible, targets de 44 px y reduced motion. La informacion
   importante no dependera solo del color.
7. Actualizar solo la prueba de App necesaria para el nuevo contenido y
   comprobar que los cuatro enlaces mantienen sus href.

## Riesgos y mitigaciones

### Inventar una actividad que Inicio no recibe

No se agregaran contadores, PRs ni estados. Las rutas y el contexto de producto
seran la evidencia funcional disponible.

### Recaer en un hero editorial

El primer bloque tendra una accion util y texto corto; la escala se usara para
orientar la decision, no para crear una pieza decorativa.

### Overflow en la columna de rutas

Se usaran columnas fluidas, wrapping, `min-width: 0` y un breakpoint que apile
el panel principal y las rutas antes de que el contenido quede comprimido.

### Regresion de navegacion

Se conservaran exactamente los cuatro href hash actuales y se probaran por
rol/nombre desde `App.test.tsx`.

## Verificaciones

Desde `frontend/`:

```bash
npm test
npm run lint
npm run build
```

Ademas:

```bash
git diff --check
```

Se ejecutara una revision estatica final de 320 px, tablet, escritorio, zoom,
teclado, foco, contraste, textos largos y ausencia de overflow. Como el entorno
no garantiza un navegador automatizable, cualquier limitacion visual se
documentara honestamente y quedara como validacion manual pendiente.
