---
name: WOD Explorer
description: Sistema visual deportivo, técnico e industrial centrado en rendimiento, entrenamiento y métricas.

colors:
  background: "#0b1117"
  surface: "#111a22"
  surface-raised: "#18232d"
  surface-hover: "#202d37"

  border: "#293640"
  border-strong: "#3b4b57"

  text: "#f4f7f8"
  text-secondary: "#a2adb5"
  text-muted: "#727f88"

  orange: "#ef5b25"
  orange-hover: "#d94d19"
  orange-soft: "#3a2118"

  green: "#35b86b"
  green-soft: "#153322"

  danger: "#e05252"
  white: "#ffffff"

typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(36px, 5vw, 64px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.04em"

  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(28px, 4vw, 48px)"
    fontWeight: 750
    lineHeight: 1
    letterSpacing: "-0.03em"

  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"

  metric:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(32px, 5vw, 56px)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.04em"
    fontVariantNumeric: "tabular-nums"

  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5

  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: "0.08em"

rounded:
  none: "0"
  subtle: "3px"
  control: "4px"
  circular: "50%"

spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  section: "32px"

components:
  button-primary:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    padding: "10px 16px"

  button-primary-hover:
    backgroundColor: "{colors.orange-hover}"
    textColor: "{colors.white}"

  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "12px 14px"

  nav-active:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text}"
    accentColor: "{colors.orange}"
---

# Design System: WOD Explorer

## Overview

**Creative North Star: "El rendimiento es la interfaz"**

WOD Explorer es una aplicación de entrenamiento y rendimiento.

La interfaz debe transmitir esfuerzo, precisión, progresión y competición.
Debe sentirse más próxima a una herramienta utilizada para entrenar y analizar
rendimiento que a una revista, archivo editorial o dashboard corporativo.

Los datos deportivos son los protagonistas del sistema visual.

Tiempos, pesos, repeticiones, rondas, distancias, posiciones y récords personales
deben poder identificarse rápidamente y tener mayor jerarquía que el contenido
descriptivo que los acompaña.

La identidad visual combina:

- estética deportiva;
- precisión técnica;
- superficies industriales;
- alta legibilidad;
- densidad informativa controlada;
- jerarquía fuerte de métricas.

El sistema evita deliberadamente:

- estética editorial o de revista;
- tipografía serif estructural;
- grandes bloques de copy decorativo;
- dashboards SaaS genéricos;
- exceso de cards flotantes;
- glassmorphism;
- gradientes decorativos;
- sombras prominentes;
- radios excesivos;
- decoración sin función.

## Design Principles

### 1. Performance First

La información relacionada con rendimiento tiene prioridad visual.

Cuando una superficie contiene una métrica deportiva y contexto descriptivo,
la métrica debe identificarse primero.

Ejemplo conceptual:

102 KG

BACK SQUAT
1RM · PR

y no una composición donde el nombre o una frase editorial tenga mayor peso
que el resultado.

### 2. Data Has Hierarchy

No todos los datos tienen el mismo peso.

Jerarquía recomendada:

1. resultado o métrica principal;
2. unidad;
3. ejercicio o WOD;
4. estado deportivo como PR, RX o completado;
5. fecha y metadatos;
6. información secundaria.

Las unidades deben permanecer visualmente asociadas a sus valores.

### 3. Functional Density

La interfaz debe aprovechar el espacio para mostrar información útil sin
convertirse en una interfaz saturada.

Evitar grandes zonas vacías utilizadas únicamente para producir una composición
editorial.

El espacio debe utilizarse para mejorar agrupación, lectura y jerarquía.

### 4. Industrial Structure

La estructura visual se construye mediante:

- superficies oscuras;
- contraste;
- bordes;
- divisores;
- alineación;
- bloques funcionales;
- cambios tonales.

No depender de sombras o grandes radios para separar contenido.

### 5. Orange Means Something

El naranja es el acento principal de WOD Explorer.

Debe utilizarse para:

- acciones primarias;
- selección;
- navegación activa;
- foco;
- indicadores relevantes;
- énfasis puntual.

No utilizar grandes superficies naranjas como decoración general.

## Colors

