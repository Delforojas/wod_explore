# Spec 038 - Actualizar el sistema de diseno oficial de WOD Explorer

## Estado

Implementada localmente en la rama `docs/038-sistema-diseno-oficial`; pendiente
de commit y revision remota.

## Contexto

El dashboard principal ya expresa una direccion visual deportiva, tecnologica y
editorial distinta de las reglas antiguas de `DESIGN.md`. La implementacion de
`HomePage` y los tokens reales de `frontend/src/index.css` son la evidencia
principal. `docs/figma/fitness-dashboard-reference.md` aporta una lectura de
composicion, escala, densidad y ritmo, pero no autoriza copiar su contenido.

## Objetivo

Actualizar `DESIGN.md` para que sea la fuente de verdad visual de WOD Explorer y
permita que futuras specs apliquen de forma consistente sus tokens, jerarquia,
superficies, componentes, estados, responsive y criterios de accesibilidad.

## Alcance

Esta spec incluye:

- reemplazar las reglas incompatibles o incompletas de `DESIGN.md`;
- documentar los tokens visuales realmente usados en `frontend/src/index.css`;
- documentar la composicion observada en `HomePage` como principio reutilizable,
  no como una plantilla obligatoria para cada pantalla;
- documentar superficies, navegacion, botones, formularios, chips, listados,
  tablas, filtros y estados de loading, vacio, error, red y privacidad;
- documentar la adaptacion mobile-first y los criterios de accesibilidad;
- conservar la referencia Figma como inspiracion acotada;
- crear y mantener este SDD como registro de decisiones de la issue.

## Fuera de alcance

No se implementara:

- cambios en `frontend/src`, backend, base de datos, API, router o dependencias;
- nuevas funcionalidades, metricas, endpoints, datos, rutas o componentes;
- redisenar paginas o alterar el comportamiento visual de forma adicional;
- copiar textos, branding, imagenes, iconos, datos o assets de Figma;
- crear un selector de tema, una biblioteca de componentes o un sidecar nuevo;
- modificar otras fuentes de verdad del producto fuera de la documentacion SDD.

## Requisitos documentales

### RD-1 - Fuente visual actual

`DESIGN.md` debe describir la direccion deportiva, tecnologica y editorial
vigente, incluyendo navy continuo, naranja estructural, asimetria, bloque
dominante, paneles contiguos y densidad intencionada.

### RD-2 - Tokens y jerarquia

El documento debe registrar los colores, tipografias, pesos, escalas, radios,
espaciado y variantes de componentes que existen realmente en los estilos
actuales. Las reglas deben distinguir display, headlines, titulos, body y labels.

### RD-3 - Patrones de interfaz

El documento debe ofrecer reglas concretas para botones, chips, contenedores,
inputs, navegacion, listas, tablas, filtros y estados. Estas reglas no deben
inventar componentes o comportamientos no presentes en el producto.

### RD-4 - Responsive y accesibilidad

El documento debe especificar mobile-first desde 320 px, wrapping, safe areas,
targets tactiles, foco visible, semantica, contraste y la independencia del
color como unico canal de significado.

### RD-5 - Referencia Figma acotada

La referencia debe quedar expresamente limitada a inspiracion de composicion,
jerarquia, proporciones, densidad y ritmo. No se deben trasladar sus textos,
branding, imagenes, datos, assets ni funcionalidades.

### RD-6 - Integridad del alcance

El diff propio de la issue debe limitarse a `DESIGN.md` y los artefactos SDD de
`specs/038-sistema-diseno-oficial/`. Los cambios locales preexistentes en otros
archivos no forman parte de esta issue.

## Criterios de aceptacion

1. `DESIGN.md` representa el sistema visual actual de WOD Explorer.
2. Las reglas antiguas incompatibles han sido sustituidas o eliminadas.
3. La implementacion actual de `HomePage` queda reflejada como evidencia y
   principio visual reutilizable.
4. El documento cubre superficies, navegacion, metricas, formularios, listados,
   filtros, estados, responsive y accesibilidad.
5. La referencia Figma queda documentada como inspiracion sin copiar contenido.
6. Los tokens descritos corresponden a valores presentes en
   `frontend/src/index.css` y no introducen una fuente paralela de estilos.
7. No se modifica codigo de produccion, backend, base de datos, funcionalidades
   ni dependencias.
8. El diff propio pasa `git diff --check` y conserva enlaces locales validos.

## Archivos propios previstos

- `DESIGN.md`
- `specs/038-sistema-diseno-oficial/spec.md`
- `specs/038-sistema-diseno-oficial/plan.md`
- `specs/038-sistema-diseno-oficial/tasks.md`

## Referencias

- `docs/constitution.md`
- `PRODUCT.md`
- `frontend/src/pages/HomePage.tsx`
- `frontend/src/index.css`
- `docs/figma/fitness-dashboard-reference.md`
- `specs/036-redisenar-dashboard-principal/spec.md`
- `specs/035-claridad-historial-evolucion/spec.md`
