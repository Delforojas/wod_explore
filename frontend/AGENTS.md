# AGENTS.md — Frontend

## Ámbito

Este archivo aplica a todo el contenido dentro de `frontend/`.

Las reglas globales definidas en el `AGENTS.md` raíz siguen siendo obligatorias.

`DESIGN.md` es la fuente de verdad del lenguaje visual de WOD Explorer y debe

consultarse antes de implementar o modificar cualquier interfaz visual.

Toda tarea frontend debe respetar, en este orden:

1. La Constitución del proyecto.

2. La spec activa.

3. El `AGENTS.md` raíz.

4. Este `frontend/AGENTS.md`.

5. `DESIGN.md` para decisiones visuales y de interacción.

6. Las skills aplicables.

Si existe un conflicto entre estas fuentes, prevalece la de mayor prioridad.

Si una spec autoriza explícitamente una evolución del sistema visual, puede

modificarse `DESIGN.md` como parte de esa Issue. En caso contrario, no se debe

alterar ni contradecir el lenguaje visual definido en `DESIGN.md`.

---

## Stack

El frontend utiliza:

- React
- TypeScript
- Vite
- Tailwind CSS
- Zod

TypeScript debe mantenerse en modo estricto.

Los textos visibles de la aplicación estarán en español salvo que una spec indique lo contrario.

Los identificadores de código estarán en inglés.

---

## Arquitectura

Mantener separación clara entre responsabilidades como:

```text
components
pages
hooks
services
types
schemas
utils
data
```

La organización concreta deberá respetar la estructura existente.

No crear nuevas capas o carpetas sin necesidad real.

---

## Componentes React

Los componentes deben centrarse principalmente en presentación y composición.

Evitar componentes con:

- Demasiadas responsabilidades.
- Lógica de negocio compleja.
- Acceso a datos mezclado innecesariamente con presentación.
- Estado innecesariamente elevado.

Extraer lógica reutilizable cuando aporte claridad real.

No crear abstracciones únicamente para reducir líneas de código.

---

## TypeScript

Evitar `any`.

Preferir tipos explícitos y reutilizables.

Utilizar cuando corresponda:

- `interface`.
- `type`.
- Discriminated unions.
- Tipos derivados.
- `unknown` para datos externos todavía no validados.

No utilizar assertions con `as` únicamente para ocultar errores del sistema de tipos.

---

## Zod

Los datos externos o JSON que requieran validación deberán validarse mediante Zod cuando corresponda.

Cuando sea razonable, derivar los tipos desde el schema:

```ts
type Exercise = z.infer<typeof exerciseSchema>;
```

Evitar mantener manualmente un tipo y un schema equivalentes cuando el tipo pueda derivarse.

---

## API

Toda integración HTTP deberá:

- Manejar errores.
- Evitar URLs hardcodeadas cuando exista configuración.
- Mantener la lógica reutilizable de acceso a API fuera de componentes visuales.
- Respetar los contratos definidos por el backend.
- Gestionar estados de carga cuando corresponda.

No asumir contratos API que no estén definidos.

No inventar endpoints.

---

## Diseño

`DESIGN.md` es la fuente de verdad del lenguaje visual de WOD Explorer.

Antes de implementar o modificar cualquier interfaz visual:

1. leer `DESIGN.md`;

2. identificar los tokens, patrones y componentes aplicables;

3. comprobar la spec activa;

4. implementar respetando ambas fuentes.

La spec define qué debe conseguir la pantalla o funcionalidad.

`DESIGN.md` define cómo debe expresarse visualmente dentro del producto.

No introducir decisiones visuales que contradigan `DESIGN.md` salvo que la spec

autorice explícitamente una evolución del sistema visual.

No introducir sin justificación:

- nuevas familias tipográficas;

- nuevos colores;

- nuevos radios;

- nuevas sombras;

- nuevos patrones de componentes;

- nuevos estilos de navegación;

- nuevos patrones de representación de métricas.

Cuando exista un token o patrón equivalente en el sistema visual, reutilizarlo.

Si una necesidad visual no está contemplada en `DESIGN.md`, no inventar una

nueva convención global silenciosamente. Evaluar si se trata de una necesidad

local o de una evolución del sistema visual.

Priorizar:

- jerarquía visual clara;

- información deportiva escaneable;

- consistencia;