WOD Explorer utiliza una interfaz predominantemente oscura.

### Background

`{colors.background}` constituye el fondo principal de la aplicación.

Debe permitir que navegación, superficies y métricas formen una estructura
continua sin producir grandes contrastes arbitrarios entre páginas.

### Surfaces

- `{colors.surface}`: contenido principal.
- `{colors.surface-raised}`: agrupaciones que requieren separación adicional.
- `{colors.surface-hover}`: interacción o selección temporal.

Las superficies deben diferenciarse mediante cambios tonales contenidos.

### Text

- `{colors.text}`: información primaria.
- `{colors.text-secondary}`: información contextual.
- `{colors.text-muted}`: metadatos de menor importancia.

No reducir el contraste de información necesaria únicamente para conseguir una
apariencia más minimalista.

### Accent

`{colors.orange}` representa energía, acción y orientación.

Aplicar **The One Accent Rule**:

cada uso del naranja debe tener una función reconocible.

### Success / Performance

`{colors.green}` puede utilizarse para estados positivos relacionados con
rendimiento, como un récord personal confirmado.

El color nunca debe ser el único canal para comunicar el estado.

## Typography

WOD Explorer utiliza una voz tipográfica principalmente sans-serif.

La tipografía debe sentirse deportiva, directa y funcional.

La serif editorial no forma parte de la identidad estructural del producto.

### Display

Reservada para títulos de pantalla importantes.

Debe ser contundente pero no ocupar espacio desproporcionado respecto al
contenido funcional.

### Headline

Utilizada para jerarquía secundaria y encabezados importantes.

### Title

Utilizada en:

- WODs;
- ejercicios;
- secciones;
- paneles;
- formularios.

### Metric

Las métricas tienen una categoría tipográfica propia.

Debe utilizar:

- peso alto;
- cifras tabulares cuando corresponda;
- contraste elevado;
- espacio reducido entre valor y unidad.

Ejemplos:

03:42

102 KG

21 REPS

11 ROUNDS

400 M

### Labels

Los labels proporcionan contexto técnico:

RX
PR
AMRAP
FOR TIME
KG
REPS

Las mayúsculas compactas son apropiadas para este tipo de información, pero no
para párrafos o textos largos.

## Layout

El layout debe estar orientado a uso frecuente y consulta rápida.

La shell global proporciona una estructura estable para que el usuario pueda
moverse entre entrenamiento, resultados y estadísticas sin que cada página
parezca una composición diferente.

### Desktop

Puede utilizar navegación lateral compacta y una superficie principal amplia.

La navegación no debe competir visualmente con los datos.

### Tablet

Las regiones secundarias pueden reorganizarse debajo o junto al contenido
principal según el espacio disponible.

### Mobile

Mobile-first desde 320 px.

La interfaz debe:

- mantener el orden lógico de lectura;
- evitar overflow horizontal;
- mantener targets interactivos de al menos 44 px;
- permitir wrapping;
- conservar visibles las métricas importantes;
- respetar safe areas cuando corresponda.

## Navigation

La navegación forma parte de la infraestructura del producto, no de su
decoración.

Debe ser:

- compacta;
- predecible;
- oscura;
- claramente escaneable.

El estado activo utiliza contraste y un indicador naranja.

No utilizar grandes superficies naranjas para representar la navegación activa.

Los iconos pueden apoyar la navegación, pero no deben sustituir etiquetas
necesarias para comprender destinos principales.

## Metrics

Las métricas constituyen uno de los elementos fundamentales del sistema.

Una métrica puede estar compuesta por:

- valor;
- unidad;
- contexto;
- comparación;
- estado.

Ejemplo conceptual:

102 KG
BACK SQUAT
1RM · PR

La jerarquía visual debe hacer reconocible `102 KG` antes que los metadatos.

Cuando se comparen resultados utilizar cifras tabulares cuando resulte útil.

No inventar métricas que no existan en los contratos reales del producto.

## Components

### Buttons

Los botones son compactos, directos y de alto contraste.

Primary:

- naranja;
- texto claro;
- radio reducido;
- altura mínima 44 px.

Secondary:

- superficie oscura;
- borde visible;
- texto principal.

