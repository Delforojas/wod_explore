---
name: WOD Explorer
description: Sistema visual editorial, deportivo y tecnologico para explorar y registrar entrenamientos.
colors:
  paper: "#f3f0e8"
  paper-deep: "#e8e2d7"
  ink: "#17212b"
  ink-soft: "#59636b"
  line: "#c8c2b7"
  orange: "#ef5b25"
  orange-ink: "#a43f1c"
  orange-soft: "#f7b28f"
  navy: "#1c3240"
  navy-deep: "#12232c"
  navy-soft: "#294653"
  green: "#17633d"
  white: "#fffdf8"
  orange-hover: "#c94316"
  support-hover: "#345765"
  accent-hover: "#d84c1b"
typography:
  display:
    fontFamily: "Georgia, Times New Roman, serif"
    fontSize: "clamp(42px, 7vw, 88px)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.06em"
  headline:
    fontFamily: "Georgia, Times New Roman, serif"
    fontSize: "clamp(42px, 5vw, 76px)"
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: "-0.05em"
  title:
    fontFamily: "Georgia, Times New Roman, serif"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.04em"
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "10px"
    fontWeight: 800
    letterSpacing: "0.12em"
rounded:
  none: "0"
  subtle: "2px"
  circular: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  section: "36px"
components:
  button-primary:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "10px 17px"
  button-primary-hover:
    backgroundColor: "{colors.orange-hover}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "10px 17px"
  input-field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
  nav-active:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "10px"
---

# Design System: WOD Explorer

## Overview

**Creative North Star: "El archivo editorial del esfuerzo"**

WOD Explorer combina la energia de un entorno deportivo con la precision de un
archivo de entrenamiento. La interfaz debe sentirse activa, tecnica y ordenada,
pero no como un dashboard SaaS generico: cada superficie ayuda a explorar un WOD,
entender un resultado o volver a una sesion con contexto.

La direccion vigente parte del dashboard principal implementado en `HomePage` y
de la lectura de composicion, escala, densidad y ritmo de la referencia Figma.
La referencia inspira relaciones visuales, no contenido de producto. El sistema
mantiene texto en espanol, fuentes disponibles en el sistema y los tokens CSS
existentes como fuente de verdad.

**Key Characteristics:**

- Superficies navy continuas con acento naranja concentrado.
- Composiciones asimetricas con un bloque dominante y apoyos contiguos.
- Jerarquia editorial, reglas finas y datos faciles de escanear.
- Densidad intencionada sin sacrificar wrapping, foco ni lectura movil.

## Colors

La paleta contrapone papel calido e tinta con una familia navy para las
composiciones de mayor protagonismo. El naranja comunica accion, seleccion y
energia; no debe convertirse en una textura decorativa omnipresente.

### Primary

- **Naranja de accion** (`{colors.orange}`): botones primarios, indicadores,
  bordes de enfasis y superficies destacadas.
- **Naranja de texto** (`{colors.orange-ink}`): enlaces, metadatos y valores que
  necesitan contraste sobre papel.
- **Naranja suave** (`{colors.orange-soft}`): etiquetas y metadatos sobre navy.

### Secondary

- **Navy estructural** (`{colors.navy}`): superficies de navegacion, resumen y
  estadisticas.
- **Navy profundo** (`{colors.navy-deep}`): fondo del bloque principal del Home y
  capas de mayor contraste.
- **Navy de apoyo** (`{colors.navy-soft}`): paneles secundarios contiguos.

### Neutral

- **Papel** (`{colors.paper}`): fondo general y lectura principal.
- **Papel profundo** (`{colors.paper-deep}`): hover y contraste suave de
  navegacion.
- **Tinta** (`{colors.ink}`): texto principal y bordes estructurales.
- **Tinta secundaria** (`{colors.ink-soft}`): descripciones, metadatos y estados
  secundarios.
- **Linea** (`{colors.line}`): divisores y bordes de baja intensidad.
- **Blanco calido** (`{colors.white}`): texto sobre navy y superficies de
  contenido.
