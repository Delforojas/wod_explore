# Plan 076 - Redefinir el sistema visual global y el shell/layout

## Base y restricciones

La rama parte de `main` sincronizada con `origin/main`. El worktree contiene
untracked ajenos (`archify-*` y `wod_explorer_schema.sql`) que no pertenecen a
esta Issue. No se modificaran `AGENTS.md`, `frontend/AGENTS.md`, `.opencode/` ni
`DESIGN.md` salvo que la implementacion revele una decision durable faltante;
en ese caso el cambio se justificara de forma separada.

La fuente visual es `DESIGN.md`, no la estetica heredada de `index.css`. El
frontend usa CSS existente aunque `AGENTS.md` mencione Tailwind, porque
`frontend/package.json` no declara esa dependencia y esta Issue no autoriza una
migracion de tecnologia.

## Estrategia de implementacion

1. Inspeccionar `index.css` completo y clasificar sus reglas en tokens,
   primitives compartidos, shell, responsive y estilos especificos de pagina.
2. Sustituir en sitio la capa de tokens legacy por los roles definidos en
   `DESIGN.md`, evitando una segunda capa masiva de overrides al final del
   fichero.
3. Normalizar la tipografia compartida en una sola familia sans-serif y eliminar
   la serif de headings y estructuras. Mantener las dimensiones especificas de
   pagina cuando no formen parte del sistema global.
4. Aplicar los roles de superficie y contraste a body, topbar, rail, contenido,
   paneles, campos, botones, badges y estados. El naranja tendra un uso
   semantico y controlado.
5. Dar prioridad a metricas mediante reglas compartidas sobre los elementos de
   valor ya existentes (`strong`, `data`, unidades y metadata), sin editar los
   modelos ni introducir contenido.
6. Redisenar el shell con una composicion orientada a tarea: rail compacto en
   escritorio, contenido amplio y bottom nav en movil. Mantener destinos,
   `aria-current`, skip link y acciones de sesion.
7. Resolver responsive mobile-first con wrapping, `min-width: 0`, targets de 44
   px, safe areas y una reserva de espacio calculada para la navegacion fija.
8. Revisar si algun componente compartido queda fuera de `DESIGN.md`; solo en
   ese caso actualizar el documento normativo antes del cierre.
9. Actualizar tests unicamente si hay un cambio observable de markup o
   semantica; los tests no deben verificar colores ni detalles de CSS.

## Direccion visual implementable

### Paleta y superficie

Usar exactamente los roles definidos en `DESIGN.md`: `background #0b1117`,
`surface #111a22`, `surface-raised #18232d`, `surface-hover #202d37`, bordes
`#293640`/`#3b4b57`, texto `#f4f7f8`/`#a2adb5`/`#727f88`, naranja `#ef5b25`
con hover `#d94d19`, verde `#35b86b` y peligro `#e05252`.

La profundidad se expresa con superficies y bordes. No se añaden gradientes,
glassmorphism, sombras prominentes, grandes radios ni bloques naranjas
decorativos.

### Tipografia y datos

Usar la pila Inter con fallbacks del sistema ya definida en `DESIGN.md`, sin
descarga externa. Display, headline y title deben compartir esa voz sans-serif.
La categoria metric usa peso alto, contraste, cifras tabulares cuando aplique y
valor/unidad juntos.

### Shell y responsive

El rail desktop utiliza `surface`, ocupa solo el ancho necesario y se mantiene
subordinado al contenido. El contenido principal usa `background` y crece sin
anchuras rigidas. La bottom nav movil conserva los siete destinos actuales,
mantiene targets de 44 px, puede envolver en varias filas sin overflow y reserva
su alto real con safe-area inset.

## Riesgos y mitigaciones

### Confundir fundamentos globales con rediseño de paginas

Cambiar solo tokens y primitives compartidos, ademas de la shell. No cambiar la
estructura, copy, datos o flujos de ninguna pagina incluida en el fuera de
alcance.

### Acumular CSS contradictorio

Editar reglas fuente y consolidar tokens en lugar de apilar otra gran seccion de
overrides. Revisar declaraciones legacy de `Georgia`, fondos claros y grandes
superficies naranjas antes del cierre.

### Contraste incorrecto sobre acento

Usar los roles de texto de `DESIGN.md` segun la superficie, verificar botones
primarios, estados, enlaces, foco y selected/active con contraste suficiente.

### Navegacion movil densa

Mantener etiquetas comprensibles, permitir wrapping y comprobar que el alto
reservado supera la barra fija en 320 px, 390 px y tablet.

### Fuentes no instaladas

Inter se mantiene como primer nombre normativo, pero la pila debe tener
fallbacks locales. No bloquear la implementacion ni instalar fuentes sin
autorizacion.

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

La inspeccion final debe comprobar el diff propio, ausencia de cambios en API,
router, datos, dependencias y archivos locales ajenos. La revision visual debe
probar movil desde 320 px, tablet y escritorio, incluyendo navegacion por
teclado, skip link, foco, contraste, zoom y ausencia de overflow. Si no existe
un navegador automatizable en el entorno, se documentara esa limitacion en el
cierre en vez de afirmar una validacion visual no realizada.
