# Tasks - Issue #22: Documentación del producto tras la migración a API

## SDD y preparación

- [x] Obtener y revisar la Issue #22 mediante GitHub MCP.
- [x] Leer constitución, documentación del producto, AGENTS aplicables, Specs
  relacionadas y configuración técnica.
- [x] Comprobar estado Git y crear `docs/022-product-documentation` desde la
  rama que contiene la Issue #21.
- [x] Crear `spec.md`, `plan.md` y `tasks.md` con contenido válido.

## Documentación principal

- [x] Actualizar `PRODUCT.md` con el estado full stack vigente.
- [x] Actualizar `README.md` con instalación, arranque, arquitectura, comandos,
  variables, puertos, rutas, endpoints y fuente de verdad.
- [x] Sustituir `frontend/README.md` por documentación del frontend real.

## Transición de Specs

- [x] Añadir nota de transición a `specs/001-wod-explorer/spec.md` sin alterar
  sus requisitos funcionales.
- [x] Añadir nota de transición a `specs/002-search-favorites/spec.md` sin
  alterar sus requisitos funcionales.
- [x] Añadir nota de transición a `specs/003-workout-history/spec.md` sin
  alterar sus requisitos funcionales.
- [x] Añadir nota de transición a `specs/004-frontend-redesign/spec.md` sin
  alterar sus requisitos funcionales.

## Revisión y cierre

- [x] Corregir referencias obsoletas a arquitectura local, React Router,
  Testing Library, Tailwind y datos persistidos en navegador cuando no
  correspondan.
- [x] Confirmar que favoritos quedan identificados como no disponibles.
- [x] Confirmar que la documentación no contiene secretos ni endpoints
  inexistentes.
- [x] Revisar `git diff` y `git status`, incluyendo exclusión explícita de
  cambios ajenos.
- [x] Ejecutar las verificaciones aplicables y documentar sus resultados.
- [ ] Crear el commit específico de la Issue #22 y conservar su hash.
- [ ] Documentar la Issue #22 con la rama, commit, verificaciones y estado
  posterior.
