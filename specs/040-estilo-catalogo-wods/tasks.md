# Tasks 040 - Aplicar sistema visual al catalogo de WODs

## SDD y alcance

- [x] Confirmar Issue #40, dependencias y restricciones del repositorio.
- [x] Confirmar la rama `feat/040-estilo-catalogo-wods` desde #38.
- [x] Crear `spec.md`, `plan.md` y `tasks.md` con alcance ejecutable.

## Estructura y comportamiento

- [x] Convertir el encabezado del catalogo en una estructura semantica clara.
- [x] Hacer visible el contexto de filtros aplicados sin cambiar el flujo
  submit-driven.
- [x] Renderizar resultados como listado semantico de enlaces completos.
- [x] Conservar nombre, tipo, nivel, identificador, estados y paginacion.

## Estilos y responsive

- [x] Aplicar la jerarquia visual de `DESIGN.md` al catalogo de WODs.
- [x] Ajustar superficies, reglas, hover, focus-visible y targets tactiles.
- [x] Resolver wrapping y apilado desde 320 px, tablet y escritorio sin overflow.

## Pruebas y verificacion

- [x] Cubrir fila, href, tipo, nivel, contexto de filtros y paginacion observable.
- [x] Ejecutar `npm test` desde `frontend/`.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check`.
- [x] Revisar diff y confirmar que no cambian API, schemas, rutas ni dependencias.