Quiet:

- sin superficie dominante;
- utilizado únicamente para acciones secundarias.

Todos los estados interactivos deben proporcionar feedback visible.

### Inputs

Los inputs utilizan superficies oscuras y bordes definidos.

Deben mantener:

- labels visibles;
- estados focus claros;
- mensajes de error comprensibles;
- targets adecuados;
- contraste suficiente.

El focus utiliza el color de acento y no depende únicamente de un cambio tonal
sutil.

### Badges

Los badges representan información compacta:

- RX;
- PR;
- tipo de WOD;
- nivel;
- estado;
- unidad cuando corresponda.

Deben ser pequeños y técnicos.

No convertir todos los metadatos en badges.

### Cards / Panels

Preferir el término conceptual **panel** frente a una colección de cards
independientes.

Los paneles utilizan:

- superficies oscuras;
- bordes;
- divisores;
- radio mínimo;
- ausencia de sombras decorativas.

Evitar el patrón:

card + card + card + card

cuando filas, listas o una superficie continua comuniquen mejor la información.

### Lists

Las listas deportivas deben favorecer comparación y escaneo.

Utilizar:

- alineación;
- divisores;
- jerarquía tipográfica;
- métricas;
- metadatos secundarios.

Evitar convertir listas largas en colecciones de tarjetas grandes.

### Tables

Utilizar tablas cuando exista comparación real entre valores equivalentes.

En móvil deben adaptarse sin provocar overflow horizontal innecesario.

## States

### Loading

Comunicar explícitamente que existe una operación en curso.

Respetar `prefers-reduced-motion`.

### Empty

Explicar:

- qué falta;
- por qué puede estar vacío;
- qué acción útil puede realizar el usuario.

### Error

Mostrar:

- problema;
- contexto cuando sea apropiado;
- posible recuperación.

### Personal Record

Los PR pueden recibir énfasis visual adicional mediante:

- peso tipográfico;
- badge;
- indicador;
- color de éxito.

Nunca únicamente mediante color.

## Shapes

La geometría es predominantemente recta.

Utilizar:

- `{rounded.none}` para estructuras;
- `{rounded.subtle}` o `{rounded.control}` para controles cuando ayude a
  diferenciarlos;
- `{rounded.circular}` únicamente para elementos que conceptualmente sean
  circulares.

Evitar radios grandes como recurso decorativo global.

## Elevation & Depth

El sistema es esencialmente plano.

La profundidad procede de:

1. background;
2. surface;
3. surface-raised;
4. bordes;
5. interacción.

Las sombras no constituyen un mecanismo principal de jerarquía.

## Accessibility

La identidad visual nunca prevalece sobre la accesibilidad.

Mantener:

- contraste suficiente;
- navegación mediante teclado;
- foco claramente visible;
- HTML semántico;
- labels asociados;
- targets de al menos 44 px;
- estados que no dependan únicamente del color;
- compatibilidad con zoom;
- `prefers-reduced-motion`.

## Do's and Don'ts

### Do

- Dar protagonismo visual a métricas reales.
- Utilizar superficies oscuras continuas.
- Utilizar naranja para acción, selección y orientación.
- Utilizar sans-serif como voz estructural.
- Favorecer filas y paneles cuando permitan mayor densidad.
- Mantener una jerarquía clara entre resultado y contexto.
- Utilizar bordes y contraste tonal para estructurar.
- Reutilizar tokens antes de crear nuevos valores.
- Mantener responsive y accesibilidad desde el diseño inicial.

### Don't

- Utilizar serif editorial como identidad estructural.
- Crear titulares gigantes únicamente como decoración.
- Utilizar grandes superficies naranjas sin función.
- Convertir cada dato en una card.
- Introducir `rounded-xl` o radios grandes como patrón global.
- Utilizar sombras prominentes.
- Utilizar glassmorphism.
- Introducir gradientes decorativos.
- Crear dashboards SaaS genéricos.
- Inventar gráficas o métricas para llenar espacio.
- Ocultar información importante para conseguir una composición visual.
- Copiar branding, assets o layouts completos de productos externos.
- Cambiar contratos API o comportamiento funcional desde decisiones visuales.
