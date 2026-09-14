# Producto

<!-- impeccable:product-schema 1 -->

## Plataforma

web

## Usuarios

Practicantes individuales de CrossFit y coaches o boxes que necesitan consultar
WODs y ejercicios, encontrar entrenamientos adecuados y registrar o revisar
sesiones realizadas. Las funciones personales requieren una cuenta autenticada.

## Propósito del producto

WOD Explorer permite explorar WODs y ejercicios de CrossFit mediante una API,
buscar y filtrar entrenamientos, registrar resultados y consultar el historial,
las marcas personales y la evolución de una cuenta. El producto tiene éxito
cuando una persona puede encontrar un WOD, consultar su detalle, registrar su
resultado y volver a revisar esa información de forma sencilla.

## Posicionamiento

Es una aplicación web full stack que combina el descubrimiento de WODs y
ejercicios con el seguimiento personal del rendimiento. El frontend React
consume una API REST Spring Boot y MySQL es la persistencia principal.

## Contexto operativo

La aplicación se ejecuta como tres piezas coordinadas durante el desarrollo:

- Frontend React/Vite en el navegador, normalmente en el puerto `5173`.
- Backend Java 21/Spring Boot en el puerto `8080`, con rutas bajo `/api/**`.
- MySQL 8.4 mediante Docker Compose, con el puerto `3306` dentro de Docker y
  `3307` expuesto en el equipo local.

El registro (`POST /api/users`) y el login (`POST /api/auth/login`) son públicos.
Las consultas de catálogo, resultados, historial, estadísticas y evolución usan
la API y requieren el JWT de la sesión. El token se conserva únicamente en
`sessionStorage` durante la sesión del navegador.

## Capacidades y restricciones

- El idioma principal de la interfaz es español.
- La aplicación debe mantener una interfaz responsive y mobile-first.
- El frontend actual usa React, TypeScript, Vite, Zod, Vitest y CSS en
  `frontend/src/index.css`. No usa React Router, Testing Library ni declara
  Tailwind como dependencia en `frontend/package.json`.
- El backend actual usa Java 21, Spring Boot 3.5.5, Maven Wrapper, Spring Web,
  Spring Security, Spring Data JPA, Jakarta Validation, JWT y MySQL Connector/J.
- MySQL 8.4 es la persistencia principal para usuarios, WODs, ejercicios y
  resultados.
- Los JSON históricos pueden permanecer en el repositorio durante la transición,
  pero no son una fuente activa de verdad para las funcionalidades migradas.
- `localStorage` no almacena catálogo, resultados, historial ni estadísticas.
  Solo el JWT de sesión se mantiene temporalmente en `sessionStorage`.
- Favoritos no están disponibles en la arquitectura actual; su contrato está
  pendiente de una Issue específica.
- No existe todavía un endpoint `/api/health` ni un sistema de roles
  administrativos.
- No se añadirán dependencias sin una necesidad clara.
- TypeScript debe mantenerse en modo estricto y se debe evitar `any`.
- El frontend debe seguir pasando `npm test`, `npm run lint` y `npm run build`.
- El backend debe verificarse con `./mvnw validate`, `./mvnw test` y
  `./mvnw package` cuando corresponda.
- Los secretos se proporcionan mediante variables de entorno y no se incluyen
  en documentación ni archivos versionados.

## Compromisos de marca

El nombre del producto es WOD Explorer. Los textos visibles de la interfaz y la
documentación del proyecto deben mantenerse en español. No hay otros compromisos
de marca definidos por ahora.

## Fuente de verdad y evidencia

La fuente de verdad operativa se distribuye así:

- Catálogo de WODs y ejercicios: tablas MySQL consultadas por el backend y
  expuestas mediante `/api/wods` y `/api/exercises`.
- Usuarios y autenticación: backend, tabla `users` y JWT emitido por
  `/api/auth/login`.
- Resultados: tablas `wod_results` y `exercise_results`, consultadas mediante
  las rutas de resultados y los endpoints de usuario autenticado.
- Historial: `/api/users/me/history`.
- Estadísticas y evolución: `/api/users/me/statistics` y
  `/api/users/me/evolution`.
- Contratos del cliente: `frontend/src/api/schemas.ts` y
  `frontend/src/api/client.ts`.
- Vistas y navegación: `frontend/src/pages/`, `frontend/src/components/` y
  `frontend/src/app/router.ts`.

Los JSON históricos descritos por las Specs 001–004 documentan etapas anteriores
del producto local. Se conservan como referencia y no deben reintroducirse como
fuentes de verdad activas.

## Principios del producto

- Priorizar una exploración y un registro de entrenamientos simples y claros.
- Usar la API y MySQL como fuente única para las funcionalidades migradas.
- Preservar los flujos existentes al mejorar la interfaz.
- Mantener la experiencia usable en móvil, escritorio y teclado.
- Mantener separadas las responsabilidades de frontend, backend y persistencia.
- Evitar infraestructura, dependencias o cambios de negocio innecesarios.

## Accesibilidad e inclusión

La aplicación debe cumplir un nivel básico de accesibilidad WCAG mediante HTML
semántico, navegación completa por teclado, foco visible y labels accesibles.
Los mensajes de error deben ser comprensibles y los controles principales deben
seguir siendo utilizables en distintos tamaños de pantalla.