- **Verde de exito** (`{colors.green}`): estados confirmados o completados.

**The One Accent Rule.** El naranja debe tener una funcion clara de accion,
estado o orientacion. No usarlo para colorear cada elemento ni como sustituto
de una jerarquia tipografica.

## Typography

**Display Font:** Georgia, Times New Roman, serif.

**Body Font:** ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
Segoe UI, sans-serif.

**Character:** La serif editorial da peso y memoria a titulares y valores; la
sans del sistema mantiene datos, controles y metadatos compactos y funcionales.
No descargar fuentes externas para imitar la referencia Figma.

### Hierarchy

- **Display** (400, `clamp(42px, 7vw, 88px)`, line-height 0.95): titulo principal
  de una pantalla y contexto de primer nivel.
- **Headline** (400, `clamp(42px, 5vw, 76px)`, line-height 0.94): bloque principal
  dominante del Home y mensajes editoriales de mayor peso.
- **Title** (400, `28px`, serif): titulos de seccion, formularios y tarjetas de
  informacion.
- **Body** (400, `15px`, line-height 1.55): explicaciones y copy de apoyo, con
  lineas cortas cuando acompanen un bloque dominante.
- **Label** (800, `10px`, letter-spacing `0.12em`, uppercase): contexto,
  categoria, unidad o estado. Nunca debe ser el unico lugar donde se comunica
  informacion esencial.

**The Two Voices Rule.** Usar serif para jerarquia y valores memorables; usar
sans para lectura operativa. No mezclar familias dentro de una misma etiqueta
 ni usar mayusculas extensas en parrafos.

## Layout

El layout parte de una superficie contenedora fluida, con `min-width: 0`,
`minmax(0, 1fr)` y alturas determinadas por el contenido. En escritorio puede
usar una composicion asimetrica: una region principal dominante y una columna de
apoyo. Los paneles contiguos se separan con reglas y cambios de superficie en
lugar de gutters grandes o tarjetas flotantes repetidas.

El ritmo base usa grupos compactos de 4/8/12 px, espacios de control de 16/24
px y separaciones de seccion cercanas a 36 px. El contenido general usa padding
fluido y la shell conserva una barra superior de aproximadamente 74 px.

El sistema es mobile-first desde 320 px. En movil, el contenido se apila en
orden de lectura, los metadatos pueden envolver y la navegacion inferior reserva
espacio para el area segura. En tablet se reorganizan las columnas cuando el
contenido lo permite; en escritorio se recupera la composicion asimetrica sin
fijar texto, ocultar datos necesarios o provocar overflow horizontal.

## Elevation & Depth

El sistema es plano por defecto. La profundidad se comunica mediante navy,
variaciones tonales, bordes y continuidad entre paneles; no mediante sombras
decorativas globales. Las sombras observadas en la referencia Figma no se
trasladan como regla de producto. Un cambio de estado puede alterar superficie o
borde, pero no debe convertir cada card en un objeto elevado.

**The Contiguous Surface Rule.** Las piezas que pertenecen al mismo flujo deben
parecer una composicion unificada. Usar separadores, contraste tonal y agrupacion
funcional antes que sombras o radios grandes.

## Shapes

La geometria es sobria y mayoritariamente cuadrada (`{rounded.none}`). Los
bordes finos y las reglas horizontales organizan la interfaz. El radio circular
se reserva para indicadores decorativos o marcadores de estado; un radio sutil
puede aparecer en una forma tecnica puntual (`{rounded.subtle}`), no como estilo
global de cards.

Los controles principales mantienen al menos 44 px de altura tactil. No recortar
contenido con un radio o un overflow global. Las filas, paneles y formularios
deben crecer con nombres largos, traducciones y mensajes de error.

## Components

### Buttons

- **Character:** directos, tactiles y de alto contraste, con una sola accion
  primaria por region.
- **Shape:** silueta cuadrada, sin radio global; altura minima de 44 px.
- **Primary:** naranja de accion, tinta como texto inicial y padding `10px 17px`.
- **Hover / Focus:** naranja profundo en hover; todos los botones muestran un
  foco visible de 3 px con offset de 3 px.
