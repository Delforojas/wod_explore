# Referencia visual de fitness para WOD Explorer

## Alcance y evidencia

Análisis realizado el 13 de septiembre de 2026 mediante Figma MCP sobre el [nodo de referencia](https://www.figma.com/design/tmAUmUUFmO3cXMS7sJpcJk/Fitness-Dashboard--Community-?node-id=1-2), archivo `tmAUmUUFmO3cXMS7sJpcJk`, nodo `1:2`.

Se consultaron `get_design_context` (representación React/Tailwind, propiedades y captura) y `get_metadata` (árbol, coordenadas y dimensiones). Las medidas siguientes corresponden al frame original de **1440 × 1024 px**, no al tamaño reducido de la captura. Los colores y estilos proceden del contexto generado; no se ha confirmado que sean variables o estilos compartidos del archivo.

Figma se utiliza exclusivamente como referencia visual. Este documento no autoriza implementación, nuevas funcionalidades, cambios de navegación, contratos, persistencia ni dependencias. No reproduce textos, imágenes, branding ni valores de entrenamiento de la plantilla. Los nombres de piezas usados aquí describen su función visual.

Contexto contrastado: [constitución](../constitution.md), [PRODUCT.md](../../PRODUCT.md), [AGENTS.md](../../AGENTS.md), [DESIGN.md](../../DESIGN.md) y [spec 035](../../specs/035-claridad-historial-evolucion/spec.md), correspondiente a la rama actual. Se inspeccionaron también los componentes disponibles, `frontend/package.json` y los tokens de `frontend/src/index.css`.

**Criterio de lectura:** «observado» describe evidencia del nodo; «recomendado» describe una posible adaptación, subordinada a las specs. La dirección editorial vigente de WOD Explorer prevalece sobre la apariencia de dashboard de la referencia.

## Estructura general del layout

Composición de escritorio asimétrica, oscura y prácticamente sin separaciones entre grandes superficies. El bloque central domina; las piezas de apoyo ocupan el lateral derecho y una franja inferior.

| Región observada | Geometría del frame | Evidencia |
| --- | --- | --- |
| Rail izquierdo | 127 px de ancho, toda la altura | `4:9` |
| Cabecera | Desde x=127; 1313 × 88 px | `4:7` |
| Panel principal | x=127, y=87; 982 × 686 px | `4:4` |
| Columna derecha | x=1109; 331 px de ancho | `6:48`, `12:64`, `12:65`, `12:66` |
| Cuatro paneles laterales | 234 px de alto cada uno, desde y=88 | Mismos nodos |
| Tres bloques inferiores | Aproximadamente 328 × 251 px, desde y=773 | `11:13`, `11:12`, `11:11` |

El panel principal combina titular, contexto breve, un indicador circular y una ilustración dominante. La caja de esa ilustración mide 930 × 465 px (`6:35`); su superficie visual ocupa gran parte del centro. La composición dirige la atención por escala y contraste, más que por contenedores elevados.

Las franjas inferiores del centro y del lateral no empiezan a la misma altura: y=773 frente a y=790. Las anchuras centrales presentan pequeños solapamientos de aproximadamente 1 px. Son detalles de construcción del mockup, no una cuadrícula que deba trasladarse literalmente a CSS.

## Navegación y sidebar

**Observado:** existen dos niveles visuales. El rail contiene una marca arriba y cinco accesos representados por iconos, sin etiquetas visibles. Uno aparece sobre un círculo oscuro de 48 × 48 px; los glifos habituales miden alrededor de 24 × 24 px. Los centros de los accesos se repiten aproximadamente cada 73 px.

La cabecera muestra cuatro entradas textuales; la primera destaca por peso y un subrayado corto de unos 25 px. A la derecha hay dos iconos asociados visualmente a avisos y cuenta. El nodo no demuestra destinos, menús desplegables, estados de foco ni comportamiento al pulsar. Tampoco confirma que el rail o la cabecera sean fijos durante el scroll.

**Recomendado:** adaptar la separación entre navegación y contenido y la señal clara de ubicación actual. Conservar las rutas y controles existentes de WOD Explorer, con etiquetas visibles en español y `aria-current` donde corresponda. No reproducir la doble navegación si duplica destinos. No añadir avisos, chat, ajustes ni otras pantallas por la presencia de un icono en Figma.

## Jerarquía visual

1. El titular de gran tamaño y la ilustración establecen el foco principal.
2. El rail naranja y un único panel lateral naranja actúan como anclas cromáticas.
3. Los títulos de los paneles organizan la información secundaria.
4. Etiquetas pequeñas y atenuadas contextualizan los valores y enlaces.

Hay una diferencia marcada entre protagonismo visual y utilidad: la imagen ocupa mucho espacio, mientras los valores inferiores son relativamente pequeños. Para WOD Explorer interesa conservar la diferencia de escala entre niveles, dando prioridad a resultados, marcas y contexto legible. El titular parcialmente delineado de la plantilla es un efecto expresivo, no una necesidad del producto.

## Paleta de colores

| Color observado | Uso en el nodo |
| --- | --- |
| `#343639` | Fondo central y cabecera |
| `#373D41` | Superficies secundarias alternas |
| `#323538` | Otros bloques laterales e inferiores |
| `#EC7E4A` | Rail, panel destacado, indicadores y acentos |
| `#FFFFFF` | Texto principal y elementos gráficos |
| Blanco al 70 % | Metadatos y etiquetas secundarias |
| Blanco al 60 % | Descripciones de los paneles laterales |

El blanco del frame queda mayoritariamente cubierto; también aparece un pequeño rectángulo gris en el árbol que no tiene un papel visible relevante. No conviene convertir estos residuos en tokens de producto.

**Adaptación:** reutilizar los tokens actuales de WOD Explorer: papel `--paper: #F3F0E8`, tinta `--ink: #17212B`, secundario `--ink-soft: #59636B`, línea `--line: #C8C2B7`, naranja `--orange: #EF5B25`, navy `--navy: #1C3240` y blanco cálido `--white: #FFFDF8`. Adoptar el uso selectivo del acento, sin sustituir toda la interfaz por el tema oscuro de Figma ni crear un selector de tema.

El texto blanco pequeño sobre naranja y las descripciones atenuadas requieren comprobar contraste antes de cualquier adaptación. No se declara conformidad de accesibilidad a partir de una captura.

## Tipografía

| Papel observado | Familia y estilo extraídos |
| --- | --- |
| Titular principal | Manrope, 48 px, semibold |
| Títulos de paneles | Manrope, 22 px, bold |
| Navegación | Manrope, 16 px; bold activo y light en otros enlaces |
| Valores y contexto principal | Manrope, 16 px, medium/semibold |
| Etiquetas de métricas | Manrope, 14 px, regular |
| Descripciones y enlaces compactos | Manrope, 12 px; descripciones con interlineado de 18 px |
| Indicador digital | Ubuntu regular, aproximadamente 24,36 px |
| Graduaciones circulares | Ubuntu regular, aproximadamente 5,63 px |

Gran parte del interlineado aparece como `normal`; no hay evidencia de una escala tipográfica formal. Las graduaciones diminutas no son una referencia adecuada para información necesaria.

**Adaptación:** mantener los titulares editoriales y las fuentes de sistema existentes, sin descargar Manrope o Ubuntu. Aplicar el contraste de tamaño y peso a título, valor, unidad y fecha; no copiar texto delineado ni mayúsculas extensas. Permitir envoltura de nombres y metadatos. Usar cifras tabulares para columnas numéricas cuando ayuden a comparar registros de la misma naturaleza.

## Cards y superficies

Se observan dos familias de paneles:

- **Panel lateral de contenido:** título, descripción corta, enlace con contorno e ilustración pequeña a la derecha. Cuatro repeticiones, con una variación naranja.
- **Bloque inferior de métrica:** título, icono de menú, dos pares de etiqueta/valor y una visualización compacta. Tres repeticiones con distinto contenido gráfico.

Estos paneles se tocan y se distinguen por el fondo. No son tarjetas flotantes con grandes radios y sombras uniformes.

Para WOD Explorer, adaptar encabezados consistentes y separación entre información principal y secundaria. Mantener los catálogos como filas técnicas y el historial como documento editorial. No transformar todos los registros en cards ni añadir menús de acciones sin operaciones existentes que los justifiquen.

## Métricas y estadísticas

**Observado:** la referencia reúne un indicador circular junto al contenido central y, debajo, tres resúmenes de actividad relacionados con energía, velocidad y duración. Utiliza un dial circular, ocho barras alternas y un recuadro de lectura digital. Los valores se acompañan de etiquetas temporales o de contexto.

No se observan ejes, leyendas o reglas suficientes para reconstruir el significado de todas las barras y segmentos. Las formas visibles no prueban cálculos, actualización en tiempo real, objetivos, filtros ni comparaciones válidas. No se trasladan los datos de muestra.

**Adaptación compatible con la spec 035:** separar resumen de actividad, marcas personales y secuencia de intentos; conservar fecha, valor, unidad, nivel o tipo y enlaces a detalle. Mostrar únicamente datos recibidos por los contratos existentes. Mantener la banda temporal decorativa y la lista textual completa de evolución.

No importar el dial como temporizador, añadir calorías, objetivos, totales derivados o comparaciones nuevas. No usar alturas de barras para comparar unidades distintas. La visualización debe apoyar la lectura de los datos existentes, sin definir nuevas reglas de negocio.

## Espaciado

**Observado:** los paneles laterales colocan sus títulos unos 32–36 px hacia dentro y 32–36 px desde arriba. Los bloques inferiores usan aproximadamente 35–37 px de margen interior horizontal y 35 px superior. El título central comienza 35 px dentro del panel. Las grandes superficies adyacentes no tienen un gutter visible.

Son distancias derivadas de coordenadas, no propiedades de padding o auto-layout confirmadas. El código generado usa mayoritariamente posiciones absolutas; una pequeña gráfica sí aparece como fila flex. Eso no demuestra un sistema responsive para toda la pantalla.

**Recomendado:** conservar un ritmo interior regular mediante la escala del proyecto; como orientación, 8/12 px entre piezas pequeñas, 16/24 px entre grupos y 32 px para secciones amplias. Son propuestas de adaptación, no tokens extraídos de Figma. Resolver alturas con contenido y espacios fluidos; no reproducir cajas de texto fijas que corten nombres, traducciones o errores.

## Bordes, sombras y radios

| Propiedad observada | Aplicación |
| --- | --- |
| Radio 20 px | Contorno exterior del frame |
| Borde blanco de 0,5 px y radio 10 px | Enlaces laterales, cajas de 109 × 33 px |
| Borde naranja de 2 px y radio cercano a 10 px | Recuadro del indicador digital |
| Sombra `0 4px 4px rgba(0,0,0,0.25)` | Cajas de ilustraciones laterales |
| Radios de 20 px y una variante de 23,33 px | Esas cajas de ilustración |
| Radios inferiores a 2 px | Barras de la gráfica compacta |

El suelo de la ilustración central incorpora además una sombra visual. La captura no permite inferir una receta general de elevación a partir de ella.

**Adaptación:** preferir las reglas finas y superficies del diseño editorial vigente. No aplicar el radio exterior al viewport ni usar recorte global para ocultar desbordamientos. No convertir sombras de assets en sombras de todas las cards. Los controles de 33 px de alto de Figma deben adaptarse al objetivo táctil actual de 44 px del proyecto.

## Componentes reutilizables

El árbol acredita algunas instancias de iconos, pero no una biblioteca completa de cards con variantes. La repetición visual permite identificar candidatos; no demuestra que existan como componentes publicados en Figma.

| Patrón aprovechable | Reutilización en WOD Explorer |
| --- | --- |
| Marco y navegación activa | Partir de `frontend/src/components/Layout.tsx` |
| Encabezado de sección y contexto | Reutilizar las estructuras y clases actuales de las páginas |
| Par etiqueta/valor | Composición semántica en historial y estadísticas, con los tipos existentes |
| Registro con metadatos y enlace | Mantener las filas editoriales y enlaces a detalle |
| Estados de contenido | Reutilizar `StateMessage.tsx`; no inferir estados ausentes en el mockup |
| Paginación | Conservar `PaginationControls.tsx` donde ya corresponde |

Extraer un componente solo si hay repetición real y responsabilidad compartida. Un bloque de resumen no necesita una abstracción universal que también gestione gráficas, formularios y navegación.

## Responsive: evidencia y propuesta

**Determinado:** el nodo analizado es una composición de escritorio de 1440 × 1024 px.

**No determinado:** variantes móviles/tablet, breakpoints, constraints completos, prioridad de ocultación, comportamiento de scroll, menús colapsables y estados interactivos. No se concluye que no existan en todo el archivo; no están acreditados por el nodo consultado.

**Recomendación para el producto:** seguir el enfoque mobile-first vigente. Desde 320 px, apilar las secciones en orden de lectura, conservar la navegación inferior existente y evitar desbordamiento horizontal. En tablet y escritorio, ampliar las columnas solo cuando el contenido tenga espacio, manteniendo la jerarquía editorial. Reservar espacio para la barra inferior y las zonas seguras; permitir zoom y nombres largos. Esta propuesta procede de los requisitos del proyecto, no de un diseño móvil observado en Figma.

## Qué adaptar y qué no copiar

| Adaptar como principio visual | No copiar |
| --- | --- |
| Un bloque dominante y otros de apoyo | La pantalla completa como nuevo dashboard |
| Acento cromático concentrado | Marca, logotipo, paleta impuesta como nueva identidad |
| Separación clara entre título, valor y contexto | Textos promocionales, nombres y valores de muestra |
| Indicador de navegación activa | Destinos de plantilla, avisos, mensajes o funcionalidades adicionales |
| Ritmo consistente en paneles repetidos | Imágenes anatómicas, objetos 3D, iconos exportados y otros assets |
| Resúmenes escaneables junto a registros completos | Calorías, planes, objetivos, cronómetros o métricas no contratadas |
| Composición asimétrica | Coordenadas absolutas, altura fija de pantalla y recorte del contenido |

La referencia no justifica rediseñar Home, catálogos, perfil o detalles dentro de la spec 035. Cualquier aplicación futura debe permanecer en la superficie y comportamiento autorizados por su spec correspondiente.

## Recomendaciones para React + TypeScript + Tailwind

Estas orientaciones no son una implementación ni una propuesta de cambio de dependencias. Se han consultado las skills locales de React, composición, TypeScript y Tailwind.

1. **Partir del código existente.** Mantener `Layout`, páginas, estados y paginación; componer pequeños bloques presentacionales. Evitar copiar el componente monolítico generado por el MCP, sus imágenes y sus posiciones absolutas.
2. **Conservar contratos y tipos.** Las props deben derivar de los tipos existentes y mantener unidad, formato, fecha e identificador. Usar TypeScript estricto, sin `any` ni conversiones forzadas para introducir métricas inexistentes. Mantener acceso a datos y lógica de negocio fuera de las piezas visuales.
3. **Componer sin proliferación de booleanos.** Preferir `children` y variantes explícitas cuando sean necesarias. No introducir providers, estado global, genéricos complejos ni memoización para resolver un cambio de aspecto.
4. **Traducir la composición a flujo normal.** Grid para regiones y Flexbox para grupos pequeños; tamaños intrínsecos, `minmax(0, 1fr)` y `min-w-0` donde el contenido deba encoger. Evitar posicionar textos mediante coordenadas de Figma.
5. **Tailwind queda condicionado al alcance.** `frontend/package.json` no declara Tailwind y el estilo actual reside en `frontend/src/index.css`. No instalarlo ni migrar estilos como consecuencia de este documento; la spec 035 prohíbe dependencias nuevas. Si una spec posterior autoriza esa integración, mapear los tokens existentes a su configuración compatible, conservando nombres semánticos de color y espacios.
6. **Utilidades orientativas, no configuración extraída:** `grid`, `flex`, `gap-4`, `gap-6`, `p-4`, `min-w-0`, `w-full`, `tabular-nums` y variantes responsive/focus pueden expresar estos patrones. Elegir breakpoints por el contenido; no presentar los valores predeterminados de Tailwind como medidas de Figma. Mantener clases completas para variantes, evitando nombres construidos dinámicamente.
7. **HTML y accesibilidad.** Usar `nav`, `main`, secciones con encabezados y enlaces reales para navegación; botones para acciones. Conservar foco visible, etiquetas accesibles y contexto textual de las métricas. No ocultar información necesaria al reducir ancho ni depender solo del color. Estas recomendaciones también se apoyan en las [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md).
8. **Verificar cuando se implemente.** Probar móvil desde 320 px, tablet, escritorio, zoom, teclado, textos largos y estados de carga/vacío/error. Si se modifica frontend, ejecutar sus scripts existentes `npm test`, `npm run lint` y `npm run build`; este último incluye la comprobación TypeScript. No añadir librerías de gráficas, iconos o fuentes por semejanza con la plantilla.

## Límites y verificación documental

La captura y el contexto del nodo se han contrastado con sus metadatos. Se distingue entre medidas observadas, interpretación visual y recomendaciones. No se han descargado assets, ejecutado prototipos ni validado interacciones o responsive en Figma.

Esta tarea crea únicamente este documento. No requiere tests, lint ni build de la aplicación porque no modifica código, configuración o dependencias. La verificación aplicable es revisar la cobertura de los apartados, los enlaces locales, el formato del diff y que los cambios propios queden limitados a este archivo.
