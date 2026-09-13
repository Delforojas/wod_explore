# Spec 036 - Redisenar el dashboard principal de WOD Explorer

## Estado

Implementada en la rama `feat/036-redisenar-dashboard-principal`.

## Contexto

WOD Explorer ya dispone de una shell editorial, una pagina de inicio con paneles
de acceso y una pantalla de estadisticas que consulta los contratos de usuario
existentes. La Issue #36 solicita reforzar su jerarquia visual y adaptar algunos
principios de una referencia de fitness de Figma sin importar su contenido,
branding ni funcionalidades.

La referencia visual esta documentada en
`docs/figma/fitness-dashboard-reference.md`. El frontend actual usa React,
TypeScript, Vite y CSS en `frontend/src/index.css`; la navegacion usa enlaces
hash y el cliente API y sus schemas son la fuente de los datos.

## Objetivo

Redisenar el dashboard principal para que presente una experiencia deportiva,
tecnologica y escaneable, con un bloque principal dominante, superficies de
apoyo claras y mejor separacion entre navegacion, contenido, metricas y
estadisticas. El resultado debe seguir siendo reconocible como WOD Explorer y
conservar los flujos actuales.

## Alcance

Esta spec incluye:

- la composicion visual y semantica de `HomePage`;
- la jerarquia visual de la shell compartida en `Layout`;
- la presentacion visual de los valores y secciones ya existentes en
  `StatisticsPage` cuando sea necesaria para la coherencia del dashboard;
- cards y paneles de acceso basados unicamente en destinos y copy propios de
  WOD Explorer;
- uso de los tokens actuales y del CSS existente;
- responsive mobile-first desde 320 px, tablet y escritorio;
- accesibilidad semantica, teclado, foco visible, contraste y targets tactiles;
- pruebas de comportamiento sobre headings, enlaces, navegacion y datos
  visibles.

## Fuera de alcance

No se implementara:

- nuevos endpoints, cambios de API, schemas, payloads o reglas de negocio;
- nuevas metricas, calculos, rankings, objetivos, temporizadores o datos de
  ejemplo;
- cambios en backend, MySQL, Docker, autenticacion o persistencia;
- nuevas rutas, destinos de navegacion o funcionalidades de la plantilla;
- copia de textos, imagenes, branding, contenido o assets de Figma;
- dependencias nuevas, Tailwind adicional, librerias de iconos, graficas o
  fuentes externas;
- redisenos no necesarios de catalogos, detalles, formularios, perfil o estados
  compartidos.

## Requisitos funcionales

### RF-1 - Dashboard propio del producto

Home debe comunicar con claridad el proposito de WOD Explorer y priorizar el
acceso a WODs, ejercicios, historial y estadisticas mediante enlaces reales. Los
paneles deben conservar sus destinos actuales y no presentar acciones inexistentes.

### RF-2 - Shell y navegacion

La cabecera, la navegacion lateral de escritorio y la navegacion inferior movil
deben mantener sus destinos, sus estados activos y las acciones de sesion. La
seccion actual debe seguir comunicandose mediante `aria-current="page"` y una
señal visual que no dependa solo del color.

### RF-3 - Datos y estadisticas

Las metricas y estadisticas deben mostrar unicamente datos ya disponibles en los
contratos actuales. La presentacion puede cambiar, pero no las llamadas API, los
valores, unidades, enlaces, estados ni el significado de los datos.

### RF-4 - Responsive

La composicion debe funcionar desde 320 px, tablet y escritorio. En movil las
secciones deben apilarse en orden de lectura y reservar espacio para la
navegacion inferior, sin overflow horizontal ni recortes de texto.

### RF-5 - Accesibilidad

La interfaz debe conservar landmarks y headings coherentes, enlaces y botones
semanticos, foco visible, targets tactiles de al menos 44 px y soporte para
teclado. Los nombres y valores importantes no dependeran unicamente del color,
la posicion o elementos decorativos.

## Criterios de aceptacion

1. El dashboard presenta una jerarquia visual modernizada y coherente con la
   identidad editorial de WOD Explorer.
2. La navegacion de escritorio y movil conserva sus destinos, estados activos y
   acciones funcionales.
3. Las cards, metricas y estadisticas muestran unicamente datos disponibles
   mediante los contratos actuales.
4. Las rutas existentes hacia WODs, ejercicios, historial, estadisticas, perfil,
   login y registro continuan funcionando.
5. La interfaz se adapta desde 320 px hasta escritorio sin overflow horizontal,
   recortes de texto ni grids rigidos.
6. Se mantienen navegacion mediante teclado, foco visible, HTML semantico,
   labels accesibles y contraste suficiente.
7. Se reutilizan componentes y tokens existentes cuando corresponde, sin
   introducir dependencias nuevas ni cambios de backend o API.
8. El resultado adapta el lenguaje visual de la referencia a la identidad de
   WOD Explorer sin copiar textos, imagenes, branding ni contenido especifico de
   la plantilla.
9. `npm test`, `npm run lint` y `npm run build` finalizan correctamente.

## Archivos previstos

- `frontend/src/pages/HomePage.tsx`
- `frontend/src/pages/StatisticsPage.tsx`
- `frontend/src/components/Layout.tsx`
- `frontend/src/index.css`
- `frontend/src/App.test.tsx`
- `frontend/src/components/Layout.test.tsx`
- `frontend/src/pages/StatisticsPage.test.tsx`

## Referencias

- `docs/figma/fitness-dashboard-reference.md`
- `PRODUCT.md`
- `DESIGN.md`
- `frontend/src/pages/HomePage.tsx`
- `frontend/src/pages/StatisticsPage.tsx`
- `frontend/src/components/Layout.tsx`
- `frontend/src/index.css`