- **Secondary / Quiet:** fondo transparente, borde o texto de tinta secundaria;
  no competir con la accion primaria.

### Chips

- **Style:** etiquetas tecnicas con borde fino, texto secundario o naranja de
  texto y padding compacto.
- **State:** un chip puede comunicar tipo, nivel o unidad; no reemplaza un
  control de filtro ni depende solo del color para indicar seleccion.

### Cards / Containers

- **Corner Style:** paneles contiguos y cuadrados por defecto.
- **Background:** papel para lectura y navy/navy profundo/navy de apoyo para
  composiciones de mayor contraste.
- **Shadow Strategy:** sin sombra en reposo; la profundidad procede de superficie
  y borde.
- **Border:** reglas de tinta, linea o blanco translucido segun la superficie.
- **Internal Padding:** 16/24 px para piezas funcionales y hasta 36 px para
  paneles dominantes, siempre con valores fluidos cuando corresponda.

### Inputs / Fields

- **Style:** blanco calido o papel, borde de linea, silueta cuadrada y texto de
  tinta; labels en sans del sistema y uppercase.
- **Focus:** outline naranja visible de 3 px con offset de 3 px, sin depender de
  un cambio de color sutil.
- **Error / Disabled:** error con borde naranja y mensaje comprensible; disabled
  con opacidad y cursor de espera, sin ocultar la razon del estado.

### Navigation

- **Style:** la shell separa cabecera, rail de escritorio y navegacion inferior
  movil sin duplicar destinos innecesariamente.
- **Default / Hover:** tinta secundaria sobre papel; el hover usa papel profundo
  o una variacion tonal de la superficie actual.
- **Active:** peso fuerte, regla o marcador naranja y `aria-current="page"`;
  nunca comunicar ubicacion solo mediante color.
- **Mobile:** accesos con targets de al menos 44 px y espacio para safe areas.

### Lists, Tables & Filters

- **Lists:** preferir filas editoriales con separadores, metadatos envueltos,
  valor destacado y enlace contextual.
- **Tables:** usar alineacion y cifras tabulares solo cuando compare valores del
  mismo tipo; no forzar una tabla rigida en 320 px.
- **Filters:** agrupar label, campo y accion con orden de lectura evidente; los
  filtros activos deben ser comprensibles en texto.

### States

- **Loading:** estado explicito con marcador animado y alternativa respetuosa de
  `prefers-reduced-motion`.
- **Empty:** explicar que falta y ofrecer un siguiente paso cuando exista una
  exploracion util.
- **Error / Network / Private:** distinguir el problema con texto, marcador,
  contraste y accion de recuperacion; no depender del color.

## Do's and Don'ts

### Do:

- **Do** usar `--navy` como superficie continua cuando una pantalla necesite
  protagonismo y `--orange` como acento estructural.
- **Do** hacer dominante una region y organizar alrededor los paneles de apoyo.
- **Do** reutilizar los tokens y estilos existentes antes de crear valores nuevos.
- **Do** mantener headings, landmarks, enlaces reales, foco visible y targets de
  44 px.
- **Do** permitir wrapping y crecimiento intrinseco en movil, zoom y textos
  largos.
- **Do** documentar y presentar estadisticas solo con datos existentes en los
  contratos del producto.

### Don't:

- **Don't** convertir cada region en una cuadrilla repetitiva de cards identicas.
- **Don't** copiar textos, branding, imagenes, datos o assets de la referencia
  Figma.
- **Don't** introducir sombras, radios grandes, graficas o metricas inventadas
  para parecerse a una plantilla.
- **Don't** usar color, posicion o un elemento decorativo como unico canal de
  significado.
- **Don't** ocultar contenido, fijar alturas que corten texto o usar overflow
  global para tapar problemas responsive.
- **Don't** cambiar la fuente de datos, las rutas o la semantica funcional desde
  una decision visual.
