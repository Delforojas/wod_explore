# Spec 079 - Redisenar detalle de WOD orientado a ejecucion y rendimiento

## Estado

Planificada para `feat/079-redisenar-detalle-wod-rendimiento`.

## Fuente de verdad

La Issue #79 define el alcance funcional. `DESIGN.md` y el sistema visual de #76
definen la identidad: **El rendimiento es la interfaz**. `getWod` y
`wodDetailSchema` son la unica fuente valida para el detalle.

## Objetivo

Convertir `WodDetailPage` en una superficie operativa donde la persona entienda
la sesion, recorra sus ejercicios y encuentre rapidamente las acciones para
registrar resultados o gestionar favoritos.

## Alcance

- Reorganizar la composicion visual de `frontend/src/pages/WodDetailPage.tsx`.
- Dar prioridad al nombre, tipo, rondas, limite, nivel y cantidad de ejercicios.
- Presentar la secuencia de ejercicios como una lista densa con posicion, nombre,
  repeticiones y tipo de medicion disponibles en el contrato.
- Mantener `WodResultsPanel`, sus formularios, resultados y estados existentes.
- Mantener `WodFavoriteButton`, navegacion al catalogo, estados privados, carga y
  error sin cambiar contratos ni comportamiento.
- Reescribir unicamente estilos especificos del detalle de WOD en
  `frontend/src/index.css`.
- Mantener responsive desde 320 px, teclado, foco visible y HTML semantico.

## Fuera de alcance

- Cambiar `getWod`, `wodDetailSchema`, API, backend, base de datos o router.
- Inventar valores de peso, distancia, unidades o prescripciones ausentes del
  `WodExercise` estandar; solo se mostraran `reps` y `measurementType` reales.
- Redisenar `MyWodDetailPage`, `WodResultsPanel` como logica o cualquier otra
  pagina.
- Introducir dependencias, icon libraries, Tailwind o un sistema visual paralelo.

## Requisitos funcionales

### RF-1 - Comprension rapida

El primer bloque debe identificar el WOD, su formato, nivel, limite y rondas,
con la cantidad de ejercicios como dato operativo secundario. Los valores nulos
se expresan honestamente como "Sin limite", "Variable" o "Todos los niveles".

### RF-2 - Secuencia y prescripcion

Los ejercicios se leen en orden mediante una lista semantica. Cada fila prioriza
posicion y nombre, y muestra repeticiones cuando existen; si no existen,
comunica el tipo de medicion sin convertirlo en una metrica ficticia.

### RF-3 - Acciones y resultados

Favorito, registro de resultados, consulta de intentos y retorno al catalogo
permanecen visibles, diferenciados y utilizables. Los estados globales de carga,
privacidad, error, red y vacio se conservan.

### RF-4 - Responsive y accesibilidad

La pagina usa tokens existentes, superficies y divisores contenidos. Se adapta
desde 320 px sin overflow horizontal evitable, mantiene orden logico, labels,
enlaces reales, botones reales y foco visible.

## Criterios de aceptacion

1. La estructura del WOD puede comprenderse rapidamente.
2. Ejercicios, repeticiones y tipos de medicion tienen jerarquia clara.
3. Tipo, rondas, limite, nivel y cantidad de ejercicios son visibles.
4. Favorito, registro de resultados, intentos y retorno al catalogo siguen
   funcionando y estan diferenciados.
5. La interfaz sigue `DESIGN.md`, sin datos inventados ni cambios de contrato.
6. Funciona desde 320 px sin overflow horizontal evitable.
7. Teclado, foco, labels y nombres accesibles siguen siendo utilizables.
8. No hay regresiones funcionales.
9. `npm test`, `npm run lint` y `npm run build` pasan.

## Direction contract

**THESIS:** el detalle es una hoja de ejecucion, no una ficha editorial; la sesion y su siguiente accion aparecen primero.

**OWN-WORLD:** superficie oscura continua, divisores tecnicos, sans-serif, valores tabulares y naranja reservado a accion, foco y orientacion.

**STORY:** la persona identifica el WOD, lee la secuencia real, reconoce sus medidas y registra o revisa su rendimiento.

**FIRST VIEWPORT:** retorno arriba, encabezado compacto con nombre y acciones, tira de metricas y secuencia de ejercicios junto al panel de resultados.

**FORM:** manifiesto operativo de una columna principal y un aside funcional, que colapsa en orden de lectura en movil; no tarjetas decorativas.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Referencias

- `docs/constitution.md`
- `PRODUCT.md`
- `AGENTS.md`
- `frontend/AGENTS.md`
- `DESIGN.md`
- `frontend/src/pages/WodDetailPage.tsx`
- `frontend/src/pages/WodDetailPage.test.tsx`
- `frontend/src/components/WodResultsPanel.tsx`
- `frontend/src/components/WodFavoriteButton.tsx`
- `frontend/src/api/client.ts`
- `frontend/src/api/schemas.ts`
- `frontend/src/app/router.ts`
- `specs/076-redefinir-sistema-visual-global-shell-layout/spec.md`
- `specs/078-redisenar-catalogo-wods/spec.md`