- densidad informativa adecuada;

- responsive mobile-first;

- accesibilidad;

- reutilización del sistema visual existente.

---

## Tailwind CSS

Utilizar Tailwind como sistema principal de estilos.

Evitar CSS personalizado salvo que exista una necesidad clara.

No repetir grandes bloques de clases cuando una abstracción reutilizable mejore realmente el código.

No crear componentes genéricos prematuramente.

---

## Responsive

Diseñar mobile-first.

Comprobar como mínimo:

- Móvil.
- Tablet.
- Escritorio.

No asumir únicamente tamaños desktop durante la implementación.

---

## Accesibilidad

La accesibilidad es obligatoria.

Mantener:

- HTML semántico.
- Labels asociados a inputs.
- Navegación mediante teclado.
- Focus visible.
- Contraste suficiente.
- Botones reales para acciones.
- Links reales para navegación.

No utilizar `div` con handlers como sustituto innecesario de elementos interactivos nativos.

Añadir ARIA únicamente cuando HTML semántico no sea suficiente.

---

## Formularios

Los formularios deberán:

- Mostrar errores comprensibles.
- Mantener una jerarquía visual clara.
- Comunicar estados de carga.
- Evitar múltiples submits accidentales.
- Gestionar correctamente estados de éxito y error.

La validación frontend mejora la experiencia de usuario, pero no sustituye la validación backend.

---

## Estado

Mantener el estado lo más local posible.

No introducir librerías globales de estado salvo que una spec justifique su necesidad.

No utilizar contexto global para resolver problemas estrictamente locales.

---

## Rendimiento

Evitar optimizaciones prematuras.

No utilizar `useMemo`, `useCallback` o memoización sin una razón concreta.

Priorizar:

- Renders simples.
- Componentes con responsabilidades claras.
- Datos bien estructurados.
- Evitar trabajo innecesario durante render.

---

## Skills

Cuando sean relevantes, utilizar las skills disponibles relacionadas con:

- React.
- TypeScript.
- Tailwind CSS.
- Composición de componentes.
- Accesibilidad.
- Diseño web.
- Zod.

Las skills no pueden contradecir:

1. La spec activa.
2. Este `AGENTS.md`.
3. El `AGENTS.md` raíz.

---

## Backend

No modificar backend desde una tarea frontend salvo que la spec lo requiera explícitamente.

Si un requisito frontend necesita un endpoint inexistente:

1. Identificar la dependencia.
2. Comprobar la spec activa.
3. Detener la implementación si el contrato backend no está definido.

No inventar endpoints para adaptar el frontend.

---

## Testing

Añadir tests cuando la funcionalidad y la infraestructura existente lo permitan.

Priorizar tests sobre comportamiento relevante:

- Interacción.
- Validación.
- Estados.
- Navegación.
- Manejo de respuestas API.

Evitar tests excesivamente acoplados a detalles internos de implementación.

---

## Verificación

Antes de considerar completada una tarea frontend ejecutar los comandos definidos por el proyecto, normalmente:

```bash
npm run lint
npm run test
npm run build
```

o los equivalentes existentes en `package.json`.

No afirmar que una tarea está completada si alguno de los checks obligatorios falla.

---

## MCP

### `wodsql`

El frontend no debe utilizar directamente `wodsql` para implementar lógica visual.

Puede utilizarse como herramienta de inspección cuando sea necesario comprender el estado real de los datos.

### `delfohub`

Puede utilizarse para:

- Consultar Issues.
- Consultar requisitos.
- Revisar Pull Requests.
- Consultar ramas.
- Verificar trabajo relacionado con una Issue.

No ejecutar acciones destructivas en GitHub salvo instrucción explícita.

---

## Specs

La spec activa define:

- Qué pantalla construir.
- Qué comportamiento implementar.
- Qué API consumir.
- Qué está fuera de alcance.

No añadir funcionalidades simplemente porque parezcan convenientes.

Si falta una decisión funcional importante, detener la implementación y solicitar aclaración.

---

## Verificación final

Antes de completar una tarea:

1. Comprobar TypeScript.
2. Ejecutar lint.
3. Ejecutar los tests relevantes.
4. Ejecutar build.
5. Comprobar responsive.
6. Comprobar accesibilidad básica.
7. Confirmar que no se amplió el alcance de la spec.
