# Spec 031 - Rediseñar el shell visual y la navegación responsive

## Estado

En desarrollo sobre la rama `feat/031-redisenar-shell-navegacion-responsive`.

## Contexto

WOD Explorer ya tiene una dirección editorial deportiva basada en papel, tinta,
naranja de señal y reglas finas. El frontend mantiene esa intención en
`frontend/src/index.css`, pero la shell y las dos variantes de navegación todavía
necesitan una composición más consistente entre tamaños, mejor señalización de
la sección activa y una base accesible para las siguientes superficies visuales.

## Objetivo

Establecer una base visual coherente y moderna para todo WOD Explorer mejorando el
layout general, el topbar, el rail lateral, la navegación inferior móvil y el
contenido principal, sin cambiar las rutas ni el comportamiento funcional.

## Alcance

- Revisar y consolidar tokens de color, tipografía, espaciado, bordes y estados
  interactivos en `frontend/src/index.css`.
- Mejorar la composición del topbar, el rail lateral, el área principal y la
  navegación inferior móvil.
- Comunicar la sección activa de forma consistente en escritorio y móvil, con
  semántica accesible y sin depender únicamente del color.
- Resolver safe areas, targets táctiles, foco visible y posibles desbordamientos
  horizontales.
- Añadir un acceso claro al contenido principal cuando sea necesario para
  navegación por teclado.
- Mantener la dirección editorial deportiva definida en `DESIGN.md`.
- Mantener el router hash, las rutas, los enlaces, los contratos API y los estados
  funcionales existentes.

## Fuera de alcance

- Cambiar funcionalidades de producto, endpoints, contratos API o persistencia.
- Añadir Tailwind, librerías de iconos, fuentes externas, dependencias de UI o
  APIs externas.
- Rediseñar en profundidad páginas concretas, formularios, cards o estados; esas
  superficies quedan para las Issues #32, #33 y #34.
- Introducir autenticación, perfil, favoritos u otras rutas.

## Requisitos funcionales

### RF-1 - Shell consistente

La shell debe aplicar una jerarquía visual reconocible al topbar, navegación y
contenido principal en Home, catálogos, detalles, historial, estadísticas, auth y
perfil.

### RF-2 - Navegación activa

La navegación lateral y la navegación inferior deben identificar la ruta actual
con una señal visual y semántica consistente. Las rutas existentes y sus enlaces
deben conservarse.

### RF-3 - Responsive

La interfaz debe funcionar como mínimo en 320px, tablet y escritorio amplio. En
móvil la barra inferior fija no debe cubrir el contenido ni los controles, y no
debe producir overflow horizontal.

### RF-4 - Accesibilidad

La shell debe ofrecer HTML semántico, foco visible, targets táctiles adecuados,
operación completa por teclado y un acceso al contenido principal. El estado
activo no puede comunicarse solo mediante color.

### RF-5 - Compatibilidad

Los cambios deben preservar el router hash, la navegación mediante enlaces reales,
la sesión, los estados de las páginas y el contenido funcional actual.

## Criterios de aceptación

1. La shell tiene jerarquía visual clara y consistente en 320px, tablet y
   escritorio amplio.
2. La navegación principal funciona con teclado, tiene foco visible y comunica la
   sección activa sin depender solo del color.
3. La navegación móvil respeta safe areas, no cubre contenido ni controles y no
   genera overflow horizontal.
4. El contenido principal conserva sus rutas, enlaces, estados y comportamiento
   actual.
5. Los cambios visuales son visibles en Home, catálogos, detalles, historial,
   estadísticas, auth y perfil.
6. No se añaden dependencias ni se modifican contratos API, lógica de negocio o
   persistencia.
7. `npm test`, `npm run lint` y `npm run build` pasan.
8. La revisión manual confirma navegación con teclado y composición responsive en
   móvil, tablet y escritorio.

## Decisiones resueltas

- Se conserva la dirección visual editorial de `DESIGN.md`; no se reemplaza por
  un dashboard genérico ni por una nueva identidad visual.
- Se utilizará el CSS existente en `frontend/src/index.css`, porque el proyecto
  no declara Tailwind ni necesita una dependencia adicional para este alcance.
- La navegación seguirá usando enlaces `<a>` y el router hash existente.
- El estado activo se expresará mediante `aria-current="page"` y una diferencia
  visual adicional al color.
- La navegación inferior seguirá fija en móvil, con espacio de contenido y
  safe-area insets para evitar solapamientos.
- La verificación visual será manual y acotada a tres familias de viewport; los
  tests automatizados cubrirán semántica, enlaces y navegación observable cuando
  sea estable hacerlo sin navegador E2E.

## Verificaciones

Desde `frontend/`:

```bash
npm test
npm run lint
npm run build
```

Además se revisará manualmente la shell en móvil, tablet y escritorio, la
navegación por teclado, el foco visible y la ausencia de overflow horizontal.
