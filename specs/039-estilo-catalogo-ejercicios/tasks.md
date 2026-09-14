# Tasks 039 - Aplicar sistema visual al catalogo de ejercicios

## SDD y alcance

- [x] Confirmar Issue #39, dependencias y restricciones del repositorio.
- [x] Confirmar la rama `feat/039-estilo-catalogo-ejercicios` desde #38.
- [x] Crear `spec.md`, `plan.md` y `tasks.md` con alcance ejecutable.

## Estructura y comportamiento

- [x] Convertir el encabezado del catalogo en una estructura semantica clara.
- [x] Hacer visible el contexto de la consulta aplicada sin cambiar el flujo de
  busqueda submit-driven.
- [x] Renderizar resultados como listado semantico de enlaces completos.
- [x] Conservar nombre, categoria, medida, identificador, estados y paginacion.

## Estilos y responsive

- [x] Aplicar la jerarquia visual de `DESIGN.md` al catalogo de ejercicios.
- [x] Ajustar superficies, reglas, hover, focus-visible y targets tactiles.
- [x] Resolver wrapping y apilado desde 320 px, tablet y escritorio sin overflow.

## Pruebas y verificacion

- [x] Cubrir fila, href, categoria, medida y contexto de busqueda observable.
- [x] Ejecutar `npm test` desde `frontend/`.
- [x] Ejecutar `npm run lint` desde `frontend/`.
- [x] Ejecutar `npm run build` desde `frontend/`.
- [x] Ejecutar `git diff --check`.
- [x] Revisar diff y confirmar que no cambian API, schemas, rutas ni dependencias.
