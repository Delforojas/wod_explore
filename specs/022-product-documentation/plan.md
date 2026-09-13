# Plan - Issue #22: Documentación del producto tras la migración a API

## Enfoque

Actualizar la documentación existente directamente sobre la arquitectura real,
usando el código y los archivos de configuración como fuentes técnicas. El
contenido visible y la documentación se mantendrán en español. No se crearán
abstracciones ni archivos de configuración nuevos.

## Fases

1. Reemplazar en `PRODUCT.md` el posicionamiento local por el producto full stack
   actual, separando capacidades disponibles, pendientes y restricciones.
2. Reescribir el README raíz con instalación, arranque, comandos, variables,
   puertos, arquitectura, rutas frontend, endpoints REST y fuentes de verdad.
3. Reemplazar `frontend/README.md`, que todavía es el README generado por Vite,
   por una guía breve del frontend actual.
4. Añadir una sección de transición al final de las Specs 001, 002, 003 y 004.
   La sección explicará que esas Specs describen etapas históricas locales y que
   la arquitectura operativa actual está definida por la migración posterior.
5. Revisar referencias a React Router, Testing Library, Tailwind, JSON y
   `localStorage` para que solo se mencionen cuando correspondan al estado real.
6. Revisar todos los cambios para eliminar secretos, comandos inexistentes,
   endpoints inventados y afirmaciones contradictorias.

## Contenido operativo

La documentación describirá:

- Frontend: React 19, TypeScript, Vite, Zod, Vitest y CSS del proyecto.
- Backend: Java 21, Spring Boot 3.5.5, Maven Wrapper, Spring Web, Spring
  Security, Spring Data JPA, Validation, JWT y MySQL Connector/J.
- Persistencia: MySQL 8.4 mediante Docker Compose, base `wod_explorer`, servicio
  `mysql`, puerto local `3307` e interno `3306`.
- Backend: servicio HTTP en `8080`, datasource externo y `ddl-auto=none`.
- Cliente: `VITE_API_URL` con fallback `http://localhost:8080/api`.
- Sesión: JWT en `sessionStorage`, nunca en `localStorage`.
- Router: hash router propio, sin React Router.
- Tests frontend: Vitest, sin afirmar integración con Testing Library.

## Contrato documentado

Se incluirán los endpoints existentes agrupados por recurso:

- Públicos: `POST /api/users` y `POST /api/auth/login`.
- Usuario autenticado: `GET /api/users/me`, `/history`, `/statistics` y
  `/evolution`.
- Catálogo autenticado: `GET /api/wods`, `GET /api/wods/{id}`,
  `GET /api/exercises` y `GET /api/exercises/{id}`.
- Resultados autenticados: operaciones de WOD en
  `/api/wods/{wodId}/results` y de ejercicios en
  `/api/exercises/{exerciseId}/results`, incluyendo `/best`.
- Operaciones de escritura de ejercicios existentes en backend, pero no usadas
  por los flujos actuales del frontend.

No se documentará `/api/health` como disponible porque no existe en el backend
actual y su implementación está fuera del alcance de la Issue #22.

## Verificación

- Comprobar que cada comando documentado coincide con los scripts o wrappers
  existentes.
- Comprobar que cada ruta frontend coincide con `frontend/src/app/router.ts`.
- Comprobar que cada endpoint coincide con los controllers del backend y el
  cliente API del frontend.
- Buscar referencias obsoletas a "sin backend", "JSON local", "localStorage",
  React Router, Testing Library y Tailwind, y corregirlas según contexto.
- Buscar patrones de posibles secretos en los archivos modificados.
- Revisar `git diff` y `git status` antes del commit.
- Ejecutar las verificaciones de documentación aplicables, sin ejecutar builds o
  tests de código salvo que se necesiten como comprobación de no regresión.
